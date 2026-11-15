import { Body, ClassSerializerInterceptor, Controller, Get, Inject, Param, Patch, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { BulkUpdateProductRequestStatusDto, CreateProductRequestDto, UpdateProductRequestStatusDto } from './product-request.dto';
import UsecaseProxy, { PRODUCT_REQUEST_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { ProductRequestUsecase } from '@use-cases/product-request.usecase';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('product-requests')
@ApiBearerAuth()
@Controller('product-requests')
export class ProductRequestController {
  constructor(
    @Inject(PRODUCT_REQUEST_USECASE_PROXY)
    private readonly productRequestUsecaseProxy: UsecaseProxy<ProductRequestUsecase>,
  ) {}

  @Get()
  fetchByUser(@Request() req: any) {
    const userId = req.user.id
    return this.productRequestUsecaseProxy.getInstance().fetchByUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new Request' })
  @ApiResponse({ status: 201, description: 'Request created successfully.' })
  async create(@Request() req: any, @Body() body: CreateProductRequestDto) {
    const userId = req.user.id;
    return await this.productRequestUsecaseProxy.getInstance().create(userId, body);
  }

  // FUNCTIONS FOR PARENT USER
  @Patch('update/status')
  updateStatus(@Request() req: any, @Body() body: UpdateProductRequestStatusDto) {
    const userId = req.user.id;
    return this.productRequestUsecaseProxy.getInstance().updateStatus(userId, body);
  }

  @Patch('bulk/status')
  bulkUpdateStatus(@Request() req: any, @Body() body: BulkUpdateProductRequestStatusDto) {
    const userId = req.user.id;

    return this.productRequestUsecaseProxy.getInstance().updateStatusBulk(userId, body);
  }


}