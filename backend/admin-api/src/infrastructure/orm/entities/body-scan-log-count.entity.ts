import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'body_scan_log_count' })
export class BodyScanLogCount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: true })
  count: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
