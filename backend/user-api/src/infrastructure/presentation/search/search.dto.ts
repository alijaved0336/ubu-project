import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class SearchDTO {
  @ApiProperty({
    description: 'The search string to look up products',
    example: 'Shirt',
  })
  @IsNotEmpty()
  @IsString()
  searchString: string;

  @ApiProperty({
    description: 'The page number for pagination',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: 'The number of items per page for pagination',
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit: number = 10;
}
export class PageDTO {
  @ApiProperty({
    description: 'The page number for pagination',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: 'The number of items per page for pagination',
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit: number = 10;
}
