// admin-review.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  BaseEntity
} from 'typeorm';
import { Influencers } from './influencer.entity';
import { Brands } from './brand.entity';
import { IAdminReview } from '@domain/model/admin-review.interface';

@Entity('admin_reviews')
@Index('IDX_admin_reviews_reviewer_type', ['reviewer_type'])
@Index('IDX_admin_reviews_reviewable_type', ['reviewable_type'])
export class AdminReview extends BaseEntity implements IAdminReview{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reviewer_id: string;

  @Column()
  reviewer_type: 'brand' | 'influencer';

  @Column()
  reviewable_id: string;

  @Column()
  reviewable_type: 'brand' | 'influencer';

  @Column()
  rating: number;

  @Column('text', { nullable: true })
  comment?: string;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Influencers, influencer => influencer.reviewsGiven, { nullable: true })
  @JoinColumn({ name: 'reviewer_id', referencedColumnName: 'id' })
  reviewerInfluencer?: Influencers;

  @ManyToOne(() => Brands, brand => brand.reviewsGiven, { nullable: true })
  @JoinColumn({ name: 'reviewer_id', referencedColumnName: 'id' })
  reviewerBrand?: Brands;

  @ManyToOne(() => Brands, brand => brand.reviewsReceived, { nullable: true })
  @JoinColumn({ name: 'reviewable_id', referencedColumnName: 'id' })
  reviewableBrand?: Brands;

  @ManyToOne(() => Influencers, influencer => influencer.reviewsReceived, { nullable: true })
  @JoinColumn({ name: 'reviewable_id', referencedColumnName: 'id' })
  reviewableInfluencer?: Influencers;
}
