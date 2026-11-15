// segment.repository.interface.ts
import { ISegment } from '@domain/model/segment.interface';
import { Repository } from 'typeorm';

export interface ISegmentRepository {
  findByName(name: string): Promise<ISegment | null>;
  findByBrandId(brandId: number): Promise<ISegment[]>;
}
