import { ChatRepository } from '@infrastructure/orm/reposiories/chat.repository';
import { ChatUserRepository } from '@infrastructure/orm/reposiories/chat-user.repository';
import { ChatMessageRepository } from '@infrastructure/orm/reposiories/chat-messages.repository';
import { User } from '@infrastructure/orm/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { WebSocketProviderService } from './web-socket-provider';
import { Server, Socket } from 'socket.io';
import {
  MessageBody, ConnectedSocket
} from '@nestjs/websockets';
@Injectable()
export class ChatService {
  server: Server;
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly chatUserRepository: ChatUserRepository,
    private readonly chatMessageRepository: ChatMessageRepository,
    private readonly userRepository: UserRepository,
    private readonly webSocketProvider: WebSocketProviderService,
  ) {}

  private onlineUsers = new Set<Partial<User>>();
  private socketUserMap = new Map<string, Partial<User>>();

  onModuleInit() {
    this.server = this.webSocketProvider.getServerInstance();
    this.registerSocketEvents();
  }

  private registerSocketEvents() {
    if (!this.server) {
      console.error('Server instance not initialized');
      return;
    }

    this.server.on('connection', (socket: Socket) => {
      console.log(`Client connected in NotificationService: ${socket.id}`);

      socket.on('userChatConnected', (data) => {
        this.handleUserConnected(socket, data);
      });

      socket.on('sendMessage', (data) => {
        this.handleSendMessage(socket, data);
      });

      socket.on('messageSeen', (data) => {
        this.handleMessageSeenByChatId(socket, data);
      });
    });
  }

  async handleUserConnected(@ConnectedSocket() client: Socket, @MessageBody() user: Partial<User>) {
    const isUserOnline = Array.from(this.onlineUsers.values()).some((onlineUser) => user.id === onlineUser.id);
    client.join(`${user.id}`);
    if (!isUserOnline) {
      this.onlineUsers.add(user);
      this.socketUserMap.set(client.id, user);
      console.log('User added to onlineUsers and socketUserMap:');
    } else {
      console.log('User is already online, not adding to socketUserMap:');
    }
    if (user) {
      this.server.emit('onlineUsers', Array.from(this.onlineUsers.values()));
    }
  }

  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      sender: Partial<User>;
      recipient: Partial<User>;
      message: string;
      file_name: string;
      file_url: string;
      brandId?: number;
      InfluencerId?: number;
      senderType: string;
    },
  ) {

    if (!data.sender?.id || !data.recipient?.id) {
      throw new BadRequestException('Sender or Recipient is missing');
    }
    let chat = await this.chatRepository.findChatBySenderAndReciepent(data.sender.id!, data.recipient.id!);

    if (!chat) {
      chat = await this.chatRepository.createAndSaveChat({
        unreadMessagesCount: 1,
      });
      await this.chatUserRepository.createAndSaveChat({
        user: { id: data.sender.id! },
        chat: { id: chat.id },
      });
      await this.chatUserRepository.createAndSaveChat({
        user: { id: data.recipient.id! },
        chat: { id: chat.id },
      });
    } else {
      await this.chatRepository.updateChatById(chat.id, {
        unreadMessagesCount: chat.unreadMessagesCount + 1,
      });
    }

    const message = await this.chatMessageRepository.createAndSaveMessage({
      message: data.message,
      sender: { id: data.sender.id! },
      isSeen: false,
      fileName: data.file_name,
      fileUrl: data.file_url,
      chat: { id: chat.id },
    });

    const specificChatToBeSentToFrontEnd = await this.chatRepository.findAllChatsbyChatId([chat.id]);

    this.server.to([`${data.recipient.id}`, `${data.sender.id}`]).emit('recieveSpecificChat', {
      specificChat: specificChatToBeSentToFrontEnd[0],
      from: 'sendMessage',
    });
  }

  async handleMessageSeenByChatId(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      chatId: number;
      recipientId: number;
      senderId: number;
    },
  ) {
    const user = await this.userRepository.findById(data.recipientId);
    const updatedMessage = await this.chatMessageRepository.updateMessageSeen(data.chatId);

    const chat = await this.chatRepository.findChatBySenderAndReciepent(data.senderId, data.recipientId);

    await this.chatRepository.updateChatById(chat!.id, {
      unreadMessagesCount: 0,
    });

    if (updatedMessage && user) {
      console.log(`Message seen by user ${data.recipientId} in chat ${data.chatId}`);

      const specificChatToBeSentToFrontEnd = await this.chatRepository.findAllChatsbyChatId([data.chatId]);
      this.server.to([`${data.recipientId}`, `${data.senderId}`]).emit('recieveSpecificChat', {
        specificChat: specificChatToBeSentToFrontEnd[0],
        from: 'message Seen',
      });
    } else {
      console.log(`No message found for chatId ${data.chatId} and recipientId ${data.recipientId}`);
    }
    return [];
  }
}
