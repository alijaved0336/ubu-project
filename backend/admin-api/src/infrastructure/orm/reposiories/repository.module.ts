import { DatabaseOrmConfigModule } from '@infrastructure/config/database-orm-config/database-orm-config.module';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminReview } from '../entities/admin-review.entity';
import { InfluencerProfile } from '../entities/influencer-profile.entity';
import { AdminReviewRepository } from './admin-review.repository';
import { InfluencerProfileRepository } from './influencer-profile.repository';
import { OAuthCredentials } from '../entities/oauth-credentials.entity';
import { OAuthCredentialsRepository } from './oath-credentials.repository';
import { SocialIntegration } from '../entities/social-integration.entity';
import { SocialIntegrationRepository } from './social-integration.repository';
import { ContactUs } from '../entities/contact-us-form.entity';
import { EmailCapturedForIOS } from '../entities/email-captured-form.entity';
import { ContactUsRepository } from './contact-us.repository';
import { EmailCapturedForIOSRepository } from './email-capture-for-ios.repository';
import { Chat } from '../entities/chat.entity';
import { ChatMessage } from '../entities/chat-messages.entity';
import { ChatRepository } from './chat.repository';
import { ChatMessageRepository } from './chat-messages.repository';
import { ExhibitDocumentRepository } from './exhibit-document.repository';
import { ExhibitDocument } from '../entities/exhibit-document.entity';
import { Notifications } from '../entities/notification.entity';
import { NotificationRepository } from './notification.repository';
import { AffliateRepository } from './affliate.repository';
import { Affiliate } from '../entities/affiliate.entity';
import { Proposal } from '../entities/proposals.entity';
import { ProposalRepository } from './proposal.repository';
import { BodyMeasurement } from '../entities/body-measurement.entity';
import { SubscriberRepository } from './subscriber.repository';
import { Subscriber } from '../entities/subscriber.entity';
import { ChatUser } from '../entities/chat-users.entity';
import { ChatUserRepository } from './chat-user.repository';
import { ContractRepository } from './contract.repository';
import { Contract } from '../entities/contract.entity';
import { UBUSubscription } from '../entities/ubuSubscription.entity';
import { UBUSubscriptionRepository } from './ubu-subscription.repository';
import { InstagramStatsRepository } from './instagram-stats.repository';
import { InstagramStats } from '../entities/instagram-stats.entity';
import { AffliateProductableRepository } from './affliate-productable.repository';
import { AffiliateDemoProduct } from '../entities/affiliate-demo-products.entity';
import { AffiliateProduct } from '../entities/affiliate-product.entity';
import { BlogTags } from '../entities/blog-tag.entity';
import { Blogs } from '../entities/blog.entity';
import { BodyScanLogCount } from '../entities/body-scan-log-count.entity';
import { Brands } from '../entities/brand.entity';
import { CampaignComment } from '../entities/campaign-comment.entity';
import { CampaignDispute } from '../entities/campaign-dispute.entity';
import { FundRelease } from '../entities/campaign-fund-release.entity';
import { CampaignPayment } from '../entities/campaign-payment.entity';
import { Campaign } from '../entities/campaign.entity';
import { Cart } from '../entities/cart.entity';
import { Categories } from '../entities/category.entity';
import { Consumers } from '../entities/consumer.entity';
import { FavoriteAffiliateProduct } from '../entities/favorite-affiliate-product.entity';
import { ForgotPasswordToken } from '../entities/forgot-password-token.entity';
import { Gender } from '../entities/gender.entity';
import { InfluencerStripeConnectedAccount } from '../entities/influencer-stripe-connected-account.entity';
import { Influencers } from '../entities/influencer.entity';
import { PostFavourites } from '../entities/post-favourites.entity';
import { PostProducts } from '../entities/post-product.entity';
import { PostVisits } from '../entities/post-visit.entity';
import { Posts } from '../entities/post.entity';
import { ProductSizes } from '../entities/product-size.entity';
import { Products } from '../entities/product.entity';
import { ProductFavourites } from '../entities/product_favourites.entity';
import { Questionnaires } from '../entities/questionnaire.entity';
import { Refund } from '../entities/refund.entity';
import { Segment } from '../entities/segment.entity';
import { SessionLog } from '../entities/sessionlog.entity';
import { Sizes } from '../entities/size.entity';
import { Style } from '../entities/style.entity';
import { SubCategory } from '../entities/sub-category.entity';
import { Tags } from '../entities/tag.entity';
import { Template } from '../entities/template.entity';
import { UserAnswer } from '../entities/user-answer.entity';
import { User } from '../entities/user.entity';
import { WeeklyTrackingSummary } from '../entities/weekly-tracking-summary.entity';
import { WhatsNewSeenBy } from '../entities/whats-new-seen-by.entity';
import { WhatsNew } from '../entities/whats-new.entity';
import { AffiliateProductRepository } from './affiliate-product.repository';
import { AffiliateReportRepository } from './affiliate-report.repository';
import { BlogTagRepository } from './blog-tag.repository';
import { BlogRepository } from './blog.repository';
import { BodyScanLogCountRepository } from './body-scan-log-count.repository';
import { BrandRepository } from './brand.repository';
import { CampaignCommentRepository } from './campaign-comment.repository';
import { CampaignDisputeRepository } from './campaign-dispute.repository';
import { CampaignPaymentRepository } from './campaign-payment.repository';
import { CampaignRepository } from './campaign.repository';
import { CategoryRepository } from './category.repository';
import { ConsumerRepository } from './consumer.repository';
import { FavouriteAffiliateProductRepository } from './favourite-affiliate-product-repository';
import { ForgotPasswordTokenRepository } from './forgot-password-token.repository';
import { GenderRepository } from './gender.repository';
import { InfluencerRepository } from './influencer.repository';
import { PostProductsRepository } from './post-product.repository';
import { PostRepository } from './post.repository';
import { ProductSizeRepository } from './product-size.repository';
import { ProductRepository } from './product.repository';
import { QuestionnaireRepository } from './questionnaire.repository';
import { RefundPaymentRepository } from './refund-payment.repository';
import { SegmentRepository } from './segment.repository';
import { SessionLogRepository } from './sessionlog.repository';
import { SizeRepository } from './size.repository';
import { StyleRepository } from './style.repository';
import { SubCategoryRepository } from './sub-category.repository';
import { TagRepository } from './tag.repository';
import { TemplateRepository } from './template.repository';
import { UserAnswerRepository } from './user-answer.repository';
import { UserRepository } from './user.repository';
import { WhatsNewSeenByRepository } from './whats-new-seen-by.repository';
import { WhatsNewRepository } from './whats-new.repository';
import { AbstractRepository } from './abstract.repository';
import { UserError } from '../entities/user-error.entity';
import { UserErrorRepository } from './user-error.repository';
import { BodyMeasurementRepository } from './body-measurement.repository';
import { InfluencerPaymentRepository } from './influencer-payment.repository';
import { InfluencerPayment } from '../entities/influencer-payment.entity';
import { Profile } from '../entities/profile.entity';
import { ProfileRepository } from './profile.repository';
import { Device } from '../entities/device.entity';

@Module({
  imports: [
    DatabaseOrmConfigModule,
    TypeOrmModule.forFeature([
      User,
      Influencers,
      BodyMeasurement,
      Posts,
      Products,
      SessionLog,
      PostProducts,
      Brands,
      Categories,
      SubCategory,
      Style,
      Blogs,
      Sizes,
      ProductSizes,
      Gender,
      Questionnaires,
      UserAnswer,
      Segment,
      Campaign,
      Template,
      CampaignComment,
      CampaignPayment,
      FundRelease,
      AdminReview,
      InfluencerProfile,
      OAuthCredentials,
      SocialIntegration,
      ContactUs,
      EmailCapturedForIOS,
      Chat,
      ChatMessage,
      ExhibitDocument,
      Notifications,
      Affiliate,
      Proposal,
      Subscriber,
      ChatUser,
      Contract,
      UBUSubscription,
      InstagramStats,
      AffiliateDemoProduct,
      WeeklyTrackingSummary,
      ForgotPasswordToken,
      Tags,
      BlogTags,
      InfluencerStripeConnectedAccount,
      Refund,
      AffiliateProduct,
      WhatsNew,
      WhatsNewSeenBy,
      CampaignDispute,
      InfluencerPayment,
      FavoriteAffiliateProduct,
      Consumers,
      PostFavourites,
      PostVisits,
      ProductFavourites,
      Cart,
      BodyScanLogCount,
      UserError,
      Profile,
      Device,
    ]),
  ],
  exports: [
    AbstractRepository,
    UserRepository,
    InfluencerRepository,
    BodyMeasurement,
    PostRepository,
    ProductRepository,
    PostProductsRepository,
    BrandRepository,
    CategoryRepository,
    SubCategoryRepository,
    StyleRepository,
    SizeRepository,
    ProductSizeRepository,
    GenderRepository,
    QuestionnaireRepository,
    UserAnswerRepository,
    SegmentRepository,
    CampaignRepository,
    TemplateRepository,
    CampaignCommentRepository,
    AdminReviewRepository,
    InfluencerProfileRepository,
    OAuthCredentialsRepository,
    SocialIntegrationRepository,
    ContactUsRepository,
    InfluencerPaymentRepository,
    EmailCapturedForIOSRepository,
    ChatRepository,
    ChatMessageRepository,
    ExhibitDocumentRepository,
    NotificationRepository,
    AffliateRepository,
    ProposalRepository,
    SessionLogRepository,
    SubscriberRepository,
    ChatUserRepository,
    ContractRepository,
    UBUSubscriptionRepository,
    InstagramStatsRepository,
    BcryptService,
    AffliateProductableRepository,
    AffiliateReportRepository,
    ForgotPasswordTokenRepository,
    BlogRepository,
    TagRepository,
    BlogTagRepository,
    CampaignPaymentRepository,
    RefundPaymentRepository,
    AffiliateProductRepository,
    WhatsNewRepository,
    WhatsNewSeenByRepository,
    CampaignDisputeRepository,
    FavouriteAffiliateProductRepository,
    ConsumerRepository,
    BodyScanLogCountRepository,
    UserErrorRepository,
    BodyMeasurementRepository,
    ProfileRepository,
  ],
  providers: [
    AbstractRepository,
    UserRepository,
    InfluencerRepository,
    BodyMeasurement,
    PostRepository,
    ProductRepository,
    PostProductsRepository,
    BrandRepository,
    CategoryRepository,
    SubCategoryRepository,
    StyleRepository,
    SizeRepository,
    InfluencerPaymentRepository,
    ProductSizeRepository,
    GenderRepository,
    QuestionnaireRepository,
    UserAnswerRepository,
    SegmentRepository,
    CampaignRepository,
    TemplateRepository,
    CampaignCommentRepository,
    SessionLogRepository,
    AdminReviewRepository,
    InfluencerProfileRepository,
    OAuthCredentialsRepository,
    SocialIntegrationRepository,
    ContactUsRepository,
    EmailCapturedForIOSRepository,
    ChatRepository,
    ChatMessageRepository,
    ExhibitDocumentRepository,
    NotificationRepository,
    AffliateRepository,
    ProposalRepository,
    SubscriberRepository,
    ChatUserRepository,
    ContractRepository,
    UBUSubscriptionRepository,
    InstagramStatsRepository,
    BcryptService,
    AffliateProductableRepository,
    AffiliateReportRepository,
    ForgotPasswordTokenRepository,
    BlogRepository,
    TagRepository,
    BlogTagRepository,
    CampaignPaymentRepository,
    RefundPaymentRepository,
    AffiliateProductRepository,
    WhatsNewRepository,
    WhatsNewSeenByRepository,
    CampaignDisputeRepository,
    FavouriteAffiliateProductRepository,
    ConsumerRepository,
    BodyScanLogCountRepository,
    UserErrorRepository,
    BodyMeasurementRepository,
    ProfileRepository,
  ],
})
export class RepositoriesModule {}
