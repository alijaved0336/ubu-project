import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { WhatsNewSeenByRepository } from '@infrastructure/orm/reposiories/whats-new-seen-by.repository';
import { WhatsNewRepository } from '@infrastructure/orm/reposiories/whats-new.repository';
import { WhatsNewSeenByUsecase } from '@use-cases/whats-new-seen-by.usecase';
import UsecaseProxy, { WHATS_NEW_SEEN_BY_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function WhatsNewSeenByUsecaseProvider() {
  return {
    inject: [WhatsNewSeenByRepository, WhatsNewRepository, UserRepository],
    provide: WHATS_NEW_SEEN_BY_USECASE_PROXY,
    useFactory: (whatsNewSeenByRepository: WhatsNewSeenByRepository, whatsNewRepository: WhatsNewRepository, userRepository: UserRepository) =>
      new UsecaseProxy(new WhatsNewSeenByUsecase(whatsNewSeenByRepository, whatsNewRepository, userRepository)),
  };
}
