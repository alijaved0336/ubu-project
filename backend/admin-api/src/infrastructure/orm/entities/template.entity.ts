// template.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { ITemplate } from '@domain/model/template.interface';
import { Brands } from './brand.entity';

@Entity('templates')
export class Template extends BaseEntity implements ITemplate {
  @PrimaryGeneratedColumn()
  id: number;

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
  brandId: number;

  @Column({ type: 'jsonb' })
  content: any; // Store custom content and styling in JSON format

  @ManyToOne(() => Brands, (brand) => brand.segments)
  @JoinColumn({ name: 'brand_id' })
  brand?: Brands;
}
