import { IBrandRepository } from '@domain/repository/brand.repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Brands } from '../entities/brand.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class BrandRepository implements IBrandRepository {
  constructor(
    @InjectRepository(Brands)
    private readonly brandRepository: Repository<Brands>,
    private readonly productRepository: ProductRepository,
  ) {}

  async brandProducts(id: number): Promise<Brands | null> {
    return this.brandRepository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async create(payload: Partial<Brands>): Promise<Brands> {
    const created_brand = this.brandRepository.create(payload);

    return (await this.brandRepository.save(created_brand)) && created_brand;
  }

  async findByUserId(id: number): Promise<Brands | null> {
    return await this.brandRepository.findOne({
      where: { user: { id } },
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Brands | null> {
    return await this.brandRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });
  }

  async findBrandReviewsByBrandId(id: number): Promise<Brands | null> {
    return await this.brandRepository.findOne({
      where: { id },
      relations: ['reviewsReceived', 'reviewsReceived.reviewerInfluencer', 'reviewsReceived.reviewerInfluencer.user'],
    });
  }

  async findAllWithAnswers(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    let whereCondition = {} as any;
    if (search) {
      whereCondition = [{ brand_name: ILike(`%${search}%`) }];
    }
    const [brands, total] = await this.brandRepository.findAndCount({
      where: whereCondition,
      relations: ['user.user_answer.question'], // Ensure that 'user' and 'user_answers' relations are loaded
      skip: skip,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });
    return { brands, total };
  }

  async findFilteredWithAnswers(filters) {
    const query = this.brandRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.user', 'user')
      .leftJoinAndSelect('user.user_answer', 'user_answers')
      .leftJoinAndSelect('user_answers.question', 'question');

    // Loop through filters to build a query
    Object.entries(filters).forEach(([questionId, selectedOption]) => {
      query.andWhere('user_answers.question_id = :questionId AND :selectedOption = ANY(user_answers.selected_options)', {
        questionId: questionId,
        selectedOption: Array.isArray(selectedOption) ? selectedOption[0] : selectedOption,
      });
    });
    const brands = await query.getMany();
    return brands;
  }

  async deleteBrandPartially(brandId: number): Promise<number> {
    try {
      const deletedBrandProducts = await this.productRepository.deleteProductsByBrandId(brandId);
      return deletedBrandProducts;
    } catch (error) {
      throw new Error(`Failed to delete brand partially: ${error.message}`);
    }
  }

  async updateColumn(id: number, updateData: Partial<Brands>): Promise<void> {
    await this.brandRepository.update(id, updateData);
  }
}
