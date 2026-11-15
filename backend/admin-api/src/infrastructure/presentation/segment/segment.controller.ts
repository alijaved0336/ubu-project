import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SegmentUsecase } from '@use-cases/segment.usecase';
import UsecaseProxy, { SEGMENT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { CreateSegmentDto, MarkAsCandidateDTO, UpdateSegmentDto } from './segment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('segments')
@ApiTags('segments')
@ApiBearerAuth()
export class SegmentController {
  constructor(
    @Inject(SEGMENT_USECASE_PROXY)
    private readonly segmentUsecaseProxy: UsecaseProxy<SegmentUsecase>,
  ) {}

  @Post()
  async create(@Request() req: any, @Body() createSegmentDto: CreateSegmentDto) {
    return this.segmentUsecaseProxy.getInstance().create(createSegmentDto, req.user.id);
  }

  @Put(':id')
  async update(@Request() req: any, @Body() updateSegmentDto: UpdateSegmentDto, @Param('id') id: number) {
    return this.segmentUsecaseProxy.getInstance().update(id, updateSegmentDto);
  }

  @Get()
  async findAll(@Request() req: any, @Query('page') page: string, @Query('limit') limit: string, @Query('search') search?: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 3;
    return this.segmentUsecaseProxy.getInstance().findAll(req.user.id, pageNumber, limitNumber, search);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.segmentUsecaseProxy.getInstance().remove(id);
  }

  @Get(':id/get_influencers')
  getInfluencers(@Param('id') id: number, @Query('page') page: string, @Query('limit') limit: string, @Query('search') search?: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 3;
    return this.segmentUsecaseProxy.getInstance().getInfluencers(id, pageNumber, limitNumber, search);
  }

  // @UseGuards(SubscriptionGuard)
  // @RequiresPlan(PlanType.PROFESSIONAL, PlanType.BASIC, PlanType.ENTERPRISE)
  @Get(':id/get_ai_influencers')
  getAIInfluencers(@Param('id') id: number, @Query('page') page: string, @Query('limit') limit: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 3;

    return this.segmentUsecaseProxy.getInstance().getAIInfluencers(id, pageNumber, limitNumber);
  }

  @Get(':id/segment_data')
  getSegmentData(@Param('id') id: number) {
    return this.segmentUsecaseProxy.getInstance().getSegmentData(id);
  }

  @Get('/summary')
  getSummary(@Request() req: any, @Query('specificStatusRequired') specificStatusRequired?: string) {
    return this.segmentUsecaseProxy.getInstance().getSummary(req.user.id, null, specificStatusRequired);
  }

  @Get('/segment_summary/:id')
  getSegmentSummary(@Request() req: any, @Param('id') id: number, @Query('specificStatusRequired') specificStatusRequired?: string) {
    return this.segmentUsecaseProxy.getInstance().getSummary(req.user.id, id, specificStatusRequired);
  }

  @Post(`:id/mark_candidate`)
  markCandidate(@Param('id') id: number, @Body() params: MarkAsCandidateDTO) {
    return this.segmentUsecaseProxy.getInstance().markCandidate(id, params);
  }

  @Get(`:id/get_record`)
  getRecord(@Param('id') id: number) {
    return this.segmentUsecaseProxy.getInstance().getRecord(id);
  }
}
