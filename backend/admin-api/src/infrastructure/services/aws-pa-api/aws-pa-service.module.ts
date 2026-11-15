import { Module } from '@nestjs/common';
import { AwsPaApiService } from './aws-pa.service';

@Module({
  providers: [AwsPaApiService],
  exports: [AwsPaApiService],
})
export class AwsPaServiceModule {}
