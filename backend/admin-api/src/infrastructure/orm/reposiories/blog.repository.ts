import { Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { Blogs } from '../entities/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class BlogRepository extends AbstractRepository<Blogs> {
  constructor(
    @InjectRepository(Blogs)
    private readonly blogRepository: Repository<Blogs>,
  ) {
    super(blogRepository);
  }

  async customFindAll(page: number, limit: number, search?: string, tags?: number[]) {
    if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be positive integers');
    }

    const offset = (page - 1) * limit;
    try {
      const query = this.blogRepository
        .createQueryBuilder('blog')
        .innerJoinAndSelect('blog.user', 'user')
        .leftJoinAndSelect('blog.blogTags', 'blogTags')
        .leftJoinAndSelect('blogTags.tag', 'tag')
        .andWhere(
          new Brackets((qb) => {
            if (search) {
              qb.where('blog.title LIKE :search', {
                search: `%${search}%`,
              }).orWhere('blog.description LIKE :search', {
                search: `%${search}%`,
              });
            }
          }),
        );

      if (tags && tags.length > 0) {
        query.andWhere('tag.id IN (:...tags)', { tags });
      }

      const blogsQuery = query.orderBy('blog.created_at', 'DESC').skip(offset).take(limit);

      const [blogs, total] = await blogsQuery.getManyAndCount();

      return {
        success: true,
        message: 'Blogs fetched successfully',
        data: blogs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Failed to fetch blogs: ${error.message}`);
    }
  }
}
