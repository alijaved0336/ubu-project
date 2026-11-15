import { BadRequestException, ConflictException, HttpStatus, Inject, Logger, NotFoundException, UnauthorizedException, UploadedFile } from '@nestjs/common';
import { IUser } from '@domain/model/user.interface';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';
import { AuthLoginDTO, AuthRegisterDTO, AuthSignUpDTO, GoogleTokenDto } from '@infrastructure/presentation/auth/auth.dto';
import { JwtService } from '@infrastructure/services/jwt/jwt.service';
import { User, UserRole } from '@infrastructure/orm/entities/user.entity';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { UserAnswerRepository } from '@infrastructure/orm/reposiories/user-answer.repository';
import { SocialIntegrationRepository } from '@infrastructure/orm/reposiories/social-integration.repository';
import { SocialIntegration } from '@infrastructure/orm/entities/social-integration.entity';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { UBUSubscriptionRepository } from '@infrastructure/orm/reposiories/ubu-subscription.repository';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import * as crypto from 'crypto';
import { SignInMethods, STYLE_QUESTIONS_SR_NO } from '@infrastructure/utils/constant';

import * as jwt from 'jsonwebtoken';
import { URLSearchParams } from 'url';
import { CampaignDisputeUseCase } from './campaign-dispute.usecase';
import UsecaseProxy, { CAMPAIGN_DISPUTE_USECASE_PROXY, SESSION_LOG_ENTRY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { SessionLogUseCase } from './sessionlog.usecase';
import { USER_ANSWERS_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { BODY_MEASUREMENT_USE_CASE, QUESTIONNAIRE_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { UserAnswersUsecase } from './user-answers.usecase';
import { BodyMeasurementUsecase } from './body-measurement.usecase';
import { QuestionnaireUsecase } from './questionnaire.usecase';
import { UserType } from '@infrastructure/orm/entities/questionnaire.entity';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';

export class AuthUsecase {
  private readonly iv = crypto.randomBytes(16);
  privateKey: string;
  private clientId = process.env.APPLE_CLIENT_ID;
  private teamId = process.env.APPLE_TEAM_ID;
  private keyId = process.env.APPLE_KEY_ID;
  constructor(
    private userRepository: UserRepository,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
    private notificationRepository: NotificationRepository,
    private readonly influencerRepository: InfluencerRepository,
    private readonly brandRepository: BrandRepository,
    private awsService: AwsS3Service,
    private userAnswerRepository: UserAnswerRepository,
    private socialIntegrationRepository: SocialIntegrationRepository,
    private readonly configService: ConfigService,
    private ubuSubscriptionRepository: UBUSubscriptionRepository,
    private readonly mailgunService: MailGunService,
    @Inject(CAMPAIGN_DISPUTE_USECASE_PROXY)
    private readonly campaignDisputeUseCase: UsecaseProxy<CampaignDisputeUseCase>,
    @Inject(SESSION_LOG_ENTRY)
    private readonly sessionLogUseCase: UsecaseProxy<SessionLogUseCase>,
    @Inject(USER_ANSWERS_USECASE_PROXY)
    private readonly userAnswersUseCase: UsecaseProxy<UserAnswersUsecase>,
    @Inject(BODY_MEASUREMENT_USE_CASE)
    private readonly bodyMeasurementUseCase: UsecaseProxy<BodyMeasurementUsecase>,
    @Inject(QUESTIONNAIRE_USECASE_PROXY)
    private readonly questionnaireUseCase: UsecaseProxy<QuestionnaireUsecase>,
  ) {
    const privateKeyBase64 = process.env.APPLE_PRIVATE_KEY;

    if (!privateKeyBase64) {
      throw new Error('APPLE_PRIVATE_KEY is not defined in environment variables.');
    }
    this.privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf8');
  }

  async isMinor(dob: Date) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 18;
  }

  async login(payload: AuthLoginDTO, requestFrom: string) {
    let { email } = payload;
    const { password } = payload;
    email = email.toLowerCase();

    let user = await this.userRepository.findByEmail(email);
    if (user?.is_brand && requestFrom === 'iosApplication') {
      throw new BadRequestException('This email is associated with a brand account, which is not permitted to log in via the mobile application.');
    }

    if (!user || user.is_deleted) throw new NotFoundException('User Not Found');

    const isPasswordMatch = await this.bcryptService.comparePassword(password, user?.password);
    if (!isPasswordMatch) throw new UnauthorizedException('Email/Password is incorrect!');

    const accessToken = this.jwtService.createAccessToken({ email }, '1d');
    const refreshToken = this.jwtService.createRefreshToken({ email }, '15d');
    const expiresIn = this.jwtService.decodeToken(accessToken)?.expiryDate;

    if (user?.influencer || user?.brand) {
      await this.campaignDisputeUseCase.getInstance().checkDisputeEligibility(user);
    }

    if (requestFrom === 'iosApplication') {
      if (!user.is_influencer) {
        await this.influencerRepository.create({ user: { id: user.id } });
        await this.userRepository.update(user.id, { is_influencer: true });
      }
    }

    await this.userRepository.saveRefreshToken(user.id, refreshToken);

    const user_consumer = await this.userRepository.findConsumerByEmail(email);
    if (user_consumer?.consumer) {
      const addInfluencer = await this.influencerRepository.createIfNotExsist(user.id, {
        measurement: { id: user_consumer.consumer?.measurement?.id },
        user: { id: user.id },
      });
      if (addInfluencer) {
        await this.userRepository.update(user.id, { is_influencer: true });
      }
      await this.updateUserAnswers(user_consumer);
    }

    user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User Not Found');

    const sessionLog = payload?.sessionLog;
    if (sessionLog) {
      sessionLog['user_id'] = user?.id;
      this.sessionLogUseCase.getInstance().create(sessionLog);
    }

    const isScanned = await this.bodyMeasurementUseCase.getInstance().isUserScanned(user?.influencer?.measurement?.id || null);
    const subscriptionInfo = await this.ubuSubscriptionRepository.getUserSubscriptionsInfo(user.id);
    const isSubscribed = subscriptionInfo.length > 0;

    if (user.is_brand) {
      user['type'] = UserRole.BRAND;
    } else if (user.is_influencer) {
      user['type'] = UserRole.INFLUENCER;
    } else if (user.is_consumer) {
      user['type'] = UserRole.CONSUMER;
    } else {
      user['type'] = false;
    }

    let userType: UserType = UserType.BRAND;
    if (user.is_influencer) {
      userType = (await this.isMinor(user.dob)) ? UserType.MINORINFLUENCER : UserType.INFLUENCER;
    } else if (user.is_brand) {
      userType = UserType.BRAND;
    } else {
      userType = UserType.INFLUENCER;
    }

    const isQuestionnaireComplete = await this.questionnaireUseCase.getInstance().isSurveyDoneForCurrentUserType(user.id, userType);
    user['is_questionnaire_completed'] = isQuestionnaireComplete;

    const basePayload = {
      email,
      accessToken,
      refreshToken,
      expiresIn,
      isScanned,
      isSubscribed,
      subscriptionInfo,
      id: user?.id,
      isAdmin: user.is_admin,
      isInfluencer: user.is_influencer,
      isConsumer: user.is_consumer,
      isBrand: user.is_brand,
      type: user['type'],
      emailVerified: user.email_verified,
    };

    if (!isQuestionnaireComplete) {
      return {
        ...basePayload,
        isSurveyDone: false,
        msg: 'route to sign up journey',
      };
    }

    return {
      ...basePayload,
      isSurveyDone: true,
      msg: 'route to dashboard',
    };
  }

  async generateRefreshToken(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const refreshToken = this.jwtService.createRefreshToken({ email }, '15d');
    await this.userRepository.saveRefreshToken(user.id, refreshToken);
    return refreshToken;
  }

  async refreshToken(refreshToken: string) {
    const decodedToken = JSON.parse(atob(refreshToken.split('.')[1]));

    console.log('Decoded token is ::: ', decodedToken);
    let user = await this.userRepository.findByEmail(decodedToken?.email);

    if (!user) {
      return 'Invalid token User Not found';
    }
    const isRefreshTokenMatch = await this.bcryptService.compareRefreshToken(refreshToken, user?.refresh_token);
    if (!isRefreshTokenMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = this.jwtService.createAccessToken({ email: user.email }, '1d');
    const newRefreshToken = this.jwtService.createRefreshToken({ email: user.email }, '15d');

    const expiresIn = this.jwtService.decodeToken(newAccessToken).expiryDate;
    await this.userRepository.saveRefreshToken(user.id, newRefreshToken);

    const user_consumer = await this.userRepository.findConsumerByEmail(user.email);
    if (user_consumer?.consumer) {
      const addInfluncer = await this.influencerRepository.createIfNotExsist(user.id, {
        measurement: {
          id: user_consumer.consumer?.measurement?.id,
        },
        user: {
          id: user.id,
        },
      });
      await this.userRepository.update(user.id, {
        is_influencer: true,
      });
    }

    const influencerUser = await this.userRepository.findByEmail(decodedToken?.email);

    const consumerAnswers = await this.questionnaireUseCase.getInstance().findAllQuestionnairesWithAnswersForUser(user.id, UserType.CONSUMER);

    if (consumerAnswers.length && !user.is_influencer) {
      const mappedData = consumerAnswers.reduce((acc, item, index) => {
        if (!item.user_answer[0]?.selected_options.length) {
          return acc;
        }
        acc[index] = {
          srNo: item.sr_no,
          answer: item.user_answer[0]?.selected_options,
          questionId: item.id,
        };
        return acc;
      }, {});

      console.log('mappedData: ', mappedData);
      await this.userAnswersUseCase.getInstance().handleUserAnswers(mappedData, influencerUser);
    }
    const isScanned = await this.bodyMeasurementUseCase.getInstance().isUserScanned(influencerUser?.influencer?.measurement?.id || null);

    const subscriptionInfo = await this.ubuSubscriptionRepository.getUserSubscriptionsInfo(user.id);
    let isSubscribed = false;
    if (subscriptionInfo.length) {
      isSubscribed = true;
    }

    user = await this.userRepository.findByEmail(decodedToken?.email);
    if (!user) {
      return 'Invalid token User Not found';
    }
    if (user.is_brand) {
      user['type'] = UserRole.BRAND;
    } else if (user.is_influencer) {
      user['type'] = UserRole.INFLUENCER;
    } else if (user.is_consumer) {
      user['type'] = UserRole.CONSUMER;
    } else {
      user['type'] = false;
    }

    let userType: UserType = UserType.BRAND;
    if (user.is_influencer) {
      userType = (await this.isMinor(user.dob)) ? UserType.MINORINFLUENCER : UserType.INFLUENCER;
    } else if (user.is_brand) {
      userType = UserType.BRAND;
    } else {
      userType = UserType.INFLUENCER;
    }

    const isQuestionnaireComplete = await this.questionnaireUseCase.getInstance().isSurveyDoneForCurrentUserType(user.id, userType);
    user['is_questionnaire_completed'] = isQuestionnaireComplete;
    if (!isQuestionnaireComplete) {
      return {
        id: user.id,
        email: user.email,
        accessToken: newAccessToken,
        refreshToken,
        isScanned,
        expiresIn,
        isSurveyDone: isQuestionnaireComplete,
        isSubscribed,
        subscriptionInfo,
        isAdmin: user.is_admin,
        isInfluencer: user.is_influencer,
        isBrand: user.is_brand,
        isConsumer: user.is_consumer,
        msg: 'route to sign up journey',
        type: user['type'],
        emailVerified: user.email_verified,
      };
    }

    return {
      id: user.id,
      email: user.email,
      accessToken: newAccessToken,
      refreshToken,
      expiresIn,
      isScanned,
      subscriptionInfo,
      isSubscribed,
      isAdmin: user.is_admin,
      isSurveyDone: true,
      isInfluencer: user.is_influencer,
      isBrand: user.is_brand,
      isConsumer: user.is_consumer,
      msg: 'route to dashboard',
      type: user['type'],
      emailVerified: user.email_verified,
    };
  }

  async getAnswerByQuestionId(data, srNO) {
    for (const key in data) {
      if (data[key].srNo === srNO) {
        return data[key].answer[0];
      }
    }
    return null; // Return null if questionId is not found
  }

  async updateUser(payload: Partial<AuthRegisterDTO>, @UploadedFile() file) {
    let newInfluencer, newBrand, s3Response;
    const {
      // type,
      influencer,
      brand,
      additionalFields,
      influencerAdditionalDto,
      instagram_creds,
      ...rest
    } = payload;
    let user = await this.userRepository.findByEmail(payload.email!);

    if (!user) throw new NotFoundException('User not found');
    if (file) {
      s3Response = await this.awsService.uploadFile(file, 'avatars');
    }

    const newUser = await this.userRepository.update(user.id, {
      is_questionnaire_completed: true,
      // type: type,
      ...rest,
    });

    console.log('DATA---', rest);
    if (influencer && instagram_creds?.accessToken) {
      influencer.instagram_handle = await this.fetchInstaUserName(instagram_creds);
    }
    // newInfluencer.instagram_creds = "323232"
    //  = await this.fetchUserName(instagram_creds)

    user = await this.userRepository.findById(user.id);
    if (!user) throw new NotFoundException('User not found');

    if (payload['is_influencer'] && influencer) {
      const filteredSRNos: number[] = [];
      console.log('influencerAdditionalDto', influencerAdditionalDto);
      for (const [, answerValue] of Object.entries(influencerAdditionalDto as Record<string, any>)) {
        if (STYLE_QUESTIONS_SR_NO.includes(Number(answerValue.srNo))) {
          filteredSRNos.push(Number(answerValue.srNo));
        }
      }

      const styleSrNoNotAnswered = STYLE_QUESTIONS_SR_NO.filter((srNo) => !filteredSRNos.includes(srNo));

      if (filteredSRNos.length > 0) {
        const questionsForStyles = await this.questionnaireUseCase.getInstance().findQuestionnairesBasedOnSrNo(styleSrNoNotAnswered);

        await Promise.all(
          questionsForStyles.map(async (question) => {
            await this.userAnswersUseCase.getInstance().deleteSpecificUserAnswer(user.id, question.id);
          }),
        );
      }

      this.userAnswersUseCase.getInstance().handleUserAnswers(influencerAdditionalDto, user);
      const getInfluencer = await this.influencerRepository.findByUserId(user.id);
      if (getInfluencer) {
        await this.influencerRepository.updateById(getInfluencer.id, {
          avatar: s3Response ? s3Response.Location : getInfluencer.avatar ? getInfluencer.avatar : null,
          ...influencer,
        });
      } else {
        newInfluencer = await this.influencerRepository.create({
          avatar: s3Response ? s3Response.Location : null,
        });

        user.influencer = newInfluencer;
        // user.type = type;
      }
      user.is_influencer = true;
      user.is_admin = true;
    }
    if (payload['is_brand'] && brand) {
      await this.userAnswersUseCase.getInstance().handleUserAnswers(additionalFields, user);
      newBrand = await this.brandRepository.create({
        brand_name: brand.companyName,
        ...brand,
      });
      user.brand = newBrand;
      // user.type = type;
      user.is_brand = true;
    }
    if (payload.instagram_creds) {
      const result = await this.saveInstaTokenToUser(payload.instagram_creds, user.id);
    }
    await this.userRepository.save(user);
    user['msg'] = 'route to dashboard';

    const roleMapping: Record<string, UserRole> = {
      is_brand: UserRole.BRAND,
      is_influencer: UserRole.INFLUENCER,
      is_consumer: UserRole.CONSUMER,
    };

    user['type'] = Object.entries(roleMapping).find(([key]) => user[key])?.[1] || false;
    user['is_scanned'] = await this.bodyMeasurementUseCase.getInstance().isUserScanned(user?.influencer?.measurement?.id || null);

    const isSurveyDone = await this.questionnaireUseCase.getInstance().isSurveyDoneForCurrentUserType(user.id, UserType.CONSUMER);
    if (isSurveyDone) {
      await this.influencerRepository.similarQuestionerConsumersSendNotifications(user, user.id);
    }

    return user;
  }

  async validateUserForLocalStrategy(email: string): Promise<Partial<IUser> | null> {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      const { password, ...userWthPswd } = user;
      return userWthPswd;
    }
    return null;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne(email);
    return !!user;
  }

  async saveInstaTokenToUser(tokenData, user_id) {
    const userRecord = await this.userRepository.findById(user_id);
    if (userRecord) {
      const socialIntegration: Partial<SocialIntegration> = {
        user: userRecord,
        social_platform_name: 'Instagram',
        access_token: tokenData['accessToken'],
        token_last_updated: new Date(),
        social_user_id: tokenData['socialUserId'],
      };
      const integrationRecord = await this.socialIntegrationRepository.findByPlatformNameAndUserId('Instagram', user_id);
      let result;
      if (integrationRecord) {
        result = await this.socialIntegrationRepository.update(integrationRecord.id, socialIntegration);
      } else {
        result = await this.socialIntegrationRepository.create(socialIntegration);
      }
      return { result: result };
    } else {
      throw new NotFoundException(`Failed to get User`);
    }
  }

  async validateUserForGoogleStrategy(payload: GoogleTokenDto, requestFrom: string) {
    try {
      const { access_token } = payload;

      const userInfoResponse = await axios.get(`${this.configService.get('googleConfig').googleVerifyUrl}?access_token=${access_token}`);
      const hashedPasswordForGoogle = await this.bcryptService.encryptPassword(access_token);
      const user = userInfoResponse.data;
      const email = user.email;
      const response = await this.registerUser(
        {
          email: user.email,
          first_name: user.given_name ?? user.email.split('@')[0],
          last_name: user.family_name ?? '',
          ...(user.picture && { avatar: user.picture }),
          password: hashedPasswordForGoogle,
          recaptchaToken: 'true',
        },
        SignInMethods.GOOGLE,
        requestFrom,
        true,
      );
      const accessToken = this.jwtService.createAccessToken({ email }, '1d');
      const expiresIn = this.jwtService.decodeToken(accessToken).expiryDate;
      const refreshToken = this.jwtService.createRefreshToken({ email }, '15d');

      let userInfo = response[1];
      await this.userRepository.saveRefreshToken(userInfo.id, refreshToken);
      const sessionLog = payload?.sessionLog;
      if (sessionLog) {
        sessionLog['user_id'] = userInfo?.id;
        this.sessionLogUseCase.getInstance().create(sessionLog);
      }
      const user_consumer = await this.userRepository.findConsumerByEmail(email);
      if (user_consumer?.consumer) {
        const addInfluncer = await this.influencerRepository.createIfNotExsist(userInfo.id, {
          measurement: {
            id: user_consumer?.consumer?.measurement?.id,
          },
          user: {
            id: userInfo.id,
          },
        });
        await this.updateUserAnswers(user_consumer);

        const latestUser = await this.userRepository.findById(userInfo.id);
        userInfo = await this.giveUserResponse(latestUser);
      }

      const currentUser = await this.userRepository.findById(userInfo.id);
      const isScanned = await this.bodyMeasurementUseCase.getInstance().isUserScanned(currentUser?.influencer?.measurement?.id || null);

      const subscriptionInfo = await this.ubuSubscriptionRepository.getUserSubscriptionsInfo(userInfo.id);

      let isSubscribed = false;
      if (subscriptionInfo.length) {
        isSubscribed = true;
      }

      let userType: UserType = UserType.BRAND;
      if (user.is_influencer) {
        userType = (await this.isMinor(user.dob)) ? UserType.MINORINFLUENCER : UserType.INFLUENCER;
      } else if (user.is_brand) {
        userType = UserType.BRAND;
      } else {
        userType = UserType.INFLUENCER;
      }

      const isQuestionnaireComplete = await this.questionnaireUseCase.getInstance().isSurveyDoneForCurrentUserType(user.id, userType);

      if (!isQuestionnaireComplete) {
        return {
          id: userInfo?.id,
          email,
          expiresIn,
          accessToken,
          refreshToken,
          isScanned,
          isSurveyDone: false,
          isSubscribed,
          isBrand: userInfo.isBrand,
          isInfluencer: userInfo.isInfluencer,
          isConsumer: userInfo.isConsumer,
          subscriptionInfo,
          msg: response[0],
          user: userInfo,
          isAdmin: userInfo['isAdmin'],
          emailVerified: userInfo.emailVerified,
          type: userInfo['type'],
        };
      }
      return {
        id: userInfo?.id,
        email,
        accessToken,
        expiresIn,
        refreshToken,
        isScanned,
        isSurveyDone: true,
        isSubscribed,
        isBrand: userInfo.isBrand,
        isInfluencer: userInfo.isInfluencer,
        isConsumer: userInfo.isConsumer,
        emailVerified: userInfo.emailVerified,
        subscriptionInfo,
        msg: response[0],
        user: userInfo,
        isAdmin: userInfo['isAdmin'],
        type: userInfo['type'],
      };
    } catch (e) {
      console.log('Errororrrr is ::::: ', e);
      if (e.status && e.status == HttpStatus.BAD_REQUEST) {
        throw new BadRequestException(e.message || 'Something went wrong');
      } else if (e.status && e.status == HttpStatus.UNAUTHORIZED) {
        throw new UnauthorizedException('Invalid or expired Google access token.');
      } else {
        throw new Error(e);
      }
    }
  }

  async registerUser(payload: AuthSignUpDTO, signInMethod: SignInMethods, requestFrom: string, isRegisterSSOUser: boolean = false) {
    try {
      const { isTestMode = false, avatar, ...rest } = payload;
      // Step 1: Validate reCAPTCHA if not an SSO user
      if (!isRegisterSSOUser && requestFrom === 'webApplication' && !isTestMode) {
        const isValidCaptcha = await this.validateRecaptcha(payload.recaptchaToken);
        if (!isValidCaptcha) {
          throw new ConflictException('Invalid reCAPTCHA verification.');
        }
      }

      // Step 2: Check if the user already exists

      let existingUser;

      if (signInMethod == 'apple') {
        existingUser = await this.userRepository.findByEmailOrAppleIdentifier(payload.email, payload?.apple_identifier);
      } else {
        existingUser = await this.userRepository.findByEmail(payload.email);
      }

      if (existingUser) {
        if (existingUser?.is_brand && requestFrom === 'iosApplication') {
          throw new BadRequestException('This email is associated with a brand account, which is not permitted to log in via the mobile application.');
        }
        Logger.log('User already exists');
        if (isRegisterSSOUser) {
          const userResponse = await this.giveUserResponse(existingUser);

          let userType: UserType = UserType.BRAND;
          if (existingUser.is_influencer) {
            userType = (await this.isMinor(existingUser.dob)) ? UserType.MINORINFLUENCER : UserType.INFLUENCER;
          } else if (existingUser.is_brand) {
            userType = UserType.BRAND;
          } else {
            userType = UserType.INFLUENCER;
          }

          const isQuestionnaireComplete = await this.questionnaireUseCase.getInstance().isSurveyDoneForCurrentUserType(existingUser.id, userType);
          if (!isQuestionnaireComplete) {
            return ['route to sign up journey', userResponse];
          }

          return ['route to dashboard', userResponse];
        }

        if (existingUser.is_brand) {
          throw new ConflictException('This email already exists as brand.');
        } else if (existingUser.is_influencer) {
          throw new ConflictException('This email already exists as influencer.');
        } else if (existingUser.is_consumer) {
          throw new ConflictException('This email already exists as shopper.');
        } else {
          throw new ConflictException('User with this email already exists.');
        }
      }

      // Step 3: Handle new user registration
      const { password, ...userDetails } = payload;

      if (isRegisterSSOUser) {
        const email_verified = true;
        let newSSOUser;
        if (requestFrom == 'webApplication') {
          newSSOUser = await this.userRepository.create({
            ...userDetails,
            password,
            email_verified,
            sign_in_method: signInMethod,
          });
        } else {
          newSSOUser = await this.userRepository.create({
            ...userDetails,
            is_influencer: true,
            password,
            email_verified,
            sign_in_method: signInMethod,
          });
          await this.influencerRepository.create({ user: { id: newSSOUser.id }, avatar });
        }

        Logger.log('New SSO user created');

        const userData = await this.userRepository.findById(newSSOUser.id);
        const userResponse = await this.giveUserResponse(userData, false);
        return ['route to sign up journey', userResponse];
      }

      // Encrypt password for non-SSO users
      const encryptedPassword = await this.bcryptService.encryptPassword(password!);

      let newUser;
      if (requestFrom == 'webApplication') {
        newUser = await this.userRepository.create({
          ...userDetails,
          password: encryptedPassword,
        });
      } else {
        newUser = await this.userRepository.create({
          ...userDetails,
          is_influencer: true,
          password: encryptedPassword,
        });
        await this.influencerRepository.create({ user: { id: newUser.id }, avatar });
      }

      const token = await this.generateVerificationToken(newUser.email);
      if (!isTestMode) {
        await this.sendEmailVerificationToUser(newUser.email, token, newUser.first_name);
      }

      Logger.log('New user created');

      // Generate access and refresh tokens
      const accessToken = this.jwtService.createAccessToken({ email: newUser.email }, '1d');
      const refreshToken = this.jwtService.createRefreshToken({ email: newUser.email }, '15d');
      await this.userRepository.saveRefreshToken(newUser.id, refreshToken);

      const expiresIn = this.jwtService.decodeToken(accessToken)?.expiryDate;

      const userData = await this.userRepository.findById(newUser.id);
      const userResponse = await this.giveUserResponse(userData);

      return {
        email: newUser.email,
        accessToken,
        expiresIn,
        id: newUser?.id,
        refreshToken,
        isInfluencer: userResponse.isInfluencer,
        isConsumer: userResponse.isConsumer,
        isBrand: userResponse.isBrand,
        msg: ['route to sign up journey', userResponse],
        user: userResponse,
        isAdmin: userResponse['isAdmin'],
        type: userResponse['type'],
      };
    } catch (error) {
      Logger.error('Error during user registration', error);
      throw error;
    }
  }

  // Helper function to validate reCAPTCHA
  private async validateRecaptcha(recaptchaToken: string): Promise<boolean> {
    try {
      const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
      const response = await axios.post(url);

      return response?.data?.success || false;
    } catch (error) {
      Logger.error('reCAPTCHA validation failed', error);
      return false;
    }
  }

  async giveUserResponse(user, appendType = true) {
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      dob: user.dob,
      isAdmin: user.is_admin,
      emailVerified: user.email_verified,
      isBrand: user.is_brand,
      isConsumer: user.is_consumer,
      isInfluencer: user.is_influencer,
      avatar: user.is_brand ? user?.brand?.avatar : user?.influencer?.avatar,
      ...(appendType && {
        type: user.is_brand ? UserRole.BRAND : user.is_influencer ? UserRole.INFLUENCER : user.is_consumer ? UserRole.CONSUMER : false,
      }),
    };
  }

  async fetchInstaUserName(instagram_creds) {
    const url = `https://graph.instagram.com/me?fields=followers_count,username,profile_picture_url,name&access_token=${instagram_creds.accessToken}`;

    // Make the request to the Instagram API
    const response = await axios.get(url);

    // Check if response has data
    if (response.data) {
      console.log(response.data);
      const profileData = response.data;
      // Return the profile data
      return profileData.username;
    } else {
      throw new Error('No profile data found.');
    }
  }

  private shouldSkipEmailSending(email: string): boolean {
    return email.toLowerCase().startsWith('dependant');
  }

  async sendEmailVerificationToUser(email, token, first_name) {
    if (this.shouldSkipEmailSending(email)) {
      return { success: true, message: 'Email sending skipped for dependant user' };
    }
    const verificationLink = `https://ubu.live/email/verify?token=${token}`;
    const emailBody = `
      <div
      style="background-color: #fff; padding: 20px; font-family: Arial, sans-serif; font-size: 14px; max-width: 600px; margin: auto; border-radius: 10px;">
      <div style="text-align: center; padding: 10px 0; background-color: #000;">
        <h1 style="color: white; font-family: 'Classy Vogue'; font-size: 36px; margin: 0;">
          UBU
        </h1>
      </div>

      <div style="padding: 20px;">

        <div style="line-height: 0.7">
            <div style="font-family: Poppins; font-size: 20px">
                <h3>Verify Your Email Address</h3>
            </div>
          <div>
            <div style="margin: 30px 0px;">
              <p>Hi ${first_name},</p>
            </div>
            <p>Welcome to UBU! We're excited to have you on board.</p>
            <p style="line-height: 1.3">To complete your registration, please verify your email address by clicking the button below:</p>
          </div>
          <div>
            <div style="margin: 40px 0;">
              <a href="${verificationLink}"
                style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none !important; border-radius: 5px; font-size: 14px">Verify
                Email Address</a>
            </div>
          </div>
          <div>
              <div>
            <div style="margin-bottom: 20px;">
            <p>If the button doesn't work, please copy and paste this link into your browser:</p>

            </div>
            <div style="margin-bottom: 20px;">

            <p style="font-weight: bold; text-decoration: none; color: black; line-height: 1.3; margin-top: 10px">
             ${verificationLink}
            </p>
            </div>
                    <div style="margin-bottom: 20px;">

            <p style="margin-top: 10px;">
                If you didn't create an account with UBU, you can safely ignore this email.
            </p>
            </div>

            <div style="margin-bottom: 20px;">

            <p>
              Thank you for choosing UBU!</p>
            </div>
            </div>

            <div>
            <p>Best regards,</p>
            <p>The UBU Team</p>
            </div>
          </div>
        </div>

      </div>
    <div style="text-align: center; margin: 15px 0px; font-size: 14px; color: rgba(0, 0, 0, 0.7); font-family: Arial, sans-serif;">
      <div style="margin-bottom: 10px; font-size: 16px; font-weight: 500; color: #000;">UBU Corporation</div>
      <div style="margin-bottom: 4%; font-size: 14px;">You are receiving this email because you opted in via our website.</div>

       <div style="display: inline-block; margin-right: 10px;">
    <a href="https://www.linkedin.com/company/ubu-platforms-inc/" target="_blank">
        <img style="height: 24px; width: 24px; object-fit: cover;" alt="LinkedIn" src="https://cdn-icons-png.flaticon.com/512/3046/3046124.png">
    </a>
</div>
<div style="display: inline-block; margin-right: 10px;">
    <a href="https://www.facebook.com/profile.php?id=61564362906545&mibextid=wwXIfr" target="_blank">
        <img style="height: 24px; width: 24px; object-fit: cover;" alt="Facebook" src="https://cdn-icons-png.flaticon.com/512/733/733547.png">
    </a>
</div>
<div style="display: inline-block;">
    <a href="https://www.instagram.com/ubu_platforms/profilecard/?igsh=MWI3bTVtamw1bHdjMQ==" target="_blank">
        <img style="height: 24px; width: 24px; object-fit: cover;" alt="Instagram" src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png">
    </a>
</div>

    </div>

      <div style="text-align: center; padding: 10px 0; background-color: #000;">
        <h1 style="color: white; font-family: 'Classy Vogue'; font-size: 36px; margin: 0;">
          UBU
        </h1>
      </div>
    </div>
    `;
    try {
      const sentEmail = await this.mailgunService.sendEmail(email, 'Verify Your Email Address', emailBody, true);
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
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'base64'), this.iv);
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
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'base64'), iv);
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
      throw new NotFoundException('User of given email not found. Please try to signup again.');
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

  async verifyAndAuthenticateApple(code: string, userData, sessionLog, requestFrom: string) {
    const clientId = process.env.APPLE_CLIENT_ID;

    if (!clientId) {
      throw new Error('APPLE_CLIENT_ID is not defined in environment variables.');
    }
    const clientSecret = this.generateClientSecret(); // Generate Apple client secret
    const tokenUrl = 'https://appleid.apple.com/auth/token';

    try {
      // Exchange code for tokens
      const tokenResponse = await axios.post(
        tokenUrl,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const { id_token, access_token } = tokenResponse.data;

      // Decode the id_token to get user info
      const decodedUser = this.decodeAppleIdToken(id_token);

      const hashedPasswordForApple = await this.bcryptService.encryptPassword(access_token);
      const email = userData ? userData?.email : decodedUser?.email;

      const response = await this.registerUser(
        {
          email: email,
          first_name: userData?.name?.firstName ?? email.split('@')[0],
          last_name: userData?.name?.lastName,
          password: hashedPasswordForApple,
          recaptchaToken: 'false',
          apple_identifier: decodedUser?.sub,
        },
        SignInMethods.APPLE,
        requestFrom,
        true,
      );

      const accessToken = this.jwtService.createAccessToken({ email }, '1d');
      const refreshToken = this.jwtService.createRefreshToken({ email }, '15d');

      const userInfo = response[1];

      await this.userRepository.saveRefreshToken(userInfo.id, refreshToken);

      const user_consumer = await this.userRepository.findConsumerByEmail(email);
      if (user_consumer?.consumer?.measurement?.id) {
        const addInfluncer = await this.influencerRepository.createIfNotExsist(userInfo.id, {
          measurement: {
            id: user_consumer.consumer.measurement.id,
          },
          user: {
            id: userInfo.id,
          },
        });
        await this.updateUserAnswers(user_consumer);
      }
      if (sessionLog) {
        sessionLog['user_id'] = userInfo?.id;
        this.sessionLogUseCase.getInstance().create(sessionLog);
      }

      const currentUser = await this.userRepository.findById(userInfo.id);
      if (!currentUser) throw new NotFoundException('User not found');
      const isScanned = await this.bodyMeasurementUseCase.getInstance().isUserScanned(currentUser?.influencer?.measurement?.id || null);

      const subscriptionInfo = await this.ubuSubscriptionRepository.getUserSubscriptionsInfo(userInfo.id);

      let isSubscribed = false;
      if (subscriptionInfo.length) {
        isSubscribed = true;
      }

      let userType: UserType = UserType.BRAND;
      if (currentUser.is_influencer) {
        userType = (await this.isMinor(currentUser.dob)) ? UserType.MINORINFLUENCER : UserType.INFLUENCER;
      } else if (currentUser.is_brand) {
        userType = UserType.BRAND;
      } else {
        userType = UserType.INFLUENCER;
      }

      const isQuestionnaireComplete = await this.questionnaireUseCase.getInstance().isSurveyDoneForCurrentUserType(currentUser.id, userType);

      if (user_consumer && !isQuestionnaireComplete) {
        return {
          id: userInfo?.id,
          email,
          accessToken,
          refreshToken,
          user_id: userInfo?.id,
          isScanned,
          isSurveyDone: false,
          subscriptionInfo,
          isSubscribed,
          isBrand: userInfo?.isBrand,
          isConsumer: userInfo?.isConsumer,
          isInfluencer: userInfo?.isInfluencer,
          isAdmin: userInfo.isAdmin,
          msg: response[0],
          user: response[1],
          type: userInfo['type'],
          emailVerified: userInfo.emailVerified,
        };
      }

      return {
        id: userInfo?.id,
        email,
        accessToken,
        refreshToken,
        user_id: userInfo?.id,
        isScanned,
        isSurveyDone: true,
        subscriptionInfo,
        isSubscribed,
        isBrand: userInfo?.isBrand,
        isConsumer: userInfo?.isConsumer,
        isInfluencer: userInfo?.isInfluencer,
        isAdmin: userInfo.isAdmin,
        msg: response[0],
        user: response[1],
        type: userInfo['type'],
        emailVerified: userInfo.emailVerified,
      };
    } catch (error) {
      console.error('Error exchanging Apple code:', error.response?.data || error);
      if (error.status && error.status == 400) {
        throw new BadRequestException(error.message || 'Something went wrong');
      } else {
        throw new Error('Failed to verify Apple authentication');
      }
    }
  }

  private generateClientSecret(): string {
    const payload = {
      iss: this.teamId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
      aud: 'https://appleid.apple.com',
      sub: this.clientId,
    };

    return jwt.sign(payload, this.privateKey, {
      algorithm: 'ES256',
      keyid: this.keyId,
    });
  }

  private decodeAppleIdToken(id_token: string) {
    // const base64Payload = id_token.split('.')[1];
    // const payloadBuffer = Buffer.from(base64Payload, 'base64');
    // return JSON.parse(payloadBuffer.toString());

    const decoded = jwt.decode(id_token, { complete: true }) as jwt.Jwt | null;
    return decoded?.payload as jwt.JwtPayload | null;
  }

  async updateUserAnswers(user_consumer: User) {
    if (!user_consumer.is_influencer) {
      const userInfluencerAndConsumer = await this.userRepository.findConsumerByEmail(user_consumer.email);
      const consumerAnswers = await this.questionnaireUseCase.getInstance().findAllQuestionnairesWithAnswersForUser(user_consumer.id, UserType.CONSUMER);

      if (consumerAnswers.length && !user_consumer.is_influencer) {
        const mappedData = consumerAnswers.reduce((acc, item, index) => {
          if (!item.user_answer[0]?.selected_options.length) {
            return acc;
          }
          acc[index] = {
            srNo: item.sr_no,
            answer: item.user_answer[0]?.selected_options,
            questionId: item.id,
          };
          return acc;
        }, {});
        await this.userAnswersUseCase.getInstance().handleUserAnswers(mappedData, userInfluencerAndConsumer);
      }
    }
  }

  async updateUserProfile(userId: number, payload: Partial<AuthSignUpDTO>) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.update(userId, payload);

      const updatedUser = await this.userRepository.findById(userId);
      return this.giveUserResponse(updatedUser, true);
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(userId: number) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return this.giveUserResponse(user, true);
    } catch (error) {
      throw error;
    }
  }

  async logout(userId: number, deviceId: string) {
    await this.notificationRepository.removeAllDevicesByUserId(userId, deviceId);
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}
