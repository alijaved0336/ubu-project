import { Expose, Type } from 'class-transformer';
import { AffiliateProductDto } from '../favourite-affiliate-product/fap-dto';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class ProductSizeDto {
  @Expose()
  height: number;

  @Expose()
  width: number;

  @Expose()
  active: boolean;

  @Expose()
  size: string;
}

export class MediaDto {
  @Expose()
  url: string;

  @Expose()
  type: 'video' | 'image';

  @Expose()
  extension: string;

  @Expose()
  thumbnail: string;
}



export class ProductDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  productLink: string

  @Expose()
  currency: string;

  @Expose()
  colors: Record<string, string>;

  @Expose()
  isFavorite: boolean;

  @Expose()
  @Type(() => ProductSizeDto)
  productSizes: ProductSizeDto[];

  @Expose()
  media?: MediaDto[];

}

export class CusumerDto {
  @Expose()
  id: number;

}
export class ProductFavouriteDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => CusumerDto)
  consumer: CusumerDto;
}

export class PostProductDto {
  @Expose()
  @Type(() => ProductFavouriteDto)
  product_favourites: ProductFavouriteDto[]; // Ensure this is not an array

  @Expose()
  @Type(() => ProductDto)
  product: ProductDto; // Ensure this is not an array
}



export class PostDto {
  @Expose()
  id: number

  @Expose()
  title: string;

  @Expose()
  body: string;

  @Expose()
  status: string;

  @Expose()
  productData: string;

  @Expose()
  @Type(() => PostProductDto)
  postProducts: PostProductDto[];

  @Expose()
  @Type(() => AffiliateProductDto)
  affiliateProducts: AffiliateProductDto[];

  @Expose()
  media?: MediaDto[];

  @Expose()
  tags: string[];

  @Expose()
  created_at: Date
}

export enum PostStatus {
  ALL = 'All',
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
}

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}

export class RecentPostsPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(PostStatus, {
    message: "Status must be 'All', 'Draft', or 'Published'",
  })
  status?: PostStatus;
}
