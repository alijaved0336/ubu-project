import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BodyMeasurement } from '../entities/body-measurement.entity';

@Injectable()
export class BodyMeasurementRepository {
  constructor(
    @InjectRepository(BodyMeasurement)
    private readonly bodyMeasurementRepository: Repository<BodyMeasurement>,
  ) {}

  async create(payload: Partial<BodyMeasurement>) {
    return this.bodyMeasurementRepository.save(payload);
  }

  async update(id: number, payload: Partial<BodyMeasurement>) {
    return await this.bodyMeasurementRepository.update(id, payload);
  }

  async save(payload: Partial<BodyMeasurement>): Promise<BodyMeasurement> {
    return this.bodyMeasurementRepository.save(payload);
  }

  async getById(id: number): Promise<BodyMeasurement | null> {
    return this.bodyMeasurementRepository.findOne({
      where: { id },
    });
  }
}
