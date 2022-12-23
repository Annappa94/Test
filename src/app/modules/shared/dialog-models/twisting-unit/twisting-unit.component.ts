import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-twisting-unit',
  templateUrl: './twisting-unit.component.html',
  styleUrls: ['./twisting-unit.component.scss']
})
export class TwistingUnitComponent implements OnInit {
  twistingUnitCreateForm: UntypedFormGroup;
  constructor(
    private form:UntypedFormBuilder,
    private ngxLoader:NgxUiLoaderService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private api:ApiService,
  ) { }
  @Output()
  apiRrespone:any= new EventEmitter();

  ngOnInit(): void {
    this.twistingUnitCreateForm = this.form.group({
      name: new UntypedFormControl('', Validators.required),
      kycPANNumber: new UntypedFormControl('', Validators.required),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')])
   });
  }

  createTwistingUnit(formData){
    const params = {
      twistingUnitName: formData.name,
      phoneNumber: formData.phone,
      kycPANNumber:formData.kycPANNumber
    };
    this.ngxLoader.stop();
    this.api.createYarnTwistingUnit(params).then((res:any) => {        
    this.c();
      if(res){
        this.twistingUnitCreateForm.reset();
        this.apiRrespone.emit(res);
        this.snackBar.open('Created successfully', 'Ok', {
          duration: 3000
        });
      }
    });
  }

  c(){
    this.modalService.dismissAll();
  }

  isControlValidForReeler(controlName: string): boolean {
    const control = this.twistingUnitCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }
  
  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.twistingUnitCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
  
  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.twistingUnitCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }
}
