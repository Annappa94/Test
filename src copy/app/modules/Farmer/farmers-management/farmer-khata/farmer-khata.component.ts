import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-farmer-khata',
  templateUrl: './farmer-khata.component.html',
  styleUrls: ['./farmer-khata.component.scss']
})
export class FarmerKhataComponent implements OnInit {


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
  farmarId:number = 0;

  tableHeaders:any=[
    {name:"RM CODE", sortName:'id'},
    {name:"WEIGHT(KG)", sortName:'lotWeight', sort:true},
    {name:"TYPE", sortName:'type', sort:true},
    {name:"PRICE/KG (RS.)", sortName:'pricePerKg', sort:true},
    {name:'TOTAL (RS.)', sortName: 'totalPrice',sort:true},
    {name:'PAYMENT DUE', sortName: 'paymentDate',sort:true},
    {name:'PAYMENT STATUS', sortName: 'paymentStatus',sort:true},
    {name:'PAYMENT DATE', sortName: 'farmerPayout.createdDate',sort:true},
  ];

   CONSTANT = CONSTANT;

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    !initial && this.getCocoonPurchaseKhata(paginationData,searchText);
  }


  infoFromTable(info){
    const { edit,data,details,index,payNow,paymentDetailes} = info;
    console.log(data,payNow,paymentDetailes,index);
    details&&(this.routeToDetailspage(index));
  }
  
   routeToDetailspage(index){
    this.router.navigate([`/resha-farms/cocoon-lot/details/`,this.res[index]?.id]);
   }

   buildSerachQuery(searchText){
     if(searchText&&!isNaN(searchText))
      return `(farmer.id == ${this.farmarId} and id ==${searchText} )`;
     
      return `(farmer.id == ${this.farmarId})`;
   }

  getCocoonPurchaseKhata(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getOrders(paginationData,'cocoonlot',this.buildSerachQuery(searchText)).then(res=>{
      this.rowDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={};
        obj['RM CODE'] = record?.code ? record?.code : ' - ',
        obj['WEIGHT(KG)'] = record?.lotWeight ? record?.lotWeight : ' - ',
        obj['TYPE'] = record?.type ? record?.type  : 0,
        obj['PRICE/KG (RS.)'] = record?.pricePerKg ? record?.pricePerKg?.toLocaleString('en-IN') : 0,
        obj['TOTAL (RS.)'] = record?.totalPrice ? record?.totalPrice.toLocaleString('en-IN')  : 0,
        obj['PAYMENT DUE'] = record?.paymentDate ? this.utils.getDisplayTime(record?.paymentDate) : ' - ',
        obj['PAYMENT STATUS'] = record?.paymentStatus ? record?.paymentStatus : ' - ',
        obj['PAYMENT DATE'] = record?.farmerPayout?.createdDate ? this.utils.getDisplayTime(record?.farmerPayout?.createdDate): ' - '
        this.CONSTANT.ID ='RM CODE',
        this.rowDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  ngOnInit(): void {
    this.farmarId && this.getCocoonPurchaseKhata();
  }

}
