export interface ICampaignDisputeConditions {
  search?: string;
  status?: string;
  resolution_action?: string;
  startDate?: string;
  endDate?: string;
}

export interface ICampaignDisputeList extends ICampaignDisputeConditions {
  pageNumber: number;
  pageSize: number;
}
