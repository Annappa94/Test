import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { OnlineProduct } from 'src/app/model/qbuster/onlineproducts.model';
import { OnlineStore } from 'src/app/model/qbuster/onlinestore.model';
import { Product } from 'src/app/model/qbuster/product.model';
import { Store } from 'src/app/model/qbuster/store.model';
import { ApiService } from 'src/app/services/api/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qb-marketplace',
  templateUrl: './qb-marketplace.component.html',
  styleUrls: ['./qb-marketplace.component.scss']
})
export class QbMarketplaceComponent implements OnInit {

  onlineStore:OnlineStore;
  productList:any[]=[];
  stores:any[]=[];
  tableHeaders:any=[
    {name:"image",sort:true},
    {name:"ID",sort:true},
    {name:"product Name",sort:true},
    {name:"variant Name",sort:true},
    {name:"category ID",sort:true},
    {name:"category Name",sort:true},
    {name:"online Price",sort:true,type:"Price"},
    {name:"mrp",sort:true,type:"Price"},
    {name:"discount %",sort:true,type:"Price"},
    {name:"price Includes Taxes",sort:true,type:"Price"},
    {name:"inventory Level",sort:true},
    {name:"safe Stock Level",sort:true},
    {name:"sub Category Name",sort:true},
    {name:"brand Name",sort:true},
 ];
  searchText:String;
  public storeCtrl: UntypedFormControl = new UntypedFormControl('');
  
  public storeFilterCtrl: UntypedFormControl = new UntypedFormControl();
  
  public filteredStores: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleSelect') singleSelect: MatSelect;

    /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  constructor(
    private api: ApiService,
    private ngxLoader : NgxUiLoaderService,
  ) {

  }
  getAllOnlineStores(){
    this.ngxLoader.stop();
    this.api.getAllOnlineStoresRMBackend({
      "thirdPartyChainID":environment.qbThirdPartyChainID,
      "chainID":environment.qbChainID
      }).then((res:OnlineStore) => {
         this.onlineStore=res;
         res.storeData.forEach((store:Store)=>{
          this.stores.push({name:store.storeName,chainId:store.chainID,storeId:store.storeID});
          });
         this.storeCtrl.setValue(this.stores[0]);
         // load the initial bank list
         this.filteredStores.next(this.stores.slice());
    }).then(res => {
      this.getAllProducts({
        thirdPartyChainID:environment.qbThirdPartyChainID,
        chainID:this.onlineStore.storeData[0]?.chainID,
        storeID:this.onlineStore.storeData[0]?.storeID
    })
    });
  }

  getAllProducts(body){
    this.ngxLoader.stop();
    this.api.getAllOnlineProductsRMBackend(body).then((res:OnlineProduct) => {
      this.productList=[];
      res.catalogueData.forEach((ele:Product) =>{
        this.productList.push({
          "image": ele.image,
          "ID": ele.productID?ele.productID:'-',
          "product Name": ele.productName?ele.productName:'-',
          "variant Name": ele.variantName?ele.variantName:'-',
          "category ID": ele.categoryID?ele.categoryID:'-',
          "category Name": ele.categoryName?ele.categoryName:'-',
          "online Price": ele.onlinePrice?ele.onlinePrice:'0',
          "mrp": ele.mrp?ele.mrp:'0',
          "discount %": ele.discountPercentage?ele.discountPercentage:'0',
          "price Includes Taxes": ele.priceIncludesTaxes?ele.priceIncludesTaxes:'0',
          "inventory Level": ele.inventoryLevel?ele.inventoryLevel:'-',
          "safe Stock Level": ele.safeStockLevel?ele.safeStockLevel:'-',
          "sub Category Name": ele.subCategoryName?ele.subCategoryName:'-',
          "brand Name": ele.brandName?ele.brandName:'-',
        })
        this.searchText=''
      });
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
    this.getAllProducts({
      thirdPartyChainID:environment.qbThirdPartyChainID,
      chainID:store.chainId,
      storeID:store.storeId
    })
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
