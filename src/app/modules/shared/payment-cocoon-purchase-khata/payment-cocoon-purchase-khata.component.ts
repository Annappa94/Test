import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { RolesService } from 'src/app/services/roles/roles.service';

@Component({
  selector: 'app-payment-cocoon-purchase-khata',
  templateUrl: './payment-cocoon-purchase-khata.component.html',
  styleUrls: ['./payment-cocoon-purchase-khata.component.scss']
})
export class PaymentCocoonPurchaseKhataComponent implements OnInit,OnChanges {
  
  reelerPaymentForm:UntypedFormGroup;
  paymentDetail: any;
  paymentdetails : any;

  @Input()
  orderDetails:any;

  @Input()
  isListingPage:boolean = false;

  @Input()
  customerId:number;

  timeLeft=30;
  timerId;
  mudraSalesPayment:any;
  

  constructor(
    public rolesService: RolesService,
    private snackBar: MatSnackBar,
    private router: Router,
    private modalService: NgbModal,
    private ngxLoader : NgxUiLoaderService,
    private $gaService:GoogleAnalyticsService,
    private api:ApiService,
    private _cd:ChangeDetectorRef,
    private apiSearch:SearchService
    ) { 
      this.reelerPaymentForm = new UntypedFormGroup({
        amount: new UntypedFormControl('', [Validators.required,Validators.min(1)]),
        referenceNumber: new UntypedFormControl('', [Validators.required]),
        paymentMode: new UntypedFormControl('Self')
      })
    }
  ngOnChanges(changes: SimpleChanges): void {
    this.orderDetails.sellingPricePerKg = parseFloat(this.orderDetails.sellingPricePerKg)
  }

    modalRef;

    highlightText;
    listenForPaymentMode(){
      this.reelerPaymentForm.get('paymentMode').valueChanges.subscribe(res=>{
        if(res==='Self'){
          this.reelerPaymentForm.controls['amount'].setValue(this.paymentDetail.dueAmount?.toFixed(2));
          this.reelerPaymentForm.controls['referenceNumber'].setValue('');
          this.reelerPaymentForm.removeControl('otp');
          this.reelerPaymentForm.removeControl('requestId');
        }else{
          // if(this.masterLoanInfo?.availableCreditLimit > this.paymentDetail.dueAmount?.toFixed(2)){
          if(this.masterLoanInfo?.availableCreditLimit > parseFloat(this.paymentDetail.dueAmount).toFixed(2)){

            this.reelerPaymentForm.controls['amount'].setValue(this.paymentDetail.dueAmount?.toFixed(2));
          }else{
            this.reelerPaymentForm.controls['amount'].setValue(this.masterLoanInfo?.availableCreditLimit);
          }
          this.reelerPaymentForm.addControl('otp',new UntypedFormControl('', Validators.required));
          this.reelerPaymentForm.addControl('requestId',new UntypedFormControl('', Validators.required));
          this.reelerPaymentForm.addControl('otpGenerated',new UntypedFormControl(false, Validators.required));
          this.reelerPaymentForm.addControl('setResend',new UntypedFormControl(false, Validators.required));
          
          this.reelerPaymentForm.get('referenceNumber').patchValue('Use Credits');
        }
        this.reelerPaymentForm.get('referenceNumber').updateValueAndValidity();
        this.reelerPaymentForm.updateValueAndValidity();
      })
    }

    payNow(payment, item) {
      console.log(item);
      
      this.paymentDetail = item;
      // this.reelerPaymentForm.controls['amount'].setValue(item.dueAmount?.toFixed(2));
      this.reelerPaymentForm.controls['amount'].setValue(parseFloat(item.dueAmount).toFixed(2));

      this.reelerPaymentForm.controls['referenceNumber'].setValue('');
      this.listenForPaymentMode();
      this.highlightText = this.paymentDetail.dueAmount.toLocaleString('en-IN').split('.');
      this.masterInformation();
      this.modalRef = this.modalService.open(payment)
      this.getReelerKhata()
    }
    getReelerKhata(){
      this.ngxLoader.stop();
      this.api.getCocoonReelerKhataforPayments(this.orderDetails.id).then((res:any)=>{
        this.mudraSalesPayment = res?.embedded?.reelerpayment?.some(x=>x.paymentMode=="Mudra");
      })
    } 
  user;
  multiRole=[]
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('_ud'));
    this.multiRole = this.user.roles;
    if(this.multiRole.length == 2 && this.multiRole.includes('COperationsAgent') && this.multiRole.includes('COCOON_PROCUREMENT_EXEC') && this.multiRole.includes('COCOON_SALES_EXEC') && this.multiRole.includes('FinanceManager')){
      this.user.role = 'COperationsAgent,COCOON_PROCUREMENT_EXEC,COCOON_SALES_EXEC,FinanceManager'
    }
  }
  id:any;

  @Output()
  listenAndRefresh:EventEmitter<any> = new EventEmitter<any>();

  reelerPayment() {
    this.ngxLoader.stop();
    if(this.reelerPaymentForm.get('paymentMode').value=='Self'){
      if (this.reelerPaymentForm.value.amount && this.reelerPaymentForm.value.referenceNumber) {
        const reqObj = {
          // amount: this.reelerPaymentForm.value.amount,
          // referenceNumber: this.reelerPaymentForm.value.referenceNumber,
          // paymentOn: Date.parse(new Date().toString()),
          // cocoonOrder: '/cocoonorder/' + this.paymentDetail.id,
          // reeler: '/reeler/' + this.paymentDetail.reelerId,
          // screenshotUrl: null,
          amount: this.reelerPaymentForm.value.amount,
          referenceNumber: this.reelerPaymentForm.value.referenceNumber,
          paymentOn: Date.parse(new Date().toString()),
          cocoonOrder: '/cocoonorder/' + this.paymentDetail.id,
          reeler: {
            "id": this.paymentDetail.reelerId
          },
          screenshotUrl: null,
          productType : "Silk",
        }
        this.api.payReelerDueAmountOfCocoon(reqObj).then(_response => {
          this.reelerPaymentForm.reset();
          this.$gaService.event('Cocoon Sales Payment', ` totalAmount =  ${reqObj.amount}`);
        // this.getReelerKhata();
        // this.getCocoonOrderById(this.id);
        this.listenAndRefresh.emit();
        this._cd.detectChanges();
          this.modalRef.close();
          this.snackBar.open('Payment of Rs. ' + reqObj.amount + ' Done Succesfully', 'Ok', {
            duration: 3000
          });
          this.reelerPaymentForm.controls['referenceNumber'].setValue('');
          this.reelerPaymentForm.controls['amount'].setValue('');
          this.reelerPaymentForm.get('paymentMode').patchValue('Self')
        }, err => {
          console.log(err);
        })
      } else {
        this.snackBar.open('Please Enter Amount and Reference Number', 'Ok', {
          duration: 3000
        });
      }
    } else {
      // verify otp first
      let otpReqObj = {
        phone: this.paymentDetail.reelerPhone,
        requestId: this.reelerPaymentForm.value.requestId,
        otp: this.reelerPaymentForm.value.otp
      }
      this.api.verifyMudraOtp(otpReqObj).then((res: any) => {
        const params = {
          "entityType": "COCOON_ORDER",
          "entityId": this.paymentDetail.id,
          "principalAmount": this.reelerPaymentForm.value.amount,
          // "profile": "REELER",
          "customerId": this.masterLoanInfo.customer.id,
          // "orderDate": this.paymentDetail.createdDate,
          "productType":"BNPL"
        }
        this.api.payReelerDueAmountFromMudra(params).then(response => {
          this.reelerPaymentForm.reset();
          // this.getReelerKhata();
          // this.getCocoonOrderById(this.id);
          this.listenAndRefresh.emit();
          this._cd.detectChanges();
          this.modalRef.close();
          this.$gaService.event('Cocoon Sales Payment', ` totalAmount =  ${params.principalAmount}`);
          this.snackBar.open('Payment of Rs. ' + params.principalAmount + ' Done Succesfully', 'Ok', {
            duration: 3000
          });
          this.reelerPaymentForm.controls['referenceNumber'].setValue('');
          this.reelerPaymentForm.controls['amount'].setValue('');
          this.reelerPaymentForm.get('paymentMode').patchValue('Self')
          this.modalRef.close();
        }, err => {
          console.log(err);
          this.snackBar.open(err.error.localizedMessage, 'Ok', {
            duration: 8000
          });
        })
      }, err=> {
        this.snackBar.open('Invalid OTP, Please try again', 'Ok', {
          duration: 3000
        });
      })
    }
    
  }


  masterLoanInfo;
  masterLoanInfoResponseArray = [];
  masterInformation(){
    this.apiSearch.creditLoans(false,'creditlinesvc/creditlimit/spec',`(customer.externalCustomerId==${this.customerId} and customer.profile==REELER)`).then(res=>{
      this.masterLoanInfo = res['content'][0];
      // if(this.masterLoanInfo?.availableCreditLimit > this.paymentDetail.dueAmount?.toFixed(2)){
      if(this.masterLoanInfo?.availableCreditLimit > parseFloat(this.paymentDetail.dueAmount).toFixed(2)){

        this.reelerPaymentForm.controls['amount'].setValue(this.paymentDetail.dueAmount?.toFixed(2));
      }else{
        this.reelerPaymentForm.controls['amount'].setValue(this.masterLoanInfo?.availableCreditLimit);
      }
      this.masterLoanInfoResponseArray = res['content'];
      this._cd.detectChanges();
    });
  }


    isControlValidForReeler(controlName: string): boolean {
    const control = this.reelerPaymentForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.reelerPaymentForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.reelerPaymentForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  generateOTP() {
    this.timeLeft = 30;
    this.reelerPaymentForm.get('setResend').patchValue(false);
    let searchQuery = `(applicationName==experian-service)`;
    this.apiSearch.getAllOtpRules(false,searchQuery).then((res:any)=> {
      this.reelerPaymentForm.get('requestId').patchValue(res.content[0].id)
      let reqObj = {
        phone: this.paymentDetail.reelerPhone,
        otpRuleId: res.content[0].id,
        contextAttributes : {
        transactionId : this.paymentDetail.id,
        amount : this.reelerPaymentForm.controls['amount'].value,
        userId : this.paymentDetail.reelerId
    }
      }
      this.api.generateMudraOtp(reqObj).then((res:any)=> {
        this.countTimer();
        this._cd.detectChanges();
        this.reelerPaymentForm.get('otpGenerated').patchValue(true);
        this.reelerPaymentForm.get('requestId').patchValue(res.requestId);
        this.snackBar.open('OTP Sent Succesfully', 'Ok', {
          duration: 3000
        });
      },err=> {
        this.snackBar.open('Could not generate OTP, Please try again', 'Ok', {
          duration: 3000
        });
      })
      
    })
  }

  countTimer(){
    this.reelerPaymentForm.get('setResend').patchValue(true);
    this.timerId = setInterval(()=> {
      if (this.timeLeft == 0) {
          clearTimeout(this.timerId);
      } else {
          this.timeLeft--;
      }
     }, 1000);
  }

}
