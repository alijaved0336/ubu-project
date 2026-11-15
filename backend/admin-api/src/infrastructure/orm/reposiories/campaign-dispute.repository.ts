import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CampaignDispute } from '../entities/campaign-dispute.entity';

export class CampaignDisputeRepository {
  constructor(
    @InjectRepository(CampaignDispute)
    private readonly campaignDisputeRepository: Repository<CampaignDispute>,
  ) {}

  async addCampaignDispute(payload, queryRunner: QueryRunner) {
    const campaignDisputeRepo = queryRunner.manager.getRepository(CampaignDispute);
    const campaignDispute = campaignDisputeRepo.create(payload);
    return await campaignDisputeRepo.save(campaignDispute);
  }

  async save(payload, queryRunner?: QueryRunner) {
    return queryRunner ? await queryRunner.manager.getRepository(CampaignDispute).save(payload) : await this.campaignDisputeRepository.save(payload);
  }

  async getDisputes(condition) {
    const [disputes, totalCount] = await this.campaignDisputeRepository.findAndCount(condition);
    return {
      disputes,
      totalCount,
    };
  }

  async getOneDisputes(condition) {
    return this.campaignDisputeRepository.findOne(condition);
  }

  async hasExceededMaxDisputes(userId: number, maxDisputes: number): Promise<boolean> {
    const disputeCount = await this.campaignDisputeRepository
      .createQueryBuilder('dispute')
      .select('COUNT(dispute.id)', 'count')
      .where('dispute.against_by = :userId', { userId })
      .groupBy('dispute.campaign_id')
      .having('COUNT(dispute.id) > :maxDisputes', { maxDisputes })
      .getRawOne();

    return disputeCount?.count > 0;
  }
}
