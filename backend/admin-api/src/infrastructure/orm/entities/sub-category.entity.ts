import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Products } from './product.entity';
import { Categories } from './category.entity';

@Entity({ name: 'sub_categories' })
export class SubCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Categories, (category) => category.subCategory)
  @JoinColumn({
    name: 'category_id',
    foreignKeyConstraintName: 'fk_category_subcategory',
  })
  category: Categories;

  @OneToMany(() => Products, (products) => products.sub_category)
  products: Products[];

  @Column('text', { nullable: false })
  name: string;

  @Column('text', { nullable: true })
  type: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @Column('simple-array')
  gender_ids: number[];

  @Column('text', { array: true, nullable: true })
  required_columns: string[];
}
