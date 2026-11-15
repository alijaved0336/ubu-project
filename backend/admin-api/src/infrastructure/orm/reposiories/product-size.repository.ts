import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Products } from '../entities/product.entity';
import { IProductSizeRepository } from '@domain/repository/product-size.repository.interface';
import { ProductSizes } from '../entities/product-size.entity';
import { Sizes } from '../entities/size.entity';

@Injectable()
export class ProductSizeRepository implements IProductSizeRepository {
  constructor(
    @InjectRepository(ProductSizes)
    private readonly productSizeRepository: Repository<ProductSizes>,
  ) {}

  async create(payload) {
    // Create an instance of the entity
    const created_data = this.productSizeRepository.create(payload);

    // Save the created entity to the database
    return await this.productSizeRepository.save(created_data);
  }
  async findOne(id: number): Promise<ProductSizes | null> {
    return await this.productSizeRepository.findOne({ where: { id } });
  }

  async findByPostAndProduct(size: Sizes, product: Products): Promise<Partial<ProductSizes> | null> {
    return await this.productSizeRepository.findOne({
      where: { size: size, product: product },
    });
  }

  async findByPost(size: Sizes): Promise<ProductSizes | null> {
    return await this.productSizeRepository.findOne({ where: { size: size } });
  }

  async update(productSize: ProductSizes, data: any): Promise<UpdateResult | undefined> {
    return this.productSizeRepository.update(productSize.id, data);
  }

  async deleteByProductId(id: number): Promise<void> {
    await this.productSizeRepository.delete({ product: { id: id } });
  }
}
