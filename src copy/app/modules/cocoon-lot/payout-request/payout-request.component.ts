import { Component, ChangeDetectorRef, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { MatDialog } from '@angular/material/dialog';
import { FollowupsCrudComponent } from '../../shared/followup-crud/followups-crud.component';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ToastrService } from 'ngx-toastr';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

@Component({
  selector: 'app-payout-request',
  templateUrl: './payout-request.component.html',
  styleUrls: ['./payout-request.component.scss']
})
export class PayoutRequestComponent implements OnInit {
  payoutTicketList = [];
  searchedTickets = [];
  filteredpayoutTicketList :any[];
  selectedFARMER = [];
  CONSTANT = CONSTANT;
  searchText;
  activeSort = '';
  selectedStatus = '';
  datePipe;
  fileName = 'payoyt-request.xlsx';
  modalRef: any;
  closeResult: string;
  subscriptionPlan: any;
  private _cd: any;
  user: any;
  rolesService: any;
  userType: any;
  selectedUserId:any
  documentVerified: string;
  textSearch;
  enableSearch: boolean = false;
  
  idParam;
  blacklist: any;
  exportData = [];
  totalElements: any;
  paginationData = {
    currentPage: 0,
    pageSize: 10,
    total: 0,
    pages: [],
    currentColumn: 'createdDate',
    currentDirection: 'desc',
  };
  tableHeader = {
    ticketId: 1,
    farmer: 0,
    center: 0,
    payoutType: 0,
    requestedAmount: 0,
    payableAmountAmount: 0,
    status: 0,
  };
  filter: UntypedFormGroup = new UntypedFormGroup({
    productType: new UntypedFormControl('Silk'),
  })
  productType: string = 'Silk';
  paymentstatus = [{ name: 'APPROVED', value: 'APPROVED' }, { name: 'PENDING', value: "STARTED" }]
  payoutlot: any;
  totalamount: number;
  selectedLotItem: any;
  selectedPayoutLot:any[];
  selectedLotItemPrice: any;
  payloadList:any[];
  retainSelectedState: any;
  getAllPayoytTickets: any;
  cartLotItemsID: any[];
  selectAll = false;

  


  constructor(private api: ApiService,
    private utils: UtilsService,
    private router: Router,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private globalService: GlobalService,
    @Inject(LOCALE_ID) private locale: string,
    public dialog: MatDialog,
    private ngxLoader: NgxUiLoaderService,
    private route: ActivatedRoute,
    private apiSearch: SearchService,
    private toaster:ToastrService,
    private cdr: ChangeDetectorRef,
    private $gaService:GoogleAnalyticsService,
    ) {
      this.user = JSON.parse(localStorage.getItem('_ud'));
      this.selectedUserId = this.user?.internalid;

     }

  ngOnInit(): void {
    this.getticketList();
    this.filter.get('productType').patchValue(this.productType);

  }

  async opene(content,item) {
    
    this.selectedLotItem = item;
    this.selectedLotItemPrice = 0;
    this.payloadList = [];
    if (this.selectedLotItem != " ") {
      this.listOfApproval.push(this.selectedLotItem);
    } else {
      this.listOfApproval = this.filteredpayoutTicketList.filter(record=>record.selected); 
    }
    // this.listOfApproval = this.filteredpayoutTicketList.filter(record=>record.selected); 
    if (this.listOfApproval.length) {
      this.listOfApproval.forEach(item=>{
        this.selectedLotItemPrice += item?.paybaleamount;
        console.log(this.selectedLotItemPrice);
        this.payloadList.push({
          "createdBy":this.user?.phonenumber,
          centerId: item?.centerId,
          paybaleamount:item?.paybaleamount,
          variables: {
              requestId: {
                  value: item?.id,
                  type: "String"
              },
              status: {
                  value: 'approved',
                  type: "String"
              },
      
              data: {
                  value: {
                    approvedBy: "L3"
                  },
                  type: "String"
              },
              externalId : {
                value : item?.externalId,
                type : "String"
              }
          }
        })     
      })
      console.log(this.payloadList);
      
    }

    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.selectedLotItemPrice = 0;
      this.listOfApproval = [];
    }, (reason) => {
      this.closeResult = `Dismissed`;
      this.selectedLotItemPrice = 0;
      this.listOfApproval = [];
    });
  }

  getticketList() {
    if(this.selectAll){
      this.selectAll = false;
      this.listOfApproval = [];
    }
    this.payoutTicketList = [];
    this.ngxLoader.stop();
    this.apiSearch.getAllPayoytTickets(this.paginationData,this.buildSerachQuery()).then((res: any) => {
      this.payoutlot=res;
      
      // console.log('payoutlotpayoutlot',this.payoutlot);
      console.log('payoutlot',res)
      this.totalElements = res['totalElements'];
      this.totalamount = 0;
      res.forEach(element => {
        this.payoutTicketList.push({
          selected: false,
          ticketId: element?.payoutTicket?.code ? element?.payoutTicket?.code : '-',
          externalId: element?.externalId ? element?.externalId : '-',
          farmer: element?.payoutTicket?.payoutItem?.stakeHolderName ? element?.payoutTicket?.payoutItem?.stakeHolderName : '-',
          farmerphone: element?.payoutTicket?.payoutItem?.stakeHolderPhone ? element?.payoutTicket?.payoutItem?.stakeHolderPhone : '-',
          center: element?.payoutTicket?.payoutItem?.centerName ? element?.payoutTicket?.payoutItem?.centerName : '-',
          payoutType: element?.payoutTicket?.payoutItem?.itemType ? element?.payoutTicket?.payoutItem?.itemType : '-',
          requestedAmount: element?.payoutTicket?.payoutItem?.requestedAmount ? element?.payoutTicket?.payoutItem?.requestedAmount.toFixed(2) : '-',
          payableAmountAmount: element?.payoutTicket?.payoutItem?.payableAmount ? element?.payoutTicket?.payoutItem?.payableAmount.toFixed(2) : '-',
          status: element?.payoutTicket?.status ? element?.payoutTicket?.status : '-',
          ticketStatus: element?.status ? element?.status : '-',
          id: element?.id ? element?.id : '-',
          centerid:element?.payoutTicket?.payoutItem?.centerId,
          approvedBy:element?.data?.approvedBy,  
          value:element?.payoutTicket?.payoutItem?.status,
          type:element?.payoutTicket?.payoutItem?.type,
          paybaleamount:element?.payoutTicket?.payoutItem?.payableAmount,
          payoutItem:element?.payoutTicket?.payoutItem ? element?.payoutTicket?.payoutItem : {},
          assignedToUsers:element?.assignedToUsers ? element?.assignedToUsers  : [],
          
        });
        // console.log('payoutTicketList',this.payoutTicketList)
      });
      // console.log("hello", this.payoutTicketList)
      this.refreshTable(this.payoutTicketList);
      this.cdr.detectChanges();

    });
  }
  async refreshTable(payoutTicketList) {
    this.filteredpayoutTicketList = [];
    this.paginationData.total = this.totalElements;
    const pagesLength = this.totalElements / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(length)).fill(0).map((x, i) => i);
    this.filteredpayoutTicketList = payoutTicketList;
    this.cdr.detectChanges();
  }
  selectAllRecord(event) {
    this.listOfApproval = [];
    if (event.target.checked) {
      if(this.filteredpayoutTicketList && this.filteredpayoutTicketList.length) {
        for(let i=0;i<this.filteredpayoutTicketList.length;i++) {
            if (this.filteredpayoutTicketList[i].status == "PENDING") {
              this.filteredpayoutTicketList[i].selected = true;
              this.listOfApproval.push(this.filteredpayoutTicketList[i]);
            }
            console.log(this.listOfApproval);
        }
      }
    } else {
      if(this.filteredpayoutTicketList && this.filteredpayoutTicketList.length) {
        for(let i=0;i<this.filteredpayoutTicketList.length;i++) {
          this.filteredpayoutTicketList[i].selected = false;

            // if (this.filteredpayoutTicketList[i].status == "PENDING") {
            //   this.filteredpayoutTicketList[i].selected = false;
            //   this.listOfApproval.push(this.filteredpayoutTicketList[i]);
            // }
        }
      }
    }
    this.selectedLotItemPrice = 0;        
    this.listOfApproval.forEach(item=>{
      this.selectedLotItemPrice += item?.paybaleamount;
    })
    this.cdr.detectChanges();
  }

  async onSearch() {
    this.enableSearch = true;
    this.paginationData.currentPage = 0;
    this.getSearchticketList();
  }
  async onPageChange(page) {
    this.paginationData.currentPage = page;
    this.getticketList();
  }
  async onPageSizeChange() {
    this.getticketList();
  }

  async onChangeStatus(event) {
    this.selectedStatus = '';
    this.paginationData.currentPage = 0;
    this.searchText = '';
    this.selectedStatus = event.target.value;
    this.getticketList();
  }
  buildSerachQuery(searchText: any = this.searchText) {
    let query = `status=${this.selectedStatus}`;
    if (searchText) {
      let text = searchText.replace(/ /gi, "*");
      let query: String = ``;
      (query += 'status=' + this.selectedStatus);
      searchText.toString()?.toUpperCase()?.includes('RMLOT') && !isNaN(searchText.substring(5)) && (query += `&&lotId=${searchText.substring(5)}`)
      !isNaN(parseInt(searchText)) && (query += `&lotId=${searchText}&type='COCOON'`)
      query += '';
      return query;
    }
    query += ''
    return query;
  }

  buildAfterSerachQuery(searchText: any = this.searchText) {
    // let query = `status=${this.selectedStatus}`;
    if (searchText) {
      let text = searchText.replace(/ /gi, "*");
      let type = 'COCOON_LOT'
      let query: String = ``;
      (query += 'type=COCOON_LOT');
      searchText.toString()?.toUpperCase()?.includes('RMLOT') && !isNaN(searchText.substring(5)) && (query += `&itemId=${searchText.substring(5)}`)
      !isNaN(parseInt(searchText)) && (query += `&itemId=${searchText}`)
      query += '';
      return query;
    }
    // query += ''
    // return query;
  }

  // after serach
  getSearchticketList() {    
    this.payoutTicketList = [];
    if(this.selectAll){
      this.selectAll = false;
      this.listOfApproval = [];
    }
    this.ngxLoader.stop();
    this.apiSearch.getAllSearchPayoytTickets(this.paginationData,this.buildAfterSerachQuery()).then((res: any) => {
      this.payoutlot=res;
      // console.log('payoutlotpayoutlot',this.payoutlot);
      // console.log('payoutlot',res)
      this.totalElements = res['totalElements'];
      this.totalamount = 0;
      res.forEach(element => {
        this.payoutTicketList.push({
          selected: false,
          ticketId: element?.payoutTicket?.code ? element?.payoutTicket?.code : '-',
          externalId: element?.externalId ? element?.externalId : '-',
          farmer: element?.payoutTicket?.payoutItem?.stakeHolderName ? element?.payoutTicket?.payoutItem?.stakeHolderName : '-',
          farmerphone: element?.payoutTicket?.payoutItem?.stakeHolderPhone ? element?.payoutTicket?.payoutItem?.stakeHolderPhone : '-',
          center: element?.payoutTicket?.payoutItem?.centerName ? element?.payoutTicket?.payoutItem?.centerName : '-',
          payoutType: element?.payoutTicket?.payoutItem?.itemType ? element?.payoutTicket?.payoutItem?.itemType : '-',
          requestedAmount: element?.payoutTicket?.payoutItem?.requestedAmount ? element?.payoutTicket?.payoutItem?.requestedAmount.toFixed(2) : '-',
          payableAmountAmount: element?.payoutTicket?.payoutItem?.payableAmount ? element?.payoutTicket?.payoutItem?.payableAmount.toFixed(2) : '-',
          status: element?.payoutTicket?.status ? element?.payoutTicket?.status : '-',
          ticketStatus: element?.status ? element?.status : '-',
          id: element?.id ? element?.id : '-',
          centerid:element?.payoutTicket?.payoutItem?.centerId,
          approvedBy:element?.data?.approvedBy,  
          value:element?.payoutTicket?.payoutItem?.status,
          type:element?.payoutTicket?.payoutItem?.type,
          paybaleamount:element?.payoutTicket?.payoutItem?.payableAmount,
          payoutItem:element?.payoutTicket?.payoutItem ? element?.payoutTicket?.payoutItem : {},
          assignedToUsers:element?.assignedToUsers ? element?.assignedToUsers  : [],
          
        });
        // console.log('payoutTicketList',this.payoutTicketList)
      });
      // console.log("hello", this.payoutTicketList)
      this.refreshTable(this.payoutTicketList);
      this.cdr.detectChanges();

    });
  }
  

  listOfApproval:any[]=[];

  onSelectPayoutLot(event,item){
    console.log(item);
    if (event.target.checked) {
      const found = this.listOfApproval.some(el => el.id === item.id);
      
      if (!found) {
        this.listOfApproval.push(item);
      }
    } else {
      const lot = this.listOfApproval.findIndex((lotItem) => {
        return lotItem.id === item.id;
      });
      if (lot !== -1){
        this.listOfApproval.splice(lot, 1);
      }
    }
    console.log(this.listOfApproval);
    this.selectedLotItemPrice=  0;
    this.payloadList = [];
    this.cartLotItemsID = [];
    this.listOfApproval.forEach(item=>{
      this.selectedLotItemPrice += item?.paybaleamount;
      this.cartLotItemsID.push(item?.id);
      // console.log(this.selectedLotItemPrice);
      this.payloadList.push({
        "createdBy":this.user?.phonenumber,
        centerId: item?.centerId,
        paybaleamount:item?.paybaleamount,
        variables: {
            requestId: {
                value: item?.id,
                type: "String"
            },
            status: {
                value: 'approved',
                type: "String"
            },
    
            data: {
                value: {
                    // approvedBy: item?.approvedBy
                    approvedBy: "L3"
                },
                type: "String"
            },
            externalId : {
              value : item?.externalId,
              type : "String"
            }
        }
      }) 
      console.log(this.payloadList);
          
    })
  
    
  }
 
  approve(){
    this.api.Updatepayoutrequest(this.payloadList).then((data:any)=>{
      console.log('payout',data)
      this.modalRef.close();
      this.listOfApproval = [];
      this.getticketList();
      this.$gaService.event('Vertical Admin Payout Approve', ` Cocoon lot id =  ${this.cartLotItemsID.toString()}, Created By = ${this.user.name}`);

      this.toaster.success('Payout Intiated to Finance successfully', 'Ok', {
        timeOut: 3000,
      })

    })
  }
  cancel() {
    this.listOfApproval=[];
    if(this.selectAll){
      this.selectAll = false;
      this.listOfApproval = [];
    }
    this.filteredpayoutTicketList = this.filteredpayoutTicketList.map(record=>{ record.selected = false; return record;})
    this.modalRef.close();
    this.toaster.error('Cancel Approval request Payout', 'Ok', {
      timeOut: 3000,
      
    })
  
  }
  
}
