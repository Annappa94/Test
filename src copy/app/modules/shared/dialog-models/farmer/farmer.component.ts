import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.scss']
})
export class FarmerComponent implements OnInit {
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
    }
];
farmerCreateForm: UntypedFormGroup;
centerList=[];
@Output()
apiRrespone:any= new EventEmitter();

  constructor(private form:UntypedFormBuilder,
     private ngxLoader:NgxUiLoaderService,
     private _cd: ChangeDetectorRef,
     private snackBar: MatSnackBar,
     private modalService: NgbModal,
     private api:ApiService,
     ) { }

  ngOnInit(): void {
    this.farmerCreateForm = this.form.group({
      name: new UntypedFormControl(''),
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
      farmArea: new UntypedFormControl(''),
      chaakiDate: new UntypedFormControl(),
      capacity: new UntypedFormControl(''),
      chaakiCenterName: new UntypedFormControl(''),
      chaakiCenterPhone: new UntypedFormControl(''),
      center: new UntypedFormControl('',[Validators.required]),
      refferedBy: new UntypedFormControl(''),
      farmEquipments: new UntypedFormControl(''),
      cocoonType: new UntypedFormControl(),
      kycPANNumber: new UntypedFormControl(''),
      kycAdhaarNumber: new UntypedFormControl(''),
      bankDetails: new UntypedFormArray([]),
    });
    this.getCenters();
  }
  c(){
    this.modalService.dismissAll();
  }
  createFarmer(farmerForm) {
    //console.log(farmerForm); 
    const params = {
      name: farmerForm.name,
      phone: farmerForm.phone,
      alternatePhone: '',
      farmArea: '',
      chaakiDate: null,
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
    this.api.farmersOnboarding(params).then((res:any) => {
      if (res) {
        res.type="Farmer";
        this.apiRrespone.emit(res);
        this.c();
        this.farmerCreateForm.reset();
        this.snackBar.open('Created farmer successfully', 'Ok', {
          duration: 3000
        });
      }
    });
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

  isControlValidForWeavers(controlName: string): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
   }
  
  isControlInvalidForWeavers(controlName: string): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
  
  controlHasErrorForWeavers(validation, controlName): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }
  
  isControlValid(controlName: string): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }
  
  isControlInvalid(controlName: string): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
  
  controlHasError(validation, controlName): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }
  
  isControlTouched(controlName): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.dirty || control.touched;
  }

  
}
