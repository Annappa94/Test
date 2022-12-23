import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-chawki-order-listing',
  templateUrl: './chawki-order-listing.component.html',
  styleUrls: ['./chawki-order-listing.component.scss']
})
export class ChawkiOrderListingComponent implements OnInit {



  constructor(
    private apiSearch:SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
  ) { }
  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  @Input()
  chawkiId:number = 0;

  tableHeaders:any=[
    {name:"ID", sortName:'id'},
    {name:"FARMER", sortName:'farmer.phone', sort:true},
    {name:"PRICE/DFL", sortName:'pricePerDFL', sort:true},
    {name:"TOTAL DFLS(RS.)", sortName:'totalDFLs', sort:true},
    {name:'TOTAL AMOUNT(RS.)', sortName: 'totalAmount',sort:true},
    {name:'DISCOUNT(RS.)', sortName: 'totalDiscount',sort:true},
    {name:'PAYMENT STATUS', sortName: 'paymentStatus',sort:true},
    {name:'ORDER STATUS', sortName: 'inputOrderStatus',sort:true},
    {name:'DELIVERY DATE', sortName: 'deliveryDate',sort:true},
    {name:'ORDER DATE', sortName: 'createdDate',sort:true},
  ];

   CONSTANT = CONSTANT;

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    !initial && this.getChawkiOrderByChawkiId(paginationData,searchText);
  }


  infoFromTable(info){
    const { details,index,detailsAttr} = info;
    if(details){
      if(detailsAttr == this.CONSTANT.PHONE){
        this.routeToFramerDetails(index)
      }
      if(detailsAttr == this.CONSTANT.ID){
        this.routeToDetailspage(index)
      }
    }
  }
  
   routeToDetailspage(index){
    this.router.navigate([`/resha-farms/chawki-orders/details/`,this.res[index]?.id]);
   }

   routeToFramerDetails(index){
    this.router.navigate([`/resha-farms/farmers/details/`,this.res[index]?.farmerId]);
   }

   buildSerachQuery(searchText){
     if(searchText&&!isNaN(searchText))
      return `(chawki.id == ${this.chawkiId} and ( id == ${searchText} or  farmer.phone == *${searchText}*))`;
     
      return `(chawki.id == ${this.chawkiId})`;
   }

  getChawkiOrderByChawkiId(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getchawkiOrder(paginationData,'chawkiorder',this.buildSerachQuery(searchText)).then(res=>{
      this.rowDataList = [];
      this.res = res['content'];

      res['content'].filter(record=>{
        const obj={};
        obj['ID'] = record?.id ? record?.id : ' - ',
        obj['FARMER'] = record?.farmerPhone ? record?.farmerPhone : ' - ',
        obj['PRICE/DFL'] = record?.pricePerDFL ? record?.pricePerDFL?.toLocaleString('en-IN')  : 0,
        obj['TOTAL DFLS(RS.)'] = record?.totalDFLs ? record?.totalDFLs?.toLocaleString('en-IN') : 0,
        obj['TOTAL AMOUNT(RS.)	'] = record?.totalAmount ? record?.totalAmount?.toLocaleString('en-IN')  : 0,
        obj['DISCOUNT(RS.)'] = record?.totalDiscount ? record?.totalDiscount?.toLocaleString('en-IN') : ' - ',
        obj['PAYMENT STATUS'] = record?.paymentStatus ? record?.paymentStatus : ' - ',
        obj['ORDER STATUS'] = record?.inputOrderStatus ? record?.inputOrderStatus : ' - '
        obj['DELIVERY DATE'] = record?.deliveryDate ? this.utils.getDisplayTime(record?.deliveryDate): ' - '
        obj['ORDER DATE'] = record?.createdDate ? this.utils.getDisplayTime(record?.createdDate): ' - '
        this.CONSTANT.ID ='ID',
        this.CONSTANT.PHONE ='FARMER',
        this.rowDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  ngOnInit(): void {
    this.chawkiId && this.getChawkiOrderByChawkiId();
  }

}
