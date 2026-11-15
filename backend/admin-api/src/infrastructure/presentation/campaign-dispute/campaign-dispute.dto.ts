import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CampaignDisputeStatus, ResolutionAction } from '@infrastructure/orm/entities/campaign-dispute.entity';
import { PaginationDto } from '../common/common.dto';

export class UpdateCampaignDisputeStatusDto {
  @ApiProperty({
    description: 'Admin move the dispute status to a new status.',
    enum: CampaignDisputeStatus,
    example: CampaignDisputeStatus.IN_PROGRESS,
  })
  @IsEnum(CampaignDisputeStatus)
  dispute_status: CampaignDisputeStatus;
}

export class ResolveDisputeDto {
  @ApiProperty({
    description: 'Resolution action to be taken by the admin.',
    enum: ResolutionAction,
    example: ResolutionAction.RELEASE_FUNDS_TO_INFLUENCER,
  })
  @IsEnum(ResolutionAction)
  resolutionAction: ResolutionAction;

  @ApiProperty({
    description: 'Remarks or additional information regarding the update.',
    example: 'Issue resolved amicably by both parties.',
  })
  @IsString()
  remarks: string;
}

export class UpdateCampaignDisputeConcernsDto {
  @ApiProperty({
    description: 'concerns or additional information regarding the update.',
    example: 'Issue resolved amicably by both parties.',
    required: false,
  })
  @IsOptional()
  @IsString()
  influencer_concerns?: string;

  @ApiProperty({
    description: 'concerns or additional information regarding the update.',
    example: 'Issue resolved amicably by both parties.',
    required: false,
  })
  @IsOptional()
  @IsString()
  brand_concerns?: string;

  @ApiProperty({
    description: 'Indicates whether a refund has been requested by the brand, typically due to issues or concerns during the campaign.',
    example: 'Refund requested due to product quality issues.',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_refund_requested?: boolean;
}

export class GetCampaignDisputeDto extends PaginationDto {
  @ApiProperty({ name: 'status', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ name: 'resolution_action', required: false })
  @IsString()
  @IsOptional()
  resolution_action?: string;

  @ApiProperty({
    name: 'startDate',
    required: false,
    type: String,
    format: 'date',
    description: 'Format: YYYY-MM-DD.',
  })
  @IsOptional()
  @IsDateString()
  @ValidateIf((o) => !o.endDate || o.startDate <= o.endDate)
  startDate?: string;

  @ApiProperty({
    name: 'endDate',
    required: false,
    type: String,
    format: 'date',
    description: 'Format: YYYY-MM-DD.',
  })
  @IsOptional()
  @IsDateString()
  @ValidateIf((o) => !o.startDate || o.startDate <= o.endDate)
  endDate?: string;
}
