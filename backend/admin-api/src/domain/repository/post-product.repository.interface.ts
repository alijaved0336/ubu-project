import { IPostProduct } from '@domain/model/post-product.interface';
import { IPost } from '@domain/model/post.interface';
import { IProduct } from '@domain/model/product.interface';
import { PostProducts } from '@infrastructure/orm/entities/post-product.entity';

export interface IPostProductRepository {
  create: (postProduct: PostProducts) => Promise<PostProducts>;
  findOne(id: number): Promise<Partial<IPostProduct> | null>;
  findByPostAndProduct(post: Partial<IPost>, product: Partial<IProduct>): Promise<Partial<IPostProduct> | null>;
}
