import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('social_integrations')
@Unique(['user', 'social_platform_name'])
export class SocialIntegration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.social_integrations)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_socialintegration_user',
  })
  user: User;

  @Column({ length: 50 })
  social_platform_name: string;

  @Column({ length: 255 })
  access_token: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  token_last_updated: Date;

  @Column({ length: 50 })
  social_user_id: string; // Adjust length as per your needs

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
