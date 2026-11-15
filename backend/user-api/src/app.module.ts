import { Module, ValidationPipe } from '@nestjs/common';
import { DatabaseOrmConfigModule } from './infrastructure/config/database-orm-config/database-orm-config.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { EnvConfigModule } from '@infrastructure/config/env-config/env-config.module';
import { ControllerModule } from '@infrastructure/presentation/controller.module';
import { ScheduleModule } from '@nestjs/schedule';
// import { StrategyModule } from 'infrastructure1/strategies/strategies.module';
import { CommandModule } from 'nestjs-command';
import { SeederModule } from '@infrastructure/services/seeder/seeder.command.module';
import { SentryModule } from "@sentry/nestjs/setup";
import { SentryGlobalFilter } from "@sentry/nestjs/setup";
import { MailgunServiceModule } from '@infrastructure/services/mailgun/mailgun-service.module';

@Module({
  imports: [EnvConfigModule, DatabaseOrmConfigModule, SentryModule.forRoot(), ControllerModule, SeederModule, MailgunServiceModule],
  controllers: [],
  // providers: [],
  providers: [
    SeederModule,
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
export class AppModule { }
