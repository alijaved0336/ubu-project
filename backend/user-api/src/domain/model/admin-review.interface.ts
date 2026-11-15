export interface IAdminReview {
  id: string;
  reviewer_id: string;
  reviewer_type: 'brand' | 'influencer';
  reviewable_id: string;
  reviewable_type: 'brand' | 'influencer';
  rating: number;
  comment?: string;
  created_at: Date;
}
