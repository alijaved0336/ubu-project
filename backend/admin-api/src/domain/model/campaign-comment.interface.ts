// campaign-comment.interface.ts

import { ICampaign } from './campaign.interface';

export interface ICampaignComment {
  id: number;
  campaignId: number; // Foreign Key to Campaign
  comment: string;
  createdAt: Date;

  campaign?: ICampaign; // Relation to Campaign entity
}
