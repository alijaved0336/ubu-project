import { IBrand } from "./brand.interface";
import { ICampaignComment } from "./campaign-comment.interface";
import { IInfluencer } from "./influencer.interface";
import { ISegment } from "./segment.interface";
import { ITemplate } from "./template.interface";

export interface ICampaign {
    id: string;
    segmentId: string; // Foreign Key to Segment
    influencerId: string; // Foreign Key to Influencer
    brandId: string; // Foreign Key to Brand
    templateId: string; // Foreign Key to Template
    description?: string;
    amount: number;
    currency: string;
    criteria?: string;
    status: string;

    segment?: ISegment; // Relation to Segment entity
    influencer?: IInfluencer; // Relation to Influencer entity
    brand?: IBrand; // Relation to Brand entity
    template?: ITemplate; // Relation to Template entity
    comments?: ICampaignComment[]; // Relation to CampaignComment entity
}
