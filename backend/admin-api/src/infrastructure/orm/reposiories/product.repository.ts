import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Products } from '../entities/product.entity';
@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Products)
    private readonly productRepo: Repository<Products>,
  ) {}

  async create(payload: Partial<Products>): Promise<Products> {
    const product = this.productRepo.create(payload);
    return await this.productRepo.save(product);
  }

  async saveProduct(payload: Partial<Products>): Promise<Products> {
    return await this.productRepo.save(payload);
  }

  async findById(id: number): Promise<Products | null> {
    return this.productRepo.findOne({ where: { id } });
  }

  async findAll(brand_id: number, page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    let whereCondition = { brand: { id: brand_id } } as any;

    if (search) {
      whereCondition = [
        { brand: { id: brand_id }, name: ILike(`%${search}%`) },
        { brand: { id: brand_id }, description: ILike(`%${search}%`) },
      ];
    }

    const [products, total] = await this.productRepo.findAndCount({
      where: whereCondition,
      relations: ['category', 'sub_category', 'productSizes'],
      skip: skip,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });
    return { products, total };
  }

  async update(id: number, payload: Partial<Products>) {
    return this.productRepo.update(id, payload);
  }

  async delete(id: number) {
    return this.productRepo.delete(id);
  }

  async deleteProductsByBrandId(brandId: number): Promise<number> {
    const deleteResult = await this.productRepo?.delete({
      brand: { id: brandId },
    });

    return deleteResult?.affected || 0;
  }

  async findByIds(ids: number[]): Promise<Products[]> {
    return await this.productRepo.find({ where: { id: In(ids) } });
  }

  async save(product: Products, category_id: number) {
    return this.productRepo.save({ ...product, category: { id: category_id } });
  }

  async findByIdWithRelation(id: number): Promise<Products | null> {
    return this.productRepo.findOne({
      where: { id },
      relations: ['brand', 'productSizes.size', 'category', 'sub_category', 'genders', 'styles'],
    });
  }
  async findAllProducts() {
    return await this.productRepo.find();
  }

  async getProductsByBrands(brandIds) {
    return this.productRepo.find({
      where: { brand: { id: In(brandIds.map(Number)) } },
    });
  }
}
