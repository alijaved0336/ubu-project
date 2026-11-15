import { ChatRepository } from '@infrastructure/orm/reposiories/chat.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { ChatsUsecase } from '@use-cases/chat.usecase';
import UsecaseProxy, { CHAT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function ChatUsecaseProvider() {
  return {
    inject: [ChatRepository, UserRepository, InfluencerRepository],
    provide: CHAT_USECASE_PROXY,
    useFactory: (chatRepository: ChatRepository, userRepository: UserRepository, influencerRepository: InfluencerRepository) =>
      new UsecaseProxy(new ChatsUsecase(chatRepository, userRepository, influencerRepository)),
  };
}
