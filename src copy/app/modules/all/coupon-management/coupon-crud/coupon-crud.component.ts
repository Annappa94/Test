import { ChangeDetectorRef, Inject, LOCALE_ID, Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { ApiService } from 'src/app/services/api/api.service';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { CustomValidator } from 'src/app/modules/shared/custom-validator/custom.validator';
@Component({
    selector: 'app-coupon-crud',
    templateUrl: './coupon-crud.html',
    styleUrls: ['./coupon-crud.component.scss'],
    providers: [
      { provide: NgbDateAdapter, useClass: CustomAdapter },
      { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
    ]
  })
  
  export class CouponCRUDComponent {
  
    couponsForm: UntypedFormGroup;
    centerList;
    id;
    
  delBank;
  modalRef;
  closeResult;
  deleteBankIndex;
  minDate;
  
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private form: UntypedFormBuilder,
      private api: ApiService,
      private _cd: ChangeDetectorRef,
      private snackBar: MatSnackBar,
      private ngxLoader : NgxUiLoaderService,
    @Inject(LOCALE_ID) private locale: string,

    ) {
      const currentYear = moment().year();
      const currentMonth = moment().month();
      const currentDay = moment().date();
      
      this.minDate = moment([currentYear, currentMonth, currentDay]);
      // Check if update
      this.route.params.subscribe((params: Params) => {
        if (params['id']) {
          this.id = params['id'];
        }
      });
      this.couponsForm = this.form.group({
        couponCode: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace]),
        description: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace]),
        description_hi: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace]),
        description_mr: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace]),
        description_kn: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace]),
        description_te: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace]),
        description_ta: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace]),
        value: new UntypedFormControl('', [Validators.required]),
        minTransactionAmount: new UntypedFormControl('', [Validators.required]),
        applicableFor: new UntypedFormControl('', [Validators.required]),
        noOfTimesCanBeUsedPerCustomer: new UntypedFormControl('', [Validators.required]),
        noOfTimesCanBeUsedTotal: new UntypedFormControl('', [Validators.required]),
        fromDate: new UntypedFormControl('', [Validators.required]),
        toDate: new UntypedFormControl('', [Validators.required]) ,       
        isActive: new UntypedFormControl(true),     
        type: new UntypedFormControl('', [Validators.required]),
      });
      
  
      if (this.id) {
        this.ngxLoader.stop();
        this.api.getCouponById(this.id).then(response => {
          if (response) {
            this.couponsForm.patchValue(response);
            if(response['fromDate']) {
              let fromDate;
              fromDate = response['fromDate'] ? formatDate(response['fromDate'], 'MM-dd-yyyy', this.locale) : ''
              const moment1 = _moment; 
              this.couponsForm.patchValue({
                fromDate: moment1(fromDate, "MM/DD/YYYY"),
              });
              this._cd.detectChanges();
              let toDate;
              toDate = response['toDate'] ? formatDate(response['toDate'], 'MM-dd-yyyy', this.locale) : ''
              const moment = _moment; 
              this.couponsForm.patchValue({
                toDate: moment(toDate, "MM/DD/YYYY"),
              });
            this._cd.detectChanges();
          }
          } else {
            this.snackBar.open('Failed to Load Coupon', 'Ok', {
              duration: 3000
            });
          }
        })
      }
    }
    
    goBack() {
      this.router.navigate(['/dashboard/coupon']);
    }
  
    saveFarmerDetails(form) {
      const params = {
        couponCode: form.couponCode.toUpperCase(),
        description: form.description,
        description_hi: form.description_hi,
        description_mr: form.description_mr,
        description_kn: form.description_kn,
        description_te: form.description_te,
        description_ta: form.description_ta,
        value: form.value,
        minTransactionAmount: form.minTransactionAmount,
        applicableFor: form.applicableFor,
        noOfTimesCanBeUsedPerCustomer: form.noOfTimesCanBeUsedPerCustomer,
        noOfTimesCanBeUsedTotal: form.noOfTimesCanBeUsedTotal,
        fromDate: form.fromDate ? Date.parse(form.fromDate) : Date.parse(new Date().toString()),
        toDate: form.toDate ? Date.parse((form.toDate).set({ hour: 23, minute: 59, second: 59, millisecond: 0 })) : Date.parse(new Date().toString()),   
        type: form.type,
        isActive: form.isActive
      };

      if (this.id) {
        this.ngxLoader.stop();
        this.api.updateCoupon(this.id, params).then(res => {
          if (res) {
            // Success Message
            this.router.navigate(['/dashboard/coupon']);
            this.snackBar.open('Updated coupon successfully', 'Ok', {
              duration: 3000
            });
          } else {
            this.snackBar.open('Failed to update coupon', 'Ok', {
              duration: 3000
            });
          }
        });
      } else {
        this.ngxLoader.stop();
        this.api.createCoupon(params).then(res => {
          if (res) {
            // Success Message
            this.router.navigate(['/dashboard/coupon']);
            this.snackBar.open('Created coupon successfully', 'Ok', {
              duration: 3000
            });
          } else {
            this.snackBar.open('Failed to create coupon', 'Ok', {
              duration: 3000
            });
          }
        });
      }
    }

    deleteBankDetails() {
      this.modalRef.close();
      const control = <UntypedFormArray>this.couponsForm.controls['bankDetails'];
      control.removeAt(this.deleteBankIndex);
    }
  
    // Reeler Validations
    isControlValidForReeler(controlName: string): boolean {
      const control = this.couponsForm.controls[controlName];
      return control.valid && (control.dirty || control.touched);
    }
  
    isControlInvalidForReeler(controlName: string): boolean {
      const control = this.couponsForm.controls[controlName];
      return control.invalid && (control.dirty || control.touched);
    }
  
    controlHasErrorForReeler(validation, controlName): boolean {
      const control = this.couponsForm.controls[controlName];
      return control.hasError(validation) && (control.dirty || control.touched);
    }
  
    isControlTouchedForReeler(controlName): boolean {
      const control = this.couponsForm.controls[controlName];
      return control.dirty || control.touched;
    }
  }