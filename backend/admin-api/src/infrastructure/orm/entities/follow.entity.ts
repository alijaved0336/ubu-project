import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IFollow } from '@domain/model/follow.interface';
import { User } from './user.entity';

@Entity({ name: 'follows' })
export class Follows extends BaseEntity implements IFollow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.follower_id)
  @JoinColumn({
    name: 'follower_id',
    foreignKeyConstraintName: 'fk_follower_user',
  })
  follower: User[];

  @ManyToOne(() => User, (user) => user.followee_id)
  @JoinColumn({
    name: 'followee_id',
    foreignKeyConstraintName: 'fk_followee_user',
  })
  followee: User[];

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
