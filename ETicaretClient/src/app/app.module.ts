import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { NgxSpinnerModule } from 'ngx-spinner';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';
// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { BasketComponent } from './components/basket/basket.component';

import { productReducer } from './store/product/product.reducer';
import { ProductEffects } from './store/product/product.effects';
import { basketReducer } from './store/basket/basket.reducer';
import { BasketEffects } from './store/basket/basket.effects';

import { ProductService } from './services/product.service';
import { BasketService } from './services/basket.service';
import { AuthService } from 'src/app/services/common/auth.service';
import { FileUploadService } from './services/file-upload.service';
import { CustomToastrService } from './services/ui/custom-toastr.service';
import { HttpRequestInterceptor } from './interceptors/http-request.interceptor';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductFormComponent,
    BasketComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SharedModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature('products', productReducer),
    StoreModule.forFeature('basket', basketReducer),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([ProductEffects, BasketEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),

    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('accessToken');
        },
        allowedDomains: ['localhost:4200', 'localhost:7136'],
        disallowedRoutes: ['localhost:7136/auth/login']
      }
    }),

    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    // Angular Material Modules
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  providers: [
    ProductService,
    BasketService,
    FileUploadService,
    AuthService,
    CustomToastrService,
    { provide: "baseurl", useValue: "https://localhost:7136/api" },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { } 