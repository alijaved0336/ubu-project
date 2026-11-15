// campaign.interface.ts

import { IBrand } from './brand.interface';
import { ICampaignComment } from './campaign-comment.interface';
import { IInfluencer } from './influencer.interface';
import { ISegment } from './segment.interface';
import { CampaignStatus } from '@infrastructure/utils/constant';

export interface ICampaign {
  id: number;
  segmentId: number;
  influencerId: number;
  campaignName?: string;
  brandId: number;
  status: CampaignStatus;
  reviewNotifyCount?: number;
  segment?: ISegment;
  influencer?: IInfluencer;
  brand?: IBrand;
  comments?: ICampaignComment[];
}
