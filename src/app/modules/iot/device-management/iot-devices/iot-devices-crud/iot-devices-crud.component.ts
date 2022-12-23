import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AllDevices, Device } from 'src/app/model/Iot/iotDevice.model';
import { ApiService } from 'src/app/services/api/api.service';
import * as _moment from 'moment';
import { GlobalService } from 'src/app/services/global/global.service';
import { FollowUpComponent } from 'src/app/modules/shared/dialog-models/follow-up/follow-up.component';
import { SearchService } from 'src/app/services/api/search.service';
import { CustomValidator } from 'src/app/modules/shared/custom-validator/custom.validator';


@Component({
  selector: 'app-iot-devices-crud',
  templateUrl: './iot-devices-crud.component.html',
  styleUrls: ['./iot-devices-crud.component.scss']
})
export class IotDevicesCrudComponent implements OnInit {
  subscriptionPlanForm: UntypedFormGroup;
  farmerCreateForm: UntypedFormGroup;

  formErrors = {
    "name":'',
    "tenure"  :'',
    "depositAmount" : '',
    "farmer" : ''

  };
  cocoonTypeList = [
    {
      displayName: 'Bivoltine Hybrid',
      code: 'BIVOLTINE'
    },
    {
      displayName: 'CB Gold',
      code: 'CBGOLD'
    }
  ];
  // Form Error Object
  validationMessages = {
   "name": {
      'required':'Please enter Name',
    },
    "farmer": {
      'required':'Please select Farmer',
    }
  };
  subPlan: any;
  subPlanId: any;
  farmerList: any;
  serialIdList: any;

  agronomistList = [];
  selectedFarmer:any;

  selectedDeviceSerialId:any;
  serialrList: any;

  selectedDevice: any;
  createdFarmerId: string;
  isOTPSent: boolean;
  centerList: any;
  getfarmersList: any;

  getDeviceSerailIdList: Object;

  updateFarmerDetails: any;
  id: any;
  farmersList: any;
  selectedAgronomistId: any;

 
  PlansInitForm() {
    // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.subscriptionPlanForm = this.form.group({
     farmer:['',[Validators.required]],
     agronomist:[''],
     deviceType  : ['',[Validators.required]],
     deviceId  : ['', [Validators.required]],
     plan:[''],
     tenure  :[],
     depositAmount : [],
     stateSelection:['SAME'],
     cgst:[],
     igst:[],
     sgst:[],
     totalpayble:[],
     subsAmount:[],
 
    });
 
 
    this.subscriptionPlanForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }
 
  // Reactive form Error Detection
  onValueChanged(data?: any) {
    if (!this.subscriptionPlanForm) { return; }
    const form = this.subscriptionPlanForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          let msg = messages[key] ? messages[key] : '';
          this.formErrors[field] += msg + ' ';
        }
      }
 
    }
 
  }
  onFarmerChange(){
    this.subscriptionPlanForm.get('farmer').patchValue(this.selectedFarmer?.id);
  }
 


  onSubmit() {
   if(!this.subscriptionPlanForm.valid){
     console.log("Form Is not Valid-------->");
     console.log(this.formErrors);
     if (!this.subscriptionPlanForm) { return; }
     const form = this. subscriptionPlanForm;
     for (const field in this.formErrors) {
       // clear previous error message (if any)
       this.formErrors[field] = '';
       const control = form.get(field);
       if (control && !control.valid) {
         const messages = this.validationMessages[field];
         for (const key in control.errors) {
           this.formErrors[field] += messages[key] + ' ';
         }
       }
     }
   }
    if(this.subscriptionPlanForm.valid){
      this.crateDeviceSubscription();
    }
 
  }


//  FormInit(){
//     this.subscriptionPlanForm = this.form.group({
//       // agronomist: new FormControl('', Validators.required),
//       agroName:new FormControl('', Validators.required),
//       agroPhone:new FormControl(''),
//       deviceCode: new FormControl(''),
//       farmerName: new FormControl(''),
//       farmerPhone: new FormControl(''),
//       lastModifiedBy: new FormControl(''),
//       plotCode: new FormControl(''),
//       plotName: new FormControl(''),
//     })
//   }
  constructor(
    private route: ActivatedRoute,
    private form:UntypedFormBuilder,
    private api:ApiService,
    private modalService:NgbModal,
    private _cd: ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private snackBar:MatSnackBar,
    private router:Router,
    private activatedRouter:ActivatedRoute,
    private global:GlobalService,
    private apiSearch:SearchService,

  ) {
    
    this.subPlanId = this.route.snapshot.params.id;
    this.isOTPSent = false;
    this.farmerList = [];
  }

  ngOnInit(): void {
    this.farmerParams();
    this.getAllCustomerTypes();
    this.getCenters();
    this.PlansInitForm();
    this.getAgronomistList();
    this.getSubscriptionPlan();

  }

  getAgronomistList(){
    this.api.getAllUsersList('Agronomist').then(res=>{
      this.agronomistList = res['_embedded']['user'];      
    })
  }

  modalRef;
  closeResult: string;
  async open(content) {
    this.createdFarmerId = "";
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  async farmerParams() {

    this.farmerCreateForm = this.form.group({
      name: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace, Validators.pattern("^[A-Za-z ]+$")]),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
      center: new UntypedFormControl('', [Validators.required]),
      cocoonType: new UntypedFormControl('', [Validators.required]),
      mobileOTP: new UntypedFormControl(''),
      customerType: new UntypedFormControl('1')
    });
   
  }

  initiateOtp(farmerForm){
    console.log(farmerForm);
    let reqObj = {
      "phone":farmerForm.phone,
      "profile":"FARMER"
    }
    this.api.apiTemporaryOboardFarmer(reqObj).then(res => {
      this.api.apiGenerateFarmerOTP(farmerForm.phone).then(res => {
          console.log(res);
          this.isOTPSent =true;
          this._cd.detectChanges();
      })
    })
}

resendOtp(farmerForm){
  console.log(farmerForm);
  this.api.apiResendFarmerOTP(farmerForm.phone).then(res => {
        console.log(res);
        this.isOTPSent =true;
    })
}

validateOTP(farmerForm){
  let reqobj = {
      "phone": farmerForm.phone,
      "otp": farmerForm.mobileOTP
    }
  
  this.api.apiValidateFarmerOTP(reqobj).then(res => {
      console.log(res);
       
      this.api.searchAll(farmerForm.phone).then(res => {
        this.farmersList = res;
        if(this.farmersList && this.farmersList?.length){
          this.id = this.farmersList[0].id;
          this.updateFarmer(farmerForm);
          //this.saveFarmerDetails(farmerForm)
        }
      });
  })

}


updateFarmer(farmerForm) {
    const params = {
      name: farmerForm.name,
      phone: farmerForm.phone,
      alternatePhone: '',
      farmArea: '',
      chaakiDate: Date.parse(new Date().toString()),
      capacity: '',
      chaakiCenterName: '',
      chaakiCenterPhone: '',
      refferedBy: '',
      farmEquipments: [],
      cocoonType: farmerForm.cocoonType,
      address: {
        address: '',
        city: '',
        taluk: '',
        village: '',
        district: '',
        state: '',
        pincode: '',
        region: ''
      },
      kycPANNumber: '',
      kycAdhaarNumber: '',
      bankDetails: farmerForm.bankDetails,

      center: '/center/' + farmerForm.center
    }
    this.ngxLoader.stop();
    this.api.updateFarmers(params,this.id)
    this.api.updateFarmers(params,this.id).then(res => {
      this.modalRef.close();
      if (res) {
        this.selectedFarmer = res;
        this.createdFarmerId = res['id'];
        this.farmerList.push(res);
       this.farmerCreateForm.reset();
        this.snackBar.open('Created farmer successfully', 'Ok', {
          duration: 3000
        });
      }
      this._cd.detectChanges();
    }, err => {
      console.log(err);
      if(err.status == '409'){
        this.isOTPSent =false;
      }
    });

  }

  getFarmersList(event) {
    if (event.term.length % 2 == 0) { //name==*${event.term.replace(/ /gi,"*")}* or ( removed as per Deepak request)
      let searchParams = `((phone==*${event.term.replace(/ /gi,"*")}*) and productType=='Silk')`;
      this.api.searchAllFarmers(0, 50, 'createdDate', 'desc', searchParams).then(res => {
        this.farmerList = res['content'].filter(data=>!(data?.phone.includes('__DELETED')) );
        this._cd.detectChanges();
      })
    }
    if (!event.term || event.term.length == 0) {
      this.farmerList = [];
      this._cd.detectChanges();
    }
  }

  onAgronomistSelection(event){
    console.log(event);
    
    this.selectedAgronomistId = event;
  }

  getSubscriptionPlan(){
      this.api.getSubsciptionPlan( this.subPlanId).then(res => {
        this.subPlan = res;
        this.subscriptionPlanForm.get('plan').patchValue(this.subPlan?.name);
        this.subscriptionPlanForm.get('deviceType').patchValue(this.subPlan?.deviceTypeCode);
        this.subscriptionPlanForm.get('tenure').patchValue(this.subPlan?.tenure);
        this.subscriptionPlanForm.get('depositAmount').patchValue(this.subPlan?.depositAmount);
        //this.subscriptionPlanForm.get('subsAmount').patchValue(this.subPlan?.recurringAmount);
        this.subscriptionPlanForm.get('totalpayble').patchValue(this.subPlan?.depositAmount);

        //this.getDevice(this.subPlan?.deviceTypeCode);
        this.onStateSelectionChange();
        this._cd.detectChanges();
      })
  }

  onchangeDeviceSerialId(event){
    console.log(event);
    this.subscriptionPlanForm.get('deviceId').patchValue(event?.deviceSerialId);

    
  }

  getDevice(deviceTypeCode){
    this.apiSearch.getAllDevicesData(false ,'(deviceTypeCode == '+ deviceTypeCode +' and status =in= AVAILABLE and health=in=NORMAL)').then(res=>{
      this.selectedDevice = res['content'][0];
      if(this.selectedDevice){
        this.subscriptionPlanForm.get('deviceId').patchValue(this.selectedDevice?.deviceSerialId);
      }else{
        
      }
      this.onStateSelectionChange();
      

    })
  }

  onStateSelectionChange(){
    let subRate = this.subPlan?.recurringAmount ? this.subPlan?.recurringAmount : 0 ;
    let actualSubAmount = 1.18 * parseInt(subRate)
    if(this.subscriptionPlanForm.get('stateSelection').value == 'SAME'){
        let cgst = 0.09 * parseInt(subRate);
        let sgst = 0.09 * parseInt(subRate);
        this.subscriptionPlanForm.get('cgst').patchValue(cgst.toFixed(2));
        this.subscriptionPlanForm.get('sgst').patchValue(sgst.toFixed(2));
        this.subscriptionPlanForm.get('igst').patchValue(0);
    }else{
      let igst = 0.18 * parseInt(subRate);
      this.subscriptionPlanForm.get('cgst').patchValue(0);
      this.subscriptionPlanForm.get('sgst').patchValue(0);
      this.subscriptionPlanForm.get('igst').patchValue(igst.toFixed(2));
    }
    this.subscriptionPlanForm.get('subsAmount').patchValue(actualSubAmount.toFixed(2));
  }

  crateDeviceSubscription(){
      let reqObj = {
        "farmerId": this.selectedFarmer?.id,
        "deviceId":  this.selectedDeviceSerialId?.id,
        "agronomistId" : parseInt(this.subscriptionPlanForm.get('agronomist').value),
        "subscriptionPlanId": this.subPlan?.id ? this.subPlan?.id : "",
        "serviceType":this.subPlan?.serviceType,
      }

      this.api.createDeviceSubscription(reqObj).then(res => {
        this.router.navigate(['/resha-farms/device-management/iot-subscription']);
      })
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

  kycCustomerTypes:any = [];
  getAllCustomerTypes(){
    this.api.getAllCustomerTypes().then(res => {
      this.kycCustomerTypes = res['_embedded']['kyccustomer'];
      this._cd.detectChanges();
    });
  }

  async getCenters() {
    //this.ngxLoader.stop();
    this.api.getCentersList().then(details => {
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }

  getDeviceSerialId(event) {
      let searchParams = `((deviceSerialId==*${event.term.replace(/ /gi,"*")}*) and status =in= AVAILABLE and deviceTypeCode==${this.subscriptionPlanForm.value.deviceType})`;
      this.api.searchAllDeviceSerialId(0, 50, 'createdDate', 'desc', searchParams).then(res => {
        this.serialIdList = res['content'].filter(data=>!(data?.deviceSerialId.includes('__DELETED')) );
        this._cd.detectChanges();
      })
    if (!event.term || event.term.length == 0) {
      this.serialIdList = [];
      this._cd.detectChanges();
    }
  }
}
