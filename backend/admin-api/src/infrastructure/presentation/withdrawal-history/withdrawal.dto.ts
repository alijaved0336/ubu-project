import { WithdrawalStatus } from '@infrastructure/orm/entities/withdrawal-history.entity';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateWithdrawalDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(10.0)
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  influencer_id: number;

  @IsOptional()
  @IsBoolean()
  is_full_amount: boolean;

  @IsOptional()
  @IsNumber()
  parent_influencer_id?: number;

  @IsOptional()
  @IsString()
  user_name: string;

  @IsOptional()
  @IsString()
  stripe_connected_account_id: string;

  @IsOptional()
  @IsString()
  influencer_stripe_connected_account_id: number;

  @IsOptional()
  @IsNumber()
  requesting_user_id: number;
}

export class UpdateWithdrawalDto {
  @IsOptional()
  @IsEnum(WithdrawalStatus)
  status?: WithdrawalStatus;

  @IsOptional()
  @IsString()
  failure_reason?: string;
}

export class WithdrawalResponseDto {
  id: number;

  amount: string;

  currency: string;

  status: WithdrawalStatus;

  failure_reason?: string;

  created_at: Date;

  updated_at: Date;

  influencer_id: number;

  parent_influencer_id?: number | null;

  user_name: string;

  stripe_connected_account_id: number;
}
