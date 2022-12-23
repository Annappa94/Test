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

@Component({
  selector: 'app-subscription-plan-list',
  templateUrl: './subscription-plan-list.component.html',
  styleUrls: ['./subscription-plan-list.component.scss']
})
export class SubscriptionPlanListComponent implements OnInit {
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
  subscriptionPlan: any;
  planStatus: any;
  planId: any;



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
    private apiSearch:SearchService,) {
      this.userType = JSON.parse(localStorage.getItem('_ud'));

     }

  ngOnInit(): void {
    this.getSubscriptionPlans();
  }
  redirectToEdit(id){
    this.router.navigate(['/resha-farms/iot/subscription/crud/',id])
  }

  getSubscriptionPlans(paginationData=false,searchText=''){
    this.apiSearch.getAllSubscriptionsData(paginationData,this.buildSerachQuery(searchText)).then(res=>{
        console.log(res);
        this.subscriptionPlan = res['content'];
        this.paginationData.total = res['totalElements'];         
        const pagesLength = this.paginationData.total / this.paginationData.pageSize;
        this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);  
        this._cd.detectChanges();        
    })
    
  }

  buildSerachQuery(searchText){
    const text = searchText.replace(/ /gi,"*");
    if(searchText){
      if(!isNaN(searchText)){
        return `(code==*RMDSUBP${searchText}* or deviceName==*${text}* or brand==*${text}* or manufacturer==*${text}* or vendor==*${text}*)`
      }
      if(searchText.includes('RMDSUBP')&&!isNaN(searchText.substring(7))){
        return `(code==*RMDSUBP${searchText.substring(7)}* or deviceName==*${text}* or brand==*${text}* or manufacturer==*${text}* or vendor==*${text}*)`
      }else{
        return `(deviceName==*${text}* or brand==*${text}* or manufacturer==*${text}* or vendor==*${text}*)`
      }
    }
  return ;
 }

 async onPageChange(page) {
  this.paginationData.currentPage = page;
  this.getSubscriptionPlans();
}
async onPageSizeChange() {
  this.getSubscriptionPlans();
}
  patchPlanStatus(StatusRequest,status,id){
    this.planStatus = status;
    this.planId = id;
    this.modalRef = this.modalService.open(StatusRequest);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed`;
    });
    console.log(status);
    

  }

  planStatusChangeApi(){
    this.ngxLoader.stop();

    this.api.patchSubscriptionPlan(this.planId,this.planStatus).then(response=>{
      console.log(response);
      
      this.getSubscriptionPlans();
      this.modalRef.close();
    }, error => {
      this.modalRef.close();
      console.log(error);
      
    })
    
  }
  redirectoDeviceType(id){
    this.router.navigate(['/resha-farms/device-management/devicetype-details/',id])
  }
}
