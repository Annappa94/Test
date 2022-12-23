import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject, throwError } from 'rxjs';
import { switchMap, catchError, take, filter } from 'rxjs/operators';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
// import { ToastrService } from 'ngx-toastr';
// import { NgxUiLoaderService } from 'ngx-ui-loader';

import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshingToken = false;
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    public auth: AuthService,
    private snackbar: MatSnackBar,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | HttpEvent<any> | any> {
    //this.ngxLoader.stop();
    return next.handle(this.addTokenToRequest(request, this.auth.getToken())).pipe(catchError(error => {
      this.ngxLoader.stop();
      if (error instanceof HttpErrorResponse) {
        switch ((error as HttpErrorResponse).status) {
          case 400:
            return this.handle400Error(request, error, next);
          case 401:
            return this.handle401Error(request, error, next);
          case 402:
            return this.handle402Error(request, error, next);
          case 403:
            return this.handle403Error(request, error, next);
          case 404:
            return this.handle404Error(request, error, next);
          case 422:
            return this.handle422Error(request, error, next);
          case 423:
            return this.handle423Error(request, error, next);
          case 429:
            return this.handle429Error(request, error, next);
          case 428:
            return this.handle428Error(request, error, next);
          case 409:
            return this.handle409Error(request, error, next);
          case 500:
            return this.handle500Error(request, error, next);
          case 502:
            return this.handle502Error(request, error, next);
          case 0:
            return this.handle500Error(request, error, next);
        }
      } else {
        return this.handleUnknownError(request, error, next);
      }
    }));
  }

  // Bad Request
  public handle400Error(request: HttpRequest<any>, error: HttpErrorResponse, next: HttpHandler) {
    // this.ngxLoader.stop();
    // this.ngxLoader.stopBackground();
    // this.toastr.error('Internal Server Error');

    if (!request.url.includes('cocoon/lots/warehouse') && !request.url.includes('cocoonbidsvc/rmbids/lots/validate')) {
      if (error?.error?.message) {
        this.toastr.error(error?.error?.message, '', {
          timeOut: 3000,
        });
      } else {
        this.toastr.error('Oops! Unable to interact with server.', 'OK', {
          timeOut: 3000
        });
      }
    }
    return throwError(error);
  }

  // Unauthorized Request
  // public handle401Error(request: HttpRequest<any>, error: HttpErrorResponse, next: HttpHandler) {
  //   // this.snackbar.open('Oops! Unauthorized Request. Please re-login..', 'OK', {
  //   //   duration: 3000
  //   // });
  //   //return this.auth.logout() as any;
  // }
  public handle401Error(request: HttpRequest<any>, error: HttpErrorResponse, next: HttpHandler) {
    // if (error?.error?.message) {
    //   this.toastr.error(error?.error?.message, '', {
    //     timeOut: 3000,
    //   });
    // } else {
    //   this.toastr.error('Oops! Unauthorized Request. Please re-login..', 'OK', {
    //     timeOut: 3000
    //   });
    // }
    return this.auth.logout() as any;
    // if (this.isRefreshingToken) {
    //   return this.tokenSubject.pipe(filter(token => token != null), take(1), switchMap(token => {
    //     return next.handle(this.addTokenToRequest(request, token));
    //   }),
    //     catchError(err => {
    //       return this.auth.logout() as any;
    //     }),
    //   );
    // } else {
    //   this.isRefreshingToken = true;
    //   this.tokenSubject.next(null);
    //   this.auth.logout();
    // return this.auth.refreshToken().pipe(switchMap((response: any) => {
    //   if (response && response['token']) {
    //     this.auth.tokenData = {accessToken: response['token']};
    //     localStorage.setItem('_td', JSON.stringify({accessToken: response['token']}));


    //     this.tokenSubject.next(this.auth.tokenData['accessToken']);
    //     return next.handle(
    //       this.addTokenToRequest(request, this.auth.tokenData['accessToken'])
    //     );
    //   }
    // }),
    //   catchError(err => {
    //     this.isRefreshingToken = false;
    //     return this.auth.logout() as any;
    //   }),
    //   finalize(() => {
    //     this.isRefreshingToken = false;
    //   })
    // );
    //}
  }

  // Unauthorized Request
  public handle502Error(request: HttpRequest<any>, error: HttpErrorResponse, next: HttpHandler) {
    if (error?.error?.message) {
      this.toastr.error(error?.error?.message, '', {
        timeOut: 3000,
      });
    } else {
      this.toastr.error('Oops! Unable to interact with server.', 'OK', {
        timeOut: 3000
      });
    }
    if (this.isRefreshingToken) {
      return this.tokenSubject.pipe(filter(token => token != null), take(1), switchMap(token => {
        return next.handle(this.addTokenToRequest(request, token));
      }),
        catchError(err => {
          return this.auth.logout() as any;
        }),
      );
    } else {
      this.isRefreshingToken = true;
      this.tokenSubject.next(null);
      this.auth.logout();
      // return this.auth.refreshToken().pipe(switchMap((response: any) => {
      //   if (response && response['success'] && response['_jwt'] !== undefined) {
      //     this.auth.tokenData = this.globalService.getDecrypted(response['_jwt']);
      //     localStorage.setItem('_td', response['_jwt']);

      //     this.auth.currentUser = this.globalService.getJwtUser(this.auth.tokenData['accessToken']);
      //     localStorage.setItem('_cu', this.globalService.getEncrypted(this.auth.currentUser));

      //     this.tokenSubject.next(this.auth.tokenData['accessToken']);
      //     return next.handle(
      //       this.addTokenToRequest(request, this.auth.tokenData['accessToken'])
      //     );
      //   }
      // }),
      //   catchError(err => {
      //     this.isRefreshingToken = false;
      //     return this.auth.logout() as any;
      //   }),
      //   finalize(() => {
      //     this.isRefreshingToken = false;
      //   })
      // );
    }
  }

  // Payment Required
  public handle402Error(request: HttpRequest<any>, error: HttpErrorResponse, next: HttpHandler) {
    if (error?.error?.message) {
      this.toastr.error(error?.error?.message, '', {
        timeOut: 3000,
      });
    } else {
      this.toastr.error('Oops! Unable to interact with server.', 'OK', {
        timeOut: 3000
      });
    }
    if (this.isRefreshingToken) {
      return this.tokenSubject.pipe(filter(token => token != null), take(1), switchMap(token => {
        return next.handle(this.addTokenToRequest(request, token));
      }),
        catchError(err => {
          return this.auth.logout() as any;
        }),
      );
    } else {
      this.isRefreshingToken = true;
      this.tokenSubject.next(null);
    }
  }

  // Forbidden Request
  public handle403Error(request: HttpRequest<any>, error: HttpErrorResponse, next: HttpHandler) {

    // if (error?.error?.message) {
    //   this.toastr.error(error?.error?.message, '', {
    //     timeOut: 3000,
    //   });
    // } else {
    //   this.toastr.error('Oops! Unable to interact with server.', 'OK', {
    //     timeOut: 3000
    //   });
    // }
    if (this.isRefreshingToken) {
      // this.toastr.error('Internal Server Error');
      return this.auth.logout() as any;
    } else {
      // this.ngxLoader.stop();
      // this.ngxLoader.stopBackground();
      // this.toastr.error('Internal Server Error');
      return throwError(error);
    }
  }

  // Not Found
  public handle404Error(request: HttpRequest<any>, error: HttpErrorResponse, next: HttpHandler) {
    // this.ngxLoader.stop();
    // this.ngxLoader.stopBackground();
    // this.toastr.error('Internal Server Error');
    // this.snackbar.open('Oops! No API found. Unable to interact with server.', 'OK', {
    //   duration: 3000
    // });
    return throwError(error);
  }

  // Validation Error
  public handle422Error(request: HttpRequest<any>, error: HttpErrorResponse, next: HttpHandler) {
    // this.ngxLoader.stop();
    // this.ngxLoader.stopBackground();
    if (error?.error?.message) {
      this.toastr.error(error?.error?.message, '', {
        timeOut: 3000,
      });
    } else {
      this.toastr.error('Oops! Unable to interact with server.', 'OK', {
        timeOut: 3000
      });
    }
    return throwError(error);
  }

  public handle423Error(request: HttpRequest<any>, error: HttpErrorResponse, next: HttpHandler) {
    if (error?.error?.message) {
      this.toastr.error(error?.error?.message, '', {
        timeOut: 3000,
      });
    } else if (error?.error) {
      this.toastr.error(error.error, '', {
        timeOut: 3000
      });
    } else {
      this.toastr.error('Oops! Unable to interact with server.', 'OK', {
        timeOut: 3000
      });
    }
    return throwError(error);
  }

  public handle429Error(request: HttpRequest<any>, error: HttpErrorResponse, next: HttpHandler) {
    // this.ngxLoader.stop();
    // this.ngxLoader.stopBackground();
    if (error?.error?.message) {
      this.toastr.error(error?.error?.message, '', {
        timeOut: 3000,
      });
    } else {
      this.toastr.error('Oops! Unable to interact with server.', 'OK', {
        timeOut: 3000
      });
    }
    return throwError(error);
  }

  public handle428Error(request: HttpRequest<any>, error: HttpErrorResponse, next: HttpHandler) {
    return throwError(error);
  }

  public handle409Error(request: HttpRequest<any>, error: HttpErrorResponse, next: HttpHandler) {
    // this.ngxLoader.stop();
    // this.ngxLoader.stopBackground();
    if (error?.error?.message) {
      this.toastr.error(error?.error?.message, '', {
        timeOut: 3000,
      });
    } else {
      this.toastr.error('Already existing record. Please check.', 'OK', {
        timeOut: 3000
      });
    }
    return throwError(error);
  }

  // Internal Server Error
  public handle500Error(request: HttpRequest<any>, error: HttpErrorResponse, next: HttpHandler) {
    // this.ngxLoader.stop();
    // this.ngxLoader.stopBackground();
    // this.toastr.error('Internal Server Error');
    if (error?.error?.message) {
      this.toastr.error(error?.error?.message, '', {
        timeOut: 3000,
      });
    } else {
      this.toastr.error('Oops! Unable to interact with server.', 'OK', {
        timeOut: 3000
      });
    }
    return throwError(error);
  }

  // Unknown Server Error
  public handleUnknownError(request: HttpRequest<any>, error: HttpErrorResponse, next: HttpHandler) {
    // this.ngxLoader.stop();
    // this.ngxLoader.stopBackground();
    if (error?.error?.message) {
      this.toastr.error(error?.error?.message, '', {
        timeOut: 3000,
      });
    } else {
      this.toastr.error('Oops! Unable to interact with server.', 'OK', {
        timeOut: 3000
      });
    }
    return throwError(error);
  }

  // Add token to request
  public addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    this.ngxLoader.stop();
    if (request.headers['lazyUpdate'] !== null && request.headers['lazyUpdate'][0].value === 'qb' && request.headers['lazyUpdate'][0].name === 'api-type') {
      return request.clone(

        { headers: request.headers.delete('api-type', 'qb') }
      );
    }
    else if (token) {

      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
    } else {
      return request.clone({
        setHeaders: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
    }
  }
}

