import { IBrand } from "./brand.interface";

// template.interface.ts
export interface ITemplate {
  id: string;
  title?: string;
  heading?: string;
  description?: string;
  signature?: string;
  footer?: string;
  content: any; // JSON for custom template content
  brandId: string; // Foreign Key to Brand

  brand?: IBrand; // Relation to Brand entity

}
