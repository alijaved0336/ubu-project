import { BodyScanLogCountRepository } from '@infrastructure/orm/reposiories/body-scan-log-count.repository';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { BodyScanLogCountUsecase } from '@use-cases/body-scan-log-count.usecase';

import UsecaseProxy, { BODY_SCAN_LOG_COUNT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function BodyScanLogCountUsecaseProvider() {
  return {
    inject: [BodyScanLogCountRepository, MailGunService],
    provide: BODY_SCAN_LOG_COUNT_USECASE_PROXY,
    useFactory: (bodyScanLogCountRepository: BodyScanLogCountRepository, mailGunService: MailGunService) =>
      new UsecaseProxy(new BodyScanLogCountUsecase(bodyScanLogCountRepository, mailGunService)),
  };
}
