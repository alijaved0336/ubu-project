import { type IInfluencer } from '@domain/model/influencer.interface';
import { DeleteResult, UpdateResult } from 'typeorm';

export interface IInfluencerRepository {
  create: (influencer: Partial<IInfluencer>) => Promise<IInfluencer>;
  findOne(id: number): Promise<Partial<IInfluencer> | null>;
}
