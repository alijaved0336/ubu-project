import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WithdrawalHistory } from 'infrastructure/orm/entities/withdrawal-history.entity';
import { Influencers } from 'infrastructure/orm/entities/influencer.entity';
import { InfluencerStripeConnectedAccount } from 'infrastructure/orm/entities/influencer-stripe-connected-account.entity';
import { CreateWithdrawalDto, UpdateWithdrawalDto, WithdrawalResponseDto } from '@infrastructure/presentation/withdrawal-history/withdrawal.dto';

@Injectable()
export class WithdrawalService {
  constructor(
    @InjectRepository(WithdrawalHistory)
    private withdrawalRepository: Repository<WithdrawalHistory>,
    @InjectRepository(Influencers)
    private influencerRepository: Repository<Influencers>,
    @InjectRepository(InfluencerStripeConnectedAccount)
    private stripeAccountRepository: Repository<InfluencerStripeConnectedAccount>,
  ) {}

  async create(createWithdrawalDto: CreateWithdrawalDto): Promise<WithdrawalResponseDto> {
    // Validate influencer exists
    const influencer = await this.influencerRepository.findOne({
      where: { id: createWithdrawalDto.influencer_id },
    });
    if (!influencer) {
      throw new NotFoundException('Influencer not found');
    }

    // Validate stripe account exists and belongs to influencer
    const stripeAccount = await this.stripeAccountRepository.findOne({
      where: [
        {
          id: createWithdrawalDto.influencer_stripe_connected_account_id,
          influencer: { id: createWithdrawalDto.influencer_id },
        },
        {
          id: createWithdrawalDto.influencer_stripe_connected_account_id,
          influencer: { id: createWithdrawalDto.parent_influencer_id },
        },
      ],
    });

    if (!stripeAccount) {
      throw new NotFoundException('Stripe connected account not found or does not belong to this influencer');
    }
    const parentInfluencerEntity = createWithdrawalDto.parent_influencer_id
      ? await this.influencerRepository.findOne({ where: { id: createWithdrawalDto.parent_influencer_id } })
      : undefined;

    const withdrawal = this.withdrawalRepository.create({
      amount: createWithdrawalDto.amount,
      currency: 'USD',
      influencer,
      ...(createWithdrawalDto.parent_influencer_id
        ? { user_name: createWithdrawalDto.user_name, ...(parentInfluencerEntity ? { parentInfluencer: parentInfluencerEntity } : {}) }
        : {}),
      stripeConnectedAccount: stripeAccount,
    });

    const savedWithdrawal = await this.withdrawalRepository.save(withdrawal);
    return this.mapToResponseDto(savedWithdrawal);
  }

  async findAll(): Promise<WithdrawalResponseDto[]> {
    const withdrawals = await this.withdrawalRepository.find({
      relations: ['influencer', 'stripeConnectedAccount'],
      order: { created_at: 'DESC' },
    });
    return withdrawals.map(this.mapToResponseDto);
  }

  async findOne(id: number): Promise<WithdrawalResponseDto> {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id },
      relations: ['influencer', 'stripeConnectedAccount'],
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    return this.mapToResponseDto(withdrawal);
  }

  async findByInfluencerIdByParent(influencerId: number): Promise<WithdrawalResponseDto[]> {
    const influencer = await this.influencerRepository.findOne({
      where: { id: influencerId },
    });
    if (!influencer) {
      throw new NotFoundException('Influencer not found');
    }

    const withdrawals = await this.withdrawalRepository.find({
      where: [{ parentInfluencer: { id: influencerId } }],
      relations: ['influencer', 'stripeConnectedAccount', 'influencer.user'],
      order: { created_at: 'DESC' },
    });

    return withdrawals.map(this.mapToResponseDto);
  }

  async findByInfluencerId(influencerId: number): Promise<WithdrawalResponseDto[]> {
    const influencer = await this.influencerRepository.findOne({
      where: { id: influencerId },
    });
    if (!influencer) {
      throw new NotFoundException('Influencer not found');
    }

    const withdrawals = await this.withdrawalRepository.find({
      where: [{ influencer: { id: influencerId } }, { parentInfluencer: { id: influencerId } }],
      relations: ['influencer', 'stripeConnectedAccount', 'influencer.user'],
      order: { created_at: 'DESC' },
    });

    return withdrawals.map(this.mapToResponseDto);
  }

  async findByStripeAccountId(stripeAccountId: number): Promise<WithdrawalResponseDto[]> {
    const stripeAccount = await this.stripeAccountRepository.findOne({
      where: { id: stripeAccountId },
    });
    if (!stripeAccount) {
      throw new NotFoundException('Stripe connected account not found');
    }

    const withdrawals = await this.withdrawalRepository.find({
      where: { stripeConnectedAccount: { id: stripeAccountId } },
      relations: ['influencer', 'stripeConnectedAccount'],
      order: { created_at: 'DESC' },
    });

    return withdrawals.map(this.mapToResponseDto);
  }

  async update(id: number, updateWithdrawalDto: UpdateWithdrawalDto): Promise<WithdrawalResponseDto> {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id },
      relations: ['influencer', 'stripeConnectedAccount'],
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    Object.assign(withdrawal, updateWithdrawalDto);
    const updatedWithdrawal = await this.withdrawalRepository.save(withdrawal);
    return this.mapToResponseDto(updatedWithdrawal);
  }

  private mapToResponseDto(withdrawal: WithdrawalHistory): WithdrawalResponseDto {
    return {
      id: withdrawal.id,
      amount: String(withdrawal.amount),
      currency: withdrawal.currency,
      status: withdrawal.status,
      failure_reason: withdrawal.failure_reason,
      created_at: withdrawal.created_at,
      updated_at: withdrawal.updated_at,
      parent_influencer_id: withdrawal.parentInfluencer?.id ?? null,
      user_name: `${withdrawal.influencer?.user?.first_name ?? ''} ${withdrawal.influencer?.user?.last_name ?? ''}`.trim(),
      influencer_id: withdrawal.influencer.id,
      stripe_connected_account_id: withdrawal.stripeConnectedAccount.id,
    };
  }
}
