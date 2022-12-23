import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';

@Component({
  selector: 'app-bidding-crud',
  templateUrl: './bidding-crud.component.html',
  styleUrls: ['./bidding-crud.component.scss'],
})
export class BiddingCrudComponent implements OnInit {
  form: UntypedFormGroup;
  constructor(
    private api:ApiService,
    private apiSearch:SearchService,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private snackBar:MatSnackBar,
    private _cd:ChangeDetectorRef,
    private ngxLoader : NgxUiLoaderService
    ) {

     }

   biddingCreateForm:UntypedFormGroup = new UntypedFormGroup({
    startTime:new UntypedFormControl('',[Validators.required]),
    endTime:new UntypedFormControl('',[Validators.required]),
    type:new UntypedFormControl('COCOON',[Validators.required]),
    additionalTimeInMinutes:new UntypedFormControl(0, [Validators.min(0)]),
    warehouse:new UntypedFormControl('',[Validators.required])
  })

  id:number;

  ngOnInit(): void {
    const { id } = this.activatedRoute.snapshot.params;
    this.id = id;
    this.getAllWarehouseList();
    if(this.id){
      this.getBiddingById();
    }
  }

  save(data){
    let payload = {...data};
    payload['startTime'] = Date.parse(payload['startTime']);
    payload['endTime'] = Date.parse(payload['endTime']);

    if(this.id){
     this.updateBidding(this.id,payload)
    }else{
     this.createBidding(payload);
    }
  }

  createBidding(payload){
    this.apiSearch.createRecord('bidding',payload).then(res=>{
      this.router.navigate(['/resha-farms/bid/bid-list'])
      this.snackBar.open('Created Successfully', 'Ok', {
        duration: 3000
      });
     }).catch(err=>{
      this.snackBar.open(err?.error?.message, 'Ok', {
        duration: 5000
      });
     });
  }

  updateBidding(id:number,payload){
    this.apiSearch.updateRecord('bidding',id,payload).then(res=>{
      this.router.navigate(['bid/bid-list'])
      this.snackBar.open('Updated Successfully', 'Ok', {
        duration: 3000
      });
     }).catch(err=>{
      this.snackBar.open(err?.error?.message, 'Ok', {
        duration: 5000
      });
     });
  }

  getBiddingById(){
    this.ngxLoader.stop();
    this.apiSearch.getRecordById('bidding',this.id).then((res:any)=>{
      this.biddingCreateForm.patchValue(res);
      this.biddingCreateForm.get('startTime').setValue(new Date(res?.startTime));
      this.biddingCreateForm.get('endTime').setValue(new Date(res?.endTime));
      this._cd.detectChanges();
    });
  }

  getWHList(){
    this.ngxLoader.stop();
    this.apiSearch.specAPIForBid(false,'warehouselayout', false).then(res=>{
      this.warehouseList = [];
      res['content'].filter(record=>{
        if(record?.enabled){
          let obj=this.getWareHouseById(record.warehouse);
          obj['displayName'] = record?.name +' - '+ this.getWareHouseById(record.warehouse)?.name
          this.warehouseList.push(obj);
        }
      });
      this._cd.detectChanges();
    })
  }

  getWareHouseById(id:number){
    return this.allWareHouseList.find(warehouse=>warehouse.id == id);
  }

  warehouseList:any[] = [];
  allWareHouseList = [];
  getAllWarehouseList(){
    this.api.getAllWarehouse().then(res => {
       this.allWareHouseList = res['_embedded']['warehouse'];
       this.getWHList();
       this._cd.detectChanges();
    });
  }


}
