import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostFavourites } from "../entities/post-favourites.entity";
import { Cart } from "../entities/cart.entity";

@Injectable()
export class CartRepository {

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) { }

  async addToCart(consumerId: number, productId: number) {
    const postFav = this.cartRepository.create({ consumer: { id: consumerId }, products: { id: productId }, quantity: 1 });
    return await this.cartRepository.save(postFav) && 'Product Added to cart';
  }

  async update(id: number, cart: Cart) {
    return this.cartRepository.update(id, cart);
  }

  async delete(consumerId: number, productId: number) {
    return this.cartRepository.delete({ consumer: { id: consumerId }, products: { id: productId } })
  }

  async deleteById(id: number) {
    return this.cartRepository.delete(id)
  }

  async findAllByConsumerId(consumerId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this.cartRepository.find({ where: { consumer: { id: consumerId } }, skip, take: limit });
  }

  async findById(id: number) {
    return this.cartRepository.findOne({ where: { id } })
  }

  async findByConsumerIdAndProductId(consumerId: number, productId: number) {
    return this.cartRepository.findOne({ where: { consumer: { id: consumerId }, products: { id: productId } } })
  }

  async removeFromCartByUser(consumer_id: number) {
    return this.cartRepository.delete({
      consumer: {
        id: consumer_id
      }
    })
  }
}