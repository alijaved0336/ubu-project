import { Injectable } from '@nestjs/common';
import { BodyMeasurementRepository } from '@infrastructure/orm/reposiories/body-measurement.repository';
import { BodyMeasurement } from '@infrastructure/orm/entities/body-measurement.entity';

@Injectable()
export class BodyMeasurementUsecase {
  constructor(
    private readonly bodyMeasurementRepository: BodyMeasurementRepository,
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
    return this.bodyMeasurementRepository.getById(id);
  }

  async isUserScanned(measurement_id: number | null) {
    if (!measurement_id) return false;
    const userMeasurements = await this.getById(measurement_id);
    console.log(userMeasurements, "USER MEASUREMENRNT");
    if (!userMeasurements) {
      return false;
    }

    console.log(userMeasurements.measurements?.length > 30 ? true : false, "userMeasurements.measurements?.length > 30 ? true : false");

    return userMeasurements.measurements?.length > 30 ? true : false;
  }
}
