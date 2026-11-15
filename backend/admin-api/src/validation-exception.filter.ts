import { Response } from 'express';
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const exceptionResponse = exception.getResponse();
    let message = 'Validation failed';

    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      const messages = Array.isArray(exceptionResponse.message) ? exceptionResponse.message : [exceptionResponse.message];
      message = messages.join(', ');
      message = message.charAt(0).toUpperCase() + message.slice(1);
    }

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: message,
    });
  }
}
