import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobService } from './cron-job.service';
import { InfrastructureUsecasesBridgeModule } from 'infrastructure-usecases-bridge/infrastructure-usecases-bridge.module';

@Module({
  imports: [ScheduleModule.forRoot(), InfrastructureUsecasesBridgeModule.register()],
  providers: [CronJobService],
})
export class CronJobModule {}
