import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, DeleteDateColumn } from 'typeorm';
import { Consumers } from './consumer.entity';
import { AffiliateProduct } from './affiliate-product.entity';

@Entity('favorite_affiliate_products')
export class FavoriteAffiliateProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Consumers, (consumers) => consumers.favorite_affiliate_product, {
    nullable: true,
  })
  @JoinColumn({
    name: 'consumer_id',
    foreignKeyConstraintName: 'fk_favoriteaffiliate_consumer',
  })
  consumer: Consumers;

  @ManyToOne(() => AffiliateProduct, (affiliateProduct) => affiliateProduct.favoriteAffiliateProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'affiliate_product_id' })
  affiliateProduct: AffiliateProduct;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
