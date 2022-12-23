import { ChangeDetectorRef, Inject, LOCALE_ID, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { ApiService } from 'src/app/services/api/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { BankFormComponent } from 'src/app/modules/shared/bank-form/bank-form.component';
import { AddressPincodeFormComponent } from 'src/app/modules/shared/address-pincode-form/address-pincode-form.component';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator } from 'src/app/modules/shared/custom-validator/custom.validator';

@Component({
    selector: 'app-farmer-crud',
    templateUrl: './farmer-crud.html',
    styleUrls: ['./farmer-crud.component.scss'],
    providers: [
      { provide: NgbDateAdapter, useClass: CustomAdapter },
      { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
    ]
  })

  export class FarmerCRUDComponent {
    @ViewChild(AddressPincodeFormComponent,{static:true} ) addressForm : AddressPincodeFormComponent;
    @ViewChild(BankFormComponent,{static:true} ) bankForm : BankFormComponent;

    farmerCreateForm: UntypedFormGroup;
    centerList;
    id;
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
      displayName : 'Bivoltine Seed',
      code: 'SEEDCOCOON'
    },
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
kycustomerType:any[]=[];
@ViewChild('kycFillcontent')
kycFillcontent:ElementRef;
latitude:any;
longitude:any;
queryParams:any;

  verified: any;
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private form: UntypedFormBuilder,
      private api: ApiService,
      private _cd: ChangeDetectorRef,
      private snackBar: MatSnackBar,
      private modalService: NgbModal,
    @Inject(LOCALE_ID) private locale: string,
    private ngxLoader : NgxUiLoaderService,
    private toaster:ToastrService,


    ) {

      this.route.queryParams.subscribe(params =>{
        this.queryParams = params;
      });

      // Check if update
      this.route.params.subscribe((params: Params) => {
        if (params['id']) {
          this.id = params['id'];
        }
      });

      this.getAllCustomerTypes();
      this.farmerCreateForm = this.form.group({
        name: new UntypedFormControl('',[Validators.required, CustomValidator.cannotContainOnlySpace, Validators.pattern("^[A-Za-z ]+$")]),
        phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
        alternatePhone: new UntypedFormControl(''),
        address: new UntypedFormControl(''),
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
        center: new UntypedFormControl('',),
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
        chaakiRegion: new UntypedFormControl(''),
        chaakiCity: new UntypedFormControl(''),
        customerType: new UntypedFormControl(''),
        productType:new UntypedFormControl([],[Validators.required])
        // reEnterbankAccountNumber: new FormControl(''),
      });
      this.getCenters();
      this.getLocation();
      this.verified = false;
      if (this.id) {
        this.ngxLoader.stop();
        this.api.getFarmerById(this.id).then(response => {
          this.verified = response['farmer']['bankDetails'][0] ? response['farmer']['bankDetails'][0].verified: false;
          if(response['farmer']['customerTypeName']){
            
            
           const kycCustType = this.kycCustomerTypes.find(ele=>ele.name == response['farmer']['customerTypeName'])
            this.farmerCreateForm.get('customerType').patchValue(kycCustType?.id)
          } else {
            this.farmerCreateForm.get('customerType').patchValue('')
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
              this.bankForm.bankForm.get('beneficiaryName').patchValue(response['farmer']['bankDetails'][0].beneficiaryName)
              this.bankForm.bankForm.get('bankName').patchValue(response['farmer']['bankDetails'][0].bankName)
              this.bankForm.bankForm.get('accountNumber').patchValue(response['farmer']['bankDetails'][0].accountNumber)
              this.bankForm.bankForm.get('ifscCode').patchValue(response['farmer']['bankDetails'][0].ifscCode)
              this.bankForm.bankForm.get('branchName').patchValue(response['farmer']['bankDetails'][0].branchName)
            } else {
              (this.farmerCreateForm.controls['bankDetails'] as UntypedFormArray)?.push(new UntypedFormGroup({
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
      this.api.getCottonProcCenters().then(details => {
        if (details) {
          this.centerList = details['_embedded']['center'];
        }
        this._cd.detectChanges();

      }, err => {
        console.log(err);
      });
    }
    goBack() {
      if(this.router.url?.includes('cotton')){
        this.router.navigate(['/resha-farms/cotton-farmers']);
      }else{
        this.router.navigate(['/resha-farms/farmers']);
      }
    }

    changeSowingTimeEvent(event: MatDatepickerInputEvent<Date>){
      this.farmerCreateForm.get('cottonDetails').get('harvestingTime').patchValue('')
      let harvestdateChange = new Date(event.value);
      //console.log(harvestdateChange.setDate(new Date(harvestdateChange).getDate() + 90));
      this.harvestdate= new Date((harvestdateChange).setDate(new Date(harvestdateChange).getDate() + 90));
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
        phone: farmerForm.phone,
        alternatePhone: farmerForm.alternatePhone,
        farmArea: farmerForm.farmArea,
        chaakiDate: farmerForm.chaakiDate ? Date.parse(farmerForm.chaakiDate) : null,
        capacity: farmerForm.capacity,
        bankDetails : [bank],

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
        

        cottonDetails:farmerForm.cottonDetails,
        center: '/center/' + farmerForm.center,
        customerType: farmerForm.customerType? '/kyccustomer/' + farmerForm.customerType : null,
        productType:farmerForm.productType
      };
      if(params['productType'] == 'Cotton'){
        /** if product type is cotton  make chawki information  null*/
        params['chaakiCenterName'] = null;
        params['chaakiCenterName'] = null;
        params['chaakiRegion'] = null;
        params['chaakiCity']=null,
        params['chaakiCenterPhone'] = null;
        params['chaakiCenterName'] = null;
        params['farmArea'] = null;
        params['chaakiDate'] = null;
        params['capacity'] = null;
        params['farmEquipments'] = [];
        params['cocoonType'] = null;
        params['cottonDetails']['sowingTime'] = farmerForm?.cottonDetails?.sowingTime?Date.parse(farmerForm?.cottonDetails?.sowingTime) : null;
        params['cottonDetails']['harvestingTime'] = farmerForm?.cottonDetails?.sowingTime?Date.parse(farmerForm?.cottonDetails?.harvestingTime) : null;
      }else if (params['productType'] == 'Silk'){
        params['cottonDetails']=null
      }

      if (this.id) {
        this.ngxLoader.stop();
        this.api.updateFarmers(params,this.id,).then((res:any) => {
          if (res) {
            if(!this.verified && this.queryParams && this.queryParams?.redirecto && this.queryParams?.redirecto == 'cotton-crud'){
              this.toaster.error('Please Verify Bank Details', 'Bank Verification', {
                timeOut: 5000
              });
            } else if (this.verified && this.queryParams && this.queryParams?.redirecto && this.queryParams?.redirecto == 'cotton-crud') {
              this.router.navigate(['/resha-farms/cottonlot/crud'],{queryParams:{selectedFarmerId:this.id}});
            }else {
                // Success Message
            if(res?.productType == 'Cotton'){
              this.router.navigate(['/resha-farms/cotton-farmers']);
            }else{
              this.router.navigate(['/resha-farms/farmers']);
            }
            this.snackBar.open('Updated Farmer successfully', 'Ok', {
              duration: 3000
            });
            }
          
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
            if(res?.productType == 'Cotton'){
              this.router.navigate(['/resha-farms/cotton-farmers']);
            }else{
              this.router.navigate(['/resha-farms/farmers']);
            }
            //this.modalService.open(this.kycFillcontent);
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
    onBankStatuschange(eventData){
      this.verified = eventData;
    }

    addBankAccount() {
      (this.farmerCreateForm.controls['bankDetails'] as UntypedFormArray).push(new UntypedFormGroup({
        beneficiaryName: new UntypedFormControl(''),
        bankName: new UntypedFormControl(''),
        accountNumber: new UntypedFormControl(''),
         ifscCode: new UntypedFormControl(''),
     }));
     this._cd.detectChanges();
    }

    open(content, index) {
      this.deleteBankIndex = index;
      this.delBank = this.farmerCreateForm.get('bankDetails')['controls'][index];
      console.log(this.delBank)
      this.modalRef = this.modalService.open(content)
      this.modalRef.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed`;
      });
    }

    deleteBankDetails() {
      this.modalRef.close();
      const control = <UntypedFormArray>this.farmerCreateForm.controls['bankDetails'];
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

  }
