import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BasketItem } from '../../models/basket.model';
import * as BasketActions from '../../store/basket/basket.actions';
import * as BasketSelectors from '../../store/basket/basket.selectors';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basketItems$: Observable<BasketItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  itemsCount$: Observable<number>;
  total$: Observable<number>;

  constructor(private store: Store) {
    this.basketItems$ = this.store.select(BasketSelectors.selectBasketItems);
    this.loading$ = this.store.select(BasketSelectors.selectBasketLoading);
    this.error$ = this.store.select(BasketSelectors.selectBasketError);
    this.itemsCount$ = this.store.select(BasketSelectors.selectBasketItemsCount);
    this.total$ = this.store.select(BasketSelectors.selectBasketTotal);
  }

  ngOnInit(): void {
    this.store.dispatch(BasketActions.loadBasketItems());
  }

  updateQuantity(basketItemId: string, quantity: number): void {
    if (quantity > 0) {
      this.store.dispatch(BasketActions.updateItemQuantity({ basketItemId, quantity }));
    }
  }

  removeItem(basketItemId: string): void {
    this.store.dispatch(BasketActions.removeItem({ basketItemId }));
  }

  clearBasket(): void {
    this.store.dispatch(BasketActions.clearBasket());
  }
} 