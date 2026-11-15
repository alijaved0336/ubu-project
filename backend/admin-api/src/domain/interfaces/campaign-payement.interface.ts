// Define common interfaces
export interface Pagination {
  pageNumber: number;
  pageSize: number;
}

export interface Searchable {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface UserCriteria {
  userId: number;
  userType: 'brandUser' | 'influencerUser';
}

export interface ICampaignTransactionLogs extends Pagination, Searchable {
  user: any;
}

export interface ICampaignTransactionLogsRepo extends Pagination, Searchable, UserCriteria {}

export interface ICampaignPaymentConditions extends Searchable, UserCriteria {}
