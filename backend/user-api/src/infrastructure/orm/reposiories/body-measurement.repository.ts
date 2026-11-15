import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BodyMeasurement } from '../entities/body-measurement.entity';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class BodyMeasurementRepository extends AbstractRepository<BodyMeasurement> {
  constructor(
    @InjectRepository(BodyMeasurement)
    readonly bodyMeasurementRepository: Repository<BodyMeasurement>,
  ) {
    super(bodyMeasurementRepository);
  }
}
