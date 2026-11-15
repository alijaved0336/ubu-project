import { AffiliateProductRepository } from '@infrastructure/orm/reposiories/affiliate-product.repository';
import { AffliateRepository } from '@infrastructure/orm/reposiories/affliate.repository';
import { FavouriteAffiliateProductRepository } from '@infrastructure/orm/reposiories/favourite-affiliate-product-repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { PostProductsRepository } from '@infrastructure/orm/reposiories/post-product.repository';
import { PostRepository } from '@infrastructure/orm/reposiories/post.repository';
import { ProductRepository } from '@infrastructure/orm/reposiories/product.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { AwsSpApiService } from '@infrastructure/services/aws-sp-api/aws-sp.service';
import { ImageService } from '@infrastructure/services/image/image.service';
import { VideoService } from '@infrastructure/services/video/video.service';
import { PostsUsecase } from '@use-cases/posts.usecase';
import UsecaseProxy, { POST_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function PostUsecaseProvider() {
  return {
    inject: [
      InfluencerRepository,
      PostRepository,
      ProductRepository,
      PostProductsRepository,
      UserRepository,
      VideoService,
      AwsS3Service,
      AffliateRepository,
      AwsSpApiService,
      AffiliateProductRepository,
      ImageService,
      FavouriteAffiliateProductRepository,
    ],
    provide: POST_USECASE_PROXY,
    useFactory: (
      influencerRepository: InfluencerRepository,
      postRepository: PostRepository,
      productRepository: ProductRepository,
      postProductRepository: PostProductsRepository,
      userRepo: UserRepository,
      videoService: VideoService,
      awsService: AwsS3Service,
      affliateRepository: AffliateRepository,
      awsSpApiService: AwsSpApiService,
      affiliateProductRepository: AffiliateProductRepository,
      imageService: ImageService,
      fapRepository: FavouriteAffiliateProductRepository,
    ) =>
      new UsecaseProxy(
        new PostsUsecase(
          influencerRepository,
          postRepository,
          productRepository,
          postProductRepository,
          userRepo,
          awsService,
          affliateRepository,
          awsSpApiService,
          videoService,
          affiliateProductRepository,
          imageService,
          fapRepository,
        ),
      ),
  };
}
