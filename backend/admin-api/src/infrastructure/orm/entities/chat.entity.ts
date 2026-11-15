import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { ChatMessage } from './chat-messages.entity';
import { ChatUser } from './chat-users.entity';
import { Notifications } from './notification.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0, name: 'unread_messages_count' })
  unreadMessagesCount: number;

  @OneToMany(() => ChatMessage, (message) => message.chat, { cascade: true })
  messages: ChatMessage[];

  @OneToMany(() => ChatUser, (chatUser) => chatUser.chat)
  communicators: ChatUser[];

  @OneToMany(() => Notifications, (notification) => notification.chatId)
  notificationChat: Notifications[];
}
