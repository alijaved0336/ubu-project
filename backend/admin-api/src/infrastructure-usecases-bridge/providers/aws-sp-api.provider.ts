import { AffliateProductableRepository } from '@infrastructure/orm/reposiories/affliate-productable.repository';
import { AffliateRepository } from '@infrastructure/orm/reposiories/affliate.repository';
import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { ExhibitDocumentRepository } from '@infrastructure/orm/reposiories/exhibit-document.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { OAuthCredentialsRepository } from '@infrastructure/orm/reposiories/oath-credentials.repository';
import { SocialIntegrationRepository } from '@infrastructure/orm/reposiories/social-integration.repository';
import { CampaignQueueService } from '@infrastructure/queue/queue.service';
import { AwsPaApiService } from '@infrastructure/services/aws-pa-api/aws-pa.service';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { AwsSpApiService } from '@infrastructure/services/aws-sp-api/aws-sp.service';
import { PostMiddleware } from '@infrastructure/services/common-middleware/post.middleware';
import { ProductMiddleware } from '@infrastructure/services/common-middleware/product.middleware';
import { AwsSpApiUsecase } from '@use-cases/aws-sp-api.usecase';
import UsecaseProxy, { AWS_SP_API_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function AwsSpApiUsecaseProvider() {
  return {
    inject: [
      BrandRepository,
      AwsSpApiService,
      OAuthCredentialsRepository,
      ProductMiddleware,
      AffliateRepository,
      SocialIntegrationRepository,
      PostMiddleware,
      InfluencerRepository,
      ExhibitDocumentRepository,
      CampaignRepository,
      CampaignQueueService,
      AwsS3Service,
      AffliateProductableRepository,
      AwsPaApiService,
    ],
    provide: AWS_SP_API_USECASE_PROXY,
    useFactory: (
      brandRepository: BrandRepository,
      awsSpApiService: AwsSpApiService,
      oAuthCredentialsRepository: OAuthCredentialsRepository,
      productMiddleware: ProductMiddleware,
      affliateRepository: AffliateRepository,
      socialIntegrationRepository: SocialIntegrationRepository,
      postMiddleware: PostMiddleware,
      influencerRepository: InfluencerRepository,
      exhibitDocumentRepository: ExhibitDocumentRepository,
      campaignRepository: CampaignRepository,
      publishCampign: CampaignQueueService,
      awsService: AwsS3Service,
      affliateProductableRepository: AffliateProductableRepository,
      awsPaApiService: AwsPaApiService,
    ) =>
      new UsecaseProxy(
        new AwsSpApiUsecase(
          brandRepository,
          awsSpApiService,
          oAuthCredentialsRepository,
          productMiddleware,
          affliateRepository,
          socialIntegrationRepository,
          postMiddleware,
          influencerRepository,
          campaignRepository,
          publishCampign,
          awsService,
          affliateProductableRepository,
          awsPaApiService,
        ),
      ),
  };
}
