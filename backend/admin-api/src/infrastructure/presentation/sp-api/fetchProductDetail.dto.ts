import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class FetchProductDetailDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @Transform(({ value }) => value === 'true') // Convert string to boolean
  @IsBoolean()
  save_data: boolean;

  @IsString()
  @IsNotEmpty()
  brandId: any;
}

export class FetchProductDto {
  @IsString()
  @IsNotEmpty()
  campaign_id: any;
}

export class FetchAwsProductDto {
  @IsString()
  @IsNotEmpty()
  amazon_link: any;
}
