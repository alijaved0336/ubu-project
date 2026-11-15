import { Module } from '@nestjs/common';
import { GlobalExceptionFilter } from 'global.filter';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { LoggingInterceptor } from 'logging.interceptor';
import { S3LoggerService } from './s3-logger.service';

@Module({
  providers: [S3LoggerService, LoggingInterceptor, GlobalExceptionFilter, AwsS3Service],
  exports: [S3LoggerService],
})
export class S3LoggerModule {}
