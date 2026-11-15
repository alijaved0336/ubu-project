// campaign.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { Segment } from './segment.entity';
import { Influencers } from './influencer.entity';
import { Brands } from './brand.entity';
import { Template } from './template.entity';
import { CampaignComment } from './campaign-comment.entity';
import { ICampaign } from '@domain/model/campaign.interface';
import { Notifications } from './notification.entity';

@Entity('campaigns')
export class Campaign extends BaseEntity implements ICampaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'segment_id' })
  segmentId: string;

  @Column({ name: 'influencer_id' })
  influencerId: string;

  @Column({ name: 'brand_id' })
  brandId: string;

  @Column({ name: 'template_id' })
  templateId: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'numeric' })
  amount: number;

  @Column()
  currency: string;

  @Column({ type: 'text', nullable: true })
  criteria?: string;

  @Column()
  status: string;

  @ManyToOne(() => Segment, (segment) => segment.campaigns)
  @JoinColumn({ name: 'segment_id' })
  segments?: Segment;

  @ManyToOne(() => Influencers, (influencer) => influencer.campaigns)
  @JoinColumn({ name: 'influencer_id' })
  influencer?: Influencers;

  @ManyToOne(() => Brands, (brand) => brand.campaigns)
  @JoinColumn({ name: 'brand_id' })
  brand?: Brands;

  @ManyToOne(() => Template, (template) => template.campaigns)
  @JoinColumn({ name: 'template_id' })
  templates?: Template;

  @OneToMany(() => CampaignComment, (comment) => comment.campaigns)
  comments?: CampaignComment[];

  @OneToMany(() => Notifications, (notification) => notification.campaign, {
    cascade: true,
  })
  campaignNotification?: Notifications[];
}
