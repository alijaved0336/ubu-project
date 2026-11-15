import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { IConsumer } from '@domain/model/consumer.interface';
import { BodyMeasurement } from './body-measurement.entity';
import { DemoGraphics } from './demographics.entity';
import { PostFavourites } from './post-favourites.entity';
import { ProductFavourites } from './product_favourites.entity';
import { Cart } from './cart.entity';
import { Reviews } from './reviews.entity';
import { PostVisits } from './post-visit.entity';
import { FavoriteAffiliateProduct } from './favorite-affiliate-product.entity';

@Entity({ name: 'consumers' })
export class Consumers extends BaseEntity implements IConsumer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  tiktok_handle: string;

  @Column('text', { nullable: true })
  instagram_handle: string;

  @Column('text', { nullable: true })
  facebook_handle: string;

  @Column('text', { nullable: true })
  start_budget: number;

  @Column('text', { nullable: true })
  end_budget: number;

  @Column('text', { nullable: true })
  region: string;

  @Column('text', { nullable: true })
  gender: string;

  @OneToOne(() => User, (user) => user.consumer)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_consumer_user',
  })
  user: User;

  @OneToOne(() => BodyMeasurement, (bodyMeasurement) => bodyMeasurement.consumer)
  @JoinColumn({
    name: 'measurement_id',
    foreignKeyConstraintName: 'fk_consumer_measurement',
  })
  measurement: BodyMeasurement;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToOne(() => DemoGraphics, (demoGraphics) => demoGraphics.consumer)
  demographics: DemoGraphics;

  @OneToMany(() => PostFavourites, (post_favourites) => post_favourites.consumer)
  post_favourites: PostFavourites[];

  @OneToMany(() => FavoriteAffiliateProduct, (favorite_affiliate_product) => favorite_affiliate_product.consumer)
  favorite_affiliate_product: FavoriteAffiliateProduct[];

  @OneToMany(() => PostVisits, (postVisits) => postVisits.consumer)
  post_visit: PostVisits;

  @OneToMany(() => ProductFavourites, (product_favourites) => product_favourites.consumer)
  product_favourites: ProductFavourites[];

  @OneToMany(() => Cart, (cart) => cart.consumer)
  cart: Cart[];

  @OneToMany(() => Reviews, (review) => review.consumers)
  reviews: Reviews[];

  @Column('text', { nullable: true })
  avatar: string;
}
