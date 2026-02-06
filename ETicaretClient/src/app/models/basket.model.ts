export interface BasketItem {
  basketItemId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  pictureUrl?: string;
}

export interface Basket {
  id: string;
  userId: string;
  items: BasketItem[];
  paymentIntentId?: string;
  clientSecret?: string;
} 