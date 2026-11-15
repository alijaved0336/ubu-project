import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Notifications } from '../entities/notification.entity';
import { INotificationRepository } from '@domain/repository/notification.repository.interface';
import { Campaign } from '../entities/campaign.entity';
import { Device } from '../entities/device.entity';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as admin from 'firebase-admin';

export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationRepository: Repository<Notifications>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  onModuleInit() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }

  async getDeviceByUserId(userId: number): Promise<Device | null> {
    return await this.deviceRepository.findOne({ where: { userId } });
  }

  async sendNotification(payload: admin.messaging.Message) {
    return admin.messaging().send(payload);
  }

  async getDevicesByUserId(userId: number): Promise<Device[]> {
    return this.deviceRepository.find({ where: { userId } });
  }

  async registerDevice(userId: number, deviceToken: string): Promise<Device> {
    const devices = await this.getDevicesByUserId(userId);
    const existingDevice = devices.find((device) => device.deviceToken === deviceToken);
    if (existingDevice) {
      return existingDevice;
    }
    const newDevice = this.deviceRepository.create({ userId, deviceToken });
    return this.deviceRepository.save(newDevice);
  }

  async removeAllDevicesByUserId(userId: number, deviceId: string) {
    return this.deviceRepository.delete({ userId, deviceToken: deviceId });
  }

  async sendNotificationToUserDevices({
    receiverUserId,
    receiverUserType,
    senderUserId,
    senderUserType,
    title,
    body,
    content,
    type,
    saveToDatabase = true,
  }: {
    receiverUserId: number;
    receiverUserType: string;
    senderUserId: number;
    senderUserType: string;
    title: string;
    body: string;
    content: string;
    type: string;
    saveToDatabase?: boolean;
  }): Promise<void> {
    try {
      const devices = await this.getDevicesByUserId(receiverUserId);

      if (devices.length) {
        await Promise.all(
          devices.map(async (device: Device) => {
            const payload: admin.messaging.Message = {
              token: device.deviceToken,
              notification: {
                title,
                body,
              },
            };

            try {
              await this.sendNotification(payload);
            } catch (error) {
              console.error(`Notification failed for token ${device.deviceToken}:`, error?.code || error?.message);

              if (
                error?.code === 'messaging/invalid-registration-token' ||
                error?.code === 'messaging/registration-token-not-registered' ||
                error?.code === 'messaging/mismatched-credential'
              ) {
                await this.deviceRepository.remove(device);
              }
            }
          }),
        );
      }

      if (saveToDatabase) {
        const notification = await this.create({
          receiver: receiverUserId,
          sender: senderUserId,
          content,
          type,
          receiver_type: receiverUserType,
          sender_type: senderUserType,
        });
      }
    } catch (error) {
      console.error('Unexpected error in sendNotificationToUserDevices:', error);
    }
  }

  async create(notification) {
    const newPost = this.notificationRepository.create({
      receiver: { id: notification.receiver },
      sender: { id: notification.sender },
      content: notification.content,
      type: notification.type,
      receiver_type: notification.receiver_type,
      sender_type: notification.sender_type,
      isSeen: false,
    });
    if (notification.campaign_id) {
      newPost.campaign = notification.campaign_id;
    }
    if (notification.chatId) {
      newPost.chatId = notification.chatId;
    }
    return this.notificationRepository.save(newPost);
  }

  async findOne(id: number) {
    return await this.notificationRepository.findOne({ where: { id } });
  }

  async findByNotificationByReceiverId(receiver: number) {
    return await this.notificationRepository.find({
      where: {
        receiver: {
          id: receiver,
        },
      },
      relations: ['sender', 'receiver', 'campaign', 'chatId'],
    });
  }

  async findByNotificationBySenderId(sender: number) {
    return await this.notificationRepository.find({
      where: { sender: { id: sender } },
      relations: ['sender', 'receiver'],
    });
  }

  async update(notificationIds: number[]): Promise<void> {
    if (notificationIds.length > 0) {
      await this.notificationRepository
        .createQueryBuilder()
        .update(Notifications)
        .set({ isSeen: true })
        .where('id IN (:...ids)', { ids: notificationIds })
        .execute();
    }
  }

  async updateType(notificationId: number, updatedType: string): Promise<void> {
    if (notificationId) {
      await this.notificationRepository
        .createQueryBuilder()
        .update(Notifications)
        .set({ type: updatedType })
        .where('id = :id', { id: notificationId })
        .execute();
    }
  }

  async findAll(userId: number, page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    let whereCondition = { receiver: { id: userId } } as any;

    if (search) {
      whereCondition = [{ ...whereCondition, content: ILike(`%${search}%`) }];
    }

    const [notifications, total] = await this.notificationRepository.findAndCount({
      where: whereCondition,
      skip: skip,
      take: limit,
      order: {
        id: 'DESC',
      },
      relations: ['sender', 'receiver', 'campaign'],
    });
    return { notifications, total };
  }

  async deleteByCampaign(segmentId: number) {
    const subQuery = this.notificationRepository.manager
      .createQueryBuilder(Campaign, 'campaign')
      .select('campaign.id')
      .where('campaign.segment_id = :segmentId', { segmentId })
      .andWhere('campaign.status = :status', { status: 'pending' });

    // Execute delete using only notification repository
    await this.notificationRepository
      .createQueryBuilder('notifications')
      .delete()
      .where(`notifications.campaign_id IN (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .execute();
  }

  async findLastNotification({ receiverId, senderId, type }: { receiverId: number; senderId: number; type: string }) {
    return await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.receiver_id = :receiverId', { receiverId: receiverId })
      .andWhere('notification.sender_id = :senderId', { senderId: Number(senderId) })
      .andWhere('notification.type = :type', { type: type })
      .orderBy('notification.date', 'DESC')
      .getOne();
  }
}
