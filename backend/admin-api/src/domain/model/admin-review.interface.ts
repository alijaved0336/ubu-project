// admin-review.interface.ts
export interface IAdminReview {
  id: number;
  reviewer_id: number;
  reviewer_type: 'brand' | 'influencer';
  reviewable_id: number;
  reviewable_type: 'brand' | 'influencer';
  rating: number;
  campaign_id: number;
  comment?: string;
  is_anonymous?: boolean;
  created_at: Date;
}
