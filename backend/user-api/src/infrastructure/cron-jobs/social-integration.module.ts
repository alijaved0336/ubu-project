import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialIntegrationService } from './social-integration.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SocialIntegration } from '@infrastructure/orm/entities/social-integration.entity';
import { SocialIntegrationRepository } from '@infrastructure/orm/reposiories/social-integration.repository';

@Module({
  imports: [ScheduleModule.forRoot(),
            TypeOrmModule.forFeature([SocialIntegration, SocialIntegrationRepository])],
  providers: [SocialIntegrationService],
  exports:[SocialIntegrationService],
  controllers: [],
})
export class SocialIntegrationModule {}