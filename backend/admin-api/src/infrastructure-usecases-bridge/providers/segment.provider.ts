import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { QuestionnaireRepository } from '@infrastructure/orm/reposiories/questionnaire.repository';
import { SegmentRepository } from '@infrastructure/orm/reposiories/segment.repository';
import { AdminReviewUsecase } from '@use-cases/admin-review.usecase';
import { CampaignUsecase } from '@use-cases/campaign.usecase';
import { InstagramUsecase } from '@use-cases/instagram.usecase';
import { SegmentUsecase } from '@use-cases/segment.usecase';
import UsecaseProxy, { ADMIN_REVIEW_USECASE_PROXY, CAMPAIGN_USECASE_PROXY, INSTAGRAM_USECASE_PROXY, SEGMENT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function SegmentUsecaseProvider() {
  return {
    inject: [SegmentRepository, BrandRepository, InfluencerRepository, QuestionnaireRepository, ADMIN_REVIEW_USECASE_PROXY, INSTAGRAM_USECASE_PROXY, CAMPAIGN_USECASE_PROXY],
    provide: SEGMENT_USECASE_PROXY,
    useFactory: (
      segmentRepository: SegmentRepository,
      brandRepository: BrandRepository,
      influencerRepository: InfluencerRepository,
      questionRepository: QuestionnaireRepository,
      adminReviewUsecase: UsecaseProxy<AdminReviewUsecase>,
      instagramUseCase: UsecaseProxy<InstagramUsecase>,
      campaignUseCase: UsecaseProxy<CampaignUsecase>
    ) =>
      new UsecaseProxy(new SegmentUsecase(segmentRepository, brandRepository, influencerRepository, questionRepository, adminReviewUsecase, instagramUseCase, campaignUseCase)),
  };
}
