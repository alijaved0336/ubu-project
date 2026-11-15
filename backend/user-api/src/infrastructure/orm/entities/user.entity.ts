import { IUser } from '@domain/model/user.interface';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Influencers } from './influencer.entity';
import { Brands } from './brand.entity';
import { Consumers } from './consumer.entity';
import { Follows } from './follow.entity';
import { SocialIntegration } from './social-integrations.entity';
import { UserAnswer } from './user-answer.entity';
import { UserSearch } from './user-search.entity';
import { UserError } from './user-error.entity';
import { SignInMethods } from 'common/constants';
import { Profile } from './profile.entity';
import { Notifications } from './notification.entity';

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
  city: string;

  @Column('text', { nullable: true })
  state: string;

  @Column('text', { nullable: true })
  last_name: string;

  @Column('text', { nullable: true })
  phone_number: string;

  @Column('text', { nullable: true })
  address: string;

  @Column('text')
  password: string;

  @Column('text', { nullable: true })
  stripe_customer_id: string;

  @Column('text', { nullable: true })
  refresh_token: string;

  /*   @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CONSUMER,
  })
  type: UserRole; */

  @Column({
    type: 'enum',
    enum: SignInMethods,
    default: SignInMethods.MANUAL,
  })
  sign_in_method: SignInMethods;

  @Column({ default: false })
  is_brand: boolean;

  @Column({ default: false })
  is_influencer: boolean;

  @Column({ default: false })
  is_consumer: boolean;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @Column('date', { nullable: true })
  dob: Date;

  @OneToOne(() => Influencers, (influencer) => influencer.user)
  influencer: Influencers;

  @OneToOne(() => Brands, (brand) => brand.user)
  brand: Brands;

  @OneToMany(() => Follows, (follow) => follow.follower)
  follower: Follows[];

  @OneToMany(() => Follows, (follow) => follow.followee)
  followee: Follows[];

  @OneToMany(() => UserSearch, (userSearch) => userSearch.user)
  user_search: UserSearch[];

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.user)
  user_answer: UserAnswer[];

  @OneToOne(() => Consumers, (consumer) => consumer.user)
  consumer: Consumers;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @OneToMany(
    () => SocialIntegration,
    (social_integrations) => social_integrations.user,
  )
  social_integrations: SocialIntegration;

  @OneToMany(() => UserError, (userError) => userError.user)
  userErrors: UserError[];

  @OneToMany(() => Profile, (profile) => profile.parent_user)
  parentProfiles: Profile[];

  // Profile this user is linked to as a child
  @OneToOne(() => Profile, (profile) => profile.child_user)
  childProfile?: Profile;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @OneToMany(() => Notifications, (notification) => notification.receiver)
  receivedNotifications: Notifications[];

  @OneToMany(() => Notifications, (notification) => notification.sender)
  sentNotifications: Notifications[];
}
