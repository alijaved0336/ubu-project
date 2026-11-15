import { RepositoriesModule } from '@infrastructure/orm/reposiories/repository.module';
import { JobsProcessor } from '@infrastructure/queue/jobs.processor';
import { CampaignQueueService } from '@infrastructure/queue/queue.service';
import { AwsS3ServiceModule } from '@infrastructure/services/aws-s3/aws-s3-service.module';
import { AwsSpServiceModule } from '@infrastructure/services/aws-sp-api/aws-sp-service.module';
import { BcryptServiceModule } from '@infrastructure/services/bcrypt/bcrypt-service.module';
import { PostMiddleware } from '@infrastructure/services/common-middleware/post.middleware';
import { ProductMiddleware } from '@infrastructure/services/common-middleware/product.middleware';
import { JwtServiceModule } from '@infrastructure/services/jwt/jwt-service.module';
import { MailgunServiceModule } from '@infrastructure/services/mailgun/mailgun-service.module';
import { StripeServiceModule } from '@infrastructure/services/stripe/stripe-service.module';
import { TwilioServiceModule } from '@infrastructure/services/twilio/twilio-service.module';
import { BullModule } from '@nestjs/bull';
import { DynamicModule, forwardRef, Module } from '@nestjs/common';
import { AdminReviewUsecaseProvider } from './providers/admin-review.provider';
import { AuthUsecaseProvider } from './providers/auth.provider';
import { AwsSpApiUsecaseProvider } from './providers/aws-sp-api.provider';
import { BrandUsecaseProvider } from './providers/brand.provider';
import { CampaignUsecaseProvider } from './providers/campaign.provider';
import { ChatUsecaseProvider } from './providers/chat.provider';
import { CommonUsecaseProvider } from './providers/common.provider';
import { ContractUsecaseProvider } from './providers/contract.provider';
import { ExhibitDocumentUsecaseProvider } from './providers/exhibit-document.provider';
import { FileUsecaseProvider } from './providers/file.provider';
import { InfluencerUsecaseProvider } from './providers/influencer.provider';
import { InstagramUsecaseProvider } from './providers/instagram.provider';
import { MailUsecaseProvider } from './providers/mail.provider';
import { PostUsecaseProvider } from './providers/post.provider';
import { ProductUsecaseProvider } from './providers/product.provider';
import { ProposalUsecaseProvider } from './providers/proposal.provider';
import { SegmentUsecaseProvider } from './providers/segment.provider';
import { StripeWebhookUsecaseProvider } from './providers/stripe-webhook.provider';
import { TemplateUsecaseProvider } from './providers/template.provider';
import { UbuSubscriptionUsecaseProvider } from './providers/ubu-subscription.provider';

import { SocketModule } from '@infrastructure/sockets/socket.module';
import { BlogTagsUsecaseProvider } from './providers/blog-tag.provider';
import { BlogUseCaseProvider } from './providers/blog.provider';
import { CampaignDisputeUsecaseProvider } from './providers/campaign-dispute.provider';
import { CampaignPaymentUsecaseProvider } from './providers/campaign-payment.provider';
import { NotificationUsecaseProvider } from './providers/notification.provider';
import { SessionLogProvider } from './providers/sessionlog.provider';
import { TagsUsecaseProvider } from './providers/tag.provider';
import { UserUsecaseProvider } from './providers/user.provider';
import { WhatsNewUsecaseProvider } from './providers/whats-new-provider';
import { WhatsNewSeenByUsecaseProvider } from './providers/whats-new-seen-by-provider';
import {
  ADMIN_REVIEW_USECASE_PROXY,
  AUTH_USECASE_PROXY,
  AWS_SP_API_USECASE_PROXY,
  BLOG_TAG_USECASE_PROXY,
  BLOG_USECASE_PROXY,
  BODY_SCAN_LOG_COUNT_USECASE_PROXY,
  BRAND_USECASE_PROXY,
  CAMPAIGN_DISPUTE_USECASE_PROXY,
  CAMPAIGN_PAYMENT_USECASE_PROXY,
  CAMPAIGN_USECASE_PROXY,
  CHAT_USECASE_PROXY,
  COMMON_USECASE_PROXY,
  CONTRACT_USECASE_PROXY,
  EXHIBITDOCUMENT_USECASE_PROXY,
  FAVOURITE_AFFILIATE_PRODUCT_USECASE_PROXY,
  FILE_USECASE_PROXY,
  INFLUENCER_USECASE_PROXY,
  INSTAGRAM_USECASE_PROXY,
  MAIL_USECASE_PROXY,
  NOTIFICATION_USECASE_PROXY,
  POST_USECASE_PROXY,
  PRODUCT_USECASE_PROXY,
  PROPOSAL_USECASE_PROXY,
  SEGMENT_USECASE_PROXY,
  SESSION_LOG_ENTRY,
  STRIPE_WEBHOOK_USECASE_PROXY,
  TAG_USECASE_PROXY,
  TEMPLATE_USECASE_PROXY,
  UBU_SUBSCRIPTION_USECASE_PROXY,
  USER_ERROR_USECASE_PROXY,
  USER_USECASE_PROXY,
  WHATS_NEW_SEEN_BY_USECASE_PROXY,
  WHATS_NEW_USECASE_PROXY,
  USER_ANSWERS_USECASE_PROXY,
  QUESTIONNAIRE_USECASE_PROXY,
  BODY_MEASUREMENT_USE_CASE,
  INFLUENCER_PAYMENT_PROXY,
  S3_LOGGER_USECASE_PROXY,
  AFFILIATE_REPORT_USECASE_PROXY,
  PROFILE_USECASE_PROXY,
  WITHDRAWAL_USECASE_PROXY,
} from './usecase-proxy';

import { AwsPaServiceModule } from '@infrastructure/services/aws-pa-api/aws-pa-service.module';
import { BodyScanLogCountUsecaseProvider } from './providers/body-scan-log-count.provider';
import { FavouriteAffiliateProductUseCaseProvider } from './providers/favourite-affiliate-product.provider';
import { UserErrorUsecaseProvider } from './providers/user-error.provider';
import { QuestionnaireUsecaseProvider } from './providers/questionnaire.provider';
import { UserAnswersUsecaseProvider } from './providers/user-answers.provider';
import { BodyMeasurementUsecaseProvider } from './providers/body-measurement.provider';
import { InfluencerPaymentProvider } from './providers/influencer-payment.provider';
import { S3LoggerUsecaseProvider } from './providers/s3-logger.provider';
import { S3LoggerModule } from '@infrastructure/services/s3-logger/s3-logger-service.module';
import { ImageModule } from '@infrastructure/services/image/image.module';
import { AffiliateReportUseCaseProvider } from './providers/affiliate-report.provider';
import { IpBlockMiddleware } from '@infrastructure/services/common-middleware/ip-block.middleware';
import { MigrationRunnerServiceModule } from '@infrastructure/services/migration-runner/migration-runner-service.module';
import { ProfileUsecaseProvider } from './providers/profile.provider';
import { UsecaseProxyModule } from '@infrastructure/services/withdrawal-history/withdrawal.module';
import { WithdrawalUseCaseProvider } from './providers/withdrawal.provider';
import { VideoModule } from '@infrastructure/services/video/video.module';

@Module({
  imports: [
    UsecaseProxyModule,
    S3LoggerModule,
    MigrationRunnerServiceModule,
    AwsPaServiceModule,
    AwsS3ServiceModule,
    AwsSpServiceModule,
    BcryptServiceModule,
    JwtServiceModule,
    MailgunServiceModule,
    TwilioServiceModule,
    ImageModule,
    VideoModule,
    forwardRef(() => SocketModule),
    RepositoriesModule,
    // JobsModule
    BullModule.forRoot({
      redis: {
        host: 'redis-15357.c91.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 15357,
        password: process.env.DB_PASSWORD,
        db: 0,
        maxRetriesPerRequest: 50,
        retryStrategy: (times) => {
          return Math.min(times * 50, 2000);
        },
        connectTimeout: 10000, // 10 seconds timeout for establishing connection
        readOnly: false,
      },
    }),
    BullModule.registerQueue({
      name: 'campaignQueue',
    }),
    StripeServiceModule,
  ],
  providers: [CampaignQueueService, JobsProcessor, PostMiddleware, ProductMiddleware, IpBlockMiddleware],
})
export class InfrastructureUsecasesBridgeModule {
  static register(): DynamicModule {
    return {
      module: InfrastructureUsecasesBridgeModule,
      providers: [
        AdminReviewUsecaseProvider(),
        AuthUsecaseProvider(),
        AwsSpApiUsecaseProvider(),
        InfluencerPaymentProvider(),
        BrandUsecaseProvider(),
        CampaignUsecaseProvider(),
        CampaignPaymentUsecaseProvider(),
        ChatUsecaseProvider(),
        CommonUsecaseProvider(),
        ContractUsecaseProvider(),
        ExhibitDocumentUsecaseProvider(),
        FileUsecaseProvider(),
        NotificationUsecaseProvider(),
        InfluencerUsecaseProvider(),
        InstagramUsecaseProvider(),
        MailUsecaseProvider(),
        PostUsecaseProvider(),
        ProductUsecaseProvider(),
        ProposalUsecaseProvider(),
        SegmentUsecaseProvider(),
        TemplateUsecaseProvider(),
        StripeWebhookUsecaseProvider(),
        UbuSubscriptionUsecaseProvider(),
        BlogUseCaseProvider(),
        SessionLogProvider(),
        UserUsecaseProvider(),
        TagsUsecaseProvider(),
        BlogTagsUsecaseProvider(),
        WhatsNewUsecaseProvider(),
        WhatsNewSeenByUsecaseProvider(),
        CampaignDisputeUsecaseProvider(),
        FavouriteAffiliateProductUseCaseProvider(),
        AffiliateReportUseCaseProvider(),
        BodyScanLogCountUsecaseProvider(),
        UserErrorUsecaseProvider(),
        UserAnswersUsecaseProvider(),
        QuestionnaireUsecaseProvider(),
        BodyMeasurementUsecaseProvider(),
        S3LoggerUsecaseProvider(),
        ProfileUsecaseProvider(),
        WithdrawalUseCaseProvider(), // ✅ FIXED HERE
      ],
      exports: [
        ADMIN_REVIEW_USECASE_PROXY,
        AUTH_USECASE_PROXY,
        AWS_SP_API_USECASE_PROXY,
        BRAND_USECASE_PROXY,
        CAMPAIGN_USECASE_PROXY,
        CAMPAIGN_PAYMENT_USECASE_PROXY,
        CHAT_USECASE_PROXY,
        COMMON_USECASE_PROXY,
        CONTRACT_USECASE_PROXY,
        EXHIBITDOCUMENT_USECASE_PROXY,
        FILE_USECASE_PROXY,
        SESSION_LOG_ENTRY,
        INFLUENCER_USECASE_PROXY,
        INSTAGRAM_USECASE_PROXY,
        MAIL_USECASE_PROXY,
        POST_USECASE_PROXY,
        PRODUCT_USECASE_PROXY,
        PROPOSAL_USECASE_PROXY,
        BRAND_USECASE_PROXY,
        UBU_SUBSCRIPTION_USECASE_PROXY,
        STRIPE_WEBHOOK_USECASE_PROXY,
        NOTIFICATION_USECASE_PROXY,
        SEGMENT_USECASE_PROXY,
        TEMPLATE_USECASE_PROXY,
        BLOG_USECASE_PROXY,
        USER_USECASE_PROXY,
        TAG_USECASE_PROXY,
        BLOG_TAG_USECASE_PROXY,
        WHATS_NEW_USECASE_PROXY,
        WHATS_NEW_SEEN_BY_USECASE_PROXY,
        CAMPAIGN_DISPUTE_USECASE_PROXY,
        FAVOURITE_AFFILIATE_PRODUCT_USECASE_PROXY,
        AFFILIATE_REPORT_USECASE_PROXY,
        BODY_SCAN_LOG_COUNT_USECASE_PROXY,
        USER_ERROR_USECASE_PROXY,
        USER_ANSWERS_USECASE_PROXY,
        QUESTIONNAIRE_USECASE_PROXY,
        BODY_MEASUREMENT_USE_CASE,
        INFLUENCER_PAYMENT_PROXY,
        S3_LOGGER_USECASE_PROXY,
        PROFILE_USECASE_PROXY,
        WITHDRAWAL_USECASE_PROXY,
      ],
    };
  }
}
