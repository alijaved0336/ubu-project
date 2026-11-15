import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { PaginationQueryDto } from '@infrastructure/presentation/s3-logger/s3-logger.dto';

@Injectable()
export class S3LoggerUsecase {
  constructor(private awsService: AwsS3Service) {}

  private s3UserApiLogsFolder = 'ubu-user-api-logs';
  private s3UserAdminLogsFolder = 'ubu-admin-api-logs';

  async getAllLocalLogs(): Promise<string[]> {
    const env = process.env.NODE_ENV || 'dev';
    const folderName = 'logs';
    const logDir = path.resolve(__dirname, env === 'production' ? folderName : `../../${folderName}`);
    console.log(logDir);
    try {
      if (!fs.existsSync(logDir)) {
        return [`${folderName}/`];
      }

      const files = fs.readdirSync(logDir);
      const logFiles = files.filter((file) => file.endsWith('.log')).map((file) => `${folderName}/${file}`);

      return [`${folderName}/`, ...logFiles];
    } catch (error) {
      console.error('Error reading local logs folder:', error);
      return [];
    }
  }

  async downloadS3LogFile(res, completeFileName) {
    console.log({ completeFileName });
    const { buffer, fileName } = await this.awsService.downloadFileFromS3(completeFileName);
    res.set({
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    console.log(buffer, 'bffer');

    res.send(buffer);
  }

  async downloadLocalLogFile(res, completeFileName: string): Promise<void> {
    const env = process.env.NODE_ENV || 'dev';
    const logDir = path.resolve(__dirname, env === 'production' ? 'logs' : '../../logs');
    const filePath = path.join(logDir, completeFileName);

    if (!fs.existsSync(filePath)) {
      res.status(404).send(`File "${completeFileName}" not found`);
      return;
    }

    const fileContent = fs.readFileSync(filePath);

    res.set({
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="${completeFileName}"`,
    });

    res.send(fileContent);
  }

  async getAllLogs(PaginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10, search = '', isUserApiLogs, dateToFind } = PaginationQuery;
    const folderName = isUserApiLogs ? `${this.s3UserApiLogsFolder}/${dateToFind}` : `${this.s3UserAdminLogsFolder}/${dateToFind}`;
    const allLogs = await this.awsService.fetchFilesInFolder(folderName, true);

    const cleanedLogs = allLogs.filter((log) => log !== `${folderName}/`);

    const filteredLogs = search ? cleanedLogs.filter((log) => log.toLowerCase().includes(search.toLowerCase())) : cleanedLogs;

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedLogs = filteredLogs.slice(start, end);

    return {
      total: filteredLogs.length,
      applicationLogs: paginatedLogs,
    };
  }

  async deleteS3LogFileFolder(completeFileName) {
    return await this.awsService.deleteAllFilesInFolder(completeFileName.completeFileName);
  }
}
