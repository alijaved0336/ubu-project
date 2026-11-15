import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ProductRequest } from './product-request.entity';

export enum RelationType {
  HUSBAND = 'Husband',
  WIFE = 'Wife',
  FIANCE = 'Fiancé',
  BOYFRIEND = 'Boyfriend',
  GIRLFRIEND = 'Girlfriend',
  SON = 'Son',
  DAUGHTER = 'Daughter',
  FATHER = 'Father',
  MOTHER = 'Mother',
  BEST_FRIEND = 'Best Friend',
  FRIEND = 'Friend',
  GRANDPA = 'Grandpa',
  GRANDMA = 'Grandma',
}

@Entity({ name: 'profile' })
@Index('index_profile_child_user', ['child_user_id'], {
  unique: true,
  where: 'child_user_id IS NOT NULL',
})
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RelationType,
  })
  relation: RelationType;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => User, (user) => user.parentProfiles, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_user_id' })
  parent_user: User | undefined;

  @Column('int')
  parent_user_id: number;

  @OneToOne(() => User, (user) => user.childProfile, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'child_user_id' })
  child_user?: User;

  @Column('int', { nullable: true })
  child_user_id?: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => ProductRequest, (productRequest) => productRequest.profile)
  productRequests: ProductRequest[];

  @Column('bool', { default: false, nullable: true })
  isDependant: boolean;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
