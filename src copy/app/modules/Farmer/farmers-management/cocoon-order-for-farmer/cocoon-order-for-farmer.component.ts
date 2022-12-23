import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-cocoon-order-for-farmer',
  templateUrl: './cocoon-order-for-farmer.component.html',
  styleUrls: ['./cocoon-order-for-farmer.component.scss']
})
export class CocoonOrderForFarmerComponent implements OnInit {
  
  constructor(
    private apiSearch:SearchService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private utils:UtilsService
  ) { }
  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  @Input()
  farmerId:number = 0;

  tableHeaders:any=[
    {name:"CHAWKI NAME", sortName:'chawki.name'},
    {name:"PRICE/DFL", sortName:'pricePerDFL', sort:true},
    {name:"TOTAL DFLS(RS.)", sortName:'totalDFLs', sort:true},
    {name:"TOTAL AMOUNT(RS.)", sortName:'totalAmount', sort:true},
    {name:'PAYMENT STATUS', sortName: 'paymentStatus',sort:true},
    {name:'ORDER STATUS', sortName: 'inputOrderStatus',sort:true},
    {name:'DELIVERY DATE', sortName: 'deliveryDate',sort:true},
    {name:'ORDER DATE', sortName: 'createdDate',sort:true},
  ];

   CONSTANT = CONSTANT;

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    !initial && this.getChawkiOrder(paginationData,searchText);
  }


  infoFromTable(info){
    const { edit,data,details,index,payNow,paymentDetailes} = info;
    console.log(data,payNow,paymentDetailes,index);
    details&&(this.routeToDetailspage(index));
  }
  
   routeToDetailspage(index){
    this.router.navigate([`/chawki/details`,this.res[index]?.chawkiId]);
   }

   buildSerachQuery(searchText){
     if(searchText&&!isNaN(searchText))
      return `(fmr.id == ${this.farmerId} and id ==${searchText} )`;
     
      return `(fmr.id == ${this.farmerId})`;
   }

  getChawkiOrder(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getchawkiOrder(paginationData,'chawkiorder',this.buildSerachQuery(searchText)).then(res=>{
      this.rowDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={};		  	
        obj['CHAWKI NAME'] = record?.chawkiName ? record?.chawkiName : ' - ',
        obj['PRICE/DFL'] = record?.pricePerDFL ? record?.pricePerDFL?.toLocaleString('en-IN') : ' - ',
        obj['TOTAL DFLS(RS.)'] = record?.totalDFLs ? record?.totalDFLs : 0,
        obj['TOTAL AMOUNT(RS.)'] = record?.totalAmount ? record?.totalAmount?.toLocaleString('en-IN'): 0,
        obj['PAYMENT STATUS'] = record?.paymentStatus ? record?.paymentStatus  : ' - ',
        obj['ORDER STATUS'] = record?.inputOrderStatus ? record?.inputOrderStatus  : ' - ',
        obj['DELIVERY DATE'] = record?.deliveryDate ? this.utils.getDisplayTime(record?.deliveryDate) : ' - ',
        obj['ORDER DATE'] = record?.createdDate ? this.utils.getDisplayTime(record?.createdDate)  : ' - ',
        this.CONSTANT.PHONE ='CHAWKI NAME',
        this.rowDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  ngOnInit(): void {
    this.farmerId && this.getChawkiOrder();
  }

}
