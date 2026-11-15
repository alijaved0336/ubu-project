import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
  UnauthorizedException,
  UploadedFiles,
  NotFoundException,
  Put,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { UserRole } from '@infrastructure/orm/entities/user.entity';
import UsecaseProxy, {
  AUTH_USECASE_PROXY,
  BODY_MEASUREMENT_USE_CASE,
  PROFILE_USECASE_PROXY,
  QUESTIONNAIRE_USECASE_PROXY,
  USER_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import { AuthUsecase } from '@use-cases/auth.usecase';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserUsecase } from '@use-cases/user.usecase';
import { ChangePasswordDto, deleteResponseDto, ForgotPasswordDto, ResetPasswordDto, updateUserDto, UserDetailsDtoMobile } from './user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileSizeInterceptor } from '../UploadFiles/max-file-size.validator';
import { UpdateResult } from 'typeorm';
import { BodyMeasurementUsecase } from '@use-cases/body-measurement.usecase';
import { UserType } from '@infrastructure/orm/entities/questionnaire.entity';
import { QuestionnaireUsecase } from '@use-cases/questionnaire.usecase';
import { PaginationDto } from '../common/common.dto';
import { ProfileUseCase } from '@use-cases/profile.usecase';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('/user')
@ApiTags('Users')
export class UserController {
  constructor(
    @Inject(AUTH_USECASE_PROXY)
    private readonly authUsecaseProxy: UsecaseProxy<AuthUsecase>,

    @Inject(USER_USECASE_PROXY)
    private readonly userUsecaseProxy: UsecaseProxy<UserUsecase>,

    @Inject(BODY_MEASUREMENT_USE_CASE)
    private readonly bodyMeasurementUsecaseProxy: UsecaseProxy<BodyMeasurementUsecase>,

    @Inject(QUESTIONNAIRE_USECASE_PROXY)
    private readonly questionnaireUsecaseProxy: UsecaseProxy<QuestionnaireUsecase>,
    @Inject(PROFILE_USECASE_PROXY)
    private readonly profileUseCaseProxy: UsecaseProxy<ProfileUseCase>,
  ) {}

  @Get('/deployment-check')
  async deploymentCheck(): Promise<any> {
    return { msg: 'Automated deployment successful 🧊' };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUser(@Request() req: any): Promise<any> {
    const user = req.user;
    if (user.is_deleted) throw new NotFoundException('User Not Found');

    const isScanned = await this.bodyMeasurementUsecaseProxy.getInstance().isUserScanned(user.influencer?.measurement?.id || null);
    const birthDate = new Date(user?.dob ?? new Date());
    const today = new Date();

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    const isBeforeBirthday = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0);
    const isAdult = isBeforeBirthday && user?.dob ? age >= 18 : age >= 18;

    let userType: UserType = UserType.BRAND;
    if (user.is_influencer) {
      userType = UserType.INFLUENCER;
      if (!isAdult && user?.dob) {
        userType = UserType.MINORINFLUENCER;
      }
    } else if (user.is_brand) {
      userType = UserType.BRAND;
    } else {
      userType = UserType.INFLUENCER;
    }
    const isQuestionnaireComplete = await this.questionnaireUsecaseProxy.getInstance().isSurveyDoneForCurrentUserType(user.id, userType);
    user['is_questionnaire_completed'] = isQuestionnaireComplete;

    if (user.is_brand) {
      user['type'] = UserRole.BRAND;
    } else if (user.is_influencer) {
      user['type'] = UserRole.INFLUENCER;
    } else if (user.consumer) {
      /* throw new UnauthorizedException(
        'Role does not match with your email',
        user.email,
      ); */
      user['type'] = UserRole.CONSUMER;
    } else {
      user['type'] = false;
    }
    user['isScanned'] = isScanned;
    user['isSurveyDone'] = isQuestionnaireComplete;

    const profileData = await this.profileUseCaseProxy.getInstance().isChildUser(user?.id);
    if (profileData.is_primary_user) {
      user['is_primary_user'] = true;
    } else if (profileData.is_dependent) {
      user['is_dependent'] = true;
    }

    return user;
  }

  @Get('/getAmazonInfluencers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get influncers which are assosiated with affialte',
    description: 'Get influncers which are assosiated with affialte',
  })
  @ApiResponse({
    status: 200,
    description: 'List of influncers fetched sucessfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, Unprocessable entity.',
  })
  async getInfluencers(@Query() query: PaginationDto): Promise<any> {
    const { page, limit, search } = query;
    return await this.userUsecaseProxy.getInstance().getAmazonInfluencers(page, limit, search);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Request password reset',
    description: "Sends a password reset link to the user's email.",
  })
  @ApiBody({
    description: 'Email of the user requesting the password reset',
    type: ForgotPasswordDto,
    required: true,
    examples: {
      'application/json': {
        value: {
          email: 'user@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset link sent to your email.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email format or email does not exist.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = body;
    await this.userUsecaseProxy.getInstance().requestPasswordReset(email);
    return { message: 'Password reset link sent to your email.' };
  }

  @Put('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: "Resets the user's password using a valid token.",
  })
  @ApiBody({
    description: 'Token and new password required to reset the password',
    type: ResetPasswordDto,
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Password reset successful.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid token or password does not meet the required criteria.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async resetPassword(@Body() body: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword } = body;
    await this.userUsecaseProxy.getInstance().resetPassword(token, newPassword);
    return { message: 'Password reset successful.' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Updater data' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'The current user data' })
  @Patch('new_update')
  async updateUserNew(@Req() request, @Body() updateUserDto: UserDetailsDtoMobile) {
    return this.userUsecaseProxy.getInstance().updateByIdNew(request.user, updateUserDto);
  }
  @Put('change_password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change password',
    description: 'Changes the password of user',
  })
  @ApiResponse({ status: 200, description: 'Password changed successful.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async changePassword(@Request() req: any, @Body() body: ChangePasswordDto): Promise<UpdateResult> {
    const { oldPassword, newPassword } = body;
    const userId = req.user.id;
    return await this.userUsecaseProxy.getInstance().changePassword(oldPassword, newPassword, +userId);
  }

  @Put('update_user_profile_photo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the profile photo' })
  @UseInterceptors(FilesInterceptor('files', 1), new FileSizeInterceptor(10 * 1024 * 1024))
  updateProfilePhoto(@Request() req: any, @UploadedFiles() files): Promise<any> {
    return this.userUsecaseProxy.getInstance().updateProfilePhoto(req.user.id, files);
  }

  @Put('update_brand_profile_photo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the brand profile photo' })
  @UseInterceptors(FilesInterceptor('files', 1), new FileSizeInterceptor(10 * 1024 * 1024))
  updateBrandProfilePhoto(@Request() req: any, @UploadedFiles() files): Promise<any> {
    const { id } = req.user;
    console.log('ididid', id);
    return this.userUsecaseProxy.getInstance().updateBrandProfilePhoto(id, files);
  }

  @Put('update_profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Request() req: any, @Body() updateUserDto: updateUserDto): Promise<any> {
    const userId = req.user.id;
    return this.userUsecaseProxy.getInstance().update(+userId, updateUserDto);
  }
  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user',
    description: 'Deletes the user and their associated data based on their role (brand or influencer).',
  })
  @ApiResponse({
    status: 200,
    description: 'User and related data deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid input or dependencies.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteUser(@Req() req: any): Promise<deleteResponseDto> {
    const user = req.user;

    // Ensure user is authenticated and has a valid role
    if (!user) {
      throw new UnauthorizedException('User not authenticated.');
    }

    return await this.userUsecaseProxy.getInstance().deleteUser(user);
  }
}
