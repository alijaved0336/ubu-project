import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Influencers } from './influencer.entity';

@Entity('proposals')
export class Proposal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text') // Use 'text' for storing HTML content
  body: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'published'],
  })
  status: 'draft' | 'published';

  @Column({ name: 'influencer_id' })
  influencerId: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => Influencers, (influencer) => influencer.proposals, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'influencer_id',
    foreignKeyConstraintName: 'fk_proposal_influencer',
  })
  influencer: Influencers;
}
