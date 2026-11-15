import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, BaseEntity, OneToOne, OneToMany } from 'typeorm';
import { Influencers } from './influencer.entity';
import { WithdrawalHistory } from './withdrawal-history.entity';

export enum InfluencerStripeAccountStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  IN_ACTIVE = 'in-active',
}

@Entity('stripe_connected_accounts')
export class InfluencerStripeConnectedAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  stripe_connected_account_id: string;

  @Column({
    type: 'enum',
    enum: InfluencerStripeAccountStatus,
    default: InfluencerStripeAccountStatus.IN_ACTIVE,
  })
  status: InfluencerStripeAccountStatus;

  @OneToOne(() => Influencers, (influencer) => influencer.stripeConnectedAccount)
  @JoinColumn({
    name: 'influencer_id',
    foreignKeyConstraintName: 'fk_influencer_stripe_connected_account_influencer',
  })
  influencer: Influencers;

  @OneToMany(() => WithdrawalHistory, (withdrawalHistory) => withdrawalHistory.stripeConnectedAccount)
  withdrawalHistory: WithdrawalHistory[];
}
