import { InstagramStats } from '@infrastructure/orm/entities/instagram-stats.entity';

export interface IInstagramStatsRepository {
  createOrUpdate(payload: Partial<InstagramStats> & { influencerId: number }): Promise<InstagramStats>;
}
