import { DeepPartial, DeleteResult, FindOptionsOrder, FindOptionsWhere, ObjectLiteral, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class AbstractRepository<T extends ObjectLiteral> {
  constructor(private readonly repository: Repository<T>) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async save(data: DeepPartial<T>) {
    return this.repository.save({ ...data });
  }

  async update(whereCondition: object, data: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
    return this.repository.update(whereCondition, data);
  }

  async findOne(whereCondition: object, relations?: string[]): Promise<T | null> {
    return this.repository.findOne({ where: whereCondition as unknown as FindOptionsWhere<T>, relations });
  }

  async findBy(whereCondition: object): Promise<T[] | []> {
    return this.repository.findBy(whereCondition);
  }

  async find(conditions?: FindOptionsWhere<T>): Promise<T[] | []> {
    return this.repository.find(conditions);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  async findAndCount(relations?: string[], orderBy?: FindOptionsOrder<T>) {
    const [result, total] = await this.repository.findAndCount({
      relations: relations,
      order: orderBy,
    });
    return { result, total };
  }

  async delete(whereCondition: object): Promise<DeleteResult> {
    return this.repository.delete(whereCondition);
  }

  async applyPagination(page: number, limit: number, relations?: string[], whereCondition?: FindOptionsWhere<T>[], orderBy?: FindOptionsOrder<T>) {
    const skip = (page - 1) * limit;

    const [result, total] = await this.repository.findAndCount({
      where: whereCondition,
      skip: skip,
      take: limit,
      relations: relations,
      order: orderBy,
    });
    return { result, total };
  }
}
