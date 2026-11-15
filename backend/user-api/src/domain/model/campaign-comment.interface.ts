import { ICampaign } from "./campaign.interface";

export interface ICampaignComment {
    id: string;
    campaignId: string; // Foreign Key to Campaign
    comment: string;
    createdAt: Date;

    campaign?: ICampaign; // Relation to Campaign entity
}
