// campaign-comment.repository.ts
import { ICampaignTransactionLogsRepo } from '@domain/interfaces/campaign-payement.interface';
import { campaignPaymentConditions } from '@infrastructure/utils/get-transactions-logs.helper';
import { InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { FundRelease } from '../entities/campaign-fund-release.entity';
import { CampaignPayment } from '../entities/campaign-payment.entity';
import { InfluencerStripeConnectedAccount } from '../entities/influencer-stripe-connected-account.entity';
import { Refund } from '../entities/refund.entity';

export class CampaignPaymentRepository {
  constructor(
    @InjectRepository(CampaignPayment)
    private readonly campaignPaymentRepository: Repository<CampaignPayment>,
    @InjectRepository(FundRelease)
    private readonly fundReleaseRepository: Repository<FundRelease>,
    @InjectRepository(InfluencerStripeConnectedAccount)
    private readonly influencerStripeConnectedAccountRepository: Repository<InfluencerStripeConnectedAccount>,
    @InjectRepository(Refund)
    private readonly refundPaymentRepository: Repository<Refund>,
  ) {}

  async addCampaignPayment(payload) {
    const campaignPayment = this.campaignPaymentRepository.create(payload);
    return this.campaignPaymentRepository.save(campaignPayment);
  }

  async save(payload, repository, queryRepo?, queryRunner?: QueryRunner) {
    const repo = queryRunner ? queryRunner.manager.getRepository(queryRepo) : this[`${repository}`];
    return repo.save(payload);
  }

  async addFundRelease(payload, queryRunner: QueryRunner) {
    const fundReleaseRepo = queryRunner.manager.getRepository(FundRelease);
    const funRelease = fundReleaseRepo.create(payload);
    return await fundReleaseRepo.save(funRelease);
  }

  async getDestinationAccount(campaignId: number): Promise<{
    stripeConnectedAccountId: string | null;
    campaignPaymentId: number | null;
    influencerId: number | null;
  }> {
    try {
      console.log(`Fetching destination account for Campaign ID: ${campaignId}`);

      const result = await this.campaignPaymentRepository
        .createQueryBuilder('campaign_payment')
        .innerJoin('campaign_payment.campaign', 'campaign')
        .innerJoin('campaign.influencer', 'influencer')
        .innerJoin('influencer.stripeConnectedAccount', 'stripeAccount')
        .select([
          'stripeAccount.stripe_connected_account_id AS stripeConnectedAccountId',
          'campaign_payment.id AS campaignPaymentId',
          'influencer.id AS influencerId',
        ])
        .where('campaign.id = :campaignId', { campaignId })
        .getRawOne();

      return {
        stripeConnectedAccountId: result?.stripeconnectedaccountid || null,
        campaignPaymentId: result?.campaignpaymentid || null,
        influencerId: result?.influencerid || null,
      };
    } catch (error) {
      console.error(`Error fetching destination account for Campaign ID: ${campaignId}`, error);
      throw new Error('Failed to fetch the destination account. Please try again later.');
    }
  }

  async getUntransferredCampaignPayment(whereCondition) {
    return this.campaignPaymentRepository.findOne({ where: whereCondition });
  }

  async getFundReleases(campaign_payment_id, queryRunner?: QueryRunner) {
    const fundReleaseRepo = queryRunner ? queryRunner.manager.getRepository(FundRelease) : this.fundReleaseRepository;

    return fundReleaseRepo.findOne({
      where: {
        campaignPayment: {
          id: campaign_payment_id,
        },
      },
      relations: ['user', 'influencer'],
    });
  }

  async findOne(condition) {
    return this.campaignPaymentRepository.findOne(condition);
  }

  async findUserByPaymentIntentId(paymentIntentId: string) {
    return this.campaignPaymentRepository.findOne({
      where: {
        payment_intent_id: paymentIntentId,
      },
      relations: ['user', 'campaign', 'campaign.influencer', 'campaign.influencer.user'],
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
        },
        campaign: {
          id: true,
          influencer: {
            id: true,
            user: {
              id: true,
            },
          },
        },
      },
    });
  }

  async getPendingTransfers(condition) {
    return this.fundReleaseRepository.find({
      where: condition,
      relations: ['campaignPayment', 'influencer', 'campaignPayment.campaign'],
    });
  }

  async updateFundRelease(fundReleaseId: number, updateData: Partial<FundRelease>, queryRunner?: QueryRunner) {
    const repository = queryRunner ? queryRunner.manager.getRepository(FundRelease) : this.fundReleaseRepository;
    await repository.update({ id: fundReleaseId }, updateData);
  }

  async addConnectedAccount(payload) {
    const connectedAccount = this.influencerStripeConnectedAccountRepository.create(payload);
    return this.influencerStripeConnectedAccountRepository.save(connectedAccount);
  }

  async getConnectedAccountByInfluencer(influencer_id) {
    return this.influencerStripeConnectedAccountRepository.findOne({
      where: {
        influencer: {
          id: influencer_id,
        },
      },
    });
  }

  async updateStripeConnectedAccount(condition, updatePayload) {
    const connectedAccount = await this.influencerStripeConnectedAccountRepository.findOne({
      where: { ...condition },
    });

    if (!connectedAccount) {
      throw new Error(`connected account not found.`);
    }
    Object.assign(connectedAccount, updatePayload);
    // Save the updated payment record
    await this.influencerStripeConnectedAccountRepository.save(connectedAccount);

    return connectedAccount;
  }

  async updateCampaginPayment(paymentIntentId: string, updatePayload: Partial<CampaignPayment>) {
    const campaignPayment = await this.campaignPaymentRepository.findOne({
      where: { payment_intent_id: paymentIntentId },
    });

    if (!campaignPayment) {
      throw new Error(`Campaign payment with payment_intent ID '${paymentIntentId}' not found.`);
    }
    Object.assign(campaignPayment, updatePayload);
    await this.campaignPaymentRepository.save(campaignPayment);

    return this.campaignPaymentRepository.findOne({
      where: { payment_intent_id: paymentIntentId },
      relations: ['campaign'],
    });
  }

  async updateCampaignPayment(condition, updatePayload: Partial<CampaignPayment>, queryRunner?: QueryRunner) {
    const repository = queryRunner ? queryRunner.manager.getRepository(CampaignPayment) : this.campaignPaymentRepository;

    const campaignPayment = await repository.findOne({ where: { ...condition } });

    if (!campaignPayment) {
      throw new Error(`Campaign payment not found.`);
    }

    Object.assign(campaignPayment, updatePayload);

    await repository.save(campaignPayment);

    return 'Campaign payment status updated successfully.';
  }

  async getTransactionLogs(data: ICampaignTransactionLogsRepo): Promise<unknown> {
    const { pageNumber, pageSize, ...filters } = data;
    const relations = [
      'fundRelease',
      'refund',
      'campaign',
      'campaign.exhibitDocuments',
      'campaign.influencer',
      'campaign.influencer.user',
      'user',
      'user.brand',
    ];

    let whereConditions: any = campaignPaymentConditions(filters);

    const [transaction_logs, totalCount] = await this.campaignPaymentRepository.findAndCount({
      where: whereConditions,
      relations,
      select: {
        fundRelease: {
          amount: true,
          status: true,
          created_at: true,
        },
        refund: {
          amount: true,
          status: true,
          transaction_id: true,
          created_at: true,
        },
        campaign: {
          id: true,
          exhibitDocuments: {
            totalCompensation: true,
            createdAt: true,
          },
          influencer: {
            id: true,
            user: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
        },
        user: {
          id: true,
          brand: {
            brand_name: true,
          },
        },
        id: true,
        payment_intent_id: true,
        status: true,
        amount: true,
        is_transferred: true,
        created_at: true,
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      order: {
        created_at: 'DESC',
      },
    });

    return { transaction_logs, totalCount };
  }

  async getBrandTransactionSummary(userId: number): Promise<any> {
    try {
      const [totalSuccessfulPayments, totalTransferredFunds, totalCompletedRefunds] = await Promise.all([
        this.campaignPaymentRepository
          .createQueryBuilder('campaignPayment')
          .select('COALESCE(SUM(campaignPayment.amount), 0)', 'totalSuccessfulPayments')
          .where('campaignPayment.user_id = :userId', { userId })
          .andWhere("campaignPayment.status = 'succeeded'")
          .getRawOne(),

        this.fundReleaseRepository
          .createQueryBuilder('fundRelease')
          .select('COALESCE(SUM(fundRelease.amount), 0)', 'totalTransferredFunds')
          .where('fundRelease.user_id = :userId', { userId })
          .andWhere("fundRelease.status = 'transferred'")
          .getRawOne(),

        this.refundPaymentRepository
          .createQueryBuilder('refund')
          .select('COALESCE(SUM(refund.amount), 0)', 'totalCompletedRefunds')
          .where('refund.user_id = :userId', { userId })
          .andWhere("refund.status = 'completed'")
          .getRawOne(),
      ]);

      const outstandingBalance =
        parseFloat(totalSuccessfulPayments.totalSuccessfulPayments) -
        parseFloat(totalTransferredFunds.totalTransferredFunds) -
        parseFloat(totalCompletedRefunds.totalCompletedRefunds);

      return {
        userId,
        totalSuccessfulPayments: parseFloat(totalSuccessfulPayments.totalSuccessfulPayments) || 0,
        totalTransferredFunds: parseFloat(totalTransferredFunds.totalTransferredFunds) || 0,
        totalCompletedRefunds: parseFloat(totalCompletedRefunds.totalCompletedRefunds) || 0,
        outstandingBalance: outstandingBalance || 0,
      };
    } catch (error) {
      console.error('Error fetching user transaction summary:', error);
      throw new InternalServerErrorException('Failed to fetch transaction summary from the database.');
    }
  }

  async getInfluencerTransactionSummary(userId: number, influencerId: number): Promise<any> {
    try {
      const [totalTransferredFunds] = await Promise.all([
        this.fundReleaseRepository
          .createQueryBuilder('fundRelease')
          .select('COALESCE(SUM(fundRelease.amount), 0)', 'totalTransferredFunds')
          .where('fundRelease.influencer_id = :influencerId', { influencerId })
          .andWhere("fundRelease.status = 'transferred'")
          .getRawOne(),
      ]);

      return {
        userId,
        totalTransferredFunds: parseFloat(totalTransferredFunds.totalTransferredFunds) || 0,
      };
    } catch (error) {
      console.error('Error fetching user transaction summary:', error);
      throw new InternalServerErrorException('Failed to fetch transaction summary from the database.');
    }
  }
}
