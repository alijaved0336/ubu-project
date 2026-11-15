import { ConsumerUsecase } from './consumer.usecase';
import { STYLE_QUESTIONS_SR_NO } from 'common/constants';
import { InfluencerUsecase } from './influencer.usecase';
import { UserAnswersUsecase } from './user-answers.usecase';
import { QuestionnaireUsecase } from './questionnaire.usecase';
import { User } from '@infrastructure/orm/entities/user.entity';
import { BodyMeasurementUsecase } from './body-measurement.usecase';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  deleteResponseDto,
  UpdateUserDto,
  UpdateUserDto_new,
} from '@infrastructure/presentation/user/user.dto';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';

import UsecaseProxy, {
  AUTH_USECASE_PROXY,
  BODY_MEASUREMENT_USE_CASE,
  CONSUMER_USECASE_PROXY,
  INFLUENCER_USECASE_PROXY,
  QUESTIONNAIRE_USECASE_PROXY,
  USER_ANSWERS_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import { JwtService } from '@infrastructure/services/jwt/jwt.service';
import { AuthUsecase } from './auth.usecase';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserUsecase {
  constructor(
    private userRepository: UserRepository,
    @Inject(CONSUMER_USECASE_PROXY)
    private readonly consumerUseCase: UsecaseProxy<ConsumerUsecase>,
    @Inject(INFLUENCER_USECASE_PROXY)
    private readonly influencerUseCase: UsecaseProxy<InfluencerUsecase>,
    @Inject(QUESTIONNAIRE_USECASE_PROXY)
    private readonly questionnaireUseCase: UsecaseProxy<QuestionnaireUsecase>,
    @Inject(BODY_MEASUREMENT_USE_CASE)
    private readonly bodyMeasurementUseCase: UsecaseProxy<BodyMeasurementUsecase>,
    @Inject(USER_ANSWERS_USECASE_PROXY)
    private readonly userAnswersUseCase: UsecaseProxy<UserAnswersUsecase>,
    private readonly jwtService: JwtService,
    @Inject(AUTH_USECASE_PROXY)
    private readonly authUsecaseProxy: UsecaseProxy<AuthUsecase>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async updateByIdNew(user: User, payload: UpdateUserDto) {
    try {
      if (payload) {
        const { avatar, ...userDetailsWithoutAvatar } = payload;

        await this.userRepository.updateUser(user.id, userDetailsWithoutAvatar);
        await this.consumerUseCase.getInstance().updateById(user.consumer.id, {
          avatar,
        });
      }
      return {
        success: true,
        message: 'User updated successfully',
      };
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  updateMeasurements(measurements, bodyMeasurements) {
    return measurements?.map(({ name, unit, value }) => {
      let newValue = value;

      switch (name) {
        case 'waistGirth':
          if (bodyMeasurements.waistGirth != null) {
            newValue = bodyMeasurements.waistGirth;
          }
          break;
        default:
          break;
      }

      return {
        name,
        unit,
        value: newValue,
      };
    });
  }

  // async deleteUser(
  //   user: User,
  //   isSoftDelete: Boolean,
  //   isRevertUser: Boolean = false
  // ): Promise<deleteResponseDto> {
  //   try {
  //     if (user.is_deleted) {
  //       return {
  //         statusCode: 200,
  //         message: `Account has been removed already successfully.`,
  //       };
  //     } else {
  //       if (user.is_brand) {
  //         throw new BadRequestException('Cannot Delete Brand from here.');
  //       }

  //       if (user.is_influencer && !user.is_consumer) {
  //         throw new BadRequestException('Cannot Delete Influencer from here.');
  //       }

  //       if(isRevertUser){
  //         // revert user logic
  //         return {
  //           statusCode: 200,
  //           message: `Account has been reverted successfully.`,
  //         };
  //       }
  //       else{
  //         if (user.is_influencer && user.is_consumer && user.influencer) {

  //           await this.influencerUseCase
  //             .getInstance()
  //             .deleteInfluencerData(user?.influencer?.id, isSoftDelete);
  //         }

  //         if(user.is_consumer && user.consumer){

  //           await this.consumerUseCase
  //           .getInstance()
  //           .deleteConsumerData(user?.consumer?.id, isSoftDelete);
  //         }

  //         await this.userRepository.deleteUserPartially(user.id);

  //         return {
  //           statusCode: 200,
  //           message: `Account has been removed successfully.`,
  //         };
  //       }

  //     }
  //   } catch (error) {
  //     throw new BadRequestException(
  //       `Failed to delete user with ID ${user.id}: ${error.message}`,
  //     );
  //   }
  // }

  async deleteOrRevertUser(
    user: User,
    isSoftDelete: boolean,
    isRevertUser: boolean = false,
  ): Promise<deleteResponseDto> {
    try {
      this.validateUserDeletionRules(user);

      if (isRevertUser) {
        return this.revertUser(user);
      }

      await this.performUserDeletion(user, isSoftDelete);

      return this.createResponse(200, 'Account has been removed successfully.');
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete user with ID ${user.id}: ${error.message}`,
      );
    }
  }

  private validateUserDeletionRules(user: User): void {
    if (user.is_brand) {
      throw new BadRequestException('Cannot Delete Brand from here.');
    }

    if (user.is_influencer && !user.is_consumer) {
      throw new BadRequestException('Cannot Delete Influencer from here.');
    }
  }

  async revertUser(user: User): Promise<deleteResponseDto> {
    try {
      // Restore user data
      await this.userRepository.revertUserPartially(user.id);

      // Restore influencer data if applicable
      if (user.is_influencer && user.influencer) {
        await this.influencerUseCase
          .getInstance()
          .revertInfluencerData(user.influencer.id);
      }

      // Restore consumer data if applicable
      if (user.is_consumer && user.consumer) {
        await this.consumerUseCase
          .getInstance()
          .revertConsumerData(user.consumer.id);
      }

      return this.createResponse(
        200,
        'Account has been reverted successfully.',
      );
    } catch (error) {
      throw new BadRequestException(
        `Failed to revert user with ID ${user.id}: ${error.message}`,
      );
    }
  }

  private async performUserDeletion(
    user: User,
    isSoftDelete: boolean,
  ): Promise<void> {
    if (user.is_influencer && user.influencer) {
      await this.influencerUseCase
        .getInstance()
        .deleteInfluencerData(user.influencer.id, isSoftDelete);
    }

    if (user.is_consumer && user.consumer) {
      await this.consumerUseCase
        .getInstance()
        .deleteConsumerData(user.consumer.id, isSoftDelete);
    }

    await this.userRepository.deleteUserPartially(user.id);
  }

  private createResponse(
    statusCode: number,
    message: string,
  ): deleteResponseDto {
    return {
      statusCode,
      message,
    };
  }

  async switchUser(id: number, role: 'shopper' | 'influencer') {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const email = user.email;
    const accessToken = this.jwtService.createAccessToken({ email }, '30d');
    const expiresIn = this.jwtService.decodeToken(accessToken).expiryDate;
    const refreshToken = this.jwtService.createRefreshToken({ email }, '30d');

    let response;
    if (role === 'shopper') {
      // Handle shopper logic using local use case
      response = await this.authUsecaseProxy
        .getInstance()
        .refreshToken(refreshToken);
    } else if (role === 'influencer') {
      // Call external endpoint for influencer
      const axiosResponse = await firstValueFrom(
        this.httpService.post(
          `${this.configService.get('AdminAPI').adminAPI}/refresh_token`,
          {
            refresh_token: refreshToken,
          },
        ),
      );
      response = axiosResponse.data;

      // Optionally do something with `response.data`
      // e.g., validate or merge tokens
    } else {
      throw new BadRequestException('Invalid role provided.');
    }

    return {
      statusCode: HttpStatus.OK,
      ...response,
    };
  }

  async searchUsers(
    searchString: string,
    page = 1,
    limit = 10,
    loggedInUserId,
  ) {
    const [users, total] = await this.userRepository.searchUsers(
      searchString,
      limit,
      page,
      loggedInUserId,
    );

    const results = users.map((user) => ({
      name: `${user.first_name} ${user.last_name}`,
      avatar: user.consumer?.avatar || user.influencer?.avatar || null,
      email: user.email,
      id: user.id,
    }));

    return {
      total,
      page,
      limit,
      users: results,
    };
  }
}
