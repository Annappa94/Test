import { ChangeDetectorRef, Inject, LOCALE_ID, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { MatDialog } from '@angular/material/dialog';
import { FollowupsCrudComponent } from '../../../shared/followup-crud/followups-crud.component';
import { FormArray, UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { I } from '@angular/cdk/keycodes';
import {ClipboardModule} from '@angular/cdk/clipboard';


@Component({
  selector: 'app-iot-subscriptions',
  templateUrl: './iot-subscriptions.component.html',
  styleUrls: ['./iot-subscriptions.component.scss']
})
export class IotSubscriptionsComponent implements OnInit {

  ticketsList = [];
  searchedFarmers = [];
  filteredTicketsList = [];
  searchText;
  activeSort = '';
  datePipe;
  ticketItem;
  modalRef;
  closeResult: string;
  selectedStatus ='';
  fileName = 'farmers-list.xlsx';

  paginationData = {
    currentPage : 0,
    pageSize    : 10,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  };
  tableHeader = {
    id : 1,
    name : 0,
    phone : 0,
    chaakiDate : 0,
    address: {
      'village' : 0,
    },
    center: {
      'centerName' : 0
    },
    cocoonType : 0,
    createdDate: 0,
  };
  exportData = [];
  totalElements: any;
  userType: any;
  res: any;
  subscriptionData: any;
  referenceNumber: any;
  reasonToCancel: any;
  cancelledReason: any;
  deviceAuthResponse: any;
  smsData: any;



  constructor( private api: ApiService,
    private utils: UtilsService,
    private router: Router,
    private form: UntypedFormBuilder,
    private _cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private globalService: GlobalService,
    @Inject(LOCALE_ID) private locale: string,
    public dialog: MatDialog,
    private ngxLoader : NgxUiLoaderService,
    private route:ActivatedRoute,
    private apiSearch:SearchService,
    private ClipboardModule:ClipboardModule) {
      this.userType = JSON.parse(localStorage.getItem('_ud'));
      this.cancelledReason = false;

     }

  ngOnInit(): void {
    this.getDeviceSubscription();
  }
  async onPageChange(page) {
    this.paginationData.currentPage = page;
    this.getDeviceSubscription();

  }
  async onPageSizeChange() {
    this.getDeviceSubscription();
  }
  openPayment(recordpayment,data){
    this.subscriptionData = data;    
    this.modalRef = this.modalService.open(recordpayment)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  cancelPayment(cancelpayment,data){
    this.subscriptionData = data;
    this.modalRef = this.modalService.open(cancelpayment)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  openViewTokens(viewTokens,data){
    this.subscriptionData = data;
    console.log( this.subscriptionData);
    this.modalRef = this.modalService.open(viewTokens)
    this.getdevicedataByDeviceID(this.subscriptionData?.deviceId)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  getdevicedataByDeviceID(deviceId){
    this.ngxLoader.stop();
    this.api.getDeviceDataByID(deviceId).then(response=>{
      console.log(response);
      this.deviceAuthResponse = response;
      this.smsData = "1234 set auth key-"+this.deviceAuthResponse?.authKey;
      
    })
  }

  getDeviceSubscription(searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getAllDeviceSubscriptionsData(this.paginationData,this.buildSerachQuery(searchText)).then(res=>{
      
      this.res = res['content'];
      this.paginationData.total = res['totalElements'];      
      this._cd.detectChanges();
    })
  }


  buildSerachQuery(searchText){
    //const { productType,businessVertical} = this.filterForm.value;
    let query = `(productType=in=IOT and businessVertical=in=RESHA_FARMS`;
    if (searchText) {
      let text=searchText.replace(/ /gi,"*");
      let query:String=`(`;
      (query+=`((code==*RMDTYPE${searchText}* or deviceName==*${text}* or brand==*${text}* or manufacturer==*${text}* or vendor==*${text}*) and productType =in=IOT and businessVertical=in=RESHA_FARMS`);
      searchText.toString()?.toUpperCase()?.includes('RMDTYPE')&&!isNaN(parseInt(searchText.substring(7)))&&(query+=` or code==*RMDTYPE${searchText.substring(7)}*`)
      !isNaN(parseInt(searchText))&&(query+=` or code==*RMDTYPE${searchText}*`)
      query+='))';
      return query;
    }
      query+=')'
      return query;
 }

 subscriptiionPlanPayment(){
   let reqObj= {
    "amount": this.subscriptionData?.dueAmount,
    "subscriptionId": this.subscriptionData?.id,
    "referenceId": this.referenceNumber,
  }
  if (this.subscriptionData?.nextBillDate == null) {
    reqObj['billType'] = "DEPOSIT"
  }
   this.api.subscriptionPayment(reqObj).then(res=>{
    this.modalRef.close();
    this.getDeviceSubscription();
    
   })
 }
  changeReason(event){
    this.reasonToCancel = event.target.value;
    if (this.reasonToCancel == "Others") {
      this.cancelledReason = true;
    }

  }
  cancelSubscription(){
    let reqOBJ={
      "reasonForCancellation": this.reasonToCancel
    }
    this.api.cancelSubscription(this.subscriptionData?.id,reqOBJ).then(response=>{
      this.modalRef.close();
      this.getDeviceSubscription();
      
    })
    
  }
}

