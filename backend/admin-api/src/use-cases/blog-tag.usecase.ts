import { BlogTagRepository } from '@infrastructure/orm/reposiories/blog-tag.repository';

import { AbstractUsecase } from './abstract.usecase';

export class BlogTagsUsecase extends AbstractUsecase<any> {
  constructor(blogTagsRepository: BlogTagRepository) {
    super(blogTagsRepository);
  }
}
