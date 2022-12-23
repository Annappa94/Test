import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-cocoon-spliting',
  templateUrl: './cocoon-spliting.component.html',
  styleUrls: ['./cocoon-spliting.component.scss']
})
export class CocoonSplitingComponent implements OnInit {

  constructor(private route:ActivatedRoute,
    private _cd:ChangeDetectorRef,
    private api:ApiService,
    private apiSearch:SearchService,
    private utils:UtilsService,
    private snackBar:MatSnackBar,
    private ngxLoader: NgxUiLoaderService) { }

  selectedLot:any;
  bidList = [];
  splitedSlectedLot:UntypedFormGroup = new UntypedFormGroup({
    baseList:new UntypedFormArray([]),
    mandi:new UntypedFormControl('',[Validators.required]),
    bid:new UntypedFormControl(),
    startTimePlaceHolder:new UntypedFormControl('')
  });

  ngOnInit(): void {
    const { selectedLot } = this.route.snapshot.queryParams
    this.selectedLot = JSON.parse(selectedLot);
    this.getAllMandi();
    this.getInprogressBid();
    this.updateSelectedLotSplit(this.selectedLot);
  }
  mandiList=[];

  getAllMandi(){
    this.api.getWarehouseList().then(res => {
      this.mandiList = res['_embedded']['warehouse'];
      this._cd.detectChanges();
    });
  }

  getInprogressBid(wareHouseId=false){
    let searchQuery =`( status=='INPROGRESS' `;
    wareHouseId && (searchQuery+= `and warehouse==${wareHouseId}`);
    searchQuery+=')'
    this.apiSearch.specAPIForBid(false, 'biddings', searchQuery).then(res => {
     this.bidList = res['content'];
     this.updateStartTimeMandiBid(res['content']);
     this._cd.detectChanges();
    });
  }

  updateStartTimeMandiBid(res=[]){
    if(res.length){
      this.splitedSlectedLot.get('bid').setValue(res[0]?.id);
      this.splitedSlectedLot.get('startTimePlaceHolder').setValue(this.utils.getDisplayTime(res[0]?.startTime));
      this.splitedSlectedLot.get('mandi').setValue(res[0]?.warehouse); 
    }else{
      this.splitedSlectedLot.get('bid').setValue(null);
      this.splitedSlectedLot.get('startTimePlaceHolder').setValue(null);
    }
  }

updateSelectedLotSplit(selectedLots){
  for(let lot of selectedLots){
   this.updateLot(lot.record)
  }
  this._cd.detectChanges();
}

updateLot(lot){
  (this.splitedSlectedLot.get('baseList') as UntypedFormArray).push(new UntypedFormGroup({

    /**  Lot Id, 
     * Procured Lot weight, 
     * Bid weight, 
     * Jilly weight, 
     * Double weight, 
     * split button 
     * and attach to bid, 
     * mandi dropdown, bid dropdown
      **/
    lotId:new UntypedFormControl(lot.id),
    warehouseId: new UntypedFormControl(''),
    warehouseReceivedWeight: new UntypedFormControl(lot.availableQuantity),
    warehouseWeightLoss: new UntypedFormControl(lot.centerCocoonWeightLoss),
    bidWeight: new UntypedFormControl(lot.availableQuantity-((lot.warehouseSplitJhilliWeight)+(lot.warehouseSplitDoubleWeight?lot.warehouseSplitDoubleWeight:0)),[Validators.min(1),Validators.required]),
    warehouseSplitReceivedWeight: new UntypedFormControl(lot.availableQuantity),
    warehouseSplitJhilliWeight: new UntypedFormControl(lot.warehouseSplitJhilliWeight,[Validators.min(0)]),
    warehouseSplitJhilliPricePerKg: new UntypedFormControl(lot.warehouseSplitJhilliPricePerKg,lot.warehouseSplitJhilliWeight?[Validators.required,Validators.min(0)]:[]),
    warehouseSplitDoubleWeight: new UntypedFormControl(lot.warehouseSplitDoubleWeight,[Validators.min(0)]),
    warehouseSplitDoublePricePerKg: new UntypedFormControl(lot.warehouseSplitDoublePricePerKg, lot.warehouseSplitDoubleWeight?[Validators.required,Validators.min(0)]:[]),
  }))
}

weightChanged(index:number){
  const record = (this.splitedSlectedLot.get('baseList') as UntypedFormArray).at(index);
  const bidWeight = record.get('warehouseSplitReceivedWeight').value - (record.get('warehouseSplitJhilliWeight').value + record.get('warehouseSplitDoubleWeight').value)
  record.get('bidWeight').patchValue(bidWeight);
  let weightLoss=  record.get('warehouseReceivedWeight').value - record.get('warehouseSplitReceivedWeight').value ;
  record.get('warehouseWeightLoss').patchValue(weightLoss);
  this._cd.detectChanges();
}

saveLot(lot,needToAttachBid=false){
  lot.warehouseId = this.splitedSlectedLot.get('mandi').value;
  
  if(needToAttachBid){
    if(!this.splitedSlectedLot.get('bid').value){
      this.snackBar.open('There is no bid in the system', 'Ok', {
        duration: 3000
      });
      return;
    }

    if(!lot.warehouseSplitJhilliWeight&&!lot.warehouseSplitDoubleWeight){
      /** Don't create a child lot if JhilliWeight and DoubleWeight are 0*/
      lot.warehouseSplitJhilliWeight=null
      lot.warehouseSplitDoubleWeight=null
      lot.warehouseSplitJhilliPricePerKg=null
      lot.warehouseSplitDoublePricePerKg=null
    }

  }
  this.splitCocoonLot(lot.lotId,lot,needToAttachBid)
}

attachLotsToBid(lotId,needToAttachBid){
  if(needToAttachBid){
    this.api.attachLotsToBid(this.splitedSlectedLot.get('bid').value,lotId,true).then(res=>{
      this.snackBar.open('Lot attached to a bid successfully', 'Ok', {
        duration: 3000
      });
    });
  }
}

splitCocoonLot(lotId:number,payload,needToAttachBid){
  this.ngxLoader.stop();
  this.api.splitCocoonLot(lotId,payload).then(res=>{
    this.attachLotsToBid(lotId,needToAttachBid)
    this.snackBar.open('Received successfully', 'Ok', {
      duration: 3000
    });
  }).catch(err=>{
    this.snackBar.open(err.error.data, 'Ok', {
      duration: 3000
    });
  })
}

isBidWeightValid(fromArray:UntypedFormArray,index:number,controlName){
  return fromArray.at(index).get(controlName).invalid ;
}


listenForWarehouseSplitJhilliWeight(index:number){
  const warehouseSplitJhilliWeight = (this.splitedSlectedLot.get('baseList') as UntypedFormArray)?.at(index);
  warehouseSplitJhilliWeight?.get('warehouseSplitJhilliWeight')?.valueChanges?.pipe(distinctUntilChanged()).subscribe(value=>{
    if(value){
      warehouseSplitJhilliWeight?.get('warehouseSplitJhilliPricePerKg').setValidators([Validators.required]);
      warehouseSplitJhilliWeight?.get('warehouseSplitJhilliPricePerKg').updateValueAndValidity();
    }else{
      warehouseSplitJhilliWeight?.get('warehouseSplitJhilliPricePerKg').setValidators([]);
      warehouseSplitJhilliWeight?.get('warehouseSplitJhilliPricePerKg').updateValueAndValidity();
    }
  });
}

listenForWarehouseSplitDoubleWeight(index:number){
  const warehouseSplitDoubleWeight =   (this.splitedSlectedLot.get('baseList') as UntypedFormArray)?.at(index);
  warehouseSplitDoubleWeight?.get('warehouseSplitDoubleWeight')?.valueChanges?.pipe(distinctUntilChanged()).subscribe(value=>{
    if(value){
      warehouseSplitDoubleWeight?.get('warehouseSplitDoublePricePerKg').setValidators([Validators.required]);
      warehouseSplitDoubleWeight?.get('warehouseSplitDoublePricePerKg').updateValueAndValidity();
    }else{
      warehouseSplitDoubleWeight?.get('warehouseSplitDoublePricePerKg').setValidators([]);
      warehouseSplitDoubleWeight?.get('warehouseSplitDoublePricePerKg').updateValueAndValidity();
    }
  });
}

}
