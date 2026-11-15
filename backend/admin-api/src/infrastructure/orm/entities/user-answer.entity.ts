import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Questionnaires } from './questionnaire.entity';

@Entity({ name: 'user_answers' })
export class UserAnswer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Questionnaires, (questionnaires) => questionnaires.user_answer, { nullable: true })
  @JoinColumn({
    name: 'question_id',
    foreignKeyConstraintName: 'fk_user_answers_questionnaire',
  })
  question: Questionnaires;

  @ManyToOne(() => User, (user) => user.user_answer, { nullable: true })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_user_answers_user',
  })
  user: User;

  @Column('text', { array: true, nullable: true })
  selected_options: string[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
