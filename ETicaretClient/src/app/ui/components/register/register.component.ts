import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { User } from '../../../entities/user';
import { UserService } from '../../../services/common/models/user.service';
import { Create_User } from '../../../contracts/users/create_user';
import { ToastrService } from 'ngx-toastr';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../../../services/ui/custom-toastr.service';
import { BaseComponent } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,

  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent extends BaseComponent implements OnInit {
  frm: FormGroup = new FormGroup({});
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrservice: CustomToastrService,
    spinner: NgxSpinnerService,
    private router: Router
  ) {
    super(spinner);
  }

  ngOnInit(): void {
    this.frm = this.formBuilder.group(
      {
        nameSurname: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.minLength(3),
          ],
        ],
        userName: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.minLength(3),
          ],
        ],
        email: [
          '',
          [Validators.required, Validators.maxLength(250), Validators.email],
        ],
        password: ['', [Validators.required]],
        passwordConfirm: ['', [Validators.required]],
      },
      {
        validators: (group: AbstractControl): ValidationErrors | null => {
          let sifre = group.get('password')?.value;
          let sifreTekrar = group.get('passwordConfirm')?.value;
          return sifre === sifreTekrar ? null : { notSame: true };
        },
      }
    );
  }

  get component() {
    return this.frm.controls;
  }

  submitted: boolean = false;
  async register() {
    if (this.frm.valid) {
      const user: User = new User();
      user.userName = this.frm.value.userName;
      user.email = this.frm.value.email;
      user.password = this.frm.value.password;
      user.passwordConfirm = this.frm.value.passwordConfirm;
      user.nameSurname = this.frm.value.nameSurname;

      const result = await this.userService.create(user);
      if (result.succeeded) {
        this.toastrservice.message(result.message, "Kullanıcı Kaydı Başarılı", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });
        this.router.navigate(["/login"]);
      } else {
        this.toastrservice.message(result.message, "Hata", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
      }
    }
  }
}
