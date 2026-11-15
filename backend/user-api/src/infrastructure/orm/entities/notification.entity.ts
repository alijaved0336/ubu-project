import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';

@Entity('notifications')
export class Notifications extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentNotifications, { nullable: true })
  @JoinColumn({
    name: 'sender_id',
    foreignKeyConstraintName: 'fk_notifications_sender_user',
  })
  sender: User;

  @Column({ type: 'text', name: 'receiver_type', nullable: true })
  receiver_type: string;

  @Column({ type: 'text', name: 'sender_type', nullable: true })
  sender_type: string;

  @ManyToOne(() => User, (user) => user.receivedNotifications, {
    nullable: true,
  })
  @JoinColumn({
    name: 'receiver_id',
    foreignKeyConstraintName: 'fk_notifications_receiver_user',
  })
  receiver: User;

  @Column({ type: 'text', name: 'content' })
  content: string;

  @Column({ type: 'text', name: 'type' })
  type: string;

  @Column({ type: 'boolean', name: 'isSeen' })
  isSeen: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'date',
  })
  date: Date;

  @ManyToOne(() => Campaign, (campaign) => campaign.campaignNotification, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'campaign_id',
    foreignKeyConstraintName: 'fk_notifications_campaign',
  })
  campaign: Campaign;
}
