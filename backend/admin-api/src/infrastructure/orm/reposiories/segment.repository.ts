// segment.repository.ts
import { ILike, Repository, UpdateResult } from 'typeorm';
import { Segment } from '../entities/segment.entity';
import { ISegmentRepository } from '@domain/repository/segment.repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SegmentRepository implements ISegmentRepository {
  constructor(
    @InjectRepository(Segment)
    private readonly segmentRepository: Repository<Segment>,
  ) {}

  async findByName(name: string): Promise<Segment | null> {
    return this.segmentRepository.findOne({ where: { name } });
  }

  async findByBrandId(brandId: number): Promise<Segment[]> {
    return this.segmentRepository.find({ where: { brandId } });
  }

  async findByBrands(brand_id: number, page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    let whereCondition = { brand: { id: brand_id } } as any;

    if (search) {
      whereCondition = [{ brand: { id: brand_id }, name: ILike(`%${search}%`) }];
    }

    const [segments, total] = await this.segmentRepository.findAndCount({
      where: whereCondition,
      skip: skip,
      take: limit,
      order: {
        id: 'DESC',
      },
    });
    return { segments, total };
  }

  async findOne(id: number) {
    return this.segmentRepository.findOne({ where: { id } });
  }

  async create(payload: Partial<Segment>): Promise<Segment> {
    const segment = this.segmentRepository.create(payload);
    return await this.segmentRepository.save(segment);
  }

  async update(id: number, data: Partial<Segment>): Promise<UpdateResult> {
    return this.segmentRepository.update(id, data);
  }

  async delete(id: number) {
    return this.segmentRepository.delete(id);
  }

  async findAllWithRelation(brandId) {
    return this.segmentRepository.find({
      where: { brandId },
      relations: ['campaigns', 'campaigns.segments', 'campaigns.influencer', 'campaigns.influencer.user'],
    });
  }

  async findOneWithRelation(segmentId: number) {
    return this.segmentRepository.find({
      where: { id: segmentId },
      relations: ['campaigns', 'campaigns.segments', 'campaigns.influencer', 'campaigns.influencer.user'],
    });
  }
}
