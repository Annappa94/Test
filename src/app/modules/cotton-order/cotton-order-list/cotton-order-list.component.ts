import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SO_STATUS } from 'src/app/constants/enum/constant.yarn.sales.order';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { PaymentInfo } from '../../shared/generic-payment/generic-payment.component';

@Component({
  selector: 'app-cotton-order-list',
  templateUrl: './cotton-order-list.component.html',
  styleUrls: ['./cotton-order-list.component.scss']
})
export class CottonOrderListComponent implements OnInit {


  constructor(
    private apiSearch:SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private api:ApiService,
    private modalService:NgbModal
  ) { }
  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;

  @Input()
  ginnerId:number;

  tableHeaders:any=[
    {name:"RM CODE", sortName:'id'},
    {name:"Ginner Name", sortName:'ginner.name', sort:true},
    {name:"Mobile number", sortName:'ginner.phone', sort:true},
    {name:'Total Weight', sortName: 'sellingWeight',sort:true},
    {name:'Total Amount', sortName: 'netAmount',sort:true},
    {name:'Payment Status', sortName: 'paymentStatus',sort:true},
    {name:'Created Date', sortName: 'createdDate',sort:true},
    {name:'Order Status',sortName: 'cottonOrderStatus',sort:true},
    {name:'Action'},
   ];
   filterForm:UntypedFormGroup = new UntypedFormGroup({
    paymentStatus:new UntypedFormControl('(Paid,Pending)'),
  })

   CONSTANT = CONSTANT;

  @ViewChild('changeStatusPopUp')
  changeStatusPopUp:any;

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    !initial && this.getCottonOrders(paginationData,searchText);
  }


  infoFromTable(info){
    const { edit,data,details,index,popup,payNow,paymentDetailes} = info;
    details&&(this.routeToDetailspage(index));
    edit&&(this.routeToEditPage(index));
    popup&&this.changesStatusByOpeningPopup(data,index);//data is Status;
  }


  changesStatusByOpeningPopup(status,index){
    this.cottonOrderStatus = status;
    this.cottonOrderId = this.res[index].id;
    this.modalService.open(this.changeStatusPopUp);
   }


  routeToEditPage(index){
    this.router.navigate([`/resha-farms/cotton-orders/crud/`,this.res[index]?.id]);
  }

   routeToDetailspage(index){
    this.router.navigate([`/resha-farms/cotton-orders/details/`,this.res[index]?.id]);
   }

   buildSearchQuery(searchText){
     const {paymentStatus} = this.filterForm.value;
     let query = `(paymentStatus =in= ${paymentStatus}`;
     if(searchText&&!isNaN(searchText)){
      query = `(ginner.phone ==${searchText} or id ==${searchText}`;
        searchText.toString()?.toUpperCase()?.includes('RMCOTODR')&&!isNaN(parseInt(searchText.substring(8)))&&(query+=` or id==${searchText.substring(8)}`)
     }else if(searchText){
      query = `(ginner.name == ${searchText} or ginner.phone ==${searchText}`;
        searchText.toString()?.toUpperCase()?.includes('RMCOTODR')&&!isNaN(parseInt(searchText.substring(8)))&&(query+=` or id==${searchText.substring(8)}`)
     }
     (this.ginnerId)&&(query+=` and ginner.id ==${this.ginnerId} `);
     query+=`)`;
     return query;
   }

  getCottonOrders(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getOrdersCotton(paginationData,'cottonsales',this.buildSearchQuery(searchText)).then(res=>{
      this.rowDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={};
        obj['RM CODE'] = record?.code ? record?.code : ' - ',
        obj['Ginner Name'] = record?.ginnerObj?.name ? record?.ginnerObj?.name : ' - ',
        obj['Mobile number'] = record?.ginnerObj?.phone ? record?.ginnerObj?.phone  : ' _ ',
        obj['Total Weight'] = record?.sellingWeight ? record?.sellingWeight : ' - ',
        obj['Total Amount'] = record?.netAmount ? record?.netAmount : ' - ',
        obj['Payment Status'] = record?.paymentStatus ? record?.paymentStatus : ' - ',
        obj['Date'] = record?.createdDate ? this.utils.getDisplayTime(record?.createdDate) : ' - ';
        let paymentInfo:PaymentInfo = {...record};
        paymentInfo.totalQuantity = record['sellingWeight']
        paymentInfo.displayTotalAmount = (record['netReceivableAmount'])?.toString()
        paymentInfo.customerIdKey = "ginner"
        paymentInfo.productIdKey ="cottonOrder"
        paymentInfo.customerIdValue = `/ginner/${record?.ginnerId}`,
        paymentInfo.productIdValue = `/cottonOrder/${record?.id}`,
        paymentInfo.endpoint = "cottonsvc/ginnerpayment";
        obj['Order Status']= {
           'status': record.cottonOrderStatus,
           'STATUS_ORDERS':this.statusChangeConFig(record.cottonOrderStatus)
         },
        obj['Actions'] = paymentInfo;
        this.CONSTANT.SELECTE_POPUP="Order Status";
        this.CONSTANT.PAYMENT_GENERIC ='Actions',
        this.CONSTANT.ID ='RM CODE',
        obj['invoiceURL'] = record?.invoiceURL ? record?.invoiceURL : '';
        this.CONSTANT.COTTON_SALES = 'invoiceURL';
        this.rowDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  listenForFilterFormChanges(){
    this.filterForm.valueChanges.subscribe(x=>{
      this.getCottonOrders();
    })
  }
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
  markProcessing(){
    this.ngxLoader.stop()
    this.api.patchCottonOrder(this.cottonOrderId,{cottonOrderStatus:this.cottonOrderStatus}).then(res=>{
      this.modalService.dismissAll();
      this.getCottonOrders();
    })
  }

  onCancel(){
    this.modalService.dismissAll();
    this.getCottonOrders();
  }

  ngOnInit(): void {
    this.listenForFilterFormChanges();
    this.getCottonOrders();
  }
}
