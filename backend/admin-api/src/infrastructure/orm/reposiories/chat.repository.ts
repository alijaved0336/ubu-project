import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../entities/chat.entity';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async findChatBySenderAndReciepent(senderId: number, recipientId: number) {
    return this.chatRepository
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.communicators', 'cu1', 'cu1.user_id = :user1', { user1: senderId })
      .innerJoinAndSelect('chat.communicators', 'cu2', 'cu2.user_id = :user2', { user2: recipientId })
      .getOne();
  }

  async findAllChatsbyChatId(chatIds: number[]) {
    return this.chatRepository
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.communicators', 'communicators')
      .innerJoinAndSelect('communicators.user', 'user')
      .innerJoinAndSelect('chat.messages', 'messages')
      .innerJoinAndSelect('messages.sender', 'sender')
      .where('chat.id IN (:...chatIds)', { chatIds })
      .orderBy('messages.timestamp', 'ASC')
      .getMany();
  }

  async findSpecificChatbyChatId(chatId: number) {
    return this.chatRepository
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.communicators', 'communicators')
      .innerJoinAndSelect('communicators.user', 'user')
      .innerJoinAndSelect('chat.messages', 'messages')
      .innerJoinAndSelect('messages.sender', 'sender')
      .where('chat.id = :chatId', { chatId })
      .getOne();
  }

  async findAllChatsByUserId(id: number) {
    return this.chatRepository
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.communicators', 'communicators', 'communicators.user_id = :user1', { user1: id })
      .innerJoinAndSelect('communicators.user', 'user')
      .innerJoinAndSelect('chat.messages', 'messages')
      .innerJoinAndSelect('messages.sender', 'sender')
      .orderBy('messages.timestamp', 'ASC')
      .getMany();
  }
  async createAndSaveChat(data: Partial<Chat>): Promise<Chat> {
    const newChat = this.chatRepository.create(data);
    return (await this.chatRepository.save(newChat)) && newChat;
  }

  async updateChatById(id: number, chat: Partial<Chat>) {
    return this.chatRepository.update(id, chat);
  }

  async findChatIdsByUserId(id: number) {
    const chats = await this.chatRepository
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.communicators', 'communicators', 'communicators.user_id != :user1', { user1: id })
      .innerJoinAndSelect('communicators.user', 'user')
      .innerJoin('chat.messages', 'messages')
      .innerJoin('messages.sender', 'sender')
      .andWhere((qb) => {
        const subQuery = qb.subQuery().select('chat.id').from('chats', 'chat').innerJoin('chat.communicators', 'c').where('c.user_id = :user1').getQuery();
        return 'chat.id IN ' + subQuery;
      })
      .orderBy('messages.timestamp', 'ASC')
      .getMany();

    return chats
      .map((chat) => chat.communicators?.filter((c) => c.user.id !== id) || [])
      .flatMap((filteredCommunicators) => filteredCommunicators.map((c) => c.user));
  }
}
