import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Brands } from './brand.entity';
import { Influencers } from './influencer.entity';

@Entity({ name: 'weekly_tracking_summaries' })
export class WeeklyTrackingSummary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, name: 'tracking_id' })
  trackingId: string;

  @Column({ type: 'date', name: 'week_start_date' })
  weekStartDate: Date;

  @Column({ type: 'date', name: 'week_end_date' })
  weekEndDate: Date;

  @Column({ type: 'int', default: 0, name: 'clicks' })
  clicks: number;

  @Column({ type: 'int', default: 0, name: 'items_ordered' })
  itemsOrdered: number;

  @Column({ type: 'int', default: 0, name: 'items_shipped' })
  itemsShipped: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  revenue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'ad_fees' })
  adFees: number;

  @ManyToOne(() => Influencers, (influencer) => influencer, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'influencer_id' })
  influencer: Influencers;

  @ManyToOne(() => Brands, (brand) => brand, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brands;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @Column({ name: 'brand_id' })
  brandId: number;

  @Column({ name: 'influencer_id' })
  influncerId: number;
}
