import { IInfluencer } from '@domain/model/influencer.interface';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Posts } from './post.entity';
import { BodyMeasurement } from './body-measurement.entity';
import { DemoGraphics } from './demographics.entity';
import { Campaign } from './campaign.entity';
import { AdminReview } from './admin-review.entity';
import { InfluencerProfile } from './influencer-profile.entity';
import { Proposal } from './proposals.entity';
import { InfluencerStripeConnectedAccount } from './influencer-stripe-connected-account.entity';
import { WithdrawalHistory } from './withdrawal-history.entity';

@Entity({ name: 'influencers' })
export class Influencers extends BaseEntity implements IInfluencer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  tiktok_handle: string;

  @Column('text', { nullable: true })
  instagram_handle: string;

  @Column('text', { nullable: true })
  facebook_handle: string;

  @Column('simple-array', { nullable: true })
  gallery_images: string[];

  @Column('int', { nullable: true })
  following: number;

  @Column('float', { nullable: true })
  engagment_rate: number;

  @Column('float', { nullable: true })
  conversion_rate: number;

  @Column('float', { nullable: true })
  rating: number;

  @Column('text', { nullable: true, name: 'avg_response_time' })
  avgResponseTime: string; // Assuming time is stored as a string in HH:MM:SS format

  @Column('text', { nullable: true })
  bio: string; // bio of the influencer

  @Column('text', { nullable: true, name: 'profile_picture_url' })
  profilePictureUrl: string;

  @Column('int', { nullable: true, name: 'reviews_count' })
  reviewsCount: number;

  @Column('text', { nullable: true })
  region: string;

  @Column('simple-array', { nullable: true })
  style: string[]; // e.g ['Petite', 'Active', 'Boho', 'Traditional']

  @Column('int', { nullable: true })
  ff: number;

  @Column('text', { nullable: true })
  sports: string;

  @Column('date', { nullable: true })
  dob: Date;

  @OneToOne(() => User, (user) => user.influencer)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_influencer_user',
  })
  user: User;

  @OneToOne(
    () => BodyMeasurement,
    (bodyMeasurement) => bodyMeasurement.influencer,
  )
  @JoinColumn({
    name: 'measurement_id',
    foreignKeyConstraintName: 'fk_influencer_measurement',
  })
  measurement: BodyMeasurement;

  @OneToMany(() => Posts, (post) => post.influencer)
  post: Posts[];

  @Column('text', { nullable: true })
  language: [string];

  @Column('text', { nullable: true })
  ehtincity: string;

  @Column('text', { nullable: true })
  audience_region: string;

  @Column('text', { nullable: true })
  cultural_background: string;

  @Column('text', { nullable: true })
  phone: string;

  @OneToOne(() => DemoGraphics, (demoGraphics) => demoGraphics.influencer)
  demographics: DemoGraphics;

  @Column('boolean', { nullable: true })
  earning_experience: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => Campaign, (campaign) => campaign.influencer)
  campaigns?: Campaign[];

  @OneToMany(() => AdminReview, (review) => review.reviewerInfluencer, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  reviewsGiven?: AdminReview[];

  // Reviews where this influencer is the reviewable entity
  @OneToMany(() => AdminReview, (review) => review.reviewableInfluencer, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  reviewsReceived?: AdminReview[];
  // Influencer profiles associated with this influencer
  @OneToMany(() => InfluencerProfile, (profile) => profile.influencer, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  influencerProfiles?: InfluencerProfile[];

  @OneToMany(() => Proposal, (proposal) => proposal.influencer)
  proposals: Proposal[];

  @OneToOne(
    () => InfluencerStripeConnectedAccount,
    (influencerStripeConnectedAccount) =>
      influencerStripeConnectedAccount.influencer,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  stripeConnectedAccount: InfluencerStripeConnectedAccount[];

  @OneToMany(
    () => WithdrawalHistory,
    (withdrawalHistory) => withdrawalHistory.influencer,
  )
  withdrawalHistory: WithdrawalHistory[];

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @Column('text', { nullable: true })
  avatar: string;
}
