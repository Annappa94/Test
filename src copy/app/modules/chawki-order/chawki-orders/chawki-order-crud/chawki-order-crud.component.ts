import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api/api.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import * as moment from 'moment';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SearchService } from 'src/app/services/api/search.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { CHAWKI_ORDER } from 'src/app/constants/enum/constant.creditDays';
import { AddressPincodeFormComponent } from 'src/app/modules/shared/address-pincode-form/address-pincode-form.component';
import { CustomValidator } from 'src/app/modules/shared/custom-validator/custom.validator';

@Component({
  selector: 'app-chawki-order-crud',
  templateUrl: './chawki-order-crud.html',
  styleUrls: ['./chawki-order-crud.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ChawkiOrderCRUDComponent {
  @ViewChild(AddressPincodeFormComponent,{static:true} ) addressForm : AddressPincodeFormComponent;
  seletedFarmer= null;
  chawkiOrderForm: UntypedFormGroup;
  farmerList: any = [];
  chawkiId: any;
  edit = false;
  chawkiList;
  minDate;
  maxDate;
  chawkiType: any = [];
  showAddress = true;
  batchesList: any = [];
  currentlyAvailaible = 0;
  errorMessage = '';
  loading:Boolean=false;

  couponValid = false;
  couponMsg = '';
  couponAmt = 0;
  couponList: any = [];
  refferalCouponApplied = false;

  defaultPagination={
    currentPage : 0,
    pageSize    : 1000,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  }

  termsAndConditions:any;
  usersList: any= [];
  CHAWKI_ORDER = [...CHAWKI_ORDER];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private form: UntypedFormBuilder,
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    public utils: UtilsService,
    private ngxLoader : NgxUiLoaderService,
    private searchApi: SearchService,
    public globalService: GlobalService,
    private $gaService:GoogleAnalyticsService,
    private modalService:NgbModal
  ) {
    const currentYear = moment().year();
    const currentMonth = moment().month();
    const currentDay = moment().date();

    this.minDate = moment([currentYear, currentMonth, currentDay]);
    this.maxDate = moment([currentYear, currentMonth, currentDay+1]);
    this.createChawkiForm();
    this.getAllChawki();
    this.getAllPromotionalCoupons();
    this.getV1Users();
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.chawkiId = params['id'];
        this.edit = true;
      } else {
        this.edit = false;
      }
    });
  }

  async createChawkiForm() {
    this.chawkiOrderForm = this.form.group({
      farmer: new UntypedFormControl(''),
      chawki: new UntypedFormControl('', [Validators.required]),
      pricePerDFL: new UntypedFormControl(''),
      buyingPricePerDFL: new UntypedFormControl(''),
      totalAmount: new UntypedFormControl(''),
      totalPayableAmount: new UntypedFormControl(''),
      creditDays: new UntypedFormControl('0'),
      totalDFLs: new UntypedFormControl('', [Validators.required]),
      deliveryDate: new UntypedFormControl('', [Validators.required]),
      gst: new UntypedFormControl(''),
      cst: new UntypedFormControl(''),
      totalPreTaxPrice: new UntypedFormControl(''),
      inState: new UntypedFormControl('inState'),
      igst: new UntypedFormControl(''),
      rmDiscount: new UntypedFormControl(''),
      totalDiscount: new UntypedFormControl(''),
      withoutDiscount: new UntypedFormControl(''),
      type: new UntypedFormControl(''),
      selfPickUp: new UntypedFormControl('no'),
      chawkiType: new UntypedFormControl(''),
      chawkiBatch: new UntypedFormControl('', [Validators.required]),
      couponCode: new UntypedFormControl(''),
      representive: new UntypedFormControl('', [Validators.required]),
      deliveryNotes: new UntypedFormControl(''),
      grossAmount: new UntypedFormControl(''),
    });
  }

  onSelfPickup(event) {
    if(event.target.value == 'yes') {
      this.showAddress = false;
    } else {
      this.showAddress = true;
    }
  }

  async onSubmit(chawkiForm) {
    let shippingAddress
    if(this.showAddress) {
      shippingAddress = {
        address: chawkiForm.address,
        city: chawkiForm.city,
        taluk: chawkiForm.taluk,
        village: chawkiForm.village,
        district: chawkiForm.district,
        state: chawkiForm.state,
        pincode: chawkiForm.pincode,
        region: chawkiForm.region
      }
      const param = {
        address: {
          address: this.addressForm.addressForm.value.address,
          village: this.addressForm.addressForm.value.village,
          city: this.addressForm.addressForm.value.city,
          district: this.addressForm.addressForm.value.district,
          taluk: this.addressForm.addressForm.value.taluk,
          region: this.addressForm.addressForm.value.region,
          state: this.addressForm.addressForm.value.state,
          pincode: this.addressForm.addressForm.value.pincode,
          latitude: this.addressForm.addressForm.value.latitude,
          longitude: this.addressForm.addressForm.value.longitude,
        },
      }
      this.ngxLoader.stop();
      this.api.updateFarmers(param,this.seletedFarmer ? this.seletedFarmer : chawkiForm.farmer).then(res => {
        // this.snackBar.open('farmer address updated', 'Ok', {
        //   duration: 3000
        // });
      });

    } else {
      shippingAddress = {};
    }
    const params = {
      // farmer: this.seletedFarmer ? '/farmer/' + this.seletedFarmer : '/farmer/' + chawkiForm.farmer,
      "farmer":'/farmer/'+this.seletedFarmer,
      address: {
        address: this.addressForm.addressForm.value.address,
        village: this.addressForm.addressForm.value.village,
        city: this.addressForm.addressForm.value.city,
        district: this.addressForm.addressForm.value.district,
        taluk: this.addressForm.addressForm.value.taluk,
        region: this.addressForm.addressForm.value.region,
        state: this.addressForm.addressForm.value.state,
        pincode: this.addressForm.addressForm.value.pincode,
        latitude: this.addressForm.addressForm.value.latitude,
        longitude: this.addressForm.addressForm.value.longitude,
      },
      
      chawki: '/chawki/' + chawkiForm.chawki,
      deliveryDate: chawkiForm.deliveryDate ? Date.parse((chawkiForm.deliveryDate).set({ hour: 23, minute: 59, second: 59, millisecond: 0 })) : Date.parse(new Date().toString()),
      pricePerDFL: +chawkiForm.pricePerDFL,
      totalAmount: +chawkiForm.totalAmount,
      totalPayableAmount: +chawkiForm.totalPayableAmount,
      totalReceivableAmount: +chawkiForm.totalAmount,
      creditDays: +chawkiForm.creditDays,
      totalDFLs: +chawkiForm.totalDFLs,
      totalPreTaxPrice: +chawkiForm.totalAmount,
      cst: 0,
      gst: 0,
      igst: 0,
      totalDiscount: chawkiForm.totalDiscount,
      shippingAddress: shippingAddress,
      chawkiType: chawkiForm.chawkiType,
      chawkiBatch: '/chawkibatch/' + chawkiForm.chawkiBatch,
      couponCode: this.couponAmt > 0 ? chawkiForm.couponCode : null,
      deliveryNotes: chawkiForm.deliveryNotes ? chawkiForm.deliveryNotes: null ,
      termsAndConditions: this.termsAndConditions ? this.termsAndConditions : null,
      rmRepresentativePhone: chawkiForm.representive.phone,
      rmRepresentativeName: chawkiForm.representive.name,
      grossAmount: +chawkiForm.grossAmount
    };

    if (this.chawkiId) {
      this.loading=true;
      this.ngxLoader.stop();
      this.api.updateChawkiOrder(params, this.chawkiId,).then(res => {
        this.loading=false;  
        if (res) {
          
        } else {
          this.snackBar.open('Failed to update lot', 'Ok', {
            duration: 3000
          });
        }
      }).catch(err=>{
        this.loading=false;  
      });
    } else {
      this.ngxLoader.stop();
      this.loading=true;
      this.api.createChawkiOrder(params).then(res => {
      this.$gaService.event('Create Chawki Order', ` totalAmount =  ${params.totalAmount}, totalDFLs = ${params.totalDFLs}`);

      this.loading=false;  
      this.router.navigate(['/resha-farms/chawki-orders']);
        this.snackBar.open('Order created successfully', 'Ok', {
          duration: 3000
        });
      }, err => {
        this.router.navigate(['/resha-farms/chawki-orders']);
        this.snackBar.open('Failed to create order, plase try again', 'Ok', {
          duration: 3000
        });
      }).catch(err=>{
        this.loading=false;  
      })
    }
          
  }

  getAllChawki() {
    this.ngxLoader.stop();
      let setItInQuery:String=`(isApproved==true and phone!=*DELETED*)`;
      this.api.getChawkiList(setItInQuery,'createdDate', 'desc',0,1000).then(res => {
      this.chawkiList = res['content'];
    }, err => {
      this.snackBar.open('Failed to find chawki', 'Ok', {
        duration: 3000
      });
    })
  }

  getFarmerList(event) {
    if (event.term.length % 2 == 0) {
      let searchParams = `(name==*${event.term.replace(/ /gi,"*")}* or phone==*${event.term.replace(/ /gi,"*")}* and productType=='Silk')`;
      this.api.searchAllFarmers(0, 50, 'createdDate', 'desc', searchParams).then(res => {
        console.log('farmerlist',res)
        this.farmerList = res['content'].filter(data=>!(data?.phone.includes('__DELETED')) );
        this._cd.detectChanges();
      })
    }
    if (!event.term || event.term.length == 0) {
      this.farmerList = [];
      this._cd.detectChanges();
    }
  }

  onChawkiSelection(event) {
    this.errorMessage = '';
    this.currentlyAvailaible = 0;
    this.batchesList = [];
    let selectedChawki = this.chawkiOrderForm.get('chawki').value;
    this.getAllBatch(selectedChawki);
    for(let i=0; i<this.chawkiList.length; i++) {
      if(this.chawkiList[i].id == selectedChawki) {
        this.chawkiOrderForm.get('rmDiscount').patchValue(this.chawkiList[i].rmDiscount ? this.chawkiList[i].rmDiscount : 0);
        this.chawkiType = this.chawkiList[i].chawkiTypes;
        break;
      }
    }
    this.onValueChanges();
  }

  getAllBatch(id) {
    this.ngxLoader.stop();
    this.api.getLatestBatchForAChawki(id).then(res => {
      let masterBatch = res['_embedded']['chawkibatch'];
      if(masterBatch && masterBatch.length) {
        this.batchesList = masterBatch.filter(batch => batch.currentlyAvailableDFL > 0); 
        if(this.batchesList && this.batchesList.length) {
          for(let i = 0; i<this.batchesList.length; i++) {
            // this.batchesList[i].availableOn = this.utils.getDisplayTime(this.batchesList[i].availableOn);
            this.batchesList[i].displayAvailableOn = this.utils.getDisplayTime(this.batchesList[i].availableOn);
          }
        this.chawkiOrderForm.get('chawkiBatch').patchValue(this.batchesList[0].id);
        this.currentlyAvailaible = this.batchesList[0].currentlyAvailableDFL;
        this.setDeliveyMinDate(this.batchesList[0].availableOn);
        this.onTypeSelection(this.batchesList[0].batchType);
        }
      }
        this._cd.detectChanges();
    });
  }

  setDeliveyMinDate(timeStamp) {
    let date = new Date(timeStamp)
    let year = date.getFullYear();
    let month = date.getMonth();
    this.minDate = moment(new Date(year, month, date.getDate()));
    this.maxDate = moment(new Date(year, month, date.getDate()+1));
  }

  onBatchSelection(event) {
    let selected = event.target.value;
    for(let i=0;i<this.batchesList.length;i++) {
      if(this.batchesList[i].id == selected) {
        this.errorMessage = '';
        this.currentlyAvailaible = this.batchesList[i].currentlyAvailableDFL;
        this.setDeliveyMinDate(this.batchesList[i].availableOn);
        this.onTypeSelection(this.batchesList[i].batchType)
        break;
      }
    }
  }

  onValueChanges() {
    this.cancelCouponRedeem();
    if(this.chawkiOrderForm.get('totalDFLs').value <= this.currentlyAvailaible) {
      this.errorMessage = '';
      let total = this.chawkiOrderForm.get('pricePerDFL').value * this.chawkiOrderForm.get('totalDFLs').value;
      let buyingPrice = this.chawkiOrderForm.get('buyingPricePerDFL').value * this.chawkiOrderForm.get('totalDFLs').value;
      total = Math.round((total + Number.EPSILON)*100)/100;
      this.chawkiOrderForm.get('grossAmount').patchValue(total);
      let discountAmount =  total * ((this.chawkiOrderForm.get('rmDiscount').value) / 100); 
      this.chawkiOrderForm.get('totalDiscount').patchValue(discountAmount);
      let preTax = total * ((100 - this.chawkiOrderForm.get('rmDiscount').value) / 100) 
      this.chawkiOrderForm.get('totalAmount').patchValue(preTax);
      this.chawkiOrderForm.get('totalPayableAmount').patchValue(buyingPrice);
      this.chawkiOrderForm.get('totalPreTaxPrice').patchValue(preTax);
      this._cd.detectChanges();
    } else {
      this.errorMessage = 'Total Available DFL is ' + this.currentlyAvailaible;
      this.chawkiOrderForm.get('totalAmount').patchValue(0);
      this.chawkiOrderForm.get('grossAmount').patchValue(0);
    }
}

getAllPromotionalCoupons() {
  this.ngxLoader.stop();
  // let search = `(isActive==true and applicableFor=in=(FARMER) and advancedConfiguration.target=='CHAWKI_SALE')`
  let search = `(isActive==true and applicableFor=in=(FARMER))`
  this.searchApi.getAllPromotionalCoupons(this.defaultPagination, search).then(res => {
    const coupons = res['content'];
    if (coupons.length) {
          for (let i = 0; i < coupons.length; i++) {
            if (coupons[i].isActive) {
              this.couponList.push(coupons[i]['couponCode'])
            }
          }
        }
  });
}

couponClicked(coupon) {
  if (this.couponAmt == 0) {
    this.chawkiOrderForm.get('couponCode').patchValue(coupon);
  }
}

redeemCode(formValue) {
  if (this.edit) {
    this.seletedFarmer = this.chawkiOrderForm.get('farmer').value;
  }
  this.ngxLoader.stop();
  this.api.verifyCoupon(formValue.couponCode.toUpperCase(), this.seletedFarmer, this.chawkiOrderForm.get('totalAmount').value, 'CHAWKI_SALE').then((res: any) => {
    if (res.status) {
      this.couponValid = true;
      this.couponAmt = +res.value;
      this.couponAmt = Math.floor(this.couponAmt);
      this.couponMsg = this.couponAmt + ' Added Suceessfully. '
      let total = this.chawkiOrderForm.get('grossAmount').value;
      // total = Math.floor(total);
      // this.chawkiOrderForm.get('grossAmount').patchValue(Math.round((total + Number.EPSILON)*100)/100); 
      total = total - this.couponAmt;
      this.chawkiOrderForm.get('totalAmount').patchValue(Math.round((total + Number.EPSILON)*100)/100);
      this._cd.detectChanges();
    } else {
      this.chawkiOrderForm.get('couponCode').patchValue('');
      this.couponValid = false;
      this.couponMsg = res.messgage;
    }
  }, err => {
    this.snackBar.open('Please select farmer, enter DFL and price', 'Ok', {
      duration: 3000
    });
  })
}

cancelCouponRedeem() {
  this.chawkiOrderForm.get('couponCode').patchValue('');
  if (this.couponAmt > 0) {
    this.ngxLoader.stop();
    this.api.deleteCoupon(this.chawkiOrderForm.get('couponCode').value, this.seletedFarmer).then(res => {
      this.snackBar.open('Please apply the coupon again', 'Ok', {
        duration: 3000
      });
    })
  }
  this.couponMsg = '';
  // this.chawkiOrderForm.get('couponCode').patchValue('');
  let total = this.chawkiOrderForm.get('grossAmount').value + this.couponAmt;
  total = Math.round((total + Number.EPSILON)*100)/100;
  this.chawkiOrderForm.get('totalAmount').patchValue(total);
  this.couponAmt = 0;
}

getCouponCodeForAFarmer() {
  this.api.getReferralCouponOfFarmer(this.seletedFarmer).then(res => {
    if (this.couponList && this.couponList.length) {
      if (this.refferalCouponApplied) {
        this.couponList[this.couponList.length - 1] = res['couponCode'];
      } else {
        this.couponList[this.couponList.length] = res['couponCode'];
      }
    } else {
      this.couponList[0] = res['couponCode'];
    }
    this.refferalCouponApplied = true;
  });
}

onFarmerSelection(event) {
  
  if(event){
    this.ngxLoader.stop();
    this.cancelCouponRedeem();
    this.api.getFarmerById(event).then(res => {
      this.updateName(res['farmer'])
      this.addressForm.addressForm.patchValue(res['farmer']['address'])
      // if(res['farmer'] && res['farmer']['address']) {
      //   this.chawkiOrderForm.get('address').patchValue(res['farmer']['address']['address']);
      //   this.chawkiOrderForm.get('city').patchValue(res['farmer']['address']['city']);
      //   this.chawkiOrderForm.get('district').patchValue(res['farmer']['address']['district']);
      //   this.chawkiOrderForm.get('pincode').patchValue(res['farmer']['address']['pincode']);
      //   this.chawkiOrderForm.get('region').patchValue(res['farmer']['address']['region']);
      //   this.chawkiOrderForm.get('state').patchValue(res['farmer']['address']['state']);
      //   this.chawkiOrderForm.get('taluk').patchValue(res['farmer']['address']['taluk']);
      //   this.chawkiOrderForm.get('village').patchValue(res['farmer']['address']['village']);
      // }
      
    })
    this._cd.detectChanges();
  }
  
}

onTypeSelection(value) {
  for(let i=0;i <this.chawkiType.length;i++) {
    if(this.chawkiType[i].type == value) {
      this.chawkiOrderForm.get('type').patchValue(value);
      this.chawkiOrderForm.get('pricePerDFL').patchValue(this.chawkiType[i].price ? this.chawkiType[i].price : 0);
      this.chawkiOrderForm.get('buyingPricePerDFL').patchValue(this.chawkiType[i].actualBuyingPrice ? this.chawkiType[i].actualBuyingPrice : 0);
      this.chawkiOrderForm.get('chawkiType').patchValue(value);
      this.onValueChanges();
      break;
    }
  }
}

dataFromTextEditor(data){
  this.termsAndConditions=data;
}

async getV1Users() {
  this.usersList = [];
  this.ngxLoader.stop();
  this.api.getAllUsersList(this.globalService.v1Roles).then(res => {
    if (res['_embedded']['user'] && res['_embedded']['user'].length) {
      this.usersList = res['_embedded']['user'];
    } else {
      this.usersList = [];
    }
    this._cd.detectChanges();
  });
}



  /** Update Name */
  @ViewChild('updateNameHTML')
  updateNameHTML:ElementRef
  updateNameForm:UntypedFormControl = new UntypedFormControl('',[Validators.required,CustomValidator.cannotContainOnlySpace]);
  updateNameAPI(name){
    this.ngxLoader.stop();
    this.api.updateFarmers({name}, this.seletedFarmer).then((res:any) =>{
      this.modalRef.close();
      if(res){
        this.farmerList = [];
        this.seletedFarmer = res['id'];
        this.farmerList.push(res);
        this.onFarmerSelection(res['id'])
        this.updateNameForm.reset();
        this.snackBar.open('Updated successfully', 'Ok', {
          duration: 3000
        });
      }
    })
  }
  modalRef;
  updateName(response){
    if(response['name'] == ""){            
      this.modalRef = this.modalService.open(this.updateNameHTML)
    }
  }

  close(){
    this.modalRef.close();
    this.seletedFarmer = null;
  }

}