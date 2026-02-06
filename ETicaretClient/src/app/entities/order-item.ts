import { Product } from './product';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
} 