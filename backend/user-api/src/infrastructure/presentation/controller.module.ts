import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { InfrastructureUsecasesBridgeModule } from 'infrastructure-usecases-bridge/infrastructure-usecases-bridge.module';
import { StrategyModule } from '@infrastructure/strategies/strategies.module';
import { UserPresenter } from './auth/auth.dto';
import { InstagramController } from './instagram/instagram.controller';
import { JwtServiceModule } from '@infrastructure/services/jwt/jwt-service.module';
import { SocialIntegrationModule } from '@infrastructure/cron-jobs/social-integration.module';
import { ConsumerController } from './consumer/consumer.controller';
import { PostController } from './post/post.controller';
import { FollowController } from './follow/follow.controller';
import { InfluencerController } from './influencer/influencer.controller';
import { ProductController } from './product/product.controller';
import { CartController } from './cart/cart.controller';
import { QuestionnaireController } from './quesionnaire/questionnaire.controller';
import { SearchController } from './search/search.controller';
import { UserController } from './user/user.controller';
import { FavouriteAffiliateProductController } from './favourite-affiliate-product/favourite-affiliate-product.controller';
import { UserErrorController } from './user-error/user-error.controller';
import { UserAnswersController } from './user-answers/user-answers.controller';
import { BodyMeasurementController } from './body-measurement/body-measurement.controller';
import { ProfileController } from './profile/profile.controller';
import { ProfilePresenter, ResponseBuilder } from './profile/profile.presenter';
import { ProductRequestController } from './product-request/product-request.controller';
import { UserRequestsController } from './user-requests/user-requests.controller';

@Module({
  imports: [
    InfrastructureUsecasesBridgeModule.register(),
    StrategyModule,
    JwtServiceModule,
    SocialIntegrationModule,
  ],
  controllers: [
    AuthController,
    InstagramController,
    ConsumerController,
    PostController,
    FollowController,
    InfluencerController,
    ProductController,
    CartController,
    QuestionnaireController,
    SearchController,
    UserController,
    FavouriteAffiliateProductController,
    UserErrorController,
    UserAnswersController,
    BodyMeasurementController,
    ProfileController,
    ProductRequestController,
    UserRequestsController,
  ],
  providers: [UserPresenter, ProfilePresenter, ResponseBuilder],
})
export class ControllerModule {}
