import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { Controller, Post, Body, UseGuards, ClassSerializerInterceptor, Inject, UseInterceptors, Get, Param } from '@nestjs/common';
import UsecaseProxy, { ADMIN_REVIEW_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminReviewUsecase } from '@use-cases/admin-review.usecase';
import { CreateAdminReviewDto } from './admin-review.dto';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('reviews')
@ApiTags('Reviews')
@ApiBearerAuth()
export class AdminReviewsController {
  constructor(
    @Inject(ADMIN_REVIEW_USECASE_PROXY)
    private readonly adminReviewsUsecase: UsecaseProxy<AdminReviewUsecase>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully.' })
  create(@Body() createAdminReviewtDto: CreateAdminReviewDto): Promise<any> {
    return this.adminReviewsUsecase.getInstance().create(createAdminReviewtDto);
  }

  @Get('get-brand-reviews/:id')
  findBrandReviewsByBrandId(@Param('id') id: number) {
    return this.adminReviewsUsecase.getInstance().findBrandReviewsByBrandId(id);
  }

  @Get('get-influencer-reviews/:id')
  findInfluencerReviewsByInfluencerId(@Param('id') id: number) {
    return this.adminReviewsUsecase.getInstance().findInfluencerReviewsByInfluencerId(id);
  }
}
