import { Questionnaires, UserType } from '@infrastructure/orm/entities/questionnaire.entity';
import { User } from '@infrastructure/orm/entities/user.entity';
import { QuestionnaireRepository } from '@infrastructure/orm/reposiories/questionnaire.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Command } from 'nestjs-command';
import { Repository } from 'typeorm';
import { influencer_questions } from './influencer-questionnaire';
import { segment_questions } from './segment-questionnaire';

@Injectable()
export class PopulateQuestionnaire {
  logger = new Logger(PopulateQuestionnaire.name);
  constructor(private readonly questionnaireRepository: QuestionnaireRepository) {}

  @Command({
    command: 'populate-questionnaire',
    describe: 'populateing questionnaires',
  })
  async populate() {
    await this.questionnaireRepository.insert(influencer_questions);
    // await this.questionnaireRepository.insert(segment_questions)
    this.logger.log('-------------------questionnaires populated-------------');
  }
}
