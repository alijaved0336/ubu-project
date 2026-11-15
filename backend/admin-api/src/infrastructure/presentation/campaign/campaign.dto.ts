import { IsString, IsArray, IsNumber, IsOptional, IsDateString, ValidateNested, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateExhibitDocumentDto } from '../exhibit-documents/exhibit-documents.dto';
import { CampaignStatus } from '@infrastructure/utils/constant';

export class RevisionsDTO {
  @IsNumber()
  number: number;

  @IsNumber()
  turnaroundTime: number;
}
class DeliverableDto {
  @ApiProperty({ example: 'Instagram Video Story' })
  @IsString()
  type: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  count: number;
}
export class CampaignUsersResponseDto {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  avatar?: string;
  type: string;
  is_brand: boolean;
  is_influencer: boolean;
  is_consumer: boolean;
  created_at: Date;
  updated_at: Date;
  is_admin: boolean;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export class CreateDocumentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  influencerId: number;

  @ApiProperty({ example: 'Campaign description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Campaign Name' })
  @IsString()
  campaignName: string;

  @ApiProperty({ example: ['hashtag1', 'hashtag2'] })
  @IsArray()
  @IsString({ each: true })
  hashtags: string[];

  @ApiProperty({
    type: [DeliverableDto],
    example: [
      { type: 'Instagram Video Story', count: 1 },
      { type: 'Instagram Image Post', count: 2 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliverableDto)
  numberOfDeliverables: DeliverableDto[];

  @ApiProperty({ example: 'Any additional requirements', required: false })
  @IsOptional()
  @IsString()
  additionalRequirements?: string;

  @ApiProperty({ example: '2023-09-30' })
  @IsDateString()
  campaignAcceptanceDeadline: string;

  @ApiProperty({ example: '2023-10-10' })
  @IsDateString()
  publicationDates: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  totalCompensation: number;

  @ApiProperty({ example: 'Brand guidelines document', required: false })
  @IsOptional()
  @IsString()
  brandGuidelines?: string;

  @ApiProperty({ example: { number: 2, turnaroundTime: 24 }, required: false })
  @IsOptional()
  @Type(() => RevisionsDTO)
  revisions?: RevisionsDTO;

  @IsOptional()
  @IsString()
  specialConditions?: string;

  @ApiProperty({ example: 'productId' })
  @IsOptional()
  @IsNumber()
  productId: number;
}
export class CreateCampaignDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  segmentId: number;

  @ApiProperty({ example: 'Campaign Name' })
  @IsString()
  campaignName: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  influencerId: number;

  @ApiProperty({
    example: CampaignStatus.PENDING,
    enum: [
      CampaignStatus.PENDING,
      CampaignStatus.ACCEPTED,
      CampaignStatus.REJECTED,
      CampaignStatus.IN_PROGRESS,
      CampaignStatus.CONTRACT_SIGNING,
      CampaignStatus.SUBMITTED,
      CampaignStatus.DISPUTED,
      CampaignStatus.COMPLETED,
      CampaignStatus.PUBLISHING,
    ],
  })
  @IsNotEmpty()
  status: CampaignStatus;
}
export class CreateCampaignWithDocumentDto {
  @ApiProperty({ type: CreateCampaignDto })
  @ValidateNested()
  @Type(() => CreateCampaignDto)
  campaign: CreateCampaignDto;

  @ApiProperty({ type: CreateExhibitDocumentDto })
  @ValidateNested()
  @Type(() => CreateExhibitDocumentDto)
  document: CreateExhibitDocumentDto;
}

export class UpdateCampaignStatusDto {
  @ApiProperty({
    description: 'The role of the user',
    example: CampaignStatus.PENDING,
    enum: [
      CampaignStatus.PENDING,
      CampaignStatus.ACCEPTED,
      CampaignStatus.REJECTED,
      CampaignStatus.IN_PROGRESS,
      CampaignStatus.CONTRACT_SIGNING,
      CampaignStatus.SUBMITTED,
      CampaignStatus.DISPUTED,
      CampaignStatus.COMPLETED,
      CampaignStatus.PUBLISHING,
    ],
  })
  @IsNotEmpty()
  status: CampaignStatus;
}

export class CreateDisputeDto {
  @ApiProperty({
    description: 'The ID of the campaign for which the dispute is being created.',
    example: 251,
  })
  @IsNotEmpty()
  @IsNumber()
  campaign_id: number;

  @ApiProperty({
    description: 'Indicates if a refund is requested.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_refund_requested: boolean;

  @ApiProperty({
    description: 'Concerns raised by the influencer.',
    example: 'Influencer did not receive the agreed compensation.',
    required: false,
  })
  @IsOptional()
  @IsString()
  influencer_concerns?: string;

  @ApiProperty({
    description: 'Concerns raised by the brand.',
    example: 'Brand believes the influencer violated the contract.',
    required: false,
  })
  @IsOptional()
  @IsString()
  brand_concerns?: string;
}
