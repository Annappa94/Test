import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-retailer',
  templateUrl: './retailer.component.html',
  styleUrls: ['./retailer.component.scss']
})
export class RetailerComponent implements OnInit {

  constructor(
    private form:UntypedFormBuilder,
     private ngxLoader:NgxUiLoaderService,
     private snackBar: MatSnackBar,
     private modalService: NgbModal,
     private api:ApiService,
  ) { }
  retailerCreateForm: UntypedFormGroup;
  @Output()
  apiRrespone:any= new EventEmitter();

  ngOnInit(): void {
    this.retailerCreateForm = this.form.group({
      name: new UntypedFormControl('', Validators.required),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')])
   });
  }

  createRetailer(formData){
    const params = {
      name: formData.name,
      phone: formData.phone
    };
    this.ngxLoader.stop();
    this.api.postRetailer(params).then((res:any) => {        
    this.c();
      if(res){
        res.type="Retailer"
        this.apiRrespone.emit(res);
        this.retailerCreateForm.reset();
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
    const control = this.retailerCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }
  
  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.retailerCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
  
  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.retailerCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }
}
