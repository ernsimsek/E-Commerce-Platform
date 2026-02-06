import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private spinnerService: NgxSpinnerService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`Interceptor: Processing ${req.method} request to ${req.url}`);
    
    // Spinner'ı göster
    this.spinnerService.show();
    
    const token = localStorage.getItem("accessToken");
    let newRequest: HttpRequest<any> = req;
    
    if (token) {
      console.log("Interceptor: Token found in localStorage");
      
      try {
        // Token geçerliliğini basit kontrol
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expirationDate = new Date(tokenData.exp * 1000);
        const now = new Date();
        
        if (expirationDate > now) {
          console.log(`Interceptor: Token valid until ${expirationDate.toISOString()}`);
          
          // API istekleri için token ekleme
          if (req.url.includes('/api/')) {
            console.log("Interceptor: Adding token to API request");
            newRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
            console.log("Interceptor: Request headers after adding token:", newRequest.headers.keys());
          } else {
            console.log("Interceptor: Non-API request, not adding token");
          }
        } else {
          console.log("Interceptor: Token expired, removing from localStorage");
          localStorage.removeItem("accessToken");
          this.router.navigate(['/login']);
        }
      } catch (error) {
        console.error("Interceptor: Error parsing token:", error);
        localStorage.removeItem("accessToken");
      }
    } else {
      console.log("Interceptor: No token available in localStorage");
    }
    
    return next.handle(newRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`Interceptor: Error occurred (${error.status}):`, error);
        
        // Token geçersizse veya yetkisiz erişim varsa
        if (error.status === 401) {
          console.log("Interceptor: 401 Unauthorized access, redirecting to login");
          localStorage.removeItem("accessToken");
          this.router.navigate(['/login']);
        }
        
        // 500 hatası için ayrıntılı loglama
        if (error.status === 500) {
          console.error("Interceptor: 500 Server error details:", error.error);
        }
        
        // 400 Bad Request için doğrulama hatalarını loglama
        if (error.status === 400) {
          console.error("Interceptor: 400 Bad Request - Validation errors:", error.error);
        }
        
        return throwError(() => error);
      }),
      finalize(() => {
        // İşlem bitince spinner'ı gizle
        this.spinnerService.hide();
        console.log(`Interceptor: Request to ${req.url} completed`);
      })
    );
  }
} 