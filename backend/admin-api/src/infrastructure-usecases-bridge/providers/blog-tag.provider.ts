import { BlogTagsUsecase } from '@use-cases/blog-tag.usecase';
import { BlogTagRepository } from '@infrastructure/orm/reposiories/blog-tag.repository';

import UsecaseProxy, { BLOG_TAG_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function BlogTagsUsecaseProvider() {
  return {
    inject: [BlogTagRepository],
    provide: BLOG_TAG_USECASE_PROXY,
    useFactory: (blogTagsRepository: BlogTagRepository) => new UsecaseProxy(new BlogTagsUsecase(blogTagsRepository)),
  };
}
