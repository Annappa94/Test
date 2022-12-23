import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { COTTON_LOT_STATUS } from 'src/app/constants/enum/constant.cottons';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { PaymentInfo } from '../../shared/generic-payment/generic-payment.component';

@Component({
  selector: 'app-cotton-lot-list',
  templateUrl: './cotton-lot-list.component.html',
  styleUrls: ['./cotton-lot-list.component.scss']
})
export class CottonLotListComponent implements OnInit {


  constructor(
    private apiSearch:SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private modalService: NgbModal,
    private api:ApiService,
    public globalService:GlobalService
  ) { }
  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  selectedCottonLot:any[] = [];
  user = JSON.parse(localStorage.getItem('_ud'));
  filterForm:UntypedFormGroup = new UntypedFormGroup({
    status:new UntypedFormControl('New'),
    orderStatus:new UntypedFormControl('(New,Purchased,Returned,Cancelled)'),
  })
  @Input()
  farmarId:number;

  tableHeaders:any=[
    {name:"RM CODE", sortName:'id'},
    {name:"Farmer Name", sortName:'farmerName', sort:true},
    {name:"Farmer Phone", sortName:'farmerPhone', sort:true},
    {name:"Centre", sortName:'centerName', sort:true},
    {name:'Type', sortName: 'cottonType',sort:true},
    {name:'Weight', sortName: 'lotWeight',sort:true},
    {name:'Available Weight(in kgs)', sortName: 'lotWeight',sort:true},
    {name:'STATUS', sortName: 'status',sort:true},
    {name:'PAYMENT STATUS', sortName: 'paymentStatus',sort:true},
    {name:'Order Status', sortName: 'cottonLotStatus',sort:true},
    {name:'Created Date', sortName: 'createdDate',sort:true},
    {name:'Actions'},
  ];

  CONSTANT = CONSTANT;
  cottonLotId:number;
  @ViewChild('changeStatusPopUp')
  changeStatusPopUp:ElementRef;

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    !initial && this.getCottonLotList(paginationData,searchText);
  }


  infoFromTable(info){
    const { edit,data,details,index,payNow,paymentDetailes,popup,rowCheckBox} = info;
    details&&(this.routeToDetailspage(index));
    edit&&(this.routeToEditDetails(index));
    popup&&this.changesStatusByOpeningPopup(data,index);//data is Status;
    rowCheckBox&&this.selectedCottonLotFromTable(index)
  }

  selectedCottonLotFromTable(index:number){
      this.res[index];
      if(!this.selectedCottonLot.find(lot=>lot?.id == this.res[index].id)){
       this.selectedCottonLot.push(this.res[index]);
       console.log(this.selectedCottonLot);

      }else{
        this.selectedCottonLot.splice(this.selectedCottonLot.indexOf(lot=>lot?.id == this.res[index].id),1)
        console.log(this.selectedCottonLot);
      }
  }

  cancellationReason;
  cottonLotOrderStatus:string;
  changesStatusByOpeningPopup(status,index){
   this.cottonLotOrderStatus = status;
   this.cottonLotId = this.res[index].id;
   this.modalService.open(this.changeStatusPopUp);
  }

   routeToDetailspage(index){
    this.router.navigate([`/resha-farms/cottonlot/details/`,this.res[index]?.id]);
   }

   routeToEditDetails(index){
    this.router.navigate([`/resha-farms/cottonlot/crud/`,this.res[index]?.id]);
   }

   listenForFilterChanges(){
     this.filterForm.valueChanges.subscribe(value=>{
      this.getCottonLotList();
     })
   }

   buildSearchQuery(searchText){
    const { status,orderStatus} = this.filterForm.value;
    let query = `(status =in= ${status} and cottonLotStatus=in=${orderStatus}`;
      if (searchText) {
       let text=searchText.replace(/ /gi,"*");
       let query:String=`(`;
       (query+=`((farmerName == *${text}*  or farmerPhone == *${text}* or centerName==*${text}*) and status=in=${status} and cottonLotStatus=in=${orderStatus}`);
       searchText.toString()?.toUpperCase()?.includes('RMCOLT')&&!isNaN(parseInt(searchText.substring(6)))&&(query+=` or id==${searchText.substring(6)}`)
       !isNaN(parseInt(searchText))&&(query+=` or id==${searchText}`)
       query+='))';
       return query;
     }
     (this.farmarId)&&(query+=` and farmerId ==${this.farmarId} `);
     query+=')'
     return query;


       // if(searchText&&!isNaN(searchText)){
       //   query = `((farmerName == *${searchText}*  or id ==${searchText} or farmerPhone == *${searchText}* or centerName==*${searchText}*) and status==${status} and cottonLotStatus=in=${orderStatus}`
       //   this.farmarId &&(query+=` and farmerId ==${this.farmarId}`)
       //    searchText.toString()?.toUpperCase()?.includes('RMCOLT')&&!isNaN(parseInt(searchText.substring(6)))&&(query+=` or id==${searchText.substring(6)}`)
       // }else if(searchText){
       //   query = `((farmerPhone == *${searchText}*) and status==${status} and cottonLotStatus=in=${orderStatus}`;
       //    searchText.toString()?.toUpperCase()?.includes('RMCOLT')&&!isNaN(parseInt(searchText.substring(6)))&&(query+=` or id==${searchText.substring(6)}`)
       // }
       // (this.farmarId)&&(query+=` and farmerId ==${this.farmarId} `);
       // query+=`)`;
       // return query;
   }

  getCottonLotList(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getOrdersCotton(paginationData,'cottonlot',this.buildSearchQuery(searchText)).then(res=>{
      this.rowDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={};
        obj['RM CODE'] = {
          isDisplay:record.cottonLotStatus=='Purchased' && record.status !='Sold',
          code:record?.code,
          selected:this.selectedRecord(record.id)
        },
        obj['Farmer Name'] = record?.farmerName ? record?.farmerName : ' - ',
        obj['Farmer Phone'] = record?.farmerPhone ? record?.farmerPhone : ' - ',
        obj['Centre'] = record?.centerName ? record?.centerName  : ' - ',
        obj['Type'] = record?.cottonType ? record?.cottonType : ' - ',
        obj['Weight'] = record?.lotWeight ? record?.lotWeight : ' - ',
        obj['Available Weight(in kgs)'] = record?.availableQuantity ? record?.availableQuantity  : 0,
        obj['STATUS'] = record?.status ? record?.status : ' - ',
        obj['PAYMENT STATUS'] = record?.paymentStatus ? record?.paymentStatus : ' - ',
        obj['Order Status']= {
          'status': record.cottonLotStatus,
          'STATUS_ORDERS':this.statusChangeConFig(record.cottonLotStatus)
        },
        obj['Date'] = record?.createdDate ? this.utils.getDisplayTime(record?.createdDate) : ' - ';
        let paymentInfo:PaymentInfo = {...record};
        paymentInfo.totalQuantity = record['lotWeight']
        paymentInfo.displayTotalAmount = (record['netPayableAmount'])?.toString()
        paymentInfo.customerIdKey = "farmerId"
        paymentInfo.productIdKey ="cottonLot"
        paymentInfo.customerIdValue = record?.farmerId,
        paymentInfo.productIdValue = `/cottonlot/${record?.id}`;
        paymentInfo.endpoint = "cottonsvc/cottonfarmerpayout";
        obj['Actions'] = paymentInfo
        // this.CONSTANT.ID ='RM CODE',
        this.CONSTANT.SELECTE_POPUP="Order Status";
        this.CONSTANT.SELECT_ROW="RM CODE";
        this.CONSTANT.PAYMENT_GENERIC ='Actions',

        this.rowDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  selectedRecord(id:number){
    return this.selectedCottonLot.find(record=>record.id == id)?true:false;
  }

  statusChangeConFig(status){
    switch (status) {
      case 'New':
        return COTTON_LOT_STATUS.NEW;
      case 'Purchased':
        return COTTON_LOT_STATUS.PURCHASED;
      case 'Returned':
        return COTTON_LOT_STATUS.RETURENED;
      case 'Cancelled':
        return COTTON_LOT_STATUS.CANCELLED;
    }
  }


  async onMarkSold() {
    this.globalService.cottonData = this.selectedCottonLot;
    this.router.navigate(['/resha-farms/cotton-orders/crud']);
  }

  markProcessing(){
    this.ngxLoader.stop()
    this.api.patchCottonLot(this.cottonLotId,{cottonLotStatus:this.cottonLotOrderStatus}).then(res=>{
      this.modalService.dismissAll();
      this.getCottonLotList();
    })
  }

  ngOnInit(): void {
    this.listenForFilterChanges();
    this.getCottonLotList();
  }

  onCancel(){
    this.modalService.dismissAll();
  }

  navigateToNewLot() {
    this.router.navigate(['/resha-farms/cottonlot/crud']);
  }


}
