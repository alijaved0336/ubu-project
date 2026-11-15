import { CartRepository } from "@infrastructure/orm/reposiories/cart.repository";
import { ConsumerRepository } from "@infrastructure/orm/reposiories/consumer.repository";
import { ProductRepository } from "@infrastructure/orm/reposiories/product.repository";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class CartUsecase {

  constructor(
    private cartRepository: CartRepository,
    private productRepository: ProductRepository,
    private consumerRepository: ConsumerRepository

  ) { }


  async findAll(userId: number, page: number, limit: number) {
    const consumer = await this.consumerRepository.findByUserId(userId)
    if (!consumer) throw new NotFoundException('Consumer Not Found');
    return this.cartRepository.findAllByConsumerId(consumer.id, page, limit)
  }

  async findById(id: number) {
    const cart = await this.cartRepository.findById(id)
    if (!cart) throw new NotFoundException('cart Not Found')
    return cart;
  }

  async addToCart(productId: number, userId: number) {
    const product = await this.productRepository.findById(productId)
    const consumer = await this.consumerRepository.findByUserId(userId)
    if (!product || !consumer) throw new NotFoundException('Either product or user not found.')

    const isCartExist = await this.cartRepository.findByConsumerIdAndProductId(consumer.id, product.id)
    if (isCartExist) return 'Product already added in cart'
    return this.cartRepository.addToCart(consumer.id, productId)
  }

  async removeFromCart(id: number) {
    return this.cartRepository.deleteById(id);
  }

}