import { ISubCategory } from '@domain/model/sub-category.interface';

export interface ISubCategoryRepository {
  findAll: () => Promise<ISubCategory[]>;
}
