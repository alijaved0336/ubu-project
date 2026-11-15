import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, UpdateResult } from 'typeorm';
import { Posts } from '../entities/post.entity';
import { Influencers } from '../entities/influencer.entity';
import { Products } from '../entities/product.entity';
import { IPostRepository } from '@domain/repository/post.repository.interface';

@Injectable()
export class PostRepository implements IPostRepository {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
    @InjectRepository(Influencers)
    private readonly influencerRepository: Repository<Influencers>,
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
  ) {}

  async create(data: Partial<Posts>): Promise<Posts> {
    const newPost = this.postRepository.create(data);
    // newPost.influencer = infuencer;
    return await this.postRepository.save(newPost);
  }

  async savePost(createdPost: Partial<Posts>): Promise<Posts> {
    return await this.postRepository.save(createdPost);
  }

  async findAllWithPagination(
    influencerId: number,
    page: number,
    limit: number,
    search?: string,
    status: string = 'All', // Default to 'Published'
  ) {
    const skip = (page - 1) * limit;

    // Dynamic where condition
    const where = {
      influencer: { id: influencerId },
      ...(status && status !== 'All' ? { status } : {}),
      ...(search ? { title: ILike(`%${search}%`) } : {}),
    };

    // Handle 'All' status for filtering both Published and Draft
    const conditions =
      status === 'All'
        ? [
            { ...where, status: 'Published' },
            { ...where, status: 'Draft' },
          ]
        : where;

    console.log('Final whereCondition:', conditions);

    // Fetch posts with pagination
    const [posts, total] = await this.postRepository.findAndCount({
      where: conditions,
      skip,
      take: limit,
      relations: ['influencer', 'postProduct.product', 'affiliateProducts'],
      order: { created_at: 'DESC' },
    });

    return { posts, total };
  }

  // async getAllPosts() {
  //   // Fetch All Posts
  //   const [posts, total] = await this.postRepository.findAndCount({
  //     select: ["media", "id"],
  //     order: { created_at: 'DESC' },
  //   });

  //   return  posts;
  // }

  async findOneWithoutRelation(id: number): Promise<Posts | null> {
    return await this.postRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Posts>): Promise<UpdateResult> {
    return this.postRepository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }

  async deletePostsByInfluencerId(influencerId: number): Promise<number> {
    const deleteResult = await this.postRepository.delete({
      influencer: { id: influencerId },
    });

    return deleteResult.affected || 0;
  }

  async findOneWithRelation(id: number): Promise<Posts | null> {
    return await this.postRepository.findOne({
      where: { id },
      relations: ['influencer', 'postProduct.product', 'affiliateProducts'],
    });
  }

  async findAllWithImages(): Promise<Posts[] | null> {
    return await this.postRepository.find({
      select: ['media', 'id'],
    });
  }

  async findUrlByInfluencerId(influencerId: number) {
    return await this.postRepository.find({
      where: { influencer: { id: influencerId } },
      select: ['media'],
    });
  }
}
