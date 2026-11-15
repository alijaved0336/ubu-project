import { Injectable } from '@nestjs/common';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { WebSocketProviderService } from './web-socket-provider';
import { Server, Socket } from 'socket.io';
import { MessageBody } from '@nestjs/websockets';
@Injectable()
export class CampaignService {
  server: Server;
  constructor(
    private readonly webSocketProvider: WebSocketProviderService,
    private readonly campaignRepo: CampaignRepository,
  ) {}

  onModuleInit() {
    this.server = this.webSocketProvider.getServerInstance();
    this.registerSocketEvents();
  }

  private registerSocketEvents() {
    if (!this.server) {
      console.error('Server instance not initialized');
      return;
    }

    this.server.on('connection', (socket: Socket) => {
      console.log(`Client connected in NotificationService: ${socket.id}`);

      socket.on('updateCampaignStatusTrigger', (data) => {
        this.updateCampaignStatusTrigger(data);
      });
    });
  }

  async updateCampaignStatusTrigger(
    @MessageBody()
    data: {
      campaign_id: number;
    },
    // @ConnectedSocket() client: Socket,
  ) {
    const campaign = await this.campaignRepo.findCampaignById(data.campaign_id);
    const influencer_id = campaign?.influencer?.user?.id;
    const brand_id = campaign?.brand?.user?.id;
    const updatedCampaign = { campaign_id: campaign?.id, campaign_status: campaign?.status };
    if (influencer_id) {
      this.server.to(`${influencer_id}`).emit('updatedCampaignStatus', updatedCampaign);
    }
    if (brand_id) {
      this.server.to(`${brand_id}`).emit('updatedCampaignStatus', updatedCampaign);
    }
  }
}
