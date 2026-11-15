import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, Inject, Param, Patch, Post, Query, Req, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import UsecaseProxy, { FOLLOW_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { FollowUsecase } from '@use-cases/follow.usecase';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('follows')
@ApiBearerAuth()
@Controller('follows')
export class FollowController {
  constructor(
    @Inject(FOLLOW_USECASE_PROXY)
    private readonly followUsecaseProxy: UsecaseProxy<FollowUsecase>
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOperation({ summary: 'Get all users followed by the current user' })
  @ApiResponse({ status: 200, description: 'List of followed users retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async followed(@Req() request) {
    return this.followUsecaseProxy.getInstance().getFollowedInfluencers(request.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:followee_id')
  @ApiOperation({ summary: 'Follow a user by their ID' })
  @ApiParam({ name: 'followee_id', description: 'ID of the user to follow', type: 'number' })
  @ApiResponse({ status: 201, description: 'User followed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async follow(@Req() request, @Param('followee_id') followee_id: number) {
    return this.followUsecaseProxy.getInstance().follow(followee_id, request.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:followee_id')
  @ApiOperation({ summary: 'Unfollow a user by their ID' })
  @ApiParam({ name: 'followee_id', description: 'ID of the user to unfollow', type: 'number' })
  @ApiResponse({ status: 200, description: 'User unfollowed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async unFollow(@Req() request, @Param('followee_id') followee_id: number) {
    return this.followUsecaseProxy.getInstance().unFollow(followee_id, request.user?.id);
  }
}
