import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Consumers } from './consumer.entity';
import { Products } from './product.entity';
import { PostProducts } from './post-product.entity';
import { Posts } from './post.entity';

@Entity({ name: 'product_favourites' })
export class ProductFavourites {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Consumers, (consumers) => consumers.post_favourites, {
    nullable: true,
  })
  @JoinColumn({
    name: 'consumer_id',
    foreignKeyConstraintName: 'fk_productfavorite_consumer',
  })
  consumer: Consumers;

  @ManyToOne(() => Products, (products) => products.product_favourites, {
    nullable: true,
  })
  @JoinColumn({
    name: 'product_id',
    foreignKeyConstraintName: 'fk_productfavorite_product',
  })
  products: Products;

  @ManyToOne(() => Posts, (posts) => posts.product_favourites, {
    nullable: true,
  })
  @JoinColumn({
    name: 'post_id',
    foreignKeyConstraintName: 'fk_productfavorite_post',
  })
  post: Posts;

  @ManyToOne(() => PostProducts, (postProducts) => postProducts.product_favourites)
  @JoinColumn({
    name: 'post_product_id',
    foreignKeyConstraintName: 'fk_productfavorite_post_product',
  })
  post_product: PostProducts;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
