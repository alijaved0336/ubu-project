import { IBrand } from './brand.interface';

// template.interface.ts
export interface ITemplate {
  id: number;
  title?: string;
  heading?: string;
  description?: string;
  signature?: string;
  footer?: string;
  content: any; // JSON for custom template content
  brandId: number; // Foreign Key to Brand

  brand?: IBrand; // Relation to Brand entity
}
