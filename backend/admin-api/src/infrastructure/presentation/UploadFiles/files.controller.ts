import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  InternalServerErrorException,
  Inject,
  Body,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import UsecaseProxy, { FILE_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { FileUsecase } from '@use-cases/file.usecase';
import { UploadFileDto } from './uploadFileDto';
import { FileSizeInterceptor } from './max-file-size.validator';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import * as path from 'path';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';

@Controller('files')
@ApiTags('files')
@ApiBearerAuth()
export class FilesController {
  constructor(
    @Inject(FILE_USECASE_PROXY)
    private readonly fileUsecaseProxy: UsecaseProxy<FileUsecase>,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10),
    new FileSizeInterceptor(10 * 1024 * 1024), // 10MB in bytes
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiBody({
    description: 'Upload multiple files',
    type: UploadFileDto,
  })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[], @Body() uploadFilesDto: UploadFileDto) {
    const { folderName } = uploadFilesDto;
    return this.fileUsecaseProxy.getInstance().uploadFiles(files, folderName);
  }

  @ApiResponse({ status: 200, description: 'Files uploaded successfully.' })
  @Post('affiliate-weekly-report/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsvFile(@UploadedFile() file: Express.Multer.File) {
    // Ensure file is uploaded
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    // Validate file extension
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (fileExtension !== '.csv') {
      throw new BadRequestException('Invalid file type. Only CSV files are allowed.');
    }

    try {
      // Process the binary file saved in the filesystem
      console.log('fileee', file);
      const aa = await this.fileUsecaseProxy.getInstance().parseAndSaveCsvFromBuffer(file.buffer);
      return aa;
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to process the CSV file.');
    }
  }
}
