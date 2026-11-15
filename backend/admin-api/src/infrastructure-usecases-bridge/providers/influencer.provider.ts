import { ConsumerRepository } from '@infrastructure/orm/reposiories/consumer.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { ProfileRepository } from '@infrastructure/orm/reposiories/profile.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { JwtService } from '@infrastructure/services/jwt/jwt.service';
import { BodyMeasurementUsecase } from '@use-cases/body-measurement.usecase';
import { BodyScanLogCountUsecase } from '@use-cases/body-scan-log-count.usecase';
import { CommonUsecase } from '@use-cases/common.usecase';
import { InfluencerUsecase } from '@use-cases/influencer.usecase';
import { QuestionnaireUsecase } from '@use-cases/questionnaire.usecase';
import UsecaseProxy, {
  BODY_MEASUREMENT_USE_CASE,
  BODY_SCAN_LOG_COUNT_USECASE_PROXY,
  COMMON_USECASE_PROXY,
  INFLUENCER_USECASE_PROXY,
  QUESTIONNAIRE_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';

export function InfluencerUsecaseProvider() {
  return {
    inject: [
      InfluencerRepository,
      ConsumerRepository,
      UserRepository,
      JwtService,
      BODY_SCAN_LOG_COUNT_USECASE_PROXY,
      BODY_MEASUREMENT_USE_CASE,
      ProfileRepository,
      COMMON_USECASE_PROXY,
      QUESTIONNAIRE_USECASE_PROXY,
    ],
    provide: INFLUENCER_USECASE_PROXY,
    useFactory: (
      influencerRepository: InfluencerRepository,
      consumerRepository: ConsumerRepository,
      userRepository: UserRepository,
      jwtService: JwtService,
      bodyScanLogCountUseCase: UsecaseProxy<BodyScanLogCountUsecase>,
      bodyMeasurementUseCase: UsecaseProxy<BodyMeasurementUsecase>,
      profileRepository: ProfileRepository,
      commonUseCase: UsecaseProxy<CommonUsecase>,
      questionnaireUseCase: UsecaseProxy<QuestionnaireUsecase>,
    ) =>
      new UsecaseProxy(
        new InfluencerUsecase(
          influencerRepository,
          consumerRepository,
          userRepository,
          jwtService,
          bodyScanLogCountUseCase,
          bodyMeasurementUseCase,
          profileRepository,
          commonUseCase,
          questionnaireUseCase,
        ),
      ),
  };
}
