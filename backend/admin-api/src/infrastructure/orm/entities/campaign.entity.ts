// campaign.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, BaseEntity, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Segment } from './segment.entity';
import { Influencers } from './influencer.entity';
import { ExhibitDocument } from './exhibit-document.entity';
import { Brands } from './brand.entity';
import { CampaignComment } from './campaign-comment.entity';
import { ICampaign } from '@domain/model/campaign.interface';
import { CampaignStatus } from '../../utils/constant';
import { Contract } from './contract.entity';
import { AdminReview } from './admin-review.entity';
import { Notifications } from './notification.entity';
import { CampaignPayment } from './campaign-payment.entity';
import { CampaignDispute } from './campaign-dispute.entity';

@Entity('campaigns')
export class Campaign extends BaseEntity implements ICampaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'segment_id', unique: true })
  segmentId: number;

  @Column({ name: 'influencer_id', unique: true })
  influencerId: number;

  @Column({ name: 'brand_id', unique: true })
  brandId: number;

  @Column({ name: 'campaign_name', nullable: true })
  campaignName: string;

  @Column({ name: 'review_notify_count', nullable: true })
  reviewNotifyCount: number;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.PENDING,
  })
  status: CampaignStatus;

  @ManyToOne(() => Segment, (segment) => segment.campaigns)
  @JoinColumn({ name: 'segment_id' })
  segments?: Segment;

  @ManyToOne(() => Influencers, (influencer) => influencer.campaigns)
  @JoinColumn({ name: 'influencer_id' })
  influencer?: Influencers;

  @ManyToOne(() => Brands, (brand) => brand.campaigns)
  @JoinColumn({ name: 'brand_id' })
  brand?: Brands;

  @OneToMany(() => CampaignComment, (comment) => comment.campaigns)
  comments?: CampaignComment[];

  @OneToMany(() => CampaignPayment, (campaignPayment) => campaignPayment.campaign)
  campaignPayment?: CampaignPayment[];

  @OneToMany(() => CampaignDispute, (campaignDisputes) => campaignDisputes.campaign)
  campaignDisputes?: CampaignDispute[];

  @OneToMany(() => ExhibitDocument, (exhibitDocument) => exhibitDocument.campaign)
  exhibitDocuments?: ExhibitDocument[];

  @OneToOne(() => Contract, (contract) => contract.campaign)
  contract: Contract;

  @OneToMany(() => AdminReview, (review) => review.campaign)
  reviews?: AdminReview[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
  @OneToMany(() => Notifications, (notification) => notification.campaign, { cascade: true })
  campaignNotification?: Notifications[];
}
