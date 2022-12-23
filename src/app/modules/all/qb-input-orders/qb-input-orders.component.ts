import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Data, Invoice } from 'src/app/model/qbuster/Invoice.model';
import { OnlineStore } from 'src/app/model/qbuster/onlinestore.model';
import { Store } from 'src/app/model/qbuster/store.model';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qb-input-orders',
  templateUrl: './qb-input-orders.component.html',
  styleUrls: ['./qb-input-orders.component.scss']
})
export class QbInputOrdersComponent implements OnInit {
  onlineStore:OnlineStore;
  invoiceList:any[]=[];
  searchText:any='';
  date:any= new Date();
  slectedIds:any={chainID:'',storeID:''};
  tableHeaders:any=[
    {name:"order id",sort:true},
    {name:"invoice number",sort:true},
    {name:"instructions",sort:true},
    {name:"item level total charges",sort:true,type:"Price"},
    {name:"item level total taxes",sort:true,type:"Price"},
    {name:"order level total charges",sort:true,type:"Price"},
    {name:"order level total taxes",sort:true,type:"Price"},
    {name:"order subtotal",sort:true,type:"Price"},
    {name:"order total",sort:true,type:"Price"},
    {name:"payable amount",sort:true,type:"Price"},
    {name:"total charges",sort:true,type:"Price"},
    {name:"total taxes",sort:true,type:"Price"},
    {name:"order time",sort:true},
    {name:"order date",sort:true,type:"Date"},
 ];
  constructor(
    private api: ApiService,
    private ngxLoader : NgxUiLoaderService,
    private router:Router,
    public globalService: GlobalService
  ) {
  }
  private details:Data[];

  protected stores: any[]=[];

  public storeCtrl: UntypedFormControl = new UntypedFormControl('');
  
  public storeFilterCtrl: UntypedFormControl = new UntypedFormControl();
  
  public filteredStores: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleSelect') singleSelect: MatSelect;

    /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();


  getAllOnlineStores(){
    this.ngxLoader.stop();
    this.api.getAllOnlineStoresRMBackend({
      "thirdPartyChainID":environment.qbThirdPartyChainID,
      "chainID":environment.qbChainID
      }).then((res:OnlineStore) => {
         this.onlineStore=res;
         (res.storeData&&
          res.storeData.forEach((store:Store)=>{
            this.stores.push({name:store.storeName,chainId:store.chainID,storeId:store.storeID});
          })
          );
         this.storeCtrl.setValue(this.stores[0]);
         this.filteredStores.next(this.stores.slice());
         this.slectedIds={
           chainID:this.onlineStore.storeData[0]?.chainID,
           storeID:this.onlineStore.storeData[0]?.storeID
          }
    }).then(res => {
      let date=new Date(this.date).toLocaleString(("en-IN"), {day: '2-digit', month: '2-digit', year: 'numeric'}).split('/')
      this.getAllProducts({
      third_party_chain_id:environment.qbThirdPartyChainID,
      chain_id: this.onlineStore.storeData[0]?.chainID,
      store_id: this.onlineStore.storeData[0]?.storeID,
      sales_date:`${date[2]}-${date[1]}-${date[0]}`
     })
    });
  }

  getAllProducts(body){
    this.ngxLoader.stop();
    this.api.getAllStoreSalesInvoicesRMBackend(body).then((res:Invoice) => {
      this.invoiceList=[];
      (res.data&&
        res.data.forEach((ele:Data)=>{
          this.invoiceList.push({
            "order id": ele.details.order_id,
            "invoice number": ele.details.invoice_number,
            "instructions": ele.details.instructions,
            "item level total charges": ele.details.item_level_total_charges?.toLocaleString(),
            "item level total taxes": ele.details.item_level_total_taxes?.toLocaleString(),
            "order level total charges": ele.details.order_level_total_charges?.toLocaleString(),
            "order level total taxes": ele.details.order_level_total_taxes?.toLocaleString(),
            "order subtotal": ele.details.order_subtotal?.toLocaleString(),
            "order total": ele.details.order_total?.toLocaleString(),
            "payable amount": ele.details.payable_amount?.toLocaleString(),
            "total charges": ele.details.total_charges?.toLocaleString(),
            "total taxes": ele.details.total_taxes?.toLocaleString(),
            "order time": ele.details.order_total,
            "order date": ele.details.order_date,
           });         
        }))

      this.details=res.data;
    })
  }
  
  ngOnInit(): void {
    this.getAllOnlineStores();
     this.storeCtrl.setValue(this.stores[0]);
     this.filteredStores.next(this.stores.slice());
     this.storeFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks();
    });
    this.storeCtrl.valueChanges.subscribe(()=>{
      this.filterChange(this.storeCtrl.value);
    })
  }

  filterChange(store){
    let date=new Date(this.date).toLocaleString(("en-IN"), {day: '2-digit', month: '2-digit', year: 'numeric'}).split('/')
    this.getAllProducts({
        third_party_chain_id:environment.qbThirdPartyChainID,
        chain_id: store.chainId,
        store_id: store.storeId,
        sales_date:`${date[2]}-${date[1]}-${date[0]}`
       })
  }
  routeToDetails(index){
      this.globalService.tempValueData=this.details[index];
      this.router.navigate(['/resha-farms/qb-input-details-orders'])
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  ngAfterViewInit() {
    this.setInitialValue();
  }
  protected setInitialValue() {
    this.filteredStores
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredStores are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: any, b: any) => a && b && a.id === b.id;
      });
  }
  protected filterBanks() {
    if (!this.stores) {
      return;
    }
    // get the search keyword
    let search = this.storeFilterCtrl.value;
    if (!search) {
      this.filteredStores.next(this.stores.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredStores.next(
      this.stores.filter(stores => stores.name.toLowerCase().indexOf(search) > -1)
    );
  }

}
