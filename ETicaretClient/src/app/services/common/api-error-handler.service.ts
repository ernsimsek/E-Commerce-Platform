import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../ui/custom-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class ApiErrorHandlerService {
  constructor(private toastrService: CustomToastrService) { }

  /**
   * HttpErrorResponse'dan anlamlı hata mesajı çıkarır
   */
  handleError(error: HttpErrorResponse, resourceName: string = 'resource'): string {
    console.log(`ApiErrorHandler: Processing error for ${resourceName}`, error);
    
    let errorMessage = `Failed to process ${resourceName}`;
    
    // HTTP durum kodlarına göre özel mesajlar
    if (error.status === 0) {
      errorMessage = 'Could not connect to the server. Please check your internet connection.';
      console.error('ApiErrorHandler: Network error', error);
    } 
    else if (error.status === 400) {
      errorMessage = this.handleBadRequest(error);
      console.error('ApiErrorHandler: Bad request', error);
    }
    else if (error.status === 401) {
      errorMessage = 'You are not authorized to perform this action. Please login again.';
      console.error('ApiErrorHandler: Unauthorized', error);
    }
    else if (error.status === 403) {
      errorMessage = 'You do not have permission to perform this action.';
      console.error('ApiErrorHandler: Forbidden', error);
    }
    else if (error.status === 404) {
      errorMessage = `The requested ${resourceName} was not found.`;
      console.error('ApiErrorHandler: Not found', error);
    }
    else if (error.status === 500) {
      errorMessage = 'A server error occurred. Please try again later.';
      console.error('ApiErrorHandler: Server error', error);
    }
    
    // Error mesajını göster
    this.toastrService.message(errorMessage, 'Error', {
      messageType: ToastrMessageType.Error,
      position: ToastrPosition.TopRight
    });
    
    return errorMessage;
  }

  /**
   * 400 Bad Request hata mesajlarını ayrıştırır
   */
  private handleBadRequest(error: HttpErrorResponse): string {
    // API'den dönen hata mesajlarını kontrol et
    if (error.error) {
      if (typeof error.error === 'string') {
        return error.error;
      }
      
      // ValidationProblemDetails formatı için
      if (error.error.errors) {
        const validationErrors = [];
        for (const key in error.error.errors) {
          if (error.error.errors.hasOwnProperty(key)) {
            const messages = error.error.errors[key];
            if (Array.isArray(messages)) {
              validationErrors.push(...messages);
            } else {
              validationErrors.push(messages);
            }
          }
        }
        return validationErrors.join(' ');
      }
      
      // Diğer yapılandırılmış hata mesajları
      if (error.error.message) {
        return error.error.message;
      }
    }
    
    return 'An error occurred with your request. Please check your data and try again.';
  }
} 