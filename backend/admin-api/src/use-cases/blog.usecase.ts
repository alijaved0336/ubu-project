import { DeepPartial } from 'typeorm';
import { Inject } from '@nestjs/common';
import { TagsUsecase } from './tag.usecase';
import { BlogTagsUsecase } from './blog-tag.usecase';
import { AbstractUsecase } from './abstract.usecase';
import { Blogs } from '@infrastructure/orm/entities/blog.entity';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { BlogRepository } from '@infrastructure/orm/reposiories/blog.repository';
import { CreateBlogDto, Tag, UpdateBlogDto } from '@infrastructure/presentation/blog/create-blog.dto';
import UsecaseProxy, { BLOG_TAG_USECASE_PROXY, TAG_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export class BlogUsecase extends AbstractUsecase<any> {
  constructor(
    private blogRepository: BlogRepository,
    @Inject(TAG_USECASE_PROXY)
    private readonly tagsUseCase: UsecaseProxy<TagsUsecase>,
    @Inject(BLOG_TAG_USECASE_PROXY)
    private readonly blogTagsUseCase: UsecaseProxy<BlogTagsUsecase>,
    private awsS3Service: AwsS3Service,
  ) {
    super(blogRepository);
  }
  async customCreate(payload: CreateBlogDto, userId: number, files: Express.Multer.File[]) {
    let allTagIds: number[] = [];

    if (payload.tags) {
      const tags = JSON.parse(payload.tags) as Tag[];
      const newTags: string[] = [];
      const oldTagIds: number[] = [];

      tags.forEach((tag) => {
        if (tag.isNew) {
          newTags.push(tag.label);
        } else {
          oldTagIds.push(parseInt(tag.value, 10));
        }
      });

      const createdTags: number[] = [];
      for (const tagLabel of newTags) {
        const createdTag = await this.tagsUseCase.getInstance().create({
          tagName: tagLabel,
          user: { id: userId },
        });
        createdTags.push(createdTag.id);
      }
      allTagIds = [...oldTagIds, ...createdTags];
    }

    delete payload.tags;

    const blogPayload: DeepPartial<Blogs> = { title: payload.title, description: payload.description, user: { id: userId } };
    let savedBlog = await this.blogRepository.create(blogPayload);

    if (files) {
      const folderName = `blogs/${savedBlog.id}`;
      await this.awsS3Service.createFolder(folderName);
      const s3Response = await this.awsS3Service.uploadMultipleFiles(files, folderName);
      savedBlog.media = s3Response;
      savedBlog = await this.blogRepository.save(savedBlog);
    }

    for (const tagId of allTagIds) {
      await this.blogTagsUseCase.getInstance().create({
        blog: { id: savedBlog.id },
        tag: { id: tagId },
      });
    }
    return savedBlog;
  }

  async customFindAll(page: number = 1, limit: number = 10, search?: string, tags?: number[]) {
    return this.blogRepository.customFindAll(page, limit, search, tags);
  }

  async publicFindAll(page: number = 1, limit: number = 10, search?: string, tags?: number[]) {
    return this.blogRepository.customFindAll(page, limit, search, tags);
  }

  async updateCoverPhoto(userId, id, files: Express.Multer.File[]) {
    const existingBlog = await this.blogRepository.findOne({ id });

    if (!existingBlog) {
      throw new Error(`Blog with ID ${id} not found.`);
    }

    const folderName = `blogs/${id}`;
    if (files) {
      await this.awsS3Service.deleteAllFilesInFolder(folderName);
      await this.awsS3Service.createFolder(folderName);
      const s3Response = await this.awsS3Service.uploadMultipleFiles(files, folderName);
      existingBlog.media = s3Response;
    } else {
      await this.awsS3Service.deleteAllFilesInFolder(folderName);
      existingBlog.media = [];
    }
    await this.blogRepository.update(
      {
        id,
        user: {
          id: userId,
        },
      },
      existingBlog,
    );
    return this.blogRepository.findOne({ id });
  }

  async customUpdate(id: number, updateBlogDto: UpdateBlogDto, userId: number, files: Express.Multer.File[]) {
    const folderName = `blogs/${id}`;
    if (files.length) {
      await this.awsS3Service.deleteAllFilesInFolder(folderName);
      await this.awsS3Service.createFolder(folderName);
      const s3Response = await this.awsS3Service.uploadMultipleFiles(files, folderName);
      updateBlogDto.media = s3Response;
    } else {
      if (!updateBlogDto.urls) {
        await this.awsS3Service.deleteAllFilesInFolder(folderName);
        updateBlogDto.media = [];
      }
    }

    let allTagIds: number[] = [];
    if (updateBlogDto.tags) {
      const tags = JSON.parse(updateBlogDto.tags) as Tag[]; //imp
      const newTags: string[] = [];
      const oldTagIds: number[] = [];

      tags.forEach((tag) => {
        if (tag.isNew) {
          newTags.push(tag.label);
        } else {
          oldTagIds.push(parseInt(tag.value, 10));
        }
      });

      const createdTags: number[] = [];
      for (const tagLabel of newTags) {
        const createdTag = await this.tagsUseCase.getInstance().create({
          tagName: tagLabel,
          user: { id: userId },
        });
        createdTags.push(createdTag.id);
      }
      allTagIds = [...oldTagIds, ...createdTags];
    }
    delete updateBlogDto.tags;
    delete updateBlogDto.urls;

    const blogPayload: DeepPartial<Blogs> = {
      title: updateBlogDto.title,
      description: updateBlogDto.description,
      media: updateBlogDto.media,
      user: { id: userId },
    };
    const updatedBlog = await this.blogRepository.update(
      {
        id,
        user: {
          id: userId,
        },
      },
      blogPayload,
    );

    await this.blogTagsUseCase.getInstance().delete({ blog: { id } });

    for (const tagId of allTagIds) {
      await this.blogTagsUseCase.getInstance().create({
        blog: { id },
        tag: { id: tagId },
      });
    }
    return updatedBlog;
  }

  async customRemove(id: number) {
    const folderName = `blogs/${id}`;
    await this.awsS3Service.deleteAllFilesInFolder(folderName);
    return await this.blogRepository.remove(id);
  }
}
