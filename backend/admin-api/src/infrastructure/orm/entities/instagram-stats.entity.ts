import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Influencers } from './influencer.entity';

@Entity({ name: 'instagram_stats' })
export class InstagramStats extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Influencers, (influencer) => influencer.instagramStats)
  @JoinColumn({
    name: 'influencer_id',
  })
  influencer: Influencers;

  @Column({ type: 'int', name: 'followers_count', nullable: false })
  followersCount: number;

  @Column({ type: 'text', name: 'engagement_rate', nullable: true })
  engagementRate: string;

  @Column({ type: 'text', name: 'conversion_rate', nullable: true })
  conversionRate: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
