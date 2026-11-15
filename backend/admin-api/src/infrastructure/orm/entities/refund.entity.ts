import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { CampaignPayment } from './campaign-payment.entity';
import { User } from './user.entity';

export enum RefundStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('refunds')
export class Refund extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  amount: number;

  @Column({
    type: 'enum',
    enum: RefundStatus,
    default: RefundStatus.REQUESTED,
  })
  status: RefundStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reason: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transaction_id: string;

  @ManyToOne(() => CampaignPayment, (payment) => payment.refund, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'campaign_payment_id',
    foreignKeyConstraintName: 'fk_refund_campaign_payment',
  })
  campaignPayment: CampaignPayment;

  @ManyToOne(() => User, (user) => user.refund, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_refund_user',
  })
  user: User;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
