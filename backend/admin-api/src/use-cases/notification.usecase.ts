import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';

export class NotificationUsecase {
  constructor(private notificationRepository: NotificationRepository) {}

  async registerDevice(userId: number, deviceToken: string) {
    return this.notificationRepository.registerDevice(userId, deviceToken);
  }

  async findAll(userId: number, page: number, limit: number, search?: string) {
    return this.notificationRepository.findAll(userId, page, limit, search);
  }
}
