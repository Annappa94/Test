import { ChangeDetectorRef, Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { BankFormComponent } from 'src/app/modules/shared/bank-form/bank-form.component';
import { AddressPincodeFormComponent } from 'src/app/modules/shared/address-pincode-form/address-pincode-form.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-spinning-mills-crud',
  templateUrl: './spinning-mills-crud.component.html',
  styleUrls: ['./spinning-mills-crud.component.scss']
})
export class SpinningMillsCrudComponent implements OnInit {
  @ViewChild(AddressPincodeFormComponent) addressForm: AddressPincodeFormComponent;
  @ViewChild(BankFormComponent) bankForm: BankFormComponent;

  spinningCreateForm: UntypedFormGroup;
  modalRef: any;
  deleteBankIndex: number;
  kycCustomerTypes: any = [];
  id: any;
  centerList;
  delBank;
  closeResult;
  isGSTSent: any;
  PinsliceFromGSTAdds: any;

  gstkycVerified: boolean;

  cottonTypesList = [{ name: 'BT COTTON', value: 'BTCOTTON' }, { name: 'DCH COTTON', value: "DCHCOTTON" }]

  yarnTypesList = [{ name: 'Single Yarn', value: 'SINGLEYARN' }, { name: 'Plied Yarn', value: "PLIEDYARN" }]

  res;
  kycustomerType: any[] = [];
  @ViewChild('kycFillcontent')
  kycFillcontent: ElementRef;
  latitude: any;
  longitude: any;
  selectedCustomerType: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private form: UntypedFormBuilder,
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    @Inject(LOCALE_ID) private locale: string,
    private ngxLoader: NgxUiLoaderService,
    private utils: UtilsService,
    private toaster:ToastrService,
    ) {
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
      }
    });
    this.gstkycVerified = false;
    this.getAllCustomerTypes();
    this.spinningCreateForm = this.form.group({
      name: new UntypedFormControl(''),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
      gstNumber: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace, Validators.pattern("^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$")]),
      address: new UntypedFormControl(''),
      village: new UntypedFormControl(''),
      district: new UntypedFormControl(''),
      city: new UntypedFormControl(''),
      pincode: new UntypedFormControl(''),
      taluk: new UntypedFormControl(''),
      state: new UntypedFormControl(''),
      region: new UntypedFormControl(''),
      latitude: new UntypedFormControl(''),
      longitude: new UntypedFormControl(''),
      farmArea: new UntypedFormControl(''),
      kycPANNumber: new UntypedFormControl(''),
      kycAdhaarNumber: new UntypedFormControl(''),
      bankDetails: new UntypedFormArray([]),
      customerType: new UntypedFormControl(''),
      center: new UntypedFormControl('', [Validators.required]),


      //------------------------------------------------------//
      principalPlaceBusiness: new UntypedFormControl(''),
      additionalPlaceBusiness: new UntypedFormControl(''),
      jurisdictionState: new UntypedFormControl(''),
      businessConstitution: new UntypedFormControl(''),
      dateRegisterd: new UntypedFormControl(''),
      taxpayerType: new UntypedFormControl(''),
      gstinstatus: new UntypedFormControl(''),
      cancelationDate: new UntypedFormControl(''),
      lastVerified: new UntypedFormControl(''),
      email: new UntypedFormControl(''),


      //------------------------------------------------------//
      baleDetails: new UntypedFormGroup({
        landSize: new UntypedFormControl(),
        consumptionCapacity: new UntypedFormControl(),
        cottonType: new UntypedFormControl([]),
        yarnType: new UntypedFormControl([]),
        productionCapacity: new UntypedFormControl(''),
      }),
    });
    this.getCenters();
    this.getLocation();
    if (this.id) {
      this.ngxLoader.stop();
      this.api.getSpinningMillById(this.id).then(response => {
        console.log('dsfdsffds', response);

        this.PinsliceFromGSTAdds = response?.['gstNumberProfileDetails'][0]['principalPlaceOfBusiness'];
        if (response) {
          this.kycCustomerTypes.forEach(element => {
            if (response['customerTypeName'] == element.name) {
              console.log(element);
              this.selectedCustomerType = element.id;
              this._cd.detectChanges();
            }
          })
          this.spinningCreateForm.patchValue(response);
          this.spinningCreateForm.get('name').patchValue(response['name'])
          this.spinningCreateForm.get('phone').patchValue(response['phone'])
          this.spinningCreateForm.get('gstNumber').patchValue(response['gstNumber'])

          this.spinningCreateForm.get('name')?.patchValue(response['gstNumberProfileDetails'][0]['gstnLegalName'])
          this.spinningCreateForm.get('email')?.patchValue(response['gstNumberProfileDetails'][0]['gstnEmail'])
          this.spinningCreateForm.get('principalPlaceBusiness')?.patchValue(response['gstNumberProfileDetails'][0]['principalPlaceOfBusiness'])
          this.spinningCreateForm.get('additionalPlaceBusiness')?.patchValue(response['gstNumberProfileDetails'][0]['additionalPlaceOfBusiness'])
          this.spinningCreateForm.get('jurisdictionState')?.patchValue(response['gstNumberProfileDetails'][0]['stateOfJurisdiction'])
          this.spinningCreateForm.get('businessConstitution')?.patchValue(response['gstNumberProfileDetails'][0]['businessConstitution'])
          this.spinningCreateForm.get('dateRegisterd')?.patchValue(response['gstNumberProfileDetails'][0]['registrationDate'])
          this.spinningCreateForm.get('taxpayerType')?.patchValue(response['gstNumberProfileDetails'][0]['taxPayerType'])
          this.spinningCreateForm.get('gstinstatus')?.patchValue(response['gstNumberProfileDetails'][0]['gstnStatus'])
          this.spinningCreateForm.get('cancelationDate')?.patchValue(response['gstNumberProfileDetails'][0]['cancellationDate'])
          this.spinningCreateForm.get('lastVerified')?.patchValue(this.utils.getDisplayDate(response['gstNumberProfileDetails'][0]['lastVerifiedAt']))
          this.spinningCreateForm.get('customerType').patchValue(this.selectedCustomerType)
          this.spinningCreateForm.get('baleDetails').get('landSize').patchValue(response['landSize'])
          this.spinningCreateForm.get('baleDetails').get('consumptionCapacity').patchValue(response['consumptionCapacity'])
          this.spinningCreateForm.get('baleDetails').get('productionCapacity').patchValue(response['productionCapacity'])
          this.spinningCreateForm.get('baleDetails').get('yarnType').patchValue(response['yarnTypes'])
          this.spinningCreateForm.get('baleDetails').get('cottonType').patchValue(response['cottonBaleType'])
          this.spinningCreateForm.get('center').patchValue(response['centerId'])

          this.gstkycVerified = response['kycVerified']

          if (response['address'] != null) {
            this.addressForm?.addressForm.get('address').patchValue(response['address']['address'])
            // this.addressForm?.addressForm.get('address').patchValue(this.PinsliceFromGSTAdds)
            this.addressForm?.addressForm.get('city').patchValue(response['address']['city'])
            this.addressForm?.addressForm.get('village').patchValue(response['address']['village'])
            this.addressForm?.addressForm.get('district').patchValue(response['address']['district'])
            this.addressForm.addressForm.get('pincode').patchValue(response['address']['pincode'])
            // this.addressForm?.addressForm.get('pincode').patchValue(this.PinsliceFromGSTAdds.substr(this.PinsliceFromGSTAdds.length - 6))
            this.addressForm?.addressForm.get('state').patchValue(response['address']['state'])
            this.addressForm?.addressForm.get('taluk').patchValue(response['address']['taluk'])
            this.addressForm?.addressForm.get('region').patchValue(response['address']['region'])
            this.addressForm?.addressForm.get('latitude').patchValue(response['address']['latitude'])
            this.addressForm?.addressForm.get('longitude').patchValue(response['address']['longitude'])
          }
          if (response['bankDetails'] && response['bankDetails'].length > 0) {
            this.bankForm?.bankForm.get('beneficiaryName').patchValue(response['bankDetails'][0].beneficiaryName)
            this.bankForm?.bankForm.get('bankName').patchValue(response['bankDetails'][0].bankName)
            this.bankForm?.bankForm.get('accountNumber').patchValue(response['bankDetails'][0].accountNumber)
            this.bankForm?.bankForm.get('ifscCode').patchValue(response['bankDetails'][0].ifscCode)
            this.bankForm?.bankForm.get('branchName').patchValue(response['bankDetails'][0].branchName)

          } else {
            (this.spinningCreateForm.controls['bankDetails'] as UntypedFormArray).push(new UntypedFormGroup({
              beneficiaryName: new UntypedFormControl(''),
              bankName: new UntypedFormControl(''),
              accountNumber: new UntypedFormControl(''),
              ifscCode: new UntypedFormControl(''),
            }))
          }

        } else {
          this.snackBar.open('Failed to find Spinning Mill', 'Ok', {
            duration: 3000
          });
        }
      });
    } else {
      (this.spinningCreateForm.controls['bankDetails'] as UntypedFormArray).push(new UntypedFormGroup({
        beneficiaryName: new UntypedFormControl(''),
        bankName: new UntypedFormControl(''),
        accountNumber: new UntypedFormControl(''),
        ifscCode: new UntypedFormControl(''),
      }))
    }
  }

  ngOnInit(): void {
    // const { id } = this.route.snapshot.params;
    // this.id = id;
    // this.id&&this.getSpinningMillsById();
  }
  isControlValidForSpinning(controlName: string): boolean {
    const control = this.spinningCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForSpinning(controlName: string): boolean {
    const control = this.spinningCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForSpinning(validation, controlName): boolean {
    const control = this.spinningCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedForSpinning(controlName): boolean {
    const control = this.spinningCreateForm.controls[controlName];
    return control.dirty || control.touched;
  }
  skipKYC() {
    this.modalService.dismissAll();
    this.router.navigate(['/resha-farms/farmers']);
  }

  addBankAccount() {
    (this.spinningCreateForm.controls['bankDetails'] as UntypedFormArray).push(new UntypedFormGroup({
      beneficiaryName: new UntypedFormControl(''),
      bankName: new UntypedFormControl(''),
      accountNumber: new UntypedFormControl(''),
      ifscCode: new UntypedFormControl(''),
    }));
    this._cd.detectChanges();
  }
  deleteBankDetails() {
    this.modalRef.close();
    const control = <UntypedFormArray>this.spinningCreateForm.controls['bankDetails'];
    control.removeAt(this.deleteBankIndex);
  }

  goBack() {
    this.router.navigate(['/resha-farms/spinning-mills']);
  }

  getAllCustomerTypes() {
    this.api.getAllCustomerTypes().then(res => {
      this.kycCustomerTypes = res['_embedded']['kyccustomer'];
      this._cd.detectChanges();
    });
  }

  async getCenters() {
    this.ngxLoader.stop();
    this.api.getCottonBALESCenters().then(details => {
      console.log(details);
      
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
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
  watchPosition() {
    let id = navigator.geolocation.watchPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      if (position.coords.latitude === this.latitude) {
        navigator.geolocation.clearWatch(id);
      }

      this.spinningCreateForm.get('latitude').patchValue(this.latitude)
      this.spinningCreateForm.get('longitude').patchValue(this.longitude)
    }, (error) => { console.log(error) },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  }
  open(content, index) {
    this.deleteBankIndex = index;
    this.delBank = this.spinningCreateForm.get('bankDetails')['controls'][index];
    console.log(this.delBank)
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  saveSpinningDetails(spinningCreateForm) {
    const bank = {
      accountNumber: this.bankForm?.bankForm.value.accountNumber.trim(),
      beneficiaryName: this.bankForm?.bankForm.value.beneficiaryName,
      ifscCode: this.bankForm?.bankForm.value.ifscCode.trim(),
      bankName: this.bankForm?.bankForm.value.bankName,
      branchName: this.bankForm?.bankForm.value.branchName,
    }
    const params = {
      name: spinningCreateForm.name,
      phone: spinningCreateForm.phone,
      gstNumber: spinningCreateForm.gstNumber,
      kycVerified: this.gstkycVerified,
      bankDetails: [bank],
      address: {
        address: this.addressForm?.addressForm.value.address,
        village: this.addressForm?.addressForm.value.village,
        city: this.addressForm?.addressForm.value.city,
        district: this.addressForm?.addressForm.value.district,
        taluk: this.addressForm?.addressForm.value.taluk,
        region: this.addressForm?.addressForm.value.region,
        state: this.addressForm?.addressForm.value.state,
        pincode: this.addressForm?.addressForm.value.pincode,
        latitude: this.addressForm?.addressForm.value.latitude,
        longitude: this.addressForm?.addressForm.value.longitude,
      },

      landSize: spinningCreateForm.baleDetails.landSize,
      consumptionCapacity: spinningCreateForm.baleDetails.consumptionCapacity,
      productionCapacity: spinningCreateForm.baleDetails.productionCapacity,
      yarnTypes: spinningCreateForm.baleDetails.yarnType,
      cottonBaleType: spinningCreateForm.baleDetails.cottonType,
      centerId: spinningCreateForm.center,
      customerType: spinningCreateForm.customerType ? '/kyccustomer/' + spinningCreateForm.customerType : null,
      principalPlaceBusiness: spinningCreateForm.principalPlaceBusiness,
      additionalPlaceBusiness: spinningCreateForm.additionalPlaceBusiness,
      jurisdictionState: spinningCreateForm.jurisdictionState,
      businessConstitution: spinningCreateForm.businessConstitution,
      dateRegisterd: spinningCreateForm.dateRegisterd,
      taxpayerType: spinningCreateForm.taxpayerType,
      gstinstatus: spinningCreateForm.gstinstatus,
      cancelationDate: spinningCreateForm.cancelationDate,
      lastVerified: spinningCreateForm.lastVerified,
      email: spinningCreateForm.email,
    };
    if (this.id) {
      this.ngxLoader.stop();
      if (!this.gstkycVerified) {
        const obj = {
          spinningMill: "/spinningMill/" + this.id,
          verified: true,
          kycDocument: "/kyccustomer/7",
          kycNumber: this.spinningCreateForm.get('gstNumber').value,
          items: null,
        }
        this.ngxLoader.stop();
        this.api.verifySpinningMillGstKyc(obj).then((res: any) => {
          this.gstkycVerified = true;
          params['kycVerified']= true;          
          this.api.updateSpinningMill(params, this.id,).then((res: any) => {
            if (res) {
              this.router.navigate(['/resha-farms/spinning-mills']);
              this.snackBar.open('Updated Sprinning Mill successfully', 'Ok', {
                duration: 3000
              });
            } else {
              this.snackBar.open('Failed to update Spinning Mill', 'Ok', {
                duration: 3000
              });
            }
          });
          

        },error=> {
          this.gstkycVerified = false;
          this.api.updateSpinningMill(params, this.id,).then((res: any) => {
            if (res) {
              this.router.navigate(['/resha-farms/spinning-mills']);
              this.snackBar.open('Updated Sprinning Mill successfully', 'Ok', {
                duration: 3000
              });
            } else {
              this.snackBar.open('Failed to update Spinning Mill', 'Ok', {
                duration: 3000
              });
            }
          });
        });
        
      } else {
        this.api.updateSpinningMill(params, this.id,).then((res: any) => {
          if (res) {
            this.router.navigate(['/resha-farms/spinning-mills']);
            this.snackBar.open('Updated Sprinning Mill successfully', 'Ok', {
              duration: 3000
            });
          } else {
            this.snackBar.open('Failed to update Spinning Mill', 'Ok', {
              duration: 3000
            });
          }
        });
      }



      // if (!this.gstkycVerified) {
      //   this.gstkyc();
      // }


    } else {
      this.ngxLoader.stop();
      this.api.createSpinningMill(params).then((res: any) => {
        if (res) {
          // Success Message
          this.res = res;
          this.router.navigate(['/resha-farms/spinning-mills']);
          //this.modalService.open(this.kycFillcontent);
          this.snackBar.open('Updated Spinning Mill successfully', 'Ok', {
            duration: 3000
          });
        } else {
          this.snackBar.open('Failed to create Spinning Mill', 'Ok', {
            duration: 3000
          });
        }
      });
    }
  }
  gstVerified(value) {
    const payload = {
      phone: this.spinningCreateForm.get('phone').value,
      customerType: "/kyccustomer/" + this.spinningCreateForm.get('customerType').value,
      gstNumber: this.spinningCreateForm.get('gstNumber').value,
      centerId: this.spinningCreateForm.get('center').value
    }
    this.ngxLoader.stop();
    this.api.gstVerificationforSpinningMill(payload).then((res: any) => {
      this.toaster.success('Spinning mill created successfully ', 'Ok', {
        timeOut: 3000,
      })

      if (res) {
        this.res = res;
        this.id = this.res['id']
        this.router.navigate([`/resha-farms/spinning-mills/crud`, this.res['id']]);
      }
    })
  }
  // verifyGst(value) {
  //   this.gstVerified();
  // }
  onchangeCustomerType() {
    this.spinningCreateForm.get('customerType').value;
  }
  getSpinningMillsById() {
    this.api.getSpinningMillById(this.id).then((res: any) => {
      this.spinningCreateForm.patchValue(res);
    })
  }

  gstkyc() {
    const obj = {
      spinningMill: "/spinningMill/" + this.id,
      verified: true,
      kycDocument: "/kyccustomer/7",
      kycNumber: this.spinningCreateForm.get('gstNumber').value,
      items: null,
    }
    this.ngxLoader.stop();
    this.api.verifySpinningMillGstKyc(obj).then((res: any) => {

    });
  }
}
