// admin-review.repository.ts
import { IAdminReviewRepository } from '@domain/repository/admin-review.repository.interface';
import { Repository } from 'typeorm';
import { AdminReview } from '../entities/admin-review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminReviewRepository implements IAdminReviewRepository {
  constructor(
    @InjectRepository(AdminReview)
    private readonly adminReviewRepository: Repository<AdminReview>,
  ) {}

  async findAll(): Promise<AdminReview[]> {
    return this.adminReviewRepository.find();
  }

  async findById(id: number): Promise<AdminReview | null> {
    return this.adminReviewRepository.findOneBy({ id });
  }

  async create(review: Partial<AdminReview>): Promise<AdminReview> {
    return this.adminReviewRepository.save(review);
  }

  async update(id: number, review: Partial<AdminReview>): Promise<AdminReview | null> {
    await this.adminReviewRepository.update(id, review);
    return this.adminReviewRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    await this.adminReviewRepository.delete(id);
  }

  async findByBrandId(brandId: number): Promise<AdminReview[]> {
    return this.adminReviewRepository
      .createQueryBuilder('admin_review')
      .where('admin_review.reviewer_id = :brandId AND admin_review.reviewer_type = :type', { brandId, type: 'brand' })
      .orWhere('admin_review.reviewable_id = :brandId AND admin_review.reviewable_type = :type', { brandId, type: 'brand' })
      .getMany();
  }

  async findByInfluencerId(influencerId: number): Promise<AdminReview[]> {
    return this.adminReviewRepository
      .createQueryBuilder('admin_review')
      .where('admin_review.reviewer_id = :influencerId AND admin_review.reviewer_type = :type', { influencerId, type: 'influencer' })
      .orWhere('admin_review.reviewable_id = :influencerId AND admin_review.reviewable_type = :type', { influencerId, type: 'influencer' })
      .getMany();
  }
}
