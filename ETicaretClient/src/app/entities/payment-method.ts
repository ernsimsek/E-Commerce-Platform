export interface PaymentMethod {
  type: string;
  cardNumber: string;
  cardHolderName: string;
  expirationDate: string;
  cvv: string;
} 