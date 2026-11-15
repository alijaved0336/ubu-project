import UsecaseProxy, { WHATS_NEW_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { WhatsNewRepository } from '@infrastructure/orm/reposiories/whats-new.repository';
import { WhatsNewUsecase } from '@use-cases/whats-new.usecase';

export function WhatsNewUsecaseProvider() {
  return {
    inject: [WhatsNewRepository],
    provide: WHATS_NEW_USECASE_PROXY,
    useFactory: (whatsNewRepository: WhatsNewRepository) => new UsecaseProxy(new WhatsNewUsecase(whatsNewRepository)),
  };
}
