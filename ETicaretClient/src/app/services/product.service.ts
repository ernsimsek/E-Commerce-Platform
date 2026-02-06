import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = environment.apiUrl + 'products';

  constructor(private http: HttpClient) {}

  getProducts(params = { page: 0, size: 10 }): Observable<{ products: Product[], totalProductCount: number }> {
    return this.http.get<{ products: Product[], totalProductCount: number }>(`${this.baseUrl}?page=${params.page}&size=${params.size}`);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  createProduct(product: Omit<Product, 'id'>): Observable<void> {
    return this.http.post<void>(this.baseUrl, product);
  }

  updateProduct(id: string, product: Omit<Product, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
} 