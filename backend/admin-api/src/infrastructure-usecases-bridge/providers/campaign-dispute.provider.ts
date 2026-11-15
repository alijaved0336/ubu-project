import { CampaignDisputeRepository } from '@infrastructure/orm/reposiories/campaign-dispute.repository';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { CampaignDisputeUseCase } from '@use-cases/campaign-dispute.usecase';
import { CampaignPaymentUseCase } from '@use-cases/campaign-payment.usecase';
import UsecaseProxy, { CAMPAIGN_DISPUTE_USECASE_PROXY, CAMPAIGN_PAYMENT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { DataSource } from 'typeorm';

export function CampaignDisputeUsecaseProvider() {
  return {
    inject: [CampaignDisputeRepository, CampaignRepository, CAMPAIGN_PAYMENT_USECASE_PROXY, DataSource],
    provide: CAMPAIGN_DISPUTE_USECASE_PROXY,
    useFactory: (
      campaignDisputeRepository: CampaignDisputeRepository,
      campaignRepository: CampaignRepository,
      campaignPaymentUseCase: UsecaseProxy<CampaignPaymentUseCase>,
      dataSource: DataSource,
    ) => new UsecaseProxy(new CampaignDisputeUseCase(campaignDisputeRepository, campaignRepository, campaignPaymentUseCase, dataSource)),
  };
}
