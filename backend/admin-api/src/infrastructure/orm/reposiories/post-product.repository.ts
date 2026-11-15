import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PostProducts } from '../entities/post-product.entity';
import { IPostProductRepository } from '@domain/repository/post-product.repository.interface';
import { Posts } from '../entities/post.entity';
import { Products } from '../entities/product.entity';

@Injectable()
export class PostProductsRepository implements IPostProductRepository {
  constructor(
    @InjectRepository(PostProducts)
    private readonly postProductRepository: Repository<PostProducts>,
  ) {}

  async create(payload: Partial<PostProducts>) {
    // Create an instance of the entity
    const created_data = this.postProductRepository.create(payload);

    // Save the created entity to the database
    return await this.postProductRepository.save(created_data);
  }
  async findOne(id: number): Promise<PostProducts | null> {
    return await this.postProductRepository.findOne({ where: { id } });
  }

  async findByPostAndProduct(post: Posts, product: Products): Promise<Partial<PostProducts> | null> {
    return await this.postProductRepository.findOne({
      where: { post: post, product: product },
    });
  }

  async findByPost(post: Posts): Promise<PostProducts | null> {
    return await this.postProductRepository.findOne({ where: { post: post } });
  }

  async update(postProduct: PostProducts, data: any): Promise<UpdateResult | undefined> {
    return this.postProductRepository.update(postProduct.id, data);
  }

  async deleteByPostId(id: number): Promise<void> {
    await this.postProductRepository.delete({ post: { id: id } });
  }
}
