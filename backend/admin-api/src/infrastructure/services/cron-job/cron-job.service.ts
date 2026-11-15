import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AdminReviewUsecase } from '@use-cases/admin-review.usecase';
import { CampaignPaymentUseCase } from '@use-cases/campaign-payment.usecase';
import { ChatsUsecase } from '@use-cases/chat.usecase';
import { InstagramUsecase } from '@use-cases/instagram.usecase';
import UsecaseProxy, {
  ADMIN_REVIEW_USECASE_PROXY,
  CAMPAIGN_PAYMENT_USECASE_PROXY,
  CHAT_USECASE_PROXY,
  INSTAGRAM_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);

  constructor(
    @Inject(INSTAGRAM_USECASE_PROXY)
    private readonly instagramUsecaseProxy: UsecaseProxy<InstagramUsecase>,
    @Inject(CHAT_USECASE_PROXY)
    private readonly chatUsecaseProxy: UsecaseProxy<ChatsUsecase>,
    @Inject(ADMIN_REVIEW_USECASE_PROXY)
    private readonly adminReviewUsecaseProxy: UsecaseProxy<AdminReviewUsecase>,
    @Inject(CAMPAIGN_PAYMENT_USECASE_PROXY)
    private readonly campaignPaymentUseCase: UsecaseProxy<CampaignPaymentUseCase>,
  ) {}

  @Cron('0 2 * * *')
  async handleCronSaveInfluencerInstagramStats() {
    this.logger.log('Cron job "Save Instagram Stats" initiated...');
    await this.instagramUsecaseProxy.getInstance().cronJobSaveInstagramStatsToDb();
    this.logger.log('Cron job "Save Instagram Stats" completed.');
  }

  @Cron('0 1 * * *')
  async handleCronSaveInfuencerAvgResponseTime() {
    this.logger.log('Cron job "Save Influencer Average Response Time" initiated...');
    await this.chatUsecaseProxy.getInstance().cronJobSaveInfluencerAverageResponseTime();
    this.logger.log('Cron job "Save Influencer Average Response Time" completed.');
  }

  @Cron('0 3 * * *')
  async handleCronSendNotificationToNonReviewingInfluencers() {
    this.logger.log('Cron job "Send Notification to Non Reviewing Influencers" initiated...');
    await this.adminReviewUsecaseProxy.getInstance().cronJobSendNotificationToNonReviewingInfluencers();
    this.logger.log('Cron job "Send Notification to Non Reviewing Influencers" completed.');
  }

  @Cron('0 0,18 * * *')
  // @Cron('* 3 * * * *')
  async handleCronTransferFundsToInfluencer() {
    this.logger.log('Cron job transfer funds to influencer initiated...');
    await this.campaignPaymentUseCase.getInstance().processScheduledTransfers();
    this.logger.log('Cron job transfer funds to influencer completed.');
  }
}
