// campaign-comment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity
} from 'typeorm';
import { Campaign } from './campaign.entity';
import { ICampaignComment } from '@domain/model/campaign-comment.interface';

@Entity('campaign_comments')
export class CampaignComment extends BaseEntity implements ICampaignComment{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'campaign_id' })
  campaignId: string;

  @Column({ type: 'text' })
  comment: string;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Campaign, campaign => campaign.comments)
  @JoinColumn({ name: 'campaign_id' })
  campaigns?: Campaign;
}
