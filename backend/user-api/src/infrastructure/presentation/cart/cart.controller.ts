import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Inject, Param, ParseIntPipe, Patch, Post, Query, Req, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import UsecaseProxy, { CART_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { PostUsecase } from '@use-cases/post.usecase';
import { Posts } from '@infrastructure/orm/entities/post.entity';
import { CartUsecase } from '@use-cases/cart.usecase';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationDTO, CartIdDTO, AddToCartDTO } from './cart.dto'; // Import DTO

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(
    @Inject(CART_USECASE_PROXY)
    private readonly cartUsecaseProxy: UsecaseProxy<CartUsecase>
  ) { }

  @Get('/all-carts')
  @ApiOperation({ summary: 'Get all carts for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Carts retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', example: 10 })
  async findAll(
    @Query() pagination: PaginationDTO,
    @Request() req: any
  ) {
    const user = req.user.id;
    return this.cartUsecaseProxy.getInstance().findAll(user, pagination.page, pagination.limit);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a cart item by its ID' })
  @ApiResponse({ status: 200, description: 'Cart item retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findById(@Param() params: CartIdDTO) {
    return this.cartUsecaseProxy.getInstance().findById(params.id);
  }

  @Post('/:pid')
  @HttpCode(201)
  @ApiOperation({ summary: 'Add a product to the cart' })
  @ApiResponse({ status: 201, description: 'Product added to cart successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async AddToCart(@Param() params: AddToCartDTO, @Request() req: any) {
    const userId = req.user.id;
    return this.cartUsecaseProxy.getInstance().addToCart(params.pid, userId);
  }

  @Get('/remove_cart/:id')
  @ApiOperation({ summary: 'Remove a cart item by its ID' })
  @ApiResponse({ status: 200, description: 'Cart item removed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeFromCart(@Param() params: CartIdDTO) {
    return this.cartUsecaseProxy.getInstance().removeFromCart(params.id);
  }
}
