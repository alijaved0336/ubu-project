import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, BaseEntity } from 'typeorm';

import { Campaign } from './campaign.entity';
import { IContract } from '@domain/model/contract.interface';

@Entity('contracts')
export class Contract extends BaseEntity implements IContract {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Campaign, (campaign) => campaign.contract)
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;
  p;
  @Column({ type: 'text', nullable: true, name: 'brand_sign_url' })
  brandSignUrl?: string;

  @Column({ type: 'text', nullable: true, name: 'influencer_sign_url' })
  influencerSignUrl?: string;

  @Column({ type: 'varchar', nullable: false, name: 'document_url' })
  contractDocumentUrl: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;
}
