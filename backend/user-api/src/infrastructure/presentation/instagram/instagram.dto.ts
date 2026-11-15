import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class HandleInstagramCallbackDTO {
  @ApiProperty({
    description: 'The authorization code returned from Instagram after the user grants access',
    example: 'AQBX9X....',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'The state parameter that was passed to Instagram for CSRF protection',
    example: 'user_id=123',
  })
  @IsNotEmpty()
  @IsString()
  state: string;
}
