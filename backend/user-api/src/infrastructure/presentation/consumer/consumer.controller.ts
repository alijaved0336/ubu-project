import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import UsecaseProxy, {
  CONSUMER_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import { ConsumerUsecase } from '@use-cases/consumer.usecase';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { CreateScanDto, UpdateConsumerDto } from './consumer.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('consumer')
@ApiBearerAuth()
@Controller('consumer')
export class ConsumerController {
  constructor(
    @Inject(CONSUMER_USECASE_PROXY)
    private readonly consumerUsecaseProxy: UsecaseProxy<ConsumerUsecase>,
  ) {}

  @Get('/debug-sentry')
  getError() {
    throw new Error('My first Sentry error!');
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update consumer data' })
  @ApiResponse({
    status: 200,
    description: 'The consumer data has been successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid data provided.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid token.' })
  @ApiBody({
    description:
      'Data to update the consumer. The only allowed field here is gender.',
    type: UpdateConsumerDto,
  })
  @Patch('')
  async updateCustomer(
    @Req() request,
    @Body() updateConsumerDto: UpdateConsumerDto,
  ) {
    return this.consumerUsecaseProxy
      .getInstance()
      .updateById(updateConsumerDto, request.user?.consumer?.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the current consumer data' })
  @ApiResponse({ status: 200, description: 'The current consumer data' })
  @Get('')
  async getConsumer(@Req() request) {
    return this.consumerUsecaseProxy
      .getInstance()
      .getByIdOld(request.user?.consumer?.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the current consumer data' })
  @ApiResponse({ status: 200, description: 'The current consumer data' })
  @Get('/info')
  async getShopper(@Req() request) {
    return this.consumerUsecaseProxy
      .getInstance()
      .getById(request.user?.consumer?.id);
  }
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Save measurements by scan ID' })
  @ApiParam({ name: 'scan_id', description: 'ID of the scan', type: String })
  @ApiResponse({ status: 200, description: 'Measurements saved successfully' })
  @Post('/scan/:scan_id')
  async saveMeasurments(@Param('scan_id') scan_id: string, @Req() request) {
    return this.consumerUsecaseProxy
      .getInstance()
      .saveMeasurments(scan_id, request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/recommendation')
  async influencerRecommendation(
    @Req() request,
    @Query('isHeight') isHeight: string,
    @Query('isShape') isShape: string,
    @Query('isStyle') isStyle: string,
    @Query('isBudget') isBudget: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const filters = {
      isHeight: isHeight === 'true',
      isShape: isShape === 'true',
      isStyle: isStyle === 'true',
      isBudget: isBudget === 'true',
    };
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.consumerUsecaseProxy
      .getInstance()
      .influencerRecommendation(request.user, filters, pageNumber, limitNumber);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove My Account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @Delete('/remove-my-account')
  async removeMyAccount(@Request() req) {
    const userId = req.user.id;
    return this.consumerUsecaseProxy.getInstance().removeMyAccount(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark a post as favorite' })
  @ApiParam({ name: 'post_id', description: 'ID of the post', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Post marked as favorite successfully',
  })
  @Get('/post/mark-post-fav/:post_id')
  async markPostFavourite(
    @Param('post_id', ParseIntPipe) postId: number,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.consumerUsecaseProxy
      .getInstance()
      .markPostFavourite(postId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all favorite posts' })
  @ApiResponse({ status: 200, description: 'List of favorite posts' })
  @Get('/post/list')
  async listPostFavourite(@Request() req) {
    const userId = req.user.id;
    return this.consumerUsecaseProxy.getInstance().listPostFavorite(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark a post as unfavorite' })
  @ApiParam({ name: 'post_id', description: 'ID of the post', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Post marked as unfavorite successfully',
  })
  @Get('/post/mark-post-unfav/:post_id')
  async markPostUnFavourite(
    @Param('post_id', ParseIntPipe) postId: number,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.consumerUsecaseProxy
      .getInstance()
      .markPostUnFavorite(postId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Save measurements ' })
  @ApiResponse({ status: 200, description: 'Measurements saved successfully' })
  @ApiBody({
    description: 'The scan measurements payload',
    type: CreateScanDto,
  })
  @Post('/manual_bm')
  async saveMeasurmentsManually(@Body() createScanDto: CreateScanDto, @Req() request) {
    return this.consumerUsecaseProxy
      .getInstance()
      .ManualConsumerMeasurement(createScanDto, request.user);
  }
}
