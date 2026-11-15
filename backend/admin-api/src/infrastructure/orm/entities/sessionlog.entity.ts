import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('sessionlog')
export class SessionLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sessionLogEntry, { nullable: true })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_user_id',
  })
  user_id: User;

  @Column({ type: 'varchar', name: 'login_timestamp', nullable: true })
  login_timestamp: string;

  @Column({ type: 'varchar', name: 'ip_address', nullable: true })
  ip_address: string;

  @Column({ type: 'varchar', name: 'operating_system', nullable: true })
  operation_system: string;

  @Column({ type: 'varchar', name: 'browsing_info', nullable: true })
  browsing_info: string;

  @Column({ type: 'varchar', name: 'device_type', nullable: true })
  device_type: string;
}
