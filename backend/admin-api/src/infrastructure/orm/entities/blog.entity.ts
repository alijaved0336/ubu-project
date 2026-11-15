import { User } from './user.entity';
import { BlogTags } from './blog-tag.entity';

import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'blogs' })
export class Blogs extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.blog, { nullable: true })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_blogs_user',
  })
  user: User;

  @Column('jsonb', { nullable: true })
  media: {
    url: string;
    type: 'video' | 'image';
    extension: string;
    size: number;
  }[];

  @OneToMany(() => BlogTags, (blogTag) => blogTag.blog)
  blogTags: BlogTags[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
