import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class BodyMeasurementItemDto {
  @ApiProperty({ example: 'waistGirth' })
  @IsString()
  name: string;

  @ApiProperty({ example: 823 })
  @IsNumber()
  value: number;

  @ApiProperty({ example: 'mm' })
  @IsString()
  unit: string;
}

export class CreateBodyMeasurementDto {
  @ApiProperty({
    description: 'List of detailed measurements',
    type: [BodyMeasurementItemDto],
    example: [
      { name: 'waistGirth', value: 823, unit: 'mm' },
      { name: 'hipGirth', value: 952, unit: 'mm' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BodyMeasurementItemDto)
  measurements: BodyMeasurementItemDto[];
}

export class BodyMeasurementParamDto {
  @ApiProperty({
    description: 'The ID of the measurement record',
    example: '1312',
  })
  @IsString()
  measurementId: string;
}

export class UpdateBodyMeasurementResponseDto {
  @ApiProperty({ example: 200, description: 'HTTP status code' })
  status: number;

  @ApiProperty({ example: 'Body measurements updated successfully', description: 'Result message' })
  message: string;
}