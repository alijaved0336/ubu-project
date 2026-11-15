import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Inject, Post, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthLoginDTO, AuthRegisterDTO, SocialSiteRegisterDTO, UserPresenter, AuthRefreshTokenDTO, VerifyEmailDto } from './auth.dto';
import UsecaseProxy, { AUTH_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { AuthUsecase } from '@use-cases/auth.usecase';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { GoogleOAuthGuard } from '@infrastructure/guards/google-auth.guard';


@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_USECASE_PROXY)
    private readonly authUsecaseProxy: UsecaseProxy<AuthUsecase>,
    private readonly userPresenter: UserPresenter

  ) { }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in', type: UserPresenter })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  login(@Body() payload: AuthLoginDTO) {
    return this.authUsecaseProxy.getInstance().login(payload);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register a user' })
  register(@Body() payload: AuthRegisterDTO) {
    return this.authUsecaseProxy.getInstance().register(payload);
  }

  @Get('/check')
  @ApiOperation({ summary: 'Check is server up' })
  @ApiBearerAuth()
  getUser() {
    return 'working fine'
  }

  @Post('social')
  @ApiOperation({ summary: 'Login through Social sites' })
  async social(@Body() payload: SocialSiteRegisterDTO) {
    const res = await this.authUsecaseProxy.getInstance().getSocialsSitesDate(payload)
    const user = res.user && this.userPresenter.present(res.token, res.refreshToken, res.isScanned, res.isSurveyDone, res.expiresIn)
    return user
  }

  @Post('refresh_token')
  @ApiOperation({ summary: 'Generate new access token' })
  async resfresh_token(@Body() paylaod: AuthRefreshTokenDTO) {

    return this.authUsecaseProxy.getInstance().refreshToken(paylaod.refresh_token)
  }

  // @Get('/')
  // @UseGuards(GoogleOAuthGuard)
  // async googleAuth(@Request() req) {}

  // @Get('google-redirect')
  // @UseGuards(GoogleOAuthGuard)
  // googleAuthRedirect(@Request() req) {
  //   // console.log('--------req',req)
  //   return req.user;
  //   // return this.appService.googleLogin(req);
  // }


  @Get('/email/verify')
  async verifyEmail(@Query() query: VerifyEmailDto) {
    const { token } = query;
    const response = await this.authUsecaseProxy
      .getInstance()
      .verifyEmail(token);
    return response;
  }

  @Get('/resend/email')
  @UseGuards(JwtAuthGuard)
  async resendEmail(@Request() req) {
    const userId = req.user.id
    return await this.authUsecaseProxy.getInstance().resendEmail(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/get-body-gram-keys')
  @ApiOperation({ summary: 'Endpoint to fetch bodygram keys' })
  async getBodyGramKeys(
  ) {
    return await this.authUsecaseProxy.getInstance().getBodyGramKeys();
  }
}
