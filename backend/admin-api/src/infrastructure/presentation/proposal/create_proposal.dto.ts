export enum ProposalStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateProposalDto {
  @ApiProperty({
    description: 'Body must be present. HTML is also supported',
  })
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    description: 'Name of the proposal',
  })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'The status of the proposal, must be either draft or published',
    enum: ProposalStatus,
  })
  @IsEnum(ProposalStatus)
  status: ProposalStatus;

  @ApiPropertyOptional({
    description: 'influncer_id must exist',
  })
  @IsOptional()
  influencerId: number;

  @IsOptional()
  created_at: any;

  @IsOptional()
  updated_at: any;
}
