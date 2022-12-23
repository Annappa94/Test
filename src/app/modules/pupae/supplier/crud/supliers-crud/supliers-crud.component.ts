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
import { AddressPincodeFormComponent } from 'src/app/modules/shared/address-pincode-form/address-pincode-form.component';
import { BankFormComponent } from 'src/app/modules/shared/bank-form/bank-form.component';
import { CustomValidator } from 'src/app/modules/shared/custom-validator/custom.validator';

@Component({
  selector: 'app-supliers-crud',
  templateUrl: './supliers-crud.component.html',
  styleUrls: ['./supliers-crud.component.scss']
})
export class SupliersCrudComponent {
  @ViewChild('address') addressForm : AddressPincodeFormComponent;
  @ViewChild('bank') bankForm : BankFormComponent;
  farmerCreateForm: UntypedFormGroup;
    centerList;
    id;
    res;
    kycustomerType:any[]=[];
    @ViewChild('kycFillcontent')
    kycFillcontent:ElementRef;
    latitude:any;
    longitude:any;
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
  ) { 
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
        // address: new FormControl(''),
        // village: new FormControl(''),
        // district: new FormControl(''),
        // city:new FormControl(''),
        // pincode: new FormControl(''),
        // taluk: new FormControl(''),
        // state: new FormControl(''),
        // region: new FormControl(''),
        // latitude: new FormControl(''),
        // longitude: new FormControl(''),
        center: new UntypedFormControl('',[Validators.required]),
        kycPANNumber: new UntypedFormControl(''),
        kycAdhaarNumber: new UntypedFormControl(''),
        bankDetails: new UntypedFormArray([]),
        customerType: new UntypedFormControl('')

        
        // reEnterbankAccountNumber: new FormControl(''),
      });
      this.getCenters();
      this.getLocation();
      if (this.id) {
        this.ngxLoader.stop();
        this.api.getPupaeSupplierById(this.id).then(response => {
          //console.log(response);
          if(response['customerTypeName']){
           const kycCustType = this.kycCustomerTypes.find(ele=>ele.name == response['customerTypeName'])
            this.farmerCreateForm.get('customerType').patchValue(kycCustType?.id)
          } else {
            this.farmerCreateForm.get('customerType').patchValue('')
          }
          if (response) {
            this.farmerCreateForm.patchValue(response);
            this.farmerCreateForm.get('center').patchValue(response['center'])
            if(response['address'] != null){
              this.addressForm.addressForm.get('address').patchValue(response['address']['address'])
              this.addressForm.addressForm.get('city').patchValue(response['address']['city'])
              this.addressForm.addressForm.get('village').patchValue(response['address']['village'])
              this.addressForm.addressForm.get('district').patchValue(response['address']['district'])
              this.addressForm.addressForm.get('pincode').patchValue(response['address']['pincode'])
              this.addressForm.addressForm.get('state').patchValue(response['address']['state'])
              this.addressForm.addressForm.get('taluk').patchValue(response['address']['taluk'])
              this.addressForm.addressForm.get('region').patchValue(response['address']['region'])
              this.addressForm.addressForm.get('latitude').patchValue(response['address']['latitude'])
              this.addressForm.addressForm.get('longitude').patchValue(response['address']['longitude'])
            }
            

            if(response['bankDetails'] &&  response['bankDetails'].length) {
              // for (const bank of response['bankDetails']) {
              //   (this.farmerCreateForm.controls['bankDetails'] as FormArray).push(new FormGroup({
              //     beneficiaryName: new FormControl(bank ? bank.beneficiaryName : ''),
              //     bankName: new FormControl(bank ? bank.bankName : ''),
              //     accountNumber: new FormControl(bank ? bank.accountNumber : ''),
              //      ifscCode: new FormControl(bank ? bank.ifscCode : ''),
              //  }))
              // }
              this.bankForm.bankForm.get('beneficiaryName').patchValue(response['bankDetails'][0].beneficiaryName)
              this.bankForm.bankForm.get('bankName').patchValue(response['bankDetails'][0].bankName)
              this.bankForm.bankForm.get('accountNumber').patchValue(response['bankDetails'][0].accountNumber)
              this.bankForm.bankForm.get('ifscCode').patchValue(response['bankDetails'][0].ifscCode)
              this.bankForm.bankForm.get('branchName').patchValue(response['bankDetails'][0].branchName)
            } else {
              (this.farmerCreateForm.controls['bankDetails'] as UntypedFormArray).push(new UntypedFormGroup({
                beneficiaryName: new UntypedFormControl(''),
                bankName: new UntypedFormControl(''),
                accountNumber: new UntypedFormControl(''),
                 ifscCode: new UntypedFormControl(''),
             }))
            }


          } else {
            console.log("Response found to be ", response)
            this.snackBar.open('Failed to find', 'Ok', {
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
      this.api.getPupaeProcCenters().then(details => {
        if (details) {
          this.centerList = details['_embedded']['center'];
        }
        this._cd.detectChanges();
  
      }, err => {
        console.log(err);
      });
    }
    goBack() {
      this.router.navigate(['/resha-farms/rm-pupae-suppliers']);
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
        //alternatePhone: farmerForm.alternatePhone,
        
        
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
        
        center: farmerForm.center,
        customerType: farmerForm.customerType? '/kyccustomer/' + farmerForm.customerType : null
      };

      if (this.id) {
        this.ngxLoader.stop();
        this.api.updatePupaeSuppliers(params,this.id,).then(res => {
          if (res) {
            // Success Message
            this.router.navigate(['/resha-farms/rm-pupae-suppliers']);
            this.snackBar.open('Updated successfully', 'Ok', {
              duration: 3000
            });
          } else {
            this.snackBar.open('Failed to update', 'Ok', {
              duration: 3000
            });
          }
        });
      } else {
        this.ngxLoader.stop();
        this.api.pupaeSupplierOnboarding(params).then(res => {
          if (res) {
            // Success Message
            this.res=res;
            //this.modalService.open(this.kycFillcontent);
            this.router.navigate(['/resha-farms/rm-pupae-suppliers']);
            this.snackBar.open('Created successfully', 'Ok', {
              duration: 3000
            });
          } else {
            this.snackBar.open('Failed to created', 'Ok', {
              duration: 3000
            });
          }
        });
      }
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
}
