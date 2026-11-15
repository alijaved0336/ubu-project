import { float } from 'aws-sdk/clients/cloudfront';

export interface IProductSize {
  id: number;
  size_id: number;
  product_id: number;
  updated_at: Date;
  created_at: Date;
}
