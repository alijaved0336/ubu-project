import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { SocialIntegration } from '../entities/social-integration.entity';
import { SocialIntegrationRepository } from './social-integration.repository';
import { DatabaseOrmConfigModule } from '@infrastructure/config/database-orm-config/database-orm-config.module';
import { Products } from '../entities/product.entity';
import { ConsumerRepository } from './consumer.repository';
import { PostRepository } from './post.repository';
import { PostFavoriteRepository } from './post-favorite.repository';
import { Influencers } from '../entities/influencer.entity';
import { Consumers } from '../entities/consumer.entity';
import { BodyMeasurement } from '../entities/body-measurement.entity';
import { Posts } from '../entities/post.entity';
import { Follows } from '../entities/follow.entity';
import { FollowRepository } from './follow.repository';
import { InfluencerRepository } from './influencer.repository';
import { User } from '../entities/user.entity';
import { ProductRepository } from './product.repository';
import { ProductFavourites } from '../entities/product_favourites.entity';
import { ProductFavoriteRepository } from './product-favorite.repository';
import { PostFavourites } from '../entities/post-favourites.entity';
import { CartRepository } from './cart.repository';
import { Cart } from '../entities/cart.entity';
import { Reviews } from '../entities/reviews.entity';
import { ReviewRepository } from './review.repository';
import { QuestionnaireRepository } from './questionnaire.repository';
import { Questionnaires } from '../entities/questionnaire.entity';
import { UserAnswer } from '../entities/user-answer.entity';
import { SearchRepository } from './search.repository';
import { UserSearch } from '../entities/user-search.entity';
import { PostVisits } from '../entities/post-visit.entity';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';
import { AffiliateProduct } from '../entities/affiliate-product.entity';
import { FavoriteAffiliateProduct } from '../entities/favorite-affiliate-product.entity';
import { AffiliateProductRepository } from './affiliate-product.repository';
import { FavouriteAffiliateProductRepository } from './favourite-affiliate-product-repository';
import { Proposal } from '../entities/proposals.entity';
import { BodyScanLogCount } from '../entities/body-scan-log-count.entity';
import { BodyScanLogCountRepository } from './body-scan-log-count.repository';
import { UserError } from '../entities/user-error.entity';
import { AbstractRepository } from './abstract.repository';
import { UserErrorRepository } from './user-error.repository';
import { UserAnswerRepository } from './user-answer.repository';
import { BodyMeasurementRepository } from './body-measurement.repository';
import { Profile } from '../entities/profile.entity';
import { ProfileRepository } from './profile.repository';
import { ProductRequest } from '../entities/product-request.entity';
import { ProductRequestRepository } from './product-request.repository';
import { ProposalRepository } from './proposal.repository';
import { Affiliate } from '../entities/affiliate.entity';
import { AffiliateRepository } from './affiliate.repository';
import { InfluencerStripeConnectedAccount } from '../entities/influencer-stripe-connected-account.entity';
import { WithdrawalHistory } from '../entities/withdrawal-history.entity';
import { InfluencerStripeConnectedAccountRepository } from './stirpe-connected-account.repository';
import { UserRequest } from '../entities/user-requests.entity';
import { UserRequestsRepository } from './user-requests.repository';
import { NotificationRepository } from './notification.repository';
import { Notifications } from '../entities/notification.entity';
import { Device } from '../entities/device.entity';

@Module({
  imports: [
    DatabaseOrmConfigModule,
    TypeOrmModule.forFeature([
      User,
      SocialIntegration,
      Products,
      Influencers,
      Consumers,
      BodyMeasurement,
      UserAnswer,
      Posts,
      Follows,
      PostFavourites,
      Products,
      ProductFavourites,
      Cart,
      Reviews,
      Questionnaires,
      UserSearch,
      PostVisits,
      AffiliateProduct,
      FavoriteAffiliateProduct,
      Proposal,
      BodyScanLogCount,
      UserError,
      Profile,
      ProductRequest,
      Affiliate,
      InfluencerStripeConnectedAccount,
      WithdrawalHistory,
      UserRequest,
      Notifications,
      Device,
    ]),
  ],
  exports: [
    User,
    UserRepository,
    UserRepository,
    SocialIntegrationRepository,
    ConsumerRepository,
    InfluencerRepository,
    PostRepository,
    FollowRepository,
    PostFavoriteRepository,
    PostRepository,
    ProductRepository,
    ProductFavoriteRepository,
    CartRepository,
    ReviewRepository,
    QuestionnaireRepository,
    SearchRepository,
    BcryptService,
    AffiliateProductRepository,
    FavouriteAffiliateProductRepository,
    BodyScanLogCountRepository,
    AbstractRepository,
    UserErrorRepository,
    UserAnswerRepository,
    BodyMeasurementRepository,
    ProfileRepository,
    ProductRequestRepository,
    ProposalRepository,
    AffiliateRepository,
    InfluencerStripeConnectedAccountRepository,
    UserRequestsRepository,
    NotificationRepository,
  ],
  providers: [
    User,
    UserRepository,
    SocialIntegrationRepository,
    InfluencerRepository,
    ConsumerRepository,
    PostRepository,
    FollowRepository,
    PostFavoriteRepository,
    Influencers,
    Consumers,
    BodyMeasurement,
    Posts,
    Follows,
    PostFavourites,
    Products,
    ProductFavourites,
    ProductRepository,
    ProductFavoriteRepository,
    CartRepository,
    ReviewRepository,
    QuestionnaireRepository,
    SearchRepository,
    BcryptService,
    AffiliateProductRepository,
    FavouriteAffiliateProductRepository,
    BodyScanLogCountRepository,
    AbstractRepository,
    UserErrorRepository,
    UserAnswerRepository,
    BodyMeasurementRepository,
    ProfileRepository,
    ProductRequestRepository,
    ProposalRepository,
    AffiliateRepository,
    InfluencerStripeConnectedAccountRepository,
    UserRequestsRepository,
    NotificationRepository,
  ],
})
export class RepositoriesModule {}
