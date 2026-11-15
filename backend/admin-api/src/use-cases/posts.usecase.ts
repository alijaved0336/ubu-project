import { Posts } from '@infrastructure/orm/entities/post.entity';
import { AffiliateProductRepository } from '@infrastructure/orm/reposiories/affiliate-product.repository';
import { AffliateRepository } from '@infrastructure/orm/reposiories/affliate.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { PostProductsRepository } from '@infrastructure/orm/reposiories/post-product.repository';
import { PostRepository } from '@infrastructure/orm/reposiories/post.repository';
import { ProductRepository } from '@infrastructure/orm/reposiories/product.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import {
  CreatePostDto,
  CreateProductDataDTO,
  MediaDto,
  MediaDtoWithLocationIndex,
  UpdatePostDto,
  UpdateProductDataDTO,
} from '@infrastructure/presentation/post/create-post.dto';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { AwsSpApiService } from '@infrastructure/services/aws-sp-api/aws-sp.service';
import { NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { ImageService } from '@infrastructure/services/image/image.service';
import { Readable } from 'stream';
import { FavouriteAffiliateProductRepository } from '@infrastructure/orm/reposiories/favourite-affiliate-product-repository';
import { VideoService } from '@infrastructure/services/video/video.service';
export class PostsUsecase {
  constructor(
    private influencersRepository: InfluencerRepository,
    private postsRepository: PostRepository,
    private productsRepository: ProductRepository,
    private postProductRepository: PostProductsRepository,
    private userRepo: UserRepository,
    private awsService: AwsS3Service,
    private affliateRepository: AffliateRepository,
    private awsSpApiService: AwsSpApiService,
    private videoService: VideoService,
    private affiliateProductRepository: AffiliateProductRepository,
    private imageService: ImageService,
    private fapRepository: FavouriteAffiliateProductRepository,
  ) {}

  async generateImagePlaceholders(s3Response: MediaDto[]): Promise<MediaDto[]> {
    try {
      const updatedS3Response = await Promise.all(
        (s3Response || [])?.map(async (mediaObj) => {
          if (mediaObj.type === 'video') return mediaObj;

          try {
            const imageBuffer = await this.downloadImage(mediaObj.url);
            const placeholderImage = await this.imageService.createTinyBlurImage(imageBuffer);
            const { width, height } = await this.imageService.getImageDimensions(imageBuffer);

            return {
              ...mediaObj,
              width,
              height,
              aspectRatio: width / height,
              placeholder: placeholderImage,
            };
          } catch (error) {
            return {
              ...mediaObj,
              placeholder: '',
            };
          }
        }),
      );

      return updatedS3Response;
    } catch (error) {
      return s3Response;
    }
  }

  async create(createPostDto: CreatePostDto, userId: number, files: Express.Multer.File[]) {
    const { title, body, status, productIds, tags, productData } = createPostDto;

    const influencer = await this.influencersRepository.findInfluncerByUserId(userId);
    if (influencer) {
      if (productData) {
        for (const product of productData) {
          const affiliateId = await this.affliateRepository.findAndAssignAffiliate(null, influencer.id);
          if (affiliateId) {
            const url = await this.awsSpApiService.addAffiliateLink(product.link, affiliateId);
            product['link'] = url; // Assign the URL to each product
          } else {
            throw new UnprocessableEntityException(
              'This post is linked to a third-party service (e.g., Amazon). The system has no available affiliate IDs to assign. Please contact customer support for assistance.',
            );
          }
        }
      }
      const payload: Partial<Posts> = { title, body, status };

      if (tags) {
        payload['tags'] = tags.split(',').map((tag) => tag.trim());
      }

      payload.influencer = influencer;

      if (payload.status == 'published') {
        payload.status = 'Published';
      }

      let savedPost = await this.postsRepository.create(payload);
      const folderName = `posts_new/${savedPost.id}`;

      if (files) {
        const compressedFiles = await Promise.all(
          files.map(async (file) => {
            if (file.mimetype.startsWith('video/')) {
              const firstCompressed = await this.videoService.compressVideo(file);
              return firstCompressed;
            }

            const compressedBuffer = await this.imageService.compressImage(file.buffer);
            return {
              ...file,
              buffer: compressedBuffer,
              size: compressedBuffer.length,
            };
          }),
        );
        await this.awsService.createFolder(folderName);
        const s3Response = await this.awsService.uploadMultipleFiles(compressedFiles, folderName);
        const updatedS3Response = await this.generateImagePlaceholders(s3Response);

        savedPost.media = updatedS3Response;
      }

      savedPost = await this.postsRepository.savePost(savedPost);

      if (productData && savedPost) {
        await this.affiliateProductRepository.createAffiliateProducts(productData, savedPost);
      }

      return savedPost;
    } else {
      throw new Error('Could not find Influencer');
    }
  }

  async findAllWithPagination(userId: number, page: number, limit: number, search?: string, status?: string) {
    const influencer = await this.influencersRepository.findInfluncerByUserId(userId);
    if (!influencer) throw new NotFoundException('Influencer not found');
    return await this.postsRepository.findAllWithPagination(influencer.id, page, limit, search, status);
  }

  async findOne(id: number): Promise<Posts | null> {
    return this.postsRepository.findOneWithRelation(id);
  }

  async optimizePostMedia(): Promise<unknown> {
    const posts = await this.postsRepository.findAllWithImages();

    if (!posts) return [];

    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        const folderName = `posts_new/${post.id}`;

        const updatedMedia = await Promise.all(
          post.media.map(async (mediaObj) => {
            if (mediaObj.type === 'video') {
              // Download the video file and create a Multer file object
              const videoBuffer = await this.downloadImage(mediaObj.url);
              const videoFile: Express.Multer.File = {
                fieldname: 'file',
                originalname: mediaObj.url.split('/').pop() || 'video.mp4',
                encoding: '7bit',
                mimetype: mediaObj.extension.startsWith('mp4') ? 'video/mp4' : `video/${mediaObj.extension}`,
                buffer: videoBuffer,
                size: videoBuffer.length,
                destination: '',
                filename: mediaObj.url.split('/').pop() || 'video.mp4',
                path: '',
                stream: Readable.from(videoBuffer),
              };
              return await this.videoService.compressVideo(videoFile);
            }

            try {
              return await this.processImageMedia(mediaObj, folderName);
            } catch (error) {
              console.error(`Error processing media: ${mediaObj.url}`, error);
              return mediaObj; // fallback to original if anything fails
            }
          }),
        );

        // Filter out any File objects to ensure type safety
        const filteredMedia = updatedMedia.filter(
          (media) =>
            typeof media === 'object' &&
            'url' in media &&
            'placeholder' in media &&
            'type' in media &&
            'extension' in media &&
            'size' in media &&
            'blurHash' in media &&
            'width' in media &&
            'height' in media &&
            'aspectRatio' in media,
        );
        await this.postsRepository.update(post.id, { media: filteredMedia });

        return {
          ...post,
          media: updatedMedia,
        };
      }),
    );

    return updatedPosts;
  }

  private async processImageMedia(mediaObj: MediaDto, folderName: string): Promise<MediaDto> {
    const downloadedBuffer = await this.downloadImage(mediaObj.url);
    const compressedBuffer = await this.imageService.compressImage(downloadedBuffer);
    const placeholderImage = await this.imageService.createTinyBlurImage(compressedBuffer);

    const originalSizeKB = downloadedBuffer.length / 1024;
    const fileName = this.extractFileName(mediaObj.url);

    // If large, compress, reupload and replace
    if (originalSizeKB >= 200) {
      await this.awsService.deleteFileByPath(mediaObj.url);

      const uploadedFile = await this.awsService.uploadFile(this.createMulterFile(`${fileName}.webp`, 'image/webp', compressedBuffer), folderName);

      const { width, height } = await this.imageService.getImageDimensions(compressedBuffer);

      return {
        ...mediaObj,
        url: uploadedFile.Location ?? '',
        placeholder: placeholderImage ?? '',
        size: uploadedFile.size,
        type: uploadedFile.ContentType.startsWith('image/') ? 'image' : 'video',
        extension: uploadedFile.Key?.split('.').pop() || '',
        width,
        height,
        aspectRatio: width / height,
        blurHash: mediaObj.blurHash,
      };
    }

    // Otherwise, return dimensions + placeholder only
    const { width, height } = await this.imageService.getImageDimensions(downloadedBuffer);
    return {
      ...mediaObj,
      placeholder: placeholderImage ?? '',
      width,
      height,
      aspectRatio: width / height,
      blurHash: mediaObj.blurHash,
    };
  }

  private extractFileName(url: string): string {
    const segments = url.split('/');
    return segments[segments.length - 1]?.split('.')?.[0] ?? 'image';
  }

  private createMulterFile(originalname: string, mimetype: string, buffer: Buffer): Express.Multer.File {
    return {
      fieldname: 'file',
      originalname,
      encoding: '7bit',
      mimetype,
      buffer,
      size: buffer.length,
      destination: '',
      stream: Readable.from(buffer),
      filename: originalname,
      path: '',
    };
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId, filesData: Express.Multer.File[], reqFrom): Promise<Posts | string | undefined> {
    const post = await this.postsRepository.findOneWithoutRelation(id);

    if (post) {
      const influencer = await this.influencersRepository.findInfluncerByUserId(userId);
      if (influencer) {
        const payload = {};
        const previousStatus = post.status;
        if (updatePostDto.title) {
          payload['title'] = updatePostDto.title;
        }

        // if (updatePostDto.productData) {
        //   payload['productData'] = updatePostDto.productData;
        // }

        if (updatePostDto.body) {
          payload['body'] = updatePostDto.body;
        }

        let newStatus = previousStatus;
        if (updatePostDto.status) {
          if (updatePostDto.status == 'published') {
            payload['status'] = 'Published';
            newStatus = 'Published';
          } else {
            payload['status'] = updatePostDto.status;
            newStatus = updatePostDto.status;
          }
        }

        if (updatePostDto.tags) {
          payload['tags'] = updatePostDto.tags.split(',').map((tag) => tag.trim());
        } else {
          payload['tags'] = null;
        }
        const payloadNew: Partial<Posts> = payload;
        // payloadNew.productData = updatePostDto.productData;
        const folderName = `posts_new/${id}`;

        let s3Response: MediaDto[] = [];
        let updatedS3Response: MediaDto[] = [];

        if (filesData && filesData.length > 0) {
          // first Delete already Uploaded Files With Same Names
          // await this.awsService.deleteConflictingFilesInFolder(folderName, filesData);
          // Upload the Files

          // Rename conflicting file names
          const updatedFilesData = await this.awsService.updateConflictingFilesName(folderName, filesData);
          const compressedFiles = await Promise.all(
            updatedFilesData.map(async (file) => {
              if (file.mimetype.startsWith('video/')) {
                const firstCompressed = await this.videoService.compressVideo(file);
                return firstCompressed;
              }

              const compressedBuffer = await this.imageService.compressImage(file.buffer);
              return {
                ...file,
                buffer: compressedBuffer,
                size: compressedBuffer.length,
              };
            }),
          );

          s3Response = await this.awsService.uploadMultipleFiles(compressedFiles as Express.Multer.File[], folderName);
          updatedS3Response = await this.generateImagePlaceholders(s3Response);

          payloadNew.media = updatedS3Response;
        }

        let urlData: MediaDto[] = [];

        if (updatePostDto.urls && updatePostDto.urls.length > 0) {
          urlData = await this.getUrlsInMediaDto(updatePostDto.urls);
          urlData = await this.mergeUrlData(urlData, updatedS3Response);
          // Delete Those Files That User has crossed from frontend
          await this.awsService.deleteUnwantedUploadedFiles(folderName, urlData);

          payloadNew.media = urlData;
        } else if (!s3Response.length) {
          // If the User has crossed all the images from frontend and has not uploaded any new image then
          // delete all the uploaded files and reset the media
          await this.awsService.deleteAllFilesInFolder(folderName);
          payloadNew.media = [];
        }
        const isUpdated = await this.postsRepository.update(post.id, payloadNew);
        if (isUpdated.affected == 1) {
          const savedPost = await this.postsRepository.findOneWithRelation(post.id);
          if (savedPost) {
            if (previousStatus === newStatus) {
              if (updatePostDto.productIds) {
                const products = await this.productsRepository.findByIds(updatePostDto.productIds);
                if (products.length !== updatePostDto.productIds.length) {
                  throw new NotFoundException('One or more products not found');
                } else {
                  this.postProductRepository.deleteByPostId(post.id);
                  const postProducts = products.map((product) => {
                    return this.postProductRepository.create({
                      post: savedPost,
                      product: product,
                    });
                  });
                }
              }
              if (updatePostDto.productData.length) {
                const productsWithId: UpdateProductDataDTO[] = [];
                const productsWithoutId: CreateProductDataDTO[] = [];
                const incomingProductIds = new Set<number>();

                updatePostDto.productData.forEach((product) => {
                  if (product.id) {
                    productsWithId.push(product);
                    incomingProductIds.add(parseInt(product.id, 10));
                  } else {
                    productsWithoutId.push(product);
                  }
                });

                for (const product of savedPost.affiliateProducts) {
                  if (!incomingProductIds.has(product.id)) {
                    await this.affiliateProductRepository.remove(product.id);
                  }
                }

                await this.affiliateProductRepository.createAffiliateProducts(productsWithoutId, savedPost);
              }
            } else {
              await this.handleFavoriteAffiliateProductsStatusChange(savedPost, previousStatus, newStatus);
            }
            return savedPost;
          } else {
            throw new Error('Could not update Post');
          }
        } else {
          throw new Error('Could not update Post');
        }
      } else {
        throw new Error('Could not find Influencer');
      }
    } else {
      throw new Error('Could not find post');
    }
  }

  private async handleFavoriteAffiliateProductsStatusChange(post: Posts, previousStatus: string, newStatus: string) {
    try {
      const minimalPost = { id: post.id } as Posts;
      const affiliateProducts = await this.affiliateProductRepository.findAllByPost(minimalPost);

      if (affiliateProducts && affiliateProducts.length > 0) {
        const affiliateProductIds = affiliateProducts.map((product) => product.id);

        if (newStatus.toLowerCase() === 'draft' && previousStatus.toLowerCase() !== 'draft') {
          await this.fapRepository.softDeleteByAffiliateProductIds(affiliateProductIds);
        } else if (previousStatus.toLowerCase() === 'draft' && newStatus.toLowerCase() === 'published') {
          await this.fapRepository.restoreByAffiliateProductIds(affiliateProductIds);
        }
      }
    } catch (error) {
      console.error('Error handling favorite affiliate products status change:', error);
    }
  }

  async remove(id: number) {
    const post = await this.postsRepository.findOneWithRelation(id);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    await this.postProductRepository.deleteByPostId(id);
    await this.postsRepository.remove(post.id);
    return { status: HttpStatus.OK, message: `deleted successfully` };
  }

  async getProducts(userId: number): Promise<any> {
    const influencer = await this.influencersRepository.findInfluncerByUserId(userId);
    if (!influencer) {
      throw new NotFoundException('Influencer not found');
    }
    const brandIds = await this.influencersRepository.getInfluencerCampaigns(influencer.id);
    return await this.productsRepository.getProductsByBrands(brandIds);
  }

  async getUrlsInMediaDto(urls: any): Promise<MediaDtoWithLocationIndex[]> {
    return await urls.map((data) => {
      const mediaDto = new MediaDtoWithLocationIndex();
      mediaDto.url = data.url;
      mediaDto.extension = data.extension;
      mediaDto.type = data.type;
      mediaDto.size = data.size ?? 0;
      mediaDto.locationIndex = data.locationIndex;
      mediaDto.placeholder = data.placeholder;
      mediaDto.width = data.width;
      mediaDto.height = data.height;
      mediaDto.aspectRatio = data.aspectRatio;
      return mediaDto;
    });
  }

  async getPostMedia(influencerId: number) {
    return await this.postsRepository.findUrlByInfluencerId(influencerId);
  }

  async downloadImages(urls: string[]): Promise<{ url: string; buffer: Buffer }[]> {
    const downloadPromises = urls.map((url) =>
      axios.get(url, { responseType: 'arraybuffer' }).then((response) => ({
        url,
        buffer: Buffer.from(response.data, 'binary'),
      })),
    );

    return Promise.all(downloadPromises);
  }

  async downloadImage(url: string): Promise<Buffer> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
  }

  async mergeUrlData(urlData: (MediaDto | MediaDtoWithLocationIndex)[], s3Response: MediaDto[]): Promise<MediaDtoWithLocationIndex[]> {
    if (!urlData.length) {
      return s3Response.map((item, index) => ({
        ...item,
        locationIndex: index.toString(),
      }));
    }

    const mergedData: MediaDtoWithLocationIndex[] = [];
    let s3Index = 0;

    const firstItem = urlData[0] as MediaDtoWithLocationIndex;
    const firstIndex = firstItem.locationIndex ? parseInt(firstItem.locationIndex) : 0;

    while (s3Index < s3Response.length && s3Index < firstIndex) {
      mergedData.push({
        ...s3Response[s3Index],
        locationIndex: s3Index.toString(),
      });
      s3Index++;
    }

    for (let i = 0; i < urlData.length; i++) {
      const currentItem = urlData[i] as MediaDtoWithLocationIndex;
      const currentIndex = currentItem.locationIndex ? parseInt(currentItem.locationIndex) : i;

      mergedData.push({
        ...currentItem,
        locationIndex: currentIndex.toString(),
      });

      if (i < urlData.length - 1) {
        const nextItem = urlData[i + 1] as MediaDtoWithLocationIndex;
        const nextIndex = nextItem.locationIndex ? parseInt(nextItem.locationIndex) : currentIndex + 1;

        // If the gap is greater than 1, add missing items from s3Response
        let gapSize = nextIndex - currentIndex - 1;
        while (s3Index < s3Response.length && gapSize > 0) {
          const newIndex = (currentIndex + 1).toString();
          mergedData.push({ ...s3Response[s3Index], locationIndex: newIndex });
          s3Index++;
          gapSize--;
        }
      }
    }

    // Append remaining items from s3Response
    while (s3Index < s3Response.length) {
      const lastIndex = mergedData.length ? parseInt(mergedData[mergedData.length - 1].locationIndex) : 0;
      const newIndex = (lastIndex + 1).toString();
      mergedData.push({ ...s3Response[s3Index], locationIndex: newIndex });
      s3Index++;
    }
    return mergedData;
  }
}
