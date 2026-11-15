import { Module } from '@nestjs/common';
import { MailGunService } from './mailgun.service';

@Module({
  providers: [MailGunService],
  exports: [MailGunService],
})
export class MailgunServiceModule {}
