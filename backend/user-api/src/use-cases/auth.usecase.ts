import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnprocessableEntityException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';
import {
  AuthLoginDTO,
  AuthRefreshTokenDTO,
  AuthRegisterDTO,
  SocialSiteRegisterDTO,
  UserPresenter,
} from '@infrastructure/presentation/auth/auth.dto';
import { JwtService } from '@infrastructure/services/jwt/jwt.service';
import axios from 'axios';
import { User } from '@infrastructure/orm/entities/user.entity';
import { UserRole } from '@infrastructure/orm/entities/user.entity';
import { IUser } from '@domain/model/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ConsumerRepository } from '@infrastructure/orm/reposiories/consumer.repository';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import * as crypto from 'crypto';
import { BodyGramService } from '@infrastructure/services/body-gram/body-gram.service';
import UsecaseProxy, {
  BODY_MEASUREMENT_USE_CASE,
  QUESTIONNAIRE_USECASE_PROXY,
  USER_ANSWERS_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import { BodyMeasurementUsecase } from './body-measurement.usecase';
import { use } from 'passport';
import { QuestionnaireUsecase } from './questionnaire.usecase';
import { UserType } from '@infrastructure/orm/entities/questionnaire.entity';
import { UserAnswersUsecase } from './user-answers.usecase';
import { SignInMethods } from 'common/constants';
import { ConfigService } from '@nestjs/config';
import { getUserAgeAndType } from './common.usecase';

@Injectable()
export class AuthUsecase {
  private readonly iv = crypto.randomBytes(16);

  constructor(
    private readonly configService: ConfigService,
    private userRepository: UserRepository,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
    private consumerRepository: ConsumerRepository,
    private readonly mailgunService: MailGunService,
    private bodyGramService: BodyGramService,
    @Inject(BODY_MEASUREMENT_USE_CASE)
    private readonly bodyMeasurementUseCase: UsecaseProxy<BodyMeasurementUsecase>,
    @Inject(QUESTIONNAIRE_USECASE_PROXY)
    private readonly questionnaireUseCase: UsecaseProxy<QuestionnaireUsecase>,
    @Inject(USER_ANSWERS_USECASE_PROXY)
    private readonly userAnswersUseCase: UsecaseProxy<UserAnswersUsecase>,
  ) {}

  async login(payload: AuthLoginDTO) {
    let { email, password } = payload;
    email = email.toLowerCase();
    const accessToken = this.jwtService.createAccessToken({ email }, '30d');
    const refreshToken = this.jwtService.createRefreshToken({ email }, '30d');
    const expiresIn = this.jwtService.decodeToken(accessToken).expiryDate;
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User Not Found');
    if (user.is_brand)
      throw new UnprocessableEntityException(
        'This user is registered as brand therefore canot proceed',
      );

    const isPasswordMatch = await this.bcryptService.comparePassword(
      password,
      user?.password,
    );
    if (!isPasswordMatch)
      throw new UnauthorizedException('Email/Password is incorrect!');
    await this.userRepository.saveRefreshToken(user.id, refreshToken);

    const user_Influencer =
      await this.userRepository.findInfluncerByEmail(email);
    if (user_Influencer?.influencer) {
      const addConsumer = await this.consumerRepository.createIfNotExsist(
        user.id,
        {
          measurement: {
            id: user_Influencer.influencer?.measurement?.id,
          },
          user: {
            id: user.id,
          },
        },
      );
      await this.userRepository.updateUser(user.id, {
        is_consumer: true,
      });
    }

    if (!user.consumer) {
      await this.consumerRepository.createIfNotExsist(user.id, {
        user: {
          id: user.id,
        },
      });
    }
    const currentUser = await this.userRepository.findById(user.id);
    if (!currentUser) throw new NotFoundException('User not found');
    await this.updateUserAnswers(user, currentUser);
    const isScanned = await this.bodyMeasurementUseCase
      .getInstance()
      .isUserScanned(currentUser?.consumer?.measurement?.id || null);

    const { getUser, userType } = await getUserAgeAndType(
      this.userRepository,
      user.id,
    );

    if (!getUser) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'User not found' };
    }
    const isSurveyDone = await this.questionnaireUseCase
      .getInstance()
      .isSurveyDoneForCurrentUserType(getUser.id, userType);
    return {
      statusCode: HttpStatus.OK,
      isScanned,
      email,
      accessToken,
      refreshToken,
      expiresIn,
      isSurveyDone,
    };
  }
  async register(payload: AuthRegisterDTO, isRegisterSSOUser: Boolean = false) {
    const user = await this.userRepository.findByEmail(payload.email);
    if (user) {
      throw new ConflictException('User Already Exist');
    }
    // const { password, email, type, avatar, ...rest } = payload;
    const encryptedPassword = await this.bcryptService.encryptPassword(
      payload.password,
    );
    payload.password = encryptedPassword;
    const createdUser = await this.userRepository.create(payload);
    const accessToken = this.jwtService.createAccessToken(
      { email: createdUser['email'] },
      '30d',
    );
    const expiresIn = this.jwtService.decodeToken(accessToken).expiryDate;
    const refreshToken = this.jwtService.createRefreshToken(
      { email: createdUser['email'] },
      '30d',
    );
    await this.userRepository.saveRefreshToken(createdUser['id'], refreshToken);

    const token = await this.generateVerificationToken(createdUser['email']);

    await this.sendEmailVerificationToUser(
      createdUser['email'],
      token,
      createdUser['first_name'],
    );

    const latest_user = await this.userRepository.findByEmail(
      createdUser['email'],
    );

    return {
      accessToken,
      expiresIn,
      refreshToken,
      id: latest_user?.id,
    };
  }
  async validateUserForLocalStrategy(
    email: string,
  ): Promise<Partial<IUser> | null> {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      const { password, ...userWthPass }: Partial<User> = user;
      if (user) return userWthPass;
    }
    // if (user) return user
    return null;
  }

  async getSocialsSitesDate(payload: SocialSiteRegisterDTO) {
    console.log(payload.provider);
    switch (payload.provider) {
      case 'google':
        return await this.validateAndFetchGoogleData(payload.accessCode);
      default:
        throw new UnprocessableEntityException('Invalid provider...');
    }
  }

  async tanagenerateNewAccessToken(paylaod: AuthRefreshTokenDTO) {
    const validateRefreshToken = this.jwtService.validateRefreshToken(
      paylaod.refresh_token,
    );
    if (validateRefreshToken) {
      const email = validateRefreshToken.email;
      const accessToken = this.jwtService.createAccessToken({ email }, '30d');
      const expiresIn = this.jwtService.decodeToken(accessToken).expiryDate;
      const refreshToken = this.jwtService.createRefreshToken({ email }, '30d');
      return {
        statusCode: HttpStatus.OK,
        email,
        expiresIn,
        accessToken,
        refreshToken,
      };
    } else {
      throw new UnprocessableEntityException('Token Invalid');
    }
  }

  async refreshToken(refreshToken: string) {
    const decodedToken = JSON.parse(atob(refreshToken.split('.')[1]));

    console.log('Decoded token is ::: ', decodedToken);
    const user = await this.userRepository.findByEmail(decodedToken?.email);

    if (!user) {
      throw new UnauthorizedException('Invalid token User not found');
    }
    const isRefreshTokenMatch = await this.bcryptService.compareRefreshToken(
      refreshToken,
      user?.refresh_token,
    );
    if (!isRefreshTokenMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = this.jwtService.createAccessToken(
      { email: user.email },
      '1d',
    );
    const newRefreshToken = this.jwtService.createRefreshToken(
      { email: user.email },
      '7d',
    );
    const expiresIn = this.jwtService.decodeToken(newAccessToken).expiryDate;
    await this.userRepository.saveRefreshToken(user.id, newRefreshToken);

    const user_Influencer = await this.userRepository.findInfluncerByEmail(
      user.email,
    );
    if (user_Influencer?.influencer) {
      const addConsumer = await this.consumerRepository.createIfNotExsist(
        user.id,
        {
          measurement: {
            id: user_Influencer.influencer?.measurement?.id,
          },
          user: {
            id: user.id,
          },
        },
      );
      await this.userRepository.updateUser(user.id, {
        is_consumer: true,
      });
    }

    const consumerUser = await this.userRepository.findByEmail(
      decodedToken?.email,
    );

    if (!consumerUser) {
      throw new NotFoundException('Consumer not found');
    }

    await this.updateUserAnswers(user, consumerUser);

    const isScanned = await this.bodyMeasurementUseCase
      .getInstance()
      .isUserScanned(consumerUser?.consumer?.measurement?.id || null);

    const { getUser, userType } = await getUserAgeAndType(
      this.userRepository,
      user.id,
    );

    if (!getUser) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'User not found' };
    }
    const isSurveyDone = await this.questionnaireUseCase
      .getInstance()
      .isSurveyDoneForCurrentUserType(getUser.id, userType);
    return {
      statusCode: HttpStatus.OK,
      isScanned,
      email: user.email,
      accessToken: newAccessToken,
      expiresIn,
      refreshToken: newRefreshToken,
      isSurveyDone,
    };
  }

  async validateAndFetchGoogleData(access_token) {
    let googleUserData;
    try {
      const response = await axios.get(
        `${this.configService.get('googleConfig').googleVerifyUrl}?access_token=${access_token}`,
      );
      googleUserData = response.data;
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired Google access token.',
      );
    }
    const email = googleUserData.email;
    const user = await this.userRepository.findByEmail(email);
    if (user?.brand) {
      throw new UnprocessableEntityException(
        'This user is already registered as a brand and cannot proceed with consumer or influencer login/signup.',
      );
    }

    const userObj = {
      email: googleUserData.email,
      password: access_token,
      first_name:
        googleUserData.given_name ?? googleUserData.email.split('@')[0],
      last_name: googleUserData.family_name ?? '',
      sign_in_method: SignInMethods.GOOGLE,
      is_consumer: true,
      ...(googleUserData.picture && { avatar: googleUserData.picture }),
    };
    let newUser = {};
    if (!user) {
      newUser = await this.userRepository.create(userObj);
    }
    const accessToken = this.jwtService.createAccessToken({ email }, '30d');
    const refreshToken = this.jwtService.createRefreshToken({ email }, '30d');
    const expiresIn = this.jwtService.decodeToken(accessToken).expiryDate;
    const userId = user?.id ?? newUser['id'];

    await this.userRepository.saveRefreshToken(userId, refreshToken);

    const user_Influencer =
      await this.userRepository.findInfluncerByEmail(email);
    if (user_Influencer?.influencer) {
      const addConsumer = await this.consumerRepository.createIfNotExsist(
        userId,
        {
          measurement: {
            id: user_Influencer.influencer?.measurement?.id,
          },
          user: {
            id: userId,
          },
        },
      );
      await this.userRepository.updateUser(userId, {
        is_consumer: true,
      });
    }
    const res = await this.consumerRepository.createIfNotExsist(userId, {
      user: {
        id: userId,
      },
      ...(googleUserData.picture && { avatar: googleUserData.picture }),
    });

    let isScanned = false;
    if (user?.id) {
      if (!user.consumer) {
        const currentUser = await this.userRepository.findById(user.id);
        if (!currentUser) throw new NotFoundException('User not found');
        await this.updateUserAnswers(user, currentUser);
      }
      isScanned = await this.bodyMeasurementUseCase
        .getInstance()
        .isUserScanned(user?.influencer?.measurement?.id || null);
    }
    isScanned = await this.bodyMeasurementUseCase
      .getInstance()
      .isUserScanned(user?.consumer?.measurement?.id || null);

    const { getUser, userType } = await getUserAgeAndType(
      this.userRepository,
      userId,
    );

    if (!getUser) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'User not found' };
    }
    const isSurveyDone = await this.questionnaireUseCase
      .getInstance()
      .isSurveyDoneForCurrentUserType(getUser.id, userType);
    return {
      statusCode: HttpStatus.OK,
      isScanned,
      isSurveyDone,
      user: user ? user : newUser,
      token: accessToken,
      expiresIn,
      refreshToken: refreshToken,
    };
  }

  async sendEmailVerificationToUser(email, token, first_name) {
    const verificationLink = `https://ubu.live/email/verify?token=${token}`;
    const emailBody = `
          <div style="background-color: #fff; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 10px;">
            <div style="text-align: center; padding: 10px 0; background-color: #000;">
              <h1 style="color: white; font-family: 'Classy Vogue'; font-size: 36px; margin: 0;">
                UBU
              </h1>
            </div>
            <div style="padding: 20px;">
              
    
              <div class="section-parent">
                <div class="section">
                    <h3 class="verify-your-email">Verify Your Email Address</h3>
                </div>
                <div class="hi-recipients-name-container">
                    <p class="hi-recipients-name">Hi ${first_name},</p>
                    <p class="hi-recipients-name">&nbsp;</p>
                    <p class="hi-recipients-name">Welcome to UBU! We're excited to have you on board.</p>
                    <p class="hi-recipients-name">To complete your registration, please verify your email address by clicking the button below:</p>
                </div>
                <div class="group-wrapper">
                    <div class="frame-wrapper">
                        <div class="frame-container">
                            <div class="button-wrapper">
                              <div style="text-align: center; margin: 20px 0;">
                                <a href="${verificationLink}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email Address</a>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="if-the-button-container">
                    <p class="hi-recipients-name">If the button doesn't work, please copy and paste this link into your browser:</p>
                    <p class="hi-recipients-name">
                        <span class="blank-line1">&nbsp;</span>
                        <span class="httpsubucomverifytokena1">${verificationLink}
                        </span>
                        <span>
                            If you didn't create an account with UBU, you can safely ignore this email.</span>
                    </p>
                    <p class="hi-recipients-name">
                        Thank you for choosing UBU!</p>
                    <p class="hi-recipients-name">&nbsp;</p>
                    <p class="hi-recipients-name">Best regards,</p>
                    <p class="hi-recipients-name">The UBU Team</p>
                </div>
              </div>
    
            </div>
            <div style="text-align: center; margin-top: 4%;
              font-size: 14px; color: rgba(0, 0, 0, 0.7); font-family: Poppins;">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 10px;">
                <img class="tiktok-icon" alt="" src="tiktok.png">
                <img class="tiktok-icon" alt="" src="facebook.png">
                <img class="tiktok-icon" alt="" src="instagram.png">
              </div>
              <div style="font-size: 16px; font-weight: 500; color: #000;">UBU Corporation</div>
              <div style="margin-bottom: 4%;">You are receiving this email because you opted in via our website.</div>
            </div>
    
            <div style="text-align: center; padding: 10px 0; background-color: #000;">
              <h1 style="color: white; font-family: 'Classy Vogue'; font-size: 36px; margin: 0;">
                UBU
              </h1>
            </div>
          </div>
        `;
    try {
      const sentEmail = await this.mailgunService.sendEmail(
        email,
        'Verify Your Email Address',
        emailBody,
        true,
      );
    } catch (error) {
      console.error('Error in sendEmailVerificationToUser:', error);
      return error.response;
    }
  }

  async generateVerificationToken(email: string) {
    const payload = JSON.stringify({ email, timestamp: Date.now() });
    const secretKey = process.env.CRYPTO_SECRET_KEY;
    if (!secretKey) {
      throw new NotFoundException('Secrect Key not found');
    }
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(secretKey, 'base64'),
      this.iv,
    );
    let encrypted = cipher.update(payload, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${this.iv.toString('hex')}:${encrypted}`;
  }

  async decryptVerificationToken(token: string) {
    try {
      const secretKey = process.env.CRYPTO_SECRET_KEY;
      if (!secretKey) {
        throw new NotFoundException('Secrect Key not found');
      }
      const [ivHex, encrypted] = token.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(secretKey, 'base64'),
        iv,
      );
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return JSON.parse(decrypted);
    } catch (err) {
      return null;
    }
  }

  async verifyEmail(encrypted_token: string): Promise<string> {
    const token = decodeURIComponent(encrypted_token);
    const decrypted = await this.decryptVerificationToken(token);

    if (!decrypted) {
      throw new BadRequestException('Invalid or expired verification link');
    }

    const { email, timestamp } = decrypted;

    // Ensure the token isn't expired (e.g., 24 hours)
    // const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    // if (Date.now() - timestamp > expirationTime) {
    //   throw new BadRequestException('Verification link has expired');
    // }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(
        'User of given email not found. Please try to signup again.',
      );
    }

    if (user.email_verified) {
      return 'Email Already verified. Please continue to Login.';
    } else {
      user.email_verified = true;
      await this.userRepository.save(user);
    }

    // Simulate updating the user's email verification status
    console.log(`Email verified for: ${email}`);
    return 'Email successfully verified!';
  }

  async resendEmail(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.generateVerificationToken(user.email);

    await this.sendEmailVerificationToUser(user.email, token, user.first_name);
    return 'The verification email has been resent successfully.';
  }

  async getBodyGramKeys() {
    return await this.bodyGramService.getBodyGramKeys();
  }

  async updateUserAnswers(oldUser: User, latestUser: User) {
    const influencerAnswers = await this.questionnaireUseCase
      .getInstance()
      .findAllQuestionnairesWithAnswersForUser(oldUser.id, UserType.INFLUENCER);

    if (influencerAnswers.length && !oldUser.is_consumer) {
      const mappedData = influencerAnswers
        .filter((item) => item.user_answer[0]?.selected_options.length > 0)
        .map((item) => {
          return {
            srNo: item.sr_no,
            selected_options: item.user_answer[0]?.selected_options,
            questionId: item.id,
          };
        });

      await this.userAnswersUseCase
        .getInstance()
        .handleUserAnswers(mappedData, latestUser);
    }
  }
}
