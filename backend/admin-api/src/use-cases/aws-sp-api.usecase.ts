import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { AwsSpApiService } from '@infrastructure/services/aws-sp-api/aws-sp.service';
import { BadRequestException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import axios from 'axios';
import { CredsType } from '@infrastructure/orm/entities/oauth-credentials.entity';
import { OAuthCredentialsRepository } from '@infrastructure/orm/reposiories/oath-credentials.repository';
import { CreatePostDto } from '@infrastructure/presentation/post/create-post.dto';
import { CreateProductDto } from '@infrastructure/presentation/product/product.dto';
import { ProductMiddleware } from '@infrastructure/services/common-middleware/product.middleware';
import * as Color from 'color';
import { AffliateRepository } from '@infrastructure/orm/reposiories/affliate.repository';
import { SocialIntegrationRepository } from '@infrastructure/orm/reposiories/social-integration.repository';
import { PostMiddleware } from '@infrastructure/services/common-middleware/post.middleware';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { CampaignQueueService } from '@infrastructure/queue/queue.service';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { AffliateProductableRepository } from '@infrastructure/orm/reposiories/affliate-productable.repository';
import { AwsPaApiService } from '@infrastructure/services/aws-pa-api/aws-pa.service';
import { AMAZON_REGEX } from '@infrastructure/utils/regex';
export class AwsSpApiUsecase {
  constructor(
    private brandRepository: BrandRepository,
    private awsSpApiService: AwsSpApiService,
    private oAuthCredentialsRepository: OAuthCredentialsRepository,
    private productMiddleware: ProductMiddleware,
    private affliateRepository: AffliateRepository,
    private socialIntegrationRepository: SocialIntegrationRepository,
    private postMiddleware: PostMiddleware,
    private influencerRepository: InfluencerRepository,
    private campaignRepository: CampaignRepository,
    private publishCampaign: CampaignQueueService,
    private awsService: AwsS3Service,
    private affliateProductableRepository: AffliateProductableRepository,
    private awsPaApiService: AwsPaApiService,
  ) {}

  async getAuthenticatedUrl(brandID: number) {
    return this.awsSpApiService.getAuthenticatedUrl(brandID);
  }

  async getCredentialsFromAws(query: any, brandID: number) {
    // Extract the authorization code from the query parameters
    const { spapi_oauth_code, selling_partner_id } = query;
    // Prepare the payload for the token request
    const client_id = process.env.AWS_SP_CLIENT_ID || '';
    const client_secret = process.env.AWS_SP_CLIENT_SECRET || '';
    const payload = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: process.env.AWS_SP_API_REDIRECTURI || '',
      code: spapi_oauth_code,
    });
    try {
      const response = await axios.post('https://api.amazon.com/auth/o2/token', payload.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      if (response.data) {
        this.storeCredentials(response.data, brandID, selling_partner_id);
        return response.data; // Return the token response
      }
    } catch (error) {
      console.error('Error fetching token:', error.response ? error.response.data : error.message);
      throw new Error('Failed to fetch token');
    }
  }

  async storeCredentials(data, brandId, selling_partner_id) {
    const secondsToAdd = data.expires_in; // Input in seconds
    const currentTime = Date.now(); // Current time in milliseconds
    const futureTime = new Date(currentTime + secondsToAdd * 1000);
    let oauthCredentials = await this.oAuthCredentialsRepository.getFirstRecord();
    if (!oauthCredentials) {
      const payload = {
        refresh_token: data.refresh_token,
        access_token: data.access_token,
        token_expiry: futureTime,
        brand: { id: brandId }, // Assuming you have a relationship set up with the Brand entity
        seller_id: selling_partner_id,
        creds_type: CredsType.AMAZON,
      };
      const response = this.oAuthCredentialsRepository.create(payload);
    } else {
      oauthCredentials.refresh_token = data.refresh_token;
      oauthCredentials.access_token = data.access_token;
      oauthCredentials.token_expiry = futureTime;
      oauthCredentials.seller_id = selling_partner_id;
      await this.oAuthCredentialsRepository.saveObject(oauthCredentials);
    }

    this.awsSpApiService.fetchProducts(data.access_token, selling_partner_id);
  }

  async fetchActiveListings(brandId: number) {
    const creds = await this.fetchCredentialsFromDb(brandId);
    return this.awsSpApiService.fetchProducts(creds.access_token, creds.seller_id);
  }

  async fetchCredentialsFromDb(brandId: number) {
    let oauthCredentials = await this.oAuthCredentialsRepository.getFirstRecord();
    if (!oauthCredentials) {
      const objectUrl = await this.getAuthenticatedUrl(brandId);

      throw new NotFoundException(`Brand creds not found, first authenticate with Amazon, URL ${objectUrl.url}`);
    } else {
      const currentTime = new Date().getTime();
      const expiryTime = new Date(oauthCredentials.token_expiry).getTime();
      if (1) {
        const object = await this.awsSpApiService.authenticate(oauthCredentials.refresh_token, oauthCredentials.token_expiry);
        if (object) {
          oauthCredentials.access_token = object.accessToken;
          oauthCredentials.refresh_token = object.refreshToken;
          const secondsToAdd = object.expiresIn; // Input in seconds
          const currentTime = Date.now(); // Current time in milliseconds
          const futureTime = new Date(currentTime + secondsToAdd * 1000);
          oauthCredentials.token_expiry = futureTime;
          await this.oAuthCredentialsRepository.saveObject(oauthCredentials);
        }
      }
    }
    return {
      access_token: oauthCredentials.access_token,
      seller_id: oauthCredentials.seller_id,
    };
  }

  async getAsinFromUrl(url) {
    return this.awsSpApiService.getAsinFromUrl(url);
  }

  async addAffiliateLink(url) {
    const asian = await this.awsSpApiService.getAsinFromUrl(url);
    return {
      affliated_link: await this.awsSpApiService.addAffiliateLink(url),
      asian: asian,
    };
  }

  async publishPosttoUBUAndInsta(url, userId: number, save_data: boolean, brandId: number) {
    const brand = await this.brandRepository.findOne(brandId);
    const influncer = await this.influencerRepository.findInfluncerByUserId(userId);
    if (influncer && brand) {
      const affliateTag = await this.affliateRepository.findAndAssignAffiliate(brand.id, influncer.id);

      if (affliateTag) {
        const affliateUrl = await this.awsSpApiService.addAffiliateLink(url, affliateTag);
        let image = '';
        const data = await this.fetchAndSaveProduct(url, userId, save_data, brandId, affliateUrl);
        if (data) {
          image = data.images[0].images[0].link;

          await this.writePost(userId, image, `helo, this is also a sample post ${affliateUrl}`);
        }
      } else {
        throw new NotFoundException(`No more Affliate id's available.Please contact customer support for this.`);
      }
    }
  }

  async generateAffliateLink(url: string, brandId: number, influncerId: number) {}

  async fetchAndSaveProduct(url, userId: number, save_data: boolean, brandId: number, affliateUrl: string) {
    console.log('start in here====================', affliateUrl);
    try {
      const creds = await this.fetchCredentialsFromDb(1);

      const productData = await this.awsSpApiService.fetchProductDetail(creds.access_token, url);

      const response = productData;
      const createProductDto = new CreateProductDto();
      createProductDto.name = response.attributes?.item_name?.[0]?.value || 'Default Product Name';
      createProductDto.description = response.attributes?.bullet_point?.map((bp) => bp.value).join(', ') || 'Default Description';
      createProductDto.price = response.attributes.list_price?.[0]?.value || 0; // Default price to 0 if not available
      createProductDto.currency = response.list_price?.[0]?.currency || 'USD'; // Default currency to USD
      createProductDto.category_id = 1;
      createProductDto.sub_category_id = 46;

      if (response.attributes?.target_gender?.[0]?.value === 'male') {
        createProductDto.gender_id = 1; // Assuming 2 represents male
      } else if (response.attributes?.target_gender?.[0]?.value === 'female') {
        createProductDto.gender_id = 2; // Assuming 1 represents female
      }

      createProductDto.productLink = affliateUrl;
      createProductDto.style_id = 4;
      createProductDto.status = true;
      createProductDto.tags = response.attributes?.item_type_keyword?.map((kw) => kw.value) || [];
      createProductDto.measurement = [
        {
          size: 7,
          dimensions: 'some-dimension-value',
          active: false,
        },
      ];
      // createProductDto.colors = response.attributes?.color?.flatMap((color: any) => color.standardized_values || [color.value]
      const colors_obj = this.color_map([response.attributes?.color[0].value]);
      createProductDto.colors = colors_obj;
      console.log('.................................product dto making.....................');
      let media: {
        url: string;
        type: 'video' | 'image';
        extension: string;
        thumbnail: string;
      }[] = [];

      response.images.forEach((imageSet: any) => {
        imageSet.images.forEach((image: any) => {
          const extension = image.link.split('.').pop(); // Get the file extension

          const mediaType = extension === 'mp4' || extension === 'avi' ? 'video' : 'image'; // Determine type

          media.push({
            url: image.link,
            type: mediaType,
            extension: extension || '',
            thumbnail: mediaType === 'video' ? 'https://ubu-staging.s3.us-east-2.amazonaws.com/posts/video-outline.svg' : '',
          });
        });
      });
      if (save_data) {
        const savedProduct = await this.productMiddleware.create(createProductDto, [], brandId, media);
        console.log('.................................product created....................', savedProduct);

        const createPostDto = new CreatePostDto();
        createPostDto.title = savedProduct.name;
        createPostDto.body = savedProduct.description;
        const savedPost = await this.postMiddleware.create(createPostDto, userId, [], media, savedProduct.id);
        console.log('.................................post created....................', savedPost);

        // try {
        //   if (response.relationships && response.relationships.length > 0) {
        //     const firstRelationship = response.relationships[0].relationships[0];

        //     if (firstRelationship.parentAsins && firstRelationship.parentAsins.length > 0) {
        //       try {
        //         this.fetchRemaingData(
        //           creds.access_token,
        //           firstRelationship.parentAsins[0],
        //           savedProduct.id
        //         );
        //       } catch (error) {
        //         console.error("Error fetching remaining data:", error);
        //         // Additional error handling or fallback logic can go here
        //       }
        //     }

        //     if (firstRelationship.childAsins && firstRelationship.childAsins.length > 0) {
        //       return firstRelationship.childAsins[0];
        //     }
        //   }
        // } catch (error) {
        //   console.error("Error processing relationships:", error);
        //   // Additional error handling or fallback logic can go here
        // }
      }
      this.saveDemoProductForAffiliate(createProductDto, media, affliateUrl);
      return await this.awsSpApiService.fetchProductDetail(creds.access_token, url);
    } catch (error) {
      console.error('Error processing product:', error);
    }
  }

  async fetchRemaingData(access_token: string, parentAsin: string, savedProduct: number) {
    const result = await this.awsSpApiService.fetchAvailableColors(access_token, parentAsin);
    const colors_array = this.color_map(result);
    this.productMiddleware.update(savedProduct, colors_array);
  }

  color_map(colors_name: string[]) {
    let final_obj = {};
    for (let i = 0; i < colors_name.length; i++) {
      const color_name = colors_name[i];
      if (typeof color_name === 'string' && color_name) {
        const lower_color_name = color_name.toLowerCase();
        let color_code: string | null = null;
        try {
          color_code = Color(lower_color_name).hex();
        } catch (error) {
          console.error(`Error parsing color: ${lower_color_name}`, error);
          color_code = null; // Set color_code to null if parsing fails
        }

        final_obj[`${lower_color_name}`] = color_code;
      } else {
        console.warn(`Skipping invalid color name: ${color_name}`);
      }
    }
    return final_obj;
  }

  async writePost(user_id: number, imageUrl: string, caption: string) {
    const user = await this.socialIntegrationRepository.findByUserId(user_id);
    const mediaPostUrl = `https://graph.instagram.com/v20.0/${user?.social_user_id}/media?access_token=${user?.access_token}`;
    const mediaData = {
      image_url: imageUrl,
      caption: caption,
      link: imageUrl,
    };
    try {
      const response = await axios.post(mediaPostUrl, mediaData);
      const publishUrl = `https://graph.instagram.com/v20.0/${user?.social_user_id}/media_publish?access_token=${user?.access_token}`;
      const publishData = {
        creation_id: response.data.id,
      };
      const respponse2 = await axios.post(publishUrl, publishData);
      return 'sucessfully uploaded';
    } catch (error) {
      console.log(error);
      // Handle any errors that occur during the request
      console.error('Error creating Instagram media:', error.response?.data || error.message);
      throw new Error('Failed to create Instagram media');
    }
  }

  async fetchProductDetail(campaignId: number) {
    let url = '';
    const campaign = await this.campaignRepository.getOneWithLatestDocument(campaignId);
    if (!campaign) {
      throw new NotFoundException('Campaign Not Found');
    } else if (campaign && !campaign.exhibitDocuments?.[0]) {
      throw new NotFoundException('Campaign Document Not Found');
    }
    const document = await campaign?.exhibitDocuments?.[0];
    const campaignData = campaign;
    let productData = {};
    if (document && document?.advertisemntUrl) {
      url = document.advertisemntUrl;
      const creds = await this.fetchCredentialsFromDb(1);
      // productData = await this.awsSpApiService.fetchProductDetail(
      //   creds.access_token,
      //   url,
      // );
      productData = await this.awsPaApiService.fetchProductDetail(url);
    }

    return { amazonProductInfo: productData, campaign: campaignData, document: document };
  }

  async writeMultiplePost(user_id: number, imageUrls: string[], caption: string) {
    const user = await this.socialIntegrationRepository.findByUserId(user_id);
    const accessToken = user?.access_token;
    const igUserId = user?.social_user_id;
    console.log('....................................insta');

    const containerIds: string[] = []; // Array to store each item's container ID

    try {
      // Step 1: Create an item container for each image in the carousel
      console.log('....................................step 1 start');

      for (const imageUrl of imageUrls) {
        console.log('=============imageUrl============', imageUrl);
        const mediaPostUrl = `https://graph.instagram.com/v21.0/${user?.social_user_id}/media?access_token=${user?.access_token}&is_carousel_item=true&image_url=${imageUrl}`;
        const response = await axios.post(mediaPostUrl);
        containerIds.push(response.data.id); // Collect the container ID for each item
      }

      // Step 2: Create the carousel container with the collected item container IDs
      const carouselContainerData = {
        caption: caption,
        media_type: 'CAROUSEL', // Set to 'CAROUSEL' to indicate this is a carousel
        children: containerIds, // Pass the array of item container IDs directly
      };
      console.log('....................................step 2 start');

      const mediaPostUrl = `https://graph.instagram.com/v21.0/${user?.social_user_id}/media?caption=${caption}&media_type=CAROUSEL&children=${containerIds.join(',')}&access_token=${user?.access_token}`;

      const carouselContainerResponse = await axios.post(mediaPostUrl);
      const carouselContainerId = carouselContainerResponse.data.id;

      // Step 3: Publish the carousel container
      console.log('....................................step 3 start----------------');

      const publishUrl = `https://graph.instagram.com/v20.0/${user?.social_user_id}/media_publish?access_token=${user?.access_token}`;
      const publishData = {
        creation_id: carouselContainerId,
      };
      const respponse2 = await axios.post(publishUrl, publishData);
      return 'sucessfully uploaded';
    } catch (error) {
      console.log('.......................error', error);
      throw new BadRequestException('Something went wrong');
    }
  }

  async publishAmazonToInstagram(body, userId) {
    const user = await this.socialIntegrationRepository.findByUserId(userId);
    if (!user?.id) {
      return new NotFoundException(`No instagram credentials for this user.`);
    }
    const { description, url, brand_id, media, campaign_id } = body;

    const brand = await this.brandRepository.findOne(brand_id);
    const influncer = await this.influencerRepository.findInfluncerByUserId(userId);

    if (!influncer || !brand) {
      throw new NotFoundException(`Brand or Influencer not found`);
    }
    const affliateTag = await this.affliateRepository.findAndAssignAffiliate(brand.id, influncer.id);

    if (affliateTag) {
      await this.publishCampaign.publishAmazonToInstagramAndUbu(userId, media, `\n${description} \n`, url, brand.id, url, campaign_id);
      return 'Please wait. We will notify you when the content is published.';
    } else {
      throw new NotFoundException(`No more Affliate id's available.Please contact customer support for this.`);
    }
  }

  async publishLocalToInstagram(body, userId, media) {
    const user = await this.socialIntegrationRepository.findByUserId(userId);
    if (!user?.id) {
      return new NotFoundException(`No instagram credentials for this user.`);
    }

    const { description, brand_id, campaign_id } = body;

    const brand = await this.brandRepository.findOne(brand_id);
    const influncer = await this.influencerRepository.findInfluncerByUserId(userId);

    if (!influncer || !brand) {
      throw new NotFoundException(`Brand or Influencer not found`);
    }

    let files;
    try {
      if (media) {
        const folderName = 'products_new';
        await this.awsService.createFolder(folderName);
        const s3Response = await this.awsService.uploadMultipleFiles(media, folderName);
        files = s3Response;
      }
    } catch (error) {
      console.log('...................error in start', error);
    }

    files = files.map((media) => media.url);
    this.publishCampaign.publishLocalToInstagramAndUbu(userId, files, `\n${description}`, campaign_id);
    return 'Please wait. We will notify you when the content is published.';
  }

  async saveDemoProductForAffiliate(createProductDto: CreateProductDto, media, affliateUrl) {
    const newProductPayload = [
      {
        title: createProductDto.name,
        body: createProductDto.description,
        images: media,
        tags: 'affiliate, product',
        category: 'Garments',
        style: 'Modern',
        price: createProductDto.price + '' + createProductDto.currency,
        affiliate_link: affliateUrl,
      },
    ];

    await this.affliateProductableRepository.create(newProductPayload);
  }

  async fetchAwsProduct(amazon_url: string) {
    const amazon_encoded_link = amazon_url.trim();

    if (!AMAZON_REGEX.test(amazon_encoded_link)) {
      throw new BadRequestException('The provided link is not a valid Amazon URL.');
    }

    // Check if the link is a short URL (e.g., starts with "https://a.co/")
    const isShortUrl = amazon_encoded_link.startsWith('https://a.co/') || amazon_encoded_link.startsWith('http://a.co/');

    let fullLink = amazon_encoded_link;

    // Resolve the short URL if applicable
    if (isShortUrl) {
      try {
        const resolvedLink = await this.resolveShortUrl(amazon_encoded_link);
        fullLink = resolvedLink;
      } catch (error) {
        throw new UnprocessableEntityException(`Failed to resolve short URL: ${error.message}`);
      }
    } else {
      // Decode the long URL
      fullLink = decodeURIComponent(amazon_encoded_link);
    }

    // Fetch credentials and product details
    // const creds = await this.fetchCredentialsFromDb(1);
    // const productData = await this.awsSpApiService.fetchProductDetail(
    //   creds.access_token,
    //   fullLink,
    // );

    const productData = await this.awsPaApiService.fetchProductDetail(fullLink);

    return productData;
  }

  // Helper function to resolve short URLs
  private async resolveShortUrl(shortUrl: string): Promise<string> {
    try {
      const axios = require('axios');
      const response = await axios.get(shortUrl, {
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400,
      });

      // Get the redirected URL from the "Location" header
      const redirectedUrl = response.headers.location;
      if (!redirectedUrl) {
        throw new Error('Redirected URL not found');
      }

      return redirectedUrl;
    } catch (error) {
      throw new Error(`Failed to resolve short URL: ${error.message}`);
    }
  }
}
