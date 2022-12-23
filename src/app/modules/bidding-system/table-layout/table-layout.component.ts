import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UNIT_OF_MESURES } from 'src/app/constants/enum/constant.retailer';
import { ApiService } from 'src/app/services/api/api.service';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';

@Component({
  selector: 'app-table-layout',
  templateUrl: './table-layout.component.html',
  styleUrls: ['./table-layout.component.scss']
})
export class TableLayoutComponent implements OnInit {

  constructor(
    private api:ApiService,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private snackBar:MatSnackBar,
    private _cd:ChangeDetectorRef
    ) { }
  
  id:number;

  UNIT_OF_MESURES = {...UNIT_OF_MESURES};

  tableCreateForm:UntypedFormGroup = new UntypedFormGroup({
    rows:new UntypedFormControl('',[Validators.required,Validators.max(10)]),
    columns:new UntypedFormControl('',[Validators.required,Validators.max(2)]),
    uom:new UntypedFormControl('KGS',[Validators.required]),
    name:new UntypedFormControl('',[Validators.required,CustomValidator.cannotContainOnlySpace])
  })

  ngOnInit(): void {
    const  { id } = this.activatedRoute.snapshot.params;
    this.id = id;
    id&&this.getTableLayoutById(id)
  }

  matrixForm:UntypedFormGroup;
  tableCapacityChange(matrixForm:UntypedFormGroup,){
    this.matrixForm = matrixForm;
    console.log(this.matrixForm)
  }

  buildPayload(matrixFormValue:Object,tableCreateFormValue:any){
    let layout:any=[];
    let partition = 1;
    let partitionName =65
    for(let capacity in matrixFormValue){
      layout.push(
        {
          "rows": matrixFormValue[capacity].length ,
          "partition":partition ,
          partitionName:String.fromCharCode(partitionName),
          "capacity": matrixFormValue[capacity].map(record=>parseFloat(record.capacity))
        }
      ); 
      partition++;
      partitionName++;
    }

    return {
      "uom": tableCreateFormValue.uom,
      "name": tableCreateFormValue.name,
      layout
    }
  }

  save(matrixFormValue,tableCreateFormValue){
    if(this.id){
      this.updateTableLayout(matrixFormValue,tableCreateFormValue);
    }else{
      this.createTableLayout(matrixFormValue,tableCreateFormValue);
    }
  }


  createTableLayout(matrixFormValue,tableCreateFormValue){
    this.api.createTableLayout(this.buildPayload(matrixFormValue,tableCreateFormValue)).then(res=>{
      this.router.navigate(['/bid/table']);
      this.snackBar.open('Created Successfully', 'Ok', {
        duration: 3000
      });
     }).catch(err=>{
       
     });
  }

  updateTableLayout(matrixFormValue,tableCreateFormValue){
    this.api.updateTableLayout(this.id,this.buildPayload(matrixFormValue,tableCreateFormValue)).then(res=>{
      this.router.navigate(['/bid/table']);
      this.snackBar.open('Updated Successfully', 'Ok', {
        duration: 3000
      });
     }).catch(err=>{
       
     });
  }

  tableLayoutDetailsEdit;
  
  getTableLayoutById(id:number){
   this.api.getTableLayoutById(id).then((res:any)=>{
    this.tableLayoutDetailsEdit = res;
    const { layout } = this.tableLayoutDetailsEdit;
     this.tableCreateForm.get('columns').patchValue(layout?.length) 
     this.tableCreateForm.get('rows').patchValue(layout[layout.length-1]?.rows) 
     this.tableCreateForm.get('uom').patchValue(res?.uom) 
     this.tableCreateForm.get('name').patchValue(res?.name) 
     this._cd.detectChanges()
   })
  }

  isTableCreateFormValid(tableCreateForm,contoler,status){
    return tableCreateForm.get(contoler)[status] &&
    (tableCreateForm.get(contoler).dirty ||tableCreateForm.get(contoler).touched)
  }
}
