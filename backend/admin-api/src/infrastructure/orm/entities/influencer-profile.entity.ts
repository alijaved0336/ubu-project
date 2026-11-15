// influencer-profile.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Influencers } from './influencer.entity';
import { Posts } from './post.entity';

@Entity('influencer_profiles')
export class InfluencerProfile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  influencer_id: number;

  @Column()
  post_id: number;

  @Column('boolean', { default: false })
  is_pinned: boolean;

  @ManyToOne(() => Influencers, (influencer) => influencer.influencerProfiles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'influencer_id', referencedColumnName: 'id' })
  influencer: Influencers;

  @ManyToOne(() => Posts, (post) => post.influencerProfiles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Posts;
}
