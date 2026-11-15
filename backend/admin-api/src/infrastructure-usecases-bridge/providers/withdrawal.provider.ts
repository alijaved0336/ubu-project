import { AffiliateReportRepository } from '@infrastructure/orm/reposiories/affiliate-report.repository';
import { CampaignPaymentRepository } from '@infrastructure/orm/reposiories/campaign-payment.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { StripeService } from '@infrastructure/services/stripe/stripe-service.service';
import { WithdrawalService } from '@infrastructure/services/withdrawal-history/withdrawal.service';
import { WithdrawalUseCase } from '@use-cases/withdrawal-history.usecase';
import UsecaseProxy, { WITHDRAWAL_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function WithdrawalUseCaseProvider() {
  return {
    provide: WITHDRAWAL_USECASE_PROXY,
    inject: [WithdrawalService, CampaignPaymentRepository, AffiliateReportRepository, UserRepository, StripeService, InfluencerRepository],
    useFactory: (
      withdrawalService: WithdrawalService,
      campaignPaymentRepo: CampaignPaymentRepository,
      affiliateReportRepo: AffiliateReportRepository,
      userRepo: UserRepository,
      stripeService: StripeService,
      influencerRepo: InfluencerRepository,
    ) => new UsecaseProxy(new WithdrawalUseCase(withdrawalService, campaignPaymentRepo, affiliateReportRepo, userRepo, stripeService, influencerRepo)),
  };
}
