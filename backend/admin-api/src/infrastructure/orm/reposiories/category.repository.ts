import { ICategoryRepository } from '@domain/repository/category.repository.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Categories } from '../entities/category.entity';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Categories)
    private readonly categoryRepo: Repository<Categories>,
  ) {}

  async findAll(): Promise<Categories[]> {
    return this.categoryRepo.find();
  }

  async findById(id: number): Promise<Categories | null> {
    return this.categoryRepo.findOne({ where: { id } });
  }
}
