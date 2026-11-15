import { AffiliateReportRepository } from '@infrastructure/orm/reposiories/affiliate-report.repository';
import { AffliateRepository } from '@infrastructure/orm/reposiories/affliate.repository';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { StripeService } from '@infrastructure/services/stripe/stripe-service.service';
import { FileUsecase } from '@use-cases/file.usecase';
import UsecaseProxy, { FILE_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function FileUsecaseProvider() {
  return {
    inject: [AwsS3Service, AffiliateReportRepository, AffliateRepository, StripeService],
    provide: FILE_USECASE_PROXY,
    useFactory: (awsService: AwsS3Service, affiliateWeeklyReportRepository: AffiliateReportRepository, affliateRepository: AffliateRepository, stripeService: StripeService) =>
      new UsecaseProxy(new FileUsecase(awsService, affiliateWeeklyReportRepository, affliateRepository, stripeService)),
  };
}
