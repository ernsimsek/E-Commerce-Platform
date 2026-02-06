import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from '../../../entities/user';
import { Create_User } from '../../../contracts/users/create_user';
import { firstValueFrom, Observable } from 'rxjs';
import { Token } from '../../../contracts/token/token';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../../ui/custom-toastr.service';
import { TokenResponse } from '../../../contracts/token/tokenResponse';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor( private httpClientService: HttpClientService, private toastrservice: CustomToastrService) {}

  async create(user: User): Promise<Create_User> {
    console.log("Registration attempt with:", user);
    
    try {
      const observable: Observable<Create_User> = this.httpClientService.post<Create_User>(
          {
            controller: 'users',
          }, {
            NameSurname: user.nameSurname,
            UserName: user.userName,
            Email: user.email,
            Password: user.password,
            PasswordConfirm: user.passwordConfirm
          } as any);
      
      console.log("Registration request sent, waiting for response...");
      const response = await firstValueFrom(observable);
      console.log("Registration response received:", response);
      
      if (response.succeeded) {
        this.toastrservice.message(
          response.message || 'Kullanıcı başarıyla kaydedildi',
          'Kayıt Başarılı',
          {
            messageType: ToastrMessageType.Success,
            position: ToastrPosition.TopRight
          }
        );
      } else {
        this.toastrservice.message(
          response.message || 'Kullanıcı kaydı sırasında bir hata oluştu',
          'Kayıt Başarısız',
          {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
          }
        );
      }
      
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      this.toastrservice.message(
        'Kayıt sırasında bir hata oluştu!',
        'Hata',
        {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight,
        }
      );
      
      return {
        succeeded: false,
        message: 'İşlem sırasında beklenmeyen bir hata oluştu.'
      };
    }
  }
}
