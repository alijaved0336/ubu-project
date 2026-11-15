import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { WhatsNewSeenBy } from './whats-new-seen-by.entity';

@Entity({ name: 'whats_new' })
export class WhatsNew extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => User, (user) => user.whatsNew, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('jsonb')
  tags: { tagName: string; tagColor: string }[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => WhatsNewSeenBy, (seenBy) => seenBy.whatsNew)
  seenBy: WhatsNewSeenBy[];
}
