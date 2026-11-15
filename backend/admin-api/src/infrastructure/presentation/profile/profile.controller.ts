import { Controller, Get, Param, Query, UseGuards, Request, ParseIntPipe, ForbiddenException, ValidationPipe, UsePipes, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  GetProfilesQueryDto,
  ProfileDetailDto,
  ProfileSummaryDto,
  ProfileStatsDto,
  ApiResponseDto,
  ErrorResponseDto,
  ProfileFinalDetailDto,
} from './profile.dto';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ProfilePresenter, ResponseBuilder } from './profile.presenter';
import { Profile } from '@infrastructure/orm/entities/profile.entity';
import UsecaseProxy, { PROFILE_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { ProfileUseCase } from '@use-cases/profile.usecase';

@ApiTags('Profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profiles')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ProfileController {
  constructor(
    @Inject(PROFILE_USECASE_PROXY)
    private readonly profileUseCase: UsecaseProxy<ProfileUseCase>,
    private readonly presenter: ProfilePresenter,
    private readonly responseBuilder: ResponseBuilder,
  ) {}

  @Get('my-profiles')
  @ApiOperation({
    summary: 'Get all profiles created by the authenticated user',
    description: 'Retrieve all profiles created by the authenticated parent user with optional filtering.',
  })
  @ApiQuery({
    name: 'include_child_details',
    description: 'Include child user details in response',
    required: false,
    type: 'boolean',
  })
  @ApiQuery({
    name: 'active_only',
    description: 'Filter by active profiles only',
    required: false,
    type: 'boolean',
  })
  @ApiQuery({
    name: 'has_child_user',
    description: 'Filter profiles with/without linked child users',
    required: false,
    type: 'boolean',
  })
  @ApiResponse({
    status: 200,
    description: 'Profiles retrieved successfully',
    type: ApiResponseDto<ProfileSummaryDto[]>,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  async getMyProfiles(
    @Query() queryDto: GetProfilesQueryDto,
    @Request() req: any,
  ): Promise<ApiResponseDto<ProfileSummaryDto[] | ProfileDetailDto[] | ProfileFinalDetailDto>> {
    const parentUserId = req.user.id;
    let profiles = await this.profileUseCase.getInstance().getProfilesByParentId(parentUserId, queryDto.active_only || false);
    // Apply filters
    profiles = this.presenter.filterProfiles(profiles as Profile[], {
      activeOnly: queryDto.active_only,
      hasChildUser: queryDto.has_child_user,
    });

    const presentedProfiles = queryDto.include_child_details
      ? this.presenter.presentProfileDetails(profiles as Profile[])
      : this.presenter.presentProfileSummaries(profiles as Profile[]);

    return this.responseBuilder.success(presentedProfiles, `Retrieved ${profiles.length} profiles successfully`);
  }

  @Get('my-stats')
  @ApiOperation({
    summary: 'Get profile statistics for authenticated user',
    description: 'Get statistics about profiles created by the authenticated parent user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile statistics retrieved successfully',
    type: ApiResponseDto<ProfileStatsDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  async getMyProfileStats(@Request() req: any): Promise<ApiResponseDto<ProfileStatsDto>> {
    const parentUserId = req.user.id;
    const profiles = await this.profileUseCase.getInstance().getProfilesByParentId(parentUserId, true);
    const stats = this.presenter.presentProfileStats(profiles as Profile[]);

    return this.responseBuilder.success(stats, 'Profile statistics retrieved successfully');
  }

  @Get('parent/:parentId')
  @ApiOperation({
    summary: 'Get all profiles by parent user ID',
    description: 'Retrieve all profiles for a specific parent user. Admin access or own profiles only.',
  })
  @ApiParam({
    name: 'parentId',
    description: 'Parent user ID',
    type: 'number',
  })
  @ApiQuery({
    name: 'include_child_details',
    description: 'Include child user details in response',
    required: false,
    type: 'boolean',
  })
  @ApiResponse({
    status: 200,
    description: 'Profiles retrieved successfully',
    type: ApiResponseDto<ProfileSummaryDto[]>,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only access your own profiles',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  async getProfilesByParentId(
    @Param('parentId', ParseIntPipe) parentId: number,
    @Query() queryDto: GetProfilesQueryDto,
    @Request() req: any,
  ): Promise<ApiResponseDto<ProfileSummaryDto[] | ProfileDetailDto[] | ProfileFinalDetailDto>> {
    const requestingUserId = req.user.id;

    // Security check: users can only access their own profiles unless admin
    if (parentId !== requestingUserId && !req.user.is_admin) {
      throw new ForbiddenException('You can only access your own profiles');
    }

    let profiles = await this.profileUseCase.getInstance().getProfilesByParentId(parentId, true);

    // Apply filters
    profiles = this.presenter.filterProfiles(profiles as Profile[], {
      activeOnly: queryDto.active_only,
      hasChildUser: queryDto.has_child_user,
    });

    const presentedProfiles = queryDto.include_child_details
      ? this.presenter.presentProfileDetails(profiles as Profile[])
      : this.presenter.presentProfileSummaries(profiles as Profile[]);

    return this.responseBuilder.success(presentedProfiles, `Retrieved ${profiles.length} profiles successfully`);
  }

  @Get('child/:childId')
  @ApiOperation({
    summary: 'Get profile by child user ID',
    description: 'Retrieve a profile associated with a specific child user.',
  })
  @ApiParam({
    name: 'childId',
    description: 'Child user ID',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: ApiResponseDto<ProfileDetailDto>,
  })
  @ApiResponse({
    status: 404,
    description: 'Profile not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  async getProfileByChildId(@Param('childId', ParseIntPipe) childId: number): Promise<ApiResponseDto<ProfileDetailDto>> {
    const profile = await this.profileUseCase.getInstance().getProfileByChildId(childId);
    const profileDetail = this.presenter.presentProfileDetail(profile as Profile);

    return this.responseBuilder.success(profileDetail, 'Profile retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get profile by ID',
    description: 'Retrieve a specific profile by its ID. Access restricted to parent or child users.',
  })
  @ApiParam({
    name: 'id',
    description: 'Profile ID',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: ApiResponseDto<ProfileDetailDto>,
  })
  @ApiResponse({
    status: 404,
    description: 'Profile not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You do not have permission to view this profile',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  async getProfileById(@Param('id', ParseIntPipe) id: number, @Request() req: any): Promise<ApiResponseDto<ProfileDetailDto>> {
    const requestingUserId = req.user.id;
    const profile = await this.profileUseCase.getInstance().getProfileById(id, requestingUserId);
    const profileDetail = this.presenter.presentProfileDetail(profile as Profile);

    return this.responseBuilder.success(profileDetail, 'Profile retrieved successfully');
  }
}
