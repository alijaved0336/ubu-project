import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../common/common.dto';
import { Transform } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class PaginationQueryDto extends PaginationDto {
  @ApiProperty({
    name: 'isUserApiLogs',
    required: false,
    type: Boolean,
    description: 'Set to true to filter userApi logs',
    example: true,
  })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isUserApiLogs?: boolean;

  @ApiProperty({
    name: 'search',
    required: false,
  })
  @IsString()
  dateToFind?: string;
}
