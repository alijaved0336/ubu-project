import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FileSizeInterceptor implements NestInterceptor {
  constructor(private readonly maxSize: number) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const files: Express.Multer.File[] = request.files;

    if (files && files.length > 0) {
      for (const file of files) {
        if (file.size > this.maxSize) {
          throw new BadRequestException(`File ${file.originalname} exceeds the size limit of ${this.maxSize / (1024 * 1024)}MB`);
        }
      }
    }

    return next.handle();
  }
}
