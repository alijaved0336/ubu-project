// campaign-comment.repository.ts
import { ICampaignCommentRepository } from '@domain/repository/campaign-comment.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampaignComment } from '../entities/campaign-comment.entity';

export class CampaignCommentRepository implements ICampaignCommentRepository {
  constructor(
    @InjectRepository(CampaignComment)
    private readonly campaignCommentRepository: Repository<CampaignComment>,
  ) {}

  async findByCampaignId(campaignId: number): Promise<CampaignComment[]> {
    return this.campaignCommentRepository.find({ where: { campaignId } });
  }

  async findRecentComments(limit: number): Promise<CampaignComment[]> {
    return this.campaignCommentRepository.createQueryBuilder('comment').orderBy('comment.createdAt', 'DESC').limit(limit).getMany();
  }
}
