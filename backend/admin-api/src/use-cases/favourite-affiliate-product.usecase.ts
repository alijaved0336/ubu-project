import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { AffiliateProductRepository } from '@infrastructure/orm/reposiories/affiliate-product.repository';
import { CreateFavoriteAffiliateProductDto } from '@infrastructure/presentation/favourite-affiliate-product/fap-dto';
import { FavouriteAffiliateProductRepository } from '@infrastructure/orm/reposiories/favourite-affiliate-product-repository';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';

export class FavouriteAffiliateProductUsecase {
  constructor(
    private fapRepository: FavouriteAffiliateProductRepository,
    private userRepository: UserRepository,
    private affiliateProductRepository: AffiliateProductRepository,
    private notificationRepo: NotificationRepository,
  ) {}

  async create(payload: CreateFavoriteAffiliateProductDto, userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    if (!user.consumer) {
      throw new ConflictException(`User is not a consumer`);
    }

    const affiliateProduct = await this.affiliateProductRepository.findById(payload.affiliateProductId);
    if (!affiliateProduct) {
      throw new NotFoundException(`Affiliate Product not found`);
    }

    const createdEntry = await this.fapRepository.create({
      consumer: user.consumer,
      affiliateProduct,
    });
    if (!affiliateProduct?.influencer) throw new NotFoundException(`User not found`);

    const productOwner = affiliateProduct?.influencer?.user;
    if (productOwner?.id && productOwner.id !== user.id) {
      await this.notificationRepo.sendNotificationToUserDevices({
        receiverUserId: productOwner.userId,
        receiverUserType: productOwner.userType,
        senderUserId: user.id,
        senderUserType: 'consumer',
        title: 'Your product was favorited!',
        body: `${user?.first_name || 'A user'} favorited your product: ${affiliateProduct.title}`,
        content: `${user.first_name || 'A user'} favorited your product "${affiliateProduct.title}"`,
        type: 'FAVORITE_PRODUCT',
        saveToDatabase: true,
      });
    }

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
