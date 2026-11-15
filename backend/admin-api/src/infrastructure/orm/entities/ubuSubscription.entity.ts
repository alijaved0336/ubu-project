import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum PlanType {
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

@Entity({ name: 'ubu_subscriptions' })
export class UBUSubscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', name: 'subs_start_date' })
  subs_start_date: Date;

  @Column({ type: 'timestamp', name: 'subs_end_date' })
  subs_end_date: Date;

  @Column('text', { nullable: false })
  stripe_subscription_id: string;

  @Column('text', { nullable: true })
  cancel_at_period_end: string;

  @Column('text', { nullable: false })
  stripe_invoice_id: string;

  @Column('text', { nullable: false })
  price: string;

  @Column('text', { nullable: false })
  price_id: string;

  @Column('text', { nullable: false })
  interval: string;

  @Column('text', { nullable: false })
  product_id: string;

  @Column({
    type: 'enum',
    enum: PlanType,
    default: PlanType.BASIC,
  })
  plan_type: PlanType;

  @ManyToOne(() => User, (user) => user.ubuSubscription)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_ubu_subscription_user',
  })
  user: User;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
