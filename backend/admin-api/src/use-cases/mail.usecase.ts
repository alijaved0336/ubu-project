import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';

export class MailUsecase {
  constructor(private mailgunService: MailGunService) {}

  async sendEmail(toEmail: string, subject: string, text: string, isHtml: boolean) {
    return this.mailgunService.sendEmail(toEmail, subject, text, isHtml);
  }
}
