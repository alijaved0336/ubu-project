import UsecaseProxy, { AFFILIATE_REPORT_USECASE_PROXY, USER_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { AffiliateReportRepository } from '@infrastructure/orm/reposiories/affiliate-report.repository';
import { AffiliateReportUsecase } from '@use-cases/affiliate-report.usecase';
import { UserUsecase } from '@use-cases/user.usecase';

export function AffiliateReportUseCaseProvider() {
  return {
    inject: [AffiliateReportRepository, USER_USECASE_PROXY],
    provide: AFFILIATE_REPORT_USECASE_PROXY,
    useFactory: (affiliateReportRepository: AffiliateReportRepository, userUseCase: UsecaseProxy<UserUsecase>) =>
      new UsecaseProxy(new AffiliateReportUsecase(affiliateReportRepository, userUseCase)),
  };
}
