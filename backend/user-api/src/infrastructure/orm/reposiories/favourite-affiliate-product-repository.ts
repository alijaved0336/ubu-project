import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteAffiliateProduct } from '../entities/favorite-affiliate-product.entity';

@Injectable()
export class FavouriteAffiliateProductRepository {
  constructor(
    @InjectRepository(FavoriteAffiliateProduct)
    private readonly fapRepository: Repository<FavoriteAffiliateProduct>,
  ) {}

  async create(payload: Partial<FavoriteAffiliateProduct>) {
    return this.fapRepository.create(payload as FavoriteAffiliateProduct);
  }

  save(
    payload: Partial<FavoriteAffiliateProduct>,
  ): Promise<FavoriteAffiliateProduct> {
    return this.fapRepository.save(payload);
  }

  async findByConsumerAndPostId(
    consumerId: number,
    affiliateProductId,
  ): Promise<FavoriteAffiliateProduct | null> {
    return this.fapRepository.findOne({
      where: {
        consumer: { id: consumerId },
        affiliateProduct: { id: affiliateProductId },
      },
    });
  }

  async findAll(consumerId: number) {
    if (!consumerId) {
      throw new Error('Consumer ID is required');
    }

    try {
      const [fap, total] = await this.fapRepository.findAndCount({
        where: {
          consumer: {
            id: consumerId,
          },
        },
        relations: [
          'consumer',
          'consumer.user',
          'affiliateProduct',
          'affiliateProduct.post',
        ],
      });

      return {
        favouriteAffiliatedProducts: fap,
        total,
      };
    } catch (error) {
      throw new Error(`Failed to fetch favourites: ${error.message}`);
    }
  }

  async remove(affiliateProdoductId: number, consumerId: number) {
    return await this.fapRepository.delete({
      consumer: { id: consumerId },
      affiliateProduct: { id: affiliateProdoductId },
    });
  }
}
