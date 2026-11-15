import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IPost } from '@domain/model/post.interface';
import { Influencers } from './influencer.entity';
import { PostProducts } from './post-product.entity';
import { PostFavourites } from './post-favourites.entity';
import { InfluencerProfile } from './influencer-profile.entity';
import { ProductFavourites } from './product_favourites.entity';
import { PostVisits } from './post-visit.entity';
import { AffiliateProduct } from './affiliate-product.entity';

@Entity({ name: 'posts' })
export class Posts extends BaseEntity implements IPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  title: string;

  @Column('text', { nullable: true })
  body: string;

  @Column('text', { nullable: true })
  status: string;

  @Column('json', { nullable: false, name: 'product_data', default: [] })
  productData: ProductData[];

  @ManyToOne(() => Influencers, (influencer) => influencer.post)
  @JoinColumn({ name: 'influencer_id' })
  influencer: Influencers;

  @OneToMany(() => PostProducts, (postProduct) => postProduct.post)
  postProduct: PostProducts[];

  @OneToMany(() => AffiliateProduct, (affiliateProduct) => affiliateProduct.post)
  affiliateProducts: AffiliateProduct[];

  @Column('jsonb', { nullable: true })
  media: {
    url: string;
    placeholder: string;
    type: 'video' | 'image';
    extension: string;
    size: number;
    blurHash: string;
    width: number;
    height: number;
    aspectRatio: number;
  }[];

  @OneToMany(() => PostVisits, (postVisits) => postVisits.post)
  post_visit: PostVisits;

  @OneToMany(() => ProductFavourites, (product_favourites) => product_favourites.post)
  product_favourites: ProductFavourites[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => PostFavourites, (post_favourites) => post_favourites.posts)
  post_favourites: PostFavourites;

  @Column('text', { array: true, nullable: true })
  tags: string[];

  // Influencer profiles associated with this post
  @OneToMany(() => InfluencerProfile, (profile) => profile.post, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  influencerProfiles?: InfluencerProfile[];
}

export class ProductData {
  id: number;
  title: string;
  description: string;
  images: string[]; // Array of image URLs
  link: string;
}
