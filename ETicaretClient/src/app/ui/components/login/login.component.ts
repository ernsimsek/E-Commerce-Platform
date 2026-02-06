import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/common/models/user.service';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/common/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { UserAuthService } from '../../../services/common/models/user-auth.service';

@Component({
  selector: 'app-login',
  standalone: false,

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent extends BaseComponent implements OnInit {
  constructor(private userAuthService: UserAuthService, spiner: NgxSpinnerService, private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router, private socialAuthService: SocialAuthService) {
    super(spiner);
    socialAuthService .authState.subscribe(async(user: SocialUser) => {
      console.log(user);
      this.showSpinner(SpinnerType.BallAtom);
      switch (user.provider) {
        case 'GOOGLE':
          await userAuthService.googleLogin(user, () => {
            this.authService.identityCheck();
            this.hideSpinner(SpinnerType.BallAtom);
          }); break;
        case 'FACEBOOK':
          await userAuthService.facebookLogin(user, () => {
            this.authService.identityCheck();
            this.hideSpinner(SpinnerType.BallAtom);
          }); break;
      }
    });
  }
  ngOnInit(): void {}

  async login(usernameOrEmail: string, password: string) {
    try {
      console.log("LoginComponent: Starting login process");
      this.showSpinner(SpinnerType.BallAtom);
      
      if (!usernameOrEmail || !password) {
        console.error("LoginComponent: Username/email or password is empty");
        this.hideSpinner(SpinnerType.BallAtom);
        return;
      }
      
      console.log(`LoginComponent: Attempting login for ${usernameOrEmail}`);
      
      try {
        await this.userAuthService.login(usernameOrEmail, password, () => {
          console.log("LoginComponent: Login callback executed");
          
          try {
            console.log("LoginComponent: Running identity check");
            this.authService.identityCheck();
            console.log("LoginComponent: Identity check completed");
            
            this.activatedRoute.queryParams.subscribe(params => {
              const returnUrl: string = params["returnUrl"];
              console.log("LoginComponent: Return URL:", returnUrl || "None");
              
              if (returnUrl) {
                console.log(`LoginComponent: Navigating to ${returnUrl}`);
                this.router.navigate([returnUrl]);
              } else {
                console.log("LoginComponent: No redirect URL, staying on current page");
              }
            });
          } catch (identityError) {
            console.error("LoginComponent: Error during identity check:", identityError);
          }
          
          this.hideSpinner(SpinnerType.BallAtom);
        });
        
        console.log("LoginComponent: Login process completed");
      } catch (loginError) {
        console.error("LoginComponent: Error during login:", loginError);
        this.hideSpinner(SpinnerType.BallAtom);
      }
    } catch (error) {
      console.error("LoginComponent: Unexpected error:", error);
      this.hideSpinner(SpinnerType.BallAtom);
    }
  }

  facebookLogin(){
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
