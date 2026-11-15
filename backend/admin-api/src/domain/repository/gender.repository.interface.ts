import { IGender } from '@domain/model/gender.interface';

export interface IGenderRepository {
  findAll: () => Promise<IGender[]>;
  findById: (id: number) => Promise<IGender | null>;
}
