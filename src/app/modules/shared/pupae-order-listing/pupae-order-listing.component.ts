import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SO_STATUS } from 'src/app/constants/enum/constant.yarn.sales.order';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-pupae-order-listing',
  templateUrl: './pupae-order-listing.component.html',
  styleUrls: ['./pupae-order-listing.component.scss']
})
export class PupaeOrderListingComponent implements OnInit {

  
  constructor(
    private apiSearch:SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private modelService:NgbModal,
    private snackBar:MatSnackBar
    ) { }

    rowDataList:any[]=[];
res:any[]=[];
totalRecords:number = 0;
modalRef;

@Input()
pupaeBuyerId:number;

tableHeaders:any=[
  {name:"RM CODE", sortName:'id'},
  {name:"Buyer NAME", sortName:'pupaeBuyer.name', sort:true},
  {name:"PHONE", sortName:'pupaeBuyer.phone', sort:true},
  {name:"Total Quantity", sortName:'sellingWeight', sort:true},
  {name:'Total Amount', sortName: 'netAmount',sort:true},
  {name:'payment Status', sortName: 'paymentStatus',sort:true},
  {name:'Order Status', sortName: 'pupaeOrderStatus',sort:true},
  {name:'CREATED DATE', sortName: 'createdDate',sort:true},
  {name:'ACTION'},
];

@ViewChild('changeStatusPopUp')
htmlContent:ElementRef

 CONSTANT = CONSTANT;
 onPageChange(data){
  const {paginationData,searchText,initial} = data;
  !initial && this.getPupaeLot(paginationData,searchText);
}

status:string;
pupaeListingObject:any;

changeStatus(status,index:number){
  this.status = status;
  this.pupaeOrderStatus = status;
  this.pupaeListingObject = this.res[index];
  this.modelService.open(this.htmlContent)
}

markProcessing(){
  this.updateStatusAPI(this.pupaeListingObject.id,this.status,)
}

onCancel(){
  this.modelService.dismissAll();
  this.getPupaeLot();
}

infoFromTable(info){
  const { edit,data,details,index,popup} = info;
  details&&(this.routeToDetailspage(index));
  edit&&(this.routeToEditPage(index));
  popup&&this.changeStatus(data,index);
}
routeToEditPage(index){
  this.router.navigate([`/resha-farms/pupae-order/crud/`,this.res[index]?.id]);
}

 routeToDetailspage(index){
  this.router.navigate([`/resha-farms/pupae-order/details/`,this.res[index]?.id]);
 }
 buildSerachQuery(searchText){
  const text = searchText.replace(/ /gi,"*");
  let query;
  if(searchText){
    if(!isNaN(searchText)){
      query = `( id==${searchText} or pupaeBuyer.name==*${text}* or pupaeBuyer.phone==*${text}* `
    }else if(searchText.includes('RMPUPODR')&&searchText.substring(8).length&&!isNaN(searchText.substring(8))){
      query = `( id==${searchText.substring(8)} or pupaeBuyer.name==*${text}* or pupaeBuyer.phone==*${text}* `
    }else{
      query = `( pupaeBuyer.name==*${text}* or pupaeBuyer.phone==*${text}* `
    }
    this.pupaeBuyerId && (query+=` pupaeBuyer.id==${this.pupaeBuyerId}`)
    query+=` )`
    return query;
  }
  if(this.pupaeBuyerId){
    return `pupaeBuyer.id ==${this.pupaeBuyerId}`;
  }
return false;
}

getPupaeLot(paginationData=false,searchText=''){
this.ngxLoader.stop();
this.apiSearch.getAllPupaeOrder(paginationData,this.buildSerachQuery(searchText)).then(res=>{
  this.rowDataList = [];
  this.res = res['content'];
  res['content'].filter(record=>{
    const obj={};
    obj['RM CODE'] = record?.code ? record?.code : ' - ',
    obj['Buyer NAME'] = record?.pupaeBuyer?.name ? record?.pupaeBuyer?.name : ' - ',
    obj['PHONE'] = record?.pupaeBuyer?.phone ? record?.pupaeBuyer?.phone  : ' - ',
    obj['Total Quantity'] = record?.sellingWeight ? record?.sellingWeight : ' - ',
    obj['Total Amount'] = record?.netAmount ? record?.netAmount : ' - ',
    // obj['Order Status'] = record?.pupaeOrderStatus ? record?.pupaeOrderStatus : ' - ',
    obj['payment Status'] = record?.paymentStatus ? record?.paymentStatus : ' - ',
    obj['Order Status']= {
      'status': record.pupaeOrderStatus,
      'STATUS_ORDERS':this.statusChangeConFig(record.pupaeOrderStatus)
    };
    obj['CREATED DATE'] = record?.createdDate ? this.utils.getDisplayTime(record?.createdDate)  : ' - ';
    let paymentInfo:any = {...record};
    paymentInfo.totalQuantity = record['sellingWeight'];
    paymentInfo.displayTotalAmount = (record['netAmount'])?.toString()
    paymentInfo.customerIdKey = "pupaebuyer"
    paymentInfo.productIdKey ="pupaeorder"
    paymentInfo.customerIdValue = `/pupaebuyer/${record?.pupaeBuyerId}`,
    paymentInfo.productIdValue = `/pupaeorder/${record?.id}`,
    paymentInfo.endpoint = "pupaesvc/pupaebuyerpayout";
    obj['ACTION'] = paymentInfo;
    this.CONSTANT.PAYMENT_GENERIC ='ACTION';
    this.CONSTANT.ID="RM CODE";
    this.CONSTANT.SELECTE_POPUP="Order Status";
     this.rowDataList.push(obj);
  });
  this.totalRecords = res['totalElements'];
  this._cd.detectChanges();
})
}

pupaeOrderStatus;
statusChangeConFig(status){
  SO_STATUS
  switch (status) {
    case 'New':
      return SO_STATUS.New;
    case 'Cancel':
      return SO_STATUS.Cancel;
    case 'Delivered':
      return SO_STATUS.Delivered;
    case 'Shipped':
      return SO_STATUS.Shipped;
    case 'Completed':
      return SO_STATUS.Completed;
  }
}

cottonOrderId;
cottonOrderStatus;
updateStatusAPI(id:number,status:string){
  this.apiSearch.updatePupaeOrderStatus(id,{pupaeOrderStatus:status}).then(res=>{
    this.modelService.dismissAll();
    this.snackBar.open('Status Updated successfully', 'Ok', {
     duration: 3000
   });
   this.getPupaeLot();
  }).catch(res=>{
    this.getPupaeLot();
    this.snackBar.open('Something Went Wrong', 'Ok', {
     duration: 3000
   });
   this.modelService.dismissAll()
  });
}

ngOnInit(): void {
this.getPupaeLot();
}
}
