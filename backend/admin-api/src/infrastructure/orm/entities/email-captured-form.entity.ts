import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('email_captured_for_ios')
export class EmailCapturedForIOS extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;
}
