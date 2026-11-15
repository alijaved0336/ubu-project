import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { InstagramStatsRepository } from '@infrastructure/orm/reposiories/instagram-stats.repository';
import { SocialIntegrationRepository } from '@infrastructure/orm/reposiories/social-integration.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { InstagramUsecase } from '@use-cases/instagram.usecase';
import UsecaseProxy, { INSTAGRAM_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function InstagramUsecaseProvider() {
  return {
    inject: [SocialIntegrationRepository, UserRepository, InfluencerRepository, InstagramStatsRepository],
    provide: INSTAGRAM_USECASE_PROXY,
    useFactory: (
      socialIntegrationRepository: SocialIntegrationRepository,
      userRepository: UserRepository,
      influencerRepository: InfluencerRepository,
      instagramStatsRepository: InstagramStatsRepository,
    ) => new UsecaseProxy(new InstagramUsecase(socialIntegrationRepository, userRepository, influencerRepository, instagramStatsRepository)),
  };
}
