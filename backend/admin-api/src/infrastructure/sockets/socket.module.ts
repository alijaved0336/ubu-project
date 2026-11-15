import { forwardRef, Module } from '@nestjs/common';
import { RepositoriesModule } from '@infrastructure/orm/reposiories/repository.module';
import { InfrastructureUsecasesBridgeModule } from 'infrastructure-usecases-bridge/infrastructure-usecases-bridge.module';
import { WebSocketProviderService } from './web-socket-provider';
import { NotificationService } from './notification.service';
import { ChatService } from './chat.service';
import { CampaignService } from './campaign.service';

@Module({
  imports: [RepositoriesModule, forwardRef(() => InfrastructureUsecasesBridgeModule.register())],
  controllers: [],
  providers: [WebSocketProviderService, NotificationService, ChatService, CampaignService],
  exports: [WebSocketProviderService, NotificationService, ChatService, CampaignService],
})
export class SocketModule {}
