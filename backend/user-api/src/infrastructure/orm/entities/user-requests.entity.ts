import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { RelationType } from './profile.entity';

export enum RequestFor {
  PARENT = 'Parent',
  CHILD = 'Child',
}

export enum RequestStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
}

@Entity()
export class UserRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @Column()
  requester_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'requestee_id' })
  requestee: User;

  @Column()
  requestee_id: number;

  @Column({ type: 'enum', enum: RelationType })
  relationType: RelationType;

  @Column({ type: 'enum', enum: RequestFor })
  requestFor: RequestFor;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
