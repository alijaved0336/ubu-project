import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';
import { AwsSpApiService } from '@infrastructure/services/aws-sp-api/aws-sp.service';
import { WebSocketProviderService } from '@infrastructure/sockets/web-socket-provider';
import { CampaignStatus } from '@infrastructure/utils/constant';
import { Server } from 'socket.io';
import { Processor, Process } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { AwsSpApiUsecase } from '@use-cases/aws-sp-api.usecase';
import { Job } from 'bull';
import UsecaseProxy, { AWS_SP_API_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

@Processor('campaignQueue')
export class JobsProcessor {
  server: Server;
  constructor(
    @Inject(AWS_SP_API_USECASE_PROXY)
    private awsSpApiUsecase: UsecaseProxy<AwsSpApiUsecase>,
    private awsSpApiService: AwsSpApiService,
    private campaignRepo: CampaignRepository,
    private webSocketProvider: WebSocketProviderService,
    private brandRepo: BrandRepository,
    private influencerRepo: InfluencerRepository,
    private notifcationRepo: NotificationRepository,
  ) {}

  onModuleInit() {
    this.server = this.webSocketProvider.getServerInstance();
  }

  private async registerSocketEvents(event: string, data: any, receiver: number) {
    if (!this.server) {
      console.error('Server instance not initialized');
      return;
    }

    try {
      this.server.to(`${receiver}`).emit(event, data);
    } catch (error) {
      console.error('Error emitting socket event:', error);
    }
  }

  @Process('publishCampaignAmazon')
  async handleCampaignPublishJob(job: Job) {
    let { userId, media, content, url, brandId, affliateTag, campaign_id } = job.data;

    console.log('............................Queue Started............');
    const data = await this.awsSpApiUsecase.getInstance().fetchAndSaveProduct(url, userId, true, brandId, affliateTag);
    console.log('-=-=-=-=-=-=-=-data is done-=-=-=-=-=-=-');
    if (data) {
      const affliateUrl = await this.awsSpApiService.addAffiliateLink(url, affliateTag);
      content = content + `${affliateUrl}`;
      const response = await this.awsSpApiUsecase.getInstance().writeMultiplePost(userId, media, content);
      if (response == 'sucessfully uploaded') {
        try {
          const campaign = await this.campaignRepo.findCampaignById(campaign_id);
          if (!campaign) {
            return 'Campaign Not Found';
          }

          campaign.status = CampaignStatus.PUBLISHING;
          this.campaignRepo.save(campaign);
        } catch (error) {
          return error;
        }
      }
      console.log('............response............ ', response);
    }
    return true;
  }

  @Process('publishCampaignLocal')
  async handleLocalCampaignPublishJob(job: Job) {
    const { userId, media, content, campaign_id } = job.data;
    console.log('............................Queue Started............', media);
    let response = '';
    if (media.length > 1) {
      response = await this.awsSpApiUsecase.getInstance().writeMultiplePost(userId, media, content);
    } else {
      response = await this.awsSpApiUsecase.getInstance().writePost(userId, media[0], content);
    }
    console.log('............response............ ', response);
    if (response == 'sucessfully uploaded') {
      const campaign = await this.campaignRepo.findCampaignById(campaign_id);
      if (!campaign) {
        return 'Campaign Not Found';
      }
      const inf = await this.influencerRepo.findOne(campaign?.influencerId.valueOf()!);
      try {
        campaign.status = CampaignStatus.PUBLISHING;
        const published = await this.campaignRepo.save(campaign);
        if (published) {
          const influencer_id = campaign?.influencer?.user?.id;
          const brand_id = campaign?.brand?.user?.id;
          const updatedCampaign = { campaign_id: campaign?.id, campaign_status: published.status };
          if (influencer_id) {
            this.server.to(`${influencer_id}`).emit('updatedCampaignStatus', updatedCampaign);
          }
          if (brand_id) {
            this.server.to(`${brand_id}`).emit('updatedCampaignStatus', updatedCampaign);
          }
        }
        const notificationData = {
          sender: inf?.user.id,
          receiver: inf?.user.id,
          content: 'Campaign Published',
          type: 'PUBLISHED',
          sender_type: 'influencer',
          receiver_type: 'influencer',
          campaign_id: campaign.id,
        };
        const res = await this.notifcationRepo.create(notificationData);

        if (res) {
          const availableNotifications = await this.notifcationRepo.findByNotificationByReceiverId(notificationData.receiver!);
          this.registerSocketEvents('availableNotifications', availableNotifications, inf?.user.id!);
        }
      } catch (error) {
        const notificationData = {
          sender: inf?.user.id,
          receiver: inf?.user.id,
          content: 'Campaign cannot be published, please try again',
          type: 'FAILURE',
          sender_type: 'influencer',
          receiver_type: 'influencer',
          campaign_id: campaign.id,
        };
        const res = await this.notifcationRepo.create(notificationData);
        if (res) {
          const availableNotifications = await this.notifcationRepo.findByNotificationByReceiverId(notificationData.receiver!);
          this.registerSocketEvents('availableNotifications', availableNotifications, inf?.user.id!);
        }
        return error;
      }
    }
    return true;
  }
}
