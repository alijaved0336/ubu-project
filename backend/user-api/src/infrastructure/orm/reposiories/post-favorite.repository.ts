import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostFavourites } from "../entities/post-favourites.entity";

@Injectable()
export class PostFavoriteRepository {

  constructor(
    @InjectRepository(PostFavourites)
    private readonly postFavoriteRepository: Repository<PostFavourites>,
  ) { }

  async markPostFavorite(consumerId: number, postId: number) {
    const postFav = this.postFavoriteRepository.create({ consumer: { id: consumerId }, posts: { id: postId } });
    return await this.postFavoriteRepository.save(postFav) && 'Post Successfully Marked Favorite';
  }

  async findByConsumerIdAndPostId(consumerId: number, postId: number) {
    return this.postFavoriteRepository.findOne({ where: { consumer: { id: consumerId }, posts: { id: postId } } })
  }

  async findAllByConsumerId(consumerId: number) {
    return this.postFavoriteRepository.find({ where: { consumer: { id: consumerId } }, relations: { posts: true } });
  }

  async delete(consumerId: number, postId: number) {
    return this.postFavoriteRepository.delete({ consumer: { id: consumerId }, posts: { id: postId } })
  }

  async removeConsumerFavouritePost(consumer_id: number) {
    return this.postFavoriteRepository.delete({
      consumer: {
        id: consumer_id
      }
    })
  }


}