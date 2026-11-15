import { DeleteResult, UpdateResult } from 'typeorm';
import { Tags } from '@infrastructure/orm/entities/tag.entity';

export interface ITagRepository {
  create(tag: Tags): Promise<Tags>;
  update(whereCondition: object, tag: Partial<Tags>): Promise<UpdateResult>;
  remove(id: number): Promise<DeleteResult>;
}
