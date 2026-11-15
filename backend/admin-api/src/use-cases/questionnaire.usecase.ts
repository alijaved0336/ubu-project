import { UserType } from '@infrastructure/orm/entities/questionnaire.entity';
import { QuestionnaireRepository } from '@infrastructure/orm/reposiories/questionnaire.repository';

export class QuestionnaireUsecase {
  constructor(private questionnaireRepository: QuestionnaireRepository) {}

  async findAllQuestionnaires(userTypes: UserType[]) {
    return this.questionnaireRepository.findAllQuestionnaires(userTypes);
  }

  async isSurveyDoneForCurrentUserType(userId: number, userType: UserType) {
    const userQuestionsAnswers = await this.questionnaireRepository.getAllQuestionnaire(userId, userType, true);
    const hasUnansweredRequiredQuestion = userQuestionsAnswers.some(
      (question) => !question.is_optional && (!question.user_answer || question.user_answer.length === 0),
    );
    return !hasUnansweredRequiredQuestion;
  }

  async findAllQuestionnairesWithAnswersForUser(userId: number, userType: UserType) {
    return await this.questionnaireRepository.findAllQuestionnairesWithAnswersForUser(userId, userType);
  }

  async findQuestionnairesBasedOnSrNo(srNos: number[]) {
    return this.questionnaireRepository.findQuestionnairesBasedOnSrNo(srNos);
  }
}
