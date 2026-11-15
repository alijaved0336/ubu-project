import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstagramStats } from '../entities/instagram-stats.entity';
import { IInstagramStatsRepository } from '@domain/repository/instagram-stats.repository.interface';

@Injectable()
export class InstagramStatsRepository implements IInstagramStatsRepository {
  constructor(
    @InjectRepository(InstagramStats)
    private readonly instagramStatsRepo: Repository<InstagramStats>,
  ) {}

  async createOrUpdate(payload: Partial<InstagramStats> & { influencerId: number }): Promise<InstagramStats> {
    const { influencerId, ...statsData } = payload;

    const existingStats = await this.instagramStatsRepo.findOne({
      where: { influencer: { id: influencerId } },
    });

    if (existingStats) {
      const updated = Object.assign(existingStats, statsData);
      return await this.instagramStatsRepo.save(updated);
    } else {
      const newStats = this.instagramStatsRepo.create({
        ...statsData,
        influencer: { id: influencerId },
      });
      return await this.instagramStatsRepo.save(newStats);
    }
  }
}
