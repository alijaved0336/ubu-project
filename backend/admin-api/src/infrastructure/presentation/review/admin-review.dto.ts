import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateAdminReviewDto {
  @IsNotEmpty()
  @IsNumber()
  reviewer_id: number;

  @IsNotEmpty()
  @IsEnum(['brand', 'influencer'])
  reviewer_type: 'brand' | 'influencer';

  @IsNotEmpty()
  @IsNumber()
  reviewable_id: number;

  @IsNotEmpty()
  @IsEnum(['brand', 'influencer'])
  reviewable_type: 'brand' | 'influencer';

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsOptional()
  @IsNumber()
  campaign_id: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsBoolean()
  is_anonymous: boolean;

  @IsOptional()
  created_at?: Date;
}
