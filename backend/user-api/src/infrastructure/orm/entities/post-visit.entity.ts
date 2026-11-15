import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Posts } from './post.entity';
import { Consumers } from './consumer.entity';

@Entity({ name: 'post_visits' })
export class PostVisits extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Consumers, (consumer) => consumer.post_visit)
  @JoinColumn({
    name: 'consumer_id',
    foreignKeyConstraintName: 'fk_post_visits_consumer',
  })
  consumer: Consumers;

  @ManyToOne(() => Posts, (post) => post.post_visit)
  @JoinColumn({
    name: 'post_id',
    foreignKeyConstraintName: 'fk_postVisit_post',
  })
  post: Posts;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

}
