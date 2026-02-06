import { OrderItem } from './order-item';
import { Address } from './address';
import { PaymentMethod } from './payment-method';

export enum OrderStatus {
  Pending = 'Pending',
  PaymentReceived = 'PaymentReceived',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
} 