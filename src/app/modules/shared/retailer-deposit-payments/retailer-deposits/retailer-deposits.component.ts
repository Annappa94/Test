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
  selector: 'app-retailer-deposits',
  templateUrl: './retailer-deposits.component.html',
  styleUrls: ['./retailer-deposits.component.scss']
})
export class RetailerDepositsComponent implements OnInit {  

 
  retailerPaymentForm:UntypedFormGroup;
  paymentDetail: any;

  @Input()
  orderDetails:any;

  @Input()
  isListingPage:boolean = false;

  @Input()
  isFinanceApproval:boolean = false;

  @Input()
  customerId:number;

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
      this.retailerPaymentForm = new UntypedFormGroup({
      amount: new UntypedFormControl('', [Validators.required,Validators.min(1)]),
      referenceNumber: new UntypedFormControl('', [Validators.required]),
      paymentMode: new UntypedFormControl('SINGLE')
    }) }
// ngOnChanges(changes: SimpleChanges): void {
//     this.orderDetails.sellingPricePerKg = parseFloat(this.orderDetails.sellingPricePerKg)
//   }
  dueDetails;
  highlightText;
  ngOnInit(): void {
  }
  modalRef;

  retailerName = '';
  retailerPhone = '';
  customerType = '';
  orderPaymentStatus = '';
  orderType = '';
  paymentType='';
  settleRejected = false;
  payNow(payment, item) {
    //console.log(item);
    if(item.code.includes('RETAILER')){
      this.customerType = 'retailer';
      this.orderPaymentStatus = 'paymentStatus';
      this.orderType = 'retailersalesorder';
      this.paymentType = 'V4_RETAILER_CORP_PAYMENT'
    } else if(item.code.includes('WEAVER')) {
      this.customerType = 'weaver';
      this.orderPaymentStatus = 'orderPaymentStatus';
      this.orderType = 'yarnorder';
      this.paymentType = 'V4_WEAVER_YARN_PAYMENT'
    } else {
      this.customerType = 'reeler';
      this.orderPaymentStatus = 'orderPaymentStatus';
      this.orderType = 'cocoonorder';
      this.paymentType = 'V3_REELER_COCOON_PAYMENT'
    }
    this.ngxLoader.stop();
    this.paymentDetail = item;
    this.retailerPhone = item.phone;
    if(this.isFinanceApproval){
      this.customerId = item.customerId;
      this.retailerName = item.customerName;
      this.apiSearch.getCustomerDepositDetails(this.paymentDetail.id).then(res=>{
        if(res){
          this.dueDetails = res;
          this.retailerPaymentForm.controls['referenceNumber'].setValue(res['referenceNumber']);
          if(res['settlementStatus'] === 'APPROVED' && (res['balance'] > 0)){
            this.settleRejected = true;
            this.highlightText = res['balance'].toLocaleString('en-IN').split('.');
            this.retailerPaymentForm.controls['amount'].setValue(res['balance']);
          } else {
            this.settleRejected = false;
            this.highlightText = res['amount'].toLocaleString('en-IN').split('.');
            this.retailerPaymentForm.controls['amount'].setValue(res['amount']);
          }
        }
      })
    } else {
      this.retailerName = item.name;
      this.apiSearch.getRetailerAggregates(this.customerId, this.customerType, this.orderPaymentStatus, this.orderType, 'dueAmount').then(res=>{
        
        if (res['responseCode'] === 200) {
          if (this.customerType == 'retailer') {
            this.apiSearch.getRetailerAggregates(this.customerId, this.customerType, this.orderPaymentStatus, this.orderType, 'returnOrderAmount').then(returnOrderAmt => {
              if (returnOrderAmt['responseCode'] === 200) {
                this.dueDetails = res;
                this.highlightText = Math.round(((res['data'] - returnOrderAmt['data']) + Number.EPSILON) * 100) / 100;
                this.highlightText = this.highlightText.toLocaleString('en-IN').split('.');
                this.retailerPaymentForm.controls['amount'].setValue(Math.round(((res['data'] - returnOrderAmt['data']) + Number.EPSILON) * 100) / 100);
                this.retailerPaymentForm.controls['referenceNumber'].setValue('');
                this.dueDetails.data = Math.round(((res['data'] - returnOrderAmt['data']) + Number.EPSILON) * 100) / 100;
              } else {
                this.dueDetails = res;
                this.highlightText = res['data'].toLocaleString('en-IN').split('.');
                this.retailerPaymentForm.controls['amount'].setValue(res['data']);
                this.retailerPaymentForm.controls['referenceNumber'].setValue('');
              }

            })
          } else {
            this.dueDetails = res;
            this.highlightText = res['data'].toLocaleString('en-IN').split('.');
            this.retailerPaymentForm.controls['amount'].setValue(res['data']);
            this.retailerPaymentForm.controls['referenceNumber'].setValue('');
          }
          this._cd.detectChanges();
        }
      }, err => {
        console.log(err);
      })
    }
    
    this.modalRef = this.modalService.open(payment)
  }
  rejectReason="";
  rejecting = false;
  approveFinance(){
    this.ngxLoader.stop();
    const params = {
      "rejectReasons":null,
      "approved":true,
      "depositId":this.paymentDetail.id
    }
    this.api.postRetailerDepositSettlement(params).then(res=>{
      this.retailerPaymentForm.reset();
      this.listenAndRefresh.emit();
      this._cd.detectChanges();
      this.modalRef.close();
      this.snackBar.open('Deposit Payment Succesfull', 'Ok', {
        duration: 3000
      });
    }, err => {
      console.log(err);
    })
  }
  rejectFinance(){
    this.rejecting = true;
  }
  onCancel(){
    this.rejecting = false;
    this.modalRef.close();
    
  }
  rejectFinanceFinal(){
    this.ngxLoader.stop();
    this.rejecting = false;
    const params = {
      "rejectReasons":this.rejectReason,
      "approved":false,
      "depositId":this.paymentDetail.id
  }
  this.api.postRetailerDepositSettlement(params).then(res=>{
    this.retailerPaymentForm.reset();
    this.listenAndRefresh.emit();
    this._cd.detectChanges();
    this.modalRef.close();
    this.snackBar.open('Deposit Payment Rejected Successfully', 'Ok', {
      duration: 3000
    });
  }, err => {
    console.log(err);
  })
  }
  @Output()
  listenAndRefresh:EventEmitter<any> = new EventEmitter<any>();
  retailerPayment(){
    this.ngxLoader.stop();
    const params = {
      "mode":this.retailerPaymentForm.get('paymentMode').value,
      "amount":this.retailerPaymentForm.get('amount').value,
      "balance":null,
      "fileUrl":null,
      "numberOfRecords":1,
      "settlementStatus":"NEW",
      "customerType":this.customerType?.toUpperCase(),
      "customerId":this.paymentDetail.id,
      "paymentType":this.paymentType,
      "referenceNumber":this.retailerPaymentForm.get('referenceNumber').value,
      //"referenceImageUrl":"DSFE.jpeg"
    }
    this.api.postRetailerDeposits(params).then(response => {
      this.retailerPaymentForm.reset();
      this.listenAndRefresh.emit();
      this._cd.detectChanges();
      this.modalRef.close();
      this.snackBar.open('Deposit Payment of Rs. ' + params.amount + ' Done Succesfully', 'Ok', {
        duration: 3000
      });
      this.retailerPaymentForm.controls['referenceNumber'].setValue('');
      this.retailerPaymentForm.controls['amount'].setValue('');
      this.modalRef.close();
    }, err => {
      console.log(err);
    })
  }
  isControlValidForReeler(controlName: string): boolean {
    const control = this.retailerPaymentForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.retailerPaymentForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  } 

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.retailerPaymentForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }
}
