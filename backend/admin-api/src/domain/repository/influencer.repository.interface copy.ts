import { IBrand } from '@domain/model/brand.interface';

export interface IBrandRepository {
  create: (brand: Partial<IBrand>) => Promise<IBrand>;
}
