import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FollowDTO {
  @ApiProperty({
    description: 'The ID of the user to follow',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  followee_id: number;
}
