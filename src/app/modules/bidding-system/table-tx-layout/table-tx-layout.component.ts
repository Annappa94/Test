import { KeyValue } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-table-tx-layout',
  templateUrl: './table-tx-layout.component.html',
  styleUrls: ['./table-tx-layout.component.scss']
})
export class TableTxLayoutComponent implements OnInit,OnChanges{

  constructor(private formBuilder:UntypedFormBuilder,
    private ngxLoader : NgxUiLoaderService,
    private _cd:ChangeDetectorRef
    ) {
     }

  @Input()
  numberOfRows:number = 0;

  @Input()
  numberOfColumns:number = 0;

  @Input()
  isValid:boolean = false;

  @Input()
  uom:string ='KGS';

  @Input()
  tableLayoutDetailsEdit

  width:number;

  @Output()
  onChange:EventEmitter<UntypedFormGroup> = new EventEmitter<UntypedFormGroup>();

  originalOrder:any = (a: KeyValue<number,string>, b: KeyValue<number,string>): number =>  0;

  matrixForm:UntypedFormGroup = new UntypedFormGroup({});

  ngOnChanges(changes: SimpleChanges): void {

    if(this.isValid){
       this.buildRows(this.numberOfRows,this.numberOfColumns);
    }else{
      this.matrixForm = new UntypedFormGroup({});
    }

    this.tableLayoutDetailsEdit && this.patchDataToForm(this.tableLayoutDetailsEdit)
  }

  patchDataToForm(tableLayoutDetailsEdit){
    const { layout } = tableLayoutDetailsEdit;
    let numberOfRows = layout[layout.length-1].partition;
    this.matrixForm = this.buildFormKeyDynamically(numberOfRows);
    this.matrixForm = this.pathColumnsDynamically(this.matrixForm,layout);
    this.listenForInputValueChanges();
    this._cd.detectChanges()
    this.onChange.emit(this.matrixForm)
  }


  pathColumnsDynamically(form:UntypedFormGroup,layout){
     for(let column=0;column<layout.length;column++){
      for(let row = 0;row<layout[column].capacity.length; row++){
        (form.get(`P${column}`) as  UntypedFormArray).push(
         new UntypedFormGroup({capacity:new UntypedFormControl(layout[column].capacity[row],[Validators.required])})
        );
      }
     }
     return form;
  }

  buildFormKeyDynamically(numberOfRows:number):UntypedFormGroup{
    let group:any = {};
    for(let k=0;k<numberOfRows;k++){
      group[`P${k}`] = new UntypedFormArray([]);
    }
    return new UntypedFormGroup(group);
  }

  addColumsDynamically(form:UntypedFormGroup,numberOfRows:number,numberOfColumns:number):UntypedFormGroup{
    for(let i:number=0;i< numberOfColumns ;i++){
      for(let column = 0;column<numberOfRows;column++){
        // capacity
        (form.get(`P${i}`) as  UntypedFormArray).push(
         new UntypedFormGroup({capacity:new UntypedFormControl(null,[Validators.required])})
        );
      }
    }
    return form;
  }

  buildRows(numberOfRows:number,numberOfColumns:number){
    this.ngxLoader.stop();
    this.matrixForm = this.buildFormKeyDynamically(numberOfColumns);
    this.matrixForm = this.addColumsDynamically(this.matrixForm,numberOfRows,numberOfColumns)
    this.ngxLoader.stop()
    this.listenForInputValueChanges();
    this.onChange.emit(this.matrixForm);
    this._cd.detectChanges()
  }
  listenForInputValueChanges(){
    this.matrixForm?.valueChanges.subscribe(value=>{
      this.onChange.emit(this.matrixForm);
    })
  }

  ngOnInit(): void {
    this.width = window.innerWidth;
  }

  isMatrixFormValid(matrixForm:UntypedFormGroup,rowIndex:number,columnIndex:number,status:string){
    return matrixForm.get('P'+rowIndex)['controls'][columnIndex].get('capacity')[status] && 
    (matrixForm.get('P'+rowIndex)['controls'][columnIndex].get('capacity').dirty ||
    matrixForm.get('P'+rowIndex)['controls'][columnIndex].get('capacity').touched)
  }

}
