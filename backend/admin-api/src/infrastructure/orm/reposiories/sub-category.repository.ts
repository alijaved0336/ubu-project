import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISubCategoryRepository } from '@domain/repository/sub-category.repository.interface';
import { SubCategory } from '../entities/sub-category.entity';

@Injectable()
export class SubCategoryRepository implements ISubCategoryRepository {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepo: Repository<SubCategory>,
  ) {}

  async findAll(): Promise<SubCategory[]> {
    return this.subCategoryRepo.find();
  }

  async findByGenderAndCategory(categoryId: number, genderId: number): Promise<SubCategory[]> {
    return await this.subCategoryRepo.query(
      `SELECT * FROM sub_categories
       WHERE category_id = $1
       AND $2 = ANY(string_to_array(gender_ids, ',')::int[])`,
      [categoryId, genderId],
    );
  }

  async findById(id: number): Promise<SubCategory | null> {
    return await this.subCategoryRepo.findOne({ where: { id } });
  }
}
