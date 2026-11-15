import { IProduct } from '@domain/model/product.interface';

export interface IProductRepository {
  create: (product: Partial<IProduct>) => Promise<IProduct>;
  findById(id: number): Promise<Partial<IProduct> | null>;
  findAll(brand_id: number): Promise<IProduct[] | null>;
}
