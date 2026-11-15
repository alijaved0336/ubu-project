
import { Posts } from "@infrastructure/orm/entities/post.entity";
import { PostRepository } from "@infrastructure/orm/reposiories/post.repository";
import { SearchRepository } from "@infrastructure/orm/reposiories/search.repository";
import { PostDto, ProductDto, ProductSizeDto } from "@infrastructure/presentation/post/post.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { plainToClass } from "class-transformer";

@Injectable()
export class SearchUsecase {

  constructor(
    private searchRepository: SearchRepository,
    private postRepository: PostRepository,

  ) { }

  async searchAllProducts(user, searchString, page, limit) {
    const user_id = user?.id
    const consumer_id = user?.consumer?.id
    const post_ids = await this.searchRepository.searchAllProducts(consumer_id, searchString, page, limit)
    const { posts, total } = await this.postRepository.findHomeFeed(post_ids, page, limit, consumer_id)
    await this.searchRepository.insertUserSearch(user_id, searchString)
    const mappedPosts = await this.mappedPosts(posts, consumer_id)
    return {
      posts: mappedPosts,
      total
    };
  }

  async mappedPosts(posts: Partial<Posts[]>, consumer_id: number) {
    return posts.map(post => {
      const transformedPost = plainToClass(PostDto, post, { excludeExtraneousValues: true });
      if (post)
      {
        transformedPost.postProducts = post.postProduct.map(pp => {
          let isFavorite = false;
          if (pp?.product_favourites?.length > 0)
          {
            isFavorite = pp.product_favourites.some(pf => pf.consumer.id === consumer_id);
          }
          const product = {
            ...pp.product,
            isFavorite,
            colors: Object.values(pp.product.colors)
          };
          const transformedProduct = plainToClass(ProductDto, product, { excludeExtraneousValues: true });
          transformedProduct.productSizes = pp.product.productSizes.map(ps => {
            return plainToClass(ProductSizeDto, {
              ...ps,
              size: ps.size.label
            }, { excludeExtraneousValues: true });
          });
          return { ...pp, product: transformedProduct };
        });
        return {
          influencer: post.influencer,
          post: transformedPost
        };
      }
    });

  }

  async deleteSearchById(search_id) {
    return this.searchRepository.removeBySearchId(search_id)
  }

  async getUserSearches(user, page, limit) {
    const user_id = user?.id
    return this.searchRepository.getUserSearches(user_id, page, limit)
  }
}