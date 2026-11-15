import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebSocketGateway, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { User } from '@infrastructure/orm/entities/user.entity';

@Injectable()
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class WebSocketProviderService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private onlineUsers = new Set<Partial<User>>();
  private socketUserMap = new Map<string, Partial<User>>();

  constructor() {}

  getServerInstance(): Server {
    return this.server;
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    //   const user = this.socketUserMap.get(client.id);
    //   if (user) {
    //     this.onlineUsers.delete(user);
    //     this.socketUserMap.delete(client.id);
    //   }
    //   this.server.emit('onlineUsers', Array.from(this.onlineUsers.values()));
  }
}
