import { UserAnswersUsecase } from '@use-cases/user-answers.usecase';
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
import { userAnswersDTO } from './user-answers.dto';
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

  @Put('influencer')
  @ApiOperation({ summary: 'Edit influencer survey' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async editInfluencerSurvey(
    @Request() req: any,
    @Body() userAnswersDto: userAnswersDTO,
  ) {
    return this.userAnswersUseCaseProxy
      .getInstance()
      .handleUserAnswers(userAnswersDto.influencerAdditionalDto, req.user);
  }

  @Put('brand')
  @ApiOperation({ summary: 'Edit brand survey' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async editBrandSurvey(
    @Request() req: any,
    @Body() userAnswersDto: userAnswersDTO,
  ) {
    return this.userAnswersUseCaseProxy
      .getInstance()
      .handleUserAnswers(userAnswersDto.additionalFields, req.user);
  }
}
