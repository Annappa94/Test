import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { distinctUntilChanged, distinctUntilKeyChanged } from 'rxjs/operators';
import { S3UrlResponse } from 'src/app/model/types/type.model';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { BankFormComponent } from 'src/app/modules/shared/bank-form/bank-form.component';
import { AddressPincodeFormComponent } from 'src/app/modules/shared/address-pincode-form/address-pincode-form.component';
import { SearchService } from 'src/app/services/api/search.service';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';


@Component({
  selector: 'app-cotton-crud',
  templateUrl: './cotton-crud.component.html',
  styleUrls: ['./cotton-crud.component.scss']
})
export class CottonCrudComponent implements OnInit {
  @ViewChild(AddressPincodeFormComponent, { static: true }) addressForm: AddressPincodeFormComponent;
  @ViewChild(BankFormComponent, { static: true }) bankForm: BankFormComponent;

  id: number;
  cottonCreateForm: UntypedFormGroup = this.form.group({
    stapleLengthInMm: [null],
    farmer: [[], [Validators.required]],
    micronaire: [],
    center: [[], [Validators.required]],
    moistureInPercentage: [],
    grade: [[], [Validators.required]],
    recivedWeight: [[], [Validators.required]],
    weightDeduction: [0, [Validators.required]],
    lotWeight: [],
    ratePerKg: [[], [Validators.required]],
    grossTotal: [],
    couponCode: [],
    couponAmount: [0],
    netPayableAmount: [],
    withInState: [true],
    netAmount: [],
    creditDays: [1, [Validators.required]],
    logisticsCost: [[], [Validators.required]],
    totalLogisticsCost: [],
    labourCost: [0],
    vehicleNumber: [[], [Validators.required]],
    rmRepresentative: [[]],
    cgst: [0],
    sgst: [0],
    igst: [0],
    cottonType: [],
    cottonImages: new UntypedFormArray([]),
    moistureImage: [],
    weighBridgeImage: [null, [Validators.required]],
    code: [],
    name: [],
    rmRepresentativeName: [[Validators.required]],
    rmRepresentativePhone: [],
    transactionType: new UntypedFormControl('MANUFACTURING'),
    ginner: new UntypedFormControl(),
    // address:this.form.group({
    //   address:[],
    //   village:[],
    //   city:[],
    //   district:[],
    //   taluk:[],
    //   region:[],
    //   state:[],
    //   pincode:[]
    //  }),
    //  bankDetails:this.form.group({
    //   beneficiaryName:[[],[Validators.required]],
    //   bankName:[[],[Validators.required]],
    //   accountNumber:[[],[Validators.required]],
    //   ifscCode:[[],[Validators.required]]
    //  })
  });
  onFarmerSelection: any;
  farmer: any;
  event: any;
  cottonFarmerBank: any;
  farmerRes: any;
  cottonFarmerBankVerifeied:boolean;
  queryParams: any;
  selectedFarmer: number;
  ginnerData:any;
  removeAddStar: boolean;
  selectedFarmerBankDetails: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private form: UntypedFormBuilder,
    private api: ApiService,
    private apiSearch: SearchService,
    private _cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private ngxLoader: NgxUiLoaderService,
    private globalService: GlobalService,
  ) {
    this.listenForCottonFormChanges();
    this.cottonFarmerBankVerifeied = false;
    this.route.queryParams.subscribe(params =>{
      console.log(params);
      this.queryParams = params;
      if(this.queryParams.selectedFarmerId){
        
        //this.getFarmersList({'term' : this.queryParams.selectedFarmerPhone});
        this.selectedFarmer = parseInt(this.queryParams.selectedFarmerId);
        console.log( this.selectedFarmer);
        
        //this.cottonCreateForm.get('farmer').patchValue(this.selectedFarmerId);
        this.updateFarmer(this.selectedFarmer);
        
      }
    });
    this.removeAddStar = true;

  }

  updateFarmer(farmerId){
    // this.selectedFarmerId =this.farmerList.find(farmer => farmer.id == farmerId);
    console.log( this.selectedFarmerId);
    this.api.getFarmerById(farmerId).then(res => {
      console.log('farmer res',res);
      this.farmerList.push(res['farmer']);
      this.bankForm.bankForm.patchValue(res['farmer']?.bankDetails[0])
    this.addressForm.addressForm.patchValue(res['farmer']?.address)
      
    })
    
  }

  ngOnInit(): void {

    this.getAllPromotionalCoupons();
    this.id = this.route.snapshot.params.id;
    !this.id && this.addCottonImages();
    this.id && this.getLotDetailsById();
    this.farmerFormInit();
    this.getCenters();
    this.getAllUsers();
  }

  centerList: any[] = [];
  farmerList: any[] = [];
  usersList: any[] = [];

  async getCenters() {
    this.api.getCottonProcCenters().then(details => {
      this.centerList = [];
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      console.log( this.centerList);
      
      this._cd.detectChanges();
    }, err => {
    });
  }


  addCottonImages() {
    (this.cottonCreateForm.get('cottonImages') as UntypedFormArray).push(new UntypedFormGroup({
      tag: new UntypedFormControl('Cotton image'),
      url: new UntypedFormControl('', [Validators.required]),
    }));
  }

  deleteCottonImages(index) {
    (this.cottonCreateForm.get('cottonImages') as UntypedFormArray).removeAt(index)
  }


  async getAllUsers() {
    this.usersList = [];
    this.ngxLoader.start();
    this.api.getAllUsersList(this.globalService.cottonRoles).then((res: any) => {
      if (res['_embedded']['user'] && res['_embedded']['user'].length) {
        this.usersList = res['_embedded']['user'];
      } else {
        this.usersList = [];
      }
      this._cd.detectChanges();
      this.ngxLoader.stop();
    });
  }
  onSubmit1(form){
    console.log(form);
    
  }

  selectedFarmerId;
  onSelectCottonFarmer(event,cottonFarmerBank) {
    let farmer = this.farmerList.find(farmer => farmer.id == event);
    this.selectedFarmerId = event
    this.cottonCreateForm.get("center").patchValue(farmer?.center?.id);
    farmer?.bankDetails.length && this.bankForm.bankForm.patchValue(farmer?.bankDetails[0])
    this.selectedFarmerBankDetails = farmer?.bankDetails[0]
    this.addressForm.addressForm.patchValue(farmer?.address)
    this.cottonCreateForm.get("cottonType").patchValue(farmer?.cottonDetails?.cottonType);
    this.cottonFarmerBankVerifeied = farmer?.bankDetails[0]?.verified;    
    // if (this.cottonFarmerBankVerifeied == false) {
    //   this.modalRef = this.modalService.open(cottonFarmerBank)
    //   this.modalRef?.result.then((result) => {
    //     this.closeResult = 'Closed with: ${result}';
    //   }, (reason) => {
    //     this.closeResult = 'Dismissed';
    //   });
    // };

  }

  onSubmit(value) {
    if (this.id) {
      this.patchCottonLot(this.buildPayLoad(value));
    } else {
      value['dueAmount'] = +value['netPayableAmount'];
      this.createCottonLot(this.buildPayLoad(value));
    }
  }

  clearAllTheFields() {
    this.cottonCreateForm.get('bankDetails').patchValue({
      beneficiaryName: null,
      bankName: null,
      accountNumber: null,
      ifscCode: null
    });
  }

  doNotProceed() {
    this.modalRef.close();
    this.selectedFarmerId = '';
    this.cottonCreateForm.reset();
    // this.router.navigate(['/cocoon-lot']);
  }

  buildPayLoad(data) {
    
   const address= {
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
    const bankDetails = {
      accountNumber: this.bankForm.bankForm.value.accountNumber,
      beneficiaryName: this.bankForm.bankForm.value.beneficiaryName,
      ifscCode: this.bankForm.bankForm.value.ifscCode,
      bankName: this.bankForm.bankForm.value.bankName,
      branchName: this.bankForm.bankForm.value.branchName,
    }
    const payload = data;
    if (data.transactionType != "REGULAR") {
      payload['ginner'] = "ginner/"+ data.ginner;
    } 
    
    payload['bankDetails'] = bankDetails;
    payload['address']=address;
    payload['centerId'] = +payload['center']
    payload['farmerId'] = +payload['farmer']
    payload["withInState"] = JSON.parse(payload["withInState"]);
    payload["rmRepresentativeName"] = payload['rmRepresentative']?.name;
    payload["rmRepresentativePhone"] = payload['rmRepresentative']?.phone;
    payload['availableQuantity'] = payload['lotWeight'];
    payload['sellingPricePerKg'] = payload['ratePerKg'] + (payload['ratePerKg'] * 0.05);
    payload['sellingWeight'] = 0;
    delete payload['rmRepresentative'];
    return payload;
  }


  createCottonLot(payload: any) {
    this.api.postCottonLot(payload).then(res => {
      this.snackBar.open('Created CottonLot successfully', 'Ok', {
        duration: 3000
      });
      this.router.navigate(['/resha-farms/cottonlot']);
    }).catch(err => {
      this.snackBar.open('Something went wrong ..', 'Ok', {
        duration: 3000
      });
    });
  }

  patchCottonLot(payload: any) {
    this.api.patchCottonLot(this.id, payload).then(res => {
      this.snackBar.open('Updated CottonLot successfully', 'Ok', {
        duration: 3000
      });
      this.router.navigate(['/resha-farms/cottonlot']);
    }).catch(err => {
      this.snackBar.open('Something went wrong ..', 'Ok', {
        duration: 3000
      });
    });
  }

  getGinnerList(event) {
    if(event.term.length % 2 == 0) {
      let searchParams = `(name==*${event.term.replace(/ /gi,"*")}* or phone==*${event.term.replace(/ /gi,"*")}*)`;
      // this.apiSearch.getOrdersCotton(false, 'ginner',searchParams).then(res => {
      this.api.getAllActiveContractGinners().then(res => {
        // this.ginnerData = res['content'];
        this.ginnerData = res;

        this._cd.detectChanges();
      })
    }
    if( !event.term || event.term.length == 0) {
      this.ginnerData = [];
      this._cd.detectChanges();
    }
  }


  getLotDetailsById() {
    this.api.getCottonLotDetailsById(this.id).then((res: any) => {
      this.cottonCreateForm.patchValue(res);
      console.log();
      
      //this.farmerList = [res?._embedded?.farmer?.farmer];
      this.updateFarmer(res?.farmerId)
      this.cottonCreateForm.get("ginner").patchValue(res?.ginnerId);
      this.cottonCreateForm.get("farmer").patchValue(res?.farmerId);
      this.cottonCreateForm.get("center").patchValue(res?.centerId);
      this.addressForm.addressForm.patchValue(res['address'])
      this.updateCottonImages(res);
      this.getGinnerDetailsById(res?.ginnerId);
    })
  }

  getGinnerDetailsById(id){
    this.ginnerData = [];
    this.api.getGinnerDetailsById(id).then((response:any)=>{
      console.log(response);
      this.ginnerData.push(response);
      
    })
  }

  updateCottonImages(res) {
    //Update Cotton Images 
    if (res?.cottonImages?.length) {
      const images = res?.cottonImages;
      for (let i = 0; i < images.length; i++) {
        (this.cottonCreateForm.get("cottonImages") as UntypedFormArray).push(new UntypedFormGroup({
          url: new UntypedFormControl(images[i].url),
          tag: new UntypedFormControl(images[i].tag)
        }))
      }
    } else {
      this.addCottonImages();
    }
  }

  getFarmerList(event) {
    if(event.term.length % 2 == 0) {  //name==*${event.term.replace(/ /gi,"*")}* or (removed as per deepak)
      let searchParams = `((phone==*${event.term.replace(/ /gi,"*")}*) and productType=='Cotton')`;
      this.api.searchAllFarmers(0, 50, 'createdDate', 'desc', searchParams).then(res => {
        this.farmerList = res['content'];
        this._cd.detectChanges();
      })
    }
    if (!event.term || event.term.length == 0) {
      this.farmerList = [];
      this._cd.detectChanges();
    }
  }

  onTransactionTypeChange(){
    console.log('resetting form');
    this.cottonCreateForm.get('recivedWeight').patchValue('');
    this.cottonCreateForm.get('weightDeduction').patchValue('');
    this.cottonCreateForm.get('lotWeight').patchValue('');
    this.cottonCreateForm.get('labourCost').patchValue('');
    this.cottonCreateForm.get('logisticsCost').patchValue('');
    this.cottonCreateForm.get('totalLogisticsCost').patchValue('');

    if (this.cottonCreateForm.get('transactionType').value && (this.cottonCreateForm.get('transactionType').value == 'MANUFACTURING')) {
      this.cottonCreateForm.get('ginner').addValidators(Validators.required);
      this.cottonCreateForm.get('ginner').updateValueAndValidity();
      this.removeAddStar = true;
    } else {
      this.cottonCreateForm.get('ginner').clearValidators();
      this.cottonCreateForm.get('ginner').updateValueAndValidity();
      this.removeAddStar = false;
    }
  }


  calculationUpdate(value) {
    //Actual Weight 
    let actualWeight = value?.recivedWeight - value.weightDeduction;
    let grossTotal;
    if(this.cottonCreateForm.get('transactionType').value == 'MANUFACTURING'){
      let labourCost = this.cottonCreateForm.get('labourCost').value;
       grossTotal = (actualWeight * value.ratePerKg ) - labourCost;
    }else{
       grossTotal = (actualWeight * value.ratePerKg )
    }
    
    let netPayableAmount = grossTotal + value.couponAmount;
    let netAmount = grossTotal + (grossTotal * 0.05) + value.couponAmount;

    value?.recivedWeight && this.cottonCreateForm.get('lotWeight').patchValue(actualWeight);//  Actual Weight = Received Weight - Weight Deduction
    this.cottonCreateForm.get('grossTotal').patchValue((grossTotal)?.toFixed(2));//  Gross Total = Actual Weight * Rate/ KG
    this.cottonCreateForm.get('netPayableAmount').patchValue(parseFloat(netPayableAmount)?.toFixed(2));// Net Payable Amount = Gross Total + Coupon Amount 
    this.cottonCreateForm.get('netAmount').patchValue(parseFloat(netAmount)?.toFixed(2));// Net Amount = Gross Total + (Gross Total * 5% GST ) + Coupon Amount 


    if (JSON.parse(value?.withInState) == true) {
      this.cottonCreateForm.get('cgst').patchValue((netPayableAmount * 0.025)?.toFixed(2));
      this.cottonCreateForm.get('igst').patchValue(0);
      this.cottonCreateForm.get('sgst').patchValue((netPayableAmount * 0.025)?.toFixed(2));
    } else if (JSON.parse(value?.withInState) == false) {
      this.cottonCreateForm.get('cgst').patchValue(0);
      this.cottonCreateForm.get('igst').patchValue((netPayableAmount * 0.05)?.toFixed(2));
      this.cottonCreateForm.get('sgst').patchValue(0);
    }
  }

  requestAPI: number = 0;
  responseAPI: number = 0;
  onImageUpload(image, index, placeholder: any = false) {
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        let previewImage = reader.result as string;
        this.getS3Url(file.type, file, index, placeholder);
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file)
      this._cd.detectChanges();
    }
  }
  async calluploadImageToS3API(s3url: String, file, fileNameFromS3: String, index, placeholder) {
    try {
      this.requestAPI++;
      this._cd.detectChanges()
      await this.api.updateImageToS3Directly(s3url, file).then(res => {
        this.responseAPI++;
        if (placeholder) {
          this.cottonCreateForm.get(placeholder).patchValue(fileNameFromS3);
        } else {
          (this.cottonCreateForm.get('cottonImages') as UntypedFormArray).at(index).get("url").patchValue(fileNameFromS3);
        }
        this._cd.detectChanges();
      })
    } catch (err) {
      this.responseAPI++;
      (this.cottonCreateForm.get('cottonImages') as UntypedFormArray).at(index).get("url").patchValue('');
      this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges()
    }
  }
  async getS3Url(fileType, file, index, placeholder) {
    try {
      this.requestAPI++;
      this._cd.detectChanges()
      await this.api.getS3Url(fileType.split('/')[1]).then((res: S3UrlResponse) => {
        this.responseAPI++;
        //this.preImgUrl = res.fileName
        this.calluploadImageToS3API(res.targetUrl, file, res.fileName, index, placeholder);
      })
    } catch (err) {
      this.responseAPI++;
      this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges()
    }
  }

  //Coupon Amount Code
  couponValid = false;
  couponMsg;
  redeemCode(formValue) {
    this.ngxLoader.start();
    this.api.verifyCoupon(formValue.couponCode.toUpperCase(), this.cottonCreateForm.get('farmer').value, this.cottonCreateForm.get('netAmount').value, 'COTTON_PURCHASE').then((res: any) => {
      this.ngxLoader.stop();
      if (res.status) {
        this.couponValid = true;
        this.cottonCreateForm.get('couponAmount').patchValue(Math.floor(+res.value));
        this.couponMsg = Math.floor(+res.value) + ' Added Suceessfully. '
        let total = this.cottonCreateForm.get('grossTotal').value;
        total = Math.round((+total + Number.EPSILON) * 100) / 100;
        total = total + this.cottonCreateForm.get('couponAmount').value;
        this.cottonCreateForm.get('netPayableAmount').patchValue(total);
        this._cd.detectChanges();
      } else {
        this.cottonCreateForm.get('couponCode').patchValue('');
        this.couponValid = false;
        this.couponMsg = res.messgage;
      }

    }, err => {
      this.snackBar.open('Please select Farmer, enter Weight and Price', 'Ok', {
        duration: 3000
      });
    })
  }

  couponClicked(coupon) {
    if (this.cottonCreateForm.get('couponAmount').value == 0) {
      this.cottonCreateForm.get('couponCode').patchValue(coupon);
    }
  }

  cancelCouponRedeem() {
    if (+this.cottonCreateForm.get('couponAmount').value > 0) {
      this.ngxLoader.start();
      this.api.deleteCoupon(this.cottonCreateForm.get('couponCode').value, this.cottonCreateForm.get('farmer').value.id).then(res => {
        this.ngxLoader.stop();
        this.snackBar.open('Please apply the coupon again', 'Ok', {
          duration: 3000
        });
      })
    }
    this.couponMsg = '';
    this.cottonCreateForm.get('couponCode').patchValue('');
    this.cottonCreateForm.get('couponAmount').patchValue(0);
  }

  couponList = [];
  getAllPromotionalCoupons() {
    this.api.getAllCouponByCustomer('FARMER').then(res => {
      const coupons = res['_embedded']['promotionalcoupon'];
      if (coupons.length) {
        this.couponList = [];
        for (let i = 0; i < coupons.length; i++) {
          if (coupons[i].isActive) {
            this.couponList.push(coupons[i]['couponCode'])
          }
        }
      }
    })
  }

  farmerCreateForm: UntypedFormGroup;
  farmerFormInit() {
    this.farmerCreateForm = this.form.group({
      name: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace, Validators.pattern("^[A-Za-z ]+$")]),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
      center: new UntypedFormControl('', [Validators.required]),
    });
  }

  modalRef;
  closeResult: string;
  async open(content) {
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  listenForCottonFormChanges() {
    this.cottonCreateForm.valueChanges.pipe(distinctUntilKeyChanged('recivedWeight')).subscribe(value => {
      this.calculationUpdate(value);
    });
    this.cottonCreateForm.valueChanges.pipe(distinctUntilKeyChanged('weightDeduction')).subscribe(value => {
      this.calculationUpdate(value);
    });
    this.cottonCreateForm.valueChanges.pipe(distinctUntilKeyChanged('ratePerKg')).subscribe(value => {
      this.calculationUpdate(value);
    });
    this.cottonCreateForm.valueChanges.pipe(distinctUntilKeyChanged('withInState')).subscribe(value => {
      this.calculationUpdate(value);
    });
    this.cottonCreateForm.valueChanges.pipe(distinctUntilKeyChanged('logisticsCost')).subscribe(value => {
      this.totalLogisticsCostCalculation(value);
    });
    this.cottonCreateForm.valueChanges.pipe(distinctUntilKeyChanged('labourCost')).subscribe(value => {
      this.totalLogisticsCostCalculation(value);
      this.calculationUpdate(value);
    });
  }

  totalLogisticsCostCalculation(value) {
    if(this.cottonCreateForm.get('transactionType').value == 'MANUFACTURING'){
      let totalcost = value?.logisticsCost;
      this.cottonCreateForm.get('totalLogisticsCost').patchValue(totalcost);// Total Logistics Cost = Logistics Cost + Labour Cost
    }else{
      let totalcost = value?.logisticsCost + value.labourCost;
      this.cottonCreateForm.get('totalLogisticsCost').patchValue(totalcost);// Total Logistics Cost = Logistics Cost + Labour Cost
    }
    
  }



  createFarmer(farmerForm) {
    const params = {
      name: farmerForm.name,
      phone: farmerForm.phone,
      productType: 'Cotton',
      center: '/center/' + farmerForm.center
    }
    this.ngxLoader.start();
    this.api.farmersOnboarding(params).then(res => {
      this.ngxLoader.stop();
      this.modalRef.close();
      if (res) {
        this.farmerList.push(res);
        this.cottonCreateForm.get('farmer').patchValue(res['id'])
        this.onFarmerSelection('')
        this.farmerCreateForm.reset();
        this.snackBar.open('Created farmer successfully', 'Ok', {
          duration: 3000
        });
      }
    });
  }



  isControlValidForReeler(controlName: string): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedForReeler(controlName): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.dirty || control.touched;
  }

  gotoCottonFarmer(){
    this.router.navigate(['/resha-farms/cotton-farmers/crud/'+this.selectedFarmerId],{queryParams:{redirecto:'cotton-crud'}})

    // this.router.navigate(['/cotton-farmers/crud',this.selectedFarmerId]);
     this.modalService.dismissAll();
  }
}
