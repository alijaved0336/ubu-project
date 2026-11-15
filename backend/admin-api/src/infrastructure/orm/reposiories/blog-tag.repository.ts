import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogTags } from '../entities/blog-tag.entity';
import { IBlogTagRepository } from '@domain/repository/blog-tag.repository.interface';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class BlogTagRepository extends AbstractRepository<BlogTags> implements IBlogTagRepository {
  constructor(
    @InjectRepository(BlogTags)
    readonly blogTagRepository: Repository<BlogTags>,
  ) {
    super(blogTagRepository);
  }
}
