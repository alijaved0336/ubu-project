import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsEnum, IsInt } from 'class-validator';

export class Tag {
  @IsString()
  label: string;

  @IsString()
  value: string;

  @IsBoolean()
  isNew: boolean;
}

export class MediaDto {
  @ApiProperty({
    description: 'The URL of the media file',
    example: 'http://example.com/media.jpg',
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'The type of the media file',
    example: 'image',
    enum: ['video', 'image'],
  })
  @IsEnum(['video', 'image'])
  type: 'video' | 'image';

  @ApiProperty({
    description: 'The file extension of the media',
    example: 'jpg',
  })
  @IsString()
  extension: string;
}

export class CreateBlogDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Post',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The body content of the post',
    example: 'This is the content of my first post.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'List of tags associated with the post',
    example: [{ label: 'tag1', value: 'tag1', isNew: true }],
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  media?: MediaDto[];

  @IsOptional()
  files?: string[];
}

export class UpdateBlogDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Post',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The body content of the post',
    example: 'This is the content of my first post.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'List of tags associated with the post',
    example: [{ label: 'tag1', value: 'tag1', isNew: true }],
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  media?: MediaDto[];

  @IsOptional()
  files?: string[];

  @ApiPropertyOptional({
    description: 'List of URLs associated with the post',
    type: [MediaDto],
  })
  @IsOptional()
  urls?: MediaDto[];
}

export class FindBlogDTO {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  id: number;
}
