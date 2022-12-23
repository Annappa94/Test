import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from 'src/app/services/api/search.service';

@Component({
  selector: 'app-generic-payment',
  templateUrl: './generic-payment.component.html',
  styleUrls: ['./generic-payment.component.scss']
})
export class GenericPaymentComponent implements OnInit,OnChanges {

  constructor(private api:SearchService,private snackBar:MatSnackBar,private form:UntypedFormBuilder,private modalService:NgbModal) { }
  
  @Output()
  refresh = new EventEmitter<void>();

  paymentForm:UntypedFormGroup = this.form.group({
    amount: new UntypedFormControl('', [Validators.required]),
    referenceNumber: new UntypedFormControl('', [Validators.required])
  }) 

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.paymentInfo);
    
   }

  @Input()
  paymentInfo:PaymentInfo;

  ngOnInit(): void {
  }

  updatePayment(payload:any){
    this.api.updatePayment(payload,this.paymentInfo.endpoint).then(res=>{
      this.snackBar.open('Payment Updated Successfully', 'Ok', {
        duration: 3000
      });
      this.modalService.dismissAll();
      this.refresh.emit();
    }).catch(err=>{
      this.snackBar.open('Some thing went wrong', 'Ok', {
        duration: 3000
      });
    })
  }

  makeAPayment(){
    let payload = { "amount": this.paymentForm.value.amount,"isOutOfBand": true,"referenceNumber":this.paymentForm.value.referenceNumber}
    payload[this.paymentInfo.customerIdKey] =this.paymentInfo.customerIdValue
    payload[this.paymentInfo.productIdKey] =this.paymentInfo.productIdValue
    // "farmerId": this.paymentDetail.farmerId,
    // "cottonLot" :"/cottonlot/"+ this.paymentDetail.id
    this.updatePayment(payload);
  }

  highlightText;
  paymentDetail;
  payNow(payment) {    
    this.paymentDetail = {...this.paymentInfo};
    this.paymentForm.controls['amount'].setValue(this.paymentDetail.dueAmount);
    this.paymentForm.controls['referenceNumber'].setValue('');
    this.highlightText = this.paymentDetail['displayTotalAmount'].split('.');
    this.modalService.open(payment)
  }

  isControlValidForReeler(controlName: string): boolean {
    const control = this.paymentForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.paymentForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.paymentForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

}
export interface PaymentInfo{
  dueAmount: number,
  isOutOfBand: boolean,
  displayTotalAmount:number,
  customerIdKey:string,
  productIdKey:string,
  customerIdValue:string,
  productIdValue:string,
  paymentStatus:string,
  totalQuantity:any,
  endpoint:string,
  cottonLotStatus:String,
}