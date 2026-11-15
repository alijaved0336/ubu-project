import { ICampaignDisputeList } from '@domain/interfaces/campaign-dispute.interface';
import { CampaignDispute, CampaignDisputeStatus, ResolutionAction } from '@infrastructure/orm/entities/campaign-dispute.entity';
import { CampaignPaymentStatus } from '@infrastructure/orm/entities/campaign-payment.entity';
import { User } from '@infrastructure/orm/entities/user.entity';
import { CampaignDisputeRepository } from '@infrastructure/orm/reposiories/campaign-dispute.repository';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { CampaignStatus } from '@infrastructure/utils/constant';
import { campaignDisputesConditions } from '@infrastructure/utils/get-dispute-list.helper';
import { BadRequestException, ConflictException, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CURRENCY } from 'constants/currency';
import { DISPUTE_SELECT_FIELDS } from 'constants/dispute-select-fields';
import UsecaseProxy, { CAMPAIGN_PAYMENT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { CampaignPaymentUseCase } from './campaign-payment.usecase';
import { DataSource, QueryRunner } from 'typeorm';
const _ = require('lodash');

export class CampaignDisputeUseCase {
  constructor(
    private campaignDisputeRepository: CampaignDisputeRepository,
    private campaignRepository: CampaignRepository,
    @Inject(CAMPAIGN_PAYMENT_USECASE_PROXY)
    private readonly campaignPaymentUseCase: UsecaseProxy<CampaignPaymentUseCase>,
    private readonly dataSource: DataSource,
  ) {}

  async getDisputesList(data: ICampaignDisputeList): Promise<{ disputes: CampaignDispute[]; totalCount: number }> {
    const { pageNumber, pageSize, ...filters } = data;
    let whereConditions: any = campaignDisputesConditions(filters);

    const result = await this.campaignDisputeRepository.getDisputes({
      relations: ['raised_by', 'against_by', 'campaign'],
      select: DISPUTE_SELECT_FIELDS,
      where: whereConditions,
      order: { created_at: 'DESC' },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });
    return result;
  }

  // Only for the admin
  async resolveDispute(campaignDisputeId: string, remarks: string, resolutionAction: ResolutionAction, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const dispute = await this.campaignDisputeRepository.getOneDisputes({
        where: { id: campaignDisputeId },
        relations: ['campaign'],
      });

      if (!dispute) {
        throw new Error(`Campaign dispute with ID ${campaignDisputeId} not found.`);
      }

      const { campaign } = dispute;
      if (!campaign) {
        throw new Error(`Campaign associated with dispute not found.`);
      }

      // Perform action based on ResolutionAction
      dispute.resolution_action = resolutionAction;
      await this.applyResolutionAction(dispute, campaign, resolutionAction, remarks, user, queryRunner);
      await Promise.all([this.campaignDisputeRepository.save(dispute, queryRunner), this.campaignRepository.save(campaign, queryRunner)]);

      await queryRunner.commitTransaction();
      return {
        message: 'Campaign dispute status updated successfully.',
        data: dispute,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Transaction failed:', error.message);
      throw new Error(`${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  // Only for the admin
  async updateDisputeStatus(campaignDisputeId: string, status: CampaignDisputeStatus) {
    if (![CampaignDisputeStatus.IN_PROGRESS, CampaignDisputeStatus.PENDING].includes(status)) {
      throw new Error(`Invalid dispute status: ${status}`);
    }

    const dispute = await this.campaignDisputeRepository.getOneDisputes({
      where: { id: campaignDisputeId },
    });

    if (!dispute) {
      throw new Error(`Campaign dispute with ID ${campaignDisputeId} not found.`);
    }
    dispute.status = status;
    dispute.resolution_action = ResolutionAction.PENDING;
    await this.campaignDisputeRepository.save(dispute);

    return {
      message: 'Campaign dispute status updated successfully.',
      data: dispute,
    };
  }

  private async applyResolutionAction(dispute, campaign, action: ResolutionAction, remarks: string, user: User, queryRunner: QueryRunner): Promise<void> {
    dispute.status = CampaignDisputeStatus.RESOLVED;
    dispute.admin_remarks = remarks;

    switch (action) {
      case ResolutionAction.REFUND_TO_BRAND:
        await this.handleRefundToBrand(campaign, queryRunner);
        break;

      case ResolutionAction.RELEASE_FUNDS_TO_INFLUENCER:
        await this.handleReleaseFundsToInfluencer(campaign, user, queryRunner);
        break;

      case ResolutionAction.RESTART_CAMPAIGN:
        await this.handleRestartCampaign(campaign, queryRunner);
        break;

      default:
        throw new Error(`Invalid resolution action: ${action}`);
    }
  }

  private async handleRefundToBrand(campaign, queryRunner: QueryRunner): Promise<void> {
    campaign.status = CampaignStatus.REJECTED_REFUNDED;
    await this.campaignPaymentUseCase.getInstance().refundAmount(campaign.id, queryRunner);
  }

  private async handleReleaseFundsToInfluencer(campaign, user, queryRunner: QueryRunner): Promise<void> {
    campaign.status = CampaignStatus.COMPLETED;
    // Add additional logic (e.g., payment release)
    const currency = CURRENCY.USD;
    await this.campaignPaymentUseCase.getInstance().scheduleTransfer(currency, campaign.id, null, user.id, queryRunner);
  }

  async handleRestartCampaign(campaign, queryRunner: QueryRunner): Promise<void> {
    const { campaignPaymentId } = await this.campaignPaymentUseCase.getInstance().getDestinationAccount(campaign.id);
    if (!campaignPaymentId) {
      throw new HttpException('Unable to find Campain Payment Id', HttpStatus.BAD_REQUEST);
    }
    await this.campaignPaymentUseCase.getInstance().updateCampaignPayment({ id: campaignPaymentId }, { status: CampaignPaymentStatus.SUCCEEDED }, queryRunner);
    campaign.status = CampaignStatus.IN_PROGRESS;
  }

  async updateDisputeConcerns(userId, campaignDisputeId, influencerConcerns, brandConcerns, isRefundRequested) {
    try {
      const dispute = await this.campaignDisputeRepository.getOneDisputes({
        where: { id: campaignDisputeId },
        relations: ['campaign'],
      });

      if (!dispute) throw new Error(`Campaign dispute with ID ${campaignDisputeId} not found.`);
      if (!influencerConcerns && !brandConcerns) throw new Error('No concerns provided to update.');

      Object.assign(dispute, {
        ...(influencerConcerns && { influencer_concerns: influencerConcerns }),
        ...(brandConcerns && { brand_concerns: brandConcerns }),
        ...(brandConcerns &&
          isRefundRequested !== undefined && {
            brand_concerns: brandConcerns,
            is_refund_requested: isRefundRequested,
          }),
      });
      await this.campaignDisputeRepository.save(dispute);
      if (isRefundRequested) {
        await this.campaignPaymentUseCase.getInstance().requestRefund(dispute.campaign.id, userId, undefined, undefined);
      }

      return dispute;
    } catch (error) {
      console.error('Error updating dispute concerns:', error.message);
      throw new Error('Failed to update campaign dispute concerns.');
    }
  }

  async checkDisputeEligibility(user: User): Promise<void> {
    const { influencer, brand } = user;
    const isBlocked = influencer?.is_blocked ?? brand?.is_blocked;
    if (isBlocked) {
      throw new ConflictException('Your account is temporarily blocked. Please contact our support team for assistance.');
    }
    let maxDisputes = influencer?.max_disputes ?? brand?.max_disputes;
    if (maxDisputes === undefined || maxDisputes === null) {
      throw new BadRequestException('Max disputes value is unavailable for this user.');
    }
    maxDisputes = maxDisputes - 1;
    const hasExceededDisputes = await this.campaignDisputeRepository.hasExceededMaxDisputes(user.id, maxDisputes);
    if (hasExceededDisputes) {
      throw new ConflictException('You have exceeded the maximum allowed disputes. Please contact support to resolve this.');
    }
  }
}
