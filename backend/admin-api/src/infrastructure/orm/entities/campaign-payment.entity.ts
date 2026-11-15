import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Campaign } from './campaign.entity';
import { FundRelease } from './campaign-fund-release.entity';
import { User } from './user.entity';
import { Refund } from './refund.entity';

export enum CampaignPaymentStatus {
  PENDING = 'pending',
  PAYMENT_HELD = 'payment-held',
  SUCCEEDED = 'succeeded',
  REFUND_REQUESTED = 'refund-requested',
  REFUNDED = 'refunded',
  TRANSFERRED = 'transferred',
  IN_COMPLETE = 'in-complete',
}

@Entity('campaign_payments')
export class CampaignPayment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  payment_intent_id: string;

  @Column({
    type: 'enum',
    enum: CampaignPaymentStatus,
    default: CampaignPaymentStatus.PENDING,
  })
  status: CampaignPaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'varchar', length: 10, default: 'USD', nullable: false })
  currency: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ default: false })
  is_transferred: boolean;

  @Column({ type: 'integer', default: 0 })
  refunded_amount: number;

  @ManyToOne(() => Campaign, (campaign) => campaign.campaignPayment, {
    onDelete: 'CASCADE', // Automatically remove payments when the campaign is deleted
  })
  @JoinColumn({
    name: 'campaign_id',
    foreignKeyConstraintName: 'fk_campaign_payments_campaign',
  })
  campaign: Campaign;

  @ManyToOne(() => User, (user) => user.campaignPayment, {
    onDelete: 'CASCADE', // Automatically remove payments when the campaign is deleted
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_campaign_payments_user',
  })
  user: User;

  @OneToMany(() => FundRelease, (fundRelease) => fundRelease.campaignPayment, {
    onDelete: 'CASCADE',
  })
  fundRelease: FundRelease;

  @OneToMany(() => Refund, (refund) => refund.campaignPayment, {
    onDelete: 'CASCADE',
  })
  refund: Refund;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
