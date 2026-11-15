import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity'; // Adjust path as per your project structure

@Entity('social_integrations')
@Unique(['user', 'social_platform_name']) // Add unique constraint for user and social_platform_name
export class SocialIntegration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 50 })
  social_platform_name: string;

  @Column({ length: 255 })
  access_token: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  token_last_updated: Date;

  @Column({ length: 50 })
  social_user_id: string; // Adjust length as per your needs
}
