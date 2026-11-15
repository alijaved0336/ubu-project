import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserAnswer } from './user-answer.entity';

export enum UserType {
  CONSUMER = 'consumer',
  INFLUENCER = 'influencer',
  MINORINFLUENCER = 'minorinfluencer',
  MINORCONSUMER = 'minorconsumer',
  BRAND = 'brand',
  SEGMENT = 'segment',
}

export enum Layout {
  SIMPLE_CHECKBOX = 'simpleCheckbox',
  CHECKBOX_CARD = 'checkboxCard',
  SIMPLE_RADIO = 'simpleRadio',
  RADIO_CARD = 'radioCard',
  CHECKBOX_CARD_SMALL = 'checkboxCardSmall',
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

  @Column({ type: 'int', nullable: false })
  sr_no: number;

  @Column({ type: 'int', nullable: true })
  question_category_sr_no: number;

  @Column({ type: 'int', nullable: true })
  category_sub_question_sr_no: number;

  @Column('text', { array: true, nullable: true })
  options: string[];

  @Column('text', { nullable: true })
  question_category: string;

  @Column('text', { nullable: true })
  question_category_description: string;

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.question)
  user_answer: UserAnswer[];

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.CONSUMER,
  })
  user_type: UserType;

  @Column({
    type: 'enum',
    enum: Layout,
    nullable: true,
  })
  layout: Layout;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
