import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { S3LoggerService } from '../s3-logger/s3-logger.service';
import { dataSourceOptions } from '@infrastructure/orm/migration/data-source';
import { MailGunService } from '../mailgun/mailgun.service';
import { returnEmailWrapper1 } from '@infrastructure/utils/emailWrappers';

@Injectable()
export class MigrationRunnerService {
  constructor(
    private readonly s3Logger: S3LoggerService,
    private readonly mailGunService: MailGunService,
  ) {}

  async runMigrations() {
    const datasource = new DataSource({
      ...dataSourceOptions,
      ...{
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
      },
    });

    try {
      console.log('Running migrations...');
      await datasource.initialize();
      const queryRunner = datasource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.query('SELECT version();');
      await queryRunner.release();
      await datasource.runMigrations();
    } catch (err) {
      console.error('❌ Migration failed:', err);
      console.log(err.message);

      const UBU_TEAM_EMAILS = [
        { email: 'sohaib@codingcops.com', name: 'Sohaib Khan' },
        { email: 'ali.javed@codingcops.com', name: 'Ali Javed' },
        { email: 'ali.riaz@codingcops.com', name: 'Ali Hassan' },
      ];

      for (const recipient of UBU_TEAM_EMAILS) {
        await this.mailGunService.sendEmail(
          recipient.email,
          'Migrations Failed',
          returnEmailWrapper1(`<p style="font-size: 16px; line-height: 1.5; color: #333;">
            The migration has failed in ${process.env.NODE_ENV} environment : ${JSON.stringify(err)}
          </p>`),
          true,
        );
      }

      await this.s3Logger.logMigrationError(err);
    }
  }
}
