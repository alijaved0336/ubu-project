// segment.interface.ts
import { IBrand } from './brand.interface';
import { ICampaign } from './campaign.interface';

export interface ISegment {
  id: number;
  name: string;
  brandId: number; // Foreign Key to Brand
  savedFilter?: any; // JSON or text-based filter
  markedCandidates?: any; // JSON for storing marked candidates

  brand?: IBrand; // Relation to Brand entity
  campaigns?: ICampaign[]; // Relation to Campaign entity
}
