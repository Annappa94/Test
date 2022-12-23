import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { COCOON_SALES_ORDER } from 'src/app/constants/enum/constant.creditDays';
import { UNIT_OF_MESURES } from 'src/app/constants/enum/constant.retailer';
import { SalesOrderBlockComponent } from 'src/app/modules/sales-order-block-popup/sales-order-block-popup.component';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { S3UrlResponse } from '../tussar-lot-list/tussar-lot-list.component';
import { AddressPincodeFormComponent } from '../../shared/address-pincode-form/address-pincode-form.component';
import { BankFormComponent } from 'src/app/modules/shared/bank-form/bank-form.component';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';

@Component({
  selector: 'app-tussar-lot-mark-sold',
  templateUrl: './tussar-lot-mark-sold.component.html',
  styleUrls: ['./tussar-lot-mark-sold.component.scss']
})
export class TussarLotMarkSoldComponent implements OnInit {
  @ViewChild('address') addressForm : AddressPincodeFormComponent;
  totalSellingPriceOfLots:any;
  totalWeightOfLots;
  searchText = '';
  markSoldForm: UntypedFormGroup;
  selectedReeler: any;
  reelersData: any = [];
  lotsData = [];
  modalRef;
  closeResult: string;
  paymentForLots: any;
  isBlackListed: any = false;
  disabledText: any;
  deleteIndex: number;
  code: String = '';
  id;
  edit = false;
  invalidSellingPrice = false;
  preImgUrl;
  netAmount = 0;
  user;
  disableSaveButton: boolean = true;
  availableQuantityOfLots:any = {};
  markingAsSold = false;
  termsAndConditions:any;
  usersList: any = [];
  dataEdit;
  COCOON_SALES_ORDER = [...COCOON_SALES_ORDER];
  UOM = {...UNIT_OF_MESURES};
 

  constructor(
    public globalService: GlobalService,
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private form: UntypedFormBuilder,
    private ngxLoader: NgxUiLoaderService,
    private route: ActivatedRoute,
    private $gaService:GoogleAnalyticsService,
  ) {
    this.user = JSON.parse(localStorage.getItem('_ud'))
   }

  ngOnInit(): void {
    this.formInitialization();
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.api.getTussarSalesOrderById(this.id).then(res=> {
          this.availableQuantityOfLots = res;
          this.edit = true;
          this.patchOrder();
        })
      } else {
        this.edit = false;
        this.getV2Users();
      }
    });
  }
  
  
  
  patchOrder() {    
    if (this.globalService.tempOrderData) {
      if (this.globalService.tempOrderData && this.globalService.tempOrderData.tussarSalesOrderItems) {
        this.globalService.tempOrderData.tussarSalesOrderItems.forEach(e => {
          (this.markSoldForm.get('lotsToSell') as UntypedFormArray).push(new UntypedFormGroup({
            sellingPrice: new UntypedFormControl(e.sellingPricePerPc),
            sellingWeight: new UntypedFormControl(e.sellingPieces, [Validators.required,Validators.pattern(this.UOM[e.uom?e.uom:'PCS'].validators)]),
            buyingPrice: new UntypedFormControl(e.buyPrice),
            logisticsCost: new UntypedFormControl(e.logisticsCost),
            purchaseTotal: new UntypedFormControl((+e.buyPrice * +e.sellingPieces) + e.logisticsCost),
            sellingTotal: new UntypedFormControl((+e.buyPrice * +e.sellingPieces)),
            weight: new UntypedFormControl(e.sellingPieces),
            lotCode: new UntypedFormControl(e.tussarLotCode),
            id: new UntypedFormControl(e.tussarLotId),
            // minSellingPrice: new FormControl(Math.round((uptikSp + Number.EPSILON)*100)/100),
  
            displayCocoonType: new UntypedFormControl(e.type),
            uom: new UntypedFormControl(e.uom),
            cocoonType: new UntypedFormControl(e.type),
            wastage: new UntypedFormControl(0),
            grade: new UntypedFormControl(e.rmGrade),
            markSold: new UntypedFormControl(false),
            showMarkSold: new UntypedFormControl(false),
            discountAmount: new UntypedFormControl(0, Validators.min(0))
          }))
        })
        this.preImgUrl = this.globalService.tempOrderData ? this.globalService.tempOrderData.ewayBillImage ? this.globalService.tempOrderData.ewayBillImage : '' : '';
        this.markSoldForm.patchValue(this.globalService.tempOrderData);
        this.markSoldForm.get('totalPayment').patchValue(this.globalService.tempOrderData.totalAmount);
        this.markSoldForm.get('creditDays').patchValue(this.globalService.tempOrderData.creditDays);
        if (this.globalService.tempOrderData.logistics)
          this.markSoldForm.patchValue(this.globalService.tempOrderData.logistics);
        if (this.globalService.tempOrderData.discount > 0) {
          this.netAmount = this.globalService.tempOrderData.grossAmount
        } else {
          this.netAmount = this.globalService.tempOrderData.totalAmount
        }
        let representiveObj = {};
        if(this.globalService.tempOrderData.rmRepresentativeName) {
          representiveObj = {
            name: this.globalService.tempOrderData.rmRepresentativeName,
            phone: this.globalService.tempOrderData.rmRepresentativePhone
          }
        } else {
          representiveObj = {
            name: '-',
            phone: this.globalService.tempOrderData.createdBy
          }
        }
        this.markSoldForm.get('representive').patchValue(representiveObj)
        this.selectedReeler = this.globalService.tempOrderData.reelerId;
        this.dataEdit = this.globalService.tempOrderData.termsAndConditions;
        if(this.globalService.tempOrderData.shippingAddress) {
          this.addressForm.addressForm.patchValue(this.globalService.tempOrderData.shippingAddress);
        }
        // this.onReelerSelection();
        this.onValueChangesOfWeight();
        this._cd.detectChanges();
      }
    }
  }
  
  formInitialization() {
    this.lotsData = this.globalService.tempValueData;    
    this.markSoldForm = this.form.group({
      lotsToSell: new UntypedFormArray([]),
      driverName: new UntypedFormControl(''),
      noOfBags: new UntypedFormControl(''),
      driverNumber: new UntypedFormControl(''),
      vehicleNumber: new UntypedFormControl(''),
      totalCost: new UntypedFormControl(''),
      totalPayment: new UntypedFormControl('', Validators.required),
      creditDays: new UntypedFormControl('0', Validators.required),
      discount: new UntypedFormControl(0, Validators.min(0)),
      grossPL: new UntypedFormControl(''),
      netPLAfterLogistics: new UntypedFormControl(''),
      ewayBillNo: new UntypedFormControl(''),
      // address: new FormControl(''),
      // village: new FormControl(''),
      // district: new FormControl(''),
      // city: new FormControl(''),
      // pincode: new FormControl(''),
      // taluk: new FormControl(''),
      // state: new FormControl(''),
      representive: new UntypedFormControl('', Validators.required),
      deliveryNotes: new UntypedFormControl(''),
      minGrossTotal: new UntypedFormControl(0)
    })
    if (this.lotsData) {
      this.lotsData.forEach(e => {
        let sp = e.lot.pricePerPc + (e.logisticsCost > 0 ? e.logisticsCost / e.lot.lotWeight : 0);
        let uptikSp = sp + (Math.round(((sp * 0.05) + Number.EPSILON)*100)/100);
        (this.markSoldForm.get('lotsToSell') as UntypedFormArray).push(new UntypedFormGroup({
          sellingPrice: new UntypedFormControl(Math.round((uptikSp + Number.EPSILON)*100)/100),
          sellingWeight: new UntypedFormControl(e.lot.availableQuantity, [Validators.required,Validators.pattern(this.UOM[e.uom?e.uom:'PCS'].validators)]),
          buyingPrice: new UntypedFormControl(e.lot.pricePerPc),
          logisticsCost: new UntypedFormControl(e.logisticsCost),
          purchaseTotal: new UntypedFormControl((+e.lot.pricePerPc * +e.lot.availableQuantity) + e.logisticsCost),
          sellingTotal: new UntypedFormControl((+e.lot.pricePerPc * +e.lot.availableQuantity)),
          weight: new UntypedFormControl(e.lot.availableQuantity),
          lotCode: new UntypedFormControl(e.lot.code),
          id: new UntypedFormControl(e.lot.id),
          minSellingPrice: new UntypedFormControl(Math.round((uptikSp + Number.EPSILON)*100)/100),

          displayCocoonType: new UntypedFormControl(e.lot.type),
          uom: new UntypedFormControl(e.uom),
          cocoonType: new UntypedFormControl(e.type),
          wastage: new UntypedFormControl(0),
          grade: new UntypedFormControl(e.rmGrade),
          markSold: new UntypedFormControl(false),
          showMarkSold: new UntypedFormControl(false),
          discountAmount: new UntypedFormControl(0, Validators.min(0))
        }))
      })
      this.onValueChangesOfWeight();
      this._cd.detectChanges();
    }

  }

  onValueChangesOfLogisticsCost() {
    let netPLAfterLogistics = 0;
    netPLAfterLogistics = +this.markSoldForm.get('grossPL').value - +this.markSoldForm.get('totalCost').value;
    this.markSoldForm.get('netPLAfterLogistics').patchValue(netPLAfterLogistics.toFixed(2));
    this._cd.detectChanges();
  }

  onValueChangesOfWeight(disableSaveButton?:string) {
    if(disableSaveButton) {
      this.disableSaveButton = true;
    } else {
      this.disableSaveButton = false;
    }
    this.invalidSellingPrice = false;
    let arr = this.markSoldForm.get('lotsToSell').value;
    let lotsArray = this.markSoldForm.get('lotsToSell') as UntypedFormArray;
    let sellingTotal = 0;
    let totalWeight = 0;
    let grossPL = 0;
    let totalDiscount = 0;
    let minGrossTotal = 0;
    arr.forEach((element, i) => {
      if (element.sellingPrice < element.minSellingPrice) {
        this.invalidSellingPrice = true;
      }
      
      // if(element.sellingPrice > element.minSellingPrice && element.discountAmount > 0) {
      //     lotsArray.controls[i].patchValue({ "discountAmount": 0 });
      //     this.onValueChangesOfWeight('calc');
      //     return false;
      // }
      totalDiscount += +element.discountAmount ? +element.discountAmount * +element.sellingWeight : 0;
      sellingTotal = (+element.sellingWeight * +element.sellingPrice) - (+element.discountAmount ? +element.discountAmount * +element.sellingWeight : 0);
      totalWeight += +element.sellingWeight;
      grossPL += (+element.sellingWeight * +element.sellingPrice) - (+element.weight * +element.buyingPrice);
      (this.markSoldForm.get('lotsToSell') as UntypedFormArray).at(i).get('sellingTotal').setValue(sellingTotal.toFixed(2));
      minGrossTotal += +element.minSellingPrice * +element.sellingWeight;      
    });
    this.markSoldForm.get('discount').patchValue(totalDiscount.toFixed(2));
    this.markSoldForm.get('minGrossTotal').patchValue(minGrossTotal);
    this.totalWeightOfLots = totalWeight;
    if(this.edit && this.markSoldForm.get('totalPayment').value) {
      this.totalSellingPriceOfLots = this.markSoldForm.get('discount').value ? ((Math.round(((+this.markSoldForm.get('totalPayment').value) + Number.EPSILON)*100)/100) + this.markSoldForm.get('discount').value) / +this.totalWeightOfLots :
      (Math.round(((+this.markSoldForm.get('totalPayment').value) + Number.EPSILON)*100)/100) / +this.totalWeightOfLots;
    }
    this._cd.detectChanges();
  }


  async open(content, formValue) {
    let grossAmount = this.markSoldForm.get('totalPayment').value;
    if(this.user.phonenumber != '9886125599' && +formValue.discount > 0 && grossAmount < (formValue.minGrossTotal - formValue.minGrossTotal * 0.02)) {
      this.modalRef = this.modalService.open(SalesOrderBlockComponent,{backdrop: 'static',size: 'lg', keyboard: false, centered: true});
    } else {
      this.paymentForLots = formValue;
      this.modalRef = this.modalService.open(content)
      this.modalRef.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed`;
      });
    }
  }
  payNow() {
    let patchReelerAddressDetails = {
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
      }
    }

    // this.api.putReeler(this.selectedReeler, patchReelerAddressDetails).then(res => {

    // });
    let tussarSalesOrderItems = [];
    const params = {
      totalAmount: this.markSoldForm.get('totalPayment').value ? (Math.round(((+this.markSoldForm.get('totalPayment').value) + Number.EPSILON)*100)/100) : 0,
      discount: parseInt(this.markSoldForm.get('discount').value) ? parseInt(this.markSoldForm.get('discount').value) : 0,
      grossAmount: this.markSoldForm.get('discount').value ? (Math.round(((+this.markSoldForm.get('totalPayment').value) + Number.EPSILON)*100)/100) + +(this.markSoldForm.get('discount').value) :
      Math.round(((+this.markSoldForm.get('totalPayment').value) + Number.EPSILON)*100)/100,
      totalPieces: this.totalWeightOfLots,
      sellingPricePerPc: +this.totalSellingPriceOfLots.toFixed(2),
      noOfBags: this.markSoldForm.get('noOfBags').value,
      ewayBillNo: this.markSoldForm.get('ewayBillNo').value,
      ewayBillImage: this.preImgUrl,
      creditDays: parseInt(this.markSoldForm.get('creditDays').value),
      logistics: {
        totalCost: this.markSoldForm.get('totalCost').value ? this.markSoldForm.get('totalCost').value : null,
        vehicleNumber: this.markSoldForm.get('vehicleNumber').value,
        driverNumber: this.markSoldForm.get('driverNumber').value,
        driverName: this.markSoldForm.get('driverName').value,
        dispatchTime: '',
        arrivalTime: '',
      },
      shippingAddress: patchReelerAddressDetails.address,
      deliveryNotes: this.markSoldForm.get('deliveryNotes').value,
      termsAndConditions: this.termsAndConditions,
      "reeler":{
        "id":this.selectedReeler
      },
    }
    this.ngxLoader.stop();
    if (this.edit) {
      let count = 0;
        params['dueAmount'] = Math.round(((+this.markSoldForm.get('totalPayment').value) + Number.EPSILON)*100)/100;
        // params['dueAmount'] = Math.round(+this.markSoldForm.get('totalPayment').value);
      let orderItem = {};

      this.markSoldForm.get('lotsToSell').value.forEach(element => {
        orderItem = {
          tussarLotId: element.id,
          tussarLotCode: element.lotCode,
          creditDays: element.creditDays,
          sellingPricePerPc: element.sellingPrice ? +element.sellingPrice.toFixed(2) : null,
          sellingPieces: +element.sellingWeight,
          discount: element.discountAmount ? +element.discountAmount * +element.sellingWeight : 0,
          totalAmount: +element.sellingTotal,
          grossAmount: +element.sellingPrice * +element.sellingWeight,
          tussarGrade: 1000, //element.grade
          markSold: element.markSold ? element.markSold : false,
          wastageQuantity: element.markSold ? element.wastage.toFixed(2) : 0,
          buyPrice: element.buyingPrice,
          uom:element.uom

        }
        tussarSalesOrderItems.push(orderItem);
        count++;
        if (count == this.globalService.tempOrderData.tussarSalesOrderItems.length) {
          params['tussarSalesOrderItems'] = tussarSalesOrderItems;
          this.api.patchTussarOrder(params, this.id).then(res => {

            this.router.navigate(['/resha-farms/tussar/tussar-order-list']);
            this.snackBar.open('Updated order Successfully', 'OK', {
              duration: 3000
            });
          })
        }
      });
    } else {
      let count = 0;
      //params['reeler'] = '/reeler/' + this.selectedReeler;
      params['rmRepresentativePhone'] = this.markSoldForm.get('representive').value.phone;
      params['rmRepresentativeName'] = this.markSoldForm.get('representive').value.name;
      let orderItem = {};
      this.markSoldForm.get('lotsToSell').value.forEach(element => {
        orderItem = {
          tussarLotId: element.id,
          tussarLotCode: element.lotCode,
          creditDays: element.creditDays,
          sellingPricePerPc: element.sellingPrice ? +element.sellingPrice.toFixed(2) : null,
          sellingPieces: +element.sellingWeight,
          discount: element.discountAmount ? +element.discountAmount * +element.sellingWeight : 0,
          totalAmount: +element.sellingTotal,
          grossAmount: +element.sellingPrice * +element.sellingWeight,
          tussarGrade: 1000, //element.grade
          markSold: element.markSold ? element.markSold : false,
          wastageQuantity: element.markSold ? element.wastage.toFixed(2) : 0,
          buyPrice: element.buyingPrice,
          uom:element.uom
        }
        tussarSalesOrderItems.push(orderItem);
        this.ngxLoader.stop();
        count++;
        if (count == this.lotsData.length) {
          params['tussarSalesOrderItems'] = tussarSalesOrderItems;
          this.api.markTussarLotAsSold(params).then(res => {
            this.$gaService.event('Tussar Lot mark as sold', ` totalAmount =  ${params.totalAmount}, totalWeight = ${params.totalPieces}`);

            this.router.navigate(['/resha-farms/tussar/tussar-lot-list'])
            this.snackBar.open('Successfully marked as SOLD', 'OK', {
              duration: 3000
            });
          })
        }
      });
    }
    this.modalRef.close();
  }

  getEstimate(confirmAsSold) {
    let lotsArray = this.markSoldForm.get('lotsToSell') as UntypedFormArray;
    for (let j = 0; j < lotsArray.length; j++) {
      lotsArray.controls[j].patchValue({ "markSold": false });
      lotsArray.controls[j].patchValue({ "wastage": 0 });
      lotsArray.controls[j].patchValue({ "showMarkSold": false });
    }
    let tussarSalesOrderItems: any = [];
    let item;
    (this.markSoldForm.controls['lotsToSell'] as UntypedFormArray).controls.forEach((element) => {
      item = {};
      item['id'] = element?.get('id').value;
      item['quantity'] = element?.get('sellingWeight').value;
      item['sellingPrice'] = element?.get('sellingPrice').value ? +(element.get('sellingPrice').value) : 0;
      tussarSalesOrderItems.push(item);
    });

    let reqObj = {
      discount: +this.markSoldForm.get('discount').value,
      uom: 'kg',
      orderItems: tussarSalesOrderItems
    }

    if(this.edit) {
      reqObj['entityId']=this.id
    }

    this.api.getTussarListEstimateTotal(reqObj).then(estimate => {
      this.disableSaveButton = false;
      this.netAmount = estimate['preTaxAmount'];
      this.markSoldForm.get('totalPayment').patchValue(estimate['totalAmount']);
      this.totalSellingPriceOfLots = estimate['preTaxAmount']/ +this.totalWeightOfLots;
      (Math.round(+this.markSoldForm.get('totalPayment').value)) / +this.totalWeightOfLots;;
      if (estimate['additionalAttributes'] && estimate['additionalAttributes']['flaggedList'].length) {
        let flaggedList = estimate['additionalAttributes']['flaggedList']
        for (let i = 0; i < flaggedList.length; i++) {
          let index = -1;
          let lotsArray = this.markSoldForm.get('lotsToSell') as UntypedFormArray;
          index = this.markSoldForm.get('lotsToSell').value.map(function (e) {
            return e.id;
          }).indexOf(flaggedList[i].lotId);
          if (index > -1) {
            lotsArray.controls[index].patchValue({ "markSold": flaggedList[i].flagged });
            lotsArray.controls[index].patchValue({ "wastage": flaggedList[i].wastage });
            lotsArray.controls[index].patchValue({ "showMarkSold": flaggedList[i].flagged });

          }
          if (i == flaggedList.length - 1) {
            this._cd.detectChanges();
            this.modalRef = this.modalService.open(confirmAsSold);
            this.modalRef.result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
              this.closeResult = `Dismissed`;
            });
          }
        }
      }

      this._cd.detectChanges();
    })
  }

  checkIfWastage() {
    this.markingAsSold = false;
    let arr = this.markSoldForm.get('lotsToSell').value;
    for (let j = 0; j < arr.length; j++) {
      if(arr[j].markSold) {
        this.markingAsSold = true;
      }
    }
    this._cd.detectChanges();
    this.modalRef.close();
  }

  noWastage() {
    this.markingAsSold = false;
    let lotsArray = this.markSoldForm.get('lotsToSell') as UntypedFormArray;
    for (let j = 0; j < lotsArray.length; j++) {
      lotsArray.controls[j].patchValue({ "markSold": false });
      lotsArray.controls[j].patchValue({ "wastage": 0 });
      lotsArray.controls[j].patchValue({ "showMarkSold": false });
    }
    this._cd.detectChanges();
    this.modalRef.close();
  }

  ConfirmDeleteRecord() {
    if (this.edit) {
      let reqObj = {
        status: 'New',
        sellingWeight: 0,
        sellingPriceTotal: 0,
        sellingPricePerKg: 0,
        isDisplayActive: false,
        askingPricePerKg: null,
        askingWeight: null,
        cocoonOrder: null
      }
      this.api.updateCocoonLotById(this.globalService.tempOrderData.cocoonLots[this.deleteIndex].id, reqObj).then(res => {

      })
      this.globalService.tempOrderData.cocoonLots.splice(this.deleteIndex, 1);
      (this.markSoldForm.get('lotsToSell') as UntypedFormArray).removeAt(this.deleteIndex);
      this.modalRef.close();
      this.patchOrder();
    } else {
      this.globalService.tempValueData.splice(this.deleteIndex, 1);
      (this.markSoldForm.get('lotsToSell') as UntypedFormArray).removeAt(this.deleteIndex);
      this.modalRef.close();
      this.formInitialization();
    }
  }

  deleteRecord(contentDelete, index, code) {
    this.code = code;
    this.deleteIndex = index;
    this.modalRef = this.modalService.open(contentDelete)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  dataFromTextEditor(data){
    this.termsAndConditions=data;
  }

  async getV2Users() {
    this.usersList = [];
    this.ngxLoader.stop();
    this.api.getAllUsersList(this.globalService.v2Roles).then(res => {
      if (res['_embedded']['user'] && res['_embedded']['user'].length) {
        this.usersList = res['_embedded']['user'];
      } else {
        this.usersList = [];
      }
      this._cd.detectChanges();
    });
  }

  getReelerList(event) {
    if (event.term.length % 2 == 0) {
      let searchParams = `((name==*${event.term.replace(/ /gi, "*")}* or phone==*${event.term.replace(/ /gi, "*")}*) and productType=='Tussar')`;
      this.api.searchAllTussarReelers(0, 50, 'createdDate', 'desc', searchParams).then(res => {
        this.reelersData = res['content'].filter(data=>!(data?.phone.includes('__DELETED')));
        this._cd.detectChanges();
      })
    }
    if (!event.term || event.term.length == 0) {
      this.reelersData = [];
      this._cd.detectChanges();
    }
  }

  onReelerSelection() {
    if (this.selectedReeler)
      this.api.getReelerById(this.selectedReeler).then(res => {
        if (res) {
          this.updateName(res['reeler']);
          this.isBlackListed = res['reeler']['isBlackListed'];
          if (this.isBlackListed) {
            this.disabledText = `${res['reeler']['name']} is blacklisted. In order to mark as sold, please contact Admin to check pending payments`;
          }
          this.addressForm.addressForm.get('address').patchValue(res['reeler']['address']['address']);
          this.addressForm.addressForm.get('village').patchValue(res['reeler']['address']['village']);
          this.addressForm.addressForm.get('city').patchValue(res['reeler']['address']['city']);
          this.addressForm.addressForm.get('district').patchValue(res['reeler']['address']['district']);
          this.addressForm.addressForm.get('taluk').patchValue(res['reeler']['address']['taluk']);
          this.addressForm.addressForm.get('state').patchValue(res['reeler']['address']['state']);
          this.addressForm.addressForm.get('pincode').patchValue(res['reeler']['address']['pincode']);
          this.addressForm.addressForm.get('region').patchValue(res['reeler']['address']['region']);
          this.addressForm.addressForm.get('longitude').patchValue(res['reeler']['address']['longitude']);
          this.addressForm.addressForm.get('latitude').patchValue(res['reeler']['address']['latitude']);
        }
      })
  }
  resetForm() {
    (this.isBlackListed) && (this.isBlackListed = false, this.disabledText = '')
  }

  goBack() {
    if (this.edit) {
      this.router.navigate(['/resha-farms/tussar/tussar-order-list']);
    } else {
      this.router.navigate(['/resha-farms/tussar/tussar-lot-list']);
    }

  }

  onImageUpload(image) {
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        let previewImage = reader.result as string;
        this.getS3Url(file.type, file);
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file)
      this._cd.detectChanges();
    }
  }

  async calluploadImageToS3API(s3url: String, file, fileNameFromS3: String) {
    try {
      this._cd.detectChanges()
      await this.api.updateImageToS3Directly(s3url, file).then(res => {
        this.preImgUrl = fileNameFromS3
        this._cd.detectChanges();
      })
    } catch (err) {
      this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges()
    }
  }
  async getS3Url(fileType, file) {
    try {
      this._cd.detectChanges()
      await this.api.getCocoonOrder_BiilsS3Url(fileType.split('/')[1]).then((res: S3UrlResponse) => {
        this.calluploadImageToS3API(res.targetUrl, file, res.fileName);
      })
    } catch (err) {
      this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges()
    }
  }



  /** Update Name */
  @ViewChild('updateNameHTML')
  updateNameHTML:ElementRef
  updateNameForm:UntypedFormControl = new UntypedFormControl('',[Validators.required,CustomValidator.cannotContainOnlySpace]);
  updateNameAPI(name){
    this.ngxLoader.stop();
    this.api.putReeler(this.selectedReeler,{name}).then((res:any) =>{
      this.modalRef.close();
      if(res){
        this.reelersData = [];
        this.selectedReeler = res['id'];
        this.reelersData.push(res);
        this.onReelerSelection()
        this.updateNameForm.reset();
        this.snackBar.open('Updated successfully', 'Ok', {
          duration: 3000
        });
      }
    })
  }

  updateName(response){
    if(response['name'] == ""){
      this.modalRef = this.modalService.open(this.updateNameHTML)
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed`;
        });
    }
  }

  close(){
    this.selectedReeler = null
    this.modalRef.close();
  }
  validateErros(i:number){
    return (this.markSoldForm.get('lotsToSell') as UntypedFormArray).at(i).get('sellingWeight').invalid
  }

}
