import { createAction, props } from '@ngrx/store';
import { BasketItem } from '../../models/basket.model';

// Load Basket Items
export const loadBasketItems = createAction('[Basket] Load Basket Items');
export const loadBasketItemsSuccess = createAction(
  '[Basket] Load Basket Items Success',
  props<{ items: BasketItem[] }>()
);
export const loadBasketItemsFailure = createAction(
  '[Basket] Load Basket Items Failure',
  props<{ error: any }>()
);

// Add Item
export const addItem = createAction(
  '[Basket] Add Item',
  props<{ productId: string; quantity: number }>()
);
export const addItemSuccess = createAction(
  '[Basket] Add Item Success'
);
export const addItemFailure = createAction(
  '[Basket] Add Item Failure',
  props<{ error: any }>()
);

// Update Item Quantity
export const updateItemQuantity = createAction(
  '[Basket] Update Item Quantity',
  props<{ basketItemId: string; quantity: number }>()
);
export const updateItemQuantitySuccess = createAction(
  '[Basket] Update Item Quantity Success'
);
export const updateItemQuantityFailure = createAction(
  '[Basket] Update Item Quantity Failure',
  props<{ error: any }>()
);

// Remove Item
export const removeItem = createAction(
  '[Basket] Remove Item',
  props<{ basketItemId: string }>()
);
export const removeItemSuccess = createAction(
  '[Basket] Remove Item Success'
);
export const removeItemFailure = createAction(
  '[Basket] Remove Item Failure',
  props<{ error: any }>()
);

// Clear Basket
export const clearBasket = createAction('[Basket] Clear Basket');
export const clearBasketSuccess = createAction('[Basket] Clear Basket Success');
export const clearBasketFailure = createAction(
  '[Basket] Clear Basket Failure',
  props<{ error: any }>()
); 