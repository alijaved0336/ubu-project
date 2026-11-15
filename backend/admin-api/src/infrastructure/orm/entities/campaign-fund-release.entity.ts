import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CampaignPayment } from './campaign-payment.entity';
import { Influencers } from './influencer.entity';
import { User } from './user.entity';

export enum FundReleaseStatus {
  PENDING = 'pending',
  TRANSFERRED = 'transferred',
  FAILED = 'failed',
  IN_PROGRESS = 'in-progress',
}

@Entity('fund_releases')
export class FundRelease {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transfer_id: string;

  @Column({
    type: 'enum',
    enum: FundReleaseStatus,
    default: FundReleaseStatus.PENDING,
  })
  status: FundReleaseStatus;

  @ManyToOne(() => CampaignPayment, (campaignPayment) => campaignPayment.fundRelease, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'campaign_payment_id',
    foreignKeyConstraintName: 'fk_fund_release_campaign_payment',
  })
  campaignPayment: CampaignPayment;

  @Column({ type: 'boolean', default: false })
  is_refundable: boolean;

  @ManyToOne(() => Influencers, (influencer) => influencer.fundReleases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'influencer_id',
    foreignKeyConstraintName: 'fk_fund_release_influencer',
  })
  influencer: Influencers;

  @ManyToOne(() => User, (user) => user.fundRelease, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_fund_release_user',
  })
  user: User;

  // For cooling Period
  @Column({ type: 'timestamp', nullable: true })
  cooling_period_end: Date; // Stores the date and time when the cooling period ends. The cron job will check this field and process payments once this timestamp has passed.

  @Column({ type: 'timestamp', nullable: true })
  fund_released_at: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
