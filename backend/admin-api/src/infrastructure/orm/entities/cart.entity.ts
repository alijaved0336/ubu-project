import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Consumers } from './consumer.entity';
import { Products } from './product.entity';

@Entity({ name: 'cart' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Consumers, (consumers) => consumers.cart, { nullable: true })
  @JoinColumn({
    name: 'consumer_id',
    foreignKeyConstraintName: 'fk_cart_consumer',
  })
  consumer: Consumers;

  @ManyToOne(() => Products, (products) => products.cart, { nullable: true })
  @JoinColumn({
    name: 'product_id',
    foreignKeyConstraintName: 'fk_cart_product',
  })
  products: Products;

  @Column('integer', { nullable: true })
  quantity: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
