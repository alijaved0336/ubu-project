import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { BodyMeasurementRepository } from '@infrastructure/orm/reposiories/body-measurement.repository';
import { BodyMeasurement } from '@infrastructure/orm/entities/body-measurement.entity';
import { AbstractUsecase } from './abstract.usecase';
import { UpdateBodyMeasurementResponseDto } from '@infrastructure/presentation/body-measurement/body-measurement.dto';

@Injectable()
export class BodyMeasurementUsecase extends AbstractUsecase<BodyMeasurement> {
  constructor(
    private readonly bodyMeasurementRepository: BodyMeasurementRepository,
  ) {
    super(bodyMeasurementRepository);
  }

  async customUpdate(id: number, payload: Partial<BodyMeasurement>): Promise<UpdateBodyMeasurementResponseDto> {
   const updateResult = await this.bodyMeasurementRepository.update({ id }, payload);
   if (updateResult.affected) {
    return { status: HttpStatus.OK, message: "Body measurements updated successfully" }
   }
    throw new NotFoundException(`No body measurement found with ID ${id}`)
  }

  async isUserScanned(measurement_id: number | null) {
    if (!measurement_id) return false;
    const userMeasurements = await this.bodyMeasurementRepository.findOne({ id: measurement_id });
    if (!userMeasurements) {
      return false;
    }

    return userMeasurements.measurements?.length > 30 ? true : false;
  }
}
