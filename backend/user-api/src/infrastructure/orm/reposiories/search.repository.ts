import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { Products } from "../entities/product.entity";
import { performance } from 'perf_hooks';
import { Posts } from "../entities/post.entity";
import { UserSearch } from "../entities/user-search.entity";

@Injectable()
export class SearchRepository {

  constructor(
    @InjectRepository(UserSearch)
    private readonly userSearchRepository: Repository<UserSearch>,
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
  ) { }

  async searchAllProducts(user_id, searchString: string, page = 1, limit = 5) {
    const searchTerms = searchString.split(' ').map(term => `%${term}%`);

    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .leftJoin('posts.postProduct', 'postProduct')
      .leftJoin('postProduct.product', 'products')
      .leftJoin('products.category', 'category')
      .leftJoin('products.sub_category', 'sub_category')
      .leftJoin('products.genders', 'gender')
      .leftJoin('products.styles', 'style')
      .select([
        'posts.id',
        // 'posts.title',
        // 'posts.body',
        // 'postProduct.id',
        // 'products.id',
        // 'products.name',
        // 'products.description',
        // 'products.price',
        // 'products.currency',
        // 'products.status',
        // 'products.material',
        // 'category.id',
        // 'category.name',
        // 'sub_category.id',
        // 'sub_category.name',
        // 'sub_category.type',
        // 'gender.id',
        // 'gender.name',
        // 'style.id',
        // 'style.name',
        // 'style.tags',
      ])
      .andWhere(new Brackets(qb => {
        qb.where('products.name ILIKE ANY(:searchTerms)', { searchTerms })
          .orWhere('posts.title ILIKE ANY(:searchTerms)', { searchTerms })
          .orWhere('posts.body ILIKE ANY(:searchTerms)', { searchTerms })
          .orWhere('posts.tags::text ILIKE ANY(:searchTerms)', { searchTerms })
          .orWhere('products.description ILIKE ANY(:searchTerms)', { searchTerms })
          .orWhere('products.tags::text ILIKE ANY(:searchTerms)', { searchTerms })
          .orWhere('products.material ILIKE ANY(:searchTerms)', { searchTerms })
          .orWhere('style.name ILIKE ANY(:searchTerms)', { searchTerms })
          .orWhere('style.tags::text ILIKE ANY(:searchTerms)', { searchTerms })
          .orWhere('category.name ILIKE ANY(:searchTerms)', { searchTerms })
          .orWhere('category.description ILIKE ANY(:searchTerms)', { searchTerms })
          .orWhere('sub_category.name ILIKE ANY(:searchTerms)', { searchTerms })
          .orWhere('sub_category.type ILIKE ANY(:searchTerms)', { searchTerms })
          .orWhere('gender.name ILIKE ANY(:searchTerms)', { searchTerms });
      }))
      .limit(limit)
      .offset((page - 1) * limit)


    const queryOperation = queryBuilder.getMany();
    const [posts] = await Promise.all([queryOperation]);
    const postIds = posts.map(post => post.id);
    return postIds
  }

  async insertUserSearch(user_id, searchString) {
    return this.userSearchRepository.insert({
      search_string: searchString,
      user: user_id
    });
  }

  async removeUsersSearches(userId) {
    return this.userSearchRepository.delete({
      user: {
        id: userId
      }
    })
  }

  async removeBySearchId(search_id) {
    return this.userSearchRepository.delete({
      id: search_id
    })
  }

  async getUserSearches(user_id, page = 1, limit = 5,) {
    const skip = (page - 1) * limit;
    const [searches, total] = await this.userSearchRepository.findAndCount({
      where: {
        user: {
          id: user_id
        }
      },
      skip,
      take: limit,
    })

    return { searches, total };

  }
}