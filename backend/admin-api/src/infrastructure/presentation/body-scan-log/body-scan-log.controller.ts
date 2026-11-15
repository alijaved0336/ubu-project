import { BodyScanLogCountUsecase } from '@use-cases/body-scan-log-count.usecase';
import { BodyScanLogCount } from '@infrastructure/orm/entities/body-scan-log-count.entity';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';

import {
  Controller,
  Get,
  UseGuards,
  ClassSerializerInterceptor,
  Inject,
  UseInterceptors,
  Post,
  Body,
  Put,
  Param,
} from '@nestjs/common';
import UsecaseProxy, {
  BODY_SCAN_LOG_COUNT_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('body_scan_log_count')
@ApiTags('Body Scan Log')
@ApiBearerAuth()
export class BodyScanLogCountController {
  constructor(
    @Inject(BODY_SCAN_LOG_COUNT_USECASE_PROXY)
    private readonly bodyScanUsecaseProxy: UsecaseProxy<BodyScanLogCountUsecase>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new count' })
  @ApiResponse({ status: 201, description: 'Count created successfully.' })
  create(
    @Body() payload: Partial<BodyScanLogCount>,
  ): Promise<any> {
    return this.bodyScanUsecaseProxy
      .getInstance()
      .create(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve count' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved count.' })
  async findAll(
  ): Promise<any> {
    return this.bodyScanUsecaseProxy
      .getInstance()
      .findAll();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update count' })
  @ApiResponse({ status: 200, description: 'Count updated successfully.' })
  update(
    @Param('id') id: string,
    @Body() payload: Partial<BodyScanLogCount>,
  ): Promise<any> {
    return this.bodyScanUsecaseProxy
      .getInstance()
      .update(+id, payload);
  }

}
