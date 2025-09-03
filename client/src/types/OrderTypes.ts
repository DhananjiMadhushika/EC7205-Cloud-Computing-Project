import { Product } from "./ProductType";
import { User } from "./UserTypes";

export interface Order {
  products: Product;
  id: number;
  userId: string;
  branchId:number;
  orderId: string;
  netAmount:string;
  name: string;
  address: string;
  branch: string;
  orderedProducts: string;
  date: string;
  status: string;
  amount: number;
  createdAt:string;
  updatedAt:string;
  agentId:number;
  repId:number;
  discountAmount: string
  user:User;
}
