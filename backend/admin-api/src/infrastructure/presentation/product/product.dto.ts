import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MeasurmentDto {
  @ApiProperty({
    description: 'The size of the product',
    example: 42,
  })
  @IsNotEmpty()
  size: number;

  @ApiPropertyOptional({
    description: 'The dimensions of the product',
    example: { length: 30, width: 20, height: 15 },
  })
  @IsOptional()
  dimensions: any;

  @ApiProperty({
    description: 'Whether the measurement is active',
    example: true,
  })
  @IsNotEmpty()
  active: boolean;
}

export class MediaDto {
  @ApiProperty({
    description: 'The URL of the media file',
    example: 'http://example.com/media.jpg',
  })
  @IsString()
  url: string;

  @IsOptional()
  placeholder: string;

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

  @ApiProperty({
    description: 'The size of the media',
    example: 12222,
  })
  @IsNumber()
  size: number;

  @IsOptional()
  blurHash: string;

  @IsOptional()
  width: number;

  @IsOptional()
  height: number;

  @IsOptional()
  aspectRatio: number;
}

export class MediaDtoWithLocationIndex {
  @ApiProperty({
    description: 'The URL of the media file',
    example: 'http://example.com/media.jpg',
  })
  @IsString()
  url: string;

  @IsOptional()
  placeholder: string;

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

  @ApiProperty({
    description: 'The size of the media',
    example: 12222,
  })
  @IsNumber()
  size: number;

  @ApiProperty({
    description: 'The location index of the media',
    example: 1,
  })
  @IsString()
  locationIndex: string;

  @IsOptional()
  blurHash: string;

  @IsOptional()
  width: number;

  @IsOptional()
  height: number;

  @IsOptional()
  aspectRatio: number;
}

export class CreateProductDto {
  @ApiPropertyOptional({
    description: 'The ID of the brand associated with the product',
    example: 1,
  })
  @IsOptional()
  brand_id: number;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Cool Sneakers',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'High-quality sneakers for running and casual wear.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'product link',
    example: 'www.example_url.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  productLink: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 59,
  })
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'The currency of the product price',
    example: 'USD',
  })
  @IsOptional()
  currency: string;

  @ApiProperty({
    description: 'The ID of the category associated with the product',
    example: 1,
  })
  @IsNotEmpty()
  category_id: number;

  @ApiProperty({
    description: 'The ID of the subcategory associated with the product',
    example: 3,
  })
  @IsNotEmpty()
  sub_category_id: number;

  @ApiProperty({
    description: 'The ID of the gender associated with the product',
    example: 1,
  })
  @IsNotEmpty()
  gender_id: number;

  @ApiProperty({
    description: 'The status of the product (active/inactive)',
    example: true,
  })
  @IsNotEmpty()
  status: boolean;

  @ApiProperty({
    description: 'The ID of the style associated with the product',
    example: 4,
  })
  @IsNotEmpty()
  style_id: number;

  @ApiPropertyOptional({
    description: 'The colors available for the product, represented as a key-value pair where the key is the color name and the value is the hex code.',
    example: { Red: '#FF0000' },
    type: 'object',
  })
  @IsOptional()
  @IsObject()
  @Type(() => Object)
  colors: Record<string, string>;

  @ApiPropertyOptional({
    description: 'The tags associated with the product',
    example: ['sneakers', 'running', 'casual'],
  })
  @IsOptional()
  @IsString({ each: true })
  tags: string[];

  @ApiPropertyOptional({
    description: 'The measurements associated with the product',
    type: [MeasurmentDto],
  })
  @IsOptional()
  measurement: MeasurmentDto[];

  @ApiPropertyOptional({
    description: 'The media files associated with the product',
    type: [MediaDto],
  })
  @IsOptional()
  media?: MediaDto[];

  @ApiPropertyOptional({
    description: 'The files associated with the product',
    example: ['file1.jpg', 'file2.png'],
  })
  @IsOptional()
  files?: any;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'The ID of the brand associated with the product',
    example: 1,
  })
  @IsOptional()
  brand_id: number;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Cool Sneakers',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'High-quality sneakers for running and casual wear.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'product link',
    example: 'www.example_url.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  productLink: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 59,
  })
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'The currency of the product price',
    example: 'USD',
  })
  @IsOptional()
  currency: string;

  @ApiProperty({
    description: 'The ID of the category associated with the product',
    example: 1,
  })
  @IsNotEmpty()
  category_id: number;

  @ApiProperty({
    description: 'The ID of the subcategory associated with the product',
    example: 3,
  })
  @IsNotEmpty()
  sub_category_id: number;

  @ApiProperty({
    description: 'The ID of the gender associated with the product',
    example: 1,
  })
  @IsNotEmpty()
  gender_id: number;

  @ApiProperty({
    description: 'The status of the product (active/inactive)',
    example: true,
  })
  @IsNotEmpty()
  status: boolean;

  @ApiProperty({
    description: 'The ID of the style associated with the product',
    example: 4,
  })
  @IsNotEmpty()
  style_id: number;

  @ApiPropertyOptional({
    description: 'The colors available for the product, represented as a key-value pair where the key is the color name and the value is the hex code.',
    example: { Red: '#FF0000' },
    type: 'object',
  })
  @IsOptional()
  @IsObject()
  @Type(() => Object)
  colors: Record<string, string>;

  @ApiPropertyOptional({
    description: 'The tags associated with the product',
    example: ['sneakers', 'running', 'casual'],
  })
  @IsOptional()
  @IsString({ each: true })
  tags: string[];

  @ApiPropertyOptional({
    description: 'The measurements associated with the product',
    type: [MeasurmentDto],
  })
  @IsOptional()
  measurement: MeasurmentDto[];

  @ApiPropertyOptional({
    description: 'The media files associated with the product',
    type: [MediaDto],
  })
  @IsOptional()
  media?: MediaDto[];

  @ApiPropertyOptional({
    description: 'The files associated with the product',
    example: ['file1.jpg', 'file2.png'],
  })
  @IsOptional()
  files?: any;

  @ApiPropertyOptional({
    description: 'The URLs associated with the product',
    type: [MediaDto],
  })
  @IsOptional()
  urls: MediaDtoWithLocationIndex[];
}
