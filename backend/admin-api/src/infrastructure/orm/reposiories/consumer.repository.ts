import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consumers } from '../entities/consumer.entity';
import { BodyMeasurement } from '../entities/body-measurement.entity';
import { PostFavourites } from '../entities/post-favourites.entity';
import { PostVisits } from '../entities/post-visit.entity';
import { ProductFavourites } from '../entities/product_favourites.entity';
import { FavoriteAffiliateProduct } from '../entities/favorite-affiliate-product.entity';
import { Cart } from '../entities/cart.entity';

@Injectable()
export class ConsumerRepository {
  constructor(
    @InjectRepository(Consumers)
    private readonly consumerRepository: Repository<Consumers>,

    @InjectRepository(BodyMeasurement)
    private readonly bodyRepository: Repository<BodyMeasurement>,

    @InjectRepository(PostFavourites)
    private readonly postFavRepository: Repository<PostFavourites>,

    @InjectRepository(PostVisits)
    private readonly postVisitRepository: Repository<PostVisits>,

    @InjectRepository(ProductFavourites)
    private readonly productFavRepository: Repository<ProductFavourites>,

    @InjectRepository(FavoriteAffiliateProduct)
    private readonly favAffiliateRepository: Repository<FavoriteAffiliateProduct>,

    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async deleteConsumerData(consumerId: number): Promise<void> {
    try {
      await this.bodyRepository.delete({ consumer: { id: consumerId } });
      await this.postFavRepository.delete({ consumer: { id: consumerId } });
      await this.postVisitRepository.delete({ consumer: { id: consumerId } });
      await this.productFavRepository.delete({ consumer: { id: consumerId } });
      await this.favAffiliateRepository.delete({ consumer: { id: consumerId } });
      await this.cartRepository.delete({ consumer: { id: consumerId } });
    } catch (error) {
      throw new Error(`Failed to delete data for influencer ID ${consumerId}: ${error.message}`);
    }
  }

  async updateById(id: number, payload) {
    return await this.consumerRepository.update(id, payload);
  }

  async findByUserId(user_id) {
    return this.consumerRepository.findOne({
      where: {
        user: {
          id: user_id,
        },
      },
      relations: ['measurement', 'user', 'user.consumer'],
    });
  }
}
