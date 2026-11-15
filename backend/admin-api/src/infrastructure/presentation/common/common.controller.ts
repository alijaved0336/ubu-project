import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseBoolPipe,
  Post,
  Query,
  Req,
  Request,
  UnprocessableEntityException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import UsecaseProxy, { COMMON_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { CommonUsecase } from '@use-cases/common.usecase';
import { UserType } from '@infrastructure/orm/entities/questionnaire.entity';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateContactUs, SubsciberMailDto, SubsciberPhoneDto } from './common.dto';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';

const ProductAdvertisingAPIv1 = require('paapi5-nodejs-sdk');

@UseInterceptors(ClassSerializerInterceptor)
@Controller('')
@ApiTags('common')
@ApiBearerAuth()
export class CommonController {
  constructor(
    @Inject(COMMON_USECASE_PROXY)
    private readonly commonUsecaseProxy: UsecaseProxy<CommonUsecase>,
  ) {}

  @Get('/debug-sentry')
  getError() {
    throw new Error('My first Sentry error!');
  }

  @Get('/categories/findAll')
  findAllCategories() {
    return this.commonUsecaseProxy.getInstance().findAllCategories();
  }

  @Get('/style/findAll')
  findAllStyles() {
    return this.commonUsecaseProxy.getInstance().findAllStyles();
  }

  @Get('/sub_category/find_by_category_and_gender')
  findByGenderAndCategory(@Query('categoryId') categoryId: number, @Query('genderId') genderId: number) {
    return this.commonUsecaseProxy.getInstance().findSubCategoryByGenderAndCategory(categoryId, genderId);
  }

  @Get('/sizes/by_sub_category')
  findSizesBySubCategory(@Query('subCategoryId') subCategoryId: number) {
    return this.commonUsecaseProxy.getInstance().findSizesBySubCategory(subCategoryId);
  }

  @Get('/gender/findAll')
  findAllGenders() {
    return this.commonUsecaseProxy.getInstance().findAllGenders();
  }

  @Get('/sub_category/:id/required-columns')
  findSubCategory(@Param('id') id: string) {
    return this.commonUsecaseProxy.getInstance().findSubCategory(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/questionnaire/influencer')
  async findAllInfluencerQuestions(@Req() request, @Query('all', new DefaultValuePipe(false), ParseBoolPipe) all: boolean) {
    return this.commonUsecaseProxy.getInstance().getAllInfluencerQuestionnaire(request.user.id, all);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/questionnaire/:user_type')
  async findAllQuestions(@Param('user_type') user_type: UserType, @Req() request) {
    return this.commonUsecaseProxy.getInstance().getAllQuestionnaire(user_type, request.user.id);
  }

  @HttpCode(200)
  @Post('/contact-us')
  async createContactUs(@Body() payload: CreateContactUs) {
    return this.commonUsecaseProxy.getInstance().createContactUs(payload);
  }

  @HttpCode(200)
  @Post('/capture-email')
  async createCaptureEmail(@Body() email: string) {
    return this.commonUsecaseProxy.getInstance().createCaptureEmail(email);
  }

  @Get('influencer-media/:id')
  async getInfluencerMedia(@Param('id') id: number, @Query('source') source: string) {
    return this.commonUsecaseProxy.getInstance().getInfluencerMedia(id, source);
  }

  @ApiOperation({ summary: 'Send an email to a subscriber' })
  @ApiBody({
    description: 'Details for sending an email to a subscriber.',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', example: 'example@domain.com', nullable: true },
        page: { type: 'string', enum: ['landing', 'ios'], example: 'landing' },
        // phoneNumber: { type: 'string', example: '+1234567890', nullable: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Email sent successfully to the subscriber.',
  })
  @ApiResponse({
    status: 422,
    description: 'Unprocessable Entity. Either email or phone number must be provided.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input data.',
  })
  @Post('send-email-to-subscriber')
  async sendEmail(@Body() sendEmailDto: SubsciberMailDto): Promise<any> {
    const email = sendEmailDto.email || '';

    if (!email) {
      throw new UnprocessableEntityException('Either email or phone must be provided');
    }

    return await this.commonUsecaseProxy.getInstance().sendAndSaveEmailToSubscriber(sendEmailDto.email, sendEmailDto.page);
  }

  @Post('send-message-to-subscriber')
  @ApiOperation({ summary: 'Send a message to a subscriber' })
  @ApiBody({
    description: 'The details of the subscriber',
    schema: {
      type: 'object',
      properties: {
        phone_number: { type: 'string', example: '+1234567890' },
        page: { type: 'string', enum: ['landing', 'ios'], example: 'landing' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully to the subscriber.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input.',
  })
  async sendMessage(@Body() sendMessageDto: SubsciberPhoneDto): Promise<any> {
    return await this.commonUsecaseProxy.getInstance().sendAndSavePhoneToSubscriber(sendMessageDto.phone_number, sendMessageDto.page);
  }

  @Get('/affliate-products')
  @ApiOperation({ summary: 'Retrieve all products for amazon affilaite' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all products.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term (optional)',
  })
  findAll(@Request() req: any, @Query('page') page: string, @Query('limit') limit: string, @Query('search') search?: string) {
    console.log('Pagess are  :::: ', page, limit);
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    return this.commonUsecaseProxy.getInstance().findAllProducts(pageNumber, limitNumber, search);
  }

  @ApiResponse({ status: 200, description: '' })
  @UseGuards(JwtAuthGuard)
  @Get('/signup-users')
  async SignupUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('search') search: string = '', req: any) {
    return await this.commonUsecaseProxy.getInstance().SignupUsers(page, limit, search);
  }

  @ApiResponse({ status: 200, description: '' })
  @UseGuards(JwtAuthGuard)
  @Get('/subscribed-users')
  async SubscribedUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('search') search: string = '', req: any) {
    return await this.commonUsecaseProxy.getInstance().SubscribedUsers(page, limit, search);
  }
}
