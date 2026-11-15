import { TemplateRepository } from '@infrastructure/orm/reposiories/template.repository';
import { TemplateUsecase } from '@use-cases/template.usecase';
import UsecaseProxy, { TEMPLATE_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function TemplateUsecaseProvider() {
  return {
    inject: [TemplateRepository],
    provide: TEMPLATE_USECASE_PROXY,
    useFactory: (templateRepository: TemplateRepository) => new UsecaseProxy(new TemplateUsecase(templateRepository)),
  };
}
