import { DeleteResult, UpdateResult } from 'typeorm';
import { BlogTags } from '@infrastructure/orm/entities/blog-tag.entity';

export interface IBlogTagRepository {
  create(tag: BlogTags): Promise<BlogTags>;
  update(whereCondition: object, tag: Partial<BlogTags>): Promise<UpdateResult>;
  remove(id: number): Promise<DeleteResult>;
}
