import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private httpClient: HttpClient, @Inject("baseurl") private baseUrl : string) { }

  private url(requestParameter:Partial<RequestParameters>):string{
    const url = `${requestParameter.baseUrl? 
    requestParameter.baseUrl:this.baseUrl}/${requestParameter.controller}${requestParameter.action?
    `/${requestParameter.action}`:""}`;
    console.log(`Constructed URL: ${url}`);
    return url;
  }

  get<T>(requestParameter:Partial<RequestParameters>,id?:string):Observable<T> {
    let url:string = "";
    try {
      console.log("HttpClientService: Building GET request");
      
      if(requestParameter.fullEndPoint) {
        url = requestParameter.fullEndPoint;
        console.log(`HttpClientService: Using full endpoint: ${url}`);
      } else {
        url = `${this.url(requestParameter)}${id ? `/${id}` : ""}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;
        console.log(`HttpClientService: Constructed URL: ${url}`);
      }
      
      // Headers'ı logla
      const headers = requestParameter.headers || new HttpHeaders();
      console.log("HttpClientService: Request headers:", headers);
      
      console.log(`HttpClientService: Sending GET request to: ${url}`);
      
      return this.httpClient.get<T>(url, { headers: headers })
        .pipe(
          tap(response => {
            console.log(`HttpClientService: GET response from ${url}:`, 
                      typeof response === 'object' ? 
                      this.summarizeObject(response) : 
                      response);
          }),
          catchError((error: HttpErrorResponse) => {
            console.error(`HttpClientService: GET ${url} failed:`, error);
            console.error(`HttpClientService: Error details - Status: ${error.status}, Message: ${error.message}`);
            
            if (error.error) {
              console.error("HttpClientService: Server error response:", error.error);
            }
            
            throw error;
          })
        );
    } catch (error) {
      console.error("HttpClientService: Exception while preparing GET request:", error);
      throw error;
    }
  }

  // Büyük nesneleri özet olarak gösterme yardımcı metodu
  private summarizeObject(obj: any): any {
    if (!obj) return obj;
    
    if (Array.isArray(obj)) {
      return {
        type: 'Array',
        length: obj.length,
        sample: obj.length > 0 ? this.summarizeObject(obj[0]) : 'empty'
      };
    } else if (typeof obj === 'object') {
      const result: any = { type: 'Object' };
      const keys = Object.keys(obj);
      result.properties = keys.length > 0 ? keys.join(', ') : 'empty';
      return result;
    } else {
      return obj;
    }
  }

  post<T>(requestParameter: Partial<RequestParameters>, body: Partial<T>): Observable<T> {
    let url: string = "";
    if(requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}${requestParameter.queryString ? `?${requestParameter.queryString}`: ""}`;

    console.log(`POST request to: ${url}`);
    console.log(`Request body:`, body);
    console.log(`Request headers:`, requestParameter.headers || 'Using default headers');
    
    return this.httpClient.post<T>(url, body, {headers: requestParameter.headers})
      .pipe(
        tap(response => console.log(`POST response from ${url}:`, response)),
        catchError((error: HttpErrorResponse) => {
          console.error(`POST ${url} failed:`, error);
          
          if (error.status === 500) {
            console.error('Server error details:', error.error);
          } else if (error.status === 401) {
            console.error('Unauthorized - Token may be invalid or missing');
          } else if (error.status === 400) {
            console.error('Bad request - Check request data:', body);
            console.error('Validation errors:', error.error?.errors || error.error);
          }
          
          throw error;
        })
      );
  }

  put<T>(requestParameter: Partial<RequestParameters>, body: Partial<T>): Observable<T> {
    let url : string = "";
    if(requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}${requestParameter.queryString ? `?${requestParameter.queryString}`: ""}`;

    console.log(`PUT request to: ${url}`, body);
    return this.httpClient.put<T>(url, body, {headers: requestParameter.headers})
      .pipe(
        tap(response => console.log(`PUT response from ${url}:`, response)),
        catchError(this.handleError<T>(`PUT ${url}`))
      );
  }

  delete<T>(requestParameter: Partial<RequestParameters>, id: string, queryString?: string): Observable<T> {
    let url: string = "";
    if(requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;  
    else {
      // Only append the ID to the URL if it's not empty
      if (id && id.trim() !== '') {
        url = `${this.url(requestParameter)}/${id}`;
        
        // Use provided queryString if any, otherwise use the one from request parameters
        if (queryString) {
          url += `?${queryString}`;
        } else if (requestParameter.queryString) {
          url += `?${requestParameter.queryString}`;
        }
      } else {
        url = `${this.url(requestParameter)}${requestParameter.queryString ? `?${requestParameter.queryString}`: ""}`;
      }
    }

    console.log(`DELETE request to: ${url}`);
    return this.httpClient.delete<T>(url, {headers: requestParameter.headers})
      .pipe(
        tap(response => console.log(`DELETE response from ${url}:`, response)),
        catchError(this.handleError<T>(`DELETE ${url}`))
      );
  }

  private handleError<T>(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`${operation} failed:`, error);
      
      // Let the app keep running by returning an empty observable
      throw error;
    };
  }
}

export class RequestParameters {
  controller ?: string;
  action ?: string;
  queryString?: string;

  headers ?: HttpHeaders;
  baseUrl ?: string;
  fullEndPoint ?: string;
}