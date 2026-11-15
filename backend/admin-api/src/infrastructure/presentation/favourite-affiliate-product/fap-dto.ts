import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFavoriteAffiliateProductDto {
  @IsNotEmpty()
  @IsNumber()
  affiliateProductId: number;
}
