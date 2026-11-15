import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { InfrastructureUsecasesBridgeModule } from 'infrastructure-usecases-bridge/infrastructure-usecases-bridge.module';
import { StrategyModule } from '@infrastructure/strategies/strategies.module';
import { UserController } from './user/user.controller';
import { ProductController } from './product/product.controller';
import { InfluencerController } from './influencer/influencer.controller';
import { PostsController } from './post/post.controller';
import { FilesController } from './UploadFiles/files.controller';
import { CategoryController } from './categories/categories.controller';
import { CommonController } from './common/common.controller';
import { SegmentController } from './segment/segment.controller';
import { NotificationController } from './notification/notification.controller';
import { AwsSPApiController } from './sp-api/aws-sp-api.controller';
import { InstagramController } from './instagram/instagram.controller';
import { MailController } from './mailgun/mail.controller';
import { TemplateController } from './template/template.controller';
import { CampaignController } from './campaign/campaign.controller';
import { ContractController } from './contract/contract.controller';
import { ExhibitDocumentController } from './exhibit-documents/exhibit-documents.controller';
import { ProposalController } from './proposal/proposal.controller';
import { BrandController } from './brand/brand.controller';
import { UbuSubscriptionController } from './ubu-subscription/ubu-subscription.controller';
import { StripeWebhookController } from './stripe-webhook/stripe-webhook.controller';
import { SubscriptionModule } from '@infrastructure/subscription/subscription.module';
import { ChatsController } from './chat/chat.controller';
import { AdminReviewsController } from './review/admin-review.controller';
import { BlogsController } from './blog/blog.controller';
import { CampaignPaymentController } from './campaign-payment/campaign-payment.controller';
import { TagsController } from './tag/tag.controller';
import { SessionLogController } from './session-log/sessionlog.controller';
import { SocketModule } from '@infrastructure/sockets/socket.module';
import { WhatsNewController } from './whats-new/whats-new.controller';
import { WhatsNewSeenByController } from './whats-new-seen-by/whats-new-seen-by-controller';
import { CampaignDisputeController } from './campaign-dispute/campaign-dispute.controller';
import { FavouriteAffiliateProductController } from './favourite-affiliate-product/favourite-affiliate-product.controller';
import { BodyScanLogCountController } from './body-scan-log/body-scan-log.controller';
import { UserErrorController } from './user-error/user-error.controller';
import { UserAnswersController } from './user-answers/user-answers.controller';
import { InfluencerPaymentController } from './influencer-payment/influencer.payment.controller';
import { S3LoggerController } from './s3-logger/s3-logger.controller';
import { AffiliateReportController } from './affiliate-report/affiliate-report.controller';
import { ProfileController } from './profile/profile.controller';
import { ProfilePresenter, ResponseBuilder } from './profile/profile.presenter';
import { WithdrawalController } from './withdrawal-history/withdrawal.controller';

@Module({
  imports: [InfrastructureUsecasesBridgeModule.register(), SubscriptionModule, StrategyModule, SocketModule],
  controllers: [
    AuthController,
    UserController,
    BlogsController,
    InfluencerController,
    BrandController,
    ProductController,
    SessionLogController,
    InfluencerPaymentController,
    PostsController,
    UbuSubscriptionController,
    FilesController,
    CategoryController,
    CommonController,
    SegmentController,
    AwsSPApiController,
    NotificationController,
    InstagramController,
    MailController,
    TemplateController,
    CampaignController,
    CampaignPaymentController,
    CampaignDisputeController,
    ContractController,
    ExhibitDocumentController,
    ProposalController,
    StripeWebhookController,
    ChatsController,
    AdminReviewsController,
    TagsController,
    WhatsNewController,
    WhatsNewSeenByController,
    FavouriteAffiliateProductController,
    BodyScanLogCountController,
    UserErrorController,
    UserAnswersController,
    S3LoggerController,
    AffiliateReportController,
    ProfileController,
    WithdrawalController,
  ],
  providers: [ProfilePresenter, ResponseBuilder],
})
export class ControllerModule {}
