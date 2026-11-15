import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Upload } from '@aws-sdk/lib-storage';
import * as ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import { MediaDto } from '@infrastructure/presentation/product/product.dto';
import { randomUUID } from 'crypto';
import {
  _Object,
  CompleteMultipartUploadCommandOutput,
  DeleteObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsV2CommandInput,
  PutObjectCommandInput,
  S3,
  S3Client,
} from '@aws-sdk/client-s3';

import * as mime from 'mime-types';
import { Readable } from 'stream';
// Set the path for ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);
const { v4: uuidv4 } = require('uuid');

@Injectable()
export class AwsS3Service {
  private s3: S3;
  private bucketName: string | undefined;
  private folderCreated: boolean = false;

  constructor() {
    this.s3 = new S3([
      {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        region: process.env.AWS_REGION,
      },
    ]);

    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!this.bucketName) {
      throw new InternalServerErrorException('AWS_S3_BUCKET_NAME is not defined');
    }
  }

  async createFolder(folderName: string): Promise<void> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('AWS_S3_BUCKET_NAME is not defined');
    }
    if (!this.folderCreated) {
      const params = {
        Bucket: this.bucketName,
        Key: `${folderName}/`,
        Body: 'Folder',
      };

      try {
        await this.s3.headObject({ Bucket: this.bucketName, Key: `${folderName}/` });
      } catch (err) {
        if (err.name === 'NotFound') {
          await this.s3.putObject(params);
        } else {
          throw err;
        }
      }

      this.folderCreated = true;
    }
  }

  async uploadFile(file: Express.Multer.File, folderName: string): Promise<CompleteMultipartUploadCommandOutput & { ContentType: string; size: number }> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('AWS_S3_BUCKET_NAME is not defined');
    }
    // Ensure file.buffer is present
    if (!file.buffer) {
      throw new InternalServerErrorException('File buffer is missing');
    }

    const params = {
      Bucket: this.bucketName,
      Key: `${folderName}/${uuidv4()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const result = await new Upload({
      client: this.s3,
      params,
    }).done();
    return { ...result, size: file.size, ContentType: file.mimetype };
  }

  async uploadFileFromPath(filePath: string, folderName: string): Promise<CompleteMultipartUploadCommandOutput> {
    // Ensure the folder exists in the S3 bucket
    await this.createFolder(folderName);

    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const params = {
      Bucket: this.bucketName!,
      Key: `${folderName}/${uuidv4()}_${fileName}`,
      Body: fileContent,
      ContentType: 'application/pdf',
    };

    return await new Upload({
      client: this.s3,
      params,
    }).done();
  }

  async uploadMultipleFiles(files: Express.Multer.File[], folderName: string): Promise<MediaDto[]> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('AWS_S3_BUCKET_NAME is not defined');
    }

    const uploadPromises = files.map((file) => this.uploadFile(file, folderName));
    const uploadResults = await Promise.all(uploadPromises);

    const mediaDtoPromises = uploadResults.map(async (result) => {
      const mediaDto = new MediaDto();
      mediaDto.size = result.size;
      mediaDto.url = result.Location ?? '';
      mediaDto.type = result.ContentType.startsWith('image/') ? 'image' : 'video';
      mediaDto.extension = result?.Key?.split('.').pop() || '';
      return mediaDto;
    });

    return Promise.all(mediaDtoPromises);
  }

  async uploadBufferImagesToS3(images: { url: string; buffer: Buffer }[], folderName): Promise<MediaDto[]> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('AWS_S3_BUCKET_NAME is not defined');
    }

    const bucketName = this.bucketName;

    const s3Client = new S3Client({ region: process.env.AWS_REGION });

    const uploadPromises = images.map(async ({ url, buffer }) => {
      const fileName = `${randomUUID()}-${url.split('/').pop()}`;
      const key = `${folderName}/${fileName}`;
      const params: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: `${folderName}/${fileName}`,
        Body: buffer,
        ContentType: 'image/jpeg',
      };
      const result = await new Upload({
        client: this.s3,
        params,
      }).done();
      const mimeType = mime.lookup(fileName);

      return { ...result, ContentType: mimeType };
    });

    const uploadResults = await Promise.all(uploadPromises);

    const mediaDtoPromises = uploadResults.map(async (result) => {
      const mediaDto = new MediaDto();
      mediaDto.url = result.Location ?? '';
      mediaDto.type = result.ContentType.startsWith('image/') ? 'image' : 'video';
      mediaDto.extension = result?.Key?.split('.').pop() || '';
      return mediaDto;
    });

    return Promise.all(mediaDtoPromises);
  }

  async fetchFilesInFolder(folderName: string, useContinuationToken = false): Promise<string[]> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('AWS_S3_BUCKET_NAME is not defined');
    }

    const baseParams: ListObjectsV2CommandInput = {
      Bucket: this.bucketName,
      Prefix: `${folderName}/`,
    };

    const sortAndMap = (items: Array<_Object>): string[] => {
      return items
        .sort((a, b) => {
          const dateA = a.LastModified?.getTime() || 0;
          const dateB = b.LastModified?.getTime() || 0;
          return dateB - dateA;
        })
        .map((item) => item.Key || '');
    };

    try {
      if (!useContinuationToken) {
        const response = await this.s3.listObjectsV2(baseParams);
        return response.Contents ? sortAndMap(response.Contents) : [];
      }

      const allContents: Array<Object> = [];
      let continuationToken: string | undefined = undefined;

      do {
        const response = await this.s3.listObjectsV2({
          ...baseParams,
          ContinuationToken: continuationToken,
        });
        if (response.Contents) {
          allContents.push(...response.Contents);
        }
        continuationToken = response.NextContinuationToken;
      } while (continuationToken);

      return sortAndMap(allContents);
    } catch (error) {
      console.error('Error fetching files in folder:', error);
      throw new InternalServerErrorException('Failed to fetch files in folder');
    }
  }

  async deleteFileByPath(filePath: string): Promise<void> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('AWS_S3_BUCKET_NAME is not defined');
    }

    const params: DeleteObjectCommandInput = {
      Bucket: this.bucketName,
      Key: decodeURIComponent(filePath),
    };

    try {
      await this.s3.deleteObject(params);
      console.log(`File deleted successfully: ${filePath}`);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  async deleteAllFilesInFolder(folderName: string): Promise<void> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('AWS_S3_BUCKET_NAME is not defined');
    }
    console.log(folderName, 'folderName');
    const listedObjects = await this.s3.listObjectsV2({
      Bucket: this.bucketName,
      Prefix: folderName + '/',
    });

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      console.log('No files found in the folder.');
      return;
    }

    const objectsToDelete = listedObjects.Contents.map((object) => ({
      Key: object.Key!,
    }));

    await this.s3.deleteObjects({
      Bucket: this.bucketName,
      Delete: {
        Objects: objectsToDelete,
      },
    });

    console.log(`Successfully deleted ${objectsToDelete.length} files from ${folderName}`);
  }

  async deleteConflictingFilesInFolder(folderName: string, filesToBeUploaded: Express.Multer.File[]): Promise<void> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('AWS_S3_BUCKET_NAME is not defined');
    }
    const alreadyUploadedFilesUrls = await this.fetchFilesInFolder(folderName);
    for (const file of filesToBeUploaded) {
      const originalName = file.originalname;

      const matchingPaths = alreadyUploadedFilesUrls.filter((path) => path.includes(originalName));

      for (const path of matchingPaths) {
        try {
          await this.deleteFileByPath(path);
        } catch (error) {
          console.error(`Failed to delete file at ${path}:`, error);
        }
      }
    }
  }

  async updateConflictingFilesName(folderName: string, filesToBeUploaded: Express.Multer.File[]): Promise<Express.Multer.File[]> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('AWS_S3_BUCKET_NAME is not defined');
    }
    const alreadyUploadedFilesUrls = await this.fetchFilesInFolder(folderName);

    const updatedFilesData = filesToBeUploaded?.map((file) => {
      const foundDuplicate = alreadyUploadedFilesUrls?.some((url) => url.includes(file.originalname));

      if (foundDuplicate) {
        const [fileName, extention] = file.originalname.split('.');
        file.originalname = `${fileName}-${uuidv4()}.${extention}`;
      }

      return file;
    });

    return updatedFilesData;
  }

  async deleteUnwantedUploadedFiles(folderName: string, filesToBeUploaded: MediaDto[]): Promise<void> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('AWS_S3_BUCKET_NAME is not defined');
    }
    const alreadyUploadedFilesUrls = await this.fetchFilesInFolder(folderName);
    const filesToBeUploadedUrls = filesToBeUploaded.map((file) => decodeURIComponent(file.url));

    const unMatchingPaths: string[] = [];

    for (const path of alreadyUploadedFilesUrls) {
      const isMatching = filesToBeUploadedUrls.some((url) => url.includes(path));
      if (!isMatching) {
        unMatchingPaths.push(path);
      }
    }

    for (const path of unMatchingPaths) {
      try {
        await this.deleteFileByPath(path);
      } catch (error) {
        console.error(`Failed to delete file at ${path}:`, error);
      }
    }
  }

  streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  async downloadFileFromS3(key: string): Promise<{ buffer: Buffer; fileName: string }> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('AWS_S3_BUCKET_NAME is not defined');
    }

    const params: GetObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      const object = await this.s3.send(new GetObjectCommand(params));

      const bodyStream = object.Body;
      if (!(bodyStream instanceof Readable)) {
        throw new Error('S3 object Body is not a Node.js Readable stream.');
      }

      const buffer = await this.streamToBuffer(bodyStream);

      return {
        buffer,
        fileName: key.split('/').pop() || 'download.log',
      };
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new InternalServerErrorException('Failed to download file', error);
    }
  }

  async uploadTextContent(folder: string, fileName: string, content: any): Promise<CompleteMultipartUploadCommandOutput> {
    const key = `${folder}/${fileName}`;
    console.log('log uploaded');
    const params: PutObjectCommandInput = {
      Bucket: this.bucketName!,
      Key: key,
      Body: content,
      ContentType: 'text/plain',
    };

    return await new Upload({
      client: this.s3,
      params,
    }).done();
  }
}
