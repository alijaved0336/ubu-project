import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Products } from './product.entity';
import { Posts } from './post.entity';
import { ProductFavourites } from './product_favourites.entity';

@Entity({ name: 'post_products' })
export class PostProducts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Products, (product) => product.postProduct)
  @JoinColumn({
    name: 'product_id',
    foreignKeyConstraintName: 'fk_postproduct_product',
  })
  product: Products;

  @ManyToOne(() => Posts, (post) => post.postProduct)
  @JoinColumn({
    name: 'post_id',
    foreignKeyConstraintName: 'fk_postproduct_post',
  })
  post: Posts;

  @OneToMany(() => ProductFavourites, (product_favourites) => product_favourites.post_product)
  product_favourites: ProductFavourites[];

  @CreateDateColumn({ type: 'timestamp', name:'created_at' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', name:'updated_at' })
  updated_at: Date;
}
