import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Products } from './product.entity';
import { UserAnswer } from './user-answer.entity';

export enum UserType {
  CONSUMER = 'consumer',
  MINORCONSUMER = 'minorconsumer',
  MINORINFLUENCER = 'minorinfluencer',
  INFLUENCER = 'influencer',
  BRAND = 'brand',
  SEGMENT = 'segment'
}


@Entity({ name: 'questionnaires' })
export class Questionnaires extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  title: string;

  @Column('text', { nullable: true })
  question: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_multi_selected: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_optional: boolean;

  @Column({ type: 'int', nullable: false, default: 1 })
  selection_limit: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  sr_no: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  question_category_sr_no: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  category_sub_question_sr_no: number;

  @Column('text', { array: true, nullable: true })
  options: string[];

  @Column('text', { nullable: true })
  question_category: string;

  @Column('text', { nullable: true })
  question_category_description: string;

  @OneToMany(() => UserAnswer, userAnswer => userAnswer.question)
  user_answer: UserAnswer[];

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.CONSUMER,
  })
  user_type: UserType

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

}
