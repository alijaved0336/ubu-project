import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SocialIntegrationRepository } from '@infrastructure/orm/reposiories/social-integration.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import axios from 'axios';
import { SocialIntegration } from '@infrastructure/orm/entities/social-integration.entity';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { InstagramStatsRepository } from '@infrastructure/orm/reposiories/instagram-stats.repository';
import { CampaignStatus } from '@infrastructure/utils/constant';

@Injectable()
export class InstagramUsecase {
  private readonly logger = new Logger(InstagramUsecase.name);
  private readonly clientId = process.env.INSTA_CLIENT_ID;
  private readonly clientSecret = process.env.INSTA_CLIENT_SECRET;
  private readonly redirectUri = process.env.INSTA_REDIRECT_URI;

  constructor(
    private socialIntegrationRepository: SocialIntegrationRepository,
    private userRepository: UserRepository,
    private influencerRepository: InfluencerRepository,
    private instagramStatsRepository: InstagramStatsRepository,
  ) {}

  async saveAccessToken(code: string, user_id: string | string[] | undefined) {
    const url = 'https://api.instagram.com/oauth/access_token';
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
      code: code,
    };
    try {
      const response = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const access_token = response.data.access_token;

      const tokenData = await this.getLongTimeToken(access_token);
      //return await this.saveTokenToUser(tokenData, user_id)
      return tokenData;
    } catch (error) {
      return error;
    }
  }

  async getLongTimeToken(access_token) {
    const url = `https://graph.instagram.com/me?fields=id&access_token=${access_token}`;
    const userResponse = await axios.get(url);
    const tokenUrl = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${this.clientSecret}&access_token=${access_token}`;
    const longerToken = await axios.get(tokenUrl);
    return {
      accessToken: longerToken.data.access_token,
      socialUserId: userResponse.data.id,
    };
  }

  async saveTokenToUser(tokenData, user_id) {
    const userRecord = await this.userRepository.findById(user_id);
    if (userRecord) {
      const socialIntegration: Partial<SocialIntegration> = {
        user: userRecord,
        social_platform_name: 'Instagram',
        access_token: tokenData['accessToken'],
        token_last_updated: new Date(),
        social_user_id: tokenData['socialUserId'],
      };
      const integrationRecord = await this.socialIntegrationRepository.findByPlatformNameAndUserId('Instagram', user_id);
      let result;
      if (integrationRecord) {
        result = await this.socialIntegrationRepository.update(integrationRecord.id, socialIntegration);
      } else {
        result = await this.socialIntegrationRepository.create(socialIntegration);
      }
      return { result: result };
    } else {
      throw new NotFoundException(`Failed to get User`);
    }
  }

  async getPosts(userId: number): Promise<any> {
    const integration = await this.socialIntegrationRepository.findByPlatformNameAndUserId('Instagram', userId);

    if (integration) {
      const url = `https://graph.instagram.com/${integration.social_user_id}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${integration.access_token}`;

      try {
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        if (error.isAxiosError && error.response) {
          this.logger.error(`AxiosError: ${error.message}`, JSON.stringify(error.response.data));
          if (error.response.data.error.message) {
            return JSON.stringify(error.response.data.error.message);
          }
        } else {
          this.logger.error('Failed to get session ID', error.message);
        }
        throw new Error(`Failed to get session ID: ${error.message}`);
      }
    } else {
      throw new NotFoundException(`Instagram integration for user with id ${userId} not found`);
    }
  }

  async getInstaProfile(user_id: number): Promise<any> {
    const user = await this.socialIntegrationRepository.findByUserId(user_id);
    try {
      if (user) {
        const url = `https://graph.instagram.com/me?fields=followers_count,username,profile_picture_url,name&access_token=${user.access_token}`;

        // Make the request to the Instagram API
        const response = await axios.get(url);

        // Check if response has data
        if (response.data) {
          const profileData = response.data;
          // Return the profile data
          return profileData;
        } else {
          throw new Error('No profile data found.');
        }
      }
    } catch (error) {
      throw error; // Optionally rethrow the error to handle it elsewhere
    }
  }

  async getPostWithMaxEngagement(userId: number): Promise<any> {
    const integration = await this.socialIntegrationRepository.findByPlatformNameAndUserId('Instagram', userId);

    if (integration) {
      // Fetch all posts
      const url = `https://graph.instagram.com/${integration.social_user_id}/media?fields=id,caption&access_token=${integration.access_token}`;
      const response = await axios.get(url);
      const mediaData = response.data;

      let maxEngagementPost = null;
      const firstPostDetails = await axios.get(
        `https://graph.instagram.com/${mediaData.data[0].id}?fields=like_count,comments_count&access_token=${integration.access_token}`,
      );
      maxEngagementPost = { ...mediaData.data[0], ...firstPostDetails.data };
      let maxEngagement = 0;
      // Loop through each post and fetch likes and comments
      for (const media of mediaData.data) {
        const postDetails = await axios.get(
          `https://graph.instagram.com/${media.id}?fields=like_count,comments_count&access_token=${integration.access_token}`,
        );
        const engagement = postDetails.data.like_count + postDetails.data.comments_count;
        // Update max engagement post
        if (engagement > maxEngagement) {
          maxEngagement = engagement;
          maxEngagementPost = {
            ...media,
            ...postDetails.data,
          };
        }
      }

      return maxEngagementPost;
    } else {
      throw new NotFoundException(`Instagram integration for user with id ${userId} not found`);
    }
  }

  async getManyUserInsights(influencerIds: number[], instagramStatsDbCheck: boolean = true): Promise<any[]> {
    
    const influencers = await this.influencerRepository.findManyByIds(influencerIds)
    
    return await Promise.all(influencers.map(async (influencer) => {
      let nonPendingCampaignsCount = 0;
      if (influencer.campaigns) {
        nonPendingCampaignsCount = influencer.campaigns.filter((campaign) => campaign.status !== CampaignStatus.PENDING).length;
      }
  
      // ✅ Use cached stats if available
      if (instagramStatsDbCheck && influencer.instagramStats) {
        return {
          influencer_id: influencer.id,
          response_time: influencer.avgResponseTime,
          collabs: nonPendingCampaignsCount,
          followers_count: influencer.instagramStats.followersCount,
          engagement_rate: influencer.instagramStats.engagementRate,
          conversion_rate: influencer.instagramStats.conversionRate,
        };
      }
  

      if (!influencer.user) {
        return { influencer_id: influencer.id, error: 'User not found.' };
      }
  
      // 🔁 Fallback: fetch profile & stats via Instagram API
      const userId = influencer.user.id;
      // commenting it becasue right now there is no need to to fetch profile, in future this particular data will be coming from cache.
      //const profile = await this.getInstaProfile(userId);
        return {
          influencer_id: influencer.id,
          response_time: 'Awaiting Response',
          followers_count: 0,
          engagement_rate: '0%',
          conversion_rate: '0%',
          collabs: 0,
        };
    }));
  }
  
  
  async getUserInsights(influencer_id: number, instagramStatsDbCheck: boolean = true): Promise<any> {
    // returning Enagement and conversion rate.

    const influencer = await this.influencerRepository.findOne(influencer_id);

    let nonPendingCampaignsCount = 0;
    if (influencer?.campaigns) {
      nonPendingCampaignsCount = influencer.campaigns.filter((campaign) => campaign.status !== CampaignStatus.PENDING).length;
    }
    if (instagramStatsDbCheck && influencer?.instagramStats) {
      return {
        influencer_id: influencer_id,
        response_time: influencer.avgResponseTime,
        collabs: nonPendingCampaignsCount,
        followers_count: influencer.instagramStats.followersCount,
        engagement_rate: influencer.instagramStats.engagementRate,
        conversion_rate: influencer.instagramStats.conversionRate,
      };
    }

    if (!influencer) {
      throw new NotFoundException('Influencer not found.');
    }
    if (!influencer.user) {
      throw new NotFoundException('User not found.');
    }
    const userId = influencer.user.id;
    const profile = await this.getInstaProfile(userId);
    if (!profile) {
      return {
        response_time: 'Awaiting Response',
        followers_count: 0,
        engagement_rate: '0%',
        conversion_rate: '0%',
        collabs: 0,
      };
    }
    const followersCount = profile.followers_count;
    const engagement = await this.getPostWithMaxEngagement(userId);
    let engagementRate = 0;
    let conversionRate = 0;
    try {
      const likeCount = engagement.like_count;
      const commentsCount = engagement.comments_count;

      const validLikeCount = isNaN(likeCount) || likeCount === null || likeCount === 0 ? 0 : likeCount;
      const validCommentsCount = isNaN(commentsCount) || commentsCount === null || commentsCount === 0 ? 0 : commentsCount;
      const engagementCount = (validLikeCount + validCommentsCount) / 2;
      if (engagementCount > 0 && followersCount > 0) {
        engagementRate = (engagementCount / followersCount) * 100;
        if (engagementRate > 100) {
          return {
            collabs: nonPendingCampaignsCount,
            influencer_id: influencer.id,
            followers_count: followersCount,
            engagement_rate: 'Not enough data to calculate it',
            conversion_rate: 'Not enough data to calculate it',
          };
        }
      }
      conversionRate = engagementRate - 10 > 0 ? engagementRate - 10 : 0; // RIGHT NOW there is no any end point to fetch this other then graph api so that why i have used it as sample value
      return {
        collabs: nonPendingCampaignsCount,
        influencer_id: influencer.id,
        followers_count: followersCount,
        engagement_rate: engagementRate + '%',
        conversion_rate: conversionRate + '%',
      };
    } catch (errors) {
      throw new NotFoundException(`Something went wrong or unable to fetch these stats`);
    }
  }

  async writePost(user_id: number, imageUrl: string, caption: string) {
    const user = await this.socialIntegrationRepository.findByUserId(user_id);
    const mediaPostUrl = `https://graph.instagram.com/v20.0/${user?.social_user_id}/media?access_token=${user?.access_token}`;
    const mediaData = {
      image_url: imageUrl,
      caption: caption,
      link: imageUrl,
    };
    try {
      const response = await axios.post(mediaPostUrl, mediaData);
      const publishUrl = `https://graph.instagram.com/v20.0/${user?.social_user_id}/media_publish?access_token=${user?.access_token}`;
      const publishData = {
        creation_id: response.data.id,
      };
      const respponse2 = await axios.post(publishUrl, publishData);
      return respponse2.data;
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error creating Instagram media:', error.response?.data || error.message);
      throw new Error('Failed to create Instagram media');
    }
  }

  async writeMultiplePost(user_id: number, imageUrls: string[], caption: string) {
    const user = await this.socialIntegrationRepository.findByUserId(user_id);
    const accessToken = user?.access_token;
    const igUserId = user?.social_user_id;

    const containerIds: string[] = []; // Array to store each item's container ID

    try {
      // Step 1: Create an item container for each image in the carousel
      for (const imageUrl of imageUrls) {
        const mediaPostUrl = `https://graph.instagram.com/v21.0/${user?.social_user_id}/media?access_token=${user?.access_token}&is_carousel_item=true&image_url=${imageUrl}`;
        const response = await axios.post(mediaPostUrl);
        containerIds.push(response.data.id); // Collect the container ID for each item
      }

      // Step 2: Create the carousel container with the collected item container IDs
      const carouselContainerData = {
        caption: caption,
        media_type: 'CAROUSEL', // Set to 'CAROUSEL' to indicate this is a carousel
        children: containerIds, // Pass the array of item container IDs directly
      };

      const mediaPostUrl = `https://graph.instagram.com/v21.0/${user?.social_user_id}/media?caption=${caption}&media_type=CAROUSEL&children=${containerIds.join(',')}&access_token=${user?.access_token}`;

      const carouselContainerResponse = await axios.post(mediaPostUrl);
      const carouselContainerId = carouselContainerResponse.data.id;

      // Step 3: Publish the carousel container

      const publishUrl = `https://graph.instagram.com/v20.0/${user?.social_user_id}/media_publish?access_token=${user?.access_token}`;
      const publishData = {
        creation_id: carouselContainerId,
      };
      const respponse2 = await axios.post(publishUrl, publishData);
      return 'sucessfully uploaded';
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async cronJobSaveInstagramStatsToDb() {
    const allInfluencers = await this.influencerRepository.findAll();
    if (allInfluencers.length === 0) {
      this.logger.log('No Influencers Found');
      return;
    }

    const instagramStats: Array<{
      influencer_id: number;
      followers_count: number;
      engagement_rate: string;
      conversion_rate: string;
    }> = [];

    for (const influencer of allInfluencers) {
      try {
        const instagramData = await this.getUserInsights(influencer.id, false);
        if (instagramData) {
          instagramStats.push(instagramData);
        }
      } catch (error) {
        console.error(error);
        continue;
      }
    }

    for (const stats of instagramStats) {
      try {
        await this.instagramStatsRepository.createOrUpdate({
          influencerId: stats.influencer_id,
          followersCount: stats.followers_count,
          engagementRate: stats.engagement_rate,
          conversionRate: stats.conversion_rate,
        });
      } catch (error) {
        console.error(`Error saving Instagram stats for influencerId ${stats.influencer_id}:`, error.message);
      }
    }
  }
}
