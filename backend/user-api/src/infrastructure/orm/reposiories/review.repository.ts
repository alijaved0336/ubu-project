import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Products } from "../entities/product.entity";
import { Reviews } from "../entities/reviews.entity";

@Injectable()
export class ReviewRepository {

  constructor(
    @InjectRepository(Reviews)
    private readonly reviewsRepository: Repository<Reviews>,
  ) { }

  async addReview(payload: Partial<Reviews>) {
    const review = this.reviewsRepository.create(payload);
    return await this.reviewsRepository.save(review) && review;
  }

  async deleteReview(id: number) {
    return this.reviewsRepository.delete(id);
  }

  async removeConsumerReviews(consumer_id) {
    return this.reviewsRepository.delete({
      consumers: {
        id: consumer_id
      }
    })
  }
}