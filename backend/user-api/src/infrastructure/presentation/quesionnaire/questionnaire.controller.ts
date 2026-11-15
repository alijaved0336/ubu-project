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
  AUTH_USECASE_PROXY,
  CONSUMER_USECASE_PROXY,
  POST_USECASE_PROXY,
  QUESTIONNAIRE_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { QuestionnaireUsecase } from '@use-cases/questionnaire.usecase';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiProperty,
  ApiQuery,
} from '@nestjs/swagger';
import { DropdownOptionsQueryDto, UserSelectionDTO } from './questionnaire.dto';
import { UserType } from '@infrastructure/orm/entities/questionnaire.entity';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('questionnaires')
@ApiBearerAuth()
@Controller('questionnaires')
export class QuestionnaireController {
  constructor(
    @Inject(QUESTIONNAIRE_USECASE_PROXY)
    private readonly questionnaireUsecaseProxy: UsecaseProxy<QuestionnaireUsecase>,
  ) { }

  @Post('answer')
  @ApiOperation({ summary: 'Submit user answers to the questionnaire' })
  @ApiResponse({ status: 201, description: 'Answers submitted successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async userSelection(
    @Body() payload: UserSelectionDTO,
    @Req() request
  ) {
    return this.questionnaireUsecaseProxy.getInstance().questionnaireSubmit(request.user.id, payload.answers);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get consumer questionnaires' })
  @ApiQuery({
    name: 'all',
    required: false,
    type: Boolean,
    description: 'If true, return all consumers’ questionnaires; otherwise, only the authenticated user’s',
  })
  @ApiResponse({
    status: 200,
    description: 'List of questionnaires retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getConsumerQuestionnaires(
    @Req() request,
    @Query('all', new DefaultValuePipe(false), ParseBoolPipe) all: boolean,
  ) {
    const userId = request.user.id;
    return this.questionnaireUsecaseProxy.getInstance().findAll(userId, all);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dropdown_options_for_consumer')
  @ApiOperation({ summary: 'Get all dropdown options' })
  @ApiResponse({
    status: 200,
    description: 'List of questionnaires dropdown values',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDropdownoptionsforConsumerProfile(@Req() req) {
    const id = req.user.id
    return this.questionnaireUsecaseProxy
      .getInstance()
      .getDropdownoptionsforConsumerProfile(id);
  }
}
