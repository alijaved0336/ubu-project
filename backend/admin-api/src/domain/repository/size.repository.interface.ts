import { ISize } from '@domain/model/size.interface';

export interface ISizeRepository {
  findBySubCategory: (subCategoryid: number) => Promise<ISize[]>;
}
