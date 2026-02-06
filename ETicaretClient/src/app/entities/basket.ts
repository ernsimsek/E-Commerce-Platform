import { BasketItem } from './basket-item';

export interface Basket {
  id: string;
  userId: string;
  totalAmount: number;
  currency: string;
  items: BasketItem[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 