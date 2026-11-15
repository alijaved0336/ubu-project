import { extractCleanAmazonUrl } from '@infrastructure/utils/helper';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AwsSpApiService {
  constructor() {}

  async convertColorToHex(color: string): Promise<string> {
    const str = color;

    // Split by ' - '
    const parts = str.split(' - ');
    const firstPart = parts[0];

    // Split first part by spaces
    const words = firstPart.split(' ');

    // Check if it's a single word or not
    let result;
    if (words.length === 1) {
      result = words[0]; // If there's only one word, return it
    } else {
      result = words[words.length - 1]; // If multiple words, return the last one
    }
    console.log(result);
    return result;
  }

  async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async authenticate(refreshToken: string, tokenExpiry: Date) {
    const clientId = process.env.AWS_SP_CLIENT_ID;
    const clientSecret = process.env.AWS_SP_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Client ID or Client Secret is not defined in environment variables');
    }

    const currentTime = new Date().getTime();
    const expiryTime = new Date(tokenExpiry).getTime();

    if (1) {
      const object = await this.refreshToken(clientId, clientSecret, refreshToken);
      return object;
    }

    throw new Error('Access token is still valid, no need to refresh.');
  }

  async refreshToken(clientId: string, clientSecret: string, refreshToken: string) {
    try {
      const payload = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      });
      console.log(payload);
      const response = await axios.post(`https://api.amazon.com/auth/o2/token`, payload.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token, // Corrected to refer to the correct property
        expiresIn: response.data.expires_in,
      };
    } catch (error) {
      if (error.response) {
        // The request was made, but the server responded with a status code outside of the 2xx range
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made, but no response was received
        console.error('Request data:', error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Error message:', error.message);
      }
      throw new Error('Failed to refresh token');
    }
  }

  async fetchProducts(access_token: string, sellerId: string) {
    try {
      // Define the base URL
      const baseUrl = 'https://sandbox.sellingpartnerapi-na.amazon.com/listings/2021-08-01/items';

      // Define the seller ID and SKU (You may want to pass these as parameters if they are dynamic)
      const sku = '{sku}'; // Replace with actual SKU or make it dynamic

      // Define the full URL with query parameters

      const url = `${baseUrl}/${sellerId}/${sku}?marketplaceIds=ATVPDKIKX0DER&includedData=summaries,attributes,issues,offers,fulfillmentAvailability`;

      // Make the GET request to the SP API
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'x-amz-access-token': access_token,
          'Content-Type': 'application/json',
        },
      });

      // Handle the response
      console.log('Product Data:', response.data);

      // Return the response data
      console.log('products fetching......');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching product data:', error.response ? error.response.data : error.message);
      throw new Error('Failed to fetch product data');
    }
  }

  async getAuthenticatedUrl(brand: number) {
    const baseUrl = process.env.AWS_BASE_URL;
    const applicationId = process.env.AWS_APPLICATION_ID;
    const state = brand; // You can dynamically set this as needed
    const version = 'beta'; // You can dynamically set this as needed
    const redirectUrl = `${baseUrl}apps/authorize/consent?application_id=${applicationId}&state=${state}&version=${version}`;
    return { url: redirectUrl };
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
    const cleanedUrl = extractCleanAmazonUrl(url);
    const urlObj = new URL(cleanedUrl);
    urlObj.searchParams.set('tag', affiliateId);
    console.log(urlObj.toString());
    return urlObj.toString();
  }

  async fetchProductDetail(access_token: string, url: string) {
    const asin = await this.getAsinFromUrl(url);

    try {
      const response = await axios.get(
        `https://sellingpartnerapi-na.amazon.com/catalog/2022-04-01/items/${asin}?marketplaceIds=ATVPDKIKX0DER&includedData=attributes,relationships,classifications,dimensions,summaries,images`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-amz-access-token': access_token,
          },
        },
      );

      return response.data; // Return product details from the API response
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw new Error('Failed to fetch product details');
    }
  }

  async fetchAvailableColors(access_token: string, parentAsin: string) {
    let colorsArray: string[] = []; // Array to store all colors
    try {
      const response = await axios.get(
        `https://sellingpartnerapi-na.amazon.com/catalog/2022-04-01/items/${parentAsin}?marketplaceIds=ATVPDKIKX0DER&includedData=attributes,relationships,classifications,dimensions,summaries,images`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-amz-access-token': access_token,
          },
        },
      );
      if (response.data.relationships) {
        const asians = response.data.relationships[0].relationships[0].childAsins;
        for (const asin of asians) {
          const response = await axios.get(
            `https://sellingpartnerapi-na.amazon.com/catalog/2022-04-01/items/${asin}?marketplaceIds=ATVPDKIKX0DER&includedData=attributes,relationships,classifications,dimensions,summaries,images`,
            {
              headers: {
                'Content-Type': 'application/json',
                'x-amz-access-token': access_token,
              },
            },
          );
          await this.sleep(1000);
          try {
            //console.log(response.data)
            //console.log(await this.convertColorToHex(response.data.summaries[0].color)); // Outputs: #FF0000
            colorsArray.push(await this.convertColorToHex(response.data.summaries[0].color));
            if (colorsArray.length > 20) {
              colorsArray = [...new Set(colorsArray)];
              return colorsArray; // Return product details from the API response
            }
          } catch (errors) {
            console.log(errors);
          }
        }
      }
      colorsArray = [...new Set(colorsArray)];
      return colorsArray; // Return product details from the API response
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw new Error('Failed to fetch product details');
    }
  }
}
