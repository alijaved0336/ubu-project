import { Injectable } from '@nestjs/common';
import { User } from '@infrastructure/orm/entities/user.entity';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { WebSocketProviderService } from './web-socket-provider';
import { Server, Socket } from 'socket.io';
import { MessageBody, ConnectedSocket } from '@nestjs/websockets';

@Injectable()
export class NotificationService {
  server: Server;
  constructor(
    private readonly webSocketProvider: WebSocketProviderService,
    private readonly notificationRepository: NotificationRepository,
    private readonly campaignRepository: CampaignRepository,
    private readonly brandRepository: BrandRepository,
    private readonly influencerRepository: InfluencerRepository,
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

      socket.on('userNotificationConnected', (data) => {
        this.handleUserConnected(socket, data);
      });

      socket.on('pushNotification', (data) => {
        this.handlePushNotification(data, socket);
      });

      socket.on('notificationSeen', (data) => {
        this.handleNotificationSeen(socket, data);
      });
    });
  }

  async handleUserConnected(@ConnectedSocket() client: Socket, @MessageBody() user: Partial<User>) {
    const notificationsList = await this.notificationRepository.findByNotificationByReceiverId(user.id!);
    client.join(`${user.id}`);
    if (user) {
      this.server.to(`${user.id}`).emit('availableNotifications', notificationsList);
    }
  }

  async handlePushNotification(
    @MessageBody()
    data: {
      sender: Number;
      recipient: Number;
      content: string;
      type: string;
      senderType: string;
      receiverType: string;
      receiverCheck: string;
      campaignId?: number;
      currentNotification?: number;
      chatId?: number;
    },
    @ConnectedSocket() client?: Socket,
  ) {
    interface NotificationPayload {
      sender: Number;
      receiver: Number;
      content: string;
      type: string;
      receiver_type: string;
      sender_type: string;
      campaign_id?: number;
      chatId?: number;
    }

    if (data.receiverCheck == 'campaign') {
      const campaign = await this.campaignRepository.findCampaignById(data.recipient.valueOf());
      const inf = await this.influencerRepository.findOne(campaign?.influencerId.valueOf()!);
      const brand = await this.brandRepository.findOne(campaign?.brandId.valueOf()!);

      if (data.senderType == 'influencer') {
        if (inf) {
          data.sender = inf.user.id;
        }
        if (brand) {
          data.recipient = brand.user.id;
        }
      }
      if (data.senderType == 'brand') {
        if (inf) {
          data.recipient = inf.user.id;
        }
        if (brand) {
          data.sender = brand.user.id;
        }
      }
    }

    if (data.receiverCheck == 'brand') {
      const brand = await this.brandRepository.findOne(data.recipient.valueOf());
      if (brand) {
        data.recipient = brand.user.id;
      }
    }
    if (data.receiverCheck == 'influencer') {
      const inf = await this.influencerRepository.findOne(data.recipient.valueOf());
      if (inf) {
        data.recipient = inf.user.id;
      }
    }
    const payload: NotificationPayload = {
      sender: data.sender,
      receiver: data.recipient,
      content: data.content,
      type: data.type,
      receiver_type: data.receiverType,
      sender_type: data.senderType,
    };

    if (data.campaignId) {
      payload.campaign_id = data.campaignId;
    }

    if (data.currentNotification) {
      const res = await this.notificationRepository.updateType(data.currentNotification, 'CHECKEDINVITE');
      const RecipientNotifications = await this.notificationRepository.findByNotificationByReceiverId(data.sender.valueOf());
      if (data.sender) {
        this.server.to(`${data.sender}`).emit('availableNotifications', RecipientNotifications);
      }
    }

    if (data.chatId) {
      payload.chatId = data.chatId;
    }
    const res = await this.notificationRepository.create(payload);

    const RecipientNotifications = await this.notificationRepository.findByNotificationByReceiverId(data.recipient.valueOf());

    if (data.recipient) {
      this.server.to(`${data.recipient}`).emit('availableNotifications', RecipientNotifications);
    }
  }

  async handleNotificationSeen(
    client: Socket,
    data: {
      notificationList: any[];
    },
  ) {
    const notificationIds = data.notificationList.map((notification) => notification.id);
    await this.notificationRepository.update(notificationIds);
    const receiverId = data.notificationList[0]?.receiver?.id;
    if (receiverId) {
      const updatedNotifications = await this.notificationRepository.findByNotificationByReceiverId(receiverId);
      this.server.to(`${receiverId}`).emit('availableNotifications', updatedNotifications);
    }
  }
}
