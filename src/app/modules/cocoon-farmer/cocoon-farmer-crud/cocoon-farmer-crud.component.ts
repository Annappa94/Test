import { ChangeDetectorRef, Inject, LOCALE_ID, Component, ElementRef, ViewChild, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { ApiService } from 'src/app/services/api/api.service';
import { BankServiceService } from 'src/app/services/api/bank-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { S3UrlResponse } from 'src/app/model/types/type.model';
import { ToastrService } from 'ngx-toastr';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { BankFormComponent } from '../../shared/bank-form/bank-form.component';
import { AddressPincodeFormComponent } from '../../shared/address-pincode-form/address-pincode-form.component';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';


@Component({
  selector: 'app-cocoon-farmer-crud',
  templateUrl: './cocoon-farmer-crud.component.html',
  styleUrls: ['./cocoon-farmer-crud.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class CocoonFarmerCrudComponent implements OnInit, OnDestroy {

  @ViewChild('address') addressForm : AddressPincodeFormComponent;
  @ViewChild('bank') bankForm : BankFormComponent;
  farmerCreateForm: UntypedFormGroup;
  chawkiCreateForm: UntypedFormGroup;
  centerList;
  documentsList:any;
  SubmittedDocumentsList:any;
  id;
  phoneNumber:any;
  isUserExists=false;
  isOTPSent:boolean;
  isDocUploaded:any;
  isDisable: boolean=true;
  equipmentsList = [
    {val: 'HUMIDIFIER' ,name: 'Humidifier'},
    {val: 'TEMPERATURE \n CONTROLLER' ,name: 'Temperature & Controller'},
    {val: 'FAN' ,name: 'Fan'},
    {val: 'EQUIPMENT' ,name: 'Equipment'},
  ]
delBank;
modalRef;
closeResult;
deleteBankIndex;
cocoonTypeList = [
  {
    displayName : 'Bivoltine Hybrid',
    code: 'BIVOLTINE'
  },
  {
    displayName : 'CB Gold',
    code: 'CBGOLD'
  },
  {
    displayName: 'Tussar',
    code: 'TUSSAR'
  }
];
todayDate:Date = new Date();
harvestdate = new Date();
productTypeList = [ 'Silk', 'Cotton' ];
cottonTypesList = [{name:'BT COTTON',value:'BTCOTTON'},{name:'DCH COTTON',value:"DCHCOTTON"}]
res;
chawkiList:any = [];
csbImages:any=[];
docImages:any=[];
imageUrl:any;
selectedChawki: any;

kycustomerType:any[]=[];
queryParams:any;
@ViewChild('kycFillcontent')
kycFillcontent:ElementRef;
getfarmersList:any;
latitude:any;
longitude:any;
errorMessage:any;
verified:any;
  timerCount: any;
  personaType = 'farmer';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private form: UntypedFormBuilder,
    private api: ApiService,
    private bankService: BankServiceService,
    private _cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private toaster:ToastrService,
  @Inject(LOCALE_ID) private locale: string,
  private ngxLoader : NgxUiLoaderService,


  ) {
    this.isDocUploaded = {};
    this.isDocUploaded.updated = false;
    this.errorMessage = false;
    this.imageUrl = {};
    this.imageUrl.csbFront = "";
    this.imageUrl.csbBack = "";
    this.imageUrl.idFront = "";
    this.imageUrl.idBack = "";

    this.route.queryParams.subscribe(params =>{
      this.queryParams = params;
    });
    this.isOTPSent =false;
    // Check if update
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
      }
    });
    // this.getAllChawkis();
    this.chawkiParams();
    this.getAllCustomerTypes();
    
    this.farmerCreateForm = this.form.group({
      name: new UntypedFormControl('',[Validators.required, CustomValidator.cannotContainOnlySpace, Validators.pattern("^[A-Za-z ]+$")]),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
      farmerOTP:new UntypedFormControl('',[Validators.pattern('[0-9]{4}')]),
      alternatePhone: new UntypedFormControl(''),
      // address: new FormControl(''),
      village: new UntypedFormControl(''),
      district: new UntypedFormControl(''),
      city:new UntypedFormControl(''),
      pincode: new UntypedFormControl(''),
      taluk: new UntypedFormControl(''),
      state: new UntypedFormControl(''),
      region: new UntypedFormControl(''),
      latitude: new UntypedFormControl(''),
      longitude: new UntypedFormControl(''),
      farmArea: new UntypedFormControl(''),
      chaakiDate: new UntypedFormControl(),
      capacity: new UntypedFormControl(''),
      chaakiCenterName: new UntypedFormControl(''),
      chaakiCenterPhone: new UntypedFormControl('',[Validators.pattern('[1-9]{1}[0-9]{9}')]),
      center: new UntypedFormControl('',Validators.required),
      refferedBy: new UntypedFormControl(''),
      farmEquipments: new UntypedFormControl(''),
      cocoonType: new UntypedFormControl(),
      kycPANNumber: new UntypedFormControl(''),
      kycAdhaarNumber: new UntypedFormControl(''),
      bankDetails: new UntypedFormArray([]),
      cottonDetails:new UntypedFormGroup({
        seedUsed:new UntypedFormControl(),
        landSizeInAcres:new UntypedFormControl(),
        cottonType:new UntypedFormControl(),
        sowingTime:new UntypedFormControl(''),
        harvestingTime:new UntypedFormControl(''),
      }),
      idProofForm: new UntypedFormGroup({
        kycDocument: new UntypedFormControl(''),
        verified: new UntypedFormControl(false),
        kycNumber: new UntypedFormControl(''),
        frontImageUrl:new UntypedFormControl(''),
        frontImageTag:new UntypedFormControl(''),
        backImageUrl: new UntypedFormControl(''),
        backImageTag: new UntypedFormControl(''),
        id: new UntypedFormControl(''),

        createdBy: new UntypedFormControl(''),
        createdDate: new UntypedFormControl(''),
        kycEntityNameMatch: new UntypedFormControl(''),
        kycNumberMatch: new UntypedFormControl(''),
        result: new UntypedFormControl(''),
        verificationDate: new UntypedFormControl('')
    
      }),
      cbsProofForm: new UntypedFormGroup({
        kycDocument: new UntypedFormControl(''),
        verified: new UntypedFormControl(false),
        kycNumber: new UntypedFormControl(''),
        frontImageUrl:new UntypedFormControl(''),
        frontImageTag:new UntypedFormControl(''),
        backImageUrl: new UntypedFormControl(''),
        backImageTag: new UntypedFormControl(''),
        id: new UntypedFormControl(''),

        createdBy: new UntypedFormControl(''),
        createdDate: new UntypedFormControl(''),
        kycEntityNameMatch: new UntypedFormControl(''),
        kycNumberMatch: new UntypedFormControl(''),
        result: new UntypedFormControl(''),
        verificationDate: new UntypedFormControl('')
      }),
      chaakiRegion: new UntypedFormControl(''),
      chaakiCity: new UntypedFormControl(''),
      customerType: new UntypedFormControl('1',[Validators.required]),
      productType:new UntypedFormControl('Silk',[Validators.required]),
      frontDoc:[],
      backDoc:[],
      csbFront:[],
      csbBack:[]

      // reEnterbankAccountNumber: new FormControl(''),
    });

    this.getCenters();
    this.getLocation();
    this.verified= false;
    if (this.id) {
      this.ngxLoader.stop();
      this.api.getFarmerById(this.id).then(response => {
        this.verified = response['farmer']['bankDetails'][0] ? response['farmer']['bankDetails'][0].verified: false;
        console.log(this.verified );
        
        if(response['farmer']['customerTypeName']){
         const kycCustType = this.kycCustomerTypes.find(ele=>ele.name == response['farmer']['customerTypeName'])
          this.getAllFarmerKycSubmittedDocs();
          this.farmerCreateForm.get('customerType').patchValue(kycCustType?.id);
          this.getKycDocuments(kycCustType?.id);
        } else {
          this.farmerCreateForm.get('customerType').patchValue('1')
        }
        if (response) {
          this.farmerCreateForm.patchValue(response['farmer']);
          this.farmerCreateForm.get('cottonDetails').get('sowingTime').patchValue( new Date(response['farmer']?.cottonDetails?.sowingTime));
          this.farmerCreateForm.get('cottonDetails').get('harvestingTime').patchValue(new Date(response['farmer']?.cottonDetails?.harvestingTime));
          this.farmerCreateForm.get('center').patchValue(response['centerId'])
          if(response['farmer']['address'] != null){
            this.addressForm.addressForm.get('address').patchValue(response['farmer']['address']['address'])
            this.addressForm.addressForm.get('city').patchValue(response['farmer']['address']['city'])
            this.addressForm.addressForm.get('village').patchValue(response['farmer']['address']['village'])
            this.addressForm.addressForm.get('district').patchValue(response['farmer']['address']['district'])
            this.addressForm.addressForm.get('pincode').patchValue(response['farmer']['address']['pincode'])
            this.addressForm.addressForm.get('state').patchValue(response['farmer']['address']['state'])
            this.addressForm.addressForm.get('taluk').patchValue(response['farmer']['address']['taluk'])
            this.addressForm.addressForm.get('region').patchValue(response['farmer']['address']['region'])
            this.addressForm.addressForm.get('latitude').patchValue(response['farmer']['address']['latitude'])
            this.addressForm.addressForm.get('longitude').patchValue(response['farmer']['address']['longitude'])
          this.selectedChawki = response['farmer']['chaakiCenterName']+ '-'+response['farmer']['chaakiCenterPhone'];
          }


          if(response['farmer']['chaakiDate']) {
            let date;
            date = response['farmer']['chaakiDate'] ? formatDate(response['farmer']['chaakiDate'], 'MM-dd-yyyy', this.locale) : ''
            const moment = _moment;
            this.farmerCreateForm.patchValue({
              chaakiDate: moment(date, "MM/DD/YYYY"),
            });
          }


          if(response['farmer']['bankDetails'] &&  response['farmer']['bankDetails'].length) {
            // for (const bank of response['farmer']['bankDetails']) {
            //   (this.farmerCreateForm.controls['bankDetails'] as FormArray).push(new FormGroup({
            //     beneficiaryName: new FormControl(bank ? bank.beneficiaryName : ''),
            //     bankName: new FormControl(bank ? bank.bankName : ''),
            //     accountNumber: new FormControl(bank ? bank.accountNumber : ''),
            //      ifscCode: new FormControl(bank ? bank.ifscCode : ''),
            //  }))
            // }
            this.bankForm.bankForm.get('beneficiaryName').patchValue(response['farmer']['bankDetails'][0].beneficiaryName)
            this.bankForm.bankForm.get('bankName').patchValue(response['farmer']['bankDetails'][0].bankName)
            this.bankForm.bankForm.get('accountNumber').patchValue(response['farmer']['bankDetails'][0].accountNumber)
            this.bankForm.bankForm.get('ifscCode').patchValue(response['farmer']['bankDetails'][0].ifscCode)
            this.bankForm.bankForm.get('branchName').patchValue(response['farmer']['bankDetails'][0].branchName)
            
            
          } else {
            (this.farmerCreateForm.controls['bankDetails'] as UntypedFormArray).push(new UntypedFormGroup({
              beneficiaryName: new UntypedFormControl(''),
              bankName: new UntypedFormControl(''),
              accountNumber: new UntypedFormControl(''),
               ifscCode: new UntypedFormControl(''),
           }))
          }


        } else {
          // console.log("Response for getFarmerById found to be ", response)
          this.snackBar.open('Failed to find farmer', 'Ok', {
            duration: 3000
          });
        }
      });
    } else {
      (this.farmerCreateForm.controls['bankDetails'] as UntypedFormArray).push(new UntypedFormGroup({
        beneficiaryName: new UntypedFormControl(''),
        bankName: new UntypedFormControl(''),
        accountNumber: new UntypedFormControl(''),
         ifscCode: new UntypedFormControl(''),
     }))
    }
    if(this.router.url?.includes('cotton')){
     this.farmerCreateForm.get('productType').patchValue('Cotton');
    }else{
      this.farmerCreateForm.get('productType').patchValue('Silk');
    }
    
  }

  onBankStatuschange(eventData){
    this.verified = eventData;
  }

  listentoForm(){
    if(this.queryParams && this.queryParams?.redirecto && this.queryParams?.redirecto == 'cocoon-lot-crud'){
      this.farmerCreateForm.valueChanges.subscribe(response=>{
        console.log(response);
        if((response?.cbsProofForm.kycDocument && response?.cbsProofForm.kycNumber && response?.cbsProofForm.frontImageUrl && response?.cbsProofForm.verified) || (response?.idProofForm.kycDocument && response?.idProofForm.kycNumber && response?.idProofForm.frontImageUrl && response?.idProofForm.verified)){
          this.isDocUploaded.updated = true;
        }else{
          this.isDocUploaded.updated = false;
        }
        this._cd.detectChanges();
        console.log(this.isDocUploaded);
      })
    }else{
      this.isDocUploaded.updated = true;
    }
    
  }

  ngOnInit()    { 
    // this.startCountdown(30);
    this.listentoForm();
   }
  ngOnDestroy() { }
  startCountdown(seconds) {
    let counter = seconds;
      
    const interval = setInterval(() => {
      // console.log(counter);
      this.timerCount = counter;
      counter--;
      this._cd.detectChanges();
        
      if (counter < 0 ) {
        this.timerCount = '00';
        clearInterval(interval);
        
      }
    }, 1000);
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

          this.farmerCreateForm.get('latitude').patchValue(this.latitude)
          this.farmerCreateForm.get('longitude').patchValue(this.longitude)
          //console.log(this.latitude, this.longitude);

    }, (error) =>{console.log(error)},
    {
      enableHighAccuracy : true,
      timeout: 5000,
      maximumAge: 0
    }
    )
  }

kycCustomerTypes:any = [];
  getAllCustomerTypes(){
    this.api.getAllCustomerTypes().then(res => {
      this.kycCustomerTypes = res['_embedded']['kyccustomer'];
      this._cd.detectChanges();
    });
  }
  async getCenters() {
    this.ngxLoader.stop();
    this.api.getCocoonProcCenters().then(details => {
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }
  goBack() {
    this.router.navigate(['/resha-farms/farmers-silk']);
  }

  changeSowingTimeEvent(event: MatDatepickerInputEvent<Date>){
    this.farmerCreateForm.get('cottonDetails').get('harvestingTime').patchValue('')
    let harvestdateChange = new Date(event.value);
    //console.log(harvestdateChange.setDate(new Date(harvestdateChange).getDate() + 90));
    this.harvestdate= new Date((harvestdateChange).setDate(new Date(harvestdateChange).getDate() + 90));
  }

  initiateOtp(farmerForm){
    // console.log(farmerForm);
    this.phoneNumber=farmerForm.phone;
    let reqObj = {
      "phone":farmerForm.phone,
      "profile":"FARMER"
    }
    this.api.apiTemporaryOboardFarmer(reqObj).then(res1 => {
      console.log(res1);
      
      if(res1['responseCode']==409){
        this.isUserExists=true;
        this.isOTPSent =false;
        this._cd.detectChanges();
      } else {
        this.api.apiGenerateFarmerOTP(farmerForm.phone).then(res => {

           this.isOTPSent =true;
           this.isUserExists=false;
          this._cd.detectChanges();
          this.startCountdown(30);
          this.farmerCreateForm.controls['phone'].disable();

        });
      }
    },error =>{
      console.log(error);
    })
}

  resendOtp(farmerForm){
    
    this.api.apiResendFarmerOTP(this.phoneNumber).then(res => {
          
          this.isOTPSent =true;
          this.startCountdown(30);
      })
  }

  validateOTP(farmerForm){
    this.errorMessage = false;
    let reqobj = {
        "phone": this.phoneNumber,
        "otp": farmerForm.farmerOTP
      }
    
    this.api.apiValidateFarmerOTP(reqobj).then(res => {
        
        this.api.searchAll(this.phoneNumber).then(res => {
          this.getfarmersList = res;          
          if(this.getfarmersList && this.getfarmersList.length){
            this.id = this.getfarmersList[0].id;
            this.updateFarmerDetails(farmerForm);
            //this.saveFarmerDetails(farmerForm)
          }
        });
        
    }, err => {
      console.log(err);
      if(err.status == '400'){
        this.errorMessage = true;
      }
    })

  }

  updateFarmerDetails(farmerForm){
    const bank = {
      accountNumber: "",
      beneficiaryName: "",
      ifscCode: "",
      bankName: "",
      branchName: "",
    }
    const params = {
      name: farmerForm.name,
      alternatePhone: farmerForm.alternatePhone,
      farmArea: farmerForm.farmArea,
      chaakiDate: farmerForm.chaakiDate ? Date.parse(farmerForm.chaakiDate) : null,
      capacity: farmerForm.capacity,

      chaakiCenterName: farmerForm.chaakiCenterName,
      chaakiCity: farmerForm.chaakiCity,
      chaakiRegion: farmerForm.chaakiRegion,
      chaakiCenterPhone: farmerForm.chaakiCenterPhone,

      refferedBy: farmerForm.refferedBy,
      farmEquipments: farmerForm.farmEquipments ? farmerForm.farmEquipments : [],
      cocoonType: farmerForm.cocoonType ? farmerForm.cocoonType : null,
      address: {
        address: "",
        village: "",
        city: "",
        district: "",
        taluk: "",
        region: "",
        state: "",
        pincode: "",
        latitude: "",
        longitude: "",
      },
      kycPANNumber: farmerForm.kycPANNumber,
      kycAdhaarNumber: farmerForm.kycAdhaarNumber,
      bankDetails: [bank],

      cottonDetails:farmerForm.cottonDetails,
      center: '/center/' + farmerForm.center,
      customerType: farmerForm.customerType? '/kyccustomer/' + farmerForm.customerType : null,
      productType:farmerForm.productType
    };
    params['cottonDetails']=null

    this.api.updateFarmers(params,this.id).then((res:any) => {
      if(this.queryParams && this.queryParams?.redirecto && this.queryParams?.redirecto == 'cocoon-lot-crud'){
        this.router.navigate(['/resha-farms/farmers-silk/crud/' + this.id ],{queryParams:{redirecto:'cocoon-lot-crud'}});
      }else{
        this.router.navigate(['/resha-farms/farmers-silk/crud/' + this.id ]);
      }
      this.snackBar.open('Created farmer successfully', 'Ok', {
        duration: 3000
      });
    })
  }


  saveFarmerDetails(farmerForm) {
    const bank = {
      accountNumber: this.bankForm.bankForm.value.accountNumber.trim(),
      beneficiaryName: this.bankForm.bankForm.value.beneficiaryName,
      ifscCode: this.bankForm.bankForm.value.ifscCode.trim(),
      bankName: this.bankForm.bankForm.value.bankName,
      branchName: this.bankForm.bankForm.value.branchName,
    }
    const params = {
      name: farmerForm.name,
      phone: this.phoneNumber,
      alternatePhone: farmerForm.alternatePhone,
      farmArea: farmerForm.farmArea,
      chaakiDate: farmerForm.chaakiDate ? Date.parse(farmerForm.chaakiDate) : null,
      capacity: farmerForm.capacity,

      chaakiCenterName: farmerForm.chaakiCenterName,
      chaakiCity: farmerForm.chaakiCity,
      chaakiRegion: farmerForm.chaakiRegion,
      chaakiCenterPhone: farmerForm.chaakiCenterPhone,

      refferedBy: farmerForm.refferedBy,
      farmEquipments: farmerForm.farmEquipments ? farmerForm.farmEquipments : [],
      cocoonType: farmerForm.cocoonType ? farmerForm.cocoonType : null,
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
      kycPANNumber: farmerForm.kycPANNumber,
      kycAdhaarNumber: farmerForm.kycAdhaarNumber,
      bankDetails: [bank],

      cottonDetails:farmerForm.cottonDetails,
      center: '/center/' + farmerForm.center,
      customerType: farmerForm.customerType? '/kyccustomer/' + farmerForm.customerType : null,
      productType:farmerForm.productType
    };
    params['cottonDetails']=null

    if (this.id) {      
      if ( this.verified == true) {
        delete params['bankDetails'];
      }
      this.ngxLoader.stop();
      this.api.updateFarmers(params,this.id,).then((res:any) => {
        if (res) {
          // Success Message
          //this.updateKYCDetails();
          // this.router.navigate(['/farmers-silk']);
          // this.snackBar.open('Updated Farmer successfully', 'Ok', {
          //   duration: 3000
          // });
          this.uploadKycDetails();

        } else {
          this.snackBar.open('Failed to update farmer', 'Ok', {
            duration: 3000
          });
        }
      });
    } else {
      this.ngxLoader.stop();
      this.api.farmersOnboarding(params).then((res:any) => {
        if (res) {
          // Success Message
          this.res=res;
          this.router.navigate(['/resha-farms/farmers-silk/crud/' + this.res.id ]);
          this.snackBar.open('Created farmer successfully', 'Ok', {
            duration: 3000
          });
        } else {
          this.snackBar.open('Failed to created farmer', 'Ok', {
            duration: 3000
          });
        }
      });
    }
  }

  addBankAccount() {
    (this.bankForm.bankForm.controls['bankDetails'] as UntypedFormArray).push(new UntypedFormGroup({
      beneficiaryName: new UntypedFormControl(''),
      bankName: new UntypedFormControl(''),
      accountNumber: new UntypedFormControl(''),
       ifscCode: new UntypedFormControl(''),
       branchName: new UntypedFormControl(''),

   }));
   this._cd.detectChanges();
  }

  open(content, index) {
    this.deleteBankIndex = index;
    this.delBank = this.bankForm.bankForm.get('bankDetails')['controls'][index];
    // console.log(this.delBank)
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  deleteBankDetails() {
    this.modalRef.close();
    const control = <UntypedFormArray>this.bankForm.bankForm.controls['bankDetails'];
    control.removeAt(this.deleteBankIndex);
  }

  // Reeler Validations
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

  skipKYC(){
    this.modalService.dismissAll();
    this.router.navigate(['/resha-farms/farmers']);
  }

  chawkiModalRef;
  closeChawkiResult: string;
  async openChawkiModel(content) {
    this.chawkiModalRef = this.modalService.open(content)
    this.chawkiModalRef.result.then((result) => {
      this.closeChawkiResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeChawkiResult = `Dismissed`;
    });
  }

  // getAllChawkis(){
  //   this.api.getAllChawkis().then(res=>{
  //     this.chawkiList = res['_embedded']['chawki']
  //   });
  // }

  getAllChawkis(event) {
    if (event.term.length % 2 == 0) { 
      let searchParams = `((name==*${event.term.replace(/ /gi,"*")}* or phone==*${event.term.replace(/ /gi,"*")}*) and phone!=*DELETED*)`;
      this.api.getChawkiList(searchParams,'createdDate', 'desc', 0,100).then(res => {
        this.chawkiList = res['content'];
        this._cd.detectChanges();
      })
    }
    if (!event.term || event.term.length == 0) {
      this.chawkiList = [];
      this._cd.detectChanges();
    }
  }


  chawkiToChanged(data){
    if(data){
      this.farmerCreateForm.get('chaakiCenterName').patchValue(data['name'] ? data['name'] : '');
      this.farmerCreateForm.get('chaakiCenterPhone').patchValue(data['phone']  ? data['phone']  : '');
      this.farmerCreateForm.get('chaakiRegion').patchValue(( data['address'] && data['address']['region']  )? data['address']['region']  : '');
      this.farmerCreateForm.get('chaakiCity').patchValue((data['address'] && data['address']['city'] )? data['address']['city']  : '');
      this.farmerCreateForm.get('chaakiRegion').clearValidators();
      this.farmerCreateForm.get('chaakiCity').clearValidators();
      this.farmerCreateForm.get('chaakiRegion').updateValueAndValidity();
      this.farmerCreateForm.get('chaakiCity').updateValueAndValidity();
      
    }else{
      this.farmerCreateForm.get('chaakiCenterName').patchValue('');
      this.farmerCreateForm.get('chaakiCenterPhone').patchValue('');
      this.farmerCreateForm.get('chaakiRegion').patchValue('');
      this.farmerCreateForm.get('chaakiCity').patchValue('');
    }
    
  }

  async chawkiParams(){
    this.chawkiCreateForm = this.form.group({
      name: new UntypedFormControl('', Validators.required),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
      nearestRmCenterId: new UntypedFormControl('', [Validators.required]),
      nearestRmCenterName: new UntypedFormControl(''),
      bankDetails: new UntypedFormArray([]),
      address: new UntypedFormControl(''),
      city: new UntypedFormControl(''),
      taluk: new UntypedFormControl(''),
      village: new UntypedFormControl(''),
      district: new UntypedFormControl(''),
      state: new UntypedFormControl(''),
      pincode: new UntypedFormControl(''),
      region: new UntypedFormControl('')
    });
    (this.chawkiCreateForm.controls['bankDetails'] as UntypedFormArray).push(new UntypedFormGroup({
      beneficiaryName: new UntypedFormControl(''),
      bankName: new UntypedFormControl(''),
      accountNumber: new UntypedFormControl(''),
      ifscCode: new UntypedFormControl(''),
    }));
  }


  createChawki(chawkiForm) {
    const params = {
      "name":chawkiForm.name,
      "phone": chawkiForm.phone,
      "alternatePhone":"",
      "nurseryArea":"",
      "equipments":[],
      "refferedBy":"",
      "kycPANNumber":"",
      "kycAdhaarNumber":"",
      "govRegistrationId":"",
      "crcCapacity":"",
      "batchesPerMonth":"",
      "averageSizeOfBatch":"",
      "noOfLabour":"",
      "disinfectionMgmt":"",
      "nameOfEggGrainage":"",
      "sourceOfEggs":"Private",
      "cropFailureHistory":"",
      "rmDiscount":"",
      "nearestRmCenterId": chawkiForm.nearestRmCenterId,
      "nearestRmCenterName": chawkiForm.nearestRmCenterName,
      "chawkiTypes":[
        {"type":"GOLD","price":null},
        {"type":"WHITE","price":null}
      ],
      "name_hi":"",
      "name_kn":"",
      "name_mr":"",
      "name_te":"",
      "name_ta":"",
      "address":{
        "address":chawkiForm.address,
        "city":chawkiForm.city,
        "taluk":chawkiForm.taluk,
        "village":chawkiForm.village,
        "district":chawkiForm.district,
        "state":chawkiForm.state,
        "pincode":chawkiForm.pincode,
        "region":chawkiForm.region,
        "latitude":"",
        "longitude":""
      },
      "bankDetails":{
        "beneficiaryName":"",
        "bankName":"",
        "accountNumber":"",
        "ifscCode":""
      }
    }
    this.ngxLoader.stop();
    this.api.chawkiOnBoarding(params).then(res => {
      this.chawkiModalRef.close();
      if (res) {
        this.selectedChawki = res['name'] + '-' + res['phone'];
        this.chawkiToChanged(res);
        this.chawkiList.unshift(res);
        //this.onFarmerSelection('')
        this.chawkiCreateForm.reset();
        this.snackBar.open('Created chawki successfully', 'Ok', {
          duration: 3000
        });
      }
    });

  }

  onCenterSelect(event) {
    for (let i = 0; i < this.centerList.length; i++) {
      if (this.centerList[i].id == event.target.value) {
        this.chawkiCreateForm.get('nearestRmCenterName').patchValue(this.centerList[i].centerName);
        break;
      }
    }
  }


  isControlValidForChawki(controlName: string): boolean {
    const control = this.chawkiCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForChawki(controlName: string): boolean {
    const control = this.chawkiCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  getKycDocuments(id){
    this.api.getAllDocumentsListByCustomerTypes(id, 'FARMER').then(res => {
        console.log(res);
        this.documentsList = res;
        this._cd.detectChanges();
    })
  }

  getAllFarmerKycSubmittedDocs(){
    this.api.getAllFarmerKycDocList(this.id, 'farmer').then(res => {
        // console.log(res);
        this.SubmittedDocumentsList = res['_embedded']['farmerkyc'];
        this.SubmittedDocumentsList.forEach(element => {
          if(element?.document?.type1 == "identity_proof"){
            this.farmerCreateForm.get('idProofForm.id').patchValue(element['id'] ? element['id'] : '');
            this.farmerCreateForm.get('idProofForm.kycNumber').patchValue(element['kycNumber'] ? element['kycNumber'] : '');
            this.farmerCreateForm.get('idProofForm.kycDocument').patchValue(element['document']['id'] ? element['document']['id'] : '');
            this.farmerCreateForm.get('idProofForm.verified').patchValue(element['verified'] ? element['verified'] : '');

            this.farmerCreateForm.get('idProofForm.createdBy').patchValue(element['createdBy'] ? element['createdBy'] : '');
            this.farmerCreateForm.get('idProofForm.createdDate').patchValue(element['createdDate'] ? element['createdDate'] : '');
            this.farmerCreateForm.get('idProofForm.kycEntityNameMatch').patchValue(element['kycEntityNameMatch'] ? element['kycEntityNameMatch'] : '');
            this.farmerCreateForm.get('idProofForm.kycNumberMatch').patchValue(element['kycNumberMatch'] ? element['kycNumberMatch'] : '');
            this.farmerCreateForm.get('idProofForm.result').patchValue(element['result'] ? element['result'] : '');
            this.farmerCreateForm.get('idProofForm.verificationDate').patchValue(element['verificationDate'] ? element['verificationDate'] : '');

            this.docImages=element['items'] ? element['items'] : [];
            this.farmerCreateForm.get('idProofForm.frontImageTag').patchValue((this.docImages[0] && this.docImages[0]['tag'] )? this.docImages[0]['tag'] : "" );
            this.farmerCreateForm.get('idProofForm.backImageTag').patchValue((this.docImages[1] && this.docImages[1]['tag'] )? this.docImages[0]['tag'] : "" );
            this.farmerCreateForm.get('idProofForm.frontImageUrl').patchValue((this.docImages[0] && this.docImages[0]['url'] )? this.docImages[0]['url'] : "" );
            this.farmerCreateForm.get('idProofForm.backImageUrl').patchValue((this.docImages[1] && this.docImages[1]['url'] )? this.docImages[1]['url'] : "" );
    
            this.imageUrl.idFront = ((this.docImages[0] && this.docImages[0]['url'] )? this.docImages[0]['url'] : "" );
            this.imageUrl.idBack = (this.docImages[1] && this.docImages[1]['url'] )? this.docImages[1]['url'] : "" ;
            // if (this.imageUrl.idFront) {
            //   this.getprotectedUrl(this.imageUrl.idFront);
            // }
            // if (this.imageUrl.idBack) {
            //   this.getprotectedUrl(this.imageUrl.idBack);
            // }
           
          }else if(element?.document?.type1 == "csb_proof"){
            this.farmerCreateForm.get('cbsProofForm.id').patchValue(element['id'] ? element['id'] : '');
            this.farmerCreateForm.get('cbsProofForm.kycNumber').patchValue(element['kycNumber'] ? element['kycNumber'] : '');
            this.farmerCreateForm.get('cbsProofForm.kycDocument').patchValue(element['document']['id'] ? element['document']['id'] : '');
            this.farmerCreateForm.get('cbsProofForm.verified').patchValue(element['verified'] ? element['verified'] : '');

            this.farmerCreateForm.get('cbsProofForm.createdBy').patchValue(element['createdBy'] ? element['createdBy'] : '');
            this.farmerCreateForm.get('cbsProofForm.createdDate').patchValue(element['createdDate'] ? element['createdDate'] : '');
            this.farmerCreateForm.get('cbsProofForm.kycEntityNameMatch').patchValue(element['kycEntityNameMatch'] ? element['kycEntityNameMatch'] : '');
            this.farmerCreateForm.get('cbsProofForm.kycNumberMatch').patchValue(element['kycNumberMatch'] ? element['kycNumberMatch'] : '');
            this.farmerCreateForm.get('cbsProofForm.result').patchValue(element['result'] ? element['result'] : '');
            this.farmerCreateForm.get('cbsProofForm.verificationDate').patchValue(element['verificationDate'] ? element['verificationDate'] : '');

            this.csbImages=element['items'] ? element['items'] : []
            this.farmerCreateForm.get('cbsProofForm.frontImageTag').patchValue((this.csbImages[0] && this.csbImages[0]['tag'] )? this.csbImages[0]['tag'] : "" );
            this.farmerCreateForm.get('cbsProofForm.backImageTag').patchValue((this.csbImages[1] && this.csbImages[1]['tag'] )? this.csbImages[0]['tag'] : "" );
            this.farmerCreateForm.get('cbsProofForm.frontImageUrl').patchValue((this.csbImages[0] && this.csbImages[0]['url'] )? this.csbImages[0]['url'] : "" );
            this.farmerCreateForm.get('cbsProofForm.backImageUrl').patchValue((this.csbImages[1] && this.csbImages[1]['url'] )? this.csbImages[1]['url'] : "" );
            this.imageUrl.csbFront = ((this.csbImages[0] && this.csbImages[0]['url'] )? this.csbImages[0]['url'] : "" );
            this.imageUrl.csbBack = ((this.csbImages[1] && this.csbImages[1]['url'] )? this.csbImages[1]['url'] : "" );
            // if (this.imageUrl.csbFront) {
            //   this.getprotectedUrl(this.imageUrl.csbFront);
            // }
            // if (this.imageUrl.csbBack) {
            //   this.getprotectedUrl(this.imageUrl.csbBack);
            // }
          }
        });
        this._cd.detectChanges();

    })
  }

  onchangeCustomerType(){
    this.getKycDocuments(this.farmerCreateForm.get('customerType').value);
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

  uploadKycDetails(){

    let newPayload = {
      farmerId: parseInt(this.id),
      farmerKYCAudits: []
    }

    if(this.farmerCreateForm.get('idProofForm.kycNumber').value){
      let idObj = {
          "farmer": {
              "id": null
          },
          "verified": this.farmerCreateForm.get('idProofForm.verified').value,
          "kycDocument": {
              "id": this.farmerCreateForm.get('idProofForm.kycDocument').value
          },
          "kycNumber": this.farmerCreateForm.get('idProofForm.kycNumber').value,
          "items":  this.docImages,
      };
      if(this.farmerCreateForm.get('idProofForm.id').value){
        idObj['id'] = this.farmerCreateForm.get('idProofForm.id').value;
        idObj['createdBy']= this.farmerCreateForm.get('idProofForm.createdBy').value,
        idObj['createdDate']= this.farmerCreateForm.get('idProofForm.createdDate').value,
        idObj['kycEntityNameMatch']= this.farmerCreateForm.get('idProofForm.kycEntityNameMatch').value,
        idObj['kycNumberMatch']=this.farmerCreateForm.get('idProofForm.kycNumberMatch').value,
        idObj['result']=this.farmerCreateForm.get('idProofForm.result').value,
        idObj['verificationDate']= this.farmerCreateForm.get('idProofForm.verificationDate').value
      }
      newPayload.farmerKYCAudits.push(idObj);
    }

    if(this.farmerCreateForm.get('cbsProofForm.kycNumber').value){
      let csbObj = {
          "farmer": {
              "id": null
          },
          "verified": this.farmerCreateForm.get('cbsProofForm.verified').value,
          "kycDocument": {
              "id": this.farmerCreateForm.get('cbsProofForm.kycDocument').value
          },
          "kycNumber": this.farmerCreateForm.get('cbsProofForm.kycNumber').value,
          "items":  this.csbImages
      }

      if(this.farmerCreateForm.get('cbsProofForm.id').value){
        csbObj['id'] = this.farmerCreateForm.get('cbsProofForm.id').value;
        csbObj['createdBy']= this.farmerCreateForm.get('cbsProofForm.createdBy').value,
        csbObj['createdDate']= this.farmerCreateForm.get('cbsProofForm.createdDate').value,
        csbObj['kycEntityNameMatch']= this.farmerCreateForm.get('cbsProofForm.kycEntityNameMatch').value,
        csbObj['kycNumberMatch']=this.farmerCreateForm.get('cbsProofForm.kycNumberMatch').value,
        csbObj['result']=this.farmerCreateForm.get('cbsProofForm.result').value,
        csbObj['verificationDate']= this.farmerCreateForm.get('cbsProofForm.verificationDate').value
      }
      newPayload.farmerKYCAudits.push(csbObj);
    }
    
    if(newPayload.farmerKYCAudits.length ){
      this.api.apiSaveFarmerKyc(newPayload).then(ures => {
        if(!this.verified && this.queryParams && this.queryParams?.redirecto && this.queryParams?.redirecto == 'cocoon-lot-crud'){
          this.toaster.error('Please Verify Bank Details', 'Bank Verification', {
            timeOut: 5000
          });
        }else{
          this.redirectoListing();
        }
       
      })
    }else if(this.queryParams && this.queryParams?.redirecto && this.queryParams?.redirecto == 'cocoon-lot-crud' && !newPayload.farmerKYCAudits.length){
      // this.snackBar.open('Upload any one CSB or ID proof', 'Ok', {
      //   duration: 5000
      // });
      this.toaster.error('Upload any one CSB or ID proof', 'ID Verification', {
        timeOut: 5000
      });
    }else if(this.queryParams && this.queryParams?.redirecto && this.queryParams?.redirecto == 'cocoon-lot-crud' && !this.verified){
      this.toaster.error('Please Verify Bank Details', 'Bank Verification', {
        timeOut: 5000
      });
    }else{
      this.redirectoListing();
    }
  }

  updateKYCDetails(){
    let idProofPayload = {
      "verified":true,
      "kycDocument":"/kycdocument/" + this.farmerCreateForm.get('idProofForm.kycDocument').value,
      "kycNumber": this.farmerCreateForm.get('idProofForm.kycNumber').value,
      "items":this.docImages,
      "verificationType":"MANUAL",
      "farmer": "/farmer/" + this.id
    }

    let cbsProofPayload = {
      "verified":true,
      "kycDocument":"/kycdocument/" + this.farmerCreateForm.get('cbsProofForm.kycDocument').value,
      "kycNumber": this.farmerCreateForm.get('cbsProofForm.kycNumber').value,
      "items":this.csbImages,
      "verificationType":"MANUAL",
      "farmer": "/farmer/" + this.id
    }
    if(this.id){
      this.api.updateFarmerKYC(idProofPayload, this.farmerCreateForm.get('idProofForm.id').value, 'farmer').then(res => {
          this.redirectoListing();
      })
    }else{
      if(idProofPayload.kycNumber){
        this.api.createFarmerKYC(idProofPayload,'farmer').then(res => {
            this.redirectoListing();
        })
      }
      
    }

    if(this.farmerCreateForm.get('cbsProofForm.id').value){
      this.api.updateFarmerKYC(cbsProofPayload, this.farmerCreateForm.get('cbsProofForm.id').value, 'farmer').then(res => {
          this.redirectoListing();
      })
    }else{
      if(cbsProofPayload.kycNumber){
        this.api.createFarmerKYC(cbsProofPayload,'farmer').then(res => {
           this.redirectoListing();
        })
      }
     
    }
    this.snackBar.open('Updated Farmer successfully', 'Ok', {
      duration: 3000
    });
   
    
   
  }

  redirectoListing(){
    if(this.queryParams && this.queryParams?.redirecto && this.queryParams?.redirecto == 'cocoon-lot-crud'){
      this.router.navigate(['/resha-farms/cocoon-lot/crud'],{queryParams:{selectedFarmerId:this.id}});
    }else{
      this.router.navigate(['/resha-farms/farmers-silk']);
    }
  }

  onImageUpload(image,index,placeholder:any=false,key) {
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        let previewImage = reader.result as string;
        this.getS3Url(file.type,file,index,placeholder,key);
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file)
      this._cd.detectChanges();
    }
  }

  async getS3Url(fileType,file,index,placeholder,key){
    try{
     
      this._cd.detectChanges()
      await this.api.getKYCPresignedUrl(`kyc_${this.personaType}`,fileType.split('/')[1],this.id,key).then((res:S3UrlResponse)=>{
        
        //this.preImgUrl = res.fileName
        this.calluploadImageToS3API(res.targetUrl,file,res.fileName,index,placeholder);
     })

  //    await this.api.getKYCPresignedUrl(`kyc_${this.personaType}`,fileType.split('/')[1],this.id,key).then((res:S3UrlResponse)=>{
  //     // this.calluploadImageToS3APICate(res.targetUrl,file,res.fileName,index,key,imageIndex);
  //  })

    }catch(err){
      
      this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges()
    }
  }


  async calluploadImageToS3API(s3url:String,file,fileNameFromS3:String,index,placeholder){
    try{
      this._cd.detectChanges()
      await this.api.updateImageToS3Directly(s3url,file).then(res=>{
     
        // if(placeholder){
        //   this.farmerCreateForm.get(placeholder).patchValue(fileNameFromS3);
        // }else{
        //   (this.farmerCreateForm.get('cottonImages') as FormArray).at(index).get("url").patchValue(fileNameFromS3);
        // }
        let params;
        
       


        switch (placeholder){
          case "cbsProofForm.csbFront":
            this.imageUrl.csbFront = fileNameFromS3;
             params = {
              "tag":"front image",
              "url":fileNameFromS3
            }
            this.csbImages.push(params);
            this.farmerCreateForm.get('cbsProofForm.frontImageUrl').patchValue(fileNameFromS3 );
          break;

          case "cbsProofForm.csbBack":
            this.imageUrl.csbBack = fileNameFromS3;
            params = {
              "tag":"back image",
              "url":fileNameFromS3
            }
            this.csbImages.push(params);
            this.farmerCreateForm.get('cbsProofForm.backImageUrl').patchValue(fileNameFromS3);
          break;

          case "idProofForm.frontDoc":
            this.imageUrl.idFront = fileNameFromS3;
            this.farmerCreateForm.get('idProofForm.frontImageUrl').patchValue(fileNameFromS3);  
            params = {
              "tag":"ront image",
              "url":fileNameFromS3
            }  
              this.docImages.push(params);
          break;

          case "idProofForm.backDoc":
            this.imageUrl.idBack = fileNameFromS3;
            this.farmerCreateForm.get('idProofForm.backImageUrl').patchValue(fileNameFromS3);
            params = {
              "tag":"back image",
              "url":fileNameFromS3
            }
              this.docImages.push(params);
          break;

        }
        this._cd.detectChanges();
      })
    }catch(err){
    
        console.log(err);
        this.snackBar.open('Image upload Failed', 'Ok', {
          duration: 3000
        });
        this._cd.detectChanges()
    }
  }


}
