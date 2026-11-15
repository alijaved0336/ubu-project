import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, In, Repository } from "typeorm";
import { Posts } from "../entities/post.entity";
import { IPostRepository } from "@domain/repository/post.interface";
import { PostVisits } from "../entities/post-visit.entity";
import { DETAILED_POST_SELECTION } from "common/constants";

@Injectable()
export class PostRepository implements IPostRepository {

  constructor(
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
    @InjectRepository(PostVisits)
    private readonly postVisitRepository: Repository<PostVisits>,
  ) { }

  async findAllInfluncersPosts(influencer_id, page: number, limit: number, consumerId: number) {
    const skip = (page - 1) * limit;
    const [posts, total] = await this.postRepository.findAndCount({
      where: { influencer: {id: influencer_id},status: "Published" },
      relations: {
        postProduct: {
          product: { product_favourites: true, productSizes: { size: true } },
        },
        affiliateProducts: {
          favoriteAffiliateProducts: {
            consumer: {
              user: true,
            },
          },
        },
      },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        body: true,
        status: true,
        media: true,
        productData: true,
        postProduct: {
          id: true,
          product: {
            id: true,
            name: true,
            description: true,
            price: true,
            productLink: true,
            currency: true,
            colors: true as any,
            product_favourites: { id: true },
            productSizes: { active: true, size: { label: true } },
            media: true,
          }
        }
      }
    });
    const updatedPosts = posts.map((post) => ({
      ...post,
      affiliateProducts: post.affiliateProducts.map((affiliateProduct) => ({
        ...affiliateProduct,
        isFavorite:
          affiliateProduct.favoriteAffiliateProducts?.some(
            (fav) => fav.consumer.id === consumerId,
          ) || false,
      })),
    }));
    return { posts: updatedPosts as unknown as Partial<Posts[]>, total };
  }

  async findAllInfluncersIdsPosts(influencer_ids:number[], page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [posts, total] = await this.postRepository.findAndCount({
      where: {
        influencer: { id: In(influencer_ids) },
        status: 'Published', // Add condition to filter posts with status = "Publish"
      },
      relations: {
        influencer: {
          user: true,
        },
        postProduct: {
          product_favourites: {
            consumer: true
          },
          product: {
            productSizes: {
              size: true
            }
          }
        }
      },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        body: true,
        status: true,
        media: true,
        productData: true,
        influencer: {
          id: true,
          avatar: true,
          user: {
            id: true,
      
            first_name: true,
            last_name: true
          }
        },
        postProduct: {
          id: true,
          product_favourites: {
            id: true,
            consumer: {
              id: true
            }
          },
          product: {
            id: true,
            name: true,
            description: true,
            price: true,
            currency: true,
            productLink: true,
            colors: true as any,
            productSizes: {
              active: true,
              size: {
                label: true
              }
            },
            media: true
          }
        },
        tags: true,
        created_at: true
      }
    });
    return { posts, total };
  }
  async findAll(page: number, limit: number, consumerId: number, ): Promise<Partial<Posts[]>> {
    const skip = (page - 1) * limit;
    const posts = await this.postRepository.find({
      relations: [
        'postProduct.product',
        'affiliateProducts',
        'affiliateProducts.favoriteAffiliateProducts',
        'affiliateProducts.favoriteAffiliateProducts.consumer',
        'affiliateProducts.favoriteAffiliateProducts.consumer.user',
      ],
      skip: skip,
      take: limit,
    });
    const updatedPosts = posts.map((post) => ({
      ...post,
      affiliateProducts: post.affiliateProducts.map((affiliateProduct) => ({
        ...affiliateProduct,
        isFavorite:
          affiliateProduct.favoriteAffiliateProducts?.some(
            (fav) => fav.consumer.id === consumerId,
          ) || false,
      })),
    }));
    return updatedPosts as unknown as Partial<Posts[]>;
  }

  async findHomeFeed(ai_posts_ids: number[] | null, page: number, limit: number, consumerId: number) {
    const skip = (page - 1) * limit;
    console.log("data----");
    
    const totalQuery = this.postRepository.createQueryBuilder('post')
        .where('post.status = :status', { status: 'Published' })
        .andWhere('post.deletedAt IS NULL');
    
    if (ai_posts_ids && ai_posts_ids.length > 0) {
        totalQuery.andWhere('post.id IN (:...ids)', { ids: ai_posts_ids });
    }
    
    const total = await totalQuery.getCount();
    
    const randomPostIdsQuery = this.postRepository.createQueryBuilder('post')
        .select('post.id')
        .where('post.status = :status', { status: 'Published' })
        .andWhere('post.deletedAt IS NULL');
    
    if (ai_posts_ids && ai_posts_ids.length > 0) {
        randomPostIdsQuery.andWhere('post.id IN (:...ids)', { ids: ai_posts_ids });
    }
    
    randomPostIdsQuery
        .orderBy('RANDOM()')
        .skip(skip)
        .take(limit);
    
    const randomPostIds = await randomPostIdsQuery.getRawMany();
    const postIds = randomPostIds.map(row => row.post_id);
    
    if (postIds.length === 0) {
        return { posts: [], total };
    }
    
    const posts = await this.postRepository.createQueryBuilder('post')
        .leftJoinAndSelect('post.influencer', 'influencer')
        .leftJoinAndSelect('influencer.user', 'user')
        .leftJoinAndSelect('post.postProduct', 'postProduct')
        .leftJoinAndSelect('postProduct.product_favourites', 'product_favourites')
        .leftJoinAndSelect('product_favourites.consumer', 'consumer')
        .leftJoinAndSelect('postProduct.product', 'product')
        .leftJoinAndSelect('product.productSizes', 'productSizes')
        .leftJoinAndSelect('productSizes.size', 'size')
        .leftJoinAndSelect('post.affiliateProducts', 'affiliateProducts')
        .leftJoinAndSelect('affiliateProducts.favoriteAffiliateProducts', 'favoriteAffiliateProducts')
        .leftJoinAndSelect('favoriteAffiliateProducts.consumer', 'affiliateConsumer')
        .leftJoinAndSelect('affiliateConsumer.user', 'affiliateUser')
        .where('post.id IN (:...postIds)', { postIds })
        .andWhere('post.deletedAt IS NULL')
        .getMany();
    
    const updatedPosts = posts.map((post) => ({
        ...post,
        affiliateProducts: post.affiliateProducts.map((affiliateProduct) => {
            const isFavorite = affiliateProduct.favoriteAffiliateProducts?.some(
                (fav) => fav.consumer.id === consumerId,
            );
            return {
                ...affiliateProduct,
                isFavorite: isFavorite || false, // Default to false if no match
            };
        }),
    }));

    return { posts: updatedPosts as unknown as Partial<Posts[]>, total };
  }


  async findById(id: number): Promise<Posts | null> {
    return this.postRepository.findOne({ where: { id } })
  }

  async postVisit(consumer_id, post_id) {
    const created_posts = this.postVisitRepository.create({
      consumer: consumer_id,
      post: post_id
    });
    return await this.postVisitRepository.save(created_posts)
  }

  async removeConsumerVisitedPost(consumer_id) {
    return this.postVisitRepository.delete({
      consumer: {
        id: consumer_id
      }
    })
  }

  async findRecentPostsWithPagination(
    selectStatement: object,
    page: number,
    limit: number,
    search?: string,
    status: string = 'All',
  ) {
    const skip = (page - 1) * limit;
    const where = {
      ...(status && status !== 'All' ? { status } : {}),
      ...(search ? { title: ILike(`%${search}%`) } : {}),
    };

    const conditions =
      status === 'All'
        ? [
            { ...where, status: 'Published' },
            { ...where, status: 'Draft' },
          ]
        : where;

    const [posts, total] = await this.postRepository.findAndCount({
      where: conditions,
      skip,
      take: limit,
      relations: [
        'influencer',
        'influencer.user',
        'postProduct.product',
        'postProduct.product.productSizes',
        'postProduct.product_favourites',
        'postProduct.product_favourites.consumer',
        'affiliateProducts',
        'affiliateProducts.favoriteAffiliateProducts',
        'affiliateProducts.favoriteAffiliateProducts.consumer',
        'affiliateProducts.favoriteAffiliateProducts.consumer.user',
        'affiliateProducts.favoriteAffiliateProducts.affiliateProduct',
      ],
      select: selectStatement,
      order: { updated_at: 'DESC' },
    });

    return { posts, total };
  }

  async deletePostsByInfluencerId(influencerId: number): Promise<number> {
    const deleteResult = await this.postRepository.delete({
      influencer: { id: influencerId },
      
    });

    return deleteResult.affected || 0;
  }
  async softDeletePostsByInfluencerId(influencerId: number): Promise<number> {
    const deleteResult = await this.postRepository.softDelete({
      influencer: { id: influencerId },
    });

    return deleteResult.affected || 0;
  }
  async restorSoftDeletePostsByInfluencerId(influencerId: number): Promise<number> {
    const deleteResult = await this.postRepository.restore({
      influencer: { id: influencerId },
    });

    return deleteResult.affected || 0;
  }

  async findPostsByInfluencerId(influencerId: number) {
    return this.postRepository.find({
      where:{influencer:{id: influencerId}}
    });

  }
  async findDeletedPostsByInfluencerId(influencerId: number) {
    return this.postRepository.find({
      where: { influencer: { id: influencerId } },
      withDeleted: true,
    });
  }
}
