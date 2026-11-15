import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { WhatsNew } from './whats-new.entity';

@Entity({ name: 'whats_new_seen_by' })
export class WhatsNewSeenBy extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WhatsNew, (whatsNew) => whatsNew.seenBy, { nullable: false })
  @JoinColumn({ name: 'whats_new_id' })
  whatsNew: WhatsNew;

  @ManyToOne(() => User, (user) => user.seenBy, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
