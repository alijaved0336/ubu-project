import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

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

export class CreatePostDto {
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
  body: string;

  @ApiProperty({
    description: 'The status of the post',
    example: 'published',
  })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({
    description: 'List of product IDs associated with the post',
    example: [1, 2, 3],
  })
  // @IsNotEmpty()
  @IsOptional()
  @IsArray()
  productIds: number[];

  @ApiPropertyOptional({
    description: 'List of file URLs associated with the post',
    example: ['http://example.com/file1.jpg', 'http://example.com/file2.jpg'],
  })
  @IsOptional()
  files?: string[];

  @ApiPropertyOptional({
    description: 'List of tags associated with the post',
    example: ['tag1', 'tag2'],
  })
  @IsOptional()
  tags: string;

  @ApiPropertyOptional({
    description: 'List of media associated with the post',
    type: [MediaDto],
  })
  @IsOptional()
  media?: MediaDto[];

  @IsArray()
  @ValidateNested({ each: true }) // Validates each object in the array
  @Type(() => CreateProductDataDTO) // Transform and validate nested objects
  productData: CreateProductDataDTO[];
}

export class UpdatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'Updated Post Title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The body content of the post',
    example: 'This is the updated content of the post.',
  })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty({
    description: 'The status of the post',
    example: 'draft',
  })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({
    description: 'List of product IDs associated with the post',
    example: [4, 5, 6],
  })
  // @IsNotEmpty()
  @IsOptional()
  @IsArray()
  productIds: number[];

  @ApiPropertyOptional({
    description: 'List of file URLs associated with the post',
    example: ['http://example.com/newfile1.jpg', 'http://example.com/newfile2.jpg'],
  })
  @IsOptional()
  files?: string[];

  @ApiPropertyOptional({
    description: 'List of tags associated with the post',
    example: ['newtag1', 'newtag2'],
  })
  @IsOptional()
  tags: string;

  @ApiPropertyOptional({
    description: 'List of media associated with the post',
    type: [MediaDto],
  })
  @IsOptional()
  media?: MediaDto[];

  @IsArray()
  @ValidateNested({ each: true }) // Validates each object in the array
  @Type(() => UpdateProductDataDTO) // Transform and validate nested objects
  productData: UpdateProductDataDTO[];

  @ApiPropertyOptional({
    description: 'List of URLs associated with the post',
    type: [MediaDto],
  })
  @IsOptional()
  urls: MediaDtoWithLocationIndex[];
}

export class CreateProductDataDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true }) // Ensures all elements in the array are strings
  images: string[];

  @IsString()
  link: string;

  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    const num = Number(value);
    return isNaN(num) ? value : num;
  })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number with up to 2 decimal places' })
  @Min(0, { message: 'Price cannot be negative' })
  @IsOptional()
  price: number;
}

export class UpdateProductDataDTO {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true }) // Ensures all elements in the array are strings
  images: string[];

  @IsString()
  link: string;

  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    const num = Number(value);
    return isNaN(num) ? value : num;
  })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number with up to 2 decimal places' })
  @Min(0, { message: 'Price cannot be negative' })
  @IsOptional()
  price: number;
}
