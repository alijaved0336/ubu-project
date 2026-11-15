import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AbstractUsecase } from './abstract.usecase';

import { WithdrawalService } from '@infrastructure/services/withdrawal-history/withdrawal.service';
import { CampaignPaymentRepository } from '@infrastructure/orm/reposiories/campaign-payment.repository';
import { AffiliateReportRepository } from '@infrastructure/orm/reposiories/affiliate-report.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { StripeService } from '@infrastructure/services/stripe/stripe-service.service';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';

import { WithdrawalStatus } from '@infrastructure/orm/entities/withdrawal-history.entity';
import { WithdrawalResponseDto, CreateWithdrawalDto, UpdateWithdrawalDto } from '@infrastructure/presentation/withdrawal-history/withdrawal.dto';

export class WithdrawalUseCase extends AbstractUsecase<any> {
  constructor(
    private readonly withdrawalService: WithdrawalService,
    private readonly campaignPaymentRepo: CampaignPaymentRepository,
    private readonly affiliateReportRepo: AffiliateReportRepository,
    private readonly userRepo: UserRepository,
    private readonly stripeService: StripeService,
    private readonly influencerRepo: InfluencerRepository,
  ) {
    super(withdrawalService);
  }

  async create(createWithdrawalDto: CreateWithdrawalDto): Promise<WithdrawalResponseDto> {
    const { influencer_id, is_full_amount } = createWithdrawalDto;
    let { amount } = createWithdrawalDto;
    const parentInfluencer = await this.influencerRepo.findParentUserByInfluencerId(influencer_id);

    const influencer = await this.influencerRepo.findOne(influencer_id);
    if (!influencer) {
      throw new NotFoundException('Influencer not found for the given user.');
    }

    if (is_full_amount) {
      const withdrawalData = await this.withdrawalableAmount(influencer_id);
      amount = Number(withdrawalData?.withdrawalable_amount ?? 0);
    }

    const stripeConnectedAccount = parentInfluencer
      ? await this.campaignPaymentRepo.getConnectedAccountByInfluencer(parentInfluencer.id)
      : await this.campaignPaymentRepo.getConnectedAccountByInfluencer(influencer.id);

    if (!stripeConnectedAccount) {
      throw new NotFoundException('No Stripe connected account found for this influencer.');
    }

    await this.validateWithdrawalAmount(influencer_id, amount);

    const withdrawalPayload = {
      ...createWithdrawalDto,
      amount,
      user_name: `${influencer?.user?.first_name ?? ''} ${influencer?.user?.last_name ?? ''}`.trim(),
      influencer_stripe_connected_account_id: stripeConnectedAccount.id,
      ...(parentInfluencer ? { parent_influencer_id: parentInfluencer.id } : {}),
    };

    const withdrawal = await this.withdrawalService.create(withdrawalPayload);

    try {
      const transferResult = await this.transferToInfluencer(stripeConnectedAccount.stripe_connected_account_id, amount);

      if (transferResult.success) {
        await this.withdrawalService.update(withdrawal.id, { status: WithdrawalStatus.SUCCEEDED });
        return {
          ...withdrawal,
          amount: String(withdrawal.amount),
          status: WithdrawalStatus.SUCCEEDED,
        };
      }
      await this.withdrawalService.update(withdrawal.id, {
        status: WithdrawalStatus.FAILED,
        failure_reason: transferResult.error || 'Transfer failed',
      });
      throw new BadRequestException(`Withdrawal failed: ${transferResult.error}`);
    } catch (error) {
      await this.withdrawalService.update(withdrawal.id, {
        status: WithdrawalStatus.FAILED,
        failure_reason: error.message || 'Unexpected error during transfer',
      });

      if (error instanceof BadRequestException) throw error;

      throw new BadRequestException('Withdrawal processing failed. Please try again later.');
    }
  }

  private async transferToInfluencer(stripeConnectedAccountId: string, amount: number): Promise<{ success: boolean; transferId?: string; error?: string }> {
    try {
      const transfer = await this.stripeService.createTransfer(amount * 100, 'usd', stripeConnectedAccountId);
      if (transfer && transfer.id) {
        return { success: true, transferId: transfer.id };
      }
      return { success: false, error: 'Transfer creation failed - no transfer ID returned' };
    } catch (error) {
      console.error('Stripe transfer error:', error);
      return { success: false, error: error.message || 'Stripe transfer failed' };
    }
  }

  private async validateWithdrawalAmount(influencerId: number, requestedAmount: number): Promise<void> {
    try {
      const numericRequestedAmount = Number(requestedAmount) || 0;

      const user = await this.userRepo.findUserByInfluencerId(influencerId);
      if (!user) {
        throw new NotFoundException('User not found for this influencer');
      }
      const userId = user.id;

      // 1. Get total transferred funds from campaign payments
      const campaignSummary = await this.campaignPaymentRepo.getInfluencerTransactionSummary(userId, influencerId);
      const totalCampaignRevenue = Number(campaignSummary.totalTransferredFunds) || 0;

      // 2. Get total revenue from affiliate reports
      const affiliateEntries = await this.affiliateReportRepo.getAllEntries(influencerId, 'influencer');
      const totalAffiliateRevenue = affiliateEntries.reduce((sum, entry) => {
        const revenue = Number(entry.revenue) || 0; // Convert to number explicitly
        return sum + revenue;
      }, 0);

      // 3. Get total succeeded withdrawals
      const existingWithdrawals = await this.withdrawalService.findByInfluencerId(influencerId);
      const totalSucceededWithdrawals = existingWithdrawals
        .filter((withdrawal) => withdrawal.status === WithdrawalStatus.SUCCEEDED) // Only count succeeded withdrawals
        .reduce((sum, withdrawal) => {
          const amount = Number(withdrawal.amount) || 0; // Convert to number explicitly
          return sum + amount;
        }, 0);

      const clidwithdrawalsAmount = await this.withdrawalService.findByInfluencerIdByParent(influencerId);
      const totalClidwithdrawalsAmount = clidwithdrawalsAmount
        .filter((w) => w.status === WithdrawalStatus.SUCCEEDED)
        .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

      const totalRevenue = totalCampaignRevenue + totalAffiliateRevenue + totalClidwithdrawalsAmount;
      const availableBalance = totalRevenue - totalSucceededWithdrawals;

      // 5. Validate sufficient balance
      if (numericRequestedAmount > availableBalance) {
        throw new BadRequestException(
          `Insufficient balance. ` +
            `Available: ${availableBalance.toFixed(2)}, ` +
            `Requested: ${numericRequestedAmount.toFixed(2)}. ` +
            `Breakdown: Campaign Revenue: ${totalCampaignRevenue.toFixed(2)}, ` +
            `Affiliate Revenue: ${totalAffiliateRevenue.toFixed(2)}, ` +
            `Already Withdrawn: ${totalSucceededWithdrawals.toFixed(2)}`,
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error validating withdrawal amount:', error);
      throw new BadRequestException('Unable to validate withdrawal amount. Please try again later.');
    }
  }

  public async withdrawalableAmount(influencerId: number): Promise<{
    affiliate_revenue: number;
    campaign_revenue: number;
    withdrawalable_amount: number;
    withdrawan_amount: number;
  }> {
    const user = await this.userRepo.findUserByInfluencerId(influencerId);
    if (!user) throw new NotFoundException('User not found for this influencer');

    const userId = user.id;
    const campaignSummary = await this.campaignPaymentRepo.getInfluencerTransactionSummary(userId, influencerId);
    const totalCampaignRevenue = Number(campaignSummary.totalTransferredFunds) || 0;

    const affiliateEntries = await this.affiliateReportRepo.getAllEntries(influencerId, 'influencer');
    const totalAffiliateRevenue = affiliateEntries.reduce((sum, entry) => sum + (Number(entry.revenue) || 0), 0);

    const withdrawals = await this.withdrawalService.findByInfluencerId(influencerId);
    const totalSucceededWithdrawals = withdrawals.filter((w) => w.status === WithdrawalStatus.SUCCEEDED).reduce((sum, w) => sum + (Number(w.amount) || 0), 0);
    const clidwithdrawalsAmount = await this.withdrawalService.findByInfluencerIdByParent(influencerId);
    const totalClidwithdrawalsAmount = clidwithdrawalsAmount
      .filter((w) => w.status === WithdrawalStatus.SUCCEEDED)
      .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

    const totalRevenue = totalCampaignRevenue + totalAffiliateRevenue + totalClidwithdrawalsAmount;
    const availableBalance = totalRevenue - totalSucceededWithdrawals;

    return {
      affiliate_revenue: totalAffiliateRevenue,
      campaign_revenue: totalCampaignRevenue,
      withdrawalable_amount: availableBalance,
      withdrawan_amount: totalSucceededWithdrawals,
    };
  }

  async getOne(id: number): Promise<WithdrawalResponseDto> {
    return this.withdrawalService.findOne(id);
  }

  async getAll(): Promise<WithdrawalResponseDto[]> {
    return this.withdrawalService.findAll();
  }

  async getByInfluencer(influencerId: number): Promise<WithdrawalResponseDto[]> {
    return this.withdrawalService.findByInfluencerId(influencerId);
  }

  async getByStripeAccount(stripeAccountId: number): Promise<WithdrawalResponseDto[]> {
    return this.withdrawalService.findByStripeAccountId(stripeAccountId);
  }

  async updateWithdrawal(id: number, dto: UpdateWithdrawalDto): Promise<WithdrawalResponseDto> {
    return this.withdrawalService.update(id, dto);
  }
}
