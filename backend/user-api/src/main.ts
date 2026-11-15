import "./instrument";  // Import Sentry instrument
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as secureEnv from 'secure-env';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from 'logging.interceptor';
import { ValidationExceptionFilter } from "validation-exception.filter";
import { GlobalExceptionFilter } from "global.filter";


function loadEnv(env: string) {
  const envFilePath = `.env.${env}.enc`;
  console.log("ENV Path ::: ", envFilePath)
  if (fs.existsSync(envFilePath))
  {
    const decryptedEnv = secureEnv({ secret: 'ubu-user-api', path: envFilePath });
    process.env = { ...process.env, ...decryptedEnv }
  } else
  {
    console.warn(`Encrypted environment file ${envFilePath} not found`);
  }
}

async function bootstrap() {
  const env = process.env.NODE_ENV || 'dev';
  loadEnv(env);

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('UBU User API')
    .setDescription('These APIs for IOS App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Apply the interceptor globally
  const loggingInterceptor = app.get(LoggingInterceptor);
  app.useGlobalInterceptors(loggingInterceptor);

  const globalExceptionFilter = app.get(GlobalExceptionFilter);

  app.useGlobalFilters(
    // new ValidationExceptionFilter(),
    globalExceptionFilter,
  );

  await app.listen(3001);
  // app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}));
}
bootstrap();
