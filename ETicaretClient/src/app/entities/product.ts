export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  stock: number;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 