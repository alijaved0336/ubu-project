// influencer-profile.repository.ts
import { IInfluencerProfileRepository } from '@domain/repository/influencer-profile.repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InfluencerProfile } from '../entities/influencer-profile.entity';

@Injectable()
export class InfluencerProfileRepository implements IInfluencerProfileRepository {
  constructor(
    @InjectRepository(InfluencerProfile)
    private readonly influencerProfileRepository: Repository<InfluencerProfile>,
  ) {}

  async findAll(): Promise<InfluencerProfile[]> {
    return this.influencerProfileRepository.find();
  }

  async findById(id: number): Promise<InfluencerProfile | null> {
    return this.influencerProfileRepository.findOneBy({ id });
  }

  async create(profile: InfluencerProfile): Promise<InfluencerProfile> {
    return this.influencerProfileRepository.save(profile);
  }

  async update(id: number, profile: Partial<InfluencerProfile>): Promise<InfluencerProfile | null> {
    await this.influencerProfileRepository.update(id, profile);
    return this.influencerProfileRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    await this.influencerProfileRepository.delete(id);
  }
}
