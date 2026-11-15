import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { AffiliateProduct } from '../entities/affiliate-product.entity';
import { Posts } from '../entities/post.entity';

@Injectable()
export class AffiliateProductRepository {
  constructor(
    @InjectRepository(AffiliateProduct)
    private readonly affiliateProductRepo: Repository<AffiliateProduct>,
  ) {}

  // Create a single affiliate product
  async createAffiliateProduct(payload: Partial<AffiliateProduct>): Promise<AffiliateProduct> {
    const createdProduct = this.affiliateProductRepo.create(payload);
    return await this.affiliateProductRepo.save(createdProduct);
  }

  async createAffiliateProducts(validProducts: Partial<AffiliateProduct>[], post) {
    const affiliateProducts = validProducts.map((product) => {
      const roundedPrice = product.price != null ? Number(Number(product.price).toFixed(2)) : undefined;
      return this.affiliateProductRepo.create({
        title: product.title,
        description: product.description,
        images: product.images,
        link: product.link,
        price: roundedPrice,
        post: post,
      });
    });

    await this.affiliateProductRepo.save(affiliateProducts);
  }

  async findAllProducts(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    let whereCondition = {} as any;

    if (search) {
      whereCondition = [{ title: ILike(`%${search}%`) }];
    }

    const [products, total] = await this.affiliateProductRepo.findAndCount({
      where: whereCondition,
      skip: skip,
      take: limit,
    });
    return { products, total };
  }

  async findAllByPost(post: Posts): Promise<AffiliateProduct[] | null> {
    return await this.affiliateProductRepo.find({ where: { post: post } });
  }

  async deleteAllByPost(post: Posts) {
    return await this.affiliateProductRepo.delete({ post: post });
  }

  async findById(id: number): Promise<any | null> {
    return this.affiliateProductRepo.findOne({
      where: { id },
      relations: ['influencer', 'influencer.user'],
    });
  }

  async remove(id) {
    return await this.affiliateProductRepo.delete(id);
  }
}
