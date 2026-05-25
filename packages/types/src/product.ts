export type ProductType = "PHYSICAL" | "DIGITAL" | "VARIABLE" | "BUNDLE";
export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED" | "OUT_OF_STOCK";

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  rating: number;
  reviewCount: number;
  type: ProductType;
  status: ProductStatus;
  inStock: boolean;
}

export interface ProductVariantOption {
  id: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  attributes: Record<string, string>;
  inStock: boolean;
  quantity?: number;
}

export interface FilterOptions {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  tags?: string[];
  attributes?: Record<string, string[]>;
  search?: string;
}
