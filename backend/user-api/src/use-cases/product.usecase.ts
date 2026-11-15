import { Products } from "@infrastructure/orm/entities/product.entity";
import { ConsumerRepository } from "@infrastructure/orm/reposiories/consumer.repository";
import { ProductRepository } from "@infrastructure/orm/reposiories/product.repository";
import { ProductFavoriteRepository } from "@infrastructure/orm/reposiories/product-favorite.repository";
import { ReviewRepository } from "@infrastructure/orm/reposiories/review.repository";
import { ReviewDTO } from "@infrastructure/presentation/product/product.dto";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ProductUsecase {

    constructor(
        private productRepository: ProductRepository,
        private reviewRepository: ReviewRepository,
        private consumerRepository: ConsumerRepository,
        private productFavoriteRepository: ProductFavoriteRepository,

    ) { }

    async addReview(payload: ReviewDTO, userId: number) {
        const product = await this.productRepository.findById(payload.productId)
        const consumer = await this.consumerRepository.findByUserId(userId)
        if (!product || !consumer) throw new NotFoundException('Either product or user not found.')
        return this.reviewRepository.addReview({ ...payload, consumers: consumer })
    }

    async deleteReview(id: number) {
        return this.reviewRepository.deleteReview(id)
    }

    async markProductFavourite(productId: number, postId: number, postProductId: number, userId: number) {
        const product = await this.productRepository.findById(productId)
        const consumer = await this.consumerRepository.findByUserId(userId)
        if (!product || !consumer) throw new NotFoundException('Either product or user not found.')
        const isalreadyFavorite = await this.productFavoriteRepository.findByConsumerIdAndProductId(consumer.id, product.id, postId, postProductId);
        if (isalreadyFavorite) throw new ConflictException('Product Already marked as favorite')
        return this.productFavoriteRepository.markProductFavorite(consumer.id, productId, postId, postProductId)
    }
    async listProductFavorite(consumerId: number, page: number = 1, limit: number = 10) {
        const favorites = await this.productFavoriteRepository.findAllByConsumerId(consumerId, page, limit)
        const mappedFavorites = favorites.map(favorite => {
            let productData = favorite.products
            return {
                post_product: favorite.post_product,
                post: favorite.post,
                product: {
                    ...productData,
                    colors: Object.values(productData.colors),
                    isFavorite: true,
                    productSizes: productData.productSizes.map(ps => ({
                        ...ps,
                        size: ps.size.label
                    }))
                }
            }
        })
        return mappedFavorites
    }
    async markProductUnFavourite(postProductId: number, userId: number) {
        return this.productFavoriteRepository.delete(userId, postProductId)
    }
}