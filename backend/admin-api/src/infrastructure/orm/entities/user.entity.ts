import { IUser } from '@domain/model/user.interface';
import { BaseEntity, Column, CreateDateColumn, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Influencers } from './influencer.entity';
import { Brands } from './brand.entity';
import { Consumers } from './consumer.entity';
import { Follows } from './follow.entity';
import { SocialIntegration } from './social-integrations.entity';
import { UserAnswer } from './user-answer.entity';
import { ChatMessage } from './chat-messages.entity';
import { ChatUser } from './chat-users.entity';
import { Notifications } from './notification.entity';
import { UBUSubscription } from './ubuSubscription.entity';
import { Blogs } from './blog.entity';
import { ForgotPasswordToken } from './forgot-password-token.entity';
import { Tags } from './tag.entity';
import { CampaignPayment } from './campaign-payment.entity';
import { SessionLog } from './sessionlog.entity';
import { FundRelease } from './campaign-fund-release.entity';
import { SignInMethods } from '@infrastructure/utils/constant';
import { Refund } from './refund.entity';
import { CampaignDispute } from './campaign-dispute.entity';
import { WhatsNew } from './whats-new.entity';
import { WhatsNewSeenBy } from './whats-new-seen-by.entity';
import { UserError } from './user-error.entity';
import { InfluencerPayment } from './influencer-payment.entity';
import { UserSearch } from './user-search.entity';
import { Profile } from './profile.entity';

export enum UserRole {
  SUPERADMIN = 'superAdmin',
  CONSUMER = 'consumer',
  INFLUENCER = 'influencer',
  BRAND = 'brand',
}

@Entity({ name: 'user' })
@Index('index_user_email', ['email'], { unique: true })
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  email: string;

  @Column('text', { nullable: true })
  first_name: string;

  @Column('text', { nullable: true })
  phone_number: string;

  @Column('text', { nullable: true })
  last_name: string;

  @Column('text')
  password: string;

  @Column('text', { nullable: true })
  stripe_customer_id: string;

  @Column('text', { nullable: true })
  refresh_token: string;

  @Column({ default: false })
  is_brand: boolean;

  @Column({ default: false })
  is_influencer: boolean;

  @Column({
    type: 'enum',
    enum: SignInMethods,
    default: SignInMethods.MANUAL,
  })
  sign_in_method: SignInMethods;

  @Column({ default: false })
  is_consumer: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @OneToOne(() => Influencers, (influencer) => influencer.user)
  influencer: Influencers;

  @OneToOne(() => Brands, (brand) => brand.user)
  brand: Brands;

  @OneToMany(() => Notifications, (notification) => notification.receiver)
  receivedNotifications: Notifications[];

  @OneToMany(() => Follows, (follow) => follow.follower)
  follower_id: Follows[];

  @OneToMany(() => Follows, (follow) => follow.followee)
  followee_id: Follows[];

  @OneToOne(() => Consumers, (consumer) => consumer.user)
  consumer: Consumers;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => SocialIntegration, (social_integrations) => social_integrations.user)
  social_integrations: SocialIntegration;

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.user)
  user_answer: UserAnswer[];

  @OneToMany(() => Blogs, (blogs) => blogs.user)
  blog: Blogs[];

  @OneToMany(() => UBUSubscription, (ubuSubscription) => ubuSubscription.user)
  ubuSubscription: UBUSubscription[];

  @Column({ default: false })
  is_admin: boolean;

  @Column({ default: false })
  is_questionnaire_completed: boolean;

  @Column('text', { nullable: true })
  address: string;

  @Column('text', { nullable: true })
  city: string;

  @Column('text', { nullable: true })
  state: string;

  @Column('varchar', { length: 10, nullable: true })
  zip_code: string;

  @Column({ default: false })
  email_verified: boolean;

  @Column('date', { nullable: true })
  dob: Date;

  @OneToMany(() => Tags, (tags) => tags.user)
  tags: Tags[];

  @OneToOne(() => ChatMessage, (chatMessage) => chatMessage.sender)
  chatMessage: ChatMessage[];

  @OneToMany(() => ChatUser, (chatUser) => chatUser.user)
  chatUsers: ChatUser[];

  @OneToMany(() => Notifications, (notification) => notification.sender)
  sentNotifications: Notifications[];

  @OneToMany(() => SessionLog, (sessionLog) => sessionLog.user_id)
  sessionLogEntry: SessionLog;

  @OneToMany(() => ForgotPasswordToken, (token) => token.user)
  forgotPasswordTokens: ForgotPasswordToken[];

  @OneToMany(() => CampaignPayment, (campaign_payments) => campaign_payments.user)
  campaignPayment: CampaignPayment[];

  @OneToMany(() => FundRelease, (fundRelease) => fundRelease.user)
  fundRelease: FundRelease[];

  @OneToMany(() => Refund, (refund) => refund.user)
  refund: Refund[];

  @OneToMany(() => CampaignDispute, (campaignDisputes) => campaignDisputes.raised_by)
  raisedDisputes: CampaignDispute[];

  @OneToMany(() => CampaignDispute, (campaignDisputes) => campaignDisputes.against_by)
  receivedDisputes: CampaignDispute[];

  @Column('varchar', { nullable: true })
  apple_identifier: string;

  @OneToMany(() => WhatsNew, (whatsNew) => whatsNew.user)
  whatsNew: WhatsNew[];

  @OneToMany(() => WhatsNewSeenBy, (seenBy) => seenBy.user)
  seenBy: WhatsNewSeenBy[];

  @OneToMany(() => UserError, (userError) => userError.user)
  userErrors: UserError[];

  @OneToMany(() => InfluencerPayment, (influencerPayment) => influencerPayment.user)
  influencerPayment?: InfluencerPayment[];

  @OneToMany(() => UserSearch, (userSearch) => userSearch.user)
  user_search: UserSearch[];

  @OneToMany(() => Profile, (profile) => profile.parent_user)
  parentProfiles: Profile[];

  // Profile this user is linked to as a child
  @OneToOne(() => Profile, (profile) => profile.child_user)
  childProfile?: Profile;
}
