import { Body, Controller, Get, Inject, Post, Query, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import UsecaseProxy, { AWS_SP_API_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { AwsSpApiUsecase } from '@use-cases/aws-sp-api.usecase';
import { FetchAwsProductDto, FetchProductDetailDto, FetchProductDto } from './fetchProductDetail.dto';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileSizeInterceptor } from '../UploadFiles/max-file-size.validator';

@Controller('aws')
@UseGuards(JwtAuthGuard)
export class AwsSPApiController {
  constructor(
    @Inject(AWS_SP_API_USECASE_PROXY)
    private readonly spApiUseCaseProxy: UsecaseProxy<AwsSpApiUsecase>,
  ) {}

  @Get('/authentication')
  async awsAuthenticatedRedirectURL() {
    return this.spApiUseCaseProxy.getInstance().getAuthenticatedUrl(1); // need to pass brand id in future
  }

  @Get('/callback')
  async data(@Query() query: any) {
    return this.spApiUseCaseProxy.getInstance().getCredentialsFromAws(query, 1);
  }

  @Get('/fetch_active_lsitings')
  async activeListing(@Query('brand_id') brand_id: number) {
    return this.spApiUseCaseProxy.getInstance().fetchActiveListings(brand_id);
  }

  @Get('/fetch-afliated-link')
  async fetchAffliatedLink(@Query() query: FetchProductDetailDto) {
    const { url } = query;
    return this.spApiUseCaseProxy.getInstance().addAffiliateLink(url);
  }

  @Get('/publish')
  async PublishProductAndPostDetail(@Request() req: any, @Query() query: FetchProductDetailDto) {
    const { save_data } = query;
    const brandId = parseInt(req.query.brandId);
    const userId = req.user.id;
    const { url } = query;
    return this.spApiUseCaseProxy.getInstance().publishPosttoUBUAndInsta(url, userId, save_data, brandId);
  }

  @Get('/fetch-product-detail')
  async fetchProductDetail(@Request() req: any, @Query() query: FetchProductDto) {
    const { campaign_id } = query;
    return this.spApiUseCaseProxy.getInstance().fetchProductDetail(campaign_id);
  }

  @Get('/fetch-aws-product')
  async fetchAwsProduct(@Request() req: any, @Query() query: FetchAwsProductDto) {
    const { amazon_link } = query;
    return this.spApiUseCaseProxy.getInstance().fetchAwsProduct(amazon_link);
  }

  @UseInterceptors(
    FilesInterceptor('media', 9),
    new FileSizeInterceptor(10 * 1024 * 1024), // 10MB in bytes
  )
  @Post('/local_publish/instagram')
  async PublishCampaignToInstagram(@Request() req: any, @Body() body: any, @UploadedFiles() media) {
    const userId = req.user.id;
    return this.spApiUseCaseProxy.getInstance().publishLocalToInstagram(body, userId, media);
  }

  @Post('/amazon_publish')
  async PublishCampaignAmazonToInstagram(@Request() req: any, @Body() body: any) {
    const userId = req.user.id;
    return this.spApiUseCaseProxy.getInstance().publishAmazonToInstagram(body, userId);
  }
}
