import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api/api.service';
import { AuthService } from '../../../services/auth/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { C } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginForm = new UntypedFormGroup({
    phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')])
  });
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  // private fields
  private unsubscribe: Subscription[] = [];
  @ViewChild('ngOtpInput', {static: false}) ngOtpInput: ElementRef;
  @ViewChild('ngPhoneInput', {static: false}) ngPhoneInput: ElementRef;
  
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '45px',
      height: '45px'
    }
  };
  otp = null;
  invalidNumber = null;
  otpReceived = false;

  constructor(
    private form: UntypedFormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private ngxLoader : NgxUiLoaderService,
    ) {
      this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    }
  ngAfterViewInit() {
    this.ngPhoneInput.nativeElement.focus();
    console.log('ngAfterViewInit');
  }

    ngOnInit(): void {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
      
    }

    generateOtp() {
      this.isLoading$ = this.isLoadingSubject.asObservable();
      this.ngxLoader.stop();
      this.api.getUserDetailsByPhone(this.loginForm.value.phone).then((userDetails: any) => {
        if(userDetails && userDetails.role != 'FARMER' && userDetails.role != 'REELER' && userDetails.role != 'WEAVER' && userDetails.role != 'CHAWKI' && userDetails.role != 'RETAILER') {
          this.authService.generateOtp(this.loginForm.value.phone).subscribe((res: any) => {
            if (res) {
              this.isLoading$ = null;
              this.otpReceived = true;
              this.invalidNumber = '';
              this.cdr.detectChanges();
              this.ngOtpInput.nativeElement.focus();
              this.snackBar.open('OTP sent successfully on ' + this.loginForm.value.phone + '.', 'Ok', {
                duration: 3000,
              });
            }
          }, err => {
            this.invalidNumber = this.loginForm.value.phone;
            this.cdr.detectChanges();
            console.log(err.error);
            if (err && err.error && err.error.includes('User not found with phone number')) {
              this.snackBar.open('Could not generate OTP. Please Try Again', 'Ok', {
                duration: 3000,
              });
            }
          });
        } else {
          this.snackBar.open('You Do Not Have Access on OCC', 'Ok', {
            duration: 3000,
          });
        }
      }, err => {
        this.authService.generateOtp(this.loginForm.value.phone).subscribe((res: any) => {
          if (res) {
            this.isLoading$ = null;
            this.otpReceived = true;
            this.ngOtpInput.nativeElement.focus();
            this.invalidNumber = '';
            this.cdr.detectChanges();
            this.snackBar.open('OTP sent successfully on ' + this.loginForm.value.phone + '.', 'Ok', {
              duration: 3000,
            });
          }
        }, err => {
          this.invalidNumber = this.loginForm.value.phone;
          this.cdr.detectChanges();
          console.log(err.error);
          if (err && err.error && err.error.includes('User not found with phone number')) {
            this.snackBar.open('Could not generate OTP. Please Try Again', 'Ok', {
              duration: 3000,
            });
          }
        });
      });
      
    }

    resendOtp() {
      this.authService.resendOtp(this.loginForm.value.phone).subscribe((res: any) => {
        this.snackBar.open('OTP resent successfully on ' + this.loginForm.value.phone + '.', 'Ok', {
          duration: 3000,
        });
      }, err => {
        console.log(err.error);
      });
    }

  verifyOtp() {
    if (this.otp > 999) {
      const reqObj = {
        phone: this.loginForm.value.phone,
        otp: Number(this.otp)
      };
      this.ngxLoader.stop();
      this.authService.verifyOtp(reqObj).subscribe(res => {
        this.authService.setCurrentUser(res['token']);
        this.api.getUserDetailsByPhone(this.loginForm.value.phone).then((userDetails: any) => {
          // if (userDetails.role === 'COperationsAgent') {
          //   this.router.navigate(['farmers-management'])
          // }
          // else if (userDetails.role === 'YOperationsAgent') {
          //   this.router.navigate(['reelers-management'])
          // }
          if (userDetails.role === 'COperationsAgent' || userDetails.role === 'COCOON_PROCUREMENT_EXEC' || userDetails.role === 'COCOON_SALES_EXEC'|| userDetails.role === 'YOperationsAgent' || userDetails.role === 'FarmInputAgent' || userDetails.role === 'FarmInputManager' || userDetails.role === 'RetailSourcingAgent' || userDetails.role === 'RetailSalesAgent' || userDetails.role === 'PupaeAgent' || userDetails.role === 'CottonAgent'){
            this.router.navigate(['followup/my'])
          }
          else if (userDetails.role === 'HRManager'){
            this.router.navigate(['users'])
          }
          else if (userDetails.role === 'CottonManager'){
            this.router.navigate(['/ginners'])
          }
          else if (userDetails.role === 'PupaeManager'){
            this.router.navigate(['/rm-pupae-suppliers'])
          }
          else if ((userDetails.role === 'Agronomist')) {
              
            this.router.navigate(['rearing-iot']);
          }
          else if ((userDetails.role != 'FARMER') &&
            (userDetails.role != 'REELER') && (userDetails.role != 'WEAVER') && (userDetails.role != 'COperationsAgent') && (userDetails.role !== 'COCOON_PROCUREMENT_EXEC') && (userDetails.role !== 'COCOON_SALES_EXEC') && (userDetails.role != 'Agronomist')) {
              
            this.router.navigate(['/dashboard']);
          }
          else {
            this.snackBar.open('You Do not have access.', 'Ok', {
              duration: 3000,
            });
            this.router.navigate(['/auth/login']);
          }
        }, err => {
          console.log(err);
        });
      }, err => {
        this.snackBar.open('Please enter valid otp.', 'Ok', {
          duration: 3000,
        });
      });
    }
    
  }
}
