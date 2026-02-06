import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BasketState } from './basket.reducer';

export const selectBasketState = createFeatureSelector<BasketState>('basket');

export const selectBasketItems = createSelector(
  selectBasketState,
  (state: BasketState) => state.items
);

export const selectBasketItemsCount = createSelector(
  selectBasketItems,
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectBasketTotal = createSelector(
  selectBasketItems,
  (items) => items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const selectBasketLoading = createSelector(
  selectBasketState,
  (state: BasketState) => state.loading
);

export const selectBasketError = createSelector(
  selectBasketState,
  (state: BasketState) => state.error
); 