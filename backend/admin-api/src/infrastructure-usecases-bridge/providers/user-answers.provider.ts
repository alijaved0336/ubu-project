import { UserAnswerRepository } from '@infrastructure/orm/reposiories/user-answer.repository';
import { QuestionnaireUsecase } from '@use-cases/questionnaire.usecase';
import { UserAnswersUsecase } from '@use-cases/user-answers.usecase';
import UsecaseProxy, {
  QUESTIONNAIRE_USECASE_PROXY,
  USER_ANSWERS_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';

export function UserAnswersUsecaseProvider() {
  return {
    inject: [UserAnswerRepository, QUESTIONNAIRE_USECASE_PROXY],
    provide: USER_ANSWERS_USECASE_PROXY,
    useFactory: (
      userAnswersRepository: UserAnswerRepository,
      questionnaireUseCase: UsecaseProxy<QuestionnaireUsecase>,
    ) =>
      new UsecaseProxy(
        new UserAnswersUsecase(userAnswersRepository, questionnaireUseCase),
      ),
  };
}
