export interface Color {
  _id: string;
  name: string;
  hexCode: string;
}

export interface CartProduct {
  _id: string;
  id: string; // Changed to string to match Product type
  name: string;
  price: number;
  productImage: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id?: string;
  product?: CartProduct;
  quantity: number;
  color?: Color | null;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

export interface OrderProduct {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  totalPrice: number;
  color?: Color | null;
}