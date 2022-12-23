import { ChangeDetectorRef, Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api/api.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import * as _moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { COTTON_BALE_PURCHASE_PO } from 'src/app/constants/enum/constant.creditDays';
import { GlobalService } from 'src/app/services/global/global.service';
import { AddressPincodeFormComponent } from 'src/app/modules/shared/address-pincode-form/address-pincode-form.component';
import { BankFormComponent } from 'src/app/modules/shared/bank-form/bank-form.component';
import { CustomValidator } from 'src/app/modules/shared/custom-validator/custom.validator';

@Component({
  selector: 'app-bales-po-crud',
  templateUrl: './bales-po-crud.component.html',
  styleUrls: ['./bales-po-crud.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class BalesPoCrudComponent implements OnInit {
  @ViewChild('address') addressForm : AddressPincodeFormComponent;
  @ViewChild('bank') bankForm : BankFormComponent;

  selectedSpinningMill: any;
  baleFromDetails: UntypedFormGroup;
  spinningMillCreateForm: UntypedFormGroup;
  addWeaverNameForm: UntypedFormGroup;
  SpinningMillList: any = [];
  centerList=[]
  edit = false;
  id;
  netAmount:any = 0;
  discount = 0;
  totalAmount = 0;
  previewImage:any;
  imageUploaded:any;
  yarnDetails=0;
  imageFile:any;
  invalidTwistedType = false;
  cottonTypesList = [{name:'BT COTTON',value:'BTCOTTON'},{name:'DCH COTTON',value:"DCHCOTTON"}]
  notesList: any = [];
  expandImage=false;
  modelImage='';
  description = true;
  latitude:any;
  longitude:any;
  filePreviewImage:any;
  imgFile:any;
  imgUploaded:boolean=false;
  preImgUrl;
  COTTON_BALE_PURCHASE_PO = [...COTTON_BALE_PURCHASE_PO];
  usersList: any = [];
  representive;
  kycCustomerTypes: any;
  blaeperformadetails: any;
  balePoPerformOrder:any;



  async balePerformaParams(){
    this.baleFromDetails = this.form.group({
       phone: new UntypedFormControl(''),
       name: new UntypedFormControl(''),
       validTill: new UntypedFormControl('',[Validators.required]),
       creditDays: new UntypedFormControl(0,[Validators.required]),
       cottonType:new UntypedFormControl(''),
       stapleLength:new UntypedFormControl(''),
       rd: new UntypedFormControl(''),
       trashContent: new UntypedFormControl(''),
       elong: new UntypedFormControl(''),
       microniareValue: new UntypedFormControl(''),
       strength: new UntypedFormControl(''),
       noOfBales: new UntypedFormControl('',[Validators.required]),
       totalWeight: new UntypedFormControl(''),
       pricePerCandy: new UntypedFormControl('',[Validators.required]),
       pricePerKg: new UntypedFormControl(''),
       noOfCandies: new UntypedFormControl(''),
       grossTotal: new UntypedFormControl(''),
       discountAmount: new UntypedFormControl(''),
       netPrice: new UntypedFormControl(''),
 
      //  address:new FormControl(''),
      //  city:new FormControl(''),
      //  village:new FormControl(''),
      //  district:new FormControl(''),
      //  pincode:new FormControl(''),
      //  taluk:new FormControl(''),
      //  state:new FormControl(''),
      //  region: new FormControl(''),
       kycPANNumber: new UntypedFormControl(''),
       kycAdhaarNumber: new UntypedFormControl(''),
       gstNumber: new UntypedFormControl(''),
       
      //  beneficiaryName: new FormControl(''),
      //  bankName: new FormControl(''),
      //  accountNumber: new FormControl(''),
      //  ifscCode: new FormControl(''),

       poDocUrl:new UntypedFormControl('')
     });   
 
     this.spinningMillCreateForm = this.form.group({
       name: new UntypedFormControl(''),
       phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
       center: new UntypedFormControl('',[Validators.required]),
       customerType: new UntypedFormControl(''),
     });
   }  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private form: UntypedFormBuilder,
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private utils: UtilsService,
    @Inject(LOCALE_ID) private locale: string,
    private ngxLoader : NgxUiLoaderService,
    private globalService:GlobalService
  ) {
    this.balePerformaParams();
    this.getCenters();
    this.getLocation();
    this.getAllUsers();
    this.getAllCustomerTypes();
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
      }
    });

    if (this.id) {
      this.edit=true;      
      this.ngxLoader.stop();
      this.api.getBalePerformaById(this.id).then((response:any) => {
        this.getSpinnigmillOfBalePO()
        this.blaeperformadetails = response;
        if (response) {
          if(response != null){
          this.baleFromDetails.get('name').patchValue('')
          this.baleFromDetails.get('phone').patchValue('')
          this.baleFromDetails.get('grossTotal').patchValue(response['grossTotal'])
          this.baleFromDetails.get('discountAmount').patchValue(response['discountAmount'])
          this.baleFromDetails.get('creditDays').patchValue(response['creditDays'])
          this.baleFromDetails.get('cottonType').patchValue(response['cottonType'])

          this.baleFromDetails.get('stapleLength').patchValue(response['stapleLength'])
          this.baleFromDetails.get('rd').patchValue(response['rd'])
          this.baleFromDetails.get('elong').patchValue(response['elong'])
          this.baleFromDetails.get('microniareValue').patchValue(response['microniareValue'])
          this.baleFromDetails.get('strength').patchValue(response['strength'])
          this.baleFromDetails.get('trashContent').patchValue(response['trashContent'])

          this.baleFromDetails.get('noOfBales').patchValue(response['noOfBales'])
          this.baleFromDetails.get('totalWeight').patchValue(response['totalWeight'])
          this.baleFromDetails.get('pricePerCandy').patchValue(response['pricePerCandy'])
          this.baleFromDetails.get('noOfCandies').patchValue(response['noOfCandies'])
          this.baleFromDetails.get('grossTotal').patchValue(response['grossTotal'])
          this.baleFromDetails.get('discountAmount').patchValue(response['discountAmount'])
          this.baleFromDetails.get('netPrice').patchValue(response['netPrice'])

            this.bankForm.bankForm.get('accountNumber').patchValue(response['bankDetails'][0]?.['accountNumber'])
            this.bankForm.bankForm.get('bankName').patchValue(response['bankDetails'][0]?.['bankName'])
            this.bankForm.bankForm.get('beneficiaryName').patchValue(response['bankDetails'][0]?.['beneficiaryName'])
            this.bankForm.bankForm.get('ifscCode').patchValue(response['bankDetails'][0]?.['ifscCode'])
            this.bankForm.bankForm.get('branchName').patchValue(response['bankDetails'][0]?.['branchName'])


            this.addressForm.addressForm.get('address').patchValue(response['shippingAddress']['address'])
            this.addressForm.addressForm.get('city').patchValue(response['shippingAddress']['city'])
            this.addressForm.addressForm.get('village').patchValue(response['shippingAddress']['village'])
            this.addressForm.addressForm.get('district').patchValue(response['shippingAddress']['district'])
            this.addressForm.addressForm.get('pincode').patchValue(response['shippingAddress']['pincode'])
            this.addressForm.addressForm.get('state').patchValue(response['shippingAddress']['state'])
            this.addressForm.addressForm.get('taluk').patchValue(response['shippingAddress']['taluk'])
            this.addressForm.addressForm.get('region').patchValue(response['shippingAddress']['region'])
            this.addressForm.addressForm.get('latitude').patchValue(response['shippingAddress']['latitude'])
            this.addressForm.addressForm.get('longitude').patchValue(response['shippingAddress']['longitude'])

          let representiveObj;
          if (response.rmRepresentativeName) {
            representiveObj = {
              name: response.rmRepresentativeName,
              phone: response.rmRepresentativePhone
            }
          } else {
            representiveObj = {
              name: '-',
              phone: response.createdBy
            }
          }
          this.representive = representiveObj;
          this.previewImage=response['poDocUrl']
          
          if(response['expiry']) {
             let date;
            date = formatDate(response['expiry'], 'MM-dd-yyyy', this.locale);
            const moment = _moment; 
            this.baleFromDetails.get('validTill').patchValue(moment(date, "MM/DD/YYYY"));
          }
        }
          this.totalAmount = response['grossTotal']
          this.netAmount = response['netPrice']
          this.discount=response['discountAmount']?response['discountAmount']:0;
          this.calculateDiscountNetAmount()
          this._cd.detectChanges();

        } else {
          console.log("Response for Spinning found to be ", response)
          this.snackBar.open('Failed to find ', 'Ok', {
            duration: 3000
          });
        }
      })
    } 
    
   }

   getSpinnigmillOfBalePO(){
     let url = "balepurchaseproforma/"+this.id+"/spinningMill"
     this.api.getSpinnMillofPerfoma(url).then((response:any) => {
       this.baleFromDetails.get('name').patchValue(response['name'])
       this.baleFromDetails.get('phone').patchValue(response['phone'])
       this.selectedSpinningMill = response['id'];

       
     })
   }
  // dataFromTextEditor(innerHTML){
  //  console.log(innerHTML);
  // }

  updateWeightCalc(){
    let totalWeightCalculated = this.baleFromDetails.get('noOfBales').value * 170;
    this.baleFromDetails.get('totalWeight').patchValue(totalWeightCalculated);
    let nofcandies = this.baleFromDetails.get('noOfBales').value * 170 / 355.6;
    this.baleFromDetails.get('noOfCandies').patchValue(nofcandies.toFixed(2));
    let priceperCandy = this.baleFromDetails.get('pricePerCandy').value ? this.baleFromDetails.get('pricePerCandy').value : 0;
    let priceperKg = priceperCandy/355.6;
    this.baleFromDetails.get('pricePerKg').patchValue(priceperKg.toFixed(2));
    let pricePerKgUpdated = this.baleFromDetails.get('pricePerKg').value ? this.baleFromDetails.get('pricePerKg').value : 0;
    let grossTotal = pricePerKgUpdated * totalWeightCalculated;
    this.baleFromDetails.get('grossTotal').patchValue(grossTotal.toFixed(2));
    let discountAmount = this.baleFromDetails.get('discountAmount').value ? this.baleFromDetails.get('discountAmount').value : 0;
    let netamount = grossTotal - discountAmount;
    this.baleFromDetails.get('netPrice').patchValue(netamount.toFixed(2));
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          console.log("Latitude: " + position.coords.latitude +
            "Longitude: " + position.coords.longitude);
        }
        this.watchPosition();
      },
        (error) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  watchPosition(){
    let id = navigator.geolocation.watchPosition((position) =>{
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          if(position.coords.latitude === this.latitude){
            navigator.geolocation.clearWatch(id);
          }
          console.log(this.latitude, this.longitude);
          
    }, (error) =>{console.log(error)},
    {
      enableHighAccuracy : true,
      timeout: 5000,
      maximumAge: 0
    }
    )
  }
  openMap(lat, lng){
    window.open("http://maps.google.com/maps?q=loc:" + lat + "," + lng, '_blank')
  }

 
  addItem(){
     (this.baleFromDetails.controls['items'] as UntypedFormArray).push(
      new UntypedFormGroup({
        yarnType: new UntypedFormControl('',[Validators.required]),
        twistedType: new UntypedFormControl(),
        pricePerQuantity: new UntypedFormControl('',[Validators.required]),
        denier: new UntypedFormControl(''),
        quantity: new UntypedFormControl('',[Validators.required]),
        yarnCocoonType: new UntypedFormControl('', [Validators.required])
     })
     );
  }

  remove(){
    this.previewImage = undefined;
    
    if (this.yarnDetails) {
      this.yarnDetails['testingCertificateUrl'] = '';
    }
    this.imageUploaded = false;
    this.imageFile = null;
  }

  

  getSpinningMillsList(event) {
    if(event.term.length % 2 == 0) {
      let searchParams = `(name==*${event.term.replace(/ /gi,"*")}* or phone==*${event.term.replace(/ /gi,"*")}*)`;
      this.api.searchAllspinMills(0, 50, 'createdDate', 'desc', searchParams).then(res => {
        this.SpinningMillList = res['content'];        
      })
      this._cd.detectChanges();
    }
    if( !event.term || event.term.length == 0) {
      this.SpinningMillList = [];
      this._cd.detectChanges();
    }
  }
   
  async getCenters() {
    this.api.getCentersList().then(details => {
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }

  deleteItem(index){
    (this.baleFromDetails.controls['items'] as UntypedFormArray).removeAt(index);
  }

  @ViewChild('updateWeaverName') updateWeaverName: ElementRef;
  async onspinningMillSelection() {
    
    if (this.selectedSpinningMill) {
      this.api.getSpinningMillById(this.selectedSpinningMill).then(res=>{
        if(res){
          this.baleFromDetails.get('name').patchValue(res['name']);
          this.baleFromDetails.get('phone').patchValue(res['phone']);

          this.baleFromDetails.get('beneficiaryName').patchValue(res ? res['bankDetails'].length ? res['bankDetails'][0].beneficiaryName : '' : '');
          this.baleFromDetails.get('accountNumber').patchValue(res ? res['bankDetails'].length ? res['bankDetails'][0].accountNumber : '' : '');
          this.baleFromDetails.get('bankName').patchValue(res ? res['bankDetails'].length ? res['bankDetails'][0].bankName : '' : '');
          this.baleFromDetails.get('ifscCode').patchValue(res ? res['bankDetails'].length ? res['bankDetails'][0].ifscCode : '' : '');

          this.baleFromDetails.get('address').patchValue(res['address']['address']);
          this.baleFromDetails.get('village').patchValue(res['address']['village']);
          this.baleFromDetails.get('city').patchValue(res['address']['city']);
          this.baleFromDetails.get('district').patchValue(res['address']['district']);
          this.baleFromDetails.get('taluk').patchValue(res['address']['taluk']);
          this.baleFromDetails.get('region').patchValue(res['address']['region']);
          this.baleFromDetails.get('state').patchValue(res['address']['state']);
          this.baleFromDetails.get('pincode').patchValue(res['address']['pincode']);

          this.baleFromDetails.get('kycPANNumber').patchValue(res['kycPANNumber']);
          this.baleFromDetails.get('kycAdhaarNumber').patchValue(res['kycAdhaarNumber']);
          this.baleFromDetails.get('gstNumber').patchValue(res['gstNumber']);
           if(res['name'] === ""){
            this.modalRef = this.modalService.open(this.updateWeaverName)
              this.modalRef.result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
              }, (reason) => {
                this.closeResult = `Dismissed`;
              });
          }
        }
      })
    } else {
      this.baleFromDetails.get('beneficiaryName').patchValue('');
      this.baleFromDetails.get('accountNumber').patchValue('');
      this.baleFromDetails.get('bankName').patchValue('');
      this.baleFromDetails.get('ifscCode').patchValue('');
  
      this.baleFromDetails.get('address').patchValue('');
      this.baleFromDetails.get('village').patchValue('');
      this.baleFromDetails.get('city').patchValue('');
      this.baleFromDetails.get('district').patchValue('');
      this.baleFromDetails.get('taluk').patchValue('');
      this.baleFromDetails.get('region').patchValue('');
      this.baleFromDetails.get('state').patchValue('');
      this.baleFromDetails.get('pincode').patchValue('');
  
      this.baleFromDetails.get('kycPANNumber').patchValue('');
      this.baleFromDetails.get('kycAdhaarNumber').patchValue('');
      this.baleFromDetails.get('gstNumber').patchValue('');
    }
  }

  createNewSpinningMill(spinningCreateForm){
    const params = {
      name: spinningCreateForm.name,
      phone: spinningCreateForm.phone,
      address: {
        address: '',
        city: '',
        taluk: '',
        village: '',
        district: '',
        state: '',
        pincode: '',
        region: '',
        latitude: '',
        longitude: '',
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
    this.api.createSpinningMill(params).then(res => {
      this.modalRef.close();
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

addFarmerName(farmerName){
  const params = {
    name: farmerName.name
  }
  this.ngxLoader.stop();
  this.api.updateWeavers(params, this.selectedSpinningMill).then(res =>{
    this.modalRef.close();
    if(res){
      this.selectedSpinningMill = res['name']+' - '+res['phone'];
      this.SpinningMillList.push(res);
      this.onspinningMillSelection();
      this.spinningMillCreateForm.reset();
      this.snackBar.open('Updated successfully', 'Ok', {
        duration: 3000
      });
    }
  })
}

  async onSubmit(balePoForm) {
    this.getLocation();
    let queryParms = {
      "spinningMill": "/spinningmill/"+ this.selectedSpinningMill,
      "expiry": Date.parse(balePoForm.validTill),
      "creditDays": balePoForm.creditDays,
      "rmRepresentativeName": this.representive?.name,
      "rmRepresentativePhone": this.representive?.phone,
      "cottonType": balePoForm.cottonType,
      "stapleLength": balePoForm.stapleLength,
      "rd": balePoForm.rd,
      "trashContent": balePoForm.trashContent,
      "elong": balePoForm.elong,
      "microniareValue": balePoForm.microniareValue,
      "strength": balePoForm.strength,
      "noOfBales": balePoForm.noOfBales,
      "totalWeight": balePoForm.totalWeight,
      "pricePerCandy": balePoForm.pricePerCandy,
      "noOfCandies": balePoForm.noOfCandies,
      "grossTotal": balePoForm.grossTotal,
      "discountAmount": balePoForm.discountAmount,
      "netPrice": balePoForm.netPrice,
      "poDocUrl": this.balePoPerformOrder,
      "shippingAddress": {
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
      "bankDetails": [
        {
          accountNumber: this.bankForm.bankForm.value.accountNumber.trim(),
          beneficiaryName: this.bankForm.bankForm.value.beneficiaryName,
          ifscCode: this.bankForm.bankForm.value.ifscCode.trim(),
          bankName: this.bankForm.bankForm.value.bankName,
          branchName: this.bankForm.bankForm.value.branchName,


        }
      ]
    }
    if (this.id) {
      this.api.patchBalePerformaById(this.id,queryParms).then(res => {
        this.snackBar.open('Bale Purchase Performa Updated Successfully', 'Ok', {
          duration: 3000
        });
        this.goBack();
      })
    } else {
      this.api.createBalePerforma(queryParms).then(res => {
        this.snackBar.open('Bale Purchase Performa Created Successfully', 'Ok', {
          duration: 3000
        });
        this.goBack();
      })
    }    

    
 
  }

  goBack(){
    this.router.navigate(['/resha-farms/cotton-bale-po'])
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


  calculateDiscountNetAmount(){
    let percDiscountAmount=(this.discount*this.totalAmount)/100
    this.netAmount=(this.totalAmount-percDiscountAmount).toFixed(2);
  }

  showImage(item) {
    this.modelImage = item.imageUrl;
    this.expandImage = true;
  }
  async getAllUsers() {
    this.usersList = [];
    this.ngxLoader.stop();
    this.api.getAllUsersList(this.globalService.cottonBales).then(res => {
      if (res['_embedded']['user'] && res['_embedded']['user'].length) {
        this.usersList = res['_embedded']['user'];
      } else {
        this.usersList = [];
      }
      this._cd.detectChanges();
    });
  }

  getAllCustomerTypes(){
    this.api.getAllCustomerTypes().then(res => {
      this.kycCustomerTypes = res['_embedded']['kyccustomer'];
      this._cd.detectChanges();
    });
  }

 // Validations
 isControlValidForWeavers(controlName: string): boolean {
  const control = this.spinningMillCreateForm.controls[controlName];
  return control.valid && (control.dirty || control.touched);
 }

isControlInvalidForWeavers(controlName: string): boolean {
  const control = this.spinningMillCreateForm.controls[controlName];
  return control.invalid && (control.dirty || control.touched);
}

controlHasErrorForWeavers(validation, controlName): boolean {
  const control = this.spinningMillCreateForm.controls[controlName];
  return control.hasError(validation) && (control.dirty || control.touched);
}

isControlValid(controlName: string): boolean {
  const control = this.addWeaverNameForm.controls[controlName];
  return control.valid && (control.dirty || control.touched);
}

isControlInvalid(controlName: string): boolean {
  const control = this.addWeaverNameForm.controls[controlName];
  return control.invalid && (control.dirty || control.touched);
}

controlHasError(validation, controlName): boolean {
  const control = this.addWeaverNameForm.controls[controlName];
  return control.hasError(validation) && (control.dirty || control.touched);
}

isControlTouched(controlName): boolean {
  const control = this.addWeaverNameForm.controls[controlName];
  return control.dirty || control.touched;
}


    /** Update Name */
    @ViewChild('updateNameHTML')
    updateNameHTML:ElementRef
    updateNameForm:UntypedFormControl = new UntypedFormControl('',[Validators.required,CustomValidator.cannotContainOnlySpace]);
    updateNameAPI(name){
      this.ngxLoader.stop();
      this.api.updateWeavers({name},this.selectedSpinningMill).then((res:any) =>{
        this.modalRef.close();
        if(res){
          this.SpinningMillList = [];
          this.selectedSpinningMill = res['id'];
          this.SpinningMillList.push(res);
          this.onspinningMillSelection()
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
      this.selectedSpinningMill = null
      this.modalRef.close();
    }

  ngOnInit(): void {
  }
  onImageUpload(image){
    this.imageFile = image;
    
    // const {fileType,file,index} =image.target.files[0];
    // this.getDocsS3CatUrl(fileType,file,index);

    // this.getDocsS3CatUrl(fileType,file,index);
    // this.ngxLoader.stop();
    if (image) {
      let index;
      const file = image.target.files[0];
      const reader = new FileReader();
      const fileType = image.target.files[0].type;
      this.getDocsS3CatUrl(fileType,file,index);

      reader.onload = () => {
        this.previewImage = reader.result as string;
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file);
      this.imageUploaded = true;
    }
  }
  
  async calluploaDocsToS3APICate(s3url:String,file,fileNameFromS3:String,index){
    try{
      this._cd.detectChanges()
      await this.api.updateImageToS3Directly(s3url,file).then(res=>{
        this.balePoPerformOrder = fileNameFromS3;
        this.baleFromDetails.get('poDocUrl').patchValue(fileNameFromS3);
        this.snackBar.open('PO upload Successfully', 'Ok', {
          duration: 3000
        });
        this._cd.detectChanges();
        })
    }catch(err){
        
      this.balePoPerformOrder = '';
      this.baleFromDetails.get('poDocUrl').patchValue('');

        this.snackBar.open('Douments upload Failed', 'Ok', {
          duration: 3000
        });
        this._cd.detectChanges()
    }
   }
   
   async getDocsS3CatUrl(fileType,file,index){
     
    try{
      this._cd.detectChanges()
      await this.api.getBalePOS3Url(fileType.split('/')[1]).then((res:S3UrlResponse)=>{        
        this.calluploaDocsToS3APICate(res.targetUrl,file,res.fileName,index);
        
     })
    }catch(err){
      this.balePoPerformOrder = '';
      this.baleFromDetails.get('poDocUrl').patchValue('');

      this.snackBar.open('Document upload Failed', 'Ok', {
        duration: 3000
      });
      
      this._cd.detectChanges()
    }
   
   }

}

export interface S3UrlResponse{
  targetUrl: String
  fileName:String
}