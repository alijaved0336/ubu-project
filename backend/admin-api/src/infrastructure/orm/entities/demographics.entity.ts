import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Influencers } from './influencer.entity';
import { Consumers } from './consumer.entity';
import { IDemoGraphics } from '@domain/model/demographics.interface';

@Entity({ name: 'demographics' })
export class DemoGraphics extends BaseEntity implements IDemoGraphics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float', { nullable: true })
  height: number;

  @Column('float', { nullable: true })
  weight: number;

  @Column('text', { nullable: true })
  body_type: string;

  @Column('text', { nullable: true })
  hair_color: string;

  @Column('text', { nullable: true })
  eye_color: string;

  @Column('text', { nullable: true })
  skin_tone: string;

  @Column('text', { nullable: true })
  distinctive_features: string;

  @Column('text', { nullable: true })
  overall_aesthetic: string;

  @Column('text', { nullable: true })
  style_and_personality: string;

  @Column('text', { nullable: true })
  fashion_style: string;

  @Column('text', { nullable: true })
  personal_style: string;

  @Column('text', { nullable: true })
  personality_traits: string;

  @Column('text', { nullable: true })
  lifestyle: string;

  @Column('text', { nullable: true })
  values_and_beliefs: string;

  @Column('text', { nullable: true })
  hobbies_and_interest: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @OneToOne(() => Influencers, (influencer) => influencer.demographics)
  @JoinColumn({
    name: 'influencer_id',
    foreignKeyConstraintName: 'fk_demographics_influencer',
  })
  influencer: Influencers;

  @OneToOne(() => Consumers, (consumer) => consumer.demographics)
  @JoinColumn({
    name: 'consumer_id',
    foreignKeyConstraintName: 'fk_demographics_consumer',
  })
  consumer: Consumers;
}
