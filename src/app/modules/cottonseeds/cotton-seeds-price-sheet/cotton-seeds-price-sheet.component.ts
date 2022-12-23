import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { items } from 'fusioncharts';
import { values } from 'lodash';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-cotton-seeds-price-sheet',
  templateUrl: './cotton-seeds-price-sheet.component.html',
  styleUrls: ['./cotton-seeds-price-sheet.component.scss']
})
export class CottonSeedsPriceSheetComponent implements OnInit {


  seedsPriceSheetForm:FormGroup = this.form.group({
    warehouse:this.form.array([])
  })

  warehouseListArray: any;
  
  constructor(
    private api: ApiService,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private form:FormBuilder,
    private modalService: NgbModal,
    private route:ActivatedRoute,
    private snackBar:MatSnackBar,
    private toaster:ToastrService,
    private _cd: ChangeDetectorRef,
  ) {

   }


   isEdit:boolean = true;
   edit(){
    this.isEdit=false
   }

   createWareHouseControllers(warehouse){
     const {id,warehouseName,lastModifiedDate} = warehouse;
     return this.form.group({
       id:[id],
       warehouseName:[warehouseName],
       lastModifiedDate:[lastModifiedDate],
       conditions:this.form.array([])
     })
   }

   createConditionControllers(){
     return this.form.group({
      value:this.form.array([])
     })
   }


  getWarehouselist() {
    this.api.getListOfWareHouses().then(response => {
      this.warehouseListArray = response['content'];
        this._cd.detectChanges();
    })
  }


  getWarehousePriceSheet() {
    this.api.getPriceWarehouse().then(response => {
      this.updateFormControllers(response['content']);
      this._cd.detectChanges();
    })
  }

  updateFormControllers(latestPriceSheet){
    for(let i=0;i<latestPriceSheet.length;i++){
      const { event:{params:{id,warehouseName}},lastModifiedDate,conditions} = latestPriceSheet[i];
      let  warehouseFormGroup:FormGroup = this.createWareHouseControllers({id,warehouseName,lastModifiedDate});   
      (warehouseFormGroup.get('conditions') as FormArray).clear();
      /** EveryWarehouse will have conditions array ,
       * Before creating controllers in for loop we have to remove existing values.
      */
      for(let j= 0;j<conditions.length;j++){
          let conditionsFormArray = (warehouseFormGroup.get('conditions') as FormArray);
         (warehouseFormGroup.get('conditions') as FormArray).push(this.createConditionControllers());
          let valuesFormArray :FormArray  = ((warehouseFormGroup.get('conditions') as FormArray).at(conditionsFormArray.length-1).get('value') as FormArray); 
          valuesFormArray.clear();
          let values = conditions[i].value;

          /**@Every condition array will have list of values */
          for(let k =0;k<values.length;k++){
           valuesFormArray.push(this.form.control(values[k]));
          }
       };
       /** Create controllers based on the response from the API so we can patch the data is one line */
       warehouseFormGroup.get('conditions').patchValue(conditions);

     (this.seedsPriceSheetForm.get('warehouse') as FormArray).push(warehouseFormGroup);
   }
  }
  buildPayload(valuesOnSave){
    const {warehouseName,id,conditions} = valuesOnSave ;
    const reqObj=[{
        "id": id,
        "warehouseName": warehouseName,
        "rmGradeAminPrice":conditions[0]?.value[0],
        "rmGradeAmaxPrice":conditions[0]?.value[1],
        "rmGradeBminPrice":conditions[1]?.value[0],
        "rmGradeBmaxPrice":conditions[1]?.value[1],
        "rmGradeCminPrice":conditions[2]?.value[0],
        "rmGradeCmaxPrice":conditions[2]?.value[1],
    }]

    return reqObj;
  }


  listenForTheFormChange(){
    this.seedsPriceSheetForm.get('warehouse').valueChanges.pipe(distinctUntilChanged((a,b)=>JSON.stringify(a)==JSON.stringify(b))).subscribe(res=>{
       console.log(res);
       this.updateControllers()
    })
  }

  updateControllers(){
    (this.seedsPriceSheetForm.get('warehouse') as FormArray).controls.forEach(record=>{
      (record.get('conditions') as FormArray).controls.forEach(value=>{
        (value.get('value') as FormArray).at(0).setValidators([Validators.max((value.get('value') as FormArray).at(1).value)]);
        (value.get('value') as FormArray).at(1).setValidators([Validators.min(0)]);
        //  (value.get('value') as FormArray).controls.forEach(val=>{
        //      console.log(val)
        //  });
        (value.get('value') as FormArray).at(0).updateValueAndValidity();
        (value.get('value') as FormArray).at(1).updateValueAndValidity();
       });
        // console.log(record)
    })
    this.seedsPriceSheetForm.get('warehouse').updateValueAndValidity();
  }

  ngOnInit(): void {
    this.listenForTheFormChange();
    this.getWarehousePriceSheet();
  }
 
  createSeedsPriceSheet(valuesOnSave){ 
  console.log('item',valuesOnSave);
      this.isEdit = true;
      this.api.createSeedsPriceSheet(this.buildPayload({...valuesOnSave})).then(res=>{
        this.toaster.success('Price Sheet Updated successfully', 'Ok', {
          timeOut: 3000,
        })

      })
  
 }
}
