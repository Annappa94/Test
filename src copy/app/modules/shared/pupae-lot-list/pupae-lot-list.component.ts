import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PUPAE_LIST } from 'src/app/constants/enum/pupae.constant';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { SearchService } from 'src/app/services/api/search.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { PaymentInfo } from '../generic-payment/generic-payment.component';

@Component({
  selector: 'app-pupae-lot-list',
  templateUrl: './pupae-lot-list.component.html',
  styleUrls: ['./pupae-lot-list.component.scss']
})
export class PupaeLotListComponent implements OnInit {

  constructor(
    private apiSearch:SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private modelService:NgbModal,
    private snackBar:MatSnackBar,
    private globalService:GlobalService,
    ) { }

    rowDataList:any[]=[];
res:any[]=[];
totalRecords:number = 0;
modalRef;
selectedCottonLot = [];

@Input()
pupaeSupplierId:number;


tableHeaders:any=[
  {name:"RM CODE", sortName:'id'},
  {name:"NAME", sortName:'pupaeSupplier.name', sort:true},
  {name:"PHONE", sortName:'pupaeSupplier.phone', sort:true},
  {name:"net Payable Amount", sortName:'netPaybleAmount', sort:true},
  {name:'available Quantity', sortName: 'availableQuantity',sort:true},
  // {name:'status', sortName: 'status',sort:true},
  {name:'payment Status', sortName: 'paymentStatus',sort:true},
  {name:'CREATED DATE', sortName: 'createdDate',sort:true},
  {name:'CREATED BY', sortName: 'createdBy',sort:true},
  {name:'Status', sortName: 'status',sort:true},
  {name:'ACTION'},
];

filterForm:UntypedFormGroup = new UntypedFormGroup({
  status:new UntypedFormControl('New'),
  orderStatus:new UntypedFormControl('(New,Purchased,Returned,Cancelled)'),
})

@ViewChild('popupContent')
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
  this.pupaeListingObject = this.res[index];
  this.modelService.open(this.htmlContent)
}

markProcessing(){
  this.updateStatusAPI(this.pupaeListingObject.id,this.status,)
}

onCancel(){
  this.modelService.dismissAll();
}

infoFromTable(info){
  const { edit,data,details,index,payNow,paymentDetailes,popup,rowCheckBox} = info;
  details&&(this.routeToDetailspage(index));
  edit&&(this.routeToEditPage(index));
  popup&&this.changeStatus(data,index);//data is Status;
  rowCheckBox&&this.selectedCottonLotFromTable(index)
}

selectedCottonLotFromTable(index:number){
    this.res[index];
    if(!this.selectedCottonLot.find(lot=>lot?.id == this.res[index].id)){
     this.selectedCottonLot.push(this.res[index]);
    }else{
      this.selectedCottonLot.splice(this.selectedCottonLot.indexOf(lot=>lot?.id == this.res[index].id),1)
    }
}

async onMarkSold() {
  this.globalService.cottonData = this.selectedCottonLot;
  this.router.navigate(['/resha-farms/pupae-order/crud']);
}

routeToEditPage(index){
  this.router.navigate([`/resha-farms/rm-pupae-lot/crud/`,this.res[index]?.id]);
}

 routeToDetailspage(index){
  this.router.navigate([`/resha-farms/rm-pupae-lot/details/`,this.res[index]?.id]);
 }

 routeToCreateLot(){
   this.router.navigate(['/resha-farms/rm-pupae-lot/crud'])
 }

buildSearchQuery(searchText){
    const { status,orderStatus} = this.filterForm.value;
  const text = searchText.replace(/ /gi,"*");

  let query;
  if(searchText){
    if(!isNaN(searchText)){
      query = `((id==${searchText} or pupaeSupplier.name==*${text}* or pupaeSupplier.phone==*${text}*) and status=in=${status} and orderStatus=in=${orderStatus} `
    }else if(searchText.includes('RMPUPLST')&&searchText.substring(8).length&&!isNaN(searchText.substring(8))){
      query = `( id==${searchText.substring(8)} or pupaeSupplier.name==*${text}* or pupaeSupplier.phone==*${text}* `
    }else{
      query = `((pupaeSupplier.name==*${text}* or pupaeSupplier.phone==*${text}*) and status=in=${status} and orderStatus=in=${orderStatus}`
    }
    (this.pupaeSupplierId)&&(query+=` and pupaeSupplier.id ==${this.pupaeSupplierId}`);
    query+= ` and (status =in= ${status} and orderStatus=in=${orderStatus})`
    query+=` )`;
    return query;
  }
  // this.pupaeSupplierId && (query+=`) and ( pupaeSupplier.id==${this.pupaeSupplierId}`)
  // query+=` )`;

  if(this.pupaeSupplierId){
    return `pupaeSupplier.id ==${this.pupaeSupplierId} and (status =in= ${status} and orderStatus=in=${orderStatus})`;
  }
   
return `(status =in= ${status} and orderStatus=in=${orderStatus})`;
}


getPupaeLot(paginationData=false,searchText=''){
this.ngxLoader.stop();
this.apiSearch.getAllPupaeListing(paginationData,this.buildSearchQuery(searchText)).then(res=>{
  this.rowDataList = [];
  this.res = res['content'];
  res['content'].filter(record=>{
    const obj={};
    obj['RM CODE'] = {
      isDisplay:record.orderStatus=='Purchased' && record.status != 'Sold',
      code:record?.code,
      selected:this.selectedRecord(record.id)
    },
    obj['NAME'] = record?.pupaeSupplier?.name ? record?.pupaeSupplier?.name : ' - ',
    obj['PHONE'] = record?.pupaeSupplier?.phone ? record?.pupaeSupplier?.phone  : ' - ',
    obj['net Payable Amount'] = record?.netPaybleAmount ? record?.netPaybleAmount : ' - ',
    // orderStatus
    // obj['Status'] = record?.status ? record?.status : ' - ',
    obj['available Quantity'] = record?.availableQuantity ? record?.availableQuantity : '0',
    obj['payment Status'] = record?.paymentStatus ? record?.paymentStatus : ' - ',
    obj['CREATED DATE'] = record?.createdDate ? this.utils.getDisplayDate(record?.createdDate)  : ' - ',
    obj['CREATED BY'] = record?.createdBy ? record?.createdBy : ' - ',
    obj['status'] = record?.status ? record?.status : ' - ',
    obj['Order Status'] = {
      'status': record.orderStatus,
      'STATUS_ORDERS':this.statusChangeConFig(record.orderStatus)
    };


    let paymentInfo:PaymentInfo = {...record};
    paymentInfo.totalQuantity = record['sellingWeight']
    paymentInfo.displayTotalAmount = (record['netPaybleAmount'])?.toString()
    paymentInfo.customerIdKey = "pupaeSupplier"
    paymentInfo.productIdKey ="pupaeListing"
    paymentInfo.customerIdValue = `/pupaeSupplier/${record?.pupaeSupplierId}`,
    paymentInfo.productIdValue = `/pupaeListing/${record?.id}`,
    paymentInfo.endpoint = "pupaesvc/pupaesupplierpayout";
    obj['Actions'] = paymentInfo 
    this.CONSTANT.PAYMENT_GENERIC ='Actions',
    this.CONSTANT.SELECT_ROW ='RM CODE',
    this.CONSTANT.ACTION = 'ACTION',
    // this.CONSTANT.SELECTE_POPUP = 'status',
    this.CONSTANT.SELECTE_POPUP="Order Status";
    this.rowDataList.push(obj);
  });
  this.totalRecords = res['totalElements'];
  this._cd.detectChanges();
})
}

selectedRecord(id:number){
  return this.selectedCottonLot.find(record=>record.id == id)?true:false;
}

updateStatusAPI(id:number,status:string){
   this.apiSearch.updatePupaeStatus(id,{orderStatus:status}).then(res=>{
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

statusChangeConFig(status){
  switch (status) {
    case 'New':
      return PUPAE_LIST.NEW;
    case 'Returned':
      return PUPAE_LIST.RETURENED;
    case 'Purchased':
      return PUPAE_LIST.PURCHASED;
    case 'Cancelled':
      return PUPAE_LIST.CANCELLED;
  }
}

listenForFilterChanges(){
  this.filterForm.valueChanges.subscribe(value=>{
   this.getPupaeLot();
  })
}

ngOnInit(): void {
this.getPupaeLot();
this.listenForFilterChanges();
}
}
