import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-chawki',
  templateUrl: './chawki.component.html',
  styleUrls: ['./chawki.component.scss']
})
export class ChawkiComponent implements OnInit {
  chawkiCreateForm:UntypedFormGroup
  centerList=[];
  constructor(private form:UntypedFormBuilder,
    private ngxLoader:NgxUiLoaderService,
    private _cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private api:ApiService
    ) {
      this.chawkiCreateForm = this.form.group({
        name: new UntypedFormControl('', [Validators.required]),
        refferedBy: new UntypedFormControl(''),
        index: new UntypedFormControl('', [Validators.required]),
        phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')])
      });
    }

  @Output()
  apiRrespone:any= new EventEmitter();  
  ngOnInit(): void {
    this.getCenters();
  }  

  c(){
    this.modalService.dismissAll();
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


  createNewChawki(chawkiForm){
    this.ngxLoader.stop();
    const params = {
      name: chawkiForm.name,
      phone: chawkiForm.phone,
      refferedBy: chawkiForm.refferedBy,
      nearestRmCenterName: this.centerList[chawkiForm?.index]?.centerName,
      nearestRmCenterId:this.centerList[chawkiForm?.index]?.id
    }
    this.api.chawkiOnBoarding(params).then((res:any) => {
      if (res) {
        this.c();
        res.type="Chawki";
        this.apiRrespone.emit(res);
        this.snackBar.open('Chawki created', 'Ok', {
          duration: 3000
        });
      }
    }, err => {
      console.log(err);
    });
  }

  isControlValidForReeler(controlName: string): boolean {
    const control = this.chawkiCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }
  
  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.chawkiCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
  
  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.chawkiCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }
  
  isControlTouchedForReeler(controlName): boolean {
    const control = this.chawkiCreateForm.controls[controlName];
    return control.dirty || control.touched;
  }


}
