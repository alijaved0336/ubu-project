import { ICategory } from '@domain/model/category.interface';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Products } from './product.entity';
import { SubCategory } from './sub-category.entity';

@Entity({ name: 'categories' })
export class Categories extends BaseEntity implements ICategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
  subCategory: SubCategory[];

  @OneToMany(() => Products, (products) => products.category)
  products: Products[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
