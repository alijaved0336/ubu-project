import { QuestionnaireRepository } from '@infrastructure/orm/reposiories/questionnaire.repository';
import { QuestionnaireUsecase } from '@use-cases/questionnaire.usecase';
import UsecaseProxy, {
  QUESTIONNAIRE_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';

export function QuestionnaireUsecaseProvider() {
  return {
    inject: [QuestionnaireRepository],
    provide: QUESTIONNAIRE_USECASE_PROXY,
    useFactory: (questionnaireRepository: QuestionnaireRepository) =>
      new UsecaseProxy(new QuestionnaireUsecase(questionnaireRepository)),
  };
}
