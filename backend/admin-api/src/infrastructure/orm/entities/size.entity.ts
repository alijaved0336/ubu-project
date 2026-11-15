import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ProductSizes } from './product-size.entity';

@Entity({ name: 'sizes' })
export class Sizes {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ProductSizes, (productSize) => productSize.size, {
    onDelete: 'CASCADE',
  })
  productSizes: ProductSizes[];

  @Column()
  label: string;

  @Column('simple-array')
  sub_category_ids: number[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
