import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';
import { NotificationUsecase } from '@use-cases/notification.usecase';
import UsecaseProxy, { NOTIFICATION_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function NotificationUsecaseProvider() {
  return {
    inject: [NotificationRepository],
    provide: NOTIFICATION_USECASE_PROXY,
    useFactory: (notificationRepository: NotificationRepository) => new UsecaseProxy(new NotificationUsecase(notificationRepository)),
  };
}
