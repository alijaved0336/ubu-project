import { Body, ClassSerializerInterceptor, Controller, Get, Res, Request, Inject, Query, UseInterceptors, UseGuards, Param } from '@nestjs/common';
import UsecaseProxy, { INSTAGRAM_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { InstagramUsecase } from '@use-cases/instagram.usecase';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { JwtService } from '@infrastructure/services/jwt/jwt.service';
import * as querystring from 'querystring';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HandleInstagramCallbackDTO } from './instagram.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('instagram')
@ApiBearerAuth()
@Controller('instagram')
export class InstagramController {
  private readonly clientId = process.env.INSTA_CLIENT_ID;
  private readonly clientSecret = process.env.INSTA_CLIENT_SECRET;
  private readonly redirectUri = process.env.INSTA_REDIRECT_URI;

  constructor(
    @Inject(INSTAGRAM_USECASE_PROXY)
    private readonly instagramUsecaseProxy: UsecaseProxy<InstagramUsecase>,
    private readonly JWTService: JwtService
  ) { }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Redirect to Instagram authorization page' })
  @ApiResponse({ status: 200, description: 'Instagram authorization URL generated successfully.' })
  async redirectToInstagram(@Request() req: any) {
    const user_id = req.user.id;
    const state = querystring.stringify({ user_id });
    const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=user_profile,user_media&response_type=code&state=${state}`;
    return instagramAuthUrl;
  }

  @Get('/callback')
  @ApiOperation({ summary: 'Handle the callback from Instagram after authorization' })
  @ApiResponse({ status: 200, description: 'Instagram authorization callback handled successfully.' })
  async handleInstagramCallback(
    @Query() query: HandleInstagramCallbackDTO
  ) {
    const { code, state } = query;
    const { user_id } = querystring.parse(state);
    if (user_id)
    {
      return this.instagramUsecaseProxy.getInstance().saveAccessToken(code, user_id);
    } else
    {
      return 'Process halted, User not found';
    }
  }

  @Get('/posts')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get posts from Instagram for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Instagram posts retrieved successfully.' })
  async getInstaPosts(@Request() req: any) {
    const user_id = req.user.id;
    return await this.instagramUsecaseProxy.getInstance().getPosts(user_id);
  }
}
