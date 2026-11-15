import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { AffiliateDemoProduct } from '../entities/affiliate-demo-products.entity';

@Injectable()
export class AffliateProductableRepository {
  [x: string]: any;
  constructor(
    @InjectRepository(AffiliateDemoProduct)
    private readonly affliateRepo: Repository<AffiliateDemoProduct>,
  ) {}

  async create(payload: Partial<AffiliateDemoProduct>[]) {
    await this.affliateRepo.save(payload);
  }

  async findAllProducts(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    let whereCondition = {} as any;

    if (search) {
      whereCondition = [{ title: ILike(`%${search}%`) }];
    }

    const [products, total] = await this.affliateRepo.findAndCount({
      where: whereCondition,
      skip: skip,
      take: limit,
    });
    return { products, total };
  }
}
