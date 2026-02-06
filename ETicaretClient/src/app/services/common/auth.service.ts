import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserAuthService } from './models/user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private jwtHelper: JwtHelperService
  ) { }

  async identityCheck() {
    try {
      console.log("AuthService: Running identity check...");
      
      if(typeof window !== 'undefined' && window.localStorage) {
        const token: string | null = localStorage.getItem("accessToken");
        console.log("AuthService: Token found:", token ? "Yes" : "No");
        
        if (!token) {
          console.log("AuthService: No token found, setting not authenticated");
          _isAuthenticated = false;
          return;
        }
        
        let expired: boolean;
        try {
          expired = this.jwtHelper.isTokenExpired(token);
          console.log("AuthService: Token expired status:", expired);
          
          if (expired) {
            console.log("AuthService: Token is expired, setting not authenticated");
            _isAuthenticated = false;
            return;
          }
        } catch (error) {
          console.error("AuthService: Error checking token expiration:", error);
          _isAuthenticated = false;
          return;
        }
        
        // Token geçerli görünüyor, değeri true olarak ayarla
        _isAuthenticated = true;
        console.log("AuthService: Authentication status set to:", _isAuthenticated);
      } else {
        console.warn("AuthService: Window or localStorage not available");
        _isAuthenticated = false;
      }
    } catch (error) {
      console.error("AuthService: Error in identityCheck:", error);
      _isAuthenticated = false;
    }
  }

  get isAuthenticated(): boolean {
    return _isAuthenticated;
  }
}

export let _isAuthenticated: boolean;
