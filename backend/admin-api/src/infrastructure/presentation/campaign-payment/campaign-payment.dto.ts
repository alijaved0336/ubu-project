// src/dtos/create-payment-intent.dto.ts
import { IsObject, IsEmail, IsNumber, IsString, IsOptional, IsNotEmpty, IsUrl, Min, IsDateString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../common/common.dto';

export class CreatePaymentIntentDto {
  @ApiProperty({
    description: 'The ID of the campaign for which you want to create a payment intent.',
    example: 251,
  })
  @IsNotEmpty()
  @IsNumber()
  campaign_id: number;

  @ApiProperty({
    description: 'The amount to charge in smallest currency units (e.g., cents).',
    example: 18000,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The currency of the payment (e.g., USD, EUR).',
    example: 'usd',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'Additional metadata for the payment.',
    type: Object,
    example: {
      campaign_id: 251,
    },
  })
  @IsObject()
  metadata: Record<string, any>;
}

// src/dtos/create-connected-account.dto.ts
export class CreateConnectedAccountDto {
  @ApiProperty({
    description: 'The email address for the connected account.',
    example: 'ubu@gmail.com',
  })
  @IsEmail({}, { message: 'please enter a valid email address' })
  email: string;

  @ApiProperty({
    description: 'country',
    example: 'US',
  })
  @IsString()
  country: string;

  @ApiProperty({
    description: 'The URL the user is redirected to after onboarding is complete.',
    example: 'https://example.com/onboarding/success',
  })
  @IsUrl()
  @IsNotEmpty()
  returnUrl: string;

  @ApiProperty({
    description: 'The URL the user is redirected to if onboarding fails or needs to be retried.',
    example: 'https://example.com/onboarding/retry',
  })
  @IsUrl()
  @IsNotEmpty()
  refreshUrl: string;
}

export class UpdateConnectedAccountDto {
  @ApiProperty({
    description: 'City',
    example: 'city',
  })
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Country',
    example: 'country',
  })
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'Line 1',
    example: 'Street No 1',
  })
  @IsNotEmpty()
  addressLine1: string;

  @ApiProperty({
    description: 'Phone',
    example: '+14155552671',
  })
  @IsNotEmpty()
  phone: string;
  @ApiProperty({
    description: 'Postal Code',
    example: '10001',
  })
  @IsNotEmpty()
  postal_code: string;

  @ApiProperty({
    description: 'Postal Code',
    example: '54000',
  })
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'Postal Code',
    example: '54000',
  })
  @IsNotEmpty()
  ssn: string;

  @ApiProperty({
    description: 'Routing Number',
    example: '110000000',
  })
  @IsNotEmpty()
  bankRoutingNumber: string;
  @ApiProperty({
    description: 'Postal Code',
    example: '000123456789',
  })
  @IsNotEmpty()
  bankAccountNumber: string;
  @ApiProperty({
    description: 'IP Address',
    example: '10.10.10.10',
  })
  @IsNotEmpty()
  ipAddress: string;
}
// src/dtos/release-funds.dto.ts
export class ReleaseFundsDto {
  // @ApiProperty({ description: 'The currency of the transfer (e.g., USD, EUR).' })
  // @IsString()
  // currency: string;

  @ApiProperty({
    description: 'The connected account ID to which funds are released.',
    example: 12,
  })
  @IsNumber()
  campaign_id: number;
}

export class CreatePayoutDto {
  @ApiProperty({
    description: 'Amount in the smallest currency unit (e.g., cents for USD)',
    example: 5000, // $50.00
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
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
}

export class GetTransactionLogsDto extends PaginationDto {
  @ApiProperty({ name: 'status', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    name: 'startDate',
    required: false,
    type: String,
    format: 'date',
    description: 'Format: YYYY-MM-DD.',
  })
  @IsOptional()
  @IsDateString()
  @ValidateIf((o) => !o.endDate || o.startDate <= o.endDate)
  startDate?: string;

  @ApiProperty({
    name: 'endDate',
    required: false,
    type: String,
    format: 'date',
    description: 'Format: YYYY-MM-DD.',
  })
  @IsOptional()
  @IsDateString()
  @ValidateIf((o) => !o.startDate || o.startDate <= o.endDate)
  endDate?: string;
}
