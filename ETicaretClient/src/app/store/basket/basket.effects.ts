import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { BasketService } from '../../services/basket.service';
import * as BasketActions from './basket.actions';

@Injectable()
export class BasketEffects {
  loadBasketItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BasketActions.loadBasketItems),
      mergeMap(() =>
        this.basketService.getBasketItems().pipe(
          map((items) => BasketActions.loadBasketItemsSuccess({ items })),
          catchError((error) => of(BasketActions.loadBasketItemsFailure({ error })))
        )
      )
    )
  );

  addItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BasketActions.addItem),
      mergeMap(({ productId, quantity }) =>
        this.basketService.addItemToBasket(productId, quantity).pipe(
          map(() => BasketActions.addItemSuccess()),
          tap(() => BasketActions.loadBasketItems()),
          catchError((error) => of(BasketActions.addItemFailure({ error })))
        )
      )
    )
  );

  updateItemQuantity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BasketActions.updateItemQuantity),
      mergeMap(({ basketItemId, quantity }) =>
        this.basketService.updateItemQuantity(basketItemId, quantity).pipe(
          map(() => BasketActions.updateItemQuantitySuccess()),
          tap(() => BasketActions.loadBasketItems()),
          catchError((error) =>
            of(BasketActions.updateItemQuantityFailure({ error }))
          )
        )
      )
    )
  );

  removeItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BasketActions.removeItem),
      mergeMap(({ basketItemId }) =>
        this.basketService.removeItemFromBasket(basketItemId).pipe(
          map(() => BasketActions.removeItemSuccess()),
          tap(() => BasketActions.loadBasketItems()),
          catchError((error) => of(BasketActions.removeItemFailure({ error })))
        )
      )
    )
  );

  clearBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BasketActions.clearBasket),
      mergeMap(() =>
        this.basketService.clearBasket().pipe(
          map(() => BasketActions.clearBasketSuccess()),
          catchError((error) => of(BasketActions.clearBasketFailure({ error })))
        )
      )
    )
  );

  // Reload basket items after successful modifications
  reloadBasketItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        BasketActions.addItemSuccess,
        BasketActions.updateItemQuantitySuccess,
        BasketActions.removeItemSuccess
      ),
      map(() => BasketActions.loadBasketItems())
    )
  );

  constructor(
    private actions$: Actions,
    private basketService: BasketService
  ) {}
} 