import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Basket, BasketItem } from '../models/basket.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private baseUrl = environment.apiUrl + 'baskets';

  constructor(private http: HttpClient) {}

  getBasketItems(): Observable<BasketItem[]> {
    return this.http.get<BasketItem[]>(`${this.baseUrl}/items`);
  }

  addItemToBasket(productId: string, quantity: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/items`, { productId, quantity });
  }

  updateItemQuantity(basketItemId: string, quantity: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/items/${basketItemId}`, { quantity });
  }

  removeItemFromBasket(basketItemId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/items/${basketItemId}`);
  }

  clearBasket(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clear`);
  }
} 