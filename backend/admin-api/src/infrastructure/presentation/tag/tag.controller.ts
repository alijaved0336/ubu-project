import { TagsUsecase } from '@use-cases/tag.usecase';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';

import { Controller, Request, Get, UseGuards, ClassSerializerInterceptor, Inject, UseInterceptors } from '@nestjs/common';

import UsecaseProxy, { TAG_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('tags')
@ApiTags('Tags')
export class TagsController {
  constructor(
    @Inject(TAG_USECASE_PROXY)
    private readonly tagsUsecaseProxy: UsecaseProxy<TagsUsecase>,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all tags by user id' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved tags.' })
  async getAllTagsByUserId(@Request() req: any) {
    return this.tagsUsecaseProxy.getInstance().find({
      where: {
        user: {
          id: req.user.id,
        },
      },
      order: {
        tagName: 'ASC',
      },
    });
  }

  @Get('public')
  @ApiOperation({ summary: 'Retrieve all tags' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved tags.' })
  async getAllTags() {
    return this.tagsUsecaseProxy.getInstance().find({
      order: {
        tagName: 'ASC',
      },
    });
  }
}
