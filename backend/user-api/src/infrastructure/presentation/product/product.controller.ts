import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, Inject, Param, ParseIntPipe, Post, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import UsecaseProxy, { PRODUCT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ProductUsecase } from '@use-cases/product.usecase';
import { ReviewDTO } from './product.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDTO, MarkProductFavouriteDTO, PostProductIdDTO, ProductIdDTO } from './product.dto'

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(
    @Inject(PRODUCT_USECASE_PROXY)
    private readonly productUsecaseProxy: UsecaseProxy<ProductUsecase>
  ) { }

  @Get('/favorite-post-product')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List favorite products with pagination' })
  @ApiResponse({ status: 200, description: 'Favorite products retrieved successfully.' })
  async listProductFavourite(@Query() pagination: PaginationDTO, @Request() req) {
    return this.productUsecaseProxy.getInstance().listProductFavorite(req.user?.consumer?.id, pagination.page, pagination.limit);
  }

  @Get('/mark-post-product-favorite')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark a product as favorite' })
  @ApiResponse({ status: 201, description: 'Product marked as favorite successfully.' })
  async markProductFavourite(@Query() params: MarkProductFavouriteDTO, @Request() req) {
    const userId = req.user.id;
    return this.productUsecaseProxy.getInstance().markProductFavourite(params.product_id, params.post_id, params.post_product_id, userId);
  }

  @Delete('/mark-post-product-unfavorite/:post_product_id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Unmark a product as favorite' })
  @ApiResponse({ status: 200, description: 'Product unmarked as favorite successfully.' })
  async markProductUnFavourite(@Param() params: PostProductIdDTO, @Request() req) {
    return this.productUsecaseProxy.getInstance().markProductUnFavourite(params.post_product_id, req.user?.consumer?.id);
  }

  @Post('/review/:id')
  @ApiOperation({ summary: 'Add a review to a product' })
  @ApiResponse({ status: 201, description: 'Review added successfully.' })
  async addReview(@Param() params: ProductIdDTO, @Body() payload: ReviewDTO, @Request() req: any) {
    const userId = req.user.id;
    return this.productUsecaseProxy.getInstance().addReview(payload, userId);
  }

  @Get('/review/:id')
  @ApiOperation({ summary: 'Delete a review by its ID' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully.' })
  async DeleteReviewById(@Param() params: ProductIdDTO) {
    return this.productUsecaseProxy.getInstance().deleteReview(params.id);
  }
}
