import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
export enum InfluencerPaymentStatus {
  PENDING = 'pending',
  INPROGRESS = 'in-progress',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

@Entity('influencer_payments')
export class InfluencerPayment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transfer_id: string;

  @Column({
    type: 'enum',
    enum: InfluencerPaymentStatus,
    default: InfluencerPaymentStatus.PENDING,
  })
  status: InfluencerPaymentStatus;

  @Column({ type: 'integer', default: 0 })
  amount: number;

  @Column({ type: 'varchar', length: 10, default: 'USD', nullable: false })
  currency: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  month: string;

  @ManyToOne(() => User, (user) => user.influencerPayment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_influencer_payout_payments',
  })
  user: User;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
