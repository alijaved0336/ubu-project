import { ICategory } from '@domain/model/category.interface';

export interface ICategoryRepository {
  findAll: () => Promise<ICategory[]>;
}
