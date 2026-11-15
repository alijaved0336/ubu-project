import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutSession {
  @ApiProperty({
    description: 'price Id of the product which you have selected',
    example: 'price_1PDPoXLlywU04u4DFBC3k2rb',
  })
  @IsNotEmpty()
  @IsString()
  price: string;

  @ApiProperty({
    description: 'After success redirect url',
    example: 'https://example.com/success',
  })
  @IsNotEmpty()
  @IsString()
  success_url: string;

  @ApiProperty({
    description: 'After cancel redirect url',
    example: 'https://example.com/faliure',
  })
  @IsNotEmpty()
  @IsString()
  cancel_url: string;
}
