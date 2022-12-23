import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { COTTON_LOT_STATUS } from 'src/app/constants/enum/constant.cottons';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { CottonApiService } from 'src/app/services/api/cotton-api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { PaymentInfo } from '../../shared/generic-payment/generic-payment.component';


@Component({
  selector: 'app-seeds-sales-purchase-list',
  templateUrl: './seeds-sales-purchase-list.component.html',
  styleUrls: ['./seeds-sales-purchase-list.component.scss']
})
export class SeedsSalesPurchaseListComponent implements OnInit {

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

  modalRef: any;
  closeResult: string;
  salesOrderList: any;
  searchText: string;
  sleetedStatus: any;
  paymentStatus: any;
  totalElement: any;
  // id:any;
  // item:any;

  paymentForm:UntypedFormGroup = new UntypedFormGroup({
    amount:new UntypedFormControl('',Validators.required),
    referenceNumber:new UntypedFormControl('',Validators.required),
    code:new UntypedFormControl(),
    totalWeight: new UntypedFormControl(),
    totalReceivable:new UntypedFormControl(),
    dueAmount:new UntypedFormControl(),
    id:new UntypedFormControl()
  })
  selectedSeedLot=[];

  filterForm: UntypedFormGroup = new UntypedFormGroup({
    status: new UntypedFormControl('(AVAILABLE,SOLD)'),
    paymentStatus: new UntypedFormControl('(PENDING,PAID)')
  })
  constructor(
    private api: ApiService,
    private cottonApi: CottonApiService,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private modalService: NgbModal,
    private form: UntypedFormBuilder,
    private route:ActivatedRoute,
    private snackBar:MatSnackBar,
    private toaster:ToastrService,
    private _cd: ChangeDetectorRef,
    private globalService: GlobalService
  ) 
   { }

  ngOnInit(): void {
    this.listenForFilterChanges();
    this.getAllSeedLots();
  }
  //payment Details pop up//
  recordPayment(payment,item){  
    this.paymentForm.reset();
    this.paymentForm.get('id').patchValue(item['id'])
    this.paymentForm.get('totalReceivable').patchValue(item['netPayableAmount'])
    this.paymentForm.get('totalWeight').patchValue(item['receivedWeight'])
    this.paymentForm.get('dueAmount').patchValue(item['dueAmount'])
    this.paymentForm.get('amount').patchValue(Math.round(item['dueAmount']))
    this.paymentStatus=item['paymentStatus']
    this.modalRef = this.modalService.open(payment)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  } 
  //pagination
  async onPageChange(page) {
    this.paginationData.currentPage = page;
    this.getAllSeedLots();
  }
  async onPageSizeChange() {
    this.getAllSeedLots();
  }
  async onSearch() {
    this.paginationData.currentPage=0;
    this.getAllSeedLots();
  }
  listenForFilterChanges() {
    this.filterForm.valueChanges.subscribe(value => {
      this.getAllSeedLots();
    })
  }
  //get All cotton sale order
  getAllSeedLots(searchText=''){
    this.cottonApi.getAllCottonSeedsPurchaseList(this.paginationData,this.buildSearchQuery()).then(res=>{
      this.salesOrderList=res['content']
      this.totalElement=res['totalElements']
      this.paginationData.total = this.totalElement;
      const pagesLength = this.totalElement / this.paginationData.pageSize;
      this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
      console.log(this.salesOrderList)
      this._cd.detectChanges();
    })
  }
  async onChangeOfStatusFilter(event) {
    this.paginationData.currentPage = 0;
    // this.searchText = '';
    let status = event.target.value;
    this.sleetedStatus = status;
    if (status == 'Paid' || status == 'Pending') {
      this.getAllSeedLots()
    } else {
      this.getAllSeedLots()

    }
  }
  buildSearchQuery(searchText:any=this.searchText) {
    const { status, paymentStatus } = this.filterForm.value;
    let query = `(status =in= ${status} and paymentStatus=in=${paymentStatus}`;
    if (this.searchText) {
      let text = this.searchText.replace(/ /gi, "*");
      let query: String = `(`;
      (query += `((ginner.name == *${text}*  or ginner.phone == *${text}*) and status=in=${status} and paymentStatus=in=${paymentStatus}`);
      this.searchText.toString()?.toUpperCase()?.includes('RMCSL') && !isNaN(parseInt(this.searchText.substring(5))) && (query += ` or id==${this.searchText.substring(5)}`)
      !isNaN(parseInt(this.searchText)) && (query += ` or id==${this.searchText}`)
      query += '))';
      return query;
    }
    query += ')'
    return query;

  }

  async onSelectBaleItem(event, item) {
    if (event.target.checked) {
      const found = this.selectedSeedLot.some(el => el.id === item.id);
      if (!found) {
        this.selectedSeedLot.push(item);
      }
    } else {
      const lot = this.selectedSeedLot.findIndex((lotItem) => {
        return lotItem.id === item.id;
      });
      if (lot !== -1) {
        this.selectedSeedLot.splice(lot, 1);
      }
    }
  }

  createSO(){
    this.globalService.cottonData = this.selectedSeedLot;
    this.router.navigate(['/resha-farms/Cotton-Seeds-purchase/seedsOrder']);
  }
  //create Payment details here
  createPayment(){
    let payload= {
        "amount": parseInt(this.paymentForm.value.amount),
        "isOutOfBand": true,
        "referenceNumber":this.paymentForm.value.referenceNumber,
        "paymentDate":this.salesOrderList.createdDate,
        "ginner": "/ginner/400089",
        "cottonSeedslisting" :"/cottonSeedsSalesOrder/"+ this.paymentForm.value.id,
    
    }
    this.api.createSeedsPayoutDetails(payload).then(res=>{
      this.toaster.success('Payment  Status Updated successfully', 'Ok', {
        timeOut: 3000,
      })
      this.getAllSeedLots();
      })
      this._cd.detectChanges();
      this.modalRef.close();
     
  }

}