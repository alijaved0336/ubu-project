import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { AffiliateProductRepository } from '@infrastructure/orm/reposiories/affiliate-product.repository';
import { CreateFavoriteAffiliateProductDto } from '@infrastructure/presentation/favourite-affiliate-product/fap-dto';
import { FavouriteAffiliateProductRepository } from '@infrastructure/orm/reposiories/favourite-affiliate-product-repository';

export class FavouriteAffiliateProductUsecase {
  constructor(
    private fapRepository: FavouriteAffiliateProductRepository,
    private userRepository: UserRepository,
    private affiliateProductRepository: AffiliateProductRepository,
  ) {}
  async create(payload: CreateFavoriteAffiliateProductDto, userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    if (!user.consumer) {
      throw new ConflictException(`User is not a consumer`);
    }

    const likedAffiliateProduct =
      await this.fapRepository.findByConsumerAndPostId(
        user.consumer.id,
        payload.affiliateProductId,
      );

    if (likedAffiliateProduct) {
      throw new ConflictException(
        `User has already liked this affiliated product`,
      );
    }

    const affiliateProduct = await this.affiliateProductRepository.findById(
      payload.affiliateProductId,
    );
    if (!affiliateProduct) {
      throw new NotFoundException(`Affiliate Product not found`);
    }
    const createdEntry = await this.fapRepository.create({
      consumer: user.consumer,
      affiliateProduct,
    });

    const savedEntry = await this.fapRepository.save(createdEntry);
    return savedEntry;
  }

  async findAll(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return await this.fapRepository.findAll(user.consumer.id);
  }

  async remove(affiliateProductId: number, userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return this.fapRepository.remove(affiliateProductId, user.consumer.id);
  }
}
