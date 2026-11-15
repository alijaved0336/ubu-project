import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Request,
  UseGuards,
  UseInterceptors,
  Put,
  Post,
  Req,
  Get,
} from '@nestjs/common';

import UsecaseProxy, {
  USER_ANSWERS_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserAnswersUsecase } from '@use-cases/user-answers.usecase';
import { UserSelectionDTO } from '../quesionnaire/questionnaire.dto';
import { SurveysDto } from './user-answers.dto';
import { UserType } from '@infrastructure/orm/entities/questionnaire.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user_answers')
@ApiTags('User Answers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserAnswersController {
  constructor(
    @Inject(USER_ANSWERS_USECASE_PROXY)
    private readonly userAnswersUseCaseProxy: UsecaseProxy<UserAnswersUsecase>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Submit user answers to the questionnaire' })
  @ApiResponse({ status: 201, description: 'Answers submitted successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async userSelection(@Body() payload: UserSelectionDTO, @Req() request) {
    return this.userAnswersUseCaseProxy
      .getInstance()
      .submitUserAnswers(request.user, payload.answers);
  }

  @Put()
  @ApiOperation({ summary: 'Edit survey' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async editInfluencerSurvey(
    @Request() req: any,
    @Body() userAnswersDto: UserSelectionDTO,
  ) {
    return this.userAnswersUseCaseProxy
      .getInstance()
      .handleUserAnswers(userAnswersDto.answers, req.user);
  }
}
