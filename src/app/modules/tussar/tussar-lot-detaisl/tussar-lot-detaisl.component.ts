import { Component, OnInit,ChangeDetectorRef, OnDestroy  } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ApiService } from 'src/app/services/api/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalService } from 'src/app/services/global/global.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Subscription, interval } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-tussar-lot-detaisl',
  templateUrl: './tussar-lot-detaisl.component.html',
  styleUrls: ['./tussar-lot-detaisl.component.scss']
})
export class TussarLotDetaislComponent implements OnInit {
  id;
  lotDetails;
  farmerDetails;
  lotOrderDetails;
  modalRef: any;
  closeResult: string;
  markSoldItem: any;    
  user;
  farmerPayout;
  paymentForm:UntypedFormGroup;
  multiRole = [];
  lotCocoonOrderDetails;

  countdowTimer:any;
  currentTime;
  startDate;
  timedisplay;
  timedisplayRed;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private router: Router,
    public utils: UtilsService,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    public globalService: GlobalService,
    public rolesService: RolesService,
    private ngxLoader : NgxUiLoaderService,
    private form :UntypedFormBuilder,
    private $gaService:GoogleAnalyticsService,
  ) {
    this.user = JSON.parse(localStorage.getItem('_ud'));
    this.multiRole = this.user.roles;
    if(this.multiRole.length == 2 && this.multiRole.includes('COperationsAgent') && this.multiRole.includes('COCOON_PROCUREMENT_EXEC') && this.multiRole.includes('COCOON_SALES_EXEC') && this.multiRole.includes('FinanceManager')){
      this.user.role = 'COperationsAgent,COCOON_PROCUREMENT_EXEC,COCOON_SALES_EXEC,FinanceManager'
    }
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.getTussarById();
      }
    });
  }

  ngOnInit(): void {
    this.paymentFormInt();
  }
  getTussarById() {
    this.ngxLoader.stop();
    this.api.getTussarsLotById(this.id).then(res => {
      this.lotDetails = res;      
      this.startDate = new Date(this.lotDetails?.createdDate);  //this start date using for time calculation     
      this.farmerPayout = res['farmerPayout'];
      if(this.lotDetails?.cocoonRendittaId) {
        this.api.getRendittaGradingById(this.lotDetails?.cocoonRendittaId).then(gradingData=> {
          this.lotDetails.cocoonRendittaImage = gradingData['imageUrl'];
          this.lotDetails.systemPredictedGrade = gradingData['rmGrade'];
          })
      }
      this.lotDetails.lastModifiedDate =  this.lotDetails?.lastModifiedDate ? this.utils.getDisplayTime(this.lotDetails?.lastModifiedDate) : '-';
      this.lotDetails.createdDate =  this.lotDetails.createdDate ? this.utils.getDisplayTime(this.lotDetails.createdDate) : '-';
      this.lotDetails.paymentDueDate =  this.lotDetails.paymentDate ? this.utils.getDisplayTime(this.lotDetails.paymentDate) : '-';
      //this.lotDetails.paymentDate =  res['farmerPayout'] ? this.utils.getDisplayTime(res['farmerPayout']['createdDate']) : '-';
      this.lotDetails.sellingPriceTotal = this.lotDetails?.sellingPriceTotal?.toLocaleString('en-IN');
      this.lotDetails.displayCocoonType = this.lotDetails.type ? this.globalService.getDisplayCocoonType(this.lotDetails.type) : '-';
      this.lotDetails.discountValue = res['discountValue'] ? res['discountValue'] : 0;
      if(this.lotDetails.discountValue > 0) {
        this.lotDetails.netAmount = this.lotDetails.totalPrice - this.lotDetails.discountValue;
        this.lotDetails.displayNetAmount = this.lotDetails.netAmount.toLocaleString('en-IN');
        this.lotDetails.displayTotalPrice = this.lotDetails.totalPrice.toLocaleString('en-IN');
        this.lotDetails.netTotalPrice = this.lotDetails.totalPrice.toLocaleString('en-IN').split('.')[0]?this.lotDetails.totalPrice.toLocaleString('en-IN').split('.')[0]:0;
        this.lotDetails.displayTotalPriceHTML = `<span class="font-size-h1 text-warning">Rs. ${this.lotDetails.totalPrice.toLocaleString('en-IN').split('.')[0]?this.lotDetails.totalPrice.toLocaleString('en-IN').split('.')[0]:0}</span> . <span class="font-size-h6 text-warning">${this.lotDetails.totalPrice.toLocaleString('en-IN').split('.')[1]?this.lotDetails.totalPrice.toLocaleString('en-IN').split('.')[1]:0}</span>`;
      } else {
        this.lotDetails.netAmount = 0;
        this.lotDetails.displayTotalPrice = this.lotDetails.totalPrice.toLocaleString('en-IN');
        this.lotDetails.netTotalPrice = this.lotDetails.totalPrice.toLocaleString('en-IN').split('.')[0]?this.lotDetails.totalPrice.toLocaleString('en-IN').split('.')[0]:0;

        this.lotDetails.displayTotalPriceHTML =  `<span class="font-size-h1 text-warning">Rs. ${this.lotDetails.totalPrice.toLocaleString('en-IN').split('.')[0]?this.lotDetails.totalPrice.toLocaleString('en-IN').split('.')[0]:0}</span> . <span class="font-size-h6 text-warning">${this.lotDetails.totalPrice.toLocaleString('en-IN').split('.')[1]?this.lotDetails.totalPrice.toLocaleString('en-IN').split('.')[1]:0}</span>`;
      }
      this.farmerDetails = res;
      //console.log(' this.farmerDetails', this.farmerDetails?.farmer?.id);
      
      this.getLotOrderDetails();
      //this.getOrderDetails();
      
      this._cd.detectChanges();
    }, err => {
      console.log(err);
    });
  }
  
  
  
  time() {
    if(this.lotDetails?.availableQuantity == 0){
      let lastsoldTime = this.lotOrderDetails[this.lotOrderDetails.length-1].createdDate;
      let minutesrunning = Math.abs(new Date(lastsoldTime).getTime() - this.startDate.getTime()) / 36e5 * 60;      
      let num = minutesrunning;
      let hours = (num / 60);
      let rhours:any = Math.floor(hours);
      let minutes = (hours - rhours) * 60;
      let rminutes:any = Math.round(minutes);
      let seconds = (minutes-rminutes);
      let rseconds:any = Math.round(seconds * 60) + 30; //  get seconds

      // add 0 if value < 10; Example: 2 => 02
      if (rhours   < 10) {rhours   = "0"+rhours;}
      if (rminutes < 10) {rminutes = "0"+rminutes;}
      // if (seconds < 10) {rseconds = "0"+rseconds;}
      this.timedisplay =rhours + " h:" +rminutes + " m: " +rseconds + 'S' 
      //  console.log(this.timedisplay );
      this._cd.detectChanges();

      if(rhours > 48) {
      this.timedisplayRed = this.timedisplay;
      // clearInterval(this.countdowTimer);
      }

    }else{
      let interval = 1000;
      this.countdowTimer =  setInterval(() => {
        let currentTime:any = new Date();
        let minutesrunning = Math.abs(currentTime.getTime() - this.startDate.getTime()) / 36e5 * 60;      
        let num = minutesrunning;
        let hours = (num / 60);
        let rhours:any = Math.floor(hours);
        let minutes = (hours - rhours) * 60;
        let rminutes:any = Math.round(minutes);
        let seconds = (minutes-rminutes);
        let rseconds:any = Math.round(seconds * 60) + 30; //  get seconds
  
        // add 0 if value < 10; Example: 2 => 02
        if (rhours   < 10) {rhours   = "0"+rhours;}
        if (rminutes < 10) {rminutes = "0"+rminutes;}
        // if (seconds < 10) {rseconds = "0"+rseconds;}
        this.timedisplay =rhours + " h:" +rminutes + " m: " +rseconds + 'S' 
        //  console.log(this.timedisplay );
        this._cd.detectChanges();
  
        if(rhours > 48) {
        this.timedisplayRed = this.timedisplay;
        // clearInterval(this.countdowTimer);
        }
      }, interval);
    }
   
  }
  
  goBack() {
    this.router.navigate(['/resha-farms/tussar/tussar-lot-list']);
  }

  getLotOrderDetails() {
    this.ngxLoader.stop();
    this.api.lotOrderDetails(this.lotDetails.id).then((res:any) => {      
      if(res.length) {
        this.lotOrderDetails = res;     
      } else {
        this.lotOrderDetails = [];
      }
      this.time();
      this._cd.detectChanges();
    })
  }
  
  getOrderDetails() {
    this.ngxLoader.stop();
    this.api.getCocoonOrderDetails(this.lotDetails.id).then((res:any) => {      
     if(res['_embedded']['cocoonorder'].length) {
      this.lotCocoonOrderDetails = res['_embedded']['cocoonorder'];      
    } else {
      this.lotCocoonOrderDetails = [];
    }
      this.time();
      this._cd.detectChanges();
    })
  }

  goToOrderDetails(item) {
    this.router.navigate(['/resha-farms/tussar/tussar-order-details', item.cocoonOrderId]);
  }

  goToReelerDetail(item) {
    this.router.navigate(['/resha-farms/tussar/tussar-reeler-details', item.reelerId]);
  }

  goToFarmerDetails() {
    this.router.navigate(['/resha-farms/tussar/tussar-farmer-details', this.farmerDetails.farmerId]);
  }

  deleteCurrentLot() {
    this.ngxLoader.stop();
    this.api.deleteCocoonLotById(this.lotDetails.id).then(success => {
      this.modalRef.close();
      this.snackBar.open('Lot Deleted Successfully', 'Ok', {
        duration: 3000,
      });
    this.router.navigate(['/resha-farms/cocoon-lot']);
    })
  }

  reelerDetails(item) {
    this.router.navigate(['/reelers/details', item.reelerId]);

  }

  deleteConfirmatin(deleteLot) {
    this.modalRef = this.modalService.open(deleteLot)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  markSoldConfirmation(item, content) {
    this.markSoldItem = item;    
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  markAsSold() {
    const param = {
        amount: this.markSoldItem.totalPrice,
        isOutOfBand: true,
        farmer: {"id": this.farmerDetails?.farmer?.id},
        tussarLot :'/tussarlot/' + this.lotDetails.id,
        paymentDate: Date.parse(new Date().toString()),
        referenceNumber: this.paymentForm.value['refRenceNumber'],
    }
    this.ngxLoader.stop();
    this.api.tussarFarmerPayment(param).then(res => {
      this.$gaService.event('Tussar payout', ` totalAmount =  ${param.amount}, lot = ${this.lotDetails.id}`);

      this.paymentForm.reset();
      this.getTussarById();
      this.modalRef.close();
      this.snackBar.open('Paid Suceessfully', 'Ok', {
        duration: 3000
      });
    })
  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.paymentForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlValidForReeler(controlName: string): boolean {
    const control = this.paymentForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  paymentFormInt(){
    this.paymentForm = this.form.group({
      refRenceNumber:['',Validators.required]
    })
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.paymentForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

}
