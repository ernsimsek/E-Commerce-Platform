import { createReducer, on } from '@ngrx/store';
import { BasketItem } from '../../models/basket.model';
import * as BasketActions from './basket.actions';

export interface BasketState {
  items: BasketItem[];
  loading: boolean;
  error: any;
}

export const initialState: BasketState = {
  items: [],
  loading: false,
  error: null
};

export const basketReducer = createReducer(
  initialState,
  
  // Load Basket Items
  on(BasketActions.loadBasketItems, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(BasketActions.loadBasketItemsSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false
  })),
  on(BasketActions.loadBasketItemsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Add Item
  on(BasketActions.addItem, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(BasketActions.addItemSuccess, (state) => ({
    ...state,
    loading: false
  })),
  on(BasketActions.addItemFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Update Item Quantity
  on(BasketActions.updateItemQuantity, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(BasketActions.updateItemQuantitySuccess, (state) => ({
    ...state,
    loading: false
  })),
  on(BasketActions.updateItemQuantityFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Remove Item
  on(BasketActions.removeItem, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(BasketActions.removeItemSuccess, (state) => ({
    ...state,
    loading: false
  })),
  on(BasketActions.removeItemFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Clear Basket
  on(BasketActions.clearBasket, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(BasketActions.clearBasketSuccess, (state) => ({
    ...state,
    items: [],
    loading: false
  })),
  on(BasketActions.clearBasketFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
); 