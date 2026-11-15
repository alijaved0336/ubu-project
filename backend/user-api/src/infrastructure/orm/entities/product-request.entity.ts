import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { AffiliateProduct } from './affiliate-product.entity';
import { Profile } from './profile.entity';

export enum RequestStatus {
  PENDING = 'pending',
  BOUGHT = 'bought',
  CANCELLED = 'cancelled',
  APPROVED = 'approved',
}

@Entity('product_requests')
export class ProductRequest extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  // Many product requests can belong to one profile
  @ManyToOne(() => Profile, profile => profile.productRequests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  // Many product requests can belong to one affiliate product
  @ManyToOne(() => AffiliateProduct, product => product.productRequests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'affiliate_product_id' })
  affiliateProduct: AffiliateProduct;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @Column({ type: 'text', nullable: true })
  message: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
