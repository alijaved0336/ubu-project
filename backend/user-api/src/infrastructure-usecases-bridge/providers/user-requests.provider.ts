import { UserRequestsUsecase } from '@use-cases/user-requests.usecase';
import { UserRequestsRepository } from '@infrastructure/orm/reposiories/user-requests.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import UsecaseProxy, {
  USER_REQUESTS_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import { ProfileRepository } from '@infrastructure/orm/reposiories/profile.repository';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';

export function UserRequestsUsecaseProvider() {
  return {
    inject: [
      UserRequestsRepository,
      UserRepository,
      ProfileRepository,
      NotificationRepository,
    ],
    provide: USER_REQUESTS_USECASE_PROXY,
    useFactory: (
      userRequestsRepository: UserRequestsRepository,
      userRepository: UserRepository,
      profileRepository: ProfileRepository,
      notificationRepo: NotificationRepository,
    ) =>
      new UsecaseProxy(
        new UserRequestsUsecase(
          userRequestsRepository,
          userRepository,
          profileRepository,
          notificationRepo,
        ),
      ),
  };
}
