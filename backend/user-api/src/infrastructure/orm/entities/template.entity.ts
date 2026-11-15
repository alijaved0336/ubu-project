// template.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Campaign } from './campaign.entity';
import { ITemplate } from '@domain/model/template.interface';
import { Brands } from './brand.entity';

@Entity('templates')
export class Template extends BaseEntity implements ITemplate{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  heading?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  signature?: string;

  @Column({ type: 'text', nullable: true })
  footer?: string;

  @Column({ name: 'brand_id' })
  brandId: string;

  @Column({ type: 'jsonb' })
  content: any; // Store custom content and styling in JSON format

  @OneToMany(() => Campaign, campaign => campaign.templates)
  campaigns?: Campaign[];

  @ManyToOne(() => Brands, brand => brand.segments)
  @JoinColumn({ name: 'brand_id' })
  brand?: Brands;
}
