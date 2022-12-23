import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { COTTON_BALE_STATUS } from 'src/app/constants/enum/constant.cottonbale';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { PaymentInfo } from 'src/app/modules/shared/generic-payment/generic-payment.component';


@Component({
  selector: 'app-bales-sales-list',
  templateUrl: './bales-sales-list.component.html',
  styleUrls: ['./bales-sales-list.component.scss']
})
export class BalesSalesListComponent implements OnInit {

  baleSalesDataList:any;
  balesPOList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  closeResult: string;
  selectedLGPartner:any;
  paginationData:boolean = false;
  searchText:string = '';
  tableHeaders:any=[
    {name:"RM code", sortName:'id'},
    {name:"Spinning Mill", sortName:'spinningMill.name', sort:true},
    {name:"Phone", sortName:'spinningMill.phone', sort:true},
    {name:"Total Weight", sortName:'totalWeight', sort:true},
    {name:"Total Amount", sortName:'totalAmount', sort:true},
    {name:"Order Status", sortName:'orderStatus', sort:true},
    {name:"Payment Status", sortName:'paymentStatus', sort:true},
    {name:"Created Date", sortName:'createdDate', sort:true},
    {name:'ACTION'},
  ];
  CONSTANT = CONSTANT;
  cottonSaleOrderId: any;

  @Input()
  cottonBalePurchaseProformaID:number;

  @Input()
  cottonBalePurchaseSpinningID:number;

  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    private apiSearch:SearchService,
    private utils:UtilsService,
    private modalService: NgbModal,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
  ) { }
  filterForm:UntypedFormGroup = new UntypedFormGroup({
    status:new UntypedFormControl('New'),
    orderStatus:new UntypedFormControl('(NEW,READYFORSHIPMENT,SHIPPED,CANCELED,DELIVERED)'),
  })

  ngOnInit(): void {
    this.getBaleSalesList();
    this.listenForFilterChanges();

  }

  listenForFilterChanges(){
    this.filterForm.valueChanges.subscribe(value=>{
     this.getBaleSalesList();
    })
  }
  @ViewChild('changeStatusPopUp')
  changeStatusPopUp:ElementRef;

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    this.paginationData = paginationData;
    this.searchText = searchText;
    !initial && this.getBaleSalesList(paginationData,searchText);

  }


  tableInfo(info){
    const { edit,data,details,index, switchIconToggle,rowCheckBox,popup} = info;
     details&&(this.routeToDetailspage(index));
     popup&&this.changesStatusByOpeningPopup(data,index);
    // edit&&(this.routeToEditPage(index));
    // switchIconToggle&&(this.openBlacklistPopUp(index));
    // rowCheckBox&&this.selectedDeviceListFromTable(index)

  }

  cancellationReason;
  cottonBaleOrderStatus:string;
  changesStatusByOpeningPopup(status,index){
   this.cottonBaleOrderStatus = status;
   this.cottonSaleOrderId = this.res[index].id;
   this.modalService.open(this.changeStatusPopUp);
  }

  markProcessing(){
    this.ngxLoader.stop()
    this.api.patchCottonBale(this.cottonSaleOrderId,{orderStatus:this.cottonBaleOrderStatus}).then(res=>{
      this.modalService.dismissAll();
      this.getBaleSalesList();
    })
  }
  onCancel(){
    this.modalService.dismissAll();
    this.getBaleSalesList();
  }

  routeToDetailspage(index){
    this.router.navigate([`/resha-farms/bale-sales/details`,this.res[index]?.id]);
   }

//   buildSerachQuery(searchText){
//     const text = searchText.replace(/ /gi,"*");
//     const {orderStatus} = this.filterForm.value;

//     if(searchText){
//       if(!isNaN(searchText)){
//         return `(id==${searchText} or spinningMill.name==*${text}* or spinningMill.phone==*${text}* or totalWeight==*${text}* or totalAmount==*${text}* or paymentStatus==*${text}* ) and orderStatus=in=${orderStatus} `
//       }
//       if(searchText.includes('RMCOBSO')&&!isNaN(searchText.substring(7))){
//         return `(id==${searchText.substring(7)} or spinningMill.name==*${text}* or spinningMill.phone==*${text}*)`
//       }else{
//         return `(id==${searchText} or spinningMill.name==*${text}* or spinningMill.phone==*${text}* or totalWeight==*${text}* or totalAmount==*${text}*  or orderStatus==*${text}* or paymentStatus==*${text}*)`
//       }
//     }
//   return ;
//  }


 buildSerachQuery(searchText:any){
  const {orderStatus} = this.filterForm.value;
  let query = ` (orderStatus=in=${orderStatus}`;
      if (searchText) {
       let text=searchText.replace(/ /gi,"*");
       let query:String=`(`;
       (query+=`((spinningMill.name==*${text}* or spinningMill.phone==*${text}*) and orderStatus=in=${orderStatus}`);
       searchText.toString()?.toUpperCase()?.includes('RMCOBSO')&&!isNaN(searchText.substring(7))&&(query+=` or id==${searchText.substring(7)}`)
       !isNaN(parseInt(searchText))&&(query+=` or id==${searchText}`)
       query+='))';
       return query;
     }
     if(this.cottonBalePurchaseProformaID){
      (this.cottonBalePurchaseProformaID && (query+= ` and cottonBalePurchaseProforma.id==${this.cottonBalePurchaseProformaID}`))
     }
     if(this.cottonBalePurchaseSpinningID){
      (this.cottonBalePurchaseSpinningID && (query+= ` and spinningMill.id==${this.cottonBalePurchaseSpinningID}`))

     }

     query+=')'

     return query;

 }


  getBaleSalesList(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getCottonSalesOrders(paginationData,this.buildSerachQuery(searchText)).then(res=>{
      this.baleSalesDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={};
        obj['RM CODE'] = record?.code ? record?.code : ' - ',
        obj['SPINNING MILL'] = record?.spinningMill?.name ? record?.spinningMill?.name : ' - ',
        obj['PHONE'] = record?.spinningMill?.phone ? record?.spinningMill?.phone  : ' - ',
        obj['TOTAL WEIGHT'] = record?.totalWeight ? record?.totalWeight : ' - ',
        obj['TOTAL AMOUNT'] = record?.totalAmount ? record?.totalAmount : ' - ',
        obj['ORDER STATUS']= {
          'status': record?.orderStatus,
          'STATUS_ORDERS':this.statusChangeConFig(record?.orderStatus)
        },
        obj['PAYMENT STATUS'] = record?.paymentStatus ? record?.paymentStatus : ' - ',
        obj['CREATED DATE'] = record?.createdDate ? this.utils.getDisplayDate(record?.createdDate)  : ' - ';
        //this.cottonBalePurchaseProformaID = record?.cottonBalePurchaseProforma.id;
        let paymentInfo:PaymentInfo = {...record};
        paymentInfo.totalQuantity = record['totalWeight']
        //paymentInfo.dueAmount = 100
        paymentInfo.displayTotalAmount = (record['netAmount'])?.toString()
        paymentInfo.customerIdKey = "spinningMill"
        paymentInfo.productIdKey ="cottonBaleSalesOrder"
        paymentInfo.customerIdValue = `/spinningmill/${record?.spinningMill?.id}`,
        paymentInfo.productIdValue = `/cottonbalesalesorder/${record?.id}`,
        paymentInfo.endpoint = "cottonsvc/spinningmillpayment";
        obj['ACTION'] = paymentInfo ,
        // obj['editAction'] = 'ACTION',
        this.CONSTANT.ID ='RM CODE',
        this.CONSTANT.ACTION ='editAction',
        this.CONSTANT.SELECTE_POPUP="ORDER STATUS";
        this.CONSTANT.PAYMENTSTATUS = 'PAYMENT STATUS'
        this.CONSTANT.PAYMENT_GENERIC ='ACTION',


        this.baleSalesDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  statusChangeConFig(status){
    switch (status) {
      case 'NEW':
        return COTTON_BALE_STATUS.NEW;
      case 'READYFORSHIPMENT':
        return COTTON_BALE_STATUS.READYFORSHIPMENT;
      case 'SHIPPED':
        return COTTON_BALE_STATUS.SHIPPED;
      case 'CANCELED':
        return COTTON_BALE_STATUS.CANCELED;
      case 'DELIVERED' :
        return COTTON_BALE_STATUS.DELIVERED;
    }
  }
}
