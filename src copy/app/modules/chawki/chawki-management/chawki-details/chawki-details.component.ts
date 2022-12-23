import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ApiService } from 'src/app/services/api/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalService } from 'src/app/services/global/global.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import * as moment from 'moment';
import { ChawkiBatchCrudComponent } from '../chawki-batch-crud/chawki-batch-crud.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
@Component({
  selector: 'app-chawki-details',
  templateUrl: './chawki-details.html',
  styleUrls: ['./chawki-details.component.scss']
})
export class ChawkiDetailsComponent implements OnInit {
  id;
  chawkiDetails;
  modalRef: any;
  closeResult: string;
  markSoldItem: any;    
  user;
  chawkiOrderSearch = '';
  deleteBatchId;
  previewImage: string | ArrayBuffer;
  imageFile = null;
  imageUploaded = false;
  minDate;
  chawkiType;
  iotDeviceList: any = [];
  iotDeviceDate;

  iotDevicePaymentList:any=[];
  paymentDetail: any;
  iotDevicePaymentForm: UntypedFormGroup;
  expandImage=false;
  modelImageUrl=null;

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
    public dialog: MatDialog,
    private ngxLoader : NgxUiLoaderService,
    form: UntypedFormBuilder,
    private $gaService:GoogleAnalyticsService,
  ) {
    const currentYear = moment().year();
      const currentMonth = moment().month();
      const currentDay = moment().date();      
      this.minDate = moment([currentYear, currentMonth, currentDay]);
    this.user = JSON.parse(localStorage.getItem('_ud'));
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.getChowkiById();
      }
    });

    this.iotDevicePaymentForm = form.group({
      amount: new UntypedFormControl('', [Validators.required]),
      referenceNumber: new UntypedFormControl('', [Validators.required]),
      paymentMode: new UntypedFormControl('Online', [Validators.required])
    })
  }

  ngOnInit(): void {
    // Nothing to do
  }

  getChowkiById() {
    this.ngxLoader.stop();
    this.api.getChawkiById(this.id).then(res => {
      this.api.getAssociatedDeviceByFarmId(res['code']).then((deviceList:any) => {
        this.iotDeviceList = deviceList;
        if(deviceList.length)
        this.iotDeviceDate = deviceList[0]['createdDate'] ? this.utils.getDisplayTime(deviceList[0]['createdDate']): '-';

      })
      this.chawkiDetails = res;
      if(this.chawkiDetails.name) {
        this.chawkiDetails.initial = this.chawkiDetails.name.match(/(^\S\S?|\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
      }
      this.chawkiDetails.lastModifiedDate =  this.chawkiDetails.lastModifiedDate ? this.utils.getDisplayTime(this.chawkiDetails.lastModifiedDate) : '-';
      this.previewImage = res['profilePicUrl'];
      if(this.chawkiDetails.chawkiTypes && this.chawkiDetails.chawkiTypes.length) {
        let priceOfWhiteIndex = this.getTypeIndex(this.chawkiDetails.chawkiTypes, 'WHITE');
        this.chawkiDetails.priceForWhite = priceOfWhiteIndex > -1 ?  this.chawkiDetails.chawkiTypes[priceOfWhiteIndex].price : 0;
        this.chawkiDetails.actualBuyingPriceForWhite = priceOfWhiteIndex > -1 ?  this.chawkiDetails.chawkiTypes[priceOfWhiteIndex].actualBuyingPrice : 0;
        this.chawkiDetails.crcPriceForWhite = priceOfWhiteIndex > -1 ?  this.chawkiDetails.chawkiTypes[priceOfWhiteIndex].crcPrice : 0;
        this.chawkiDetails.crcDiscountForWhite = priceOfWhiteIndex > -1 ?  this.chawkiDetails.chawkiTypes[priceOfWhiteIndex].crcDiscount : 0;
        this.chawkiDetails.sellingPriceForWhite = priceOfWhiteIndex > -1 ?  this.chawkiDetails.chawkiTypes[priceOfWhiteIndex].sellingPrice : 0;


        let priceOfGoldIndex = this.getTypeIndex(this.chawkiDetails.chawkiTypes, 'GOLD');
        this.chawkiDetails.priceForGold = priceOfGoldIndex > -1 ?  this.chawkiDetails.chawkiTypes[priceOfGoldIndex].price : 0;
        this.chawkiDetails.actualBuyingPriceForGold = priceOfGoldIndex > -1 ?  this.chawkiDetails.chawkiTypes[priceOfGoldIndex].actualBuyingPrice : 0;
        this.chawkiDetails.crcPriceForGold = priceOfGoldIndex > -1 ?  this.chawkiDetails.chawkiTypes[priceOfGoldIndex].crcPrice : 0;
        this.chawkiDetails.crcDiscountForGold = priceOfGoldIndex > -1 ?  this.chawkiDetails.chawkiTypes[priceOfGoldIndex].crcDiscount : 0;
        this.chawkiDetails.sellingPriceForGold = priceOfGoldIndex > -1 ?  this.chawkiDetails.chawkiTypes[priceOfGoldIndex].sellingPrice : 0;
      }
      this.chawkiDetails.createdDate =  this.chawkiDetails.createdDate ? this.utils.getDisplayTime(this.chawkiDetails.createdDate) : '-';
      this.chawkiDetails.cocoonType = this.chawkiDetails.cocoonType ? this.globalService.getDisplayCocoonType(this.chawkiDetails.cocoonType) : '-';
      this.getIotDeviceForFarmer(this.id);
      this._cd.detectChanges();
    }, err => {
      console.log(err);
    });
  }

  getIotDeviceForFarmer(id) {
    this.api.getIotDevicePaymentDetailsForCustomer(id, 'CHAWKI').then(iotDevicePaymentList=> {
      this.iotDevicePaymentList = iotDevicePaymentList['content'];
      if(this.iotDevicePaymentList.length) {
        for(let i=0;i<this.iotDevicePaymentList.length;i++) {
          this.paymentHistoryForDevice(this.iotDevicePaymentList[i].deviceId, i);
          this._cd.detectChanges();
        }
      }
    })
  }

  async paymentHistoryForDevice(iotAccountId, index) {
    await this.api.getIotDevicePaymentHistory(iotAccountId).then(history => {
      this.iotDevicePaymentList[index].paymentHistory = history['content'];
      this._cd.detectChanges();
    })
  }

  openPaymentDetails(paymentDetails, item) {
    this.paymentDetail = item;
    this.modalRef = this.modalService.open(paymentDetails)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  payNow(payment, item) {
    this.paymentDetail = item;
    this.iotDevicePaymentForm.controls['amount'].setValue(item.dueAmount);
    this.iotDevicePaymentForm.controls['referenceNumber'].setValue('');
    this.iotDevicePaymentForm.controls['paymentMode'].setValue('Online');
    this.modalRef = this.modalService.open(payment, { size: 'lg' })
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  iotDevicePayment() {
    if (this.iotDevicePaymentForm.value.amount && this.iotDevicePaymentForm.value.referenceNumber) {
      const reqObj = {
        amountPaid: this.iotDevicePaymentForm.value.amount,
        referenceNumber: this.iotDevicePaymentForm.value.referenceNumber,
        paymentDate: Date.parse(new Date().toString()),
        iotAccount: 'iotAccount/' + this.paymentDetail.id,
        paymentMode: this.iotDevicePaymentForm.value.paymentMode,
      }
      this.ngxLoader.stop();
      this.api.saveIotDevicePayment(reqObj).then(response => {

        this.$gaService.event('IOT Devive Payment', ` totalAmount =  ${reqObj.amountPaid}`);
        this.getChowkiById();
        this._cd.detectChanges();
        this.modalRef.close();
        this.snackBar.open('Payment of Rs. ' + reqObj.amountPaid + ' Done Succesfully', 'Ok', {
          duration: 3000
        });
        this.iotDevicePaymentForm.reset();
      }, err => {
        console.log(err);
      })
    } else {
      this.snackBar.open('Please Enter Amount and Reference Number', 'Ok', {
        duration: 3000
      });
    }
  }

  goToDeviceDetails(deviceId) {
    this.router.navigate(['/rearing-iot/details',{id: deviceId, farmerId: this.chawkiDetails.code}]);
  }

  isControlValidForIot(controlName: string): boolean {
    const control = this.iotDevicePaymentForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForIot(controlName: string): boolean {
    const control = this.iotDevicePaymentForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForIot(validation, controlName): boolean {
    const control = this.iotDevicePaymentForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  remove(){
    this.previewImage = undefined;
    this.imageUploaded = false;
    this.imageFile = null;
    const params = {
      profilePicUrl: null
    }
    this.ngxLoader.stop();
    this.api.updateChawki(params,this.id,).then(res => {
      this.getChowkiById();
    })
  }

  onImageUpload(image){
    this.imageFile = image;
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file);
      this.imageUploaded = true;
      this.ngxLoader.stop();
      this.api.uploadProfileImages(this.imageFile.target.files[0], this.id, 'CHAWKI').then(res => {
        //console.log(res);        
        if(res){
          this.snackBar.open('Image uploaded successfully', 'OK', {
            duration: 3000
          })
        }
      })
    }
  }

  editChawki() {
    this.router.navigate(['/resha-farms/chawki/crud', this.id]);
  }

  getTypeIndex(chawkiType, type) {
    for(let i=0; i < chawkiType.length; i++) {
      if(chawkiType[i].type == type && chawkiType[i].price > 0) {
        return i;
      }
    }
    return -1 ;
  }

  goBack() {
    this.router.navigate(['/resha-farms/chawki']);
  }

  deleteCurrentChawki() {
    this.ngxLoader.stop();
    this.api.deleteChawki(this.chawkiDetails.id).then(success => {
      this.modalRef.close();
      this.snackBar.open('Chawki Deleted Successfully', 'Ok', {
        duration: 3000,
      });
    this.router.navigate(['/resha-farms/chawki']);
    }, err=> {
      this.snackBar.open('Could not delete chawki', 'Ok', {
        duration: 3000,
      });
    })
  }

  orderDetails(item) {
    this.router.navigate(['/resha-farms/chawki-orders/details', item.id]);
  }

  farmerDetails(item) {
    this.router.navigate(['/resha-farms/farmers/details', item.farmerId]);

  }

  deleteConfirmatin(deleteLot) {
    this.modalRef = this.modalService.open(deleteLot)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  async open(content, item) {
    this.deleteBatchId = item.id;
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  deleteBatch() {
    this.ngxLoader.stop();
    this.api.deleteBatchForChawki(this.deleteBatchId).then(res=> {
      this.modalRef.close();
      this.snackBar.open('Batch Deleted Successfully', 'Ok', {
        duration: 3000
      });
    }, err=> {
      this.modalRef.close();
      this.snackBar.open('Could not delete batch, please try again', 'Ok', {
        duration: 3000
      });
    })
  }

  newRecordRefresh
  createNewBatch(): void {
    if(this.chawkiDetails && this.chawkiDetails.chawkiTypes && this.chawkiDetails.chawkiTypes.length) {
        this.chawkiType = [];
      for(let i=0;i<this.chawkiDetails.chawkiTypes.length; i++) {
        if(this.chawkiDetails.chawkiTypes[i].price && this.chawkiDetails.chawkiTypes[i].price > 0) {
          this.chawkiType.push(this.chawkiDetails.chawkiTypes[i].type);
        }
      }
    }
    this._cd.detectChanges();
    let dialogRef = this.dialog.open(ChawkiBatchCrudComponent, {
      width: '70vw',
      maxHeight: '68vh',
      data: { chawkiId: this.id, chawkiTypes : this.chawkiType}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.newRecordRefresh = !this.newRecordRefresh;
        this._cd.detectChanges();
      }
    });
  }

  showImage(imageUrl) {
    if(imageUrl) {
      this.modelImageUrl=null;
      this.getprotectedUrl(imageUrl);
      this.expandImage = true;
    }
  }

  async getprotectedUrl(imgUrl){
    const { targetUrl } : any = await this.api.getPresignedUrlForViewImage(imgUrl);
    this.modelImageUrl = targetUrl;
    this._cd.detectChanges()
  }
}
