// influencer-profile.repository.interface.ts

import { InfluencerProfile } from '@infrastructure/orm/entities/influencer-profile.entity';

export interface IInfluencerProfileRepository {
  findAll(): Promise<InfluencerProfile[]>;
  findById(id: number): Promise<InfluencerProfile | null>;
  create(profile: InfluencerProfile): Promise<InfluencerProfile>;
  update(id: number, profile: Partial<InfluencerProfile>): Promise<InfluencerProfile | null>;
  delete(id: number): Promise<void>;
}
