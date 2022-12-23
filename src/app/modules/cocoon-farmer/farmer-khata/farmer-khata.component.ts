import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-farmer-khata',
  templateUrl: './farmer-khata.component.html',
  styleUrls: ['./farmer-khata.component.scss']
})
export class FarmerKhataComponent implements OnInit {
  userType:any;
  salesUptick: { A_PLUS: number; A: number; B_PLUS: number; B: number; C: number; DOUBLECOCOON: number; JHILLI:number;};
  salesRoles =['COCOON_SALES_EXEC','COCOON_SALES_MANAGER','COCOON_SALES_HEAD'];

  constructor(
    private api:ApiService,
    private apiSearch:SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
  ) {
    this.userType = JSON.parse(localStorage.getItem('_ud'));

    
   }
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
        let displaySalesTotalPrice:any = ((record.totalPrice - record.grossAmount)  + (record.lotWeight * (record.receivedWeightPricePerKg * this.salesUptick[record.rmGrade]) )).toFixed(2);

        obj['RM CODE'] = record?.code ? record?.code : ' - ',
        obj['WEIGHT(KG)'] = record?.lotWeight ? record?.lotWeight : ' - ',
        obj['TYPE'] = record?.type ? record?.type  : 0,
        obj['PRICE/KG (RS.)'] =record.receivedWeightPricePerKg ? (record.receivedWeightPricePerKg * this.salesUptick[record.rmGrade]).toFixed(2) : record.pricePerKg.toLocaleString('en-IN'),
        obj['TOTAL (RS.)'] = record?.totalPrice ?  (displaySalesTotalPrice).toLocaleString('en-IN')  : 0,
        obj['PAYMENT DUE'] = record?.paymentDate ? this.utils.getDisplayDate(record?.paymentDate) : ' - ',
        obj['PAYMENT STATUS'] = record?.paymentStatus ? record?.paymentStatus : ' - ',
        obj['PAYMENT DATE'] = record?.farmerPayout?.createdDate ? this.utils.getDisplayTime(record?.farmerPayout?.createdDate): ' - ',
        // obj['displayReceivedWeightPricePerKg']= element.receivedWeightPricePerKg ? (element.receivedWeightPricePerKg * this.salesUptick[element.rmGrade]).toFixed(2) : element.pricePerKg.toLocaleString('en-IN')

        this.CONSTANT.ID ='RM CODE',
        this.rowDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  ngOnInit(): void {
    let UserRoleFilter = this.userType.roles.some(i => this.salesRoles.includes(i));
    
    this.salesUptick = {
      "A_PLUS": 1,
      "A" : 1,
      "B_PLUS": 1,
      "B" : 1,
      "C":1,
      "DOUBLECOCOON":1,
      "JHILLI":1

    };

    if(UserRoleFilter ) {
      this.api.getConfigByConfig('com.reshamandi.v1.cocoon_lot.procurement.sales.uptick.a_plus').then((res:any)=> {
        this.salesUptick['A_PLUS'] = res?.value;
        console.log(this.salesUptick);
        this.api.getConfigByConfig('com.reshamandi.v1.cocoon_lot.procurement.sales.uptick.a').then((res:any)=> {
          this.salesUptick['A'] = res?.value;
          console.log(this.salesUptick);
          this.api.getConfigByConfig('com.reshamandi.v1.cocoon_lot.procurement.sales.uptick.b_plus').then((res:any)=> {
            this.salesUptick['B_PLUS'] = res?.value;
            console.log(this.salesUptick);
            this.api.getConfigByConfig('com.reshamandi.v1.cocoon_lot.procurement.sales.uptick.b').then((res:any)=> {
              this.salesUptick['B'] = res?.value;
              console.log(this.salesUptick);
              this.api.getConfigByConfig('com.reshamandi.v1.cocoon_lot.procurement.sales.uptick.c').then((res:any)=> {
                this.salesUptick['C'] = res?.value;
                console.log(this.salesUptick);
                this.farmarId && this.getCocoonPurchaseKhata();
              });
            });
          });
        });
      });
      
    } else {
      this.farmarId && this.getCocoonPurchaseKhata();
    }
  }

}
