import { PaginationQueryDto } from './s3-logger.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { S3LoggerUsecase } from '@use-cases/s3-logger.usecase';
import UsecaseProxy, { S3_LOGGER_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { Body, ClassSerializerInterceptor, Controller, Get, Inject, Post, Query, Response, UseInterceptors } from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('S3Logger')
@Controller('s3-logger')
export class S3LoggerController {
  constructor(
    @Inject(S3_LOGGER_USECASE_PROXY)
    private readonly s3LoggerUsecaseProxy: UsecaseProxy<S3LoggerUsecase>,
  ) {}

  @Get('/get-all-local-logs')
  @ApiResponse({ status: 200, description: 'ok' })
  getAllLocalLogs() {
    return this.s3LoggerUsecaseProxy.getInstance().getAllLocalLogs();
  }

  @Get('/download-s3-log-file')
  @ApiResponse({ status: 200, description: 'ok' })
  downloadS3LogFile(@Response() res, @Query('completeFileName') fileName: string) {
    return this.s3LoggerUsecaseProxy.getInstance().downloadS3LogFile(res, fileName);
  }

  @Get('/download-local-log-file')
  @ApiResponse({ status: 200, description: 'ok' })
  downloadLocalLogFile(@Response() res, @Query('completeFileName') fileName: string) {
    return this.s3LoggerUsecaseProxy.getInstance().downloadLocalLogFile(res, fileName);
  }

  @Get('/get-all-logs')
  @ApiResponse({ status: 200, description: 'Successfully retrieved blogs.' })
  async getAllLogs(@Query() paginationQueryDto: PaginationQueryDto): Promise<any> {
    return this.s3LoggerUsecaseProxy.getInstance().getAllLogs(paginationQueryDto);
  }

  @Post('/delete-s3-log-file-folder')
  @ApiResponse({ status: 200, description: 'ok' })
  deleteS3LogFileFolder(@Body() completeFileName: string) {
    return this.s3LoggerUsecaseProxy.getInstance().deleteS3LogFileFolder(completeFileName);
  }

  // @Post('/rename-s3-file')
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // login(@Body() payload: WinstonRenameS3DTO) {
  //   return this.s3LoggerUsecaseProxy.getInstance().renameS3LogFile(payload);
  // }

  // @Get('/get-all-s3-logs')
  // @ApiResponse({ status: 200, description: 'ok' })
  // getAllS3Logs() {
  //   return this.s3LoggerUsecaseProxy.getInstance().getAllS3Logs();
  // }

  // @Delete('/delete-s3-log-file')
  // @ApiResponse({ status: 200, description: 'ok' })
  // deleteS3LogFile(@Query('completeFileName') fileName: string) {
  //   return this.s3LoggerUsecaseProxy.getInstance().deleteS3LogFile(fileName);
  // }
}
