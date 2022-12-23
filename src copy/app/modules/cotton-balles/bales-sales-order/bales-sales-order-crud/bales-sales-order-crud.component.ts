import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SalesOrderBlockComponent } from 'src/app/modules/sales-order-block-popup/sales-order-block-popup.component';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AddressPincodeFormComponent } from 'src/app/modules/shared/address-pincode-form/address-pincode-form.component';
import { CustomValidator } from 'src/app/modules/shared/custom-validator/custom.validator';

@Component({
  selector: 'app-bales-sales-order-crud',
  templateUrl: './bales-sales-order-crud.component.html',
  styleUrls: ['./bales-sales-order-crud.component.scss']
})
export class BalesSalesOrderCrudComponent implements OnInit {
  @ViewChild('address') addressForm : AddressPincodeFormComponent;
  @ViewChild('mutliGSTAdds') mutliGSTAdds: ElementRef;
  @ViewChild('gstInactiveStatus') gstInactiveStatus: ElementRef;
  
  
  id:number;
  


  latitude;
  longitude;
  cottonTypesList = [{name:'BT COTTON',value:'BTCOTTON'},{name:'DCH COTTON',value:"DCHCOTTON"}]
  usersList: any= [];
  mandiList: any = [];
  balePurchaselotsData:any =[];
  balePurchasemarkSoldForm: UntypedFormGroup;
  spinningMillCreateForm: UntypedFormGroup;


  // balePurchasemarkSoldForm:FormGroup = this.form.group({
 
  // }) ;
  modalRef: any;
  closeResult: string;
  deleteIndex: any;
  code: any;
  SpinningMillList:any = [];
  selectedSpinningMill: any;
  kycCustomerTypes: any;
  centerList: any;
  previewImage: any;
  inProgressPO:any;
  cottonType:any;
  gstProfileData: any;
  radioSelected:any;
  showPo = false;
  seletedPO;
  user;
  gstSpinnmillStateCode: any;
  modalInactiveRef: any;
  selectedGstStatus: any;
  selectedGstBillTo: any;


  constructor(
  private route: ActivatedRoute,
  private router: Router,
  private form: UntypedFormBuilder,
  private _cd: ChangeDetectorRef,
  private snackBar: MatSnackBar,
  private modalService: NgbModal,
  private cdr: ChangeDetectorRef,
  private ngxLoader: NgxUiLoaderService,
  private utils: UtilsService,
  private searchApi: SearchService,
  public globalService: GlobalService,
  private $gaService:GoogleAnalyticsService,
  private apiService:ApiService, 
  ) 
  {
    //this.onValueChanges();

  }
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('_ud'));
    this.getAllUsers();
    this.getCenters();
    this.warehouseselection();
    this.formInitialization();
    this.getAllCustomerTypesList();
    this.listenForValueChanges();
  }

  listenForValueChanges(){
    this.balePurchasemarkSoldForm.get('centerID').valueChanges.subscribe(res=>{
      console.log(res);
      this.updateTheState();
    });
    // this.addressForm.addressForm.get('state').valueChanges.subscribe(res=>{
    //   console.log(res);
    //    this.updateTheState();
    // })
  }

  updateTheState(){
    const centerId = this.balePurchasemarkSoldForm.get('centerID').value ;
    const CenterGst = this.centerList.find(record=>record.id == centerId)?.gstNumber;
    if (CenterGst) {
      if (this.gstSpinnmillStateCode == CenterGst.substr(0,2)) {
        //withInState
        this.balePurchasemarkSoldForm.get('withInState').patchValue(true);
        this.updateThePrice();
      } else {
        this.balePurchasemarkSoldForm.get('withInState').patchValue(false);
        this.updateThePrice();
      }
    }
    
  }


  formInitialization() {
    this.balePurchaselotsData = this.globalService.cottonData;
    this.spinningMillCreateForm = this.form.group({
      name: new UntypedFormControl(''),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
      center: new UntypedFormControl('',[Validators.required]),
      customerType: new UntypedFormControl(''),
    });
    this.balePurchasemarkSoldForm = this.form.group({
      cottonBaleSalesOrderItems: new UntypedFormArray([]),
      spinningUnit:new UntypedFormControl(''),
      centerID: new UntypedFormControl('',[Validators.required]),
      cottonType:new UntypedFormControl(''),
      buyperkg: new UntypedFormControl(''),
      deduction: new UntypedFormControl(0),
      numberofcandies:new UntypedFormControl(''),
      discountinper:new UntypedFormControl(0),
      discountamount:new UntypedFormControl(''),
      pretaxamount:new UntypedFormControl(''),
      cgst:new UntypedFormControl(''),
      sgst:new UntypedFormControl(''),
      igst:new UntypedFormControl(''),
      withInState:[true],
      creditdays: new UntypedFormControl(''),
      hamalideduction: new UntypedFormControl(''),
      weighBridgeCharges: new UntypedFormControl(''),
      weighbridgeSlip: new UntypedFormControl(''),
      netreceivableAmount: new UntypedFormControl('',[Validators.required]),
      representative:new UntypedFormControl('',[Validators.required]),
      representativeName:[],
      representativePhone:[],
      gst:new UntypedFormControl(''),
      ratepercandy:new UntypedFormControl(''),
      minBuyprice: new UntypedFormControl(''),
      grostotal:new UntypedFormControl(''),
      totalWeight:new UntypedFormControl(''),
      state:new UntypedFormControl(''),
      // address: new FormGroup({
      //   address:new FormControl('',[Validators.required]),
      //   city: new FormControl('',[Validators.required]),
      //   taluk: new FormControl('',[Validators.required]),
      //   village: new FormControl('',[Validators.required]),
      //   district: new FormControl('',[Validators.required]),
      //   state: new FormControl('',[Validators.required]),
      //   pincode: new FormControl('',[Validators.required]),
      //   region: new FormControl('',[Validators.required]),
      //   latitude:new FormControl(),
      //   longitude:new FormControl()
      // }),
     
    })
    if (this.balePurchaselotsData) {
      this.balePurchaselotsData.forEach(e => {
        this.cottonType = e.baleType;
        let minPrice  = parseInt((e.ratePerCandy*1.05).toFixed(2));
        (this.balePurchasemarkSoldForm.get('cottonBaleSalesOrderItems') as UntypedFormArray).push(new UntypedFormGroup({
          code:new UntypedFormControl(e.code),
          cottonType:new UntypedFormControl(e.baleType),
          buyRatePerCandy:new UntypedFormControl(e.ratePerCandy),
          ratePerCandy:new UntypedFormControl((e.ratePerCandy*1.05).toFixed(2), [Validators.required, Validators.min(minPrice)]),
          minBuyprice:new UntypedFormControl((e.ratePerCandy*1.05).toFixed(2)),
          ratePerKg:new UntypedFormControl((e.ratePerCandy*1.05 /355.6).toFixed(2)),
          availableQuantity:new UntypedFormControl(e.availableQuantity),
          sellingWeight:new UntypedFormControl('', [Validators.required] ),
          deduction:new UntypedFormControl(''),
          actualSellingWeight:new UntypedFormControl(''),
          maxDiscountPerKg:new UntypedFormControl(''),
          discount:new UntypedFormControl(''),
          noOfCandies:new UntypedFormControl(''),
          grossAmount:new UntypedFormControl(''),
          totalAmount:new UntypedFormControl(''),

          cottonBaleListingId: new UntypedFormControl(e.id),
          sellingPricePerKg: new UntypedFormControl(''),
          wastageQuantity: new UntypedFormControl(''),
          discountAmount: new UntypedFormControl(''),
          discountAmountInPercentage: new UntypedFormControl(''),
          // grossAmount: new FormControl(''),
          buyPrice: new UntypedFormControl(''),
          // deduction:new FormControl(''),
          // actualSellingWeight:new FormControl(''),
          // noOfCandies:new FormControl(''),
          sellingPricePerCandy:new UntypedFormControl(''),
          discountAmountPerKg:new UntypedFormControl(''),
        }))
      })
      // this.onValueChangesOfWeight();
      this._cd.detectChanges();
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

  getAllCustomerTypesList(){
    this.apiService.getAllCustomerTypes().then(res => {
      this.kycCustomerTypes = res['_embedded']['kyccustomer'];
      this._cd.detectChanges();
    });
  }

  async getCenters() {
    this.apiService.getCottonBALESCenters().then(details => {
      if (details) {
        this.centerList = details['_embedded']['center'];
        console.log('center list',this.centerList)
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }

  getSpinningMillsList(event) {
    if(event.term.length % 2 == 0) {
      let searchParams = `(name==*${event.term.replace(/ /gi,"*")}* or phone==*${event.term.replace(/ /gi,"*")}*)`;
      this.apiService.searchAllspinMills(0, 50, 'createdDate', 'desc', searchParams).then(res => {
        this.SpinningMillList = res['content'];        
      })
      this._cd.detectChanges();
    }
    if( !event.term || event.term.length == 0) {
      this.SpinningMillList = [];
      this._cd.detectChanges();
    }
  }
  @ViewChild('updateWeaverName') updateWeaverName: ElementRef;
  async onspinningMillSelection() {
    this.showPo = true;
    this.seletedPO = "";
    // this.spinningMillCreateForm.get('centerID').patchValue('')
    if (this.selectedSpinningMill) {
      this.apiService.getSpinningMillById(this.selectedSpinningMill).then(res=>{
        console.log('sdfds',res)
        if(res){
          this.addressForm.addressForm.get('address').patchValue(res['address']['address']);
          this.addressForm.addressForm.get('village').patchValue(res['address']['village']);
          this.addressForm.addressForm.get('city').patchValue(res['address']['city']);
          this.addressForm.addressForm.get('district').patchValue(res['address']['district']);
          this.addressForm.addressForm.get('taluk').patchValue(res['address']['taluk']);
          this.addressForm.addressForm.get('region').patchValue(res['address']['region']);
          this.addressForm.addressForm.get('state').patchValue(res['address']['state']);
          this.addressForm.addressForm.get('pincode').patchValue(res['address']['pincode']);
          this.addressForm.addressForm.get('latitude').patchValue(res['address']['latitude']);
          this.addressForm.addressForm.get('longitude').patchValue(res['address']['longitude']);
           if(res['name'] === ""){
            this.modalRef = this.modalService.open(this.updateWeaverName)
              this.modalRef.result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
              }, (reason) => {
                this.closeResult = `Dismissed`;
              });
          }
          this.gstProfileData =[];

          if (res['gstNumberProfileDetails'].length) {
            
            this.modalRef = this.modalService.open(this.mutliGSTAdds)
            this.modalRef.result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
              this.closeResult = `Dismissed`;
            });
            res['gstNumberProfileDetails'].forEach(item =>{
              this.gstProfileData.push(item);
            })
          }
          
        }
      })
      
      this.apiService.getSpinningMillPOList(this.selectedSpinningMill, this.cottonType).then(res=>{
        // if (this.addressForm.addressForm.get('state').value == this.centerList.address.state) {
        //   //withInState
        //   this.balePurchasemarkSoldForm.get('withInState').patchValue(true);
        //   this.updateThePrice();
        // } else {
        //   this.balePurchasemarkSoldForm.get('withInState').patchValue(false);
        //   this.updateThePrice();
        // }
        this.inProgressPO = res['content']
        if(!this.inProgressPO.length){
          this.showPo = false;
        }
        this._cd.detectChanges();
      })
    } else {
  
      this.addressForm.addressForm.get('address').patchValue('');
      this.addressForm.addressForm.get('village').patchValue('');
      this.addressForm.addressForm.get('city').patchValue('');
      this.addressForm.addressForm.get('district').patchValue('');
      this.addressForm.addressForm.get('taluk').patchValue('');
      this.addressForm.addressForm.get('region').patchValue('');
      this.addressForm.addressForm.get('state').patchValue('');
      this.addressForm.addressForm.get('pincode').patchValue('');
      this.addressForm.addressForm.get('longitude').patchValue('');
      this.addressForm.addressForm.get('latitude').patchValue('');

    }
  }
  

  modalSpinningMillRef;
  closeSpinningMillResult: string;
  async open(content) {
    this.modalSpinningMillRef = this.modalService.open(content)
    this.modalSpinningMillRef.result.then((result) => {
      this.closeSpinningMillResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeSpinningMillResult = `Dismissed`;
    });
  }
  

  createSpinningmill(spinningCreateForm){
    const params = {
      name: spinningCreateForm.name,
      phone: spinningCreateForm.phone,
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
      landSize:"",
      consumptionCapacity:"",
      productionCapacity:"",
      yarnTypes:[],
      cottonBaleType:[],

      bankDetails: [],

      cocoonType: '',
      centerId:spinningCreateForm.center,
      customerType: spinningCreateForm.customerType? '/kyccustomer/' + spinningCreateForm.customerType : null
    };
    this.ngxLoader.stop();
    this.apiService.createSpinningMill(params).then((res:any) => {
      this.modalSpinningMillRef.close();
      if(res){
        this.selectedSpinningMill = res['id'];
        this.SpinningMillList.push(res);
        this.onspinningMillSelection()
        this.spinningMillCreateForm.reset();
        this.snackBar.open('Created  successfully', 'Ok', {
          duration: 3000
        });
      }
    });
    
  }
  onItemChange(item){
    console.log(item);
    this.selectedGstStatus = item?.gstnStatus;
    console.log(this.selectedGstStatus);
    
    if(item?.gstnStatus != "Active"){
      console.log(item?.gstnStatus );
      this.selectedGstStatus = item?.gstnStatus;
      this.modalInactiveRef = this.modalService.open(this.gstInactiveStatus)
      this.modalInactiveRef.result.then((result) => {
        this.modalInactiveRef = `Closed with: ${result}`;
      }, (reason) => {
        this.modalInactiveRef = `Dismissed`;
      });
    }
    this.selectedGstBillTo = item?.principalPlaceOfBusiness;
    this.gstSpinnmillStateCode = item?.gstNumber.substr(0,2);

  }

  close(){
    this.modalRef.close();
    //this.formInitialization();
  }

  ConfirmDeleteRecord() {
      this.globalService.cottonData.splice(this.deleteIndex, 1);
      (this.balePurchasemarkSoldForm.get('cottonBaleSalesOrderItems') as UntypedFormArray).removeAt(this.deleteIndex);
      this.modalRef.close();
      this.formInitialization();

  }

  warehouseselection(){
    this.apiService.getAllWarehouse().then(res => {
      this.mandiList = res['_embedded']['warehouse'];
      this.cdr.detectChanges();
    });
  }

  async getAllUsers() {
    this.usersList = [];
    this.apiService.getAllUsersList(this.globalService.cottonBales).then((res:any) => {
      if (res['_embedded']['user'] && res['_embedded']['user'].length) {
        this.usersList = res['_embedded']['user'];
      } else {
        this.usersList = [];
      }
      this._cd.detectChanges();
    });
  }

  async getV1Users() {
    this.usersList = [];
    this.ngxLoader.stop();
    this.apiService.getAllUsersList(this.globalService.v1Roles).then(res => {
      if (res['_embedded']['user'] && res['_embedded']['user'].length) {
        this.usersList = res['_embedded']['user'];
      } else {
        this.usersList = [];
      }
      this._cd.detectChanges();
    });
  }

  onImageUpload(image) {
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
        this.getS3CatUrl(file.type,file);
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  imageLoading:boolean = false;
  async getS3CatUrl(fileType,file){
    try{
      this.imageLoading = true;
      this._cd.detectChanges()
      await this.apiService.getbaleSOPresignedUrl(fileType.split('/')[1]).then((res:any)=>{
        this.calluploadImageToS3APICate(res.targetUrl,file,res.fileName);
        this.imageLoading = false;
      })
    }catch(err){
      this.balePurchasemarkSoldForm.get('weighbridgeSlip').patchValue('')
      this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this.imageLoading = false;
      this._cd.detectChanges()
    }
  }

  async calluploadImageToS3APICate(s3url:String,file,fileNameFromS3:String){
    try{
      this.imageLoading = true;
      this._cd.detectChanges()
      await this.apiService.updateImageToS3Directly(s3url,file).then((res:any)=>{
        this.balePurchasemarkSoldForm.get('weighbridgeSlip').patchValue(fileNameFromS3)
        
        this.imageLoading = false;
        this._cd.detectChanges();
        });
    }catch(err){
      this.imageLoading = false;
      this.balePurchasemarkSoldForm.get('weighbridgeSlip').patchValue('')
        this.snackBar.open('Image upload Failed', 'Ok', {
          duration: 3000
        });
        this._cd.detectChanges()
    }
  }
  expandImage=false;
  modelImageUrl=null;
  showImage(imageUrl) {
  if(imageUrl) {
    this.modelImageUrl=null;
    this.getprotectedUrl(imageUrl);
    this.expandImage = true;
  }
}


 async getprotectedUrl(imgUrl){
  const { targetUrl } : any = await this.apiService.getPresignedUrlForViewImage(imgUrl);
  this.modelImageUrl = targetUrl;
  this._cd.detectChanges()
}

  isControlValidForBaleSalesOrder(controlName: string): boolean {
    const control = this.balePurchasemarkSoldForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }
  isControlInvalidForBaleSalesOrder(controlName: string): boolean {
    const control = this.balePurchasemarkSoldForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
  controlHasErrorForBalesPurchase(validation, controlName): boolean {
    const control = this.balePurchasemarkSoldForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }
  isControlTouchedForBalesPurchase(controlName): boolean {
    const control = this.balePurchasemarkSoldForm.controls[controlName];
    return control.dirty || control.touched;
  }

  isControlValidForSpinning(controlName: string): boolean {
    const control = this.spinningMillCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForSpinning(controlName: string): boolean {
    const control = this.spinningMillCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
  
  controlHasErrorForSpinning(validation, controlName): boolean {
    const control = this.spinningMillCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedForSpinning(controlName): boolean {
    const control = this.spinningMillCreateForm.controls[controlName];
    return control.dirty || control.touched;
  }

  dataUpdate(i){
    let actualSellingWeight:any =(this.balePurchasemarkSoldForm.get("cottonBaleSalesOrderItems") as UntypedFormArray).at(i).get('sellingWeight').value-(this.balePurchasemarkSoldForm.get("cottonBaleSalesOrderItems") as UntypedFormArray).at(i).get('deduction').value;
    (this.balePurchasemarkSoldForm.get("cottonBaleSalesOrderItems") as UntypedFormArray).at(i).get('actualSellingWeight').patchValue(actualSellingWeight);
    let totalCandies = actualSellingWeight/355.6;
    (this.balePurchasemarkSoldForm.get("cottonBaleSalesOrderItems") as UntypedFormArray).at(i).get('noOfCandies').patchValue(totalCandies.toFixed(2));
    let ratepercandy = (this.balePurchasemarkSoldForm.get("cottonBaleSalesOrderItems") as UntypedFormArray).at(i).get('ratePerCandy').value;
    let DiscountAmount = (this.balePurchasemarkSoldForm.get("cottonBaleSalesOrderItems") as UntypedFormArray).at(i).get('discount').value;
    let nofcandies = (this.balePurchasemarkSoldForm.get("cottonBaleSalesOrderItems") as UntypedFormArray).at(i).get('noOfCandies').value;
    let rateperKg = ratepercandy / 355.6;
    (this.balePurchasemarkSoldForm.get("cottonBaleSalesOrderItems") as UntypedFormArray).at(i).get('ratePerKg').patchValue(rateperKg.toFixed(2));
    let rateperKgUpdated = (this.balePurchasemarkSoldForm.get("cottonBaleSalesOrderItems") as UntypedFormArray).at(i).get('ratePerKg').value;
    let grossTotalAmount = (rateperKgUpdated * actualSellingWeight);
    (this.balePurchasemarkSoldForm.get("cottonBaleSalesOrderItems") as UntypedFormArray).at(i).get('grossAmount').patchValue(grossTotalAmount.toFixed(2));
    let pretaxAmount = (rateperKgUpdated * actualSellingWeight) - (DiscountAmount);
    (this.balePurchasemarkSoldForm.get("cottonBaleSalesOrderItems") as UntypedFormArray).at(i).get('totalAmount').patchValue(pretaxAmount.toFixed(2));
    let buyrateperCandy = (this.balePurchasemarkSoldForm.get("cottonBaleSalesOrderItems") as UntypedFormArray).at(i).get('buyRatePerCandy').value;
    let buyingAmount = (buyrateperCandy * actualSellingWeight)/355.6;
    let grossTotalUpdated = (this.balePurchasemarkSoldForm.get("cottonBaleSalesOrderItems") as UntypedFormArray).at(i).get('grossAmount').value;
    let maxDiscountAmount = (grossTotalUpdated - buyingAmount);
    (this.balePurchasemarkSoldForm.get("cottonBaleSalesOrderItems") as UntypedFormArray).at(i).get('maxDiscountPerKg').patchValue(maxDiscountAmount.toFixed(2));

    // (this.markSoldForm.get("cottonOrderItems") as FormArray).at(i).get('sellingWeight').setValidators([Validators.max(sellingWeight)]);
    // (this.markSoldForm.get("cottonOrderItems") as FormArray).at(i).get('sellingWeight').updateValueAndValidity();
    this.updateThePrice();

  }

  updateThePrice(){
      let allPurcasesData =  (this.balePurchasemarkSoldForm.get("cottonBaleSalesOrderItems") as UntypedFormArray);

   let globalGrossTotal:any = 0;
   let globalDiscount:any = 0;
   let gloabalPreTaxAmount:any = 0;
   let globalNetAmount:any = 0;
   let globalTotalWeight:any = 0;
    for(let lot of allPurcasesData.controls){
      let grossAmount = lot.value.grossAmount ? lot.value.grossAmount : 0;
      globalGrossTotal =  globalGrossTotal + (parseFloat(grossAmount) );

      let discountAmount = lot.value.discount ? lot.value.discount : 0;
      globalDiscount = parseFloat(globalDiscount) + parseFloat(discountAmount);

      let sellingWeight = lot.value.actualSellingWeight ? lot.value.actualSellingWeight : 0;
      globalTotalWeight = globalTotalWeight + parseFloat(sellingWeight);
  }

  gloabalPreTaxAmount = parseFloat(globalGrossTotal) -  parseFloat(globalDiscount);
  globalNetAmount = parseFloat(gloabalPreTaxAmount) * 1.05;
  
  this.balePurchasemarkSoldForm.get('grostotal').patchValue(parseFloat(globalGrossTotal)?.toFixed(2));
  this.balePurchasemarkSoldForm.get('discountamount').patchValue(parseFloat(globalDiscount)?.toFixed(2));
  this.balePurchasemarkSoldForm.get('pretaxamount').patchValue(parseFloat(gloabalPreTaxAmount)?.toFixed(2));
  this.balePurchasemarkSoldForm.get('netreceivableAmount').patchValue(parseFloat(globalNetAmount)?.toFixed(2));
  this.balePurchasemarkSoldForm.get('totalWeight').patchValue(parseFloat(globalTotalWeight)?.toFixed(2));

  if(JSON.parse(this.balePurchasemarkSoldForm.get('withInState').value)){
    this.balePurchasemarkSoldForm.get('sgst').patchValue((parseFloat(gloabalPreTaxAmount)*0.025)?.toFixed(2));
    this.balePurchasemarkSoldForm.get('cgst').patchValue((parseFloat(gloabalPreTaxAmount)*0.025)?.toFixed(2));
    this.balePurchasemarkSoldForm.get('igst').patchValue(0);
  }else{
    this.balePurchasemarkSoldForm.get('sgst').patchValue(0);
    this.balePurchasemarkSoldForm.get('cgst').patchValue(0);
    this.balePurchasemarkSoldForm.get('igst').patchValue((parseFloat(gloabalPreTaxAmount)*0.05)?.toFixed(2));
  }
  }
  onSubmit(form){
      let reqObj ={
        "totalAmount": form.grostotal,
        "totalWeight": parseFloat(form.totalWeight),
        "invoiceURL": "",
        "dueAmount": form.netreceivableAmount,
        "cgst": form.cgst,
        "sgst": form.sgst,
        "igst": form.igst,
        "totalPreTaxPrice": form.pretaxamount,
        "totalDiscountAmount": form.discountamount,
        "totalDiscountInPercentage": '',
        "totalWastage": '',
        "hamaliDeduction" : form.hamalideduction,
        "netAmount": form.netreceivableAmount,
        "weighBridgeCharges": form.weighBridgeCharges,
        "rmRepresentativeName": form?.representative ? form?.representative?.name : "",
        "rmRepresentativePhone": form?.representative ? form?.representative?.phone : "",
        "dueDate": null,
        "creditDays": form.creditdays,
        "order_status": "NEW",
        "payment_status": "PENDING",
         "cottonBaleSalesOrderItems": [],
         "cottonBaleSalesOrderImages": [
          {
            "tag":"saleOrderImage",
            "url":this.balePurchasemarkSoldForm.get('weighbridgeSlip').value
          },
         ],
        "logistics": {},
        "shippingAddress": form.address,
        "spinningMillPayment": null,
        "center":{
          "id" :  form.centerID
        },
        "spinningMill": "/spinningmill/"+this.selectedSpinningMill,
        "cottonBalePurchaseProforma": this.seletedPO ? "/balepurchaseproforma/"+this.seletedPO : null,
        "billTo": this.selectedGstBillTo ? this.selectedGstBillTo : '',
      }
      form.cottonBaleSalesOrderItems.forEach(element => {
        reqObj['cottonBaleSalesOrderItems'].push({
          "cottonBaleListingId": element.cottonBaleListingId,
          "cottonType": element.cottonType,
          "sellingWeight": element.sellingWeight,
          "sellingPricePerKg": element.sellingPricePerKg,
          "totalAmount": element.totalAmount,
          "wastageQuantity": element.wastageQuantity,
          "discountAmount": element.discount,
          "discountAmountInPercentage": element.discountAmountInPercentage,
          "grossAmount": element.grossAmount,
          "buyPrice": element.buyRatePerCandy,
          "deduction":element.deduction,
          "actualSellingWeight":element.actualSellingWeight,
          "noOfCandies":element.noOfCandies,
          "sellingPricePerCandy":element.ratePerCandy,
          "discountAmountPerKg":element.discountAmountPerKg
        });
      });

      // reqObj['address'] = form.address;
      // reqObj['cottonBaleSalesOrderItems'] = form.cottonBaleSalesOrderItems;

      // if(this.user.phonenumber != '9425119729' && form.discountamount > 0 && +form.discountamount > (+form.pretaxamount + +form.discountamount)*0.02) {
      //   this.modalRef = this.modalService.open(SalesOrderBlockComponent,{backdrop: 'static',size: 'lg', keyboard: false, centered: true});
      // } else {
        this.apiService.CreateCottoBaleSaleOrder(reqObj).then(res => {
          this.router.navigate(['/bale-sales']);
        })
      // }

      
  }

  
 
}
