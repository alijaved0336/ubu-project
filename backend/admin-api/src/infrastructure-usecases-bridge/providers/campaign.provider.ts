import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { CampaignDisputeRepository } from '@infrastructure/orm/reposiories/campaign-dispute.repository';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { ContractRepository } from '@infrastructure/orm/reposiories/contract.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';
import { UBUSubscriptionRepository } from '@infrastructure/orm/reposiories/ubu-subscription.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { WebSocketProviderService } from '@infrastructure/sockets/web-socket-provider';
import { CampaignDisputeUseCase } from '@use-cases/campaign-dispute.usecase';
import { CampaignPaymentUseCase } from '@use-cases/campaign-payment.usecase';
import { CampaignUsecase } from '@use-cases/campaign.usecase';
import { ExhibitDocumentUsecase } from '@use-cases/exhibit-document.usecase';
import UsecaseProxy, {
  CAMPAIGN_DISPUTE_USECASE_PROXY,
  CAMPAIGN_PAYMENT_USECASE_PROXY,
  CAMPAIGN_USECASE_PROXY,
  EXHIBITDOCUMENT_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import { DataSource } from 'typeorm';

export function CampaignUsecaseProvider() {
  return {
    inject: [
      CampaignRepository,
      CampaignDisputeRepository,
      AwsS3Service,
      UserRepository,
      InfluencerRepository,
      BrandRepository,
      ContractRepository,
      UBUSubscriptionRepository,
      MailGunService,
      DataSource,
      EXHIBITDOCUMENT_USECASE_PROXY,
      WebSocketProviderService,
      NotificationRepository,
      CAMPAIGN_PAYMENT_USECASE_PROXY,
      CAMPAIGN_DISPUTE_USECASE_PROXY,
    ],
    provide: CAMPAIGN_USECASE_PROXY,
    useFactory: (
      campaignRepository: CampaignRepository,
      campaignDisputeRepository: CampaignDisputeRepository,
      awsS3Service: AwsS3Service,
      userRepository: UserRepository,
      influencerRepository: InfluencerRepository,
      brandRepository: BrandRepository,
      contractRepository: ContractRepository,
      ubuSubscriptionRepository: UBUSubscriptionRepository,
      mailGunService: MailGunService,
      dataSource: DataSource,
      exhibitDocumentUsecase: UsecaseProxy<ExhibitDocumentUsecase>,
      webSocketProviderService: WebSocketProviderService,
      notificationRepository: NotificationRepository,
      campaignPaymentUseCase: UsecaseProxy<CampaignPaymentUseCase>,
      campaignDisputeUseCase: UsecaseProxy<CampaignDisputeUseCase>,
    ) =>
      new UsecaseProxy(
        new CampaignUsecase(
          campaignRepository,
          campaignDisputeRepository,
          awsS3Service,
          userRepository,
          influencerRepository,
          brandRepository,
          contractRepository,
          ubuSubscriptionRepository,
          mailGunService,
          dataSource,
          exhibitDocumentUsecase,
          webSocketProviderService,
          notificationRepository,
          campaignPaymentUseCase,
          campaignDisputeUseCase,
        ),
      ),
  };
}
