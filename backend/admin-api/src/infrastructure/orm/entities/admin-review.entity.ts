// admin-review.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, BaseEntity } from 'typeorm';
import { Influencers } from './influencer.entity';
import { Brands } from './brand.entity';
import { IAdminReview } from '@domain/model/admin-review.interface';
import { Campaign } from './campaign.entity';

@Entity('admin_reviews')
@Index('IDX_admin_reviews_reviewer_type', ['reviewer_type'])
@Index('IDX_admin_reviews_reviewable_type', ['reviewable_type'])
export class AdminReview extends BaseEntity implements IAdminReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reviewer_id: number;

  @Column()
  reviewer_type: 'brand' | 'influencer';

  @Column()
  reviewable_id: number;

  @Column()
  campaign_id: number;

  @Column()
  reviewable_type: 'brand' | 'influencer';

  @Column('double precision')
  rating: number;

  @Column('text', { nullable: true })
  comment?: string;

  @Column({ default: false, name: 'is_anonymous' })
  is_anonymous: boolean;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Influencers, (influencer) => influencer.reviewsGiven, {
    nullable: true,
  })
  @JoinColumn({ name: 'reviewer_id', referencedColumnName: 'id', foreignKeyConstraintName: 'FK_adminreview_reviewer_influencer' })
  reviewerInfluencer?: Influencers;

  @ManyToOne(() => Brands, (brand) => brand.reviewsGiven, { nullable: true })
  @JoinColumn({ name: 'reviewer_id', referencedColumnName: 'id', foreignKeyConstraintName: 'FK_adminreview_reviewer_brand' })
  reviewerBrand?: Brands;

  @ManyToOne(() => Brands, (brand) => brand.reviewsReceived, { nullable: true })
  @JoinColumn({ name: 'reviewable_id', referencedColumnName: 'id', foreignKeyConstraintName: 'FK_adminreview_reviewable_brand' })
  reviewableBrand?: Brands;

  @ManyToOne(() => Influencers, (influencer) => influencer.reviewsReceived, {
    nullable: true,
  })
  @JoinColumn({ name: 'reviewable_id', referencedColumnName: 'id', foreignKeyConstraintName: 'FK_adminreview_reviewable_influencer' })
  reviewableInfluencer?: Influencers;

  @ManyToOne(() => Campaign, (campaign) => campaign.reviews)
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;
}
