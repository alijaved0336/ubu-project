import { Controller, Inject, Post, Get, Body, Put, Delete, Param, UseGuards, UseInterceptors, UploadedFiles, Request, Query } from '@nestjs/common';
import { Products } from '@infrastructure/orm/entities/product.entity';
import UsecaseProxy, { PRODUCT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { ProductUsecase } from '@use-cases/product.usecase';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileSizeInterceptor } from '../UploadFiles/max-file-size.validator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RequiresPlan } from '@infrastructure/subscription/requires-plan.decorator';
import { PlanType } from '@infrastructure/orm/entities/ubuSubscription.entity';
import { SubscriptionGuard } from '@infrastructure/guards/subscription.guard';

@Controller('products')
@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(
    @Inject(PRODUCT_USECASE_PROXY)
    private readonly productUsecaseProxy: UsecaseProxy<ProductUsecase>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all products' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all products.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term (optional)',
  })
  findAll(@Request() req: any, @Query('page') page: string, @Query('limit') limit: string, @Query('search') search?: string) {
    console.log('Pagess are  :::: ', page, limit);
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const userId = req.user.id; // Assuming the user's ID is stored in req.user.id
    return this.productUsecaseProxy.getInstance().findAll(userId, pageNumber, limitNumber, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the product.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to retrieve',
    type: Number,
  })
  async findOne(@Param('id') id: number) {
    return {
      product: await this.productUsecaseProxy.getInstance().findOne(+id),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @UseInterceptors(
    FilesInterceptor('files', 10),
    new FileSizeInterceptor(20 * 1024 * 1024), // 20MB in bytes
  )
  async create(@Request() req: any, @Body() createProductDto: CreateProductDto, @UploadedFiles() files) {
    const userId = req.user.id;
    return {
      product: await this.productUsecaseProxy.getInstance().create(createProductDto, files, userId),
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to update',
    type: Number,
  })
  @UseInterceptors(
    FilesInterceptor('files', 10),
    new FileSizeInterceptor(20 * 1024 * 1024), // 20MB in bytes
  )
  async update(@Param('id') id: number, @UploadedFiles() files, @Body() updateProductDto: UpdateProductDto) {
    return {
      product: await this.productUsecaseProxy.getInstance().update(id, updateProductDto, files),
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to delete',
    type: Number,
  })
  remove(@Param('id') id: number): Promise<void> {
    return this.productUsecaseProxy.getInstance().remove(id);
  }

  @Get('/brand/:brandId')
  @ApiOperation({ summary: 'Retrieve products by brand ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved products by brand ID.',
  })
  @ApiParam({
    name: 'brandId',
    description: 'The ID of the brand',
    type: Number,
  })
  async getProductsByBrandId(@Param('brandId') brandId: number) {
    return this.productUsecaseProxy.getInstance().getProductsByBrand(brandId);
  }
}
