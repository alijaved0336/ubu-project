import { User } from '@infrastructure/orm/entities/user.entity';
import { S3LoggerService } from '@infrastructure/services/s3-logger/s3-logger.service';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly s3Logger: S3LoggerService) {}

  private readonly logger = new Logger('API');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, url, originalUrl, body, query, params, user } = request;
    const userData = user as User;

    const now = Date.now();
    this.logger.log(`[${method}] ${url} - Incoming Request`);

    return next.handle().pipe(
      tap((data) => {
        const timestamp = new Date().toISOString();
        const elapsed = Date.now() - now;
        const responseInfo = {
          response: data,
          url: originalUrl,
          timeOfOccurance: timestamp,
          timestamp,
          email: userData?.email ?? null,
          durationMs: elapsed,
          statusCode: response.statusCode,
          body,
          query,
          params,
        };

        this.s3Logger.logInfo(responseInfo);
        this.logger.log(`[${method}] ${url} - Completed in ${elapsed}ms`);
      }),
    );
  }
}
