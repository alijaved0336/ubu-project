import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { Response, Request } from 'express';
import { WithSentry } from '@sentry/nestjs';
import * as Sentry from '@sentry/node';
import { S3LoggerService } from '@infrastructure/services/s3-logger/s3-logger.service';
import { User } from '@infrastructure/orm/entities/user.entity';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly s3Logger: S3LoggerService) {}
  @WithSentry()
  catch(exception: any, host: ArgumentsHost): void {
    console.log('Globle FIlter ');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const timestamp = new Date().toISOString();
    const now = Date.now();
    const elapsed = Date.now() - now;

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.message : 'Internal server error';

    const { method, originalUrl, body, query, params, user } = request;
    const userData = user as User;

    const responseInfo = {
      method,
      query,
      params,
      body: body,
      email: userData?.email ?? null,
      statusCode: status,
      url: originalUrl,
      message: exception?.message || 'Something went wrong.',
      response: exception?.response || null,
      timeOfOccurance: timestamp,
      exception: exception || null,
    };
console.log('error', responseInfo)
    this.s3Logger.logError(responseInfo);
    if (exception instanceof BadRequestException)
    {
      const exceptionResponse = exception.getResponse();
      let message = 'Validation failed';

      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse)
      {
        const messages = Array.isArray(exceptionResponse.message) ? exceptionResponse.message : [exceptionResponse.message];
        message = messages.join(', ');
        message = message.charAt(0).toUpperCase() + message.slice(1);
      }

      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: message,
      });
      return;
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR)
    {
      Sentry.captureException(exception);
    }

    response.status(status).json({
      statusCode: status,
      error: status < HttpStatus.INTERNAL_SERVER_ERROR ? exception?.response?.error : 'Internal Server Error',
      message: exception?.response?.message ?? 'Please contact the UBU support team.',
    });
    return;
  }
}
