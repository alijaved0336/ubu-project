export interface IInfluencer {
  id: number;
  tiktok_handle: string;
  instagram_handle: string;
  facebook_handle: string;
  gallery_images: string[];
  following: number;
  engagment_rate: number;
  conversion_rate: number;
  rating: number;
  avgResponseTime: string; // Assuming time is stored as a string in HH:MM:SS format
  bio: string; // bio of the influencer
  profilePictureUrl: string;
  reviewsCount: number;
  start_budget: number;
  end_budget: number;
  region: string;
  ff: number;
  sports: string;
  dob: Date;
  updated_at: Date;
  created_at: Date;
}
