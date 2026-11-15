import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Campaign } from './campaign.entity';
import { Products } from './product.entity';

import { IExhibitDocument } from '@domain/model/exhibit-document.interface';

@Entity('exhibit_documents')
export class ExhibitDocument extends BaseEntity implements IExhibitDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Campaign, (campaign) => campaign.exhibitDocuments)
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;

  @Column({ type: 'int', name: 'campaign_id' })
  campaignId: number;

  @Column({ type: 'int', name: 'document_order' })
  documentOrder: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', array: true, nullable: true })
  hashtags?: string[];

  @Column({ type: 'json', name: 'number_of_deliverables' })
  numberOfDeliverables: { type: string; count: number }[];

  @Column({ type: 'date', name: 'campaign_acceptance_deadline' })
  campaignAcceptanceDeadline: string;

  @Column({ type: 'date', name: 'publication_dates' })
  publicationDates: string;

  @Column({ type: 'numeric', name: 'total_compensation' })
  totalCompensation: number;

  @Column({ type: 'text', nullable: true, name: 'brand_guidelines' })
  brandGuidelines?: string;

  @Column({ type: 'int', nullable: true, name: 'number_of_revisions' })
  numberOfRevisions?: number;

  @Column({ type: 'int', nullable: true, name: 'turn_around_time' })
  turnAroundTime?: number;

  @Column({ type: 'text', nullable: true, name: 'special_conditions' })
  specialConditions?: string;

  @Column({ type: 'text', nullable: true, name: 'additional_requirements' })
  additionalRequirements?: string;

  @Column({ type: 'varchar', nullable: false, name: 'document_url' })
  documentUrl: string;

  @Column({ type: 'text', nullable: true, name: 'advertisemnt_url' })
  advertisemntUrl?: string;

  @ManyToOne(() => Products, (product) => product.exhibitDocuments, {
    nullable: true,
  })
  @JoinColumn({ name: 'product_id' })
  product: Products;

  @Column({ type: 'int', nullable: true, name: 'product_id' })
  productId: number;

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
