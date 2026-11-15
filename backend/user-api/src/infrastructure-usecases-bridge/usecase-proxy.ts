export const AUTH_USECASE_PROXY: string = 'AuthUsecaseProxy';
export const INSTAGRAM_USECASE_PROXY: string = 'InstagramUsecaseProxy';
export const CONSUMER_USECASE_PROXY: string = 'ConsumerUsecaseProxy';
export const POST_USECASE_PROXY: string = 'PostUsecaseProxy';
export const FOLLOW_USECASE_PROXY: string = 'FollowUsecaseProxy';
export const INFLUENCER_USECASE_PROXY: string = 'InfluncerUsecaseProxy';
export const PRODUCT_USECASE_PROXY: string = 'ProductUsecaseProxy';
export const CART_USECASE_PROXY: string = 'CartUsecaseProxy';
export const QUESTIONNAIRE_USECASE_PROXY: string = 'QuestionnaireUsecaseProxy';
export const SEARCH_USECASE_PROXY: string = 'SearchUsecaseProxy';
export const USER_USECASE_PROXY: string = 'UserUsecaseProxy';
export const USER_ERROR_USECASE_PROXY: string = 'UserErrorUsecaseProxy';
export const BODY_SCAN_LOG_COUNT_USECASE_PROXY: string =
  'BodyScanLogCountUsecaseProxy';
export const BODY_MEASUREMENT_USE_CASE: string = 'BodyMeasurementUsecaseProxy';
export const USER_ANSWERS_USECASE_PROXY: string = 'UserAnswersUsecaseProxy';
export const FAVOURITE_AFFILIATE_PRODUCT_USECASE_PROXY: string =
  'FavouriteAffiliateProductUsecaseProxy';
export const PROFILE_USECASE_PROXY: string = 'ProfileUsecaseProxy';
export const PRODUCT_REQUEST_USECASE_PROXY: string =
  'ProductRequestUsecaseProxy';
export const USER_REQUESTS_USECASE_PROXY: string = 'UserRequestsUsecaseProxy';

export default class UsecaseProxy<T> {
  constructor(private readonly usecase: T) {}

  getInstance(): T {
    return this.usecase;
  }
}
