// campaign.repository.interface.ts
import { ICampaign } from '@domain/model/campaign.interface';
import { Repository } from 'typeorm';

export interface ICampaignRepository {
  findByStatus(status: string): Promise<ICampaign[]>;
  findBySegmentId(segmentId: number): Promise<ICampaign[]>;
  findActiveCampaigns(): Promise<ICampaign[]>;
  findCampaignById(id: number): Promise<ICampaign | undefined>;
}
