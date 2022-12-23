import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';

import { environment } from './../../../environments/environment';

import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public tokenData: any;
  public currentUser: any;

  regUser: any;
  regGoogleUser: any;
  regGoogleToken: any;

  public redirectUrl = '';
  private api: string = environment.API;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {
    this.getToken();
    this.getCurrentUser();
  }

  logout() {
    this.tokenData = undefined;
    this.currentUser = undefined;
    localStorage.removeItem('_td');
    localStorage.removeItem('_ud');
    this.router.navigate(['auth/login']);
  }

  getToken() {
    if(this.tokenData) {
      return this.tokenData['accessToken'];
    } else if(localStorage.getItem('_td')){
      this.tokenData = JSON.parse(localStorage.getItem('_td'));
      return this.tokenData['accessToken'];

    } else {
      return false;
    }
  }
  setCurrentUser(token) {
    if (token) {
      const tokenParts = token.split('.');
      const encodedPayload = tokenParts[1];
      const rawPayload = atob(encodedPayload);
      const user = JSON.parse(rawPayload);
      this.tokenData = { accessToken: token };
      this.currentUser = user;
      localStorage.setItem('_td', JSON.stringify(this.tokenData));
      localStorage.setItem('_ud', JSON.stringify(user));
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
  getCurrentUser() {
    if (!localStorage.getItem('_td')) {
      return false;
    } else if (this.currentUser) {
      return this.currentUser;
    } else if (localStorage.getItem('_ud')) {
      this.currentUser = JSON.parse(localStorage.getItem('_ud'));
      return this.currentUser;
    } else {
      return false;
    }
  }
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (user && user['roles']) {
      for (const userRole of user['roles']) {
        if (userRole.role === role) {
          return true;
        }
      }
    }
    return false;
  }

  generateOtp(mobileNumber) {
    return this.httpClient.post(this.api + '/userauthsvc/security/otp/' + mobileNumber, '')
  }

  resendOtp(mobileNumber) {
    return this.httpClient.post(this.api + '/userauthsvc/security/otp/resend/' + mobileNumber, '')
  }

  verifyOtp(reqObj) {
    return this.httpClient.post(this.api + '/userauthsvc/security/otp/verify', reqObj)
  }
  refreshToken(): Observable<any> {
    if (localStorage.getItem('_td')) {
      return this.httpClient.get(this.api + '/userauthsvc/security/token/refreshtoken');
    } else {
      return null;
    }
  }
}
