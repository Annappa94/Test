import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api/api.service';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-chawki-batch-crud',
  templateUrl: './chawki-batch-crud.component.html',
  styleUrls: ['./chawki-batch-crud.component.scss']
})
export class ChawkiBatchCrudComponent implements OnInit {
  searchRetailerKhata = '';
  purcahaseOrderItems: any = [];
  @Output() cancel = new EventEmitter<string>();
  batchCreateForm: UntypedFormGroup;
  chawkiId;
  minDate;
  maxDate;
  chawkiTypes: any = [];

  constructor(
    public dialogRef: MatDialogRef<ChawkiBatchCrudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    form: UntypedFormBuilder,
    private api: ApiService,
    private snackBar: MatSnackBar,
    private ngxLoader : NgxUiLoaderService
  ) {
    const currentYear = moment().year();
    const currentMonth = moment().month();
    const currentDay = moment().date();

    this.minDate = moment([currentYear, currentMonth, currentDay+1]);
    this.maxDate = moment([currentYear, currentMonth, currentDay+2]);

    this.batchCreateForm = form.group({
      availableOn: new UntypedFormControl('', [Validators.required]),
      totalAvailableDFL: new UntypedFormControl('', [Validators.required]),
      batchType: new UntypedFormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    // Nothing to do
    if (this.data && this.data.chawkiId) {
      this.chawkiId = this.data.chawkiId;
    }
    if(this.data && this.data.chawkiTypes) {
      this.chawkiTypes = this.data.chawkiTypes;
      this.batchCreateForm.get('batchType').patchValue(this.chawkiTypes[0])
      
    }
  }

  createBatch() {
    const reqObj = {
      availableOn: Date.parse(this.batchCreateForm.value.availableOn),
      totalAvailableDFL: this.batchCreateForm.value.totalAvailableDFL,
      currentlyAvailableDFL: this.batchCreateForm.value.totalAvailableDFL,
      chawki: '/chawki/' + this.chawkiId,
      batchType: this.batchCreateForm.value.batchType
    }
    this.ngxLoader.stop();
    this.api.createChawkiBatch(reqObj).then(res => {
      this.snackBar.open('Batch Created Successfully', 'Ok', {
        duration: 3000
      });
      this.dialogRef.close('created');
    }, err => {
      this.snackBar.open('Failed to create batch, pleae try again', 'Ok', {
        duration: 3000
      });
      this.dialogRef.close();
    })
  }

  isControlValidForReeler(controlName: string): boolean {
    const control = this.batchCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.batchCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.batchCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
