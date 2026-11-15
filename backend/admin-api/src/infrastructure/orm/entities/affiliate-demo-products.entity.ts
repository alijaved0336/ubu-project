import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('affiliate_demo_products') // Table name
export class AffiliateDemoProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'jsonb', nullable: true })
  images: any;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tags: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  category: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  style: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subcategory: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  price: string;

  @Column({ type: 'text', nullable: true })
  affiliate_link: string;
}
