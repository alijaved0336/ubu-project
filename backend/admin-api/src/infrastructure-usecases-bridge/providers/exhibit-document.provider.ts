import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { ExhibitDocumentRepository } from '@infrastructure/orm/reposiories/exhibit-document.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { ExhibitDocumentUsecase } from '@use-cases/exhibit-document.usecase';
import UsecaseProxy, { EXHIBITDOCUMENT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function ExhibitDocumentUsecaseProvider() {
  return {
    inject: [CampaignRepository, ExhibitDocumentRepository, InfluencerRepository, BrandRepository],
    provide: EXHIBITDOCUMENT_USECASE_PROXY,
    useFactory: (
      campaignRepository: CampaignRepository,
      exhibitDocumentRepository: ExhibitDocumentRepository,
      influencerRepository: InfluencerRepository,
      brandRepository: BrandRepository,
    ) => new UsecaseProxy(new ExhibitDocumentUsecase(campaignRepository, exhibitDocumentRepository, influencerRepository, brandRepository)),
  };
}
