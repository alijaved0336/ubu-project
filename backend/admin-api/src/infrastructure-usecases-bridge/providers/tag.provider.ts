import { TagsUsecase } from '@use-cases/tag.usecase';
import { TagRepository } from '@infrastructure/orm/reposiories/tag.repository';

import UsecaseProxy, { TAG_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function TagsUsecaseProvider() {
  return {
    inject: [TagRepository],
    provide: TAG_USECASE_PROXY,
    useFactory: (tagsRepository: TagRepository) => new UsecaseProxy(new TagsUsecase(tagsRepository)),
  };
}
