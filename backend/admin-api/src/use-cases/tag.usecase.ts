import { TagRepository } from '@infrastructure/orm/reposiories/tag.repository';

import { AbstractUsecase } from './abstract.usecase';

export class TagsUsecase extends AbstractUsecase<any> {
  constructor(tagsRepository: TagRepository) {
    super(tagsRepository);
  }
}
