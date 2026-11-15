import { DeepPartial, DeleteResult, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class AbstractUsecase<T> {
  constructor(private readonly repository: any) {}

  async create(data: DeepPartial<T>) {
    return this.repository.create({ ...data });
  }

  async save(data: DeepPartial<T>) {
    return this.repository.save({ ...data });
  }

  async update(whereCondition: object, data: QueryDeepPartialEntity<T>) {
    return this.repository.update(whereCondition, data);
  }

  async findOne(whereCondition: object, relations?: string[]) {
    return this.repository.findOne(whereCondition, relations);
  }

  async findBy(whereCondition: object): Promise<T | []> {
    return this.repository.findBy(whereCondition);
  }

  async find(conditions?: FindOptionsWhere<T>): Promise<T[] | []> {
    return this.repository.find(conditions);
  }

  async findAndCount(relations?: string[], orderBy?: FindOptionsOrder<T>) {
    return this.repository.findAndCount(relations, orderBy);
  }

  async remove(id: number) {
    return this.repository.remove(id);
  }

  async delete(whereCondition: object): Promise<DeleteResult> {
    return this.repository.delete(whereCondition);
  }

  async applyPagination(page: number, limit: number, relations?: string[], whereCondition?: FindOptionsWhere<T>[], orderBy?: FindOptionsOrder<T>) {
    return this.repository.applyPagination(page, limit, relations, whereCondition, orderBy);
  }
}
