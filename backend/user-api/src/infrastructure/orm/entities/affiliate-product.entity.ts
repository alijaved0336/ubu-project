import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { FavoriteAffiliateProduct } from './favorite-affiliate-product.entity';
import { IAffiliateProduct } from '@domain/model/affiliate-product.interface';
import { Posts } from './post.entity';
import { ProductRequest } from './product-request.entity';

@Entity('affiliate_products')
export class AffiliateProduct extends BaseEntity implements IAffiliateProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('jsonb', { array: true })
  images: string[];

  @Column()
  link: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  price: number;

  @ManyToOne(() => Posts, (post) => post.affiliateProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Posts;

  @OneToMany(
    () => FavoriteAffiliateProduct,
    (favorite) => favorite.affiliateProduct,
  )
  favoriteAffiliateProducts: FavoriteAffiliateProduct[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @OneToMany(
    () => ProductRequest,
    (productRequest) => productRequest.affiliateProduct,
  )
  productRequests: ProductRequest[];

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
