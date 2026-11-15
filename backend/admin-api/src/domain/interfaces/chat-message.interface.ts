import { User } from '@infrastructure/orm/entities/user.entity';

export interface IChatMessage {
  communicator: { user: Partial<User>; unreadMessagesCount: number }[];
  messages: [
    {
      message: string;
      sender: number;
      isSeen: boolean;
      timestamp: string;
      file: { name: string; url: string };
    },
  ];
}
