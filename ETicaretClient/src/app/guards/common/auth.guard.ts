import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { _isAuthenticated } from '../../services/common/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private jwtHelper: JwtHelperService, 
    private router: Router, 
    private tostrService: CustomToastrService, 
    private spinner: NgxSpinnerService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("AuthGuard: Checking authentication status");
    this.spinner.show(SpinnerType.BallAtom);

    console.log("AuthGuard: Current authentication status:", _isAuthenticated);
    
    // Tokenı doğrudan kontrol edelim
    const token = localStorage.getItem("accessToken");
    console.log("AuthGuard: Token exists:", token ? "Yes" : "No");
    
    if (token) {
      try {
        const isTokenExpired = this.jwtHelper.isTokenExpired(token);
        console.log("AuthGuard: Token expired status:", isTokenExpired);
        
        if (!isTokenExpired) {
          console.log("AuthGuard: Token is valid");
          this.spinner.hide(SpinnerType.BallAtom);
          return true;
        }
      } catch (error) {
        console.error("AuthGuard: Error validating token:", error);
      }
    }
    
    // Token yok veya geçersiz ise
    if (!_isAuthenticated) {
      console.log("AuthGuard: Not authenticated, redirecting to login");
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
      this.tostrService.message("Oturum Açmanız Gerekiyor!", "Yetkisiz Erişim!", { 
        messageType: ToastrMessageType.Warning,
        position: ToastrPosition.TopRight
      });
    }

    this.spinner.hide(SpinnerType.BallAtom);
    return _isAuthenticated;
  }
}
