import { Component, OnInit,ChangeDetectorRef} from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CottonApiService } from 'src/app/services/api/cotton-api.service';


@Component({
  selector: 'app-cotton-seeds-orders-list',
  templateUrl: './cotton-seeds-orders-list.component.html',
  styleUrls: ['./cotton-seeds-orders-list.component.scss']
})
export class CottonSeedsOrdersListComponent implements OnInit {

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
  salesOrderList: any=[];
  searchText: string;
  sleetedStatus: any;
  paymentStatus: any;
  totalElement: any;
  oilmillId: any;

  filterForm: UntypedFormGroup = new UntypedFormGroup({
    // status: new UntypedFormControl('(AVAILABLE,SOLD)'),
    currentLocation: new UntypedFormControl(''),
    paymentStatus: new UntypedFormControl('(PENDING,PAID)')
  })
  warehouseList: any;

  constructor(
    private api: ApiService,
    private CottonApi: CottonApiService,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private modalService: NgbModal,
    private form: UntypedFormBuilder,
    private route:ActivatedRoute,
    private snackBar:MatSnackBar,
    private toaster:ToastrService,
    private _cd: ChangeDetectorRef,
  ) 
   { 
    this.getWarehouses();
   }
   paymentForm:UntypedFormGroup = new UntypedFormGroup({
    amount:new UntypedFormControl('',Validators.required),
    referenceNumber:new UntypedFormControl('',Validators.required),
    code:new UntypedFormControl(),
    totalWeight: new UntypedFormControl(),
    totalReceivable:new UntypedFormControl(),
    dueAmount:new UntypedFormControl(),
    id:new UntypedFormControl()
  })

  ngOnInit(): void {
    // this.getWarehouses();

    this.getAllSeedSalesLots();
    this.listenForFilterChanges();
  }

  
  async getWarehouses() {
    this.ngxLoader.start();
    this.api.getWarehouseList().then(details => {
      if (details) {
        this.warehouseList = details['_embedded']['warehouse'];
        this._cd.detectChanges();

      }
      this.ngxLoader.stop();

    }, err => {
      console.log(err);
    });
  }

  async onChangeWareHouse(event) {
    this.paginationData.currentPage = 0;
    // this.selectedStatus = event.target.value;
  }

  //payment Details pop up//
  recordPayment(payment,item){  
    this.paymentForm.reset();
    this.oilmillId=item['oilMillId']
    this.paymentForm.get('id').patchValue(item['id'])
    this.paymentForm.get('totalReceivable').patchValue(item['netAmount'])
    this.paymentForm.get('totalWeight').patchValue(item['sellingWeight'])
    this.paymentForm.get('dueAmount').patchValue(Math.round(item['dueAmount']))
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
    this.getAllSeedSalesLots();

  }
  async onPageSizeChange() {
    this.getAllSeedSalesLots();
    
  }
  async onSearch() {
    this.paginationData.currentPage=0;
    this.getAllSeedSalesLots();
  }
  listenForFilterChanges() {
    this.filterForm.valueChanges.subscribe(value => {
      this.getAllSeedSalesLots();
    })
  }

  //get All cotton sale order
  getAllSeedSalesLots(){
    this.ngxLoader.start();
    this.CottonApi.allCottonSalesOrderList(this.paginationData,this.buildSearchQuery()).then(res=>{
      this.salesOrderList=res['content'] //this.warehouseList
      this.totalElement=res['totalElements']
      this.paginationData.total = this.totalElement;
      const pagesLength = this.totalElement / this.paginationData.pageSize;
      this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
      console.log(this.salesOrderList)
      this._cd.detectChanges();
      this.ngxLoader.stop();
    })

  }
  buildSearchQuery(searchText:any=this.searchText) {
    const {currentLocation, paymentStatus } = this.filterForm.value;
    let query = `(`;
    if (this.searchText) {
      let text = this.searchText.replace(/ /gi, "*");
      let query: String = `(`;
      (query += `((oilMill.name == *${text}*  or oilMill.phone == *${text}*) and paymentStatus=in=${paymentStatus}`);
      this.searchText.toString()?.toUpperCase()?.includes('RMCSSO') && !isNaN(parseInt(this.searchText.substring(6))) && (query += ` or id==${this.searchText.substring(6)}`)
      !isNaN(parseInt(this.searchText)) && (query += ` or id==${this.searchText}`)
      query += '))';
      return query;
    }
    // query += ')'
    // return query;

    if (currentLocation) {
      query += `warehouse.name =in= "${currentLocation}" and paymentStatus=in=${paymentStatus}`
    } 
    query += ')'

    return query.length <= 2 ? `paymentStatus=in=${paymentStatus}` : query;

  }

  //create Payment details here
  createPayment(){
    let payload= {
        "amount": parseInt(this.paymentForm.value.amount),
        "referenceNumber": this.paymentForm.value.referenceNumber,
        "isOutOfBand": false,
        "paymentOn": null,
        "paymentMode": "Others",
        "cottonSeedsSalesOrder": "/cottonSeedsSalesOrder/"+ this.paymentForm.value.id,
        "oilMill": "/oilMill/"+ this.oilmillId,
    
    }
    this.api.createSeedsPaymentDetails(payload).then(res=>{
      this.getAllSeedSalesLots();
      this._cd.detectChanges();
      this.toaster.success('Payment  Status Updated successfully', 'Ok', {
        timeOut: 3000,
      })
  
      })
      
      this.modalRef.close();
      
  }
  
  OrderDetail(salesOrderList) {
    this.router.navigate(['/resha-farms/cotton-seeds-order/cotton-seeds-sales-details',salesOrderList.id])
  }


}
