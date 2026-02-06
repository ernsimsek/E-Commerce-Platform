import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { firstValueFrom, Observable, catchError, of } from 'rxjs';
import { TokenResponse } from '../../../contracts/token/tokenResponse';
import { SocialUser } from '@abacritt/angularx-social-login';
import { Token } from '../../../contracts/token/token';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  isAuthenticated: boolean = false;

  constructor( private httpClientService: HttpClientService, private toastrservice: CustomToastrService) {}

  async login(userNameOrEmail: string, password: string, callBackFunction?: () => void): Promise<void> {
    console.log("UserAuthService: Attempting login for user:", userNameOrEmail);
    
    try {
      const observable: Observable<any> = this.httpClientService.post<any>({
        controller: "auth",
        action: "login"
      }, { userNameOrEmail, password });

      const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;

      if (tokenResponse && tokenResponse.token) {
        console.log("UserAuthService: Login successful, received token");
        
        // Token bilgilerini kaydet
        localStorage.setItem("accessToken", tokenResponse.token.accessToken);
        localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
        
        // Token içeriğini kontrol et ve logla
        try {
          const tokenData = JSON.parse(atob(tokenResponse.token.accessToken.split('.')[1]));
          console.log("UserAuthService: Token claims:", tokenData);
          console.log(`UserAuthService: Token expires: ${new Date(tokenData.exp * 1000).toISOString()}`);
        } catch (error) {
          console.warn("UserAuthService: Could not parse token content", error);
        }
        
        // Auth durumunu güncelle
        await this.identityCheck();
        
        this.toastrservice.message("Kullanıcı girişi başarılı", "Giriş başarılı", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });
        
        if (callBackFunction && typeof callBackFunction === 'function') callBackFunction();
      } else {
        console.error("UserAuthService: Login failed - invalid token response", tokenResponse);
        this.toastrservice.message("Giriş başarısız", "Hata", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
      }
    } catch (error) {
      console.error("UserAuthService: Login error:", error);
      this.toastrservice.message("Giriş işlemi sırasında bir hata oluştu", "Hata", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
    }
  }

  async identityCheck(): Promise<boolean> {
    try {
      console.log("UserAuthService: Running identity check...");
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        console.log("UserAuthService: No access token found");
        this.isAuthenticated = false;
        return false;
      }
      
      console.log("UserAuthService: Validating token...");
      
      // Önce client-side token kontrolü yap
      try {
        const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
        const expirationDate = new Date(tokenData.exp * 1000);
        const now = new Date();
        
        if (expirationDate <= now) {
          console.log(`UserAuthService: Token expired at ${expirationDate.toISOString()}`);
          localStorage.removeItem("accessToken");
          this.isAuthenticated = false;
          return false;
        }
        
        console.log(`UserAuthService: Token valid until ${expirationDate.toISOString()}`);
      } catch (error) {
        console.error("UserAuthService: Error validating token locally:", error);
        localStorage.removeItem("accessToken");
        this.isAuthenticated = false;
        return false;
      }
      
      // Sonra server-side token kontrolü yap
      try {
        console.log("UserAuthService: Sending request to auth/identityCheck endpoint");
        const observable: Observable<any> = this.httpClientService.post({
          controller: "auth",
          action: "identityCheck"
        }, { accessToken: accessToken });

        const isAuthenticated: boolean = await firstValueFrom(observable) as boolean;
        console.log("UserAuthService: Server authentication response:", isAuthenticated);
        
        this.isAuthenticated = isAuthenticated;
        return isAuthenticated;
      } catch (error) {
        console.error("UserAuthService: Error during server identity check:", error);
        this.isAuthenticated = false;
        return false;
      }
    } catch (error) {
      console.error("UserAuthService: Unexpected error during identityCheck:", error);
      this.isAuthenticated = false;
      return false;
    }
  }

  async refreshTokenLogin(refreshToken: string, callBackFunction?: () => void): Promise<any>{
    const observable: Observable<any | TokenResponse> = this.httpClientService.post({
      action: "refreshtokenlogin",
      controller: "auth"
    }, {refreshToken: refreshToken});

    try {
      const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse; 
      if(tokenResponse){
        localStorage.setItem('accessToken', tokenResponse.token.accessToken);
        localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);
      }
      if (callBackFunction && typeof callBackFunction === 'function') callBackFunction();
    } catch (error) {
      console.error("UserAuthService: RefreshToken login error:", error);
    }
  }

  async googleLogin(user: SocialUser, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      action:"google-login",
      controller:"auth"
    }, user);

    try {
      const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;

      if(tokenResponse){
        localStorage.setItem("accessToken", tokenResponse.token.accessToken);
        localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);
        this.toastrservice.message("Google üzerinden giriş başarıyla sağlanmıştır.", "Giriş Başarılı", {
          messageType: ToastrMessageType.Success, 
          position: ToastrPosition.TopRight 
        });
      }
      if (callBackFunction && typeof callBackFunction === 'function') callBackFunction();
    } catch (error) {
      console.error("UserAuthService: Google login error:", error);
      this.toastrservice.message("Google ile giriş sırasında bir hata oluştu", "Hata", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
    }
  }

  async facebookLogin(user: SocialUser, callBackFunction?: () => void): Promise<any> {
   const observable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      controller: 'auth',
      action: 'facebook-login',
    }, user);

    try {
      const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;

      if(tokenResponse){
        localStorage.setItem("accessToken", tokenResponse.token.accessToken);
        localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);
        this.toastrservice.message("Facebook üzerinden giriş başarıyla sağlanmıştır.", "Giriş Başarılı", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });
      }
      if (callBackFunction && typeof callBackFunction === 'function') callBackFunction();
    } catch (error) {
      console.error("UserAuthService: Facebook login error:", error);
      this.toastrservice.message("Facebook ile giriş sırasında bir hata oluştu", "Hata", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
    }
  }
}
