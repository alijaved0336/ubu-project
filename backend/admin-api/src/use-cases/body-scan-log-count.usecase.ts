import { BodyScanLogCount } from '@infrastructure/orm/entities/body-scan-log-count.entity';
import { BodyScanLogCountRepository } from '@infrastructure/orm/reposiories/body-scan-log-count.repository';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { UBU_TEAM_EMAILS } from '@infrastructure/utils/constant';
import { returnEmailWrapper1 } from '@infrastructure/utils/emailWrappers';
import { UpdateResult } from 'typeorm';

export class BodyScanLogCountUsecase {
  private BODY_SCAN_LIMIT = 20;
  private ALLOW_EMAIL_SENDING_COUNT = 15;

  constructor(
    private bodyScanLogCountRepository: BodyScanLogCountRepository,
    private mailgunService: MailGunService,
  ) {}

  async updateBodyScanLogCount() {
    const oldBodyCount = await this.bodyScanLogCountRepository.findAll();
    console.log(oldBodyCount, 'oldBodyCount');

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    if (oldBodyCount.length) {
      for (const existingCount of oldBodyCount) {
        const updatedAt = new Date(existingCount.updated_at);
        const updatedMonth = updatedAt.getMonth();
        const updatedYear = updatedAt.getFullYear();

        if ((updatedMonth === currentMonth - 1 && updatedYear === currentYear) || updatedYear < currentYear) {
          await this.update(existingCount.id, { count: 1 });
        } else {
          if (existingCount.count === this.BODY_SCAN_LIMIT) {
            await this.update(existingCount.id, { count: 1 });
          } else {
            await this.update(existingCount.id, { count: ++existingCount.count });
          }
        }
      }
    } else {
      await this.create({ count: 1 });
    }

    const newBodyCount = await this.bodyScanLogCountRepository.findAll();
    newBodyCount.map(async (nbc) => {
      if (nbc.count >= this.ALLOW_EMAIL_SENDING_COUNT) {
        for (const recipient of UBU_TEAM_EMAILS) {
          await this.mailgunService.sendEmail(
            recipient.email,
            'Body Scan Log Count Update',
            returnEmailWrapper1(this.returnEmailBody(recipient.name, nbc.count)),
            true,
          );
        }
      }
    });
  }

  async create(payload: Partial<BodyScanLogCount>) {
    return await this.bodyScanLogCountRepository.create(payload);
  }

  async findAll(): Promise<BodyScanLogCount[]> {
    return this.bodyScanLogCountRepository.findAll();
  }

  async update(id: number, payload: Partial<BodyScanLogCount>): Promise<UpdateResult> {
    return await this.bodyScanLogCountRepository.update(id, payload);
  }

  async remove(id: number): Promise<void> {
    await this.bodyScanLogCountRepository.delete(id);
  }

  async truncate(): Promise<void> {
    await this.bodyScanLogCountRepository.clear();
  }

  returnEmailBody(userName: string, count: number): string {
    return `
       <h1 style="font-size: 24px; color: #000; text-align: center;">UBU Body Scan Alert</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #333;">
          Dear ${userName},
        </p>
        <p style="font-size: 16px; line-height: 1.5; color: #333;">
          The body scan has been performed ${count} times.
        </p>
        <p style="font-size: 16px; line-height: 1.5; color: #333;">
          Regards,<br>
          UBU Team
        </p>
    `;
  }
}
