import { Module } from '@nestjs/common';
import { CampaignQueueService } from './queue.service';
import { JobsProcessor } from './jobs.processor';
import { InfrastructureUsecasesBridgeModule } from 'infrastructure-usecases-bridge/infrastructure-usecases-bridge.module';
import { WebSocketProviderService } from '@infrastructure/sockets/web-socket-provider';
import { SocketModule } from '@infrastructure/sockets/socket.module';

@Module({
  imports: [InfrastructureUsecasesBridgeModule.register(), SocketModule],
  providers: [CampaignQueueService, JobsProcessor, WebSocketProviderService],
  exports: [CampaignQueueService, JobsProcessor],
})
export class JobsModule {}
