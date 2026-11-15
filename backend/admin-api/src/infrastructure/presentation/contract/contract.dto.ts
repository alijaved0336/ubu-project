import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitContractDTO {
  @ApiProperty({ description: 'Signed Contract Document URL' })
  @IsString()
  contractDocumentUrl: string;

  @ApiProperty({ description: 'Brand Signature Image URL', required: false })
  @IsOptional()
  @IsString()
  brandSignUrl: string;

  @ApiProperty({
    description: 'Influencer Signature Image URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  influencerSignUrl: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  campaignId: number;
}

export class GetCampaignContractDTO {
  @ApiProperty({ description: 'Campaign Id', example: 1 })
  @IsNumber()
  campaignId: number;
}

export class CreateContractDocumentDto {
  @ApiProperty({ description: 'Brand Signature Image URL' })
  @IsOptional()
  @IsString()
  brandSignUrl: string;

  @ApiProperty({ description: 'Influencer Signature Image URL' })
  @IsOptional()
  @IsString()
  influencerSignUrl: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  campaignId: number;
}
