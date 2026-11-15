export const AUTH_USECASE_PROXY: string = 'AuthUsecaseProxy';
export const PRODUCT_USECASE_PROXY: string = 'ProductUsecaseProxy';
export const INFLUENCER_USECASE_PROXY: string = 'InfluncerUsecaseProxy';
export const POST_USECASE_PROXY: string = 'PostUsecaseProxy';
export const CHAT_USECASE_PROXY: string = 'ChatUsecaseProxy';
export const FILE_USECASE_PROXY: string = 'FileUsecaseProxy';
export const COMMON_USECASE_PROXY: string = 'CommonUsecaseProxy';
export const SEGMENT_USECASE_PROXY: string = 'SegmentUsecaseProxy';
export const AWS_SP_API_USECASE_PROXY: string = 'AwsSpApiUsecaseProxy';
export const INSTAGRAM_USECASE_PROXY: string = 'InstagramUsecaseProxy';
export const MAIL_USECASE_PROXY: string = 'MailUsecaseProxy';
export const TEMPLATE_USECASE_PROXY: string = 'TemplateUsecaseProxy';
export const CAMPAIGN_USECASE_PROXY: string = 'CampaignUsecaseProxy';
export const CAMPAIGN_PAYMENT_USECASE_PROXY: string = 'CampaignPaymentUsecaseProxy';
export const CAMPAIGN_DISPUTE_USECASE_PROXY: string = 'CampaignDisputeUsecaseProxy';
export const CONTRACT_USECASE_PROXY: string = 'ContractUsecaseProxy';
export const EXHIBITDOCUMENT_USECASE_PROXY: string = 'ExhibitUsecaseProxy';
export const PROPOSAL_USECASE_PROXY: string = 'ProposalUsecaseProxy';
export const BRAND_USECASE_PROXY: string = 'BrandUsecaseProxy';
export const UBU_SUBSCRIPTION_USECASE_PROXY: string = 'UbuSubscriptionUsecaseProxy';
export const STRIPE_WEBHOOK_USECASE_PROXY: string = 'StripeWebhookUsecaseProxy';
export const ADMIN_REVIEW_USECASE_PROXY: string = 'ReviewUsecaseProxy';
export const BLOG_USECASE_PROXY: string = 'BlogUsecaseProxy';
export const NOTIFICATION_USECASE_PROXY: string = 'NotificationUsecaseProxy';
export const SESSION_LOG_ENTRY: string = 'SessionLogEntry';
export const INFLUENCER_PAYMENT_PROXY: string = 'InfluencerPayment';
export const USER_USECASE_PROXY: string = 'UserUsecaseProxy';
export const BODY_SCAN_LOG_COUNT_USECASE_PROXY: string = 'BodyScanLogCountUsecaseProxy';
export const TAG_USECASE_PROXY: string = 'TagUsecaseProxy';
export const BLOG_TAG_USECASE_PROXY: string = 'BlogTagUsecaseProxy';
export const BODY_MEASUREMENT_USE_CASE: string = 'BodyMeasurementUsecaseProxy';
export const WHATS_NEW_USECASE_PROXY: string = 'WhatsNewUsecaseProxy';
export const USER_ANSWERS_USECASE_PROXY: string = 'UserAnswersUsecaseProxy';
export const QUESTIONNAIRE_USECASE_PROXY: string = 'QuestionnaireUsecaseProxy';
export const WHATS_NEW_SEEN_BY_USECASE_PROXY: string = 'WhatsNewSeenByUsecaseProxy';
export const FAVOURITE_AFFILIATE_PRODUCT_USECASE_PROXY: string = 'FavouriteAffiliateProductUsecaseProxy';
export const AFFILIATE_REPORT_USECASE_PROXY: string = 'AffiliateReportUsecaseProxy';
export const S3_LOGGER_USECASE_PROXY: string = 'S3LoggerUsecaseProxy';
export const USER_ERROR_USECASE_PROXY: string = 'UserErrorUsecaseProxy';
export const PROFILE_USECASE_PROXY: string = 'ProfileUsecaseProxy';
export const WITHDRAWAL_USECASE_PROXY = 'WithdrawalUsecaseProxy';

export default class UsecaseProxy<T> {
  constructor(private readonly usecase: T) {}

  getInstance(): T {
    return this.usecase;
  }
}
