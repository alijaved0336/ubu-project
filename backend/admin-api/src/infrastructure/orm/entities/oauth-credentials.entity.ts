import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Brands } from './brand.entity';
export enum CredsType {
  AMAZON = 'amazon',
  SHOPIFY = 'shopify',
  // Add more values as needed
}
@Entity({ name: 'oauth_credentials' })
export class OAuthCredentials {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  refresh_token: string;

  @Column('text')
  access_token: string;

  @Column('text')
  seller_id: string; // New column for seller ID

  @Column({
    type: 'enum',
    enum: CredsType,
    default: CredsType.AMAZON, // Default value if needed
  })
  creds_type: CredsType; // New enum column

  @Column('timestamp')
  token_expiry: Date;

  @OneToOne(() => Brands, (brand) => brand.oauthCredentials)
  @JoinColumn({ name: 'brand_id', foreignKeyConstraintName: 'fk_oauth_brand' })
  brand: Brands;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @Column('timestamp', { nullable: true })
  updated_at: Date;
}
