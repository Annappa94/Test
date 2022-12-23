import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Console } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-assign-to-bid',
  templateUrl: './assign-to-bid.component.html',
  styleUrls: ['./assign-to-bid.component.scss']
})
export class AssignToBidComponent implements OnInit {
  id;
  lotDetails;
  assignLotToTableForm: UntypedFormGroup;
  sellingPriceUptick: { A_PLUS: number; A: number; B_PLUS: number; B: number; C: number; DOUBLECOCOON: number; JHILLI: number; };
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
    this.sellingPriceUptick = {
      "A_PLUS": 1,
      "A" : 1,
      "B_PLUS": 1,
      "B" : 1,
      "C":1,
      "DOUBLECOCOON":1,
      "JHILLI":1
    };
      this.api.getConfigByConfig('com.reshamandi.v1.cocoon_lot.sales.uptick').then((res:any) => {
        this.sellingPriceUptick = JSON.parse(res?.value);
      })
    const { lotId } = this.route.snapshot.params;
    this.id = lotId
  }

  mandiList: any;
  instanceArray:any = [];
  filteredArray = [];

  ngOnInit(): void {
    this.formIninitialization();
    this.getWHLayoutInstance();
  }

  partitionInstance;
  racks=[];
  selectedTable;
  
  partitions:UntypedFormGroup = new UntypedFormGroup({
    baseList:new UntypedFormArray([])
  });

  getWHLayoutInstance(){
    this.ngxLoader.stop();
    this.api.getWHLayoutInstance().then(res=>{
      this.instanceArray = res['instances'];
      this.buildArray();
      this.cdr.detectChanges();
     })
  }

  buildArray(){
    this.filteredArray = [];
    for (const key in this.arrayCreation(this.instanceArray)) {
      if (Object.prototype.hasOwnProperty.call(this.arrayCreation(this.instanceArray), key)) {
        const element = this.arrayCreation(this.instanceArray)[key];
        this.filteredArray.push(element)
      }
    }
  }

  selectedPartitionId;
  getPartitionDetails(partitionInstanceId,partitionId){
    this.cocoolLot = null;
    this.selectedTable = partitionInstanceId;
    this.selectedPartitionId = partitionId;
    this.ngxLoader.stop();
    this.cdr.detectChanges();
    this.getPartitionInstanceById(partitionInstanceId,partitionId);
  }


  getPartitionInstanceById(partitionInstanceId:number,partitionId:number){
   this.api.getPartitiontInstanceById(partitionInstanceId).then((res:any)=>{
      this.partitionInstance = res;
      this.getAllLotsByBidId(res?.bidId);
      const partition = this.partitionInstance?.partitions.find(record=>record.partitionId==partitionId)
      partition?.entityId && this.getCocoonLotDetailsBidding(partition?.entityId,partitionId);
       this.buildPartitionInstance(this.partitionInstance?.partitions,partitionId)
      for (let i = 0; i < res['partitions'].length; i++) {
        for (let j = 0; j < res['partitions'][i]['racks'].length; j++) {
          this.racks.push(res['partitions'][i]['racks'][j])
        }
      }
      this.cdr.detectChanges();
    })
  }

  buildPartitionInstance(partitions,partitionId:number){
    (this.partitions.get('baseList') as UntypedFormArray).clear();

    for(let partition of partitions){
        // this.cocoonLotDetails(partition,partitionId);
        /** Build Partitions */
        let minBidValidator = this.isSelectPartition(partition,partitionId)?[Validators.required,Validators.min(1)]:[];
        (this.partitions.get('baseList') as UntypedFormArray).push(this.buildPartition(partition,partitionId,minBidValidator));

        /** Build Racks */
        let form:UntypedFormArray = (this.partitions.get('baseList') as UntypedFormArray);
        for(let rack of partition?.racks){
          (form.at(form.length-1).get('racks') as UntypedFormArray).push(this.buildRacks(rack));
        };  
    } 
  }


  clearPartition(index:number){
    // partition.reset();
    this.cocoolLot = null;
    const partition = (this.partitions.get('baseList') as UntypedFormArray).at(index).value;
    (this.partitions.get('baseList') as UntypedFormArray).at(index).patchValue(this.formGroupPartitionOnClear(partition));
    this.cdr.detectChanges();
  }

  formGroupPartitionOnClear(partition){
    partition['minBidPrice'] = null;
    partition['entityId'] = null;
    partition['racks'] = partition?.racks.map(ele=>{
      ele.occupiedCapacity = null
      return ele;
    })
    return partition;
  }

  isSelectPartition(partition,partitionId:number){
    return partition.partitionId == partitionId
  }

  buildPartition(partition,partitionId:number,minBidValidator):UntypedFormGroup{
    return new UntypedFormGroup({
      partitionName:new UntypedFormControl(partition?.partitionName),
      lotDetails:new UntypedFormControl(partition?.lotDetails),
      partitionId:new UntypedFormControl(partition?.partitionId),
      minBidPrice:new UntypedFormControl(partition?.minBidPrice,minBidValidator),
      entityId:new UntypedFormControl(partition?.entityId,[Validators.required]),
      totalQuantity:new UntypedFormControl(partition?.totalQuantity),
      alloted:new UntypedFormControl(partition?.alloted),
      flagForUI:new UntypedFormControl(partition.partitionId == partitionId),
      racks:new UntypedFormArray([])
    });
  }

  buildRacks(rack):UntypedFormGroup{
    return new UntypedFormGroup({
      availableCapacity:new UntypedFormControl(rack?.capacity-rack?.occupiedCapacity),
      capacity:new UntypedFormControl(rack?.capacity),
      occupiedCapacity:new UntypedFormControl(rack?.occupiedCapacity),
      rackIdx:new UntypedFormControl(rack?.rackIdx)
    });
  }

  detachCocoonLot(partition:UntypedFormGroup){
    (partition.get('racks') as UntypedFormArray).controls.filter(value=>{
      value.get('occupiedCapacity').patchValue(null);
    })
    partition.get('entityId').patchValue(null)
    partition.get('minBidPrice').patchValue(null)
    partition.get('alloted').patchValue(false);
    this.onSubmit(partition);
  }

  partitionAllotedChanges(form:UntypedFormGroup,index){
   if(form.get('racks').value.reduce((sum,x)=>x.occupiedCapacity+sum,0)){
    this.totalOccupiedCapacity = form.get('racks').value.reduce((total,acc)=>total+acc.occupiedCapacity,0)
    form.get('alloted').patchValue(true);
   }else{
    form.get('alloted').patchValue(false);
   }
   this.addValidatorsToRack(form,index);
  }
  totalOccupiedCapacity;
  addValidatorsToRack(form:UntypedFormGroup,index:number){
    const forms = (form.get('racks') as UntypedFormArray).at(index);
    forms.get('occupiedCapacity').valueChanges.pipe(distinctUntilChanged()).subscribe(value=>{
      if(value){ 
        this.totalOccupiedCapacity = form.get('racks').value.reduce((total,acc)=>total+acc.occupiedCapacity,0)
        this.cdr.detectChanges();
        forms.get('occupiedCapacity').setValidators([Validators.max(forms.get('capacity').value+10), Validators.min(0)]);
        forms.get('occupiedCapacity').updateValueAndValidity();
      }else{
        forms.get('occupiedCapacity').updateValueAndValidity();
      }
    });
  }


  onlotSelection(index:number,partitionId:number){
    this.listenForFormValueChange(index,partitionId)
  }

  listenForFormValueChange(index:number,partitionId:number){
    (this.partitions.get('baseList') as UntypedFormArray).at(index).get('entityId').valueChanges.subscribe(entityId=>{
      entityId&&this.getCocoonLotDetailsBidding(entityId,partitionId);
    });
  }

  cocoolLot:any;
  cocoolLotArray:any=[];

  getAllLotsByBidId(bidId:string){
    this.api.getAllLotsByBidId(bidId).then(res=>{
      this.cocoolLotArray = res['data'];
      this.cdr.detectChanges();
    });
  }

  patchWarehouseInstance(id:number,payload,partition){
    this.specApi.updateRecord('warehouseinstance',id,payload).then(res=>{
      this.getWHLayoutInstance();
      this.getCocoonLotDetailsBidding(partition.entityId,partition.partitionId)
      this.totalOccupiedCapacity =0;
      this.cocoolLot = null;
      (partition.entityId&&partition.partitionId)&&this.getCocoonLotDetailsBidding(partition.entityId,partition.partitionId)
      this.snackBar.open('Updated Successfully', 'Ok', {
        duration: 3000
      });
    });
  }

  getCocoonLotDetailsBidding(entityId:number,partitionId:number){
    this.api.getCocoonLotDetailsBidding(entityId,this.partitionInstance?.bidId).then(res=>{
    this.cocoolLot = res;
    (this.partitions.get('baseList') as UntypedFormArray).controls.filter(value=>{
      if(value.value.partitionId == partitionId){
        value.get('lotDetails').patchValue(res);
        console.log(this.cocoolLot.rmGrade);
        
        //let uptickSp =   this.cocoolLot.pricePerKg * this.sellingPriceUptick[this.cocoolLot.rmGrade];
        let uptickSp =   this.cocoolLot.receivedWeightPricePerKg * this.sellingPriceUptick[this.cocoolLot.rmGrade]
       // let setPrice = this.cocoolLot.pricePerKg * 1.025;
       let setPrice = Math.round(uptickSp);
        value.get('minBidPrice').setValue(setPrice);
        value.get('minBidPrice').setValidators([Validators.min(setPrice),Validators.required]);
       // value.get('minBidPrice').setValidators([Validators.min(this.cocoolLot.pricePerKg - 0.1*(this.cocoolLot.pricePerKg)),Validators.required]);
        value.get('minBidPrice').updateValueAndValidity();
        this.cdr.detectChanges();
      }
    });
    this.cdr.detectChanges();
    });
  }

  arrayCreation(arr=[]){
    return arr.reduce((returnValue, ele)=>{
      returnValue[ele.lane]?returnValue[ele.lane].push(ele):returnValue[ele.lane]=[ele]
      return returnValue;
    },{})
  }

  formIninitialization() {
    this.assignLotToTableForm = this.form.group({
      racks: new UntypedFormArray([])
    })
  }

  buildPartitionsPayload(baseList){
   return baseList.map(record=>{
      if(!record.racks.reduce((sum,acc)=>acc.occupiedCapacity+sum,0)){
        record.racks.map((x)=>{x.occupiedCapacity=null;x.availableCapacity = x.capacity; return x;});
        record.entityId = null;
        record.minBidPrice = null;
        record.alloted = false;
      }
      return record;
    });
  }

  buildPayload(formValue){
    const { baseList } = formValue;
    const partitions = this.buildPartitionsPayload(baseList);
    return {
      partitions
    }
  }
  onSubmit(partition){
    this.patchWarehouseInstance(this.partitionInstance?.id,this.buildPayload(this.partitions.value),partition);
  }

}
