import { ChangeDetectorRef, Inject, LOCALE_ID, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GoogleAnalyticsService } from 'ngx-google-analytics';


@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.scss']
})

export class ApprovalListComponent implements OnInit {
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
  blacklist:any;
  exportData = [];
  totalElements: any;
  filter:UntypedFormGroup = new UntypedFormGroup({
    productType:new UntypedFormControl('Silk'),
    csbStatus_Done:new UntypedFormControl(''),
    csbStatus_Pending:new UntypedFormControl(''),
    csbStatus_rejected: new UntypedFormControl('')
  }) 
  approvalFormProcess:UntypedFormGroup;
  userType:any;
  documentVerified: string;
  textSearch;
  enableSearch: boolean = false;
  idParam;
  farmerDetails: any;
  ticketStatus: any;
  groupUser: any;
  approvedGroupId: any;
  approvedGroupName: any;
  userRelatedGroupId: any;
  userRelatedGroupName: any;

 

  constructor(
    private api: ApiService,
    private utils: UtilsService,
    private router: Router,
    private form: UntypedFormBuilder,
    private _cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private globalService: GlobalService,
    private $gaService:GoogleAnalyticsService,
    @Inject(LOCALE_ID) private locale: string,
    public dialog: MatDialog,
    private ngxLoader : NgxUiLoaderService,
    private route:ActivatedRoute,
    private apiSearch:SearchService,) {
    this.userType = JSON.parse(localStorage.getItem('_ud'));    
    this.getUserGroupDataByUserId();
   }
   productType:string = 'Silk';
   async approvalProcessForm() {
    this.approvalFormProcess = this.form.group({
      approvedPrice: new UntypedFormControl('' , [Validators.required]),
      reason: new UntypedFormControl('',[Validators.required]),
      centerId: new UntypedFormControl(''),
    });
  }
    ngOnInit() {
      this.filter.get('productType').patchValue(this.productType);
      this.listenForFilterChanges();
      this.approvalProcessForm();
    }
    getUserGroupDataByUserId(){
      let id =JSON.parse(localStorage._ud)?.internalid;
      this.api.getUserGroupByUserIdUserid(id).then(response=>{
        this.groupUser = response['_embedded']['centergroup'];
        this.getApprovalList();
        
      })
    }
    async onPageChange(page) {
      this.paginationData.currentPage = page;
      this.getApprovalList()
      // if(this.enableSearch){
      //   const { productType } = this.filter.value;
      //   let searchParams = `(name==*${this.searchText.replace(/ /gi,"*")}* or phone==*${this.searchText.replace(/ /gi,"*")}* ${this.idParam} ${this.centerParam} and productType=in=${productType})`;
      // } else {
      //   this.getApprovalList()
      // }
    }
  
    listenForFilterChanges(){
      this.filter.valueChanges.subscribe(response=>{
        // if(response.csbStatus_Done && response.csbStatus_Pending){
        //     this.isdocumentsVerified = "";
        // }else if(response.csbStatus_Done && ){

        // }        
        this.getApprovalList();
        // this.afterSearch(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection,  this.onSearch()) 

      })
    }

  async refreshTable(ticketsList) {
    this.filteredTicketsList = [];
    this.paginationData.total = this.totalElements;
    const pagesLength = this.totalElements / this.paginationData.pageSize;
   // this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
    this.filteredTicketsList = ticketsList;
    this._cd.detectChanges();
  }


  getApprovalList() {
    this.ticketsList = [];
    this.ngxLoader.stop();
    // const { productType } = this.filter.value;
    // getAllFarmersListByPage
    this.apiSearch.getAllTicketListData(this.paginationData,this.buildSerachQuery()).then((res:any) => {
      this.ngxLoader.stop();
      this.totalElements = res['totalElements'];   
   
      res.forEach(element => {
        let isSameGroup = false;
        this.groupUser.forEach( group => {
          if(group.centerId == element?.stagingEntities?.data?.SelectedcenterID && (element?.originatorGroups && element?.originatorGroups.indexOf(group.id) > -1) ){
              isSameGroup = true;
              this.approvedGroupId = group['id'] ? group['id'] : "";
              this.approvedGroupName = group['groupName'] ? group['groupName'] : "";
              console.log( this.approvedGroupName);
              
          }
        });        
        this.ticketsList.push({
          code:element ? element?.externalId: '-',
          itemId:element?.id,
          originatorGroups : element?.originatorGroups ? element.originatorGroups : [],
          createdByGroupId: element?.stagingEntities?.data ? element?.stagingEntities?.data?.createdbyGroupId : '',
          cocoonImage:element?.stagingEntities?.data ? element?.stagingEntities?.data?.cocoonRendittaImage : '-',
          farmerName: element?.stagingEntities?.data ? element?.stagingEntities?.data?.farmer?.name : '-',
          FarmerPhone: element?.stagingEntities?.data ? element?.stagingEntities?.data?.farmer?.phone : '-',
          cocoonType:element?.stagingEntities?.data?.type,
          cocoonGrade:element?.stagingEntities?.data?.rmGrade,
          weight:element?.stagingEntities?.data?.receivedWeight,
          reqRate:element?.stagingEntities?.data?.newValue,
          totalAmnt:element?.stagingEntities?.data?.actualGrossAmount,
          approvalStatus:element?.status,
          allotedRate:(element && element?.minMaxPrice && element?.minMaxPrice[1]) ? element?.minMaxPrice[1] : 'N/A',
          centerID:element?.stagingEntities?.data?.SelectedcenterID,
          isSameGroup: isSameGroup,
          isLotCreated: element?.stagingEntities?.data.lotStatus ? element?.stagingEntities?.data.lotStatus: "",
          createdDate:element.createdDate ? element.createdDate : '--'
        });
      });
      this.refreshTable(this.ticketsList);
      this._cd.detectChanges();
      this.ngxLoader.stop();
      this.filteredTicketsList = this.ticketsList;
    });
  }
  

  async onSearch() {    
    this.enableSearch = true;
    this.paginationData.currentPage=0;
    this.getApprovalList();
  }

  buildSerachQuery(searchText:any=this.searchText){
       let query = `status=${this.selectedStatus}`;
        if (this.searchText) {
         let text=this.searchText.replace(/ /gi,"*");
         let query:String=``;
         (query+='status='+ this.selectedStatus);
         this.searchText.toString()?.toUpperCase()?.includes('RMTCKT')&&!isNaN(this.searchText.substring(6))&&(query+=`&&externalId=RMTCKT${this.searchText.substring(6)}`)
         !isNaN(parseInt(this.searchText))&&(query+=`&&externalId=RMTCKT${this.searchText}`)
         query+='';
         return query;
       }
        query+=''
        return query;
   }


  centerParam;
  appFarmers: any;

  async onSort(column) {
    this.activeSort = column;
    this.paginationData.currentColumn = column;
    if (this.tableHeader[column] === 0) {
      this.paginationData.currentDirection = 'desc';
      this.tableHeader[column] = 1;
    } else {
      this.paginationData.currentDirection = 'asc';
      this.tableHeader[column] = 0;
    }
    if(this.enableSearch){
      const { productType } = this.filter.value;
      let searchParams = `(name==*${this.searchText.replace(/ /gi,"*")}* or phone==*${this.searchText.replace(/ /gi,"*")}* ${this.idParam} ${this.centerParam}  and productType=in=${productType})`;
    } else {
      this.getApprovalList();
    }
     this.activeSort = column;
     this.paginationData.currentPage = 0;
  }
  
  async onPageSizeChange() {
    this.getApprovalList()
  }

  approvalProcess(content, item,status) {
    this.ticketStatus = status;
    this.ticketItem = item;
    this.approvalFormProcess.get('centerId').patchValue(this.ticketItem?.centerID);
    this.approvalFormProcess.get('approvedPrice').patchValue(this.ticketItem?.reqRate);
    this.getUserGroupBycnteranduserIds(this.ticketItem?.centerID);
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.approvalFormProcess.get('reason').patchValue('');

      }, (reason) => {
        this.closeResult = `Dismissed`;
        this.approvalFormProcess.get('reason').patchValue('');
    });
    
  }

  getUserGroupBycnteranduserIds(centreId){
    // getUserGroupData
    let centerId = centreId;
    let id =JSON.parse(localStorage._ud)?.internalid;
    this.api.getUserGroupData(centerId,id).then(res=>{      
      // this.userRelatedGroupId = res['_embedded'] ? res['_embedded']['centergroup'][0].id : "";
      this.userRelatedGroupId = res ? res['id'] : "";
      this.userRelatedGroupName = res ? res['groupName'] : "";
    })
  }

  updateTicketStatus(formData){
    let id =JSON.parse(localStorage._ud)?.internalid;
    let formDataObj = formData;
    formDataObj['ApprovedBy'] = this.userType?.phonenumber;
    formDataObj["updatedByName"] = this.userType.name;
    formDataObj["updatedByNumber"] = this.userType.phonenumber;
    formDataObj["updatedByGroup"] =  this.userRelatedGroupName;
    
  
    let tktParms= {
      "centerId": this.ticketItem?.centerID,
      "createdBy":id,
      "originatorGroup" : this.ticketItem?.originatorGroups.length ? this.ticketItem?.originatorGroups : [],
      "variables":
          {
          "requestId": {
              "value": this.ticketItem?.itemId,
              "type": "String"
          },
          "status": {
              "value": this.ticketStatus,
              "type": "String"
          },
          "approvedPrice":{
              "value": formData.approvedPrice,
              "type": "long"
          },
          "data": {
            "value" :formDataObj,
            "type" :"String"
          },
           
          
        }
      }      
    this.api.updateApprovalTicket(tktParms).then(response=>{
      this.$gaService.event(' Approval Request', ` Reason =  ${formData.reason}, Status=${this.ticketStatus}, ApprovedPrice = ${formData.approvedPrice}, ApprovedBy = ${this.userType?.phonenumber}`);

      this.modalRef.close();
      //this.getApprovalList();
      window.location.reload();
    })
  }
  purchaselot(id){
    this.router.navigate(['/resha-farms/cocoon-lot/ticket/'+ id]);
  }

  async onChangeStatus(event) {
    this.paginationData.currentPage = 0;
    this.searchText = '';
    this.selectedStatus = event.target.value;
    this.getApprovalList();
    //localStorage.setItem('cocoonLotStatus', this.selectedStatus);
   // this.getCocoonLotsList(0, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType);
  }

}

