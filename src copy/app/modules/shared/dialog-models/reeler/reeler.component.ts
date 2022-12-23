import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-reeler',
  templateUrl: './reeler.component.html',
  styleUrls: ['./reeler.component.scss']
})
export class ReelerComponent implements OnInit {
  reelerCreateForm:UntypedFormGroup;
  centerList=[];
  constructor(
    private form:UntypedFormBuilder,
    private ngxLoader:NgxUiLoaderService,
    private _cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private api:ApiService,
  ) { 
    this.reelerCreateForm = this.form.group({
      name: new UntypedFormControl('', Validators.required),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
      center: new UntypedFormControl('',[Validators.required]),
      bankDetails: new UntypedFormArray([]),
    });
  }
  @Output()
  apiRrespone:any= new EventEmitter();

  ngOnInit(): void {
    this.getCenters();
  }

  createReeler(reelerForm){
    const params = {
      name: reelerForm.name,
      phone: reelerForm.phone,
      address: {
        address: '',
        city: '',
        taluk: '',
        village: '',
        district: '',
        state: '',
        pincode: ''
      },
      cocoonCapacity: 0,
      yarnCapacity: 0,
      pickupWastage: '',
      center: '/center/' + reelerForm.center,
      kycPANNumber: '',
      kycAdhaarNumber: '',
      csbId: '',
      gstNumber: '',
      bankDetails : reelerForm.bankDetails,
    };
    this.ngxLoader.stop();
    this.api.postReeler(params).then((res:any) => {
      this.c();
      if (res) {
        res.type="Reeler"
        this.apiRrespone.emit(res);
        this.reelerCreateForm.reset();
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

  c(){
    this.modalService.dismissAll();
  }

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
