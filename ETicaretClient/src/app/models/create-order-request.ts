import { Address } from '../entities/address';
import { PaymentMethod } from '../entities/payment-method';

export interface CreateOrderRequest {
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
} 