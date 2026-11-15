import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ConsumerDto } from '../consumer/consumer.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteAffiliateProductDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the affiliate product to be favorited',
  })
  @IsNotEmpty()
  @IsNumber()
  affiliateProductId: number;
}

export class AffiliateProductDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsString()
  description: string;

  @Expose()
  @IsArray()
  images: string[];

  @Expose()
  @IsString()
  link: string;

  @Expose()
  @IsString()
  isFavorite: boolean;

  @Expose()
  @Type(() => Date)
  @IsDate()
  created_at: Date;

  @Expose()
  @Type(() => Date)
  @IsDate()
  updated_at: Date;

  @Expose()
  @Type(() => FavoriteAffiliateProductDto)
  favoriteAffiliateProducts: FavoriteAffiliateProductDto[];

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number with up to 2 decimal places' })
  @Min(0, { message: 'Price cannot be negative' })
  @IsOptional()
  price: number;
}

export class FavoriteAffiliateProductDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @Type(() => ConsumerDto)
  consumer?: ConsumerDto;

  @Expose()
  @Type(() => AffiliateProductDto)
  affiliateProduct: AffiliateProductDto;

  @Expose()
  @Type(() => Date)
  @IsDate()
  created_at: Date;

  @Expose()
  @Type(() => Date)
  @IsDate()
  updated_at: Date;
}
