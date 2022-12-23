import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomValidator } from '../custom-validator/custom.validator';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-cotton-orderpayment',
  templateUrl: './cotton-orderpayment.component.html',
  styleUrls: ['./cotton-orderpayment.component.scss']
})
export class CottonOrderpaymentComponent implements OnInit {

  constructor(
    private apiSearch:SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private api:ApiService,
    private router:Router,
    private snackBar:MatSnackBar,
    private form: UntypedFormBuilder,
    private modalService:NgbModal,
    public rolesService:RolesService
  ) { }

  ngOnInit(): void {
  }
  @ViewChild('paymentDetailesHtml')
  paymentDetailesHtml:ElementRef;
  user = JSON.parse(localStorage.getItem('_ud'));
  modalRef;

  @Input()
  details:any;

  paymentDetail
  closeResult;
  ginnerPaymentForm:UntypedFormGroup = new UntypedFormGroup({
    amount:new UntypedFormControl([],[Validators.required,CustomValidator.cannotContainOnlySpace]),
    referenceNumber:new UntypedFormControl([],[Validators.required,CustomValidator.cannotContainOnlySpace])
  });
  ginner:any;
  payNow(payment,item = this.details) {
    console.log(item);
    this.paymentDetail = item;
    this.ginnerPaymentForm.controls['amount'].setValue(item.dueAmount);
    this.ginnerPaymentForm.controls['referenceNumber'].setValue('');
    this.api.getGinnerDetailsById(item?.id).then((res:any)=>{
      this.ginner = res;
      this.modalRef = this.modalService.open(payment)
    });
  }

   // payment Validations
   isControlValidForReeler(controlName: string): boolean {
    const control = this.ginnerPaymentForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.ginnerPaymentForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.ginnerPaymentForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

}
