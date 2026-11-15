import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Products } from './product.entity';
import { Categories } from './category.entity';
import { Gender } from './gender.entity';

@Entity({ name: 'sub_categories' })
@Index('idx_sub_categories_name', ['name'])
@Index('idx_sub_categories_type', ['type'])
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

  @Column('text', { array: true, nullable: true })
  required_columns: string[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @Column('simple-array')
  gender_ids: number[];
}
