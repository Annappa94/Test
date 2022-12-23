import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomValidator } from '../custom-validator/custom.validator';
import { BankServiceService } from 'src/app/services/api/bank-service.service';
import { SearchService } from 'src/app/services/api/search.service';

export interface INITIATE_PAYMENT{
  "customerId": string,
  "amount" : string,
  "mandateId":string,
  "settlementDate" : any,
  "bankId": string,    
  "reference" : string,
  "comments":string,
  "productType":string,
  "accountId":number
}

@Component({
  selector: 'app-initialize-payment',
  templateUrl: './initialize-payment.component.html',
  styleUrls: ['./initialize-payment.component.scss']
})
export class InitializePaymentComponent implements OnInit {


  @ViewChild('htmlContent')
  htmlContent:ElementRef;
  initiatePaymentForm : UntypedFormGroup;
  maxDate
  minDate = new Date();

  @Input()
  customer_id:string;

  @Input()
  bank_id:string;
  
  @Input()
  mandateId:string;

  @Input()
  disabled:boolean = false;

  @Input()
  event:string = '';

  @Output()
  refresh:EventEmitter<any> = new EventEmitter<any>();
  getProductTypeDetails : any;

  viewPaymentHistory(){
   this.router.navigate(['/bank/payment-history',this.customer_id,this.mandateId])
  }

  constructor(
    private modalService:NgbModal,
    private form : UntypedFormBuilder,
    private api:BankServiceService,
    private snackBar:MatSnackBar,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private apiSearch:SearchService,
    ) { 
    this.initiatePaymentForm = this.form.group({
      amount: this.form.control(null,[Validators.required,CustomValidator.cannotContainOnlySpace,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      rm_settlement_date: this.form.control(null,[Validators.required]),
      reference: this.form.control(null,[Validators.required,CustomValidator.cannotContainOnlySpace]),
      comments: this.form.control(null,[Validators.required,CustomValidator.cannotContainOnlySpace]),
      productType: this.form.control(null,[Validators.required])
    });
  }

  ngOnInit(): void {
    this.minDate.setDate(this.minDate.getDate()+1);
  }
  openPopUp(){
    this.masterAllListOfLoans();    
    this.modalService.open(this.htmlContent)
  }

  masterAllListOfLoans(){
    this.ngxLoader.stop();
    this.apiSearch.creditLoans(false,'creditlinesvc/creditlimit/master/spec',`(customer.id==${this.customer_id})`).then(res=>{
      // this.getProductTypeDetails = res['content'].map(x=>x=x.productType);
      this.getProductTypeDetails = res['content'];
      console.log("getProductTypeDetails",this.getProductTypeDetails);
    });
  }


  buildPayload():INITIATE_PAYMENT{

    const {amount, rm_settlement_date,reference,comments,productType} = this.initiatePaymentForm.value;
    return  {
      "customerId": this.customer_id,
      "mandateId": this.mandateId,
      "amount" : amount,
      "settlementDate" : Date.parse(rm_settlement_date),
      "bankId": this.bank_id,    
      "reference" : reference,
      "comments": comments,
      "productType": productType.productType,
      "accountId": productType.id
   }
  }

  createInitiatePayment(){
    this.ngxLoader.stop();
    this.api.createRecordLoan(`nach/debit`,this.buildPayload()).then((res:any)=>{
      this.snackBar.open(`${res?.message}`, 'Ok', {
        duration: 5000
      });
      this.refresh.emit();
      this.modalService.dismissAll();
    }).catch(err=>{
      this.snackBar.open(`${err.error.message}`, 'Ok', {
        duration: 8000
      });
    })
  }


  close(){
    this.modalService.dismissAll();
    this.initiatePaymentForm.reset();
  }

  initiateMandate(){
    this.createInitiatePayment();
  }

}
