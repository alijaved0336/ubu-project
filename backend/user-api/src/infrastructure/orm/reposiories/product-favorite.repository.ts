import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductFavourites } from "../entities/product_favourites.entity";
import { ProductSizes } from "../entities/product-size.entity";

@Injectable()
export class ProductFavoriteRepository {

  constructor(
    @InjectRepository(ProductFavourites)
    private readonly productFavoriteRepository: Repository<ProductFavourites>,
  ) { }

  async markProductFavorite(consumerId: number, productId: number, postId: number, postProductId: number) {
    const productFav = this.productFavoriteRepository.create({ consumer: { id: consumerId }, products: { id: productId }, post: { id: postId }, post_product: { id: postProductId } });
    return await this.productFavoriteRepository.save(productFav) && 'Product Successfully Marked Favorite';
  }

  async findAllByConsumerId(consumerId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this.productFavoriteRepository.find({
      where: { consumer: { id: consumerId } },
      skip,
      take: limit,
      relations: {
        post_product: true,
        post: true,
        products: {
          productSizes: {
            size: true
          }
        }
      },
      select: {
        post_product: {
          id: true
        },
        post: {
          id: true
        }
      }
    });
  }
  async findByConsumerIdAndProductId(consumerId: number, productId: number, postId, postProductId) {
    return this.productFavoriteRepository.findOne({ where: { consumer: { id: consumerId }, products: { id: productId }, post: { id: postId }, post_product: { id: postProductId } } })
  }

  async delete(consumerId: number, postProductId: number) {
    return this.productFavoriteRepository.delete({ consumer: { id: consumerId }, post_product: { id: postProductId } })
  }

  async removeFavouriteProducts(consumerId) {
    return this.productFavoriteRepository.delete({
      consumer: { id: consumerId }
    })
  }


}