import { IsString, IsArray, IsNumber, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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
export class CreateExhibitDocumentDto {
  @ApiProperty({ example: 'Document description' })
  @IsString()
  description: string;

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

  @ApiProperty({ description: 'Created document Url' })
  @IsString()
  documentUrl: string;

  @ApiProperty({ example: 'advertisemntUrl' })
  @IsOptional()
  advertisemntUrl: string;

  @ApiProperty({ example: 'productId' })
  @IsOptional()
  @IsNumber()
  productId: number;
}
