import { Body, ClassSerializerInterceptor, Controller, Get, Inject, Param, Post, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import UsecaseProxy, { BRAND_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BrandUsecase } from '@use-cases/brand.usecase';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('brand')
@ApiBearerAuth()
export class BrandController {
  constructor(
    @Inject(BRAND_USECASE_PROXY)
    private readonly brandUsecaseProxy: UsecaseProxy<BrandUsecase>,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.brandUsecaseProxy.getInstance().findOne(id);
  }

  @Get('')
  findAllWithAnswers(@Request() req: any, @Query('page') page: string, @Query('limit') limit: string, @Query('search') search?: string) {
    console.log('Pagess are  :::: ', page, limit);
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.brandUsecaseProxy.getInstance().findAllWithAnswers(pageNumber, limitNumber, search);
  }

  @Post('/filtered_data')
  getFilteredData(@Body() payload) {
    return this.brandUsecaseProxy.getInstance().getFilteredData(payload);
  }
}
