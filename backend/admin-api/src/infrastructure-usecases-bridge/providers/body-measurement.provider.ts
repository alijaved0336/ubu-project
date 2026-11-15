import { BodyMeasurementRepository } from '@infrastructure/orm/reposiories/body-measurement.repository';
import { BodyMeasurementUsecase } from '@use-cases/body-measurement.usecase';
import UsecaseProxy, {
  BODY_MEASUREMENT_USE_CASE,
} from 'infrastructure-usecases-bridge/usecase-proxy';

export function BodyMeasurementUsecaseProvider() {
  return {
    inject: [BodyMeasurementRepository],
    provide: BODY_MEASUREMENT_USE_CASE,
    useFactory: (bodyMeasurementRepository: BodyMeasurementRepository) =>
      new UsecaseProxy(new BodyMeasurementUsecase(bodyMeasurementRepository)),
  };
}
