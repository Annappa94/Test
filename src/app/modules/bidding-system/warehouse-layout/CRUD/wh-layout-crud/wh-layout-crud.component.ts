import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-wh-layout-crud',
  templateUrl: './wh-layout-crud.component.html',
  styleUrls: ['./wh-layout-crud.component.scss']
})
export class WhLayoutCrudComponent implements OnInit {

  mandiList: any = [];
  createWarehouseForm: UntypedFormGroup;
  id;
  constructor(
    private api: ApiService,
    private specApi: SearchService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    public globalService: GlobalService,
    private ngxLoader: NgxUiLoaderService,
    private form: UntypedFormBuilder,
    private _location: Location,
    private route: ActivatedRoute,

  ) {
    const { id } = this.route.snapshot.params;
    this.id = id;
    if (this.id) {
      this.getWHLById();
    }
    this.formIninitialization();
    this.getAllTableList();
  }
  tablesList: any = [];
  getWHLById(){
    this.api.getWHLayoutById(this.id).then(res=>{
      this.createWarehouseForm.patchValue(res)
    })
  }
  getAllTableList() {
    this.specApi.specAPIForBid(false, 'tablelayout', '').then(res => {
      //console.log(res['content']);
      this.tablesList = res['content']
    })
  }
  ngOnInit(): void {
    this.ngxLoader.stop();
    this.api.getAllWarehouse().then(res => {
      //console.log(res);
      this.mandiList = res['_embedded']['warehouse'];
      this.cdr.detectChanges();
    });
  }
  formIninitialization() {
    this.createWarehouseForm = this.form.group({
      warehouse: new UntypedFormControl('', [Validators.required]),
      tableLayout: new UntypedFormControl('', [Validators.required]),
      name: new UntypedFormControl('', [Validators.required]),
      lanes: new UntypedFormControl('', [Validators.max(10), Validators.min(1)]),
      laneDefintion: new UntypedFormArray([])
    })
    this.onLaneNumberChanges();
  }
  onLaneNumberChanges() {
    this.createWarehouseForm.get('lanes').valueChanges.subscribe(value => {
      (this.createWarehouseForm.controls['laneDefintion'] as UntypedFormArray).clear();
      if (value) {
        for (let i = 0; i < value; i++) {
          (this.createWarehouseForm.controls['laneDefintion'] as UntypedFormArray).push(new UntypedFormGroup({
            lane: new UntypedFormControl(i + 1),
            noOfTables: new UntypedFormControl('', [Validators.required, Validators.min(1)])
          }))
        }
      }
    })

  }
  onSubmit() {
    this.ngxLoader.stop();
    if(this.id){
      this.api.patchWHLayout(this.createWarehouseForm.value, this.id).then(res => {
        if (res) {
          this._location.back();
          this.snackBar.open('Warehouse Layout updated successfully!', 'OK', {
            duration: 3000
          })
        }
      })
    } else {
      this.api.createWHLayout(this.createWarehouseForm.value).then(res => {
        if (res) {
          this._location.back();
          this.snackBar.open('Warehouse Layout created successfully!', 'OK', {
            duration: 3000
          })
        }
      })
    }
    

  }
  goBack() {
    this._location.back();
  }
  isControlValidForWH(controlName: string): boolean {
    const control = this.createWarehouseForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForWH(controlName: string): boolean {
    const control = this.createWarehouseForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForWH(validation, controlName): boolean {
    const control = this.createWarehouseForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedForWH(controlName): boolean {
    const control = this.createWarehouseForm.controls[controlName];
    return control.dirty || control.touched;
  }

}
