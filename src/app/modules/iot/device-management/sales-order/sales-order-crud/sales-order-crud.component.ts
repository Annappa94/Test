import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { COCOON_SALES_ORDER } from 'src/app/constants/enum/constant.creditDays';
import { UNIT_OF_MESURES } from 'src/app/constants/enum/constant.retailer';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { CustomValidator } from 'src/app/modules/shared/custom-validator/custom.validator';


@Component({
  selector: 'app-sales-order-crud',
  templateUrl: './sales-order-crud.component.html',
  styleUrls: ['./sales-order-crud.component.scss']
})
export class SalesOrderCrudComponent implements OnInit {

  cocoonLotsIds;
  totalWeightOfLots;
  totalSellingPriceOfLots;
  searchText = '';
  devicemarkSoldForm: UntypedFormGroup;
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
  // COCOON_SALES_ORDER = [...COCOON_SALES_ORDER];
  UOM = {...UNIT_OF_MESURES};

  farmerList:any;


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
    private apiSearch:SearchService,

  ) 
  {
    this.user = JSON.parse(localStorage.getItem('_ud'))

  }

  ngOnInit(): void {
    console.log('tempdata',this.globalService.tempValueData);
    this.getAllRatePlanTypes();
    this.formInitialization();
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
      }
    });
    

  }
  formInitialization() {
    this.lotsData = this.globalService.tempValueData;
    this.devicemarkSoldForm = this.form.group({
      deviceToSell: new UntypedFormArray([]),
      driverName: new UntypedFormControl(''),
      noOfDevice: new UntypedFormControl(''),
      driverNumber: new UntypedFormControl(''),
      vehicleNumber: new UntypedFormControl(''),
      totalCost: new UntypedFormControl(''),
      totalPayment: new UntypedFormControl('', Validators.required),
      creditDays: new UntypedFormControl('0', Validators.required),
      discount: new UntypedFormControl(0, Validators.min(0)),
      grossPL: new UntypedFormControl(''),
      netPLAfterLogistics: new UntypedFormControl(''),
      ewayBillNo: new UntypedFormControl(''),
      address: new UntypedFormControl(''),
      village: new UntypedFormControl(''),
      district: new UntypedFormControl(''),
      city: new UntypedFormControl(''),
      pincode: new UntypedFormControl(''),
      taluk: new UntypedFormControl(''),
      state: new UntypedFormControl(''),
      representive: new UntypedFormControl('', Validators.required),
      deliveryNotes: new UntypedFormControl(''),
    })
    if (this.lotsData) {
      this.lotsData.forEach(e => {
        (this.devicemarkSoldForm.get('deviceToSell') as UntypedFormArray).push(new UntypedFormGroup({
          deviceCode:new UntypedFormControl(e.code),
          deviceType:new UntypedFormControl(e.deviceTypeCode),
          deviceId:new UntypedFormControl(e.deviceId),
          location:new UntypedFormControl(e.locationType),
          assigneName:new UntypedFormControl(e.assigneeName),
          healthStatus:new UntypedFormControl(e.health),
          availableStatus:new UntypedFormControl(e.status),
        }))
      })
      // this.onValueChangesOfWeight();
      this._cd.detectChanges();
    }

  }

  
  onValueChangesOfLogisticsCost() {
    let netPLAfterLogistics = 0;
    netPLAfterLogistics = +this.devicemarkSoldForm.get('grossPL').value - +this.devicemarkSoldForm.get('totalCost').value;
    this.devicemarkSoldForm.get('netPLAfterLogistics').patchValue(netPLAfterLogistics.toFixed(2));
    this._cd.detectChanges();
  }

  onValueChangesOfWeight(disableSaveButton?:string) {
    if(disableSaveButton) {
      this.disableSaveButton = true;
    } else {
      this.disableSaveButton = false;
    }
    this.invalidSellingPrice = false;
    let arr = this.devicemarkSoldForm.get('deviceToSell').value;
    let lotsArray = this.devicemarkSoldForm.get('deviceToSell') as UntypedFormArray;
    let sellingTotal = 0;
    let totalWeight = 0;
    let grossPL = 0;
    let totalDiscount = 0
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
      // sellingTotal = (+element.sellingWeight * +element.sellingPrice) - (+element.discountAmount ? +element.discountAmount * +element.sellingWeight : 0);
      // totalWeight += +element.sellingWeight;
      // grossPL += (+element.sellingWeight * +element.sellingPrice) - (+element.weight * +element.buyingPrice);
      // (this.devicemarkSoldForm.get('deviceToSell') as FormArray).at(i).get('sellingTotal').setValue(sellingTotal.toFixed(2));
    });
    this.devicemarkSoldForm.get('discount').patchValue(totalDiscount.toFixed(2));
    this.totalWeightOfLots = totalWeight;
    if(this.edit && this.devicemarkSoldForm.get('totalPayment').value) {
      this.totalSellingPriceOfLots = this.devicemarkSoldForm.get('discount').value ? ((Math.round(((+this.devicemarkSoldForm.get('totalPayment').value) + Number.EPSILON)*100)/100) + this.devicemarkSoldForm.get('discount').value) / +this.totalWeightOfLots :
      (Math.round(((+this.devicemarkSoldForm.get('totalPayment').value) + Number.EPSILON)*100)/100) / +this.totalWeightOfLots;
    }
    this._cd.detectChanges();
  }


  async open(content, formValue) {
    this.paymentForLots = formValue;
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  payNow() {
    let patchReelerAddressDetails = {
      address: {
        address: this.devicemarkSoldForm.get('address').value,
        village: this.devicemarkSoldForm.get('village').value,
        city: this.devicemarkSoldForm.get('city').value,
        district: this.devicemarkSoldForm.get('district').value,
        taluk: this.devicemarkSoldForm.get('taluk').value,
        state: this.devicemarkSoldForm.get('state').value,
        pincode: this.devicemarkSoldForm.get('pincode').value
      }
    }

    let deviceOrderItems = [];
    const params = {
      totalAmount: this.devicemarkSoldForm.get('totalPayment').value ? (Math.round(((+this.devicemarkSoldForm.get('totalPayment').value) + Number.EPSILON)*100)/100) : 0,
      discount: this.devicemarkSoldForm.get('discount').value ? this.devicemarkSoldForm.get('discount').value : 0,
      grossAmount: this.devicemarkSoldForm.get('discount').value ? (Math.round(((+this.devicemarkSoldForm.get('totalPayment').value) + Number.EPSILON)*100)/100) + +(this.devicemarkSoldForm.get('discount').value) :
      Math.round(((+this.devicemarkSoldForm.get('totalPayment').value) + Number.EPSILON)*100)/100,
      totalWeight: this.totalWeightOfLots,
      sellingPricePerKg: +this.totalSellingPriceOfLots.toFixed(2),
      noOfDevice: this.devicemarkSoldForm.get('noOfDevice').value,
      ewayBillNo: this.devicemarkSoldForm.get('ewayBillNo').value,
      ewayBillImage: this.preImgUrl,
      creditDays: this.devicemarkSoldForm.get('creditDays').value,
      logistics: {
        totalCost: this.devicemarkSoldForm.get('totalCost').value ? this.devicemarkSoldForm.get('totalCost').value : null,
        vehicleNumber: this.devicemarkSoldForm.get('vehicleNumber').value,
        driverNumber: this.devicemarkSoldForm.get('driverNumber').value,
        driverName: this.devicemarkSoldForm.get('driverName').value,
        dispatchTime: '',
        arrivalTime: '',
      },
      shippingAddress: patchReelerAddressDetails.address,
      deliveryNotes: this.devicemarkSoldForm.get('deliveryNotes').value,
      termsAndConditions: this.termsAndConditions,
    }
    this.ngxLoader.stop();
    if (this.edit) {
      let count = 0;
        params['dueAmount'] = Math.round(((+this.devicemarkSoldForm.get('totalPayment').value) + Number.EPSILON)*100)/100;
        // params['dueAmount'] = Math.round(+this.devicemarkSoldForm.get('totalPayment').value);
      let orderItem = {};

      this.devicemarkSoldForm.get('deviceToSell').value.forEach(element => {
        orderItem = {
          cocoonLotId: element.id,
          cocoonLotCode: element.lotCode,
          sellingPricePerKg: element.sellingPrice ? +element.sellingPrice.toFixed(2) : null,
          sellingWeight: +element.sellingWeight,
          discount: element.discountAmount ? +element.discountAmount * +element.sellingWeight : 0,
          totalAmount: +element.sellingTotal,
          grossAmount: +element.sellingPrice * +element.sellingWeight,
          cocoonGrade: element.grade,
          cocoonType: element.cocoonType,
          markSold: element.markSold ? element.markSold : false,
          wastageQuantity: element.markSold ? element.wastage : 0,
          buyPrice: element.buyingPrice,
          uom:element.uom

        }
        deviceOrderItems.push(orderItem);
        count++;
        if (count == this.globalService.tempOrderData.deviceOrderItems.length) {
          params['deviceOrderItems'] = deviceOrderItems;
          this.api.patchCocoonOrder(params, this.id).then(res => {

            this.router.navigate(['/resha-farms/cocoon-orders']);
            this.snackBar.open('Updated order Successfully', 'OK', {
              duration: 3000
            });
          })
        }
      });
    } else {
      let count = 0;
      params['reeler'] = '/reeler/' + this.selectedReeler;
      params['rmRepresentativePhone'] = this.devicemarkSoldForm.get('representive').value.phone;
      params['rmRepresentativeName'] = this.devicemarkSoldForm.get('representive').value.name;
      let orderItem = {};
      this.devicemarkSoldForm.get('deviceToSell').value.forEach(element => {
        orderItem = {
          cocoonLotId: element.id,
          cocoonLotCode: element.lotCode,
          creditDays: element.creditDays,
          sellingPricePerKg: element.sellingPrice ? +element.sellingPrice.toFixed(2) : null,
          sellingWeight: +element.sellingWeight,
          discount: element.discountAmount ? +element.discountAmount * +element.sellingWeight : 0,
          totalAmount: +element.sellingTotal,
          grossAmount: +element.sellingPrice * +element.sellingWeight,
          cocoonGrade: element.grade,
          cocoonType: element.cocoonType,
          markSold: element.markSold ? element.markSold : false,
          wastageQuantity: element.markSold ? element.wastage.toFixed(2) : 0,
          buyPrice: element.buyingPrice,
          uom:element.uom
        }
        deviceOrderItems.push(orderItem);
        this.ngxLoader.stop();
        count++;
        if (count == this.lotsData.length) {
          params['deviceOrderItems'] = deviceOrderItems;
          this.api.markCocoonLotAsSold(params).then(res => {
            this.$gaService.event('Cocoon Lot mark as sold', ` totalAmount =  ${params.totalAmount}, totalWeight = ${params.totalWeight}`);

            this.router.navigate(['/resha-farms/cocoon-lot'])
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
    let lotsArray = this.devicemarkSoldForm.get('deviceToSell') as UntypedFormArray;
    for (let j = 0; j < lotsArray.length; j++) {
      lotsArray.controls[j].patchValue({ "markSold": false });
      lotsArray.controls[j].patchValue({ "wastage": 0 });
      lotsArray.controls[j].patchValue({ "showMarkSold": false });
    }
    let deviceOrderItems: any = [];
    let item;
    (this.devicemarkSoldForm.controls['deviceToSell'] as UntypedFormArray).controls.forEach((element) => {
      item = {};
      item['id'] = element?.get('id').value;
      item['quantity'] = element?.get('sellingWeight').value;
      item['sellingPrice'] = element?.get('sellingPrice').value ? +(element.get('sellingPrice').value) : 0;
      deviceOrderItems.push(item);
    });

    let reqObj = {
      discount: +this.devicemarkSoldForm.get('discount').value,
      uom: 'kg',
      orderItems: deviceOrderItems
    }

    if(this.edit) {
      reqObj['entityId']=this.id
    }

    this.api.getCocoonListEstimateTotal(reqObj).then(estimate => {
      this.disableSaveButton = false;
      this.netAmount = estimate['preTaxAmount'];
      this.devicemarkSoldForm.get('totalPayment').patchValue(estimate['totalAmount']);
      this.totalSellingPriceOfLots = estimate['preTaxAmount']/ +this.totalWeightOfLots;
      (Math.round(+this.devicemarkSoldForm.get('totalPayment').value)) / +this.totalWeightOfLots;;
      if (estimate['additionalAttributes'] && estimate['additionalAttributes']['flaggedList'].length) {
        let flaggedList = estimate['additionalAttributes']['flaggedList']
        for (let i = 0; i < flaggedList.length; i++) {
          let index = -1;
          let lotsArray = this.devicemarkSoldForm.get('deviceToSell') as UntypedFormArray;
          index = this.devicemarkSoldForm.get('deviceToSell').value.map(function (e) {
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

  // getReelerList(event) {
  //   if (event.term.length % 2 == 0) {
  //     let searchParams = `(name==*${event.term.replace(/ /gi, "*")}* or phone==*${event.term.replace(/ /gi, "*")}*)`;
  //     this.api.searchAllReelers(0, 50, 'createdDate', 'desc', searchParams).then(res => {
  //       this.reelersData = res['content'].filter(data=>!(data?.phone.includes('__DELETED')));
  //       this._cd.detectChanges();
  //     })
  //   }
  //   if (!event.term || event.term.length == 0) {
  //     this.reelersData = [];
  //     this._cd.detectChanges();
  //   }
  // }

  getFarmerList(event) {
    if(event.term.length % 2 == 0) {
      let searchParams = `((name==*${event.term.replace(/ /gi,"*")}* or phone==*${event.term.replace(/ /gi,"*")}*) and productType=='Cotton')`;
      this.api.searchAllFarmers(0, 50, 'createdDate', 'desc', searchParams).then(res => {
        this.farmerList = res['content'];
        this._cd.detectChanges();
      })
    }
    if( !event.term || event.term.length == 0) {
      this.farmerList = [];
      this._cd.detectChanges();
    }
  }

  onFarmerSelection(event){
    let farmer =this.farmerList.find(farmer=>farmer.id==event);
    console.log('farmerlist',farmer);
    this.devicemarkSoldForm.get('address').patchValue(farmer['address']['address']);
    this.devicemarkSoldForm.get('village').patchValue(farmer['address']['village']);
    this.devicemarkSoldForm.get('city').patchValue(farmer['address']['city']);
    this.devicemarkSoldForm.get('district').patchValue(farmer['address']['district']);
    this.devicemarkSoldForm.get('taluk').patchValue(farmer['address']['taluk']);
    this.devicemarkSoldForm.get('state').patchValue(farmer['address']['state']);
    this.devicemarkSoldForm.get('pincode').patchValue(farmer['address']['pincode']);
    
  }

  getAllRatePlanTypes(){
    this.api.getDeviceTypeRatePlans().then(response=>{
      console.log('retapaln res',response);
      
    })
  }

  // onReelerSelection() {
  //   if (this.selectedReeler)
  //     this.api.getReelerById(this.selectedReeler).then(res => {
  //       if (res) {
  //         this.updateName(res['reeler']);
  //         this.isBlackListed = res['reeler']['isBlackListed'];
  //         if (this.isBlackListed) {
  //           this.disabledText = `${res['reeler']['name']} is blacklisted. In order to mark as sold, please contact Admin to check pending payments`;
  //         }
  //         this.devicemarkSoldForm.get('address').patchValue(res['reeler']['address']['address']);
  //         this.devicemarkSoldForm.get('village').patchValue(res['reeler']['address']['village']);
  //         this.devicemarkSoldForm.get('city').patchValue(res['reeler']['address']['city']);
  //         this.devicemarkSoldForm.get('district').patchValue(res['reeler']['address']['district']);
  //         this.devicemarkSoldForm.get('taluk').patchValue(res['reeler']['address']['taluk']);
  //         this.devicemarkSoldForm.get('state').patchValue(res['reeler']['address']['state']);
  //         this.devicemarkSoldForm.get('pincode').patchValue(res['reeler']['address']['pincode']);
  //       }
  //     })
  // }
  resetForm() {
    (this.isBlackListed) && (this.isBlackListed = false, this.disabledText = '')
  }

  goBack() {
    if (this.edit) {
      this.router.navigate(['/resha-farms/cocoon-orders']);
    } else {
      this.router.navigate(['/resha-farms/cocoon-lot']);
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
      await this.api.getCocoonOrder_BiilsS3Url(fileType.split('/')[1]).then((res) => {
        // this.calluploadImageToS3API(res.targetUrl, file, res.fileName);
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
        //this.onReelerSelection()
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
    return (this.devicemarkSoldForm.get('deviceToSell') as UntypedFormArray).at(i).get('sellingWeight').invalid
  }

}
