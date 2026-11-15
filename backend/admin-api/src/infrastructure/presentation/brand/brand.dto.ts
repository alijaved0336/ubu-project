import { IsOptional, IsString, IsDate, IsArray } from 'class-validator';

export class BrandDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  companyWebsite?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsDate()
  updated_at?: Date;

  @IsOptional()
  @IsDate()
  created_at?: Date;
}

export class AdditionalFieldsDTO {
  @IsOptional()
  @IsString()
  affliatenetwork?: { questionId: number; answer: string };

  @IsOptional()
  @IsString()
  agency?: { questionId: number; answer: string };

  @IsOptional()
  @IsString()
  campaign?: { questionId: number; answer: string };

  @IsOptional()
  @IsString()
  country?: { questionId: number; answer: string };

  @IsOptional()
  @IsString()
  describe?: { questionId: number; answer: string };

  @IsOptional()
  @IsString()
  followers?: { questionId: number; answer: string };

  @IsOptional()
  @IsString()
  numOfEmp?: { questionId: number; answer: string };

  @IsOptional()
  @IsString()
  platform?: { questionId: number; answer: string };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productsCategories?: string[];

  @IsOptional()
  @IsString()
  sale?: { questionId: number; answer: string };
}
