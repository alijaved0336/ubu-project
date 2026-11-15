import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, UseInterceptors, ClassSerializerInterceptor, Inject, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import UsecaseProxy, { WITHDRAWAL_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { CreateWithdrawalDto, UpdateWithdrawalDto, WithdrawalResponseDto } from './withdrawal.dto';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { WithdrawalUseCase } from '@use-cases/withdrawal-history.usecase';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Withdrawals')
@Controller('withdrawals')
export class WithdrawalController {
  constructor(
    @Inject(WITHDRAWAL_USECASE_PROXY)
    private readonly withdrawalUseCaseProxy: UsecaseProxy<WithdrawalUseCase>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create withdrawal' })
  @ApiResponse({ status: 201, description: 'Withdrawal request submitted' })
  async create(@Request() req: any, @Body() dto: CreateWithdrawalDto): Promise<WithdrawalResponseDto> {
    const userId = req.user.id;
    dto.requesting_user_id = userId;
    dto.is_full_amount = dto.is_full_amount ?? false;
    return this.withdrawalUseCaseProxy.getInstance().create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all withdrawals' })
  async getAll(): Promise<WithdrawalResponseDto[]> {
    return this.withdrawalUseCaseProxy.getInstance().getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get withdrawal by ID' })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<WithdrawalResponseDto> {
    return this.withdrawalUseCaseProxy.getInstance().getOne(id);
  }

  @Get('balance/:influencerId')
  @ApiOperation({ summary: 'Get withdrawable Amount' })
  async withdrawalableAmount(@Param('influencerId', ParseIntPipe) influencerId: number): Promise<any> {
    return this.withdrawalUseCaseProxy.getInstance().withdrawalableAmount(influencerId);
  }

  @Get('influencer/:influencerId')
  @ApiOperation({ summary: 'Get withdrawals by influencer' })
  async getByInfluencer(@Param('influencerId', ParseIntPipe) influencerId: number): Promise<WithdrawalResponseDto[]> {
    return this.withdrawalUseCaseProxy.getInstance().getByInfluencer(influencerId);
  }

  @Get('stripe-account/:stripeAccountId')
  @ApiOperation({ summary: 'Get withdrawals by Stripe account' })
  async getByStripeAccount(@Param('stripeAccountId', ParseIntPipe) stripeAccountId: number): Promise<WithdrawalResponseDto[]> {
    return this.withdrawalUseCaseProxy.getInstance().getByStripeAccount(stripeAccountId);
  }

  @Post(':id/update')
  @ApiOperation({ summary: 'Update withdrawal status' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateWithdrawalDto): Promise<WithdrawalResponseDto> {
    return this.withdrawalUseCaseProxy.getInstance().updateWithdrawal(id, dto);
  }
}
