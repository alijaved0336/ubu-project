import { CampaignPaymentRepository } from '@infrastructure/orm/reposiories/campaign-payment.repository';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';
import { UBUSubscriptionRepository } from '@infrastructure/orm/reposiories/ubu-subscription.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { CampaignService } from '@infrastructure/sockets/campaign.service';
import { NotificationService } from '@infrastructure/sockets/notification.service';
import { WebSocketProviderService } from '@infrastructure/sockets/web-socket-provider';
import { StripeWebhookUsecase } from '@use-cases/stripe-webhook.usecase';
import UsecaseProxy, { STRIPE_WEBHOOK_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function StripeWebhookUsecaseProvider() {
  return {
    inject: [
      UserRepository,
      UBUSubscriptionRepository,
      CampaignPaymentRepository,
      CampaignRepository,
      MailGunService,
      WebSocketProviderService,
      NotificationRepository,
      CampaignService,
      NotificationService,
    ],
    provide: STRIPE_WEBHOOK_USECASE_PROXY,
    useFactory: (
      userRepository: UserRepository,
      ubuSubscriptionRepository: UBUSubscriptionRepository,
      campaignPaymentRepository: CampaignPaymentRepository,
      campaignRepository: CampaignRepository,
      mailGunService: MailGunService,
      webSocketProviderService: WebSocketProviderService,
      notificationRepository: NotificationRepository,
      campaignService: CampaignService,
      notificationService: NotificationService,
    ) =>
      new UsecaseProxy(
        new StripeWebhookUsecase(
          userRepository,
          ubuSubscriptionRepository,
          campaignPaymentRepository,
          campaignRepository,
          mailGunService,
          webSocketProviderService,
          notificationRepository,
          campaignService,
          notificationService,
        ),
      ),
  };
}
