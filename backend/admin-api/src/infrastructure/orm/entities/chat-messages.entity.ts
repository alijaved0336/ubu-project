import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Chat } from './chat.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false, name: 'is_seen' })
  isSeen: boolean;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ nullable: true, name: 'file_name' })
  fileName: string;

  @Column({ nullable: true, name: 'file_url' })
  fileUrl: string;

  @OneToOne(() => User, (user) => user.chatMessage)
  @JoinColumn({ name: 'sender_id' })
  sender: Partial<User>;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  @JoinColumn({ name: 'chat_id' })
  chat: Partial<Chat>;
}
