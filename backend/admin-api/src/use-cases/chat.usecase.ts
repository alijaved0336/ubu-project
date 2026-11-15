import { Chat } from '@infrastructure/orm/entities/chat.entity';
import { ChatRepository } from '@infrastructure/orm/reposiories/chat.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { convertSecondsToReadableFormat } from '@infrastructure/utils/helper';

export class ChatsUsecase {
  constructor(
    private chatRepository: ChatRepository,
    private userRepository: UserRepository,
    private influencerRepository: InfluencerRepository,
  ) {}

  async findAllChatsAndUsersByUserId(id: number) {
    const chats = await this.findAllChatsByUserId(id);
    const users = await this.findAllUsersbyUserId(id);
    return { userChats: chats, chatUsers: users };
  }

  async findSpecificChatByChatId(id: number) {
    const specificChat = await this.chatRepository.findSpecificChatbyChatId(id);
    return specificChat;
  }
  async cronJobSaveInfluencerAverageResponseTime() {
    const allInfluencers = await this.influencerRepository.findAll();

    for (const influencer of allInfluencers) {
      let totalResponseTime = 0;
      let responseCount = 0;
      let chats;

      try {
        chats = await this.findAllChatsByUserId(influencer.user.id);
      } catch (error) {
        console.error(error);
        continue;
      }

      if (!chats.length) {
        continue;
      }

      for (const chat of chats) {
        const messages = chat.messages;

        for (let i = 0; i < messages.length; i++) {
          if (messages[i].sender.id !== influencer.user.id) {
            const firstMessageTimestamp = new Date(messages[i].timestamp);
            for (let j = i + 1; j <= messages.length; j++) {
              if (messages[j].sender.id !== influencer.user.id) {
                i++;
              }
              if (messages[j].sender.id === influencer.user.id) {
                const responseMessageTimestamp = new Date(messages[j].timestamp);

                const responseTimeInSeconds = (responseMessageTimestamp.getTime() - firstMessageTimestamp.getTime()) / 1000;
                totalResponseTime += responseTimeInSeconds;
                responseCount++;
                break;
              }
            }
          }
        }
      }

      const averageResponseTime = responseCount > 0 ? totalResponseTime / responseCount : 0;

      const formattedResponseTime = convertSecondsToReadableFormat(averageResponseTime);
      try {
        await this.influencerRepository.update(influencer.id, {
          avgResponseTime: formattedResponseTime || undefined,
        });
      } catch (error) {
        console.error(error);
        continue;
      }
    }
  }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  async findAllChatsByUserId(id: number) {
    let chats: Chat[] = [];
    const chatsByUserId = await this.chatRepository.findAllChatsByUserId(id);
    if (chatsByUserId.length > 0) {
      const chatsId = chatsByUserId.map((chat) => chat.id);
      chats = await this.chatRepository.findAllChatsbyChatId(chatsId);
    }
    return chats;
  }

  async findAllUsersbyUserId(id: number) {
    const latest_user = await this.userRepository.findById(id);
    if (latest_user) {
      if (latest_user?.is_brand) {
        return this.userRepository.findAllCampignInfluencersByBrandId(latest_user?.brand?.id!);
      } else if (latest_user?.is_influencer) {
        const chatUsers = await this.chatRepository.findChatIdsByUserId(id);
        console.log('Latest user is ::: ', latest_user.influencer.id);
        const usersByCampaigns = await this.userRepository.findAllCampignBrandByInfluencerId(latest_user.influencer.id!);

        const mergedUsers = [...usersByCampaigns, ...chatUsers];

        const uniqueUsers = Array.from(new Map(mergedUsers.map((user) => [user.id, user])).values());

        return uniqueUsers;
      }
    }
    return [];
  }
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
}
