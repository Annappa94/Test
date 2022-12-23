import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss']
})
export class SalesOrderComponent implements OnInit {

  @ViewChild('content') div;
  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    private apiSearch:SearchService,
    private utils:UtilsService,
    private modalService: NgbModal,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
  ) 
  {
    this.jsonObject = <JSON>this.salesorderObj;
   }
  jsonObject: JSON;
  
  CONSTANT = CONSTANT;
  salesDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  closeResult: string;
  selectedLGPartner:any;
  paginationData:boolean = false;
  searchText:string = '';
  rowDataList:any[]=[];
  salesOrderResponseData:any;
  filterForm:UntypedFormGroup = new UntypedFormGroup({
    devicePlanType:new UntypedFormControl('(RentalPlan,NormalPayment)'),
    devicePaymentStatus:new UntypedFormControl('(Paid,Pending)'),
  })

  salesorderObj: any = [
    {
      "salesId": 1,
      "farmerName": "farmer 1",
      "totalAmount": "amount 1",
      "paymentStatus": "status 1",
      "action": ""
    },
    {
      "salesId": 2,
      "farmerName": "farmer 2",
      "totalAmount": "amount 2",
      "paymentStatus": "status 2",
      "action": ""
    },
    {
      "salesId": 3,
      "farmerName": "farmer 3",
      "totalAmount": "amount 3",
      "paymentStatus": "status 3",
      "action": ""
    }
  ]

  tableHeaders:any=[
    {name:"Sales Order ID", sortName:'salesId'},
    {name:"Farmer", sortName:'farmerName', sort:true},
    {name:"Plan Type", sortName:'planType', sort:true},
    {name:"Payment Status", sortName:'paymentStatus', sort:true},
    {name:'ACTION'},
  ];

  ngOnInit(): void {
    this.getsalesorderData();
    this.listenForFilterFormChanges();
  }

  listenForFilterFormChanges(){
    this.filterForm.valueChanges.subscribe(x=>{
      this.getsalesorderData();
    })
  }

  tableInfo(info){
    const { edit,data,details,index} = info;
    details&&(this.routeToSalesOrderDetails(index));
    
 }
 routeToSalesOrderDetails(index){
  this.router.navigate([`/resha-farms/device-management/sales-order-details`,this.res[index].salesId]);
 }

  getsalesorderData(paginationData=false,searchText=''){

    this.apiSearch.getAllDeviceSalesOrdersData(this.paginationData,this.buildSerachQuery(searchText)).then(res => {
      console.log(res);
      this.salesOrderResponseData= res['content'];
      this.salesDataList=[]; 
      this.salesOrderResponseData.forEach((record:any) => {
        this.salesDataList.push({
              "Sales Order": record['code'],
              "Farmer": record['famerName'] + ' - '+ record['farmerPhone'],
              "Plan Type": record['devicePlanType'],
              "Payment Status":record['devicePaymentStatus'],
              "Action":'edit',
        });
      })
     this._cd.detectChanges();
    })
  } 

  buildSerachQuery(searchText:any=this.searchText){
    const { devicePlanType,devicePaymentStatus} = this.filterForm.value;
      let query = `(devicePlanType =in= ${devicePlanType} and devicePaymentStatus=in=${devicePaymentStatus}`;
        if (searchText) {
         let text=searchText.replace(/ /gi,"*");
         let query:String=`(`;
         (query+=`((code == *${text}*  or famerName == *${text}* or farmerPhone==*${text}*) and devicePlanType=in=${devicePlanType} and devicePaymentStatus=in=${devicePaymentStatus}`);
         searchText.toString()?.toUpperCase()?.includes('RMDMSO')&&!isNaN(searchText.substring(6))&&(query+=` or code==*RMDMSO${searchText.substring(6)}*`)
         !isNaN(parseInt(searchText))&&(query+=` or code==*RMDMSO${searchText}*`)
         query+='))';
         return query;
       }
       query+=')'
       return query;
  
   }
  
  
}