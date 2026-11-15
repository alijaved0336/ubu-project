import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Query,
  Request,
  UploadedFile,
  Response,
  UseGuards,
  UseInterceptors,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthLoginDTO, AuthRegisterDTO, AuthSignUpDTO, CheckEmailDTO, GoogleTokenDto, RefreshToken, VerifyEmailDto } from './auth.dto';
import UsecaseProxy, { AUTH_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { AuthUsecase } from '@use-cases/auth.usecase';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { GoogleOAuthGuard } from '@infrastructure/guards/google-auth.guard';
import { AuthLoginUserPresenter } from './auth.presenter';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeInterceptor } from '../UploadFiles/max-file-size.validator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SignInMethods } from '@infrastructure/utils/constant';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('')
@ApiTags('Authentication')
@ApiBearerAuth()
export class AuthController {
  constructor(
    @Inject(AUTH_USECASE_PROXY)
    private readonly authUsecaseProxy: UsecaseProxy<AuthUsecase>,
  ) {}

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
    type: AuthLoginUserPresenter,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data.',
  })
  async login(@Body() payload: AuthLoginDTO, @Query('requestFrom') requestFrom?: string) {
    const reqFrom = requestFrom ?? 'iosApplication';
    return new AuthLoginUserPresenter(await this.authUsecaseProxy.getInstance().login(payload, reqFrom));
  }

  @Post('/refresh_token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get Updated user token through refersh token' })
  @ApiResponse({
    status: 200,
    description: 'User Updated Info',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data.',
  })
  async getNewRefreshToken(@Body() payload: RefreshToken) {
    return this.authUsecaseProxy.getInstance().refreshToken(payload.refresh_token);
  }

  @UseInterceptors(
    FileInterceptor('avatar'),
    new FileSizeInterceptor(10 * 1024 * 1024), // 10MB in bytes
  )
  @Put('/update-user')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data.',
  })
  register(@Body() payload: AuthRegisterDTO, @UploadedFile() avatar = '') {
    return this.authUsecaseProxy.getInstance().updateUser(payload, avatar);
  }

  @Post('/register')
  registerUser(@Body() payload: AuthSignUpDTO, @Query('requestFrom') requestFrom?: string) {
    const reqFrom = requestFrom ?? 'iosApplication';
    return this.authUsecaseProxy.getInstance().registerUser(payload, SignInMethods.MANUAL, reqFrom);
  }

  @Get('/check')
  @ApiOperation({ summary: 'Check if the server is working' })
  @ApiResponse({
    status: 200,
    description: 'Server is working.',
    type: String,
  })
  getUser(@Response() res) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).send('working');
  }

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Google OAuth redirect callback' })
  @ApiResponse({
    status: 200,
    description: 'User information returned after Google OAuth login.',
    type: Object,
  })
  googleAuthRedirect(@Request() req, @Response() res) {
    res.send(req.user);
  }

  @Post('/verify-google')
  async verifyGoogleAuth(@Body() payload: GoogleTokenDto, @Query('requestFrom') requestFrom: string) {
    const reqFrom = requestFrom ?? 'iosApplication';
    return this.authUsecaseProxy.getInstance().validateUserForGoogleStrategy(payload, reqFrom);
  }

  @Post('/check_email')
  @ApiOperation({ summary: 'Check if an email is already registered' })
  @ApiResponse({
    status: 200,
    description: 'Email existence status returned.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Email is required.',
  })
  async checkEmail(@Body() payload: CheckEmailDTO) {
    if (!payload.email) {
      throw new BadRequestException('Email query parameter is required');
    }
    const emailExists = await this.authUsecaseProxy.getInstance().checkEmailExists(payload.email);
    return emailExists;
  }

  @Get('/email/verify')
  async verifyEmail(@Query() query: VerifyEmailDto) {
    const { token } = query;
    const response = await this.authUsecaseProxy.getInstance().verifyEmail(token);
    return response;
  }

  @Get('/resend/email')
  @UseGuards(JwtAuthGuard)
  async resendEmail(@Request() req) {
    const userId = req.user.id;
    return await this.authUsecaseProxy.getInstance().resendEmail(userId);
  }

  @Post('/auth/verify-apple')
  async verifyAppleAuth(@Body() body, @Query('requestFrom') requestFrom: string) {
    try {
      const { code, user, sessionLog } = body?.payload;
      const reqFrom = requestFrom ?? 'iosApplication';
      return this.authUsecaseProxy.getInstance().verifyAndAuthenticateApple(code, user, sessionLog ?? {}, reqFrom);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout user and remove session/refresh token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        deviceId: {
          type: 'string',
          example: 'abcd1234-device-id',
          description: 'Unique identifier of the device to remove session for',
        },
      },
      required: ['deviceId'],
    },
  })
  async logout(@Request() req, @Body('deviceId') deviceId: string) {
    const userId = req.user.id;
    return await this.authUsecaseProxy.getInstance().logout(userId, deviceId);
  }

  @Put('/update-profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully.',
  })
  async updateProfile(@Body() updateProfileDto: Partial<AuthSignUpDTO>, @Request() req) {
    try {
      const userId = req.user.id;
      const result = await this.authUsecaseProxy.getInstance().updateUserProfile(userId, updateProfileDto);
      return {
        status: 200,
        success: true,
        data: result,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
