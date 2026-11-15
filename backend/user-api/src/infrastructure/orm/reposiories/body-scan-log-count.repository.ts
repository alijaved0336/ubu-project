import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { BodyScanLogCount } from '../entities/body-scan-log-count.entity';

@Injectable()
export class BodyScanLogCountRepository {
  constructor(
    @InjectRepository(BodyScanLogCount)
    private readonly bodyScanLogCountRepository: Repository<BodyScanLogCount>,
  ) {}

  async create(data: Partial<BodyScanLogCount>): Promise<BodyScanLogCount> {
    const newPost = this.bodyScanLogCountRepository.create(data);
    return await this.bodyScanLogCountRepository.save(newPost);
  }

  async findAll(): Promise<BodyScanLogCount[]> {
    return await this.bodyScanLogCountRepository.find();
  }

  async update(
    id: number,
    data: Partial<BodyScanLogCount>,
  ): Promise<UpdateResult> {
    return this.bodyScanLogCountRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.bodyScanLogCountRepository.delete(id);
  }
}
