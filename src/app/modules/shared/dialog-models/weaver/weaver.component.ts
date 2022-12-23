import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-weaver',
  templateUrl: './weaver.component.html',
  styleUrls: ['./weaver.component.scss']
})
export class WeaverComponent implements OnInit {
  weaverCreateForm:UntypedFormGroup;
  constructor(
    private form:UntypedFormBuilder,
    private ngxLoader:NgxUiLoaderService,
    private _cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private api:ApiService,
  ) { }
  @Output()
  apiRrespone:any= new EventEmitter();

  ngOnInit(): void {
    this.weaverCreateForm = this.form.group({
      name: new UntypedFormControl(''),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
      address: new UntypedFormControl(''),
      village: new UntypedFormControl(''),
      district: new UntypedFormControl(''),
      city:new UntypedFormControl(''),
      pincode: new UntypedFormControl(''),
      taluk: new UntypedFormControl(''),
      state: new UntypedFormControl(''),
      region: new UntypedFormControl(''),
      kycPANNumber: new UntypedFormControl(''),
      kycAdhaarNumber: new UntypedFormControl(''),
      gstNumber: new UntypedFormControl(''),
      yarnCapacity: [''],
      twistedType: new UntypedFormControl(''),
      denier: new UntypedFormControl(''),
      type: new UntypedFormControl('', Validators.required),
      pickupWastage: new UntypedFormControl(''),
      bankDetails: new UntypedFormArray([]),
      yarnCocoonType: new UntypedFormControl('', Validators.required),
      refferedBy: new UntypedFormControl(''),
      latitude:new UntypedFormControl(''),
      longitude:new UntypedFormControl('')
      
      // reEnterbankAccountNumber: new FormControl(''),
    });
  }

  // Reeler Validations
  isControlValidForReeler(controlName: string): boolean {
    const control = this.weaverCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.weaverCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.weaverCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedForReeler(controlName): boolean {
    const control = this.weaverCreateForm.controls[controlName];
    return control.dirty || control.touched;
  }

  createWeaver(form) {
    const params = {
      name: form.name,
      phone: form.phone,
      gstNumber: form.gstNumber,
      yarnCapacity: form.yarnCapacity,
      pickupWastage: form.pickupWastage,
      address: {
        address: form.address,
        city: form.city,
        taluk: form.taluk,
        village: form.village,
        district: form.district,
        state: form.state,
        pincode: form.pincode,
        region: form.region,
        longitude: form.longitude,
        latitude: form.latitude
      },
      kycPANNumber: form.kycPANNumber,
      kycAdhaarNumber: form.kycAdhaarNumber,
      bankDetails:  [{"beneficiaryName":"","bankName":"","accountNumber":"","ifscCode":""}],
      yarnCocoonType: form.yarnCocoonType ? form.yarnCocoonType : '',
      twistedType: form.twistedType ? form.twistedType : null,
      denier: form.denier ? form.denier : '',
      type: form.type ? form.type : '',
      refferedBy: form.refferedBy,
      // type: "Weaver",
    };
      this.ngxLoader.stop();
      this.api.weaversOnboarding(params).then((res:any) => {
        this.c();
        if (res) {
          res.type="Weaver"
          this.apiRrespone.emit(res);
          // Success Message
          this.snackBar.open('Created weaver successfully', 'Ok', {
            duration: 3000
          });
        } else {
          this.snackBar.open('Failed to created weaver', 'Ok', {
            duration: 3000
          });
        }
      });
  }

  c(){
    this.modalService.dismissAll();
  }


}
