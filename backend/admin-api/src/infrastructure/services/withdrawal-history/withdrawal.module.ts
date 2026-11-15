import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoriesModule } from '@infrastructure/orm/reposiories/repository.module'; // Add this import
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalHistory } from '@infrastructure/orm/entities/withdrawal-history.entity';
import { Influencers } from '@infrastructure/orm/entities/influencer.entity';
import { InfluencerStripeConnectedAccount } from '@infrastructure/orm/entities/influencer-stripe-connected-account.entity';

import { WeeklyTrackingSummary } from '@infrastructure/orm/entities/weekly-tracking-summary.entity';
import { User } from '@infrastructure/orm/entities/user.entity';
import { CampaignPaymentRepository } from '@infrastructure/orm/reposiories/campaign-payment.repository';
import { AffiliateReportRepository } from '@infrastructure/orm/reposiories/affiliate-report.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { StripeService } from '../stripe/stripe-service.service';
import { FundRelease } from '@infrastructure/orm/entities/campaign-fund-release.entity';
import { CampaignPayment } from '@infrastructure/orm/entities/campaign-payment.entity';
import { Refund } from '@infrastructure/orm/entities/refund.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WithdrawalHistory,
      Influencers,
      InfluencerStripeConnectedAccount,
      WeeklyTrackingSummary,
      User,
      CampaignPayment,
      FundRelease,
      Refund,
    ]),
    RepositoriesModule,
  ],
  providers: [WithdrawalService, CampaignPaymentRepository, AffiliateReportRepository, UserRepository, StripeService],
  exports: [WithdrawalService],
})
export class UsecaseProxyModule {}
