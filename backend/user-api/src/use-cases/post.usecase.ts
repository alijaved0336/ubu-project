import { Posts } from '@infrastructure/orm/entities/post.entity';
import { PostRepository } from '@infrastructure/orm/reposiories/post.repository';
import {
  PostDto,
  ProductDto,
  ProductSizeDto,
  RecentPostsPaginationDto,
} from '@infrastructure/presentation/post/post.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import axios from 'axios';
import { AiService } from '@infrastructure/services/ai-service/ai-service.service';
import { ConsumerRepository } from '@infrastructure/orm/reposiories/consumer.repository';
import { Influencers } from '@infrastructure/orm/entities/influencer.entity';
import { AffiliateProductDto } from '@infrastructure/presentation/favourite-affiliate-product/fap-dto';
import { DETAILED_POST_SELECTION } from 'common/constants';
import UsecaseProxy, { INFLUENCER_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { InfluencerUsecase } from './influencer.usecase';

@Injectable()
export class PostUsecase {
  constructor(
    private postRepository: PostRepository,
    private aIService: AiService,
    private consumerRepository: ConsumerRepository,
    @Inject(INFLUENCER_USECASE_PROXY)
    private readonly influencerUsecaseProxy: UsecaseProxy<InfluencerUsecase>,
  ) {}

  async findAllInfluncersPosts(
    influencer_id: number,
    page,
    limit,
    consumerId: number,
  ): Promise<{ posts: PostDto[]; total: number }> {
    const { posts, total } = await this.postRepository.findAllInfluncersPosts(
      influencer_id,
      page,
      limit,
      consumerId,
    );
    const mappedPosts = posts.map((post) => {
      const transformedPost = plainToClass(PostDto, post, {
        excludeExtraneousValues: true,
      });
      transformedPost.postProducts = (post as Posts).postProduct.map((pp) => {
        const isFavorite =
          pp.product.product_favourites.length > 0 ? true : false;
        const product = {
          ...pp.product,
          colors: Object.values(pp.product.colors),
          isFavorite,
        };
        const transformedProduct = plainToClass(ProductDto, product, {
          excludeExtraneousValues: true,
        });
        transformedProduct.productSizes = pp.product.productSizes.map((ps) => {
          return plainToClass(
            ProductSizeDto,
            {
              ...ps,
              size: ps.size.label, // Map the size directly
            },
            { excludeExtraneousValues: true },
          );
        });
        return {
          ...pp,
          product: transformedProduct,
        };
      });

      transformedPost.affiliateProducts =
        (post as Posts).affiliateProducts?.map((ap) => {
          const transformedAffiliateProduct = plainToClass(
            AffiliateProductDto,
            ap,
            {
              excludeExtraneousValues: false,
            },
          );

          return transformedAffiliateProduct;
        }) || [];

      return transformedPost;
    });
    return {
      posts: mappedPosts,
      total,
    };
  }

  async findAll(
    page: number,
    limit: number,
    consumerId: number,
  ): Promise<Partial<Posts[]>> {
    return this.postRepository.findAll(page, limit, consumerId);
  }

  async mappedPosts(posts: Partial<Posts[]>, consumer_id: number) {
    return posts.map((post) => {
      const transformedPost = plainToClass(PostDto, post, {
        excludeExtraneousValues: true,
      });
      if (post) {
        transformedPost.postProducts = post.postProduct.map((pp) => {
          let isFavorite = false;
          if (pp?.product_favourites?.length > 0) {
            isFavorite = pp.product_favourites.some(
              (pf) => pf.consumer.id === consumer_id,
            );
          }
          const product = {
            ...pp.product,
            isFavorite,
            colors: Object.values(pp.product.colors),
          };
          const transformedProduct = plainToClass(ProductDto, product, {
            excludeExtraneousValues: true,
          });
          transformedProduct.productSizes = pp.product.productSizes.map(
            (ps) => {
              return plainToClass(
                ProductSizeDto,
                {
                  ...ps,
                  size: ps.size.label,
                },
                { excludeExtraneousValues: true },
              );
            },
          );
          return { ...pp, product: transformedProduct };
        });

        transformedPost.affiliateProducts =
          post.affiliateProducts?.map((ap) => {
            const transformedAffiliateProduct = plainToClass(
              AffiliateProductDto,
              ap,
              {
                excludeExtraneousValues: false,
              },
            );

            return transformedAffiliateProduct;
          }) || [];

        return {
          influencer: post.influencer,
          post: transformedPost,
        };
      }
    });
  }

  async findHomeFeed(
    consumerId: number,
    page: number,
    limit: number,
    search?: string,
    tab?: 'posts' | 'influencers',
  ): Promise<{ posts?: any[]; influencers?: any[]; total: number; tabs?: string[] }> {
    try {
      const aiPosts = !search?.trim()
        ? await this.getPostsFromAI(consumerId, page, limit)
        : await this.getPostsFromSearch(page, limit, search);
  
      let posts: any[] = [];
      let influencers: any[] = [];
      let total = 0;
      
      if (aiPosts?.data && Object.keys(aiPosts.data).length > 0) {
        if (search?.trim()) {
          const searchData = aiPosts.data;
          const activeTab = tab || 'posts';

          if (activeTab === 'posts' && (searchData.posts || searchData.users_posts)) {
            console.log('Fetching posts based on search');
            const allPostsData: Array<{ id: number; similarity_score: number }> = [];
            if (searchData.posts) {
              const postsArray = Object.values(searchData.posts) as Array<{ id: number; similarity_score: number }>;
              allPostsData.push(...postsArray);
            }
            
            if (searchData.users_posts) {
              const usersPostsArray = Object.values(searchData.users_posts) as Array<{ id: number; similarity_score: number }>;
              allPostsData.push(...usersPostsArray);
            }

            allPostsData.sort((a, b) => b.similarity_score - a.similarity_score);
            const uniquePostIds = [...new Set(allPostsData.map(item => item.id))];
            
            ({ posts, total } = await this.postRepository.findHomeFeed(
              uniquePostIds,
              page,
              limit,
              consumerId,
            ));
            posts = this.sortPostsByOriginalOrder(posts, uniquePostIds);
            const mappedPosts = await this.mappedPosts(posts, consumerId);
            
            return {
              posts: mappedPosts,
              total,
              tabs: ['posts', 'influencers']
            };
          }

          if (activeTab === 'influencers' && searchData.influencers) {
            console.log('Fetching influencers based on search');
            const influencersData = Object.values(searchData.influencers) as Array<{ id: number; similarity_score: number }>;
            influencersData.sort((a, b) => b.similarity_score - a.similarity_score);
            const uniqueInfluencerIds = [...new Set(influencersData.map(item => item.id))];

            influencers = await this.influencerUsecaseProxy.getInstance().getInfluencersBasicInfo(uniqueInfluencerIds, consumerId);
            
            return {
              influencers,
              total: influencers.length,
              tabs: ['posts', 'influencers']
            };
          }

          return {
            posts: activeTab === 'posts' ? [] : undefined,
            influencers: activeTab === 'influencers' ? [] : undefined,
            total: 0,
            tabs: ['posts', 'influencers']
          };
          
        } else {
          console.log('Fetching posts based on AI recommendations');
          const aiPostIds = Object.values(aiPosts?.data) as number[];
          ({ posts, total } = await this.postRepository.findHomeFeed(
            aiPostIds,
            page,
            limit,
            consumerId,
          ));
          posts = this.sortPostsByOriginalOrder(posts, aiPostIds);
          const mappedPosts = await this.mappedPosts(posts, consumerId);
  
          return {
            posts: mappedPosts,
            total,
          };
        }
      } else {
        console.log('Fetching random posts for the home feed');
        ({ posts, total } = await this.postRepository.findHomeFeed(
          null,
          page,
          limit,
          consumerId,
        ));
        const mappedPosts = await this.mappedPosts(posts, consumerId);
  
        return {
          posts: mappedPosts,
          total,
        };
      }
    } catch (error) {
      console.error('Error fetching home feed:', error);
      throw new Error('Failed to fetch the home feed. Please try again later.');
    }
  }

  private sortPostsByOriginalOrder(posts: any[], originalOrder: number[]): any[] {
    const orderMap = new Map(originalOrder.map((id, index) => [id, index]));

    return posts.sort((a, b) => {
      const indexA = orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const indexB = orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      return indexA - indexB;
    });
  }

  async getPostsFromAI(consumer_id, pageNumber: number, limitNumber: number) {
    const url = `${process.env.PYTHON_SERVER_URL}/news-feed/post/?page=${pageNumber}&page_size=${limitNumber}`;
    // const url = `https://617c-119-63-128-58.ngrok-free.app/news-feed/post/?page=${pageNumber}&page_size=${limitNumber}`;
    const headers = { 'Content-Type': 'application/json' };
    const data = {
      id: consumer_id,
    };

    const config = {
      headers,
      timeout: 10000, // 10 seconds timeout
    };
    try {
      const response_data = await axios.post(url, data, config);
      return response_data;
    } catch (e) {
      console.error('---error occured due to some reason---', e);
      return {
        data: null,
      };

      // return null
    }
  }
  async getPostsFromSearch(
    pageNumber: number,
    limitNumber: number,
    search: string,
  ) {
    const url = `${process.env.PYTHON_SERVER_URL}/semantic-search/post-product/?page=${pageNumber}&page_size=${limitNumber}`;
    const headers = { 'Content-Type': 'application/json' };
    const data = {
      text: search,
    };

    const config = {
      headers,
      timeout: 10000, // 10 seconds timeout
    };
    try {
      const response_data = await axios.post(url, data, config);
      return response_data;
    } catch (e) {
      console.error('---error occured due to some reason---', e);
      return {
        data: null,
      };

      // return null
    }
  }

  async findById(id: number): Promise<Posts | null> {
    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException('Post Not Found');
    return post;
  }

  async postVisit(consumer_id, post_id) {
    return this.postRepository.postVisit(consumer_id, post_id);
  }

  async findRecentPostsWithPagination(
    consumer_id: number,
    query: RecentPostsPaginationDto,
  ) {
    const { posts, total } =
      await this.postRepository.findRecentPostsWithPagination(
        DETAILED_POST_SELECTION,
        query.page ?? 1,
        query.limit ?? 6,
        query.search,
        query.status,
      );

    const modifiedPosts = posts.map((post) => ({
      ...post,
      affiliateProducts: post.affiliateProducts.map((affiliateProduct) => ({
        ...affiliateProduct,
        isFavorite:
          affiliateProduct.favoriteAffiliateProducts?.some(
            (fav) => fav.consumer?.id === consumer_id,
          ) ?? false,
      })),
      postProducts: post.postProduct.map((pp) => {
        const isFavorite =
          pp.product.product_favourites?.some(
            (fav) => fav.consumer?.id === consumer_id,
          ) ?? false;

        return {
          ...pp.product,
          colors: Object.values(pp.product.colors),
          isFavorite,
        };
      }),
    }));

    const transformedPosts = modifiedPosts.map((post) => ({
      influencer: post.influencer,
      post: post,
    }));

    return { posts: transformedPosts, total };
  }
}
