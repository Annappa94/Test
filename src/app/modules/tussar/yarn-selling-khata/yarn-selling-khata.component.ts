import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-yarn-selling-khata',
  templateUrl: './yarn-selling-khata.component.html',
  styleUrls: ['./yarn-selling-khata.component.scss']
})
export class YarnSellingKhataComponent implements OnInit {


  constructor(
    private apiSearch:SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private api:ApiService,
    private router:Router,
    // private snackBar:MatSnackBar,
    // private form: FormBuilder,
    // private modalService:NgbModal,
  ) { }
  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  @Input()
  reelerId:number = 0;

  tableHeaders:any=[
    {name:"RM CODE", sortName:'id'},
    {name:"TYPE", sortName:'type', sort:true},
    {name:"PRICE/KG (RS.)", sortName:'pricePerKg', sort:true},
    {name:"WEIGHT(KG)", sortName:'weight', sort:true},
    {name:'AMOUNT(RS.)', sortName: 'totalPrice',sort:true},
    {name:'PAYMENT STATUS', sortName: 'paymentStatus',sort:true},
    {name:'ORDER DATE', sortName: 'createdDate',sort:true},
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
    this.router.navigate([`yarn-po/details/`,this.res[index]?.id]);
   }

   buildSerachQuery(searchText){
     if(searchText&&!isNaN(searchText))
      return `(reeler.id == ${this.reelerId} and id ==${searchText} )`;
     
      return `(reeler.id == ${this.reelerId})`;
   }

  getCocoonPurchaseKhata(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getOrders(paginationData,'yarnlisting',this.buildSerachQuery(searchText)).then(res=>{
      this.rowDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={};

        obj['RM CODE'] = record?.code ? record?.code : ' - ',
        obj['TYPE'] = record?.type ? record?.type : ' - ',
        obj['PRICE/KG (RS.)'] = record?.pricePerKg ? record?.pricePerKg?.toLocaleString('en-IN')  : 0,
        obj['WEIGHT(KG)'] = record?.weight ? record?.weight?.toLocaleString('en-IN') : 0,
        obj['AMOUNT(RS.)'] = record?.totalPrice ? record?.totalPrice.toLocaleString('en-IN')  : 0,
        obj['PAYMENT STATUS'] = record?.paymentStatus ? record?.paymentStatus : ' - ',
        obj['ORDER DATE'] = record?.createdDate ? this.utils.getDisplayTime(record?.createdDate) : ' - ',

        // obj['ACTION'] = {
        //   status:record.orderPaymentStatus
        // },
        this.CONSTANT.ID ='RM CODE',
        // this.CONSTANT.PAYMENT = 'ACTION',
        this.rowDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  ngOnInit(): void {
    this.reelerId && this.getCocoonPurchaseKhata();
  }

}
