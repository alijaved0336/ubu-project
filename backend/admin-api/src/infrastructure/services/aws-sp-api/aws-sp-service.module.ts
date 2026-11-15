import { Module } from '@nestjs/common';
import { AwsSpApiService } from './aws-sp.service';

@Module({
  providers: [AwsSpApiService],
  exports: [AwsSpApiService],
})
export class AwsSpServiceModule {}
