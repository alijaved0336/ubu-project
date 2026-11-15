import { Tags } from './tag.entity';
import { Blogs } from './blog.entity';

import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'blog_tags' })
export class BlogTags extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Blogs, (blog) => blog.blogTags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blog_id' })
  blog: Blogs;

  @ManyToOne(() => Tags, (tag) => tag.blogTags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: Tags;
}
