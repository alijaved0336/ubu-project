import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { SocialIntegrationRepository } from '@infrastructure/orm/reposiories/social-integration.repository';
import { UBUSubscriptionRepository } from '@infrastructure/orm/reposiories/ubu-subscription.repository';
import { UserAnswerRepository } from '@infrastructure/orm/reposiories/user-answer.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';
import { JwtService } from '@infrastructure/services/jwt/jwt.service';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { ConfigService } from '@nestjs/config';
import { AuthUsecase } from '@use-cases/auth.usecase';
import { BodyMeasurementUsecase } from '@use-cases/body-measurement.usecase';
import { CampaignDisputeUseCase } from '@use-cases/campaign-dispute.usecase';
import { SessionLogUseCase } from '@use-cases/sessionlog.usecase';
import UsecaseProxy, {
  AUTH_USECASE_PROXY,
  BODY_MEASUREMENT_USE_CASE,
  CAMPAIGN_DISPUTE_USECASE_PROXY,
  QUESTIONNAIRE_USECASE_PROXY,
  SESSION_LOG_ENTRY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import { UserAnswersUsecase } from '@use-cases/user-answers.usecase';
import { USER_ANSWERS_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { QuestionnaireUsecase } from '@use-cases/questionnaire.usecase';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';

export function AuthUsecaseProvider() {
  return {
    inject: [
      UserRepository,
      BcryptService,
      JwtService,
      NotificationRepository,
      InfluencerRepository,
      BrandRepository,
      AwsS3Service,
      UserAnswerRepository,
      SocialIntegrationRepository,
      ConfigService,
      UBUSubscriptionRepository,
      MailGunService,
      CAMPAIGN_DISPUTE_USECASE_PROXY,
      SESSION_LOG_ENTRY,
      USER_ANSWERS_USECASE_PROXY,
      BODY_MEASUREMENT_USE_CASE,
      QUESTIONNAIRE_USECASE_PROXY,
    ],
    provide: AUTH_USECASE_PROXY,
    useFactory: (
      userRepository: UserRepository,
      bcryptService: BcryptService,
      jwtService: JwtService,
      notificationRepository: NotificationRepository,
      influencerRepository: InfluencerRepository,
      brandRepository: BrandRepository,
      awsS3Service: AwsS3Service,
      userAnswerRepository: UserAnswerRepository,
      socialIntegrationRepository: SocialIntegrationRepository,
      configService: ConfigService,
      ubuSubscriptionRepository: UBUSubscriptionRepository,
      mailgunService: MailGunService,
      campaignDisputeUseCase: UsecaseProxy<CampaignDisputeUseCase>,
      sessionLogUseCase: UsecaseProxy<SessionLogUseCase>,
      userAnswersUseCase: UsecaseProxy<UserAnswersUsecase>,
      bodyMeasurementUseCase: UsecaseProxy<BodyMeasurementUsecase>,
      questionnaireUseCase: UsecaseProxy<QuestionnaireUsecase>,
    ) =>
      new UsecaseProxy(
        new AuthUsecase(
          userRepository,
          bcryptService,
          jwtService,
          notificationRepository,
          influencerRepository,
          brandRepository,
          awsS3Service,
          userAnswerRepository,
          socialIntegrationRepository,
          configService,
          ubuSubscriptionRepository,
          mailgunService,
          campaignDisputeUseCase,
          sessionLogUseCase,
          userAnswersUseCase,
          bodyMeasurementUseCase,
          questionnaireUseCase,
        ),
      ),
  };
}
