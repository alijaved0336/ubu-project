import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsS3Service {
  private s3: AWS.S3;
  private bucketName: string | undefined;
  private folderCreated: boolean = false;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
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
        await this.s3.headObject({ Bucket: this.bucketName, Key: `${folderName}/` }).promise();
      } catch (err) {
        if (err.code === 'NotFound') {
          await this.s3.putObject(params).promise();
        } else {
          throw err;
        }
      }

      this.folderCreated = true;
    }
  }


  async fetchFilesInFolder(folderName: string): Promise<string[]> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('AWS_S3_BUCKET_NAME is not defined');
    }

    const params: AWS.S3.ListObjectsV2Request = {
      Bucket: this.bucketName,
      Prefix: `${folderName}/`,
    };

    try {
      const response = await this.s3.listObjectsV2(params).promise();

      if (response.Contents) {
        // Sort by LastModified (newest to oldest)
        const sorted = response.Contents.sort((a, b) => {
          const dateA = a.LastModified?.getTime() || 0;
          const dateB = b.LastModified?.getTime() || 0;
          return dateB - dateA;
        });

        return sorted.map((item) => item.Key || '');
      }

      return [];
    } catch (error) {
      console.error('Error fetching files in folder:', error);
      throw new InternalServerErrorException('Failed to fetch files in folder');
    }
  }

  async deleteAllFilesInFolder(folderName: string): Promise<void> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('AWS_S3_BUCKET_NAME is not defined');
    }
    console.log(folderName, 'folderName');
    const listedObjects = await this.s3
      .listObjectsV2({
        Bucket: this.bucketName,
        Prefix: folderName + '/',
      })
      .promise();

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      console.log('No files found in the folder.');
      return;
    }

    const objectsToDelete = listedObjects.Contents.map((object) => ({
      Key: object.Key!,
    }));

    await this.s3
      .deleteObjects({
        Bucket: this.bucketName,
        Delete: {
          Objects: objectsToDelete,
        },
      })
      .promise();

    console.log(`Successfully deleted ${objectsToDelete.length} files from ${folderName}`);
  }

  async uploadTextContent(folder: string, fileName: string, content: any): Promise<AWS.S3.ManagedUpload.SendData> {
    const key = `${folder}/${fileName}`;
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName!,
      Key: key,
      Body: content,
      ContentType: 'text/plain',
    };

    return await this.s3.upload(params).promise();
  }
}
