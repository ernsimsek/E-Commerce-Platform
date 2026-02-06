import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from '../../../contracts/create_product';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { List_Product } from '../../../contracts/list_product';
import { firstValueFrom, Observable } from 'rxjs';
import { List_Product_Image } from '../../../contracts/list_product_image';
import { FileUploadOptions } from '../../../services/common/file-upload/file-upload.component';
import { ApiErrorHandlerService } from '../api-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private httpClientService: HttpClientService,
    private errorHandler: ApiErrorHandlerService
  ) { }

  create(product: Create_Product, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    console.log("ProductService: Creating product with data:", product);
    console.log("ProductService: JSON data being sent:", JSON.stringify(product));
    
    this.httpClientService.post({
      controller: "products"
    }, product).subscribe({
      next: (response) => {
        console.log("ProductService: Product created successfully:", response);
        if (successCallBack) successCallBack();
      },
      error: (errorResponse: HttpErrorResponse) => {
        console.error("ProductService: Error creating product:", errorResponse);
        console.error("ProductService: Error status:", errorResponse.status);
        console.error("ProductService: Error message:", errorResponse.message);
        
        if (errorResponse.error) {
          console.error("ProductService: Error details:", errorResponse.error);
        }
        
        const errorMessage = this.errorHandler.handleError(errorResponse, 'product');
        if (errorCallBack) errorCallBack(errorMessage);
      }
    });
  }

  update(product: any, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    this.httpClientService.put({
      controller: "products"
    }, product).subscribe({
      next: (response) => {
        console.log("ProductService: Product updated successfully:", response);
        if (successCallBack) successCallBack();
      },
      error: (errorResponse: HttpErrorResponse) => {
        const errorMessage = this.errorHandler.handleError(errorResponse, 'product update');
        if (errorCallBack) errorCallBack(errorMessage);
      }
    });
  }

  async read(
    page: number = 0, 
    size: number = 5, 
    successCallBack?: () => void, 
    errorCallBack?: (errorMessage: string) => void
  ): Promise<{ totalProductCount: number; products: List_Product[] }> {
    try {
      const promiseData = firstValueFrom(
        this.httpClientService.get<{ totalProductCount: number; products: any[] }>({
          controller: "products",
          queryString: `page=${page}&size=${size}`
        })
      );

      const data = await promiseData;
      
      if (successCallBack) successCallBack();
      
      return {
        totalProductCount: data.totalProductCount || 0,
        products: data.products || []
      };
    } catch (error) {
      const err = error as HttpErrorResponse;
      const errorMessage = this.errorHandler.handleError(err, 'products');
      if (errorCallBack) errorCallBack(errorMessage);
      
      return {
        totalProductCount: 0,
        products: []
      };
    }
  }

  async getById(
    id: string, 
    successCallBack?: () => void, 
    errorCallBack?: (errorMessage: string) => void
  ): Promise<any> {
    try {
      const promiseData = firstValueFrom(
        this.httpClientService.get<any>({
          controller: "products",
          action: id
        })
      );

      const data = await promiseData;
      
      if (successCallBack) successCallBack();
      
      return data;
    } catch (error) {
      const err = error as HttpErrorResponse;
      const errorMessage = this.errorHandler.handleError(err, 'product');
      if (errorCallBack) errorCallBack(errorMessage);
      
      return null;
    }
  }

  async delete(id: string) {
    try {
      const deletedResponse = await firstValueFrom(
        this.httpClientService.delete<any>({
          controller: "products"
        }, id)
      );
      
      return deletedResponse;
    } catch (error) {
      const err = error as HttpErrorResponse;
      this.errorHandler.handleError(err, 'product delete');
      throw error;
    }
  }

  async readImages(id: string, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<List_Product_Image[]> {
    try {
      console.log(`ProductService: ${id} ID'li ürünün resimleri alınıyor...`);
      
      const observable: Observable<List_Product_Image[]> = this.httpClientService.get<List_Product_Image[]>({
        controller: "products",
        action: "getproductimages",
        // id parametresi artık URL'in bir parçası olacak, queryString olarak değil
      }, id); // id parametresini doğrudan burada ekle
      
      const promiseData = firstValueFrom(observable);
      
      // Promise'in başarıyla tamamlanması durumunda callback'i çağır
      const result = await promiseData;
      if (successCallBack) successCallBack();
      
      // Null check ekleyelim
      return result || [];
      
    } catch (error: any) {
      console.error("ProductService.readImages error:", error);
      const errorMessage = error?.message || 'An error occurred while fetching product images';
      if (errorCallBack) errorCallBack(errorMessage);
      
      // Hata durumunda boş bir dizi döndür
      return [];
    }
  }

  async deleteImage(id: string, imageId: string, successCallBack?: () => void) {
    try {
      // ID kontrolü ekle
      if (!id || !imageId) {
        console.error("ProductService: Resim silme için geçersiz ID'ler:", { id, imageId });
        return;
      }
      
      console.log(`ProductService: ${id} ID'li ürünün ${imageId} ID'li resmi siliniyor...`);
      
      const observable = this.httpClientService.delete({
        controller: "products",
        action: "deleteproductimage",
        // URL yapısı: [action]/{Id} ve queryString: imageId şeklinde olmalı
      }, id, `imageId=${imageId}`);
      
      await firstValueFrom(observable);
      if (successCallBack) successCallBack();
    } catch (error) {
      console.error("ProductService.deleteImage error:", error);
    }
  }

  async changeShowcaseImage(imageId: string, productId: string, successCallBack?: () => void) {
    try {
      // ID kontrolü ekle
      if (!imageId || !productId) {
        console.error("ProductService: Vitrin resmi değiştirme için geçersiz ID'ler:", { imageId, productId });
        return;
      }
      
      console.log(`ProductService: ${productId} ID'li ürünün vitrin resmi ${imageId} olarak değiştiriliyor...`);
      
      const observable = this.httpClientService.get({
        controller: "products",
        action: "changeshowcaseimage",
        queryString: `imageId=${imageId}&productId=${productId}`
      });
      
      await firstValueFrom(observable);
      if (successCallBack) successCallBack();
    } catch (error) {
      console.error("ProductService.changeShowcaseImage error:", error);
    }
  }
}
