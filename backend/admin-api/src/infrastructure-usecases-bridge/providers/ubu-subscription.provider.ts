import { UBUSubscriptionRepository } from '@infrastructure/orm/reposiories/ubu-subscription.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { StripeService } from '@infrastructure/services/stripe/stripe-service.service';
import { UbuSubscriptionUsecase } from '@use-cases/ubu-subscription.usecase';
import UsecaseProxy, { UBU_SUBSCRIPTION_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function UbuSubscriptionUsecaseProvider() {
  return {
    inject: [UBUSubscriptionRepository, StripeService, UserRepository],
    provide: UBU_SUBSCRIPTION_USECASE_PROXY,
    useFactory: (ubuSubscriptionRepository: UBUSubscriptionRepository, StripeService: StripeService, userRepository: UserRepository) =>
      new UsecaseProxy(new UbuSubscriptionUsecase(ubuSubscriptionRepository, StripeService, userRepository)),
  };
}
