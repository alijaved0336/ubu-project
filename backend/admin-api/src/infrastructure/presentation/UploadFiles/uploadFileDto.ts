import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Array of files to be uploaded',
  })
  files: any[];

  @ApiProperty({
    description: 'Folder name where files will be uploaded',
    enum: ['products', 'posts', 'videos', 'signatures', 'blogs', 'products_new'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['products', 'posts', 'videos', 'signatures', 'blogs', 'products_new'])
  folderName: string;
}
