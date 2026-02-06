import { Product } from './product';

export interface BasketItem {
  id: string;
  basketId: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
} 