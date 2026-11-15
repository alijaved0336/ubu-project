import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';
import { ProductRequestRepository } from '@infrastructure/orm/reposiories/product-request.repository';
import { ProfileRepository } from '@infrastructure/orm/reposiories/profile.repository';
import { ProductRequestUsecase } from '@use-cases/product-request.usecase';
import UsecaseProxy, {
  PRODUCT_REQUEST_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';

export function ProductRequestUsecaseProvider() {
  return {
    inject: [
      ProductRequestRepository,
      ProfileRepository,
      NotificationRepository,
    ],
    provide: PRODUCT_REQUEST_USECASE_PROXY,
    useFactory: (
      productRequestRepository: ProductRequestRepository,
      profileRepository: ProfileRepository,
      notificationRepository: NotificationRepository,
    ) =>
      new UsecaseProxy(
        new ProductRequestUsecase(
          productRequestRepository,
          profileRepository,
          notificationRepository,
        ),
      ),
  };
}
