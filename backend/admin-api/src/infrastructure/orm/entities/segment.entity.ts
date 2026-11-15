// segment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Brands } from './brand.entity';
import { Campaign } from './campaign.entity';
import { ISegment } from '@domain/model/segment.interface';

@Entity('segments')
export class Segment extends BaseEntity implements ISegment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'brand_id' })
  brandId: number;

  @Column({ name: 'saved_filter', type: 'jsonb', nullable: true })
  savedFilter?: any;

  @Column({
    name: 'marked_candidates',
    type: 'jsonb',
    nullable: true,
    default: [],
  })
  markedCandidates?: any;

  @ManyToOne(() => Brands, (brand) => brand.segments)
  @JoinColumn({ name: 'brand_id' })
  brand?: Brands;

  @OneToMany(() => Campaign, (campaign) => campaign.segments)
  campaigns?: Campaign[];
}
