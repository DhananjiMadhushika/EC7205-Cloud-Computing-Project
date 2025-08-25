// Updated types to support many-to-many relationship between Product and Color

export interface Category {
  id: string;
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface Color {
  id: string;
  _id: string;
  name: string;
  hexCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface ProductColor {
  id: string;
  productId: number;
  colorId: number;
  color: Color;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email?: string;
}

export interface Review {
  id: number;
  productId: number;
  orderId: number;
  userId: number;
  rating: number;
  comment?: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  productImage?: string;
  description?: string;
  volume?: number;
  price: string | number;
  stock?: number;
  
  // Category (one-to-many)
  categoryId?: number;
  category?: Category;
  
  // Colors (many-to-many) - NEW STRUCTURE
  colors?: ProductColor[];
  
  // Paint-specific properties
  finish?: string;
  coverage?: string;
  dryingTime?: string;
  coats?: number;
  isActive: boolean;
  
  createdAt: string;
  updatedAt: string;
  
  // Related data
  reviews?: Review[];
  _count?: {
    reviews: number;
  };
  
  // DEPRECATED: For backward compatibility during migration
  colorId?: number;
  color?: Color;
}

// For API responses
export interface ProductListResponse {
  count: number;
  data: Product[];
}

// For forms and API requests
export interface CreateProductRequest {
  name: string;
  volume?: number;
  price: number | string;
  stock?: number;
  productImage?: string;
  categoryId?: number;
  colorIds?: string[]; // Array of color IDs as strings
  finish?: string;
  coverage?: string;
  dryingTime?: string;
  coats?: number;
  isActive?: boolean;
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: number;
}

// Utility type for product with populated relations
export interface ProductWithDetails extends Product {
  category: Category;
  colors: ProductColor[];
  reviews: Review[];
}