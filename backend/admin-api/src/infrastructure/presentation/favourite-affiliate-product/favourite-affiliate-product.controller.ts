import { CreateFavoriteAffiliateProductDto } from './fap-dto';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { FavouriteAffiliateProductUsecase } from '@use-cases/favourite-affiliate-product.usecase';

import { Controller, Request, Get, UseGuards, ClassSerializerInterceptor, Inject, UseInterceptors, Post, Body, Param, Delete } from '@nestjs/common';

import UsecaseProxy, { FAVOURITE_AFFILIATE_PRODUCT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('fav_affiliate_product')
@ApiTags('FavouriteAffiliateProduct')
export class FavouriteAffiliateProductController {
  constructor(
    @Inject(FAVOURITE_AFFILIATE_PRODUCT_USECASE_PROXY)
    private readonly fapUsecaseProxy: UsecaseProxy<FavouriteAffiliateProductUsecase>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new favourite' })
  @ApiResponse({ status: 201, description: 'Favourite created successfully.' })
  create(@Request() req: any, @Body() createFavouriteDto: CreateFavoriteAffiliateProductDto): Promise<any> {
    const userId = req.user.id;
    return this.fapUsecaseProxy.getInstance().create(createFavouriteDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all favourites' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved favourites.',
  })
  async findAll(@Request() req: any): Promise<any> {
    const userId = req.user.id;
    return this.fapUsecaseProxy.getInstance().findAll(userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a specific favourite by ID' })
  @ApiResponse({ status: 200, description: 'Favourite deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Favourite not found.' })
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.fapUsecaseProxy.getInstance().remove(+id, userId);
  }
}
