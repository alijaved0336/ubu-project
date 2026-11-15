import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { AffiliateProduct } from '../entities/affiliate-product.entity';
import { Posts } from '../entities/post.entity';

@Injectable()
export class AffiliateProductRepository {
  constructor(
    @InjectRepository(AffiliateProduct)
    private readonly affiliateProductRepo: Repository<AffiliateProduct>,
  ) {}

  async createAffiliateProduct(
    payload: Partial<AffiliateProduct>,
  ): Promise<AffiliateProduct> {
    const createdProduct = this.affiliateProductRepo.create(payload);
    return await this.affiliateProductRepo.save(createdProduct);
  }

  async createAffiliateProducts(
    validProducts: Partial<AffiliateProduct>[],
    post,
  ) {
    const affiliateProducts = validProducts.map((product) => {
      return this.affiliateProductRepo.create({
        title: product.title,
        description: product.description,
        images: product.images,
        link: product.link,
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

  async findById(id: number): Promise<AffiliateProduct | null> {
    return this.affiliateProductRepo.findOneBy({ id });
  }

  async remove(id) {
    return await this.affiliateProductRepo.delete(id);
  }

  async findProductsByPostId(postId: number[]) {
    return this.affiliateProductRepo.find({
      where:{post:{id: In(postId)}}
    });
  }
  async softDeleteByIds(ids: number[]) {
    await this.affiliateProductRepo.softDelete({ id: In(ids) });
  }
  async deleteByIds(ids: number[]) {
    await this.affiliateProductRepo.softDelete({ post: { id: In(ids) } });
  }
  async revertSoftDeleteByIds(ids: number[]) {
    await this.affiliateProductRepo.restore({ id: In(ids) });
  }
  async findDeletedProductsByPostIds(postId: number[]) {
    return this.affiliateProductRepo.find({
      where: { post: { id: In(postId) } },
      withDeleted: true,
    });
  }
}
