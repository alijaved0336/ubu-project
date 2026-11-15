import { User } from './user.entity';
import { BlogTags } from './blog-tag.entity';

import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';

@Entity({ name: 'tags' })
export class Tags extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'tag_name', type: 'text' })
  tagName: string;

  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => BlogTags, (blogTag) => blogTag.tag)
  blogTags: BlogTags[];
}
