import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Res,
  Request,
  Inject,
  Query,
  UseInterceptors,
  UseGuards,
  Param,
  Post,
  BadRequestException,
} from '@nestjs/common';
import UsecaseProxy, { INSTAGRAM_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { AuthUsecase } from '@use-cases/auth.usecase';
import { InstagramUsecase } from '@use-cases/instagram.usecase';
import { Response } from 'express';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { JwtService } from '@infrastructure/services/jwt/jwt.service';
import * as querystring from 'querystring';
import { InstagramCreatePostDto } from '../common/common.dto';
@UseInterceptors(ClassSerializerInterceptor)
@Controller('instagram')
export class InstagramController {
  private readonly clientId = process.env.INSTA_CLIENT_ID;
  private readonly clientSecret = process.env.INSTA_CLIENT_SECRET;
  private readonly redirectUri = process.env.INSTA_REDIRECT_URI;
  constructor(
    @Inject(INSTAGRAM_USECASE_PROXY)
    private readonly instagramUsecaseProxy: UsecaseProxy<InstagramUsecase>,
  ) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async redirectToInstagram(@Request() req: any) {
    const user_id = req.user.id;
    const state = querystring.stringify({ user_id });
    const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=user_profile,user_media&response_type=code&state=${state}`;
    return instagramAuthUrl;
    // res.redirect(instagramAuthUrl);
  }

  @Get('/callback')
  async handleInstagramCallback(@Query('code') code: string, @Query('state') state: string) {
    const { user_id } = querystring.parse(state);
    if (user_id) {
      return this.instagramUsecaseProxy.getInstance().saveAccessToken(code, user_id);
    } else {
      return 'Process halted, User not found';
    }
  }

  @Get('/posts')
  @UseGuards(JwtAuthGuard)
  async getInstaPosts(@Request() req: any) {
    const user_id = req.user.id;
    return await this.instagramUsecaseProxy.getInstance().getPosts(user_id);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getInstaDp(@Request() req: any) {
    const user_id = req.user.id;
    return await this.instagramUsecaseProxy.getInstance().getInstaProfile(user_id);
  }

  @Get('/:id/user-stats')
  @UseGuards(JwtAuthGuard)
  async getInstaUserStats(@Request() req: any, @Param('id') id: number) {
    return await this.instagramUsecaseProxy.getInstance().getUserInsights(id);
  }

  @Post('/write-post')
  @UseGuards(JwtAuthGuard)
  async writePost(@Request() req: any, @Body() body: InstagramCreatePostDto) {
    const userId = req.user.id;
    const { image_link, caption } = body;
    return await this.instagramUsecaseProxy.getInstance().writePost(userId, image_link, caption);
  }

  @Post('/write-multiple-post')
  @UseGuards(JwtAuthGuard)
  async writeMultiplePost(@Request() req: any, @Body() body: any) {
    const { image_link, caption } = body;

    // Validate that image_link is an array and contains only strings
    if (!Array.isArray(image_link) || !image_link.every((url: any) => typeof url === 'string')) {
      throw new BadRequestException('image_link must be an array of strings');
    }

    // Check if array length is less than 2
    if (image_link.length < 2) {
      throw new BadRequestException('image_link must contain at least two URLs for a carousel post');
    }

    const userId = req.user.id;
    return await this.instagramUsecaseProxy.getInstance().writeMultiplePost(userId, image_link, caption);
  }
}
