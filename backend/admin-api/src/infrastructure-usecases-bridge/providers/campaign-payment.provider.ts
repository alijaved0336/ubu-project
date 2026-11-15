import { CampaignPaymentRepository } from '@infrastructure/orm/reposiories/campaign-payment.repository';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { RefundPaymentRepository } from '@infrastructure/orm/reposiories/refund-payment.repository';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { StripeService } from '@infrastructure/services/stripe/stripe-service.service';
import { CampaignPaymentUseCase } from '@use-cases/campaign-payment.usecase';
import { NotificationService } from '@infrastructure/sockets/notification.service';
import UsecaseProxy, { CAMPAIGN_PAYMENT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { DataSource } from 'typeorm';

export function CampaignPaymentUsecaseProvider() {
  return {
    inject: [CampaignPaymentRepository, StripeService, CampaignRepository, RefundPaymentRepository, MailGunService, NotificationService, DataSource],
    provide: CAMPAIGN_PAYMENT_USECASE_PROXY,
    useFactory: (
      campaignPaymentRepository: CampaignPaymentRepository,
      StripeService: StripeService,
      campaignRepository: CampaignRepository,
      refundPaymentRepository: RefundPaymentRepository,
      mailGunService: MailGunService,
      notificationService: NotificationService,
      dataSource: DataSource,
    ) =>
      new UsecaseProxy(
        new CampaignPaymentUseCase(
          campaignPaymentRepository,
          StripeService,
          campaignRepository,
          refundPaymentRepository,
          mailGunService,
          notificationService,
          dataSource,
        ),
      ),
  };
}
