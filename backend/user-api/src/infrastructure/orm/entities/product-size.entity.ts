import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Products } from './product.entity';
import { Sizes } from './size.entity'; // Replace with the correct path

@Entity({ name: 'product_sizes' })
export class ProductSizes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Products, product => product.productSizes, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'product_id',
    foreignKeyConstraintName: 'fk_productsize_product',
  })
  product: Products;

  @ManyToOne(() => Sizes, size => size.productSizes, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'size_id',
    foreignKeyConstraintName: 'fk_productsize_size',
  })
  size: Sizes;

  @Column('jsonb', { nullable: true })
  dimensions: Record<string, any>[];

  @Column({ type: 'boolean', default: false, nullable: true })
  active: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
