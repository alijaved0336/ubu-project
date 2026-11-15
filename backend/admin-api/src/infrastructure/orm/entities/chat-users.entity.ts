import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Chat } from './chat.entity';

@Entity('chat_users') // Specifies the join table name
export class ChatUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.chatUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Partial<User>;

  @ManyToOne(() => Chat, (chat) => chat.communicators, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat: Partial<Chat>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date;
}
