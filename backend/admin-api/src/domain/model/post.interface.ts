export interface IPost {
  id: number;
  title: string;
  body: string;
  status: string;
  product_data?: ProductData[];
  updated_at: Date;
  created_at: Date;
}

export interface ProductData {
  title: string;
  description: string;
  images: string[]; // Array of image URLs
  link: string;
}
