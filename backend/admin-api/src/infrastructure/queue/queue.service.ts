import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IPublishCampaign } from '@domain/interfaces/publish-campaign.interface';
import { createClient } from 'redis';
@Injectable()
export class CampaignQueueService implements IPublishCampaign {
  constructor(@InjectQueue('campaignQueue') private readonly campaignQueue: Queue) {}

  async publishAmazonToInstagramAndUbu(userId: number, media: string[], content: string, url, brandId, affliateTag, campaign_id): Promise<void> {
    await this.campaignQueue.add('publishCampaignAmazon', { userId, media, content, url, brandId, affliateTag, campaign_id });
  }

  async publishLocalToInstagramAndUbu(userId: number, media: string[], content: string, campaign_id): Promise<void> {
    const client = createClient({ url: 'redis://:zQgeu45xrmKeBvapeFmFyQ1RJGOadDfG@redis-15357.c91.us-east-1-3.ec2.redns.redis-cloud.com:15357' });
    client.on('error', (err) => console.error('------------------Redis error:', err));
    client.on('ready', () => console.log('Redis connected!--------------------'));
    client.connect();
    await this.campaignQueue.add('publishCampaignLocal', { userId, media, content, campaign_id });
  }
}
