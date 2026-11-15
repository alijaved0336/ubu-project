import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from '../entities/chat-messages.entity';

@Injectable()
export class ChatMessageRepository {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async findChatBetweenUsers(senderId: number, recipientId: number) {
    return this.chatMessageRepository
      .createQueryBuilder('message')
      .where('message.senderId = :senderId AND message.recipientId = :recipientId', { senderId, recipientId })
      .orWhere('message.senderId = :recipientId AND message.recipientId = :senderId', { senderId, recipientId })
      .orderBy('message.timestamp', 'ASC')
      .getMany();
  }

  async createAndSaveMessage(data: Partial<ChatMessage>): Promise<ChatMessage> {
    const newMessage = this.chatMessageRepository.create(data);
    return (await this.chatMessageRepository.save(newMessage)) && newMessage;
  }

  async updateMessageSeen(chatId: number) {
    return await this.chatMessageRepository.createQueryBuilder().update(ChatMessage).set({ isSeen: true }).where('chat.id = :chatId', { chatId }).execute();
  }
}
