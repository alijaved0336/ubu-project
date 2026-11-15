import { AdminReviewRepository } from '@infrastructure/orm/reposiories/admin-review.repository';
import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';
import { WebSocketProviderService } from '@infrastructure/sockets/web-socket-provider';
import { AdminReviewUsecase } from '@use-cases/admin-review.usecase';
import UsecaseProxy, { ADMIN_REVIEW_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function AdminReviewUsecaseProvider() {
  return {
    inject: [AdminReviewRepository, BrandRepository, InfluencerRepository, CampaignRepository, NotificationRepository, WebSocketProviderService],
    provide: ADMIN_REVIEW_USECASE_PROXY,
    useFactory: (
      adminReviewRepository: AdminReviewRepository,
      brandRepository: BrandRepository,
      influencerRepository: InfluencerRepository,
      campaignRepository: CampaignRepository,
      notificationProvide: NotificationRepository,
      webSocketProvider: WebSocketProviderService,
    ) =>
      new UsecaseProxy(
        new AdminReviewUsecase(adminReviewRepository, brandRepository, influencerRepository, campaignRepository, notificationProvide, webSocketProvider),
      ),
  };
}
