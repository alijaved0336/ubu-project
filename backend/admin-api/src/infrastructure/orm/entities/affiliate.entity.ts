import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Brands } from './brand.entity';
import { Influencers } from './influencer.entity';
import { integer } from 'aws-sdk/clients/cloudfront';

export enum Status {
  IN_PROGRESS = 'in progress',
  COMPLETED = 'completed',
}

@Entity()
@Unique(['affiliate_id'])
export class Affiliate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Brands, { nullable: true })
  @JoinColumn({ name: 'brand_id' })
  brand: Brands;

  @ManyToOne(() => Influencers, { nullable: true })
  @JoinColumn({ name: 'influencer_id' })
  influencer: Influencers;

  @Column({ nullable: false })
  affiliate_id: string; // assuming this is some unique identifier for affiliates

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.IN_PROGRESS, // Default value
  })
  status: Status;

  @Column({ nullable: true })
  brand_id: integer;

  @Column({ nullable: true })
  influencer_id: integer; // Corrected the typo here
}
