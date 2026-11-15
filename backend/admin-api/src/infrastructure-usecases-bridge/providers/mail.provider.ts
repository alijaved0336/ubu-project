import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { MailUsecase } from '@use-cases/mail.usecase';
import UsecaseProxy, { MAIL_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function MailUsecaseProvider() {
  return {
    inject: [MailGunService],
    provide: MAIL_USECASE_PROXY,
    useFactory: (mailgunService: MailGunService) => new UsecaseProxy(new MailUsecase(mailgunService)),
  };
}
