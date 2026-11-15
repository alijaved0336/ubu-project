import { InfluencerStripeConnectedAccount } from '@infrastructure/orm/entities/influencer-stripe-connected-account.entity';
import { AffiliateRepository } from '@infrastructure/orm/reposiories/affiliate.repository';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';
import { ProfileRepository } from '@infrastructure/orm/reposiories/profile.repository';
import { InfluencerStripeConnectedAccountRepository } from '@infrastructure/orm/reposiories/stirpe-connected-account.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthUsecase } from '@use-cases/auth.usecase';
import { ProfileUseCase } from '@use-cases/profile.usecase';
import { UserUsecase } from '@use-cases/user.usecase';
import UsecaseProxy, {
  AUTH_USECASE_PROXY,
  PROFILE_USECASE_PROXY,
  USER_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';

export function ProfileUsecaseProvider() {
  return {
    inject: [
      ProfileRepository,
      AUTH_USECASE_PROXY,
      UserRepository,
      USER_USECASE_PROXY,
      AffiliateRepository,
      InfluencerStripeConnectedAccountRepository,
      HttpService,
      ConfigService,
      NotificationRepository,
    ],
    provide: PROFILE_USECASE_PROXY,
    useFactory: (
      profileRepository: ProfileRepository,
      authUsecaseProxy: UsecaseProxy<AuthUsecase>,
      userRepository: UserRepository,
      userUsecaseProxy: UsecaseProxy<UserUsecase>,
      affliateRepository: AffiliateRepository,
      stripeConnectedAccountRepo: InfluencerStripeConnectedAccountRepository,
      httpService: HttpService,
      configSerice: ConfigService,
      notificationRepo: NotificationRepository,
    ) =>
      new UsecaseProxy(
        new ProfileUseCase(
          profileRepository,
          authUsecaseProxy,
          userRepository,
          userUsecaseProxy,
          affliateRepository,
          stripeConnectedAccountRepo,
          httpService,
          configSerice,
          notificationRepo,
        ),
      ),
  };
}
