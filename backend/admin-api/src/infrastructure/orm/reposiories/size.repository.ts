import { ISizeRepository } from '@domain/repository/size.repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sizes } from '../entities/size.entity';

@Injectable()
export class SizeRepository implements ISizeRepository {
  constructor(
    @InjectRepository(Sizes)
    private readonly sizeRepo: Repository<Sizes>,
  ) {}

  async findBySubCategory(subCategoryId: number): Promise<Sizes[]> {
    return await this.sizeRepo
      .createQueryBuilder('size')
      .where(`:subCategoryId = ANY(string_to_array(size.sub_category_ids, ','))`, { subCategoryId: subCategoryId.toString() })
      .getMany();
  }

  async findById(id: number): Promise<Sizes | null> {
    return await this.sizeRepo.findOne({ where: { id } });
  }
}
