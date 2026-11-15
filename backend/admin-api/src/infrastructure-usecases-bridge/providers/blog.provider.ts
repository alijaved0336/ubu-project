import { BlogUsecase } from '@use-cases/blog.usecase';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { BlogRepository } from '@infrastructure/orm/reposiories/blog.repository';
import UsecaseProxy, { BLOG_TAG_USECASE_PROXY, BLOG_USECASE_PROXY, TAG_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { TagsUsecase } from '@use-cases/tag.usecase';
import { BlogTagsUsecase } from '@use-cases/blog-tag.usecase';

export function BlogUseCaseProvider() {
  return {
    inject: [BlogRepository, TAG_USECASE_PROXY, BLOG_TAG_USECASE_PROXY, AwsS3Service],
    provide: BLOG_USECASE_PROXY,
    useFactory: (
      blogRepository: BlogRepository,
      tagsUseCase: UsecaseProxy<TagsUsecase>,
      blogTagsUseCase: UsecaseProxy<BlogTagsUsecase>,
      awsS3Service: AwsS3Service,
    ) => new UsecaseProxy(new BlogUsecase(blogRepository, tagsUseCase, blogTagsUseCase, awsS3Service)),
  };
}
