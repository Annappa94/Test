import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-chawki-order-details',
  templateUrl: './chawki-order-details.html',
  styleUrls: ['./chawki-order-details.component.scss']
})
export class ChawkiOrderDetailsComponent implements OnInit {

  id;
  orderDetails;
  reelerDetails;
  chawkiDetail;
  reelerPaymentForm: UntypedFormGroup;
  reelerKhata = [];
  modalRef: any;
  closeResult: string;
  paymentDetail: any;
  user: any;
  paymentForm:UntypedFormGroup;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private utils: UtilsService,
    private _cd: ChangeDetectorRef,
    private form: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private modalService: NgbModal,
    public globalService: GlobalService,
    public rolesService: RolesService,
    private ngxLoader : NgxUiLoaderService,
    private $gaService:GoogleAnalyticsService,
  ) {
    this.user = JSON.parse(localStorage.getItem('_ud'));
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.getChawkiOrderById(this.id);
      }
    });
  }

  ngOnInit(): void {
    this.paymentFormInt();
  }

  paymentFormInt(){
    this.paymentForm = this.form.group({
      referenceNumber:['',Validators.required],
      amount:['',Validators.required]
    })
  }

  getChawkiOrderById(id) {
    this.ngxLoader.stop();
    this.api.getChawkiOrderById(id).then(res => {
      console.log('orderid',res)
      this.orderDetails = res['chawkiOrder'];
      this.orderDetails.createdDate = this.utils.getDisplayTime(this.orderDetails.createdDate);
      this.orderDetails.lastModifiedDate = this.utils.getDisplayTime(this.orderDetails.lastModifiedDate);
      this.orderDetails.deliveryDate = this.orderDetails.deliveryDate ? this.utils.getDisplayTime(this.orderDetails.deliveryDate) : '-';
      this.chawkiDetail = res; 
      this._cd.detectChanges();
    })
  }

  farmerDetail() {
    this.router.navigate(['/resha-farms/farmers/details', this.chawkiDetail.farmerid]);
  }
  
  goToChawkiDetails() {
    this.router.navigate(['/resha-farms/chawki/details', this.chawkiDetail.chawkiId]);
  }

  goBack() {
    this.router.navigate(['/resha-farms/chawki-orders']);
  }

  deleteOrder() {
    this.ngxLoader.stop();
    this.api.deleteCocoonOrderById(this.orderDetails.id).then(success => {
      this.modalRef.close();
      this.snackBar.open('Order Deleted Successfully', 'Ok', {
        duration: 3000,
      });
    this.router.navigate(['/resha-farms/cocoon-orders']);
    })
  }

  deleteConfirmatin(deleteLot) {
    this.modalRef = this.modalService.open(deleteLot)
          this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed`;
          });
  }

  markSoldConfirmation(content) {
    this.orderDetails.referenceNumber = '';
    this.highlightText = this.orderDetails['totalAmount'].toLocaleString('en-IN').split('.');
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  markAsSold() {
    const param = {
      paymentStatus : "Paid",
        payment: {
          amount: this.orderDetails.totalAmount,
          referenceNumber: this.orderDetails.referenceNumber,
          isOutOfBand: true,
          paymentOn: Date.parse(new Date().toString())
      }
    }
    this.ngxLoader.stop();
    this.api.updateChawkiOrder(param, this.orderDetails.id).then(res => {
      this.$gaService.event('Chawki payment', ` amount =  ${param.payment.amount}`);

      this.getChawkiOrderById(this.id);
      this.modalRef.close();
      this.snackBar.open('Paid Suceessfully', 'Ok', {
        duration: 3000
      });
    })
  }
  highlightText;
  chawkiPayoutConfirmation(chawkiPayout) {
    this.paymentForm.get('amount').patchValue(this.orderDetails.totalPayableAmount);
    this.highlightText = this.orderDetails.totalPayableAmount.toLocaleString('en-IN').split('.');
    this.modalRef = this.modalService.open(chawkiPayout);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  makeChawkiPayout() {
    const param = {
      chawkiPayout: {
        amount: this.paymentForm.get('amount').value,
        referenceNumber: this.paymentForm.get('referenceNumber').value,
        isOutOfBand: true,
        paymentOn: Date.parse(new Date().toString())
    }
  }
  this.ngxLoader.stop();
  this.api.updateChawkiOrder(param, this.orderDetails.id).then(res => {

    this.$gaService.event('Chawki payout', ` amount =  ${param.chawkiPayout.amount}`);
    this.paymentForm.reset();
      this.getChawkiOrderById(this.id);
    this.modalRef.close();
    this.snackBar.open('Paid Suceessfully', 'Ok', {
      duration: 3000
    });
  })
  }

  controlHasErrorForChawki(validation, controlName): boolean {
    const control = this.paymentForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlValidForChawki(controlName: string): boolean {
    const control = this.paymentForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForChawki(controlName: string): boolean {
    const control = this.paymentForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
  openWindow()
  {
    window.open(this.orderDetails?.crcBillUrl);

  }


}
