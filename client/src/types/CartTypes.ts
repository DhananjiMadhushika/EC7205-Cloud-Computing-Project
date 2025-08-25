import { Product } from "./ProductType";

export type CartItem = {
    id?: number;
    quantity?: number;
    product?: Product;
    branchId?: number;
    branchName?: string;
  };