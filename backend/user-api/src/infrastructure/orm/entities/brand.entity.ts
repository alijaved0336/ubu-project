import { IBrand } from '@domain/model/brand.interface';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Products } from './product.entity';
import { Segment } from './segment.entity';
import { Campaign } from './campaign.entity';
import { AdminReview } from './admin-review.entity';
import { OAuthCredentials } from './oauth-credentials.entity';

@Entity({ name: 'brands' })
export class Brands extends BaseEntity implements IBrand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  brand_name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  company_website: string;

  @Column('text', { nullable: true })
  job_title: string;

  @OneToOne(() => User, (user) => user.brand)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_brand_user',
  })
  user: User;

  @OneToMany(() => Products, (product) => product.brand)
  product: Products[];

  @OneToMany(() => Segment, segment => segment.brand)
  segments?: Segment[];

  @OneToMany(() => Campaign, campaign => campaign.brand)
  campaigns?: Campaign[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date


  @Column('timestamp', { nullable: true })
  updated_at: Date;

  @OneToMany(() => AdminReview, review => review.reviewerBrand, { nullable: true, onDelete: 'CASCADE' })
  reviewsGiven?: AdminReview[];

  // Reviews where this brand is the reviewable entity
  @OneToMany(() => AdminReview, review => review.reviewableBrand, { nullable: true, onDelete: 'CASCADE' })
  reviewsReceived?: AdminReview[];

  @OneToOne(() => OAuthCredentials, oauthCredentials => oauthCredentials.brand)
  oauthCredentials: OAuthCredentials;

}
