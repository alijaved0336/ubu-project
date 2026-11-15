import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { ChatUser } from '../entities/chat-users.entity';

@Injectable()
export class ChatUserRepository {
  constructor(
    @InjectRepository(ChatUser)
    private readonly chatUserRepository: Repository<ChatUser>,
  ) {}

  async createAndSaveChat(data: Partial<ChatUser>): Promise<ChatUser> {
    const newChat = this.chatUserRepository.create(data);
    return (await this.chatUserRepository.save(newChat)) && newChat;
  }
}
