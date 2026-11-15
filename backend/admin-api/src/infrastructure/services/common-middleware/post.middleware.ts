import { CreatePostDto } from '@infrastructure/presentation/post/create-post.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { ProductRepository } from '@infrastructure/orm/reposiories/product.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { Posts } from '@infrastructure/orm/entities/post.entity';
import { PostProductsRepository } from '@infrastructure/orm/reposiories/post-product.repository';
import { PostRepository } from '@infrastructure/orm/reposiories/post.repository';
import { integer } from 'aws-sdk/clients/cloudfront';

@Injectable()
export class PostMiddleware {
  constructor(
    private productRepository: ProductRepository,
    private influencersRepository: InfluencerRepository,
    private awsService: AwsS3Service,
    private postProductRepository: PostProductsRepository,
    private postRepository: PostRepository,
  ) {}
  async create(createPostDto: CreatePostDto, userId: number, files: Express.Multer.File[], postMedia: any, product_id: integer) {
    const { title, body, status } = createPostDto;
    const products = await this.productRepository.findByIds([product_id]);

    if (products.length == 0) {
      throw new NotFoundException('One or more products not found');
    } else {
      const influencer = await this.influencersRepository.findInfluncerByUserId(userId);
      if (influencer) {
        const payload: Partial<Posts> = { title, body, status };

        if (postMedia) {
          payload.media = postMedia;
        }

        if (files && files.length > 0) {
          const folderName = 'posts_new';
          await this.awsService.createFolder(folderName);
          const s3Response = await this.awsService.uploadMultipleFiles(files, folderName);
          payload.media = s3Response;
        }
        payload.status = 'published';
        payload.influencer = influencer;
        const savedPost = await this.postRepository.create(payload);
        const postProducts = products.map((product) => {
          return this.postProductRepository.create({
            post: savedPost,
            product: product,
          });
        });
        return savedPost;
      } else {
        throw new Error('Could not find Influencer');
      }
    }
  }
}
