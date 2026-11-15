import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Products } from './product.entity';
import { SubCategory } from './sub-category.entity';

@Entity({ name: 'gender' })
@Index('idx_gender_name', ['name'])
export class Gender extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  name: string;

  @OneToMany(()=>Products, (products)=> products.genders)
  products: Products[];


  @CreateDateColumn({ type: 'timestamp', name:'created_at' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', name:'updated_at' })
  updated_at: Date;

}
