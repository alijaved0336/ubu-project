import { IProductSize } from '@domain/model/product-size.interface';
import { IProduct } from '@domain/model/product.interface';
import { ISize } from '@domain/model/size.interface';

export interface IProductSizeRepository {
  create: (productSize: any) => Promise<any>;
  findOne(id: number): Promise<Partial<IProductSize> | null>;
  findByPostAndProduct(size: Partial<ISize>, product: Partial<IProduct>): Promise<Partial<IProductSize> | null>;
}
