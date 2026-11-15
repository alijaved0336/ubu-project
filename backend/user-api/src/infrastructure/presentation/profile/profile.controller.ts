import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  ForbiddenException,
  ValidationPipe,
  UsePipes,
  Inject,
  Delete,
  Put,
  ParseBoolPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateProfileDto,
  GetProfilesQueryDto,
  ProfileDetailDto,
  ProfileSummaryDto,
  ProfileStatsDto,
  ApiResponseDto,
  ErrorResponseDto,
  CombinedUserProfileDto,
  ProfileFinalDetailDto,
  UpdatedCombinedUserProfileDTO,
  GetRevertProfilesQueryDto,
} from './profile.dto';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ProfilePresenter, ResponseBuilder } from './profile.presenter';
import { Profile } from '@infrastructure/orm/entities/profile.entity';
import UsecaseProxy, {
  AUTH_USECASE_PROXY,
  PROFILE_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import { AuthUsecase } from '@use-cases/auth.usecase';
import { DependantDefaultsPipe } from '@infrastructure/pipe/DependantUserPipe.pipe';
import { ProfileUseCase, UnlinkResult } from '@use-cases/profile.usecase';
import { Bool } from 'aws-sdk/clients/clouddirectory';

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


  @Get('revert-profile')
  async revertProfile(
    @Query('user_id', ParseIntPipe) userId: number,
    @Query('profile_id', ParseIntPipe) profileId: number,
    @Request() req: any,
  ) {
    const queryDto = { user_id: userId, profile_id: profileId };
    return this.profileUseCase.getInstance().revertProfile(queryDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new profile',
    description:
      'Create a new profile for the authenticated parent user. Maximum 5 profiles allowed per parent.',
  })
  @ApiResponse({
    status: 201,
    description: 'Profile created successfully',
    type: ApiResponseDto<ProfileDetailDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Maximum profiles limit reached or invalid data',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  async createProfile(
    @Body() createProfileDto: CreateProfileDto,
    @Request() req: any,
  ): Promise<ApiResponseDto<ProfileDetailDto>> {
    const parentUserId = req.user.id;
    const profile = await this.profileUseCase
      .getInstance()
      .createProfile(createProfileDto, parentUserId);
    const profileDetail = this.presenter.presentProfileDetail(
      profile as Profile,
    );

    return this.responseBuilder.success(
      profileDetail,
      'Profile created successfully',
    );
  }

  @Get('my-profiles')
  @ApiOperation({
    summary: 'Get all profiles created by the authenticated user',
    description:
      'Retrieve all profiles created by the authenticated parent user with optional filtering.',
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
  ): Promise<
    ApiResponseDto<
      ProfileSummaryDto[] | ProfileDetailDto[] | ProfileFinalDetailDto
    >
  > {
    const parentUserId = req.user.id;
    let profiles = await this.profileUseCase
      .getInstance()
      .getProfilesByParentId(parentUserId, queryDto.active_only || false);

    // Apply filters
    profiles = this.presenter.filterProfiles(profiles as Profile[], {
      activeOnly: queryDto.active_only,
      hasChildUser: queryDto.has_child_user,
    });

    // console.log("profiles---", profiles)

    const presentedProfiles = queryDto.include_child_details
      ? this.presenter.presentProfileDetails(profiles as Profile[])
      : this.presenter.presentProfileSummaries(profiles as Profile[]);

    return this.responseBuilder.success(
      presentedProfiles,
      `Retrieved ${profiles.length} profiles successfully`,
    );
  }

  @Get('my-stats')
  @ApiOperation({
    summary: 'Get profile statistics for authenticated user',
    description:
      'Get statistics about profiles created by the authenticated parent user.',
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
  async getMyProfileStats(
    @Request() req: any,
  ): Promise<ApiResponseDto<ProfileStatsDto>> {
    const parentUserId = req.user.id;
    const profiles = await this.profileUseCase
      .getInstance()
      .getProfilesByParentId(parentUserId, true);
    const stats = this.presenter.presentProfileStats(profiles as Profile[]);

    return this.responseBuilder.success(
      stats,
      'Profile statistics retrieved successfully',
    );
  }

  @Get('parent/:parentId')
  @ApiOperation({
    summary: 'Get all profiles by parent user ID',
    description:
      'Retrieve all profiles for a specific parent user. Admin access or own profiles only.',
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
  ): Promise<
    ApiResponseDto<
      ProfileSummaryDto[] | ProfileDetailDto[] | ProfileFinalDetailDto
    >
  > {
    const requestingUserId = req.user.id;

    // Security check: users can only access their own profiles unless admin
    if (parentId !== requestingUserId && !req.user.is_admin) {
      throw new ForbiddenException('You can only access your own profiles');
    }

    let profiles = await this.profileUseCase
      .getInstance()
      .getProfilesByParentId(parentId, true);

    // Apply filters
    profiles = this.presenter.filterProfiles(profiles as Profile[], {
      activeOnly: queryDto.active_only,
      hasChildUser: queryDto.has_child_user,
    });

    const presentedProfiles = queryDto.include_child_details
      ? this.presenter.presentProfileDetails(profiles as Profile[])
      : this.presenter.presentProfileSummaries(profiles as Profile[]);

    return this.responseBuilder.success(
      presentedProfiles,
      `Retrieved ${profiles.length} profiles successfully`,
    );
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
  async getProfileByChildId(
    @Param('childId', ParseIntPipe) childId: number,
  ): Promise<ApiResponseDto<ProfileDetailDto>> {
    const profile = await this.profileUseCase
      .getInstance()
      .getProfileByChildId(childId);
    const profileDetail = this.presenter.presentProfileDetail(
      profile as Profile,
    );

    return this.responseBuilder.success(
      profileDetail,
      'Profile retrieved successfully',
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get profile by ID',
    description:
      'Retrieve a specific profile by its ID. Access restricted to parent or child users.',
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
  async getProfileById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<ApiResponseDto<ProfileDetailDto>> {
    const requestingUserId = req.user.id;
    const profile = await this.profileUseCase
      .getInstance()
      .getProfileById(id, requestingUserId);
    const profileDetail = this.presenter.presentProfileDetail(
      profile as Profile,
    );

    return this.responseBuilder.success(
      profileDetail,
      'Profile retrieved successfully',
    );
  }

  @Post('create-child-user')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a child user and link to profile',
    description:
      'Create a new child user account and optionally link to an existing profile or create a new one.',
  })
  @ApiResponse({
    status: 201,
    description: 'Child user created and linked successfully',
    type: ApiResponseDto<ProfileDetailDto>,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - Invalid data or profile already has a child user',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - You can only create child users for your own profiles',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  async createChildUser(
    @Body(DependantDefaultsPipe) combinedUserProfileDto: CombinedUserProfileDto,
    @Request() req: any,
  ) {
    const parentUserId = req.user.id;
    const profile = await this.profileUseCase
      .getInstance()
      .createChildUserAndLinkToProfile(combinedUserProfileDto, parentUserId);

    // return this.responseBuilder.success(
    //   profile,
    //   'Child user created and linked successfully',
    // ); //returning response builder

    return profile;
  }
  @Delete('delete-profile/:profileId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete profile and associated child users',
    description:
      'Delete a profile and all associated child users. This action is irreversible.',
  })
  @ApiParam({
    name: 'profileId',
    description: 'ID of the profile to delete',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile and child users deleted successfully',
    type: ApiResponseDto<{ message: string }>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid profile ID',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only delete your own profiles',
    type: ErrorResponseDto,
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
  async deleteProfile(
    @Param('profileId') profileId: number,
    @Param('isSoftDelete', new DefaultValuePipe(true), ParseBoolPipe)
    isSoftDelete: Bool = true,
    @Request() req: any,
  ) {
    const parentUserId = req.user.id;

    await this.profileUseCase
      .getInstance()
      .deleteProfileAndChildUsers(profileId, parentUserId, isSoftDelete, true);

    return this.responseBuilder.success(
      { message: 'Profile and associated child users deleted successfully' },
      'Profile deleted successfully',
    );
  }
  @Put('update-profile/:profileId/:childUserId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update profile and associated child user',
    description: 'Update a profile and all associated child users.',
  })
  @ApiParam({
    name: 'profileId',
    description: 'ID of the profile to Update',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile and child users updated successfully',
    type: ApiResponseDto<{ message: string }>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid profile ID',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only update your own profiles',
    type: ErrorResponseDto,
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
  async updateProfile(
    @Param('profileId') profileId: number,
    @Param('childUserId') childUserId: number,
    @Body() updateProfileDTO: UpdatedCombinedUserProfileDTO,
    @Request() req: any,
  ) {
    const parentUserId = req.user.id;

    await this.profileUseCase
      .getInstance()
      .updateProfile(profileId, parentUserId, childUserId, updateProfileDTO);

    return this.responseBuilder.success(
      { message: 'Profile and associated child users Updated successfully' },
      'Profile Updated successfully',
    );
  }

  @Delete('unlink-child/:childUserId')
  @ApiOperation({
    summary: 'Unlink the child user profile',
    description:
      'If the child user is dependent, we will delete the profile. Otherwise, we will unlink the profile and make the user primary.',
  })
  @ApiParam({
    name: 'childUserId',
    description: 'ID of the child user to unlink',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Child profile unlinked successfully',
    type: ApiResponseDto<{ message: string }>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid child user ID',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Child user not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  async unlinkChild(
    @Param('childUserId', ParseIntPipe) childUserId: number,
    @Param('isSoftDelete', new DefaultValuePipe(true), ParseBoolPipe)
    isSoftDelete: boolean = true,
    @Request() req: any,
  ): Promise<UnlinkResult> {
    return this.profileUseCase
      .getInstance()
      .unlinkChildProfile(childUserId, isSoftDelete);
  }

  // Controller Method
  @Get('my-profiles/deleted')
  @ApiOperation({
    summary: 'Get all soft-deleted profiles created by the authenticated user',
    description:
      'Retrieve all soft-deleted profiles created by the authenticated parent user with optional filtering.',
  })
  @ApiQuery({
    name: 'include_child_details',
    description: 'Include child user details in response',
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
    description: 'Soft-deleted profiles retrieved successfully',
    type: ApiResponseDto<ProfileSummaryDto[]>,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  async getMySoftDeletedProfiles(
    @Query() queryDto: GetProfilesQueryDto,
    @Request() req: any,
  ): Promise<
    ApiResponseDto<
      ProfileSummaryDto[] | ProfileDetailDto[] | ProfileFinalDetailDto
    >
  > {
    const parentUserId = req.user.id;
    let profiles = await this.profileUseCase
      .getInstance()
      .getSoftDeletedProfilesByParentId(parentUserId);

    // Apply filters
    profiles = this.presenter.filterProfiles(profiles as Profile[], {
      hasChildUser: queryDto.has_child_user,
    });

    const presentedProfiles = queryDto.include_child_details
      ? this.presenter.presentProfileDetails(profiles as Profile[])
      : this.presenter.presentProfileSummaries(profiles as Profile[]);

    return this.responseBuilder.success(
      presentedProfiles,
      `Retrieved ${profiles.length} soft-deleted profiles successfully`,
    );
  }


}
