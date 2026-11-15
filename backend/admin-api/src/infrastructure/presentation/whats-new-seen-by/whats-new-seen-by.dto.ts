import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateWhatsNewSeenByDto {
  @ApiProperty({
    description: 'Array of WhatsNew IDs',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  whatsNewIds: number[];
}
