// import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { AddressPincodeFormComponent } from 'src/app/modules/shared/address-pincode-form/address-pincode-form.component';
import { BankFormComponent } from 'src/app/modules/shared/bank-form/bank-form.component';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';

@Component({
  selector: 'app-tussar-reeler-crud',
  templateUrl: './tussar-reeler-crud.component.html',
  styleUrls: ['./tussar-reeler-crud.component.scss']
})
export class TussarReelerCrudComponent implements OnInit {

  @ViewChild('address') addressForm : AddressPincodeFormComponent;
  @ViewChild('bank') bankForm : BankFormComponent;

  reelerCreateForm: UntypedFormGroup;
  centerList;
  id;
  kycCustomerTypes:any = [];
  minDate
  maxDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private form: UntypedFormBuilder,
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private ngxLoader : NgxUiLoaderService,
  ) {
    this.getAllCustomerTypes();
    // Check if update
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
      }
    });
    
    this.reelerCreateForm = this.form.group({
      name: ['', [Validators.required,CustomValidator.cannotContainOnlySpace,Validators.pattern("^[A-Za-z ]+$")]],
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
      customerType:[''],
      dateOfBirth:[''],
      firstName:[''],
      lastName:[''],
      address: [''],
      city: [''],
      village: [''],
      district: [''],
      pincode: [''],
      taluk: [''],
      state: [''],
      region: [''],
      cocoonCapacity: [''],
      yarnCapacity: [''],
      pickupWastage: [''],
      latitude: new UntypedFormControl(''),
      longitude: new UntypedFormControl(''),
      center: ['', Validators.required],
      kycPANNumber: new UntypedFormControl(''),
      kycAdhaarNumber: new UntypedFormControl(''),
      csbId: new UntypedFormControl(''),
      gstNumber: new UntypedFormControl(''),
      beneficiaryName: new UntypedFormControl(''),
      bankName: new UntypedFormControl(''),
      accountNumber: new UntypedFormControl(''),
      ifscCode: new UntypedFormControl(''),
      refferedBy: new UntypedFormControl(''),
      advance: new UntypedFormControl(''),
    });
    this.getCenters();  
    this.getLocation();
    if (this.id) {
      this.ngxLoader.stop();
      this.api.getAllCustomerTypes().then(res => {
        this.kycCustomerTypes = res['_embedded']['kyccustomer'];
        this.api.getReelerById(this.id).then(response => {
          if (response) {
            if(response['reeler']['customerTypeName']){
              const kycCustType = this.kycCustomerTypes.find(ele=>ele.name == response['reeler']['customerTypeName'])
               this.reelerCreateForm.get('customerType').patchValue(kycCustType?.id)
               // this.customerTypeName = response['customerTypeName']
             } else{
              this.reelerCreateForm.get('customerType').patchValue('')
             }
            this.reelerCreateForm.patchValue(response['reeler']);
            this.reelerCreateForm.get('dateOfBirth').patchValue(response['reeler']?.dateOfBirth?new Date(response['reeler']?.dateOfBirth):null);
            this.reelerCreateForm.get("advance").patchValue(response['reeler']["availableAdvance"]);
            this.reelerCreateForm.get('center').patchValue(response['centerId'])
            //this.reelerCreateForm.get('customerType').patchValue(response['customerType'])
            if(response['reeler'] && response['reeler']['address']) {
              this.addressForm.addressForm.get('address').patchValue(response['reeler']['address']['address'])
              this.addressForm.addressForm.get('city').patchValue(response['reeler']['address']['city'])
              this.addressForm.addressForm.get('village').patchValue(response['reeler']['address']['village'])
              this.addressForm.addressForm.get('district').patchValue(response['reeler']['address']['district'])
              this.addressForm.addressForm.get('pincode').patchValue(response['reeler']['address']['pincode'])
              this.addressForm.addressForm.get('state').patchValue(response['reeler']['address']['state'])
              this.addressForm.addressForm.get('taluk').patchValue(response['reeler']['address']['taluk'])
              this.addressForm.addressForm.get('latitude').patchValue(response['reeler']['address']['latitude'])
              this.addressForm.addressForm.get('longitude').patchValue(response['reeler']['address']['longitude'])
              this.addressForm.addressForm.get('region').patchValue(response['reeler']['address']['region'])
              

            }
            if(response['reeler']['bankDetails'] && response['reeler']['bankDetails'].length) {
              this.bankForm.bankForm.get('beneficiaryName').patchValue(response['reeler']['bankDetails'][0].beneficiaryName)
              this.bankForm.bankForm.get('bankName').patchValue(response['reeler']['bankDetails'][0].bankName)
              this.bankForm.bankForm.get('accountNumber').patchValue(response['reeler']['bankDetails'][0].accountNumber)
              this.bankForm.bankForm.get('ifscCode').patchValue(response['reeler']['bankDetails'][0].ifscCode)
              this.bankForm.bankForm.get('branchName').patchValue(response['reeler']['bankDetails'][0].branchName)

            }

          } else {
            console.log("Response for getReelerById found to be ", response)
            this.snackBar.open('Failed to find reeler', 'Ok', {
              duration: 3000
            });
          }
        });
        this._cd.detectChanges();
      });
    }
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
latitude:any;
longitude:any;
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
    
          this.reelerCreateForm.get('latitude').patchValue(this.latitude)
          this.reelerCreateForm.get('longitude').patchValue(this.longitude)
          //console.log(this.latitude, this.longitude);
          
    }, (error) =>{console.log(error)},
    {
      enableHighAccuracy : true,
      timeout: 5000,
      maximumAge: 0
    }
    )
  }
  async getCenters() {
    this.ngxLoader.stop();
    this.api.getTussarProcCenters().then(details => {
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
    
  }
  goBack() {
    this.router.navigate(['/resha-farms/tussar/tussar-reeler-list']);
  }

  saveReelerDetails(reelerForm) {
    const bank = {
      accountNumber: this.bankForm.bankForm.value.accountNumber.trim(),
      beneficiaryName: this.bankForm.bankForm.value.beneficiaryName,
      ifscCode: this.bankForm.bankForm.value.ifscCode.trim(),
      bankName: this.bankForm.bankForm.value.bankName,
      branchName: this.bankForm.bankForm.value.branchName,
    }
    const params = {
      name: reelerForm.name,
      phone: reelerForm.phone,
      availableAdvance:reelerForm.advance,
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
      customerType: reelerForm.customerType?'/kyccustomer/' + reelerForm.customerType:null,
      // chaakiDate: farmerForm.chaakiDate ? Date.parse(farmerForm.chaakiDate) : null,
      dateOfBirth: reelerForm.dateOfBirth? Date.parse(reelerForm.dateOfBirth) : null,
      firstName: reelerForm.firstName,
      lastName:reelerForm.lastName,
      cocoonCapacity: + reelerForm.cocoonCapacity,
      yarnCapacity: + reelerForm.yarnCapacity,
      pickupWastage: reelerForm.pickupWastage,
      center: '/center/' + reelerForm.center,
      kycPANNumber: reelerForm.kycPANNumber,
      kycAdhaarNumber: reelerForm.kycAdhaarNumber,
      csbId: reelerForm.csbId,
      gstNumber: reelerForm.gstNumber,
      bankDetails : [bank],
      refferedBy: reelerForm.refferedBy,
      productType:'Tussar',
    };

    if (this.id) {
      this.ngxLoader.stop();
      this.api.putReeler(this.id, params).then(res => {
        if (res) {
          // Success Message
          this.router.navigate(['/resha-farms/tussar/tussar-reeler-list']);
          this.snackBar.open('Updated reeler successfully', 'Ok', {
            duration: 3000
          });
        } else {
          this.snackBar.open('Failed to update reeler', 'Ok', {
            duration: 3000
          });
        }
      });
    } else {
      this.ngxLoader.stop();
      this.api.postReeler(params).then(res => {
        if (res) {
          // Success Message
          this.router.navigate(['/resha-farms/tussar/tussar-reeler-list']);
          this.snackBar.open('Created reeler successfully', 'Ok', {
            duration: 3000
          });
        } else {
          this.snackBar.open('Failed to created reeler', 'Ok', {
            duration: 3000
          });
        }
      });
    }
  }

  getAllCustomerTypes(){
    this.api.getAllCustomerTypes().then(res => {
      this.kycCustomerTypes = res['_embedded']['kyccustomer'];
      this._cd.detectChanges();
    });
  }

  // Reeler Validations
  isControlValidForReeler(controlName: string): boolean {
    const control = this.reelerCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.reelerCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.reelerCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedForReeler(controlName): boolean {
    const control = this.reelerCreateForm.controls[controlName];
    return control.dirty || control.touched;
  }
}



  // constructor() { }

  // ngOnInit(): void {
  // }


