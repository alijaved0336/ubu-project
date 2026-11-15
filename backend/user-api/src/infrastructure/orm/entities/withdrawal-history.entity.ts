import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    BaseEntity,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Influencers } from './influencer.entity';
  import { InfluencerStripeConnectedAccount } from './influencer-stripe-connected-account.entity';
  
  export enum WithdrawalStatus {
    PENDING = 'pending',
    SUCCEEDED = 'succeeded',
    FAILED = 'failed',
  }
  
  @Entity('withdrawal_history')
  export class WithdrawalHistory extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    amount: number;
  
    @Column({ type: 'varchar', length: 10, default: 'USD', nullable: false })
    currency: string;
  
    @Column({
      type: 'enum',
      enum: WithdrawalStatus,
      default: WithdrawalStatus.PENDING,
    })
    status: WithdrawalStatus;
  
    @Column({ type: 'text', nullable: true })
    failure_reason: string; 
  
    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updated_at: Date;

    @ManyToOne(() => Influencers, (influencer) => influencer.withdrawalHistory, {
      nullable: false,
      onDelete: 'CASCADE',
    })
    
    @JoinColumn({
      name: 'influencer_id',
      foreignKeyConstraintName: 'fk_withdrawal_history_influencer',
    })
    influencer: Influencers;
  
    @ManyToOne(
      () => InfluencerStripeConnectedAccount,
      (stripeAccount) => stripeAccount.withdrawalHistory,
      {
        nullable: false,
        onDelete: 'CASCADE',
      }
    )
    @JoinColumn({
      name: 'stripe_connected_account_id',
      foreignKeyConstraintName: 'fk_withdrawal_history_stripe_account',
    })
    stripeConnectedAccount: InfluencerStripeConnectedAccount;
  }