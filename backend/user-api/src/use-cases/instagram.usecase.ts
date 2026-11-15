import { Logger, NotFoundException } from '@nestjs/common';
import { SocialIntegrationRepository } from '@infrastructure/orm/reposiories/social-integration.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import axios from 'axios';
import { SocialIntegration } from '@infrastructure/orm/entities/social-integration.entity';

export class InstagramUsecase {
  private readonly logger = new Logger(InstagramUsecase.name);
  private readonly clientId = process.env.INSTA_CLIENT_ID;
  private readonly clientSecret = process.env.INSTA_CLIENT_SECRET;
  private readonly redirectUri = process.env.INSTA_REDIRECT_URI;

  constructor(
    private socialIntegrationRepository: SocialIntegrationRepository,
    private userRepository: UserRepository,
  ) { }



  async saveAccessToken(code: string, user_id: string | string[] | undefined) {
    const url = 'https://api.instagram.com/oauth/access_token';
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
      code: code
    };

    try
    {
      const response = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const access_token = response.data.access_token

      const tokenData = await this.getLongTimeToken(access_token)

      return await this.saveTokenToUser(tokenData, user_id)


    } catch (error)
    {
      if (error.isAxiosError && error.response)
      {
        this.logger.error(
          `AxiosError: ${error.message}`,
          JSON.stringify(error.response.data),
        );
      } else
      {
        this.logger.error('Failed to get session ID', error.message);
      }
      throw new Error(`Something went wrong: ${error.message} : ${error.response.data}`);
    }
  }

  async getLongTimeToken(access_token) {
    const url = `https://graph.instagram.com/me?fields=id&access_token=${access_token}`
    const userResponse = await axios.get(url);
    const tokenUrl = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${this.clientSecret}&access_token=${access_token}`
    const longerToken = await axios.get(tokenUrl);
    return { accessToken: longerToken.data.access_token, socialUserId: userResponse.data.id }

  }

  async saveTokenToUser(tokenData, user_id) {
    const userRecord = await this.userRepository.findById(user_id);
    if (userRecord)
    {
      const socialIntegration: Partial<SocialIntegration> = {
        user: userRecord,
        social_platform_name: 'Instagram',
        access_token: tokenData['accessToken'],
        token_last_updated: new Date(),
        social_user_id: tokenData['socialUserId']
      }
      const integrationRecord = await this.socialIntegrationRepository.findByPlatformNameAndUserId('Instagram', user_id);
      let result;
      if (integrationRecord)
      {
        result = await this.socialIntegrationRepository.update(integrationRecord.id, socialIntegration)
      } else
      {
        result = await this.socialIntegrationRepository.create(socialIntegration);
      }
      return { result: result }
    } else
    {
      throw new NotFoundException(`Failed to get User`);
    }
  }


  async getPosts(userId: number): Promise<any> {
    const integration = await this.socialIntegrationRepository.findByPlatformNameAndUserId('Instagram', userId);

    if (integration)
    {

      const url = `https://graph.instagram.com/${integration.social_user_id}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${integration.access_token}`;

      try
      {
        const response = await axios.get(url);
        return response.data;
      } catch (error)
      {
        if (error.isAxiosError && error.response)
        {
          this.logger.error(
            `AxiosError: ${error.message}`,
            JSON.stringify(error.response.data),
          );
          if (error.response.data.error.message)
          {
            return JSON.stringify(error.response.data.error.message)
          }
        } else
        {
          this.logger.error('Failed to get session ID', error.message);
        }
        throw new Error(`Failed to get session ID: ${error.message}`);
      }
    } else
    {
      throw new NotFoundException(`Instagram integration for user with id ${userId} not found`);
    }
  }
}
