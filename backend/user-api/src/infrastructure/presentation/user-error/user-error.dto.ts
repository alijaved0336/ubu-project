import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserErrorDto {
  @ApiProperty({
    description: 'Error Message',
    example: 'Something went wrong',
  })
  @IsNotEmpty()
  @IsString()
  error: string;
}
