import { Injectable, InternalServerErrorException, Logger, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const ProductAdvertisingAPIv1 = require('paapi5-nodejs-sdk');

@Injectable()
export class AwsPaApiService {
  private readonly logger = new Logger(AwsPaApiService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Fetch product details from the Amazon Product Advertising API.
   * @returns Promise with product details or an error.
   */
  async fetchProductDetail(url: string): Promise<any> {
    try {
      const asin = await this.getAsinFromUrl(url);
      const apiClient = this.configureApiClient();
      const api = new ProductAdvertisingAPIv1.DefaultApi();
      const request = this.buildGetItemsRequest([asin]);
  
      const data = await this.executeApiCall(api, request);
      return this.formatResponse(data);
    } catch (error) {
      this.logger.error('Failed to fetch product details', error.stack);
      throw new  UnprocessableEntityException('Error fetching product details');
    }
  }

  /**
   * Configure the Amazon Product Advertising API client.
   * @returns Configured API client instance.
   */
  private configureApiClient(): any {
    const defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;
    defaultClient.accessKey = process.env.AWS_PA_API_ACCESS_KEY;
    defaultClient.secretKey = process.env.AWS_PA_API_SECRET_KEY;
    defaultClient.host = 'webservices.amazon.com';
    defaultClient.region = 'us-east-1';
    console.log('dkjaskjdaksjbdkajsb');
    console.log(defaultClient.accessKey);
    return defaultClient;
  }

  /**
   * Build the GetItemsRequest for the Product Advertising API.
   * @param itemIds List of ASINs to fetch details for.
   * @returns Constructed GetItemsRequest.
   */
  private buildGetItemsRequest(itemIds: string[]): any {
    const request = new ProductAdvertisingAPIv1.GetItemsRequest();
    request.PartnerTag = process.env.AMAZON_PARTNER_TAG;
    request.PartnerType = 'Associates';
    request.ItemIds = itemIds;
    request.Resources = ['Images.Variants.Large', 'ItemInfo.Title', 'Offers.Listings.Price', 'ItemInfo.ProductInfo', 'ItemInfo.Features'];
    return request;
  }
  
  /**
   * Execute the API call and return the response.
   * @param api API client instance.
   * @param request GetItemsRequest object.
   * @returns Response data from the API call.
   */
  private executeApiCall(api: any, request: any): Promise<any> {
    return new Promise((resolve, reject) => {
      api.getItems(request, (error, data) => {
        if (error) {
          this.logger.error('Error in API call', error);
          reject(new UnprocessableEntityException('Failed to fetch item details'));
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * Format the API response into a structured object.
   * @param data Raw response data from the API.
   * @returns Formatted product details.
   */
  private formatResponse(data: any): any {
    const response = ProductAdvertisingAPIv1.GetItemsResponse.constructFromObject(data);
    const itemsResult = response?.ItemsResult?.Items;

    if (!itemsResult || itemsResult.length === 0) {
      throw new InternalServerErrorException('No results found in API response');
    }

    const item = itemsResult[0];
    const priceInfo = item.Offers?.Listings?.[0]?.Price;
    return {
      attributes: {
        item_name: [
          {
            value: item.ItemInfo?.Title?.DisplayValue || null,
          },
        ],
        bullet_point: item.ItemInfo?.Features?.DisplayValues?.map((value) => ({ value })) || null,
      },
      price: priceInfo ? {
        amount: priceInfo.Amount,
      } : null,
      images: [
        {
          images: item.Images?.Variants.map((link) => ({
            link: link.Large?.URL,
          })),
        },
      ],
    };
  }

  async getAsinFromUrl(url) {
    const asinRegex = /\/([A-Z0-9]{10})(?:[/?]|$)/;
    const match = url.match(asinRegex);

    if (match && match[1]) {
      return match[1];
    } else {
      return 'ASIN not found in the URL';
    }
  }

  async addAffiliateLink(url, affiliateId = 'ubu0034-20') {
    const urlObj = new URL(url);
    urlObj.searchParams.set('tag', affiliateId);
    console.log(urlObj.toString());
    return urlObj.toString();
  }
}
