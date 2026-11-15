import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Double,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Consumers } from './consumer.entity';
import { Products } from './product.entity';
  
  @Entity({ name: 'reviews' })
  export class Reviews extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column('double precision', {nullable: true})
    rating: Double

    @Column('text', {nullable: true})
    comment: string

    @CreateDateColumn({ type: 'timestamp', name:'created_at' })
    created_at: Date
  
    @UpdateDateColumn({ type: 'timestamp', name:'updated_at' })
    updated_at: Date;
  
    @ManyToOne(()=>Consumers, (consumers)=>consumers.reviews)
    @JoinColumn({
      name: 'consumer_id',
      foreignKeyConstraintName: 'fk_reviews_consumer',
    })
    consumers: Consumers
  
    @OneToMany(()=>Products, (products)=>products.reviews)
    products: Products[]
  
  }
  