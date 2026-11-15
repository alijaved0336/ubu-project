import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { InfluencerAdditionalDto } from '../influencer/influencer.dto';
import { AdditionalFieldsDTO } from '../brand/brand.dto';

export class userAnswersDTO {
  @ApiPropertyOptional({
    description: 'Additional fields data',
    type: () => AdditionalFieldsDTO,
  })
  @IsOptional()
  @Type(() => AdditionalFieldsDTO)
  additionalFields: AdditionalFieldsDTO;

  @ApiPropertyOptional({
    description: 'Additional influencer-specific data',
    type: () => InfluencerAdditionalDto,
  })
  @IsOptional()
  @Type(() => InfluencerAdditionalDto)
  influencerAdditionalDto: InfluencerAdditionalDto;
}
