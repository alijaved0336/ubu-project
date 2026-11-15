import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { S3LoggerUsecase } from '@use-cases/s3-logger.usecase';
import UsecaseProxy, { S3_LOGGER_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function S3LoggerUsecaseProvider() {
  return {
    inject: [AwsS3Service],
    provide: S3_LOGGER_USECASE_PROXY,
    useFactory: (awsS3Service: AwsS3Service) => new UsecaseProxy(new S3LoggerUsecase(awsS3Service)),
  };
}
