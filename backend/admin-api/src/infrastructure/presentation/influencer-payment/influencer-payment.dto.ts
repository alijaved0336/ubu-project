import { IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePayoutDto {
  @ApiProperty({
    description: 'Amount in the smallest currency unit (e.g., cents for USD)',
    example: 5000, // $50.00
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Currency code (e.g., "usd")',
    example: 'usd',
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Connected account ID (e.g., "acct_1A2b3C4d5EfGhIj")',
    example: 'acct_1A2b3C4d5EfGhIj',
  })
  @IsNotEmpty()
  @IsString()
  connectedAccountId: string;

  @ApiProperty({
    description: 'Payout Month',
    example: '2022-04',
  })
  @IsNotEmpty()
  @IsString()
  month: string;

  @ApiProperty({
    description: '(Influencer User Id)',
    example: 111,
  })
  @IsNotEmpty()
  @IsNumber()
  influencer_user_id: number;
}
