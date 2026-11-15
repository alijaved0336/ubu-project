import { ClassSerializerInterceptor, Controller, Get, Inject, UseInterceptors } from '@nestjs/common';

import UsecaseProxy, { COMMON_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { CommonUsecase } from '@use-cases/common.usecase';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(
    @Inject(COMMON_USECASE_PROXY)
    private readonly commonUsecaseProxy: UsecaseProxy<CommonUsecase>,
  ) {}

  @Get()
  create() {
    return this.commonUsecaseProxy.getInstance().findAllCategories();
  }
}
