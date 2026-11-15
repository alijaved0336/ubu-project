// campaign-comment.repository.interface.ts
import { ICampaignComment } from '@domain/model/campaign-comment.interface';
import { Repository } from 'typeorm';

export interface ICampaignCommentRepository {
  findByCampaignId(campaignId: number): Promise<ICampaignComment[]>;
  findRecentComments(limit: number): Promise<ICampaignComment[]>;
}
