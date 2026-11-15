import { Injectable } from '@nestjs/common';
import { AwsS3Service } from '../aws-s3/aws-s3.service';

@Injectable()
export class S3LoggerService {
  private readonly bucketName = 'ubu-admin-api-logs';
  private readonly env = process.env.NODE_ENV || 'dev';

  constructor(private readonly awsS3Service: AwsS3Service) {}

  async logInfo(meta: Record<string, any> = {}) {
    await this.log(meta, 'http', 'http-log');
  }

  async logError(meta: Record<string, any> = {}) {
    await this.log(meta, 'error', 'error-log');
  }

  async logMigrationError(meta: Record<string, any> = {}) {
    if (this.env == 'dev') return;
    const path = this.buildPath('error', 'error-log', {});
    await this.uploadLog(path, meta);
  }

  private async log(meta: Record<string, any>, folder: string, prefix: string) {
    if (this.env == 'dev') return;
    if (!meta.url || meta.url.includes('s3-logger')) return;
    const path = this.buildPath(folder, prefix, meta);
    await this.uploadLog(path, meta);
  }

  private buildPath(folder: string, prefix: string, meta: Record<string, any>): string {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    return `${date}/${this.env}/${hour}/${folder}/${prefix}-${minute}-${second}-{${meta?.url || ''}}-{${meta?.email || ''}}.txt`;
  }

  private async uploadLog(path: string, meta: Record<string, any>) {
    const content = JSON.stringify(meta, null, 2);
    await this.awsS3Service.uploadTextContent(this.bucketName, path, content);
  }
}
