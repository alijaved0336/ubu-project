import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Consumers } from './consumer.entity';
import { Influencers } from './influencer.entity';

@Entity({ name: 'body_measurements' })
export class BodyMeasurement extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  scan_id: string;

  @Column('json', { nullable: true, name: 'body_composition' })
  bodyComposition: Record<string, any>;

  @Column('text', { nullable: true, name: 'custom_scan_id' })
  customScanId: string;

  @Column('json', { nullable: true })
  input: Record<string, any>;

  @Column('jsonb', { nullable: true })
  measurements: Record<string, any>[];

  @Column('text', { nullable: true, name: 'member_id' })
  memberId: string;

  @Column('json', { nullable: true })
  posture: Record<string, any>;

  @OneToOne(() => Consumers, (consumer) => consumer.measurement)
  consumer: Consumers;

  @OneToOne(() => Influencers, (influencer) => influencer.measurement)
  influencer: Influencers;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
