import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { DatabaseOrmConfigModule } from './infrastructure/config/database-orm-config/database-orm-config.module';
import { EnvConfigModule } from '@infrastructure/config/env-config/env-config.module';
import { ControllerModule } from '@infrastructure/presentation/controller.module';
import { ScriptModule } from 'scripts/script.module';
import { MailgunServiceModule } from '@infrastructure/services/mailgun/mailgun-service.module';
import { TwilioServiceModule } from '@infrastructure/services/twilio/twilio-service.module';
import { SocketModule } from '@infrastructure/sockets/socket.module';
import { SentryModule } from '@sentry/nestjs/setup';
import { SentryGlobalFilter } from '@sentry/nestjs/setup';
import { CronJobModule } from '@infrastructure/services/cron-job/cron-job.module';

@Module({
  imports: [
    EnvConfigModule,
    DatabaseOrmConfigModule,
    SentryModule.forRoot(),
    ControllerModule,
    ScriptModule,
    MailgunServiceModule,
    TwilioServiceModule,
    SocketModule,
    CronJobModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
