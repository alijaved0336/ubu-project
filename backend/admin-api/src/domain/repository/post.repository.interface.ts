import { IPost } from '@domain/model/post.interface';
import { UpdateResult } from 'typeorm';

export interface IPostRepository {
  create(post: IPost): Promise<IPost>;
  findAllWithPagination(influencerId: number, page: number, limit: number, search?: string, status?: string);
  update(id: number, post: Partial<IPost>): Promise<UpdateResult>;
  remove(id: number): Promise<void>;
}
