import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BankServiceService } from 'src/app/services/api/bank-service.service';

@Component({
  selector: 'app-mandate-cancel',
  templateUrl: './mandate-cancel.component.html',
  styleUrls: ['./mandate-cancel.component.scss']
})
export class MandateCancelComponent implements OnInit {

  constructor(private api:BankServiceService,private snackBar:MatSnackBar,private ngbModal:NgbModal,private ngxLoader:NgxUiLoaderService,private activatedRoute:ActivatedRoute) { }

  @Input()
  customerId:number;

  @Input()
  productType:string = "BNPL";

  @Input()
  bankId:string;

  @Input()
  umrn:string;

  @Input()
  mandateId:string;

  @Input()
  isCancelled:boolean = true

  @Output()
  refresh:EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('Confirm')
  confirmHTML:ElementRef;
  
  cancelMandate(){
    let payload =   {
      "customerId": this.customerId,
      "productType": this.productType,
      "bankId": this.bankId,
      "cancel" : {
          "umrn" : this.umrn,
          "mandateId" : this.mandateId
      }
    }

    let leadProfileId = this.activatedRoute.snapshot.params.leadProfileId;
    leadProfileId&&(payload['source']="LEAD");
    this.ngxLoader.stop();
    this.api.createRecord(`/digio/cancel/mandate`,payload).then((res:any)=>{
      this.refresh.emit();
      this.ngbModal.dismissAll();
      this.snackBar.open(`${res?.message}`, 'Ok', {
        duration: 5000
      });
    })
  }

  ngOnInit(): void {
  }


  cancelMandatePopUp(){
    this.ngbModal.open(this.confirmHTML);
  }
}
