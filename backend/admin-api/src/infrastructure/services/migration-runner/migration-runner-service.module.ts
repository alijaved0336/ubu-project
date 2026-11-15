import { Module } from '@nestjs/common';
import { MigrationRunnerService } from './migration-runner-service';
import { S3LoggerModule } from '../s3-logger/s3-logger-service.module';
import { MailgunServiceModule } from '../mailgun/mailgun-service.module';

@Module({
  imports: [S3LoggerModule, MailgunServiceModule],
  providers: [MigrationRunnerService],
  exports: [MigrationRunnerService],
})
export class MigrationRunnerServiceModule {}
