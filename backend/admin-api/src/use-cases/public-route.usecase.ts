import { UserType } from '@infrastructure/orm/entities/questionnaire.entity';
import { QuestionnaireRepository } from '@infrastructure/orm/reposiories/questionnaire.repository';

export class PublicRouteUsecase {
  constructor(private questionRepository: QuestionnaireRepository) {}

  async findAll() {
    return this.questionRepository.getAllQuestions(UserType.BRAND);
  }
}
