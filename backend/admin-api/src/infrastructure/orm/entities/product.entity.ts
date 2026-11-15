import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Brands } from './brand.entity';
import { PostProducts } from './post-product.entity';
import { ExhibitDocument } from './exhibit-document.entity';
import { ProductSizes } from './product-size.entity';
import { Categories } from './category.entity';
import { SubCategory } from './sub-category.entity';
import { Gender } from './gender.entity';
import { ProductFavourites } from './product_favourites.entity';
import { Cart } from './cart.entity';
import { Style } from './style.entity';
import { Reviews } from './reviews.entity';
import { float } from 'aws-sdk/clients/cloudfront';

export class Color {
  @Column('text', { nullable: true })
  color_name: string;

  @Column('text', { nullable: true })
  color_code: string;
}

@Entity({ name: 'products' })
export class Products extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('integer', { nullable: true })
  price: float;

  @Column('text', { nullable: true })
  currency: string;

  @Column('jsonb', { nullable: true })
  media: {
    url: string;
    type: 'video' | 'image';
    extension: string;
    size: number;
  }[];

  @Column('text', { array: true, nullable: true })
  tags: string[];

  @Column('jsonb', { nullable: true })
  colors: Record<string, string>;

  @Column('text', { array: true, nullable: true })
  style: string[];

  @Column('boolean', { nullable: true })
  status: boolean;

  @Column({ nullable: true })
  material: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => ExhibitDocument, (exhibitDocument) => exhibitDocument.product)
  exhibitDocuments: ExhibitDocument[];

  @ManyToOne(() => Brands, (brand) => brand.product)
  @JoinColumn({
    name: 'brand_id',
    foreignKeyConstraintName: 'fk_brand_product',
  })
  brand: Brands;

  @ManyToOne(() => Categories, (category) => category.products)
  @JoinColumn({
    name: 'category_id',
    foreignKeyConstraintName: 'fk_category_product',
  })
  category: Categories;

  @ManyToOne(() => SubCategory, (sub_category) => sub_category.products)
  @JoinColumn({
    name: 'sub_category_id',
    foreignKeyConstraintName: 'fk_sub_category_product',
  })
  sub_category: SubCategory;

  @OneToMany(() => ProductSizes, (productSize) => productSize.product)
  productSizes: ProductSizes[];

  @OneToMany(() => PostProducts, (postProduct) => postProduct.product)
  postProduct: PostProducts[];

  @ManyToOne(() => Reviews, (review) => review.products)
  @JoinColumn({
    name: 'review_id',
    foreignKeyConstraintName: 'fk_review_product',
  })
  reviews: Reviews;

  @ManyToOne(() => Gender, (gender) => gender.products)
  @JoinColumn({
    name: 'gender_id',
    foreignKeyConstraintName: 'fk_gender_product',
  })
  genders: Gender;

  @ManyToOne(() => Style, (style) => style.products)
  @JoinColumn({
    name: 'style_id',
    foreignKeyConstraintName: 'fk_style_product',
  })
  styles: Style;

  @OneToMany(() => ProductFavourites, (product_favourites) => product_favourites.products)
  product_favourites: ProductFavourites;

  @OneToMany(() => Cart, (cart) => cart.products)
  cart: Cart;

  @Column({ type: 'text', name: 'product_link' })
  productLink: string;
}
