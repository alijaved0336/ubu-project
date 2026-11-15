import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { FavouriteAffiliateProductUsecase } from '@use-cases/favourite-affiliate-product.usecase';
import { AffiliateProductRepository } from '@infrastructure/orm/reposiories/affiliate-product.repository';
import { FavouriteAffiliateProductRepository } from '@infrastructure/orm/reposiories/favourite-affiliate-product-repository';

import UsecaseProxy, { FAVOURITE_AFFILIATE_PRODUCT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';

export function FavouriteAffiliateProductUseCaseProvider() {
  return {
    inject: [FavouriteAffiliateProductRepository, UserRepository, AffiliateProductRepository, NotificationRepository],
    provide: FAVOURITE_AFFILIATE_PRODUCT_USECASE_PROXY,
    useFactory: (
      fapRepository: FavouriteAffiliateProductRepository,
      userRepository: UserRepository,
      affiliateProductRepository: AffiliateProductRepository,
      notificationRepository: NotificationRepository,
    ) => new UsecaseProxy(new FavouriteAffiliateProductUsecase(fapRepository, userRepository, affiliateProductRepository, notificationRepository)),
  };
}
