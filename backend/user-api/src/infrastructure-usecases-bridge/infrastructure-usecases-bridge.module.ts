import { DynamicModule, Module } from '@nestjs/common';
import UsecaseProxy, {
  AUTH_USECASE_PROXY,
  CART_USECASE_PROXY,
  INSTAGRAM_USECASE_PROXY,
  CONSUMER_USECASE_PROXY,
  FOLLOW_USECASE_PROXY,
  INFLUENCER_USECASE_PROXY,
  POST_USECASE_PROXY,
  PRODUCT_USECASE_PROXY,
  QUESTIONNAIRE_USECASE_PROXY,
  SEARCH_USECASE_PROXY,
  USER_USECASE_PROXY,
  FAVOURITE_AFFILIATE_PRODUCT_USECASE_PROXY,
  BODY_SCAN_LOG_COUNT_USECASE_PROXY,
  USER_ERROR_USECASE_PROXY,
  USER_ANSWERS_USECASE_PROXY,
  BODY_MEASUREMENT_USE_CASE,
  PROFILE_USECASE_PROXY,
  PRODUCT_REQUEST_USECASE_PROXY,
  USER_REQUESTS_USECASE_PROXY,
} from './usecase-proxy';
import { BcryptServiceModule } from '@infrastructure/services/bcrypt/bcrypt-service.module';
import { AuthUsecase } from '@use-cases/auth.usecase';
import { InstagramUsecase } from '@use-cases/instagram.usecase';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';
import { JwtService } from '@infrastructure/services/jwt/jwt.service';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { JwtServiceModule } from '@infrastructure/services/jwt/jwt-service.module';
import { RepositoriesModule } from '@infrastructure/orm/reposiories/repository.module';
import { SocialIntegrationRepository } from '@infrastructure/orm/reposiories/social-integration.repository';
import { ConsumerRepository } from '@infrastructure/orm/reposiories/consumer.repository';
import { ConsumerUsecase } from '@use-cases/consumer.usecase';
import { PostRepository } from '@infrastructure/orm/reposiories/post.repository';
import { PostUsecase } from '@use-cases/post.usecase';
import { FollowRepository } from '@infrastructure/orm/reposiories/follow.repository';
import { FollowUsecase } from '@use-cases/follow.usecase';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { InfluencerUsecase } from '@use-cases/influencer.usecase';
import { PostFavoriteRepository } from '@infrastructure/orm/reposiories/post-favorite.repository';
import { ProductFavoriteRepository } from '@infrastructure/orm/reposiories/product-favorite.repository';
import { ProductRepository } from '@infrastructure/orm/reposiories/product.repository';
import { ProductUsecase } from '@use-cases/product.usecase';
import { CartRepository } from '@infrastructure/orm/reposiories/cart.repository';
import { CartUsecase } from '@use-cases/cart.usecase';
import { ReviewRepository } from '@infrastructure/orm/reposiories/review.repository';
import { QuestionnaireUsecase } from '@use-cases/questionnaire.usecase';
import { QuestionnaireRepository } from '@infrastructure/orm/reposiories/questionnaire.repository';
import { SearchRepository } from '@infrastructure/orm/reposiories/search.repository';
import { SearchUsecase } from '@use-cases/search.usecase';
import { AiServiceModule } from '@infrastructure/services/ai-service/ai-service.module';
import { AiService } from '@infrastructure/services/ai-service/ai-service.service';
import { UserUsecase } from '@use-cases/user.usecase';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { MailgunServiceModule } from '@infrastructure/services/mailgun/mailgun-service.module';
import { FavouriteAffiliateProductUsecase } from '@use-cases/favourite-affiliate-product.usecase';
import { FavouriteAffiliateProductRepository } from '@infrastructure/orm/reposiories/favourite-affiliate-product-repository';
import { AffiliateProductRepository } from '@infrastructure/orm/reposiories/affiliate-product.repository';
import { BodyScanLogCountRepository } from '@infrastructure/orm/reposiories/body-scan-log-count.repository';
import { BodyScanLogCountUsecase } from '@use-cases/body-scan-log-count.usecase';
import { BodyGramServiceModule } from '@infrastructure/services/body-gram/body-gram-service.module';
import { BodyGramService } from '@infrastructure/services/body-gram/body-gram.service';
import { UserErrorRepository } from '@infrastructure/orm/reposiories/user-error.repository';
import { UserErrorUsecase } from '@use-cases/user-error.usecase';
import { UserAnswerRepository } from '@infrastructure/orm/reposiories/user-answer.repository';
import { UserAnswersUsecase } from '@use-cases/user-answers.usecase';
import { BodyMeasurementRepository } from '@infrastructure/orm/reposiories/body-measurement.repository';
import { BodyMeasurementUsecase } from '@use-cases/body-measurement.usecase';
import { ConfigService } from '@nestjs/config';
import { S3LoggerModule } from '@infrastructure/services/s3-logger/s3-logger-service.module';
import { AwsS3ServiceModule } from '@infrastructure/services/aws-s3/aws-s3-service.module';
import { ProfileUsecaseProvider } from './providers/profile.provider';
import { ProductRequestUsecaseProvider } from './providers/product-request.provider';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ProposalRepository } from '@infrastructure/orm/reposiories/proposal.repository';
import { ProfileRepository } from '@infrastructure/orm/reposiories/profile.repository';
import { UserRequestsUsecaseProvider } from './providers/user-requests.provider';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';

@Module({
  imports: [
    S3LoggerModule,
    AwsS3ServiceModule,
    RepositoriesModule,
    JwtServiceModule,
    BcryptServiceModule,
    BodyGramServiceModule,
    AiServiceModule,
    MailgunServiceModule,
    HttpModule,
  ],
})
export class InfrastructureUsecasesBridgeModule {
  static register(): DynamicModule {
    return {
      module: InfrastructureUsecasesBridgeModule,
      providers: [
        {
          inject: [
            ConfigService,
            UserRepository,
            BcryptService,
            JwtService,
            ConsumerRepository,
            MailGunService,
            BodyGramService,
            BODY_MEASUREMENT_USE_CASE,
            QUESTIONNAIRE_USECASE_PROXY,
            USER_ANSWERS_USECASE_PROXY,
          ],
          provide: AUTH_USECASE_PROXY,
          useFactory: (
            configService: ConfigService,
            userRepository: UserRepository,
            bcryptService: BcryptService,
            jwtService: JwtService,
            consumerRepository: ConsumerRepository,
            mailgunService: MailGunService,
            bodyGramService: BodyGramService,
            bodyMeasurementUseCase: UsecaseProxy<BodyMeasurementUsecase>,
            questionnaireUserCase: UsecaseProxy<QuestionnaireUsecase>,
            userAnswersUserCase: UsecaseProxy<UserAnswersUsecase>,
          ) =>
            new UsecaseProxy(
              new AuthUsecase(
                configService,
                userRepository,
                bcryptService,
                jwtService,
                consumerRepository,
                mailgunService,
                bodyGramService,
                bodyMeasurementUseCase,
                questionnaireUserCase,
                userAnswersUserCase,
              ),
            ),
        },
        {
          inject: [
            UserRepository,
            CONSUMER_USECASE_PROXY,
            INFLUENCER_USECASE_PROXY,
            QUESTIONNAIRE_USECASE_PROXY,
            BODY_MEASUREMENT_USE_CASE,
            USER_ANSWERS_USECASE_PROXY,
            JwtService,
            AUTH_USECASE_PROXY,
            HttpService,
            ConfigService,
          ],
          provide: USER_USECASE_PROXY,
          useFactory: (
            userRepository: UserRepository,
            consumerUseCase: UsecaseProxy<ConsumerUsecase>,
            influencerUseCase: UsecaseProxy<InfluencerUsecase>,
            questionnaireUseCase: UsecaseProxy<QuestionnaireUsecase>,
            bodyMeasurementUseCase: UsecaseProxy<BodyMeasurementUsecase>,
            userAnswersUseCase: UsecaseProxy<UserAnswersUsecase>,
            jwtService: JwtService,
            authUseCase: UsecaseProxy<AuthUsecase>,
            httpService: HttpService,
            configSerice: ConfigService,
          ) =>
            new UsecaseProxy(
              new UserUsecase(
                userRepository,
                consumerUseCase,
                influencerUseCase,
                questionnaireUseCase,
                bodyMeasurementUseCase,
                userAnswersUseCase,
                jwtService,
                authUseCase,
                httpService,
                configSerice,
              ),
            ),
        },
        {
          inject: [SocialIntegrationRepository, UserRepository],
          provide: INSTAGRAM_USECASE_PROXY,
          useFactory: (
            socialIntegrationRepository: SocialIntegrationRepository,
            userRepository: UserRepository,
          ) =>
            new UsecaseProxy(
              new InstagramUsecase(socialIntegrationRepository, userRepository),
            ),
        },
        {
          inject: [
            ConsumerRepository,
            InfluencerRepository,
            UserRepository,
            PostFavoriteRepository,
            PostRepository,
            ProductFavoriteRepository,
            CartRepository,
            QuestionnaireRepository,
            SearchRepository,
            FollowRepository,
            ReviewRepository,
            ProfileRepository,
            BODY_SCAN_LOG_COUNT_USECASE_PROXY,
            BODY_MEASUREMENT_USE_CASE,
            QUESTIONNAIRE_USECASE_PROXY,
          ],
          provide: CONSUMER_USECASE_PROXY,
          useFactory: (
            consumerRepository: ConsumerRepository,
            influencerRepository: InfluencerRepository,
            userRepository: UserRepository,
            postFavoriteRepository: PostFavoriteRepository,
            postRepository: PostRepository,
            productFavoriteRepository: ProductFavoriteRepository,
            cartRepository: CartRepository,
            questionnaireRepository: QuestionnaireRepository,
            searchRepository: SearchRepository,
            followRepository: FollowRepository,
            reviewRepository: ReviewRepository,
            profileRepository: ProfileRepository,
            bodyScanLogCountUseCase: UsecaseProxy<BodyScanLogCountUsecase>,
            bodyMeasurementUseCase: UsecaseProxy<BodyMeasurementUsecase>,
            questionnaireUseCase: UsecaseProxy<QuestionnaireUsecase>,
          ) =>
            new UsecaseProxy(
              new ConsumerUsecase(
                consumerRepository,
                influencerRepository,
                userRepository,
                postFavoriteRepository,
                postRepository,
                productFavoriteRepository,
                cartRepository,
                questionnaireRepository,
                searchRepository,
                followRepository,
                reviewRepository,
                profileRepository,
                bodyScanLogCountUseCase,
                bodyMeasurementUseCase,
                questionnaireUseCase,
              ),
            ),
        },
        {
          inject: [PostRepository, AiService, ConsumerRepository, INFLUENCER_USECASE_PROXY],
          provide: POST_USECASE_PROXY,
          useFactory: (
            postRepository: PostRepository,
            aiService: AiService,
            consumerRepository: ConsumerRepository,
            influencerUsecaseProxy: UsecaseProxy<InfluencerUsecase>,
          ) =>
            new UsecaseProxy(
              new PostUsecase(postRepository, aiService, consumerRepository, influencerUsecaseProxy),
            ),
        },
        {
          inject: [FollowRepository, UserRepository, NotificationRepository],
          provide: FOLLOW_USECASE_PROXY,
          useFactory: (
            followRepository: FollowRepository,
            userRepository: UserRepository,
            notificationRepo: NotificationRepository,
          ) =>
            new UsecaseProxy(
              new FollowUsecase(
                followRepository,
                userRepository,
                notificationRepo,
              ),
            ),
        },
        {
          inject: [
            InfluencerRepository,
            ConsumerRepository,
            FollowRepository,
            PostRepository,
            ProposalRepository,
            AffiliateProductRepository,
          ],
          provide: INFLUENCER_USECASE_PROXY,
          useFactory: (
            influencerRepository: InfluencerRepository,
            consumerRepository: ConsumerRepository,
            followRepository: FollowRepository,
            postRepository: PostRepository,
            proposalRepository: ProposalRepository,
            affiliateProductRepository: AffiliateProductRepository,
          ) =>
            new UsecaseProxy(
              new InfluencerUsecase(
                influencerRepository,
                consumerRepository,
                followRepository,
                postRepository,
                proposalRepository,
                affiliateProductRepository,
              ),
            ),
        },
        {
          inject: [
            ProductRepository,
            ReviewRepository,
            ConsumerRepository,
            ProductFavoriteRepository,
            AffiliateProductRepository,
          ],
          provide: PRODUCT_USECASE_PROXY,
          useFactory: (
            productRepository: ProductRepository,
            reviewRepository: ReviewRepository,
            consumerRepository: ConsumerRepository,
            productFavoriteRepository: ProductFavoriteRepository,
          ) =>
            new UsecaseProxy(
              new ProductUsecase(
                productRepository,
                reviewRepository,
                consumerRepository,
                productFavoriteRepository,
              ),
            ),
        },
        {
          inject: [CartRepository, ProductRepository, ConsumerRepository],
          provide: CART_USECASE_PROXY,
          useFactory: (
            cartRepository: CartRepository,
            productRepository: ProductRepository,
            consumerRepository: ConsumerRepository,
          ) =>
            new UsecaseProxy(
              new CartUsecase(
                cartRepository,
                productRepository,
                consumerRepository,
              ),
            ),
        },
        {
          inject: [QuestionnaireRepository, ConsumerRepository, UserRepository],
          provide: QUESTIONNAIRE_USECASE_PROXY,
          useFactory: (
            questionnaireRepository: QuestionnaireRepository,
            consumerRepository: ConsumerRepository,
            userRepository: UserRepository,
          ) =>
            new UsecaseProxy(
              new QuestionnaireUsecase(
                questionnaireRepository,
                consumerRepository,
                userRepository,
              ),
            ),
        },
        {
          inject: [SearchRepository, PostRepository],
          provide: SEARCH_USECASE_PROXY,
          useFactory: (
            searchRepository: SearchRepository,
            postRepository: PostRepository,
          ) =>
            new UsecaseProxy(
              new SearchUsecase(searchRepository, postRepository),
            ),
        },
        {
          inject: [
            FavouriteAffiliateProductRepository,
            UserRepository,
            AffiliateProductRepository,
          ],
          provide: FAVOURITE_AFFILIATE_PRODUCT_USECASE_PROXY,
          useFactory: (
            fapRepository: FavouriteAffiliateProductRepository,
            userRepository: UserRepository,
            affiliateProductRepository: AffiliateProductRepository,
          ) =>
            new UsecaseProxy(
              new FavouriteAffiliateProductUsecase(
                fapRepository,
                userRepository,
                affiliateProductRepository,
              ),
            ),
        },
        {
          inject: [BodyScanLogCountRepository, MailGunService],
          provide: BODY_SCAN_LOG_COUNT_USECASE_PROXY,
          useFactory: (
            bodyScanLogCountRepository: BodyScanLogCountRepository,
            mailGunService: MailGunService,
          ) =>
            new UsecaseProxy(
              new BodyScanLogCountUsecase(
                bodyScanLogCountRepository,
                mailGunService,
              ),
            ),
        },
        {
          inject: [UserErrorRepository],
          provide: USER_ERROR_USECASE_PROXY,
          useFactory: (userErrorRepository: UserErrorRepository) =>
            new UsecaseProxy(new UserErrorUsecase(userErrorRepository)),
        },
        {
          inject: [UserAnswerRepository, QUESTIONNAIRE_USECASE_PROXY],
          provide: USER_ANSWERS_USECASE_PROXY,
          useFactory: (
            userAnswersRepository: UserAnswerRepository,
            questionnaireUseCase: UsecaseProxy<QuestionnaireUsecase>,
          ) =>
            new UsecaseProxy(
              new UserAnswersUsecase(
                userAnswersRepository,
                questionnaireUseCase,
              ),
            ),
        },
        {
          inject: [BodyMeasurementRepository],
          provide: BODY_MEASUREMENT_USE_CASE,
          useFactory: (bodyMeasurementRepository: BodyMeasurementRepository) =>
            new UsecaseProxy(
              new BodyMeasurementUsecase(bodyMeasurementRepository),
            ),
        },
        ProfileUsecaseProvider(),
        ProductRequestUsecaseProvider(),
        UserRequestsUsecaseProvider(),
      ],
      exports: [
        AUTH_USECASE_PROXY,
        INSTAGRAM_USECASE_PROXY,
        CONSUMER_USECASE_PROXY,
        POST_USECASE_PROXY,
        PRODUCT_USECASE_PROXY,
        FOLLOW_USECASE_PROXY,
        INFLUENCER_USECASE_PROXY,
        CART_USECASE_PROXY,
        QUESTIONNAIRE_USECASE_PROXY,
        SEARCH_USECASE_PROXY,
        USER_USECASE_PROXY,
        FAVOURITE_AFFILIATE_PRODUCT_USECASE_PROXY,
        BODY_SCAN_LOG_COUNT_USECASE_PROXY,
        USER_ERROR_USECASE_PROXY,
        USER_ANSWERS_USECASE_PROXY,
        BODY_MEASUREMENT_USE_CASE,
        PROFILE_USECASE_PROXY,
        PRODUCT_REQUEST_USECASE_PROXY,
        USER_REQUESTS_USECASE_PROXY,
      ],
    };
  }
}
