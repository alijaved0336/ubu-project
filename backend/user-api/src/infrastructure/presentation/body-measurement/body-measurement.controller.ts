import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import UsecaseProxy, {
  BODY_MEASUREMENT_USE_CASE,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BodyMeasurementUsecase } from '@use-cases/body-measurement.usecase';
import {
  BodyMeasurementParamDto,
  CreateBodyMeasurementDto,
} from './body-measurement.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Body Measurement')
@ApiBearerAuth()
@Controller('body_measurement')
export class BodyMeasurementController {
  constructor(
    @Inject(BODY_MEASUREMENT_USE_CASE)
    private readonly bodyMeasurementUsecaseProxy: UsecaseProxy<BodyMeasurementUsecase>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put('/:measurementId')
  @ApiOperation({ summary: 'Update User Measurements' })
  @ApiParam({
    name: 'measurementId',
    description: 'The ID of the measurement record',
  })
  @ApiResponse({
    status: 200,
    description: 'Measurements updated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param() params: BodyMeasurementParamDto,
    @Body() updateBodyMeasurementDto: CreateBodyMeasurementDto,
  ) {
    return this.bodyMeasurementUsecaseProxy
      .getInstance()
      .customUpdate(+params.measurementId, updateBodyMeasurementDto);
  }
}
