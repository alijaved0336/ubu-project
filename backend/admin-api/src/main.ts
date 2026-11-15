import './instrument'; // Import Sentry instrument
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as secureEnv from 'secure-env';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { LoggingInterceptor } from 'logging.interceptor';
import { GlobalExceptionFilter } from 'global.filter';
import { IpBlockMiddleware } from '@infrastructure/services/common-middleware/ip-block.middleware';
import { MigrationRunnerService } from '@infrastructure/services/migration-runner/migration-runner-service';

export function loadEnv(env: string) {
  const envFilePath = `.env.${env}.enc`;
  if (fs.existsSync(envFilePath)) {
    const decryptedEnv = secureEnv({ secret: 'ubu-admin-web-api', path: envFilePath });
    process.env = { ...process.env, ...decryptedEnv };
  } else {
    console.warn(`Encrypted environment file ${envFilePath} not found`);
  }
}

async function bootstrap() {
  const env = process.env.NODE_ENV || 'dev';
  loadEnv(env);
  console.log('---process-', process.env);
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = process.env.ALLOWED_ORIGINS || '*';
  const originsArray = allowedOrigins.split(',').filter((origin) => origin);

  app.enableCors({
    origin: '*',
  });
  app.use('/stripe-webhooks', bodyParser.raw({ type: 'application/json' }));

  app.use(new IpBlockMiddleware().use);

  const config = new DocumentBuilder()
    .setTitle('UBU Admin API')
    .setDescription('These APIs for Influencer and Brand')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const loggingInterceptor = app.get(LoggingInterceptor);

  // Apply the interceptor globally
  app.useGlobalInterceptors(loggingInterceptor);

  const globalExceptionFilter = app.get(GlobalExceptionFilter);

  app.useGlobalFilters(
    // new ValidationExceptionFilter(),
    globalExceptionFilter,
  );

  await app.listen(3000, '0.0.0.0');
  // app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}));
  return app;
}

bootstrap().then(async (app) => {
  const env = process.env.NODE_ENV || 'dev';
  const migrationRunner = app.get(MigrationRunnerService);
  if (env !== 'dev') {
    await migrationRunner.runMigrations();
    console.log('✅ Migrations completed');
  }
});
