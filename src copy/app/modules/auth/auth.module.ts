import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { NgOtpInputModule } from  'ng-otp-input';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import {TranslationModule} from '../i18n/translation.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
  declarations: [
    LoginComponent,
    AuthComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgOtpInputModule,
    MatSnackBarModule
  ],
  exports: [
    MatSnackBarModule
  ]
})
export class AuthModule {}
