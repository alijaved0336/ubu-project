// admin-review.repository.interface.ts

import { AdminReview } from '@infrastructure/orm/entities/admin-review.entity';

export interface IAdminReviewRepository {
  findAll(): Promise<AdminReview[]>;
  findById(id: number): Promise<AdminReview | null>;
  create(review: AdminReview): Promise<AdminReview>;
  update(id: number, review: Partial<AdminReview>): Promise<AdminReview | null>;
  delete(id: number): Promise<void>;

  findByBrandId(brandId: number): Promise<AdminReview[]>;
  findByInfluencerId(influencerId: number): Promise<AdminReview[]>;
}
