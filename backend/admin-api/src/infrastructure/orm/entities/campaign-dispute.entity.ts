import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Campaign } from './campaign.entity';
import { User } from './user.entity';
import { CampaignStatus } from '@infrastructure/utils/constant';

export enum CampaignDisputeStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export enum ResolutionAction {
  REFUND_TO_BRAND = 'refund_to_brand',
  RELEASE_FUNDS_TO_INFLUENCER = 'release_funds_to_influencer',
  RESTART_CAMPAIGN = 'restart_campaign',
  PENDING = 'pending',
}

@Entity('campaign_disputes')
export class CampaignDispute extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  is_refund_requested: boolean;

  @Column({
    type: 'enum',
    enum: CampaignDisputeStatus,
    default: CampaignDisputeStatus.PENDING,
  })
  status: CampaignDisputeStatus;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.IN_PROGRESS,
  })
  campaign_last_status: CampaignStatus;

  @Column('text', { nullable: true })
  admin_remarks: string;

  @Column('text', { nullable: true })
  influencer_concerns: string;

  @Column('text', { nullable: true })
  brand_concerns: string;

  @Column({
    type: 'enum',
    enum: ResolutionAction,
    default: ResolutionAction.PENDING,
  })
  resolution_action: ResolutionAction;

  @ManyToOne(() => Campaign, (campaign) => campaign.campaignDisputes)
  @JoinColumn({
    name: 'campaign_id',
    foreignKeyConstraintName: 'fk_campaign_disputes_campaign',
  })
  campaign: Campaign;

  @ManyToOne(() => User, (user) => user.raisedDisputes)
  @JoinColumn({
    name: 'raised_by_id',
    foreignKeyConstraintName: 'fk_campaign_disputes_user_raised_by',
  })
  raised_by: User;

  @ManyToOne(() => User, (user) => user.receivedDisputes)
  @JoinColumn({
    name: 'against_id',
    foreignKeyConstraintName: 'fk_campaign_disputes_user_against_id',
  })
  against_by: User;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
