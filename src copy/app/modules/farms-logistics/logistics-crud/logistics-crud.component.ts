import { ChangeDetectorRef, Inject, LOCALE_ID, Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { BankFormComponent } from '../../shared/bank-form/bank-form.component';
import { AddressPincodeFormComponent } from '../../shared/address-pincode-form/address-pincode-form.component';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';



@Component({
  selector: 'app-logistics-crud',
  templateUrl: './logistics-crud.component.html',
  styleUrls: ['./logistics-crud.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class LogisticsCrudComponent implements OnInit {
  @ViewChild('address') addressForm : AddressPincodeFormComponent;
  @ViewChild('bank') bankForm : BankFormComponent;

  id:number;
  driverId:number;
  createDriverForm:UntypedFormGroup;
  createVehicleForm:UntypedFormGroup;
  userTypeChange;
  modalRef;
  closeResult: string;
  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  newDriverList:any[]=[];
  newVehicleList:any[]=[];
  vehiclesArrayObj:any[]=[];
  CONSTANT = CONSTANT;
  editForm:any;
  expiaryDate=new Date()

  formGroup:UntypedFormGroup = new UntypedFormGroup({
    merchantName:new UntypedFormControl([],[Validators.required,CustomValidator.cannotContainOnlySpace, Validators.pattern("^[A-Za-z ]+$")]),
    mobile:new UntypedFormControl([],[Validators.required,Validators.pattern('[1-9]{1}[0-9]{9}')]),
    transporterId:new UntypedFormControl('',Validators.required),
    brandName:new UntypedFormControl(),
    email:new UntypedFormControl(),
    nameOnDl:new UntypedFormControl(),
    fatherName:new UntypedFormControl(),
    DrivingLienseNumber:new UntypedFormControl(),
    DlIssuedDate:new UntypedFormControl(),
    DlExpiryDate:new UntypedFormControl(),
    ginningCertificate:new UntypedFormControl(),
    kycPANNumber:new UntypedFormControl(),
    kycAdhaarNumber:new UntypedFormControl(),
    
    vehicleType:new UntypedFormControl(),
    vehicleNumber:new UntypedFormControl(),

    // address: new FormGroup({
    //   address:new FormControl(),
    //   city: new FormControl(),
    //   taluk: new FormControl(),
    //   village: new FormControl(),
    //   district: new FormControl(),
    //   state: new FormControl(),
    //   pincode: new FormControl(),
    //   region: new FormControl(),
    //   latitude:new FormControl(),
    //   longitude:new FormControl()
    // }),
    //center:new FormControl([],[Validators.required]),

    refferedBy:new UntypedFormControl(''),

    customerType:new UntypedFormControl('INDIVIDUAL'),
    logisticsSettlementTo:new UntypedFormControl(),
    // bankDetails:new FormArray([new FormGroup({
    //   beneficiaryName: new FormControl(''),
    //   bankName: new FormControl(''),
    //   accountNumber: new FormControl(''),
    //   ifscCode: new FormControl(''),
    // })]),

    alternateContactDetails:new UntypedFormGroup({

      name:new UntypedFormControl(''),

      alternateMobile:new UntypedFormControl('',[Validators.pattern('[1-9]{1}[0-9]{9}')]),

      relationship: new UntypedFormControl(''),
    }),
    
    cottonTypes:new UntypedFormControl(),

})

  constructor(private api:ApiService,
    private ngxLoader:NgxUiLoaderService,
    private _cd:ChangeDetectorRef,
    private snackBar:MatSnackBar,
    private router:Router,
    private route:ActivatedRoute,
    private modalService: NgbModal,
    private form: UntypedFormBuilder,
    @Inject(LOCALE_ID) private locale: string,

    ) {
      this.getLocation();
      this.onChangeUserType('INDIVIDUAL');
     }

  ngOnInit(): void {
    const { id } = this.route.snapshot.params;
    this.id = id;
    this.id&&this.getLogisticsDataById();
    this.watchPosition();
    if(this.id){
      this.editForm= true;      
    }
  }
  onChangeUserType(eventValue) {
    this.userTypeChange = eventValue;
    if( this.userTypeChange == 'COMPANY'){
      this.formGroup.get('transporterId').addValidators([Validators.required,Validators.pattern('[A-Za-z0-9]{15}')]);
      this.formGroup.get('transporterId').updateValueAndValidity();
    }else{
      this.formGroup.get('transporterId').clearValidators();
      this.formGroup.get('transporterId').addValidators(Validators.pattern('[A-Za-z0-9]{15}'));
      this.formGroup.get('transporterId').updateValueAndValidity();
    }
  }

  changeSowingTimeEvent(event: MatDatepickerInputEvent<Date>){
    this.formGroup.get('DlExpiryDate').patchValue('')
    let harvestdateChange = new Date(event.value);
    //console.log(harvestdateChange.setDate(new Date(harvestdateChange).getDate() + 90));
    this.expiaryDate= new Date((harvestdateChange).setFullYear(new Date(harvestdateChange).getFullYear() + 5));
  }

  goBack() {
    this.routeTOListingPage();
  }

  saveLogisticDetails(value:any){
    let companyReqObj = {};
    if(value.customerType && value.customerType == "INDIVIDUAL"){
      let vehicleObj = {
        "vehicleType":value?.vehicleType,
        "vehicleNumber":value?.vehicleNumber,
        "logisticsUrlDetails": []
      }
      this.vehiclesArrayObj = []
      companyReqObj = {
        "type":value.customerType,
        "referredBy":value.refferedBy,
        "merchantName":value.merchantName,
        "brandName":value.brandName,
        "mobile":value.mobile,
        "transporterId" : value.transporterId ? value.transporterId : null,
        "status":"ACTIVE",
        "email":value.email,
        "gstin": "",
        
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
        
        bankDetails: [{
          accountNumber: this.bankForm.bankForm.value.accountNumber,
          beneficiaryName: this.bankForm.bankForm.value.beneficiaryName,
          ifscCode: this.bankForm.bankForm.value.ifscCode,
          bankName: this.bankForm.bankForm.value.bankName,
          branchName: this.bankForm.bankForm.value.branchName,
        }],
        
        "alternateContactDetails" : {
          "name":value?.alternateContactDetails?.name,
          "alternateMobile":value?.alternateContactDetails?.alternateMobile,
          "relationship":value?.alternateContactDetails?.relationship
        },
        "drivers":[{
          "name":value.merchantName,
          "mobile":value.mobile,
          "referredBy": value.refferedBy,
          "logisticsPartnerStatus":"ACTIVE",
          "logisticsSettlementTo":"SELF",
          "alternateContactDetails" : [{
            "name":value?.alternateContactDetails?.name,
            "alternateMobile":value?.alternateContactDetails?.alternateMobile,
            "relationship":value?.alternateContactDetails?.relationship
          }],
          "drivingLicense":{
            "drivingLicenseNumber":value?.DrivingLienseNumber,
            "nameOnDrivingLicense":value?.nameOnDl,
            "dateOfIssue":value?.DlIssuedDate,
            "expiryDate":value?.DlExpiryDate,
            "fatherName":value?.fatherName
          },
          
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
          
          bankDetails: [{
            accountNumber: this.bankForm.bankForm.value.accountNumber,
            beneficiaryName: this.bankForm.bankForm.value.beneficiaryName,
            ifscCode: this.bankForm.bankForm.value.ifscCode,
            bankName: this.bankForm.bankForm.value.bankName,
            branchName: this.bankForm.bankForm.value.branchName,
          }],
        }],
        "vehicles": []

      }
      if(!((value.vehicleType =="" || value.vehicleType == null) || (value.vehicleNumber == "" || value.vehicleNumber== null))) {
        this.api.createLogisticsCompanyVehicle(vehicleObj).then(res=>{
          this.newVehicleList.push(res);
          
          this.newVehicleList.forEach((obj, index) => {
            this.vehiclesArrayObj.push({
              "id" : obj.id
            })
          })   
          companyReqObj['vehicles'] = this.vehiclesArrayObj
          if(this.id){
            //this.updateLogistics(this.buildPayload(companyReqObj));
            this.updateCompany(value);
           }else{
             this.savePost(this.buildPayload(companyReqObj));
           }        
        });
      }else{
        if(this.id){
          //this.updateLogistics(this.buildPayload(companyReqObj));
          this.updateCompany(value);
         }else{
           this.savePost(this.buildPayload(companyReqObj));
         }
      }
    }else{
      let driviresObj = []
      this.newDriverList.forEach((obj, index) => {
        driviresObj.push({
          "id" : obj.id
        })
      })
      companyReqObj = {
        "type":value.customerType,
        "referredBy":value.refferedBy,
        "merchantName":value.merchantName,
        "brandName":value.brandName,
        "mobile":value.mobile,
        "transporterId" : value.transporterId ? value.transporterId : null,
        "status":"ACTIVE",
        "email":value.email,
        "gstin": "",
        
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
        
        bankDetails: [{
          accountNumber: this.bankForm.bankForm.value.accountNumber,
          beneficiaryName: this.bankForm.bankForm.value.beneficiaryName,
          ifscCode: this.bankForm.bankForm.value.ifscCode,
          bankName: this.bankForm.bankForm.value.bankName,
          branchName: this.bankForm.bankForm.value.branchName,
        }],
        "alternateContactDetails" : {
          "name":value?.alternateContactDetails?.name,
          "alternateMobile":value?.alternateContactDetails?.alternateMobile,
          "relationship":value?.alternateContactDetails?.relationship
        },
        "drivers":driviresObj,
        "vehicles":[]

      }
      if(this.id){
        //this.updateLogistics(this.buildPayload(companyReqObj));
        this.updateCompany(value);
       }else{
         this.savePost(this.buildPayload(companyReqObj));
       }
    }
   
  }

  updateCompany(value){
    let companyReqObj = {};
    let driverObj = {}
    companyReqObj = {
      "type":value.customerType,
      "referredBy":value.refferedBy,
      "merchantName":value.merchantName,
      "brandName":value.brandName,
      "mobile":value.mobile,
      "transporterId" : value.transporterId,
      "status":"ACTIVE",
      "email":value.email,
      "gstin": "",
      // "address": {
      //     "address": value?.address?.address,
      //     "city": value?.address?.city,
      //     "taluk": value?.address?.taluk,
      //     "village": value?.address?.village,
      //     "district": value?.address?.district,
      //     "state": value?.address?.state,
      //     "pincode": value?.address?.pincode,
      //     "region": value?.address?.region,
      //     "latitude": null,
      //     "longitude": null
      // },
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
      // "bankDetails": [{
      //   "beneficiaryName": value?.bankDetails[0]?.beneficiaryName,
      //   "bankName": value?.bankDetails[0]?.bankName,
      //   "accountNumber": value?.bankDetails[0]?.accountNumber,
      //   "ifscCode": value?.bankDetails[0]?.ifscCode
      // }
      // ],
      bankDetails: [{
        accountNumber: this.bankForm.bankForm.value.accountNumber,
        beneficiaryName: this.bankForm.bankForm.value.beneficiaryName,
        ifscCode: this.bankForm.bankForm.value.ifscCode,
        bankName: this.bankForm.bankForm.value.bankName,
        branchName: this.bankForm.bankForm.value.branchName,
      }],
      "alternateContactDetails" : {
        "name":value?.alternateContactDetails?.name,
        "alternateMobile":value?.alternateContactDetails?.alternateMobile,
        "relationship":value?.alternateContactDetails?.relationship
      }

    }
    this.api.updateLogisticsCompany(this.id, companyReqObj).then(res=>{
      if(value.customerType && value.customerType == "INDIVIDUAL"){
        driverObj = {
          "name":value.name,
          "mobile":value.mobile,
          "referredBy": value.refferedBy,
          "logisticsPartnerStatus":"ACTIVE",
          "logisticsSettlementTo":"SELF",
          "alternateContactDetails" : [{
            "name":value?.alternateContactDetails?.name,
            "alternateMobile":value?.alternateContactDetails?.alternateMobile,
            "relationship":value?.alternateContactDetails?.relationship
          }],
          "drivingLicense":{
            "drivingLicenseNumber":value?.DrivingLienseNumber,
            "nameOnDrivingLicense":value?.nameOnDl,
            "dateOfIssue":value?.DlIssuedDate,
            "expiryDate":value?.DlExpiryDate,
            "fatherName":value?.fatherName
          },
          // "address": {
          //   "address": value?.address?.address,
          //   "city": value?.address?.city,
          //   "taluk": value?.address?.taluk,
          //   "village": value?.address?.village,
          //   "district": value?.address?.district,
          //   "state": value?.address?.state,
          //   "pincode": value?.address?.pincode,
          //   "region": value?.address?.region,
          //   "latitude": value?.address.latitude,
          //   "longitude": value?.address.longitude
          // },
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
          // "bankDetails": [{
          //   "beneficiaryName": value?.bankDetails[0]?.beneficiaryName,
          //   "bankName": value?.bankDetails[0]?.bankName,
          //   "accountNumber": value?.bankDetails[0]?.accountNumber,
          //   "ifscCode": value?.bankDetails[0]?.ifscCode
          // }],
          bankDetails: [{
            accountNumber: this.bankForm.bankForm.value.accountNumber,
            beneficiaryName: this.bankForm.bankForm.value.beneficiaryName,
            ifscCode: this.bankForm.bankForm.value.ifscCode,
            bankName: this.bankForm.bankForm.value.bankName,
            branchName: this.bankForm.bankForm.value.branchName,
          }],
        }

        this.api.updateLogisticsCompanyDriver(this.driverId, driverObj).then( res =>{
          this.routeTOListingPage();
          this.snackBar.open('Company Updated Successfully', 'Ok', {
            duration: 3000
          });
        });
      }else{
        this.routeTOListingPage();
        this.snackBar.open('Company Updated Successfully', 'Ok', {
          duration: 3000
        });
      }



    });




  }

  buildPayload(data){
    let payload = {...data};
    return payload;
  }

  savePost(payload){
    this.api.createLogisticsCompany(payload).then(res=>{
      this.routeTOListingPage();
      this.snackBar.open('Company Created Successfully', 'Ok', {
        duration: 3000
      });
    });
  }

  getLogisticsDataById(){
    this.api.getLogisticsDetailsById(this.id).then((res:any)=>{
      this.formGroup.patchValue(res);
      this.formGroup.get('customerType').patchValue(res['type'])
      this.userTypeChange = res['type'];
      this.addressForm.addressForm.patchValue(res.address);
      this.bankForm.bankForm.patchValue(res['bankDetails'][0]);
      this.onChangeUserType(res['type']);
      if(res['type'] == "INDIVIDUAL"){
        this.api.getLogisticsDriverById(this.id).then((res:any) => {
          let driver = res;
          this.driverId = driver?._embedded?.driver[0].id;
          this.formGroup.get('nameOnDl').patchValue(( driver?._embedded?.driver[0]['drivingLicense'] && driver?._embedded?.driver[0]['drivingLicense']['nameOnDrivingLicense']) ? driver?._embedded?.driver[0]['drivingLicense']['nameOnDrivingLicense']  : '');
          this.formGroup.get('fatherName').patchValue((driver?._embedded?.driver[0]['drivingLicense'] && driver?._embedded?.driver[0]['drivingLicense']['fatherName']) ? driver?._embedded?.driver[0]['drivingLicense']['fatherName']:'');
          this.formGroup.get('DrivingLienseNumber').patchValue((driver?._embedded?.driver[0]['drivingLicense'] && driver?._embedded?.driver[0]['drivingLicense']['drivingLicenseNumber'])? driver?._embedded?.driver[0]['drivingLicense']['drivingLicenseNumber']: '');
          // this.formGroup.get('DlIssuedDate').patchValue(driver?._embedded?.driver[0]['drivingLicense']['dateOfIssue']);
          // this.formGroup.get('DlExpiryDate').patchValue(driver?._embedded?.driver[0]['drivingLicense']['expiryDate']);
          if(driver?._embedded?.driver[0]['drivingLicense'] && driver?._embedded?.driver[0]['drivingLicense']['dateOfIssue']) {
            let date;
            date = driver?._embedded?.driver[0]['drivingLicense']['dateOfIssue'] ? formatDate(driver?._embedded?.driver[0]['drivingLicense']['dateOfIssue'], 'MM-dd-yyyy', this.locale) : ''
            const moment = _moment;
            this.formGroup.patchValue({
              DlIssuedDate: moment(date, "MM/DD/YYYY"),
            });
          }

          if(driver?._embedded?.driver[0]['drivingLicense'] && driver?._embedded?.driver[0]['drivingLicense']['expiryDate']) {
            let date;
            date = driver?._embedded?.driver[0]['drivingLicense']['expiryDate'] ? formatDate(driver?._embedded?.driver[0]['drivingLicense']['expiryDate'], 'MM-dd-yyyy', this.locale) : ''
            const moment = _moment;
            this.formGroup.patchValue({
              DlExpiryDate: moment(date, "MM/DD/YYYY"),
            });
          }

        })
      }
       // if(res['customerTypeName']){
       //  const kycCustType = this.kycCustomerTypes.find(ele=>ele.name == res['customerTypeName'])
       //   this.formGroup.get('customerType').patchValue(kycCustType?.id);;
       // }
      // this.formGroup.get("center").patchValue(res.centerId);
    })
  }


  updateLogistics(payload){
    this.api.patchLogistics(this.id,payload).then(res=>{
      this.routeTOListingPage();
      this.snackBar.open('Logistics Updated Successfully', 'Ok', {
        duration: 3000
      });
    });
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

  latitude;
  longitude;
  watchPosition(){
    let id = navigator.geolocation.watchPosition((position) =>{
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          if(position.coords.latitude === this.latitude){
            navigator.geolocation.clearWatch(id);
          }

          this.addressForm.addressForm.get('address.latitude').patchValue(this.latitude)
          this.addressForm.addressForm.get('address.longitude').patchValue(this.longitude)
          //console.log(this.latitude, this.longitude);

    }, (error) =>{console.log(error)},
    {
      enableHighAccuracy : true,
      timeout: 5000,
      maximumAge: 0
    }
    )
  }



  onImageUpload(image) {
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        let previewImage = reader.result as string;
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
      await this.api.getKYCPresignedUrl(`kyc_farmer`,fileType.split('/')[1],122,"kyc").then((res:any)=>{
        this.calluploadImageToS3APICate(res.targetUrl,file,res.fileName);
        this.imageLoading = false;
      })
    }catch(err){
      this.formGroup.get('ginningCertificate').patchValue('')
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
      await this.api.updateImageToS3Directly(s3url,file).then((res:any)=>{
        this.formGroup.get('ginningCertificate').patchValue(fileNameFromS3)
        this.imageLoading = false;
        this._cd.detectChanges();
        });
    }catch(err){
      this.imageLoading = false;
      this.formGroup.get('ginningCertificate').patchValue('')
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
  const { targetUrl } : any = await this.api.getPresignedUrlForViewImage(imgUrl);
  this.modelImageUrl = targetUrl;
  this._cd.detectChanges()
}

    // Reeler Validations
    isControlValid(controlName: string): boolean {
      const control = this.formGroup.controls[controlName];
      return control.valid && (control.dirty || control.touched);
    }

    isControlInvalid(controlName: string): boolean {
      const control = this.formGroup.controls[controlName];
      return control.invalid && (control.dirty || control.touched);
    }

    controlHasError(validation, controlName): boolean {
      const control = this.formGroup.controls[controlName];
      return control.hasError(validation) && (control.dirty || control.touched);
    }

    isControlTouched(controlName): boolean {
      const control = this.formGroup.controls[controlName];
      return control.dirty || control.touched;
    }

    routeTOListingPage(){
      if(this.router.url.includes('yarn-logistics')){
        this.router.navigate(['/yarn-logistics']);
        return;
      }
      this.router.navigate(['/resha-farms/farms-logistics']);

    }
}
