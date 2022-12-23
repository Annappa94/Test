import { Component, OnInit,ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-tussar-order-list',
  templateUrl: './tussar-order-list.component.html',
  styleUrls: ['./tussar-order-list.component.scss']
})
export class TussarOrderListComponent implements OnInit {
  tussarOrders = [];
  searchText;
  reelerKhataList: any[];
  modalRef: any;
  closeResult: string;
  fileName= 'cocoon-orders-list.xlsx';  
  user: any;
  reeler:any;
  isRefDisabled:any=false;
  // table features
  activeSort = '';
  searchedTussarOrders = [];
  filteredTussarOrdersList = [];
  paginationData = {
    currentPage : 0,
    pageSize    : 10,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  };

  tableHeader = {
    id: 1,
    totalPieces: 0,
    totalAmount: 0,
    reeler: {
      'name': 0,
      'phone': 0,
    },
    dueAmount: 0,
    orderPaymentStatus: 0,
    createdDate: 0,
    cartId: 0,

  };
  selectedStatus = '(Pending)';
  deletedOrder;
  multiRole = [];

  constructor(
    private api: ApiService,
    private utils: UtilsService,
    private _cd: ChangeDetectorRef,
    private modalService: NgbModal,
    form: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    public rolesService: RolesService,
    private ngxLoader : NgxUiLoaderService,
    private globalService: GlobalService,
    private $gaService:GoogleAnalyticsService,
  ) {
    this.user = JSON.parse(localStorage.getItem('_ud'));

    this.multiRole = this.user.roles;
    if(this.multiRole.length == 2 && this.multiRole.includes('COperationsAgent') && this.multiRole.includes('COCOON_PROCUREMENT_EXEC') && this.multiRole.includes('COCOON_SALES_EXEC') && this.multiRole.includes('FinanceManager')){
      this.user.role = 'COperationsAgent,COCOON_PROCUREMENT_EXEC,COCOON_SALES_EXEC,FinanceManager'
    }
    let status = localStorage.getItem('tussarLotOrderStatus')
    localStorage.setItem('tussarLotOrderStatus', '');
    if(status) {
      this.selectedStatus = status;
      this.getTussarSalesOrdersByStatus(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus);
    } else {
      this.getTussarSalesOrdersByStatus(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', 'Pending');
    }
   }

  ngOnInit(): void {
  }
  
  async getTussarSalesOrdersByStatus(page, size, column, direction, status) {
    this.tussarOrders = [];
    this.ngxLoader.stop();
    this.api.getAllTussarSalesOrderListByPage(page, size, column, direction, status).then(res => {

      if (res && res['content']) {
        const ordersList = res['content'];
        
    this.totalElements = res['totalElements'];
        this.createTussarOrderData(ordersList);
      } else {
        this.tussarOrders = [];
      }

      this._cd.detectChanges();
    });

  }
  totalElements: any;
  textSearch;
  enableSearch: boolean = false;
  idParam;
  async createTussarOrderData(ordersList) {    
    this.tussarOrders = [];
    for (let i = 0; i < ordersList.length; i++) {
      this.tussarOrders.push({
        
        id: ordersList[i].id,
        code: ordersList[i].code,
        createdDate: ordersList[i].createdDate ? this.utils.getDisplayTime(ordersList[i].createdDate) : '-',
        sortCreatedDate: ordersList[i].createdDate ? ordersList[i].createdDate : 0,
        totalAmount:Math.round( ordersList[i].totalAmount),
        displayTotalAmount: ordersList[i].totalAmount?.toLocaleString('en-IN'),
        totalPieces: Math.ceil(ordersList[i].totalPieces),
        reelerId: ordersList[i]?.reelerData?.id,
        reeler: ordersList[i]?.reelerData?.name ? ordersList[i]?.reelerData?.name.toLowerCase() : '-',
        reelerPhone: ordersList[i]?.reelerData?.phone,
        dueAmount: Math.round(ordersList[i].dueAmount) ? Math.round(ordersList[i].dueAmount) : '0',
        displayDueAmt: Math.round(ordersList[i].dueAmount) ?Math.round( ordersList[i].dueAmount?.toLocaleString('en-IN')) : '0',
        sellingPricePerPc: ordersList[i].sellingPricePerPc ? ordersList[i].sellingPricePerPc?.toLocaleString('en-IN') : '-',
        orderPaymentStatus: ordersList[i].orderPaymentStatus,
        invoiceURL : ordersList[i].invoiceURL ? ordersList[i].invoiceURL : null,
        cocoonLots: ordersList[i].cocoonLots,
        noOfBags: ordersList[i].noOfBags,
        logistics: ordersList[i].logistics,
        discount: ordersList[i].discount,
        ewayBillNo : ordersList[i].ewayBillNo ? ordersList[i].ewayBillNo : '',
        ewayBillImage : ordersList[i].ewayBillImage ? ordersList[i].ewayBillImage : '',
        tussarSalesOrderItems: ordersList[i].tussarSalesOrderItems,
        grossAmount: ordersList[i].grossAmount,
        termsAndConditions: ordersList[i].termsAndConditions ? ordersList[i].termsAndConditions : null,
        rmRepresentativeName: ordersList[i].rmRepresentativeName ? ordersList[i].rmRepresentativeName : null,
        rmRepresentativePhone: ordersList[i].rmRepresentativePhone ? ordersList[i].rmRepresentativePhone : null ,
        shippingAddress: ordersList[i].shippingAddress ? ordersList[i].shippingAddress : null,
        deliveryNotes: ordersList[i].deliveryNotes ? ordersList[i].deliveryNotes : null,
        createdBy: ordersList[i].createdBy,
        creditDays: ordersList[i].creditDays,
        reelerData:ordersList[i].reelerData,
      })
    }
    this.refreshTable(this.tussarOrders);
    this._cd.detectChanges();
  }

  async onPageChange(page) {
    this.paginationData.currentPage = page;
    if(this.enableSearch){
      
      let searchParams = `(orderPaymentStatus=in=${this.selectedStatus} and reeler.name==*${this.searchText.replace(/ /gi,"*")}* or reeler.phone==*${this.searchText.replace(/ /gi,"*")}* ${this.idParam})`;
      this.afterSearch(page, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, searchParams)
    } else {
      this.getTussarSalesOrdersByStatus(page, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus)
    }
  }
  async refreshTable(tussarOrders) {
    
    this.filteredTussarOrdersList = [];    
    this.paginationData.total = this.totalElements;
    const pagesLength = this.totalElements / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
    this.filteredTussarOrdersList = tussarOrders;
    this._cd.detectChanges();
  }
  async onSearchKey(e){
    this.textSearch = e.target.value;
    if(this.textSearch.length > 1){
      this.enableSearch = true;
    } else if(this.textSearch.length < 1) {
        this.enableSearch = false;
        this.searchedTussarOrders = [];
        this.paginationData.currentPage = 0;
        this.getTussarSalesOrdersByStatus(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus);

    }
  }
  async onSearch() {
    this.paginationData.currentPage = 0;
    if(isNaN(this.searchText)){
      if(this.searchText.toLowerCase().includes('rmcorder')&&!isNaN(this.searchText.substring(8))){
        this.searchText = this.searchText.substring(8);
          this.idParam =  `or id==${this.searchText}`;
      } else {
        this.idParam = '';
      }
    } else {
      this.idParam =  `or id==${this.searchText}`;
    }
    let searchParams = `(orderPaymentStatus=in=${this.selectedStatus} and reeler.name==*${this.searchText.replace(/ /gi,"*")}* or reeler.phone==*${this.searchText.replace(/ /gi,"*")}* ${this.idParam})`;
    this.afterSearch(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, searchParams) 
  
  }
  
  appWeavers: any;
  afterSearch(page, size, column, direction, searchParams){
    this.ngxLoader.stop();
    this.api.searchTussarSalesOrder(page, size, column, direction, searchParams).then(res => {
      this.totalElements = res['totalElements'];
      
      this.tussarOrders = [];    
      this.searchedTussarOrders = [];
      this.appWeavers = res['content'];
      for (let i = 0; i < this.appWeavers.length; i++) {
        this.searchedTussarOrders.push({
          id: this.appWeavers[i].id,
          code: this.appWeavers[i].code,
          createdDate: this.appWeavers[i].createdDate ? this.utils.getDisplayTime(this.appWeavers[i].createdDate) : '-',
          sortCreatedDate: this.appWeavers[i].createdDate ? this.appWeavers[i].createdDate : 0,
          totalAmount: Math.round(this.appWeavers[i].totalAmount),
          displayTotalAmount: this.appWeavers[i].totalAmount?.toLocaleString('en-IN'),
          totalPieces: Math.ceil(this.appWeavers[i].totalPieces),
          reelerId:this.appWeavers[i]?.reelerData?.id,
          reeler:this.appWeavers[i]?.reelerData?.name ?this.appWeavers[i]?.reelerData?.name.toLowerCase() : '-',
          reelerPhone:this.appWeavers[i]?.reelerData?.phone,
          dueAmount: Math.round(this.appWeavers[i].dueAmount) ? Math.round(this.appWeavers[i].dueAmount) : '0',
          displayDueAmt: Math.round(this.appWeavers[i].dueAmount) ? Math.round(this.appWeavers[i].dueAmount?.toLocaleString('en-IN')) : '0',
          sellingPricePerPc: this.appWeavers[i].sellingPricePerPc ? this.appWeavers[i].sellingPricePerPc?.toLocaleString('en-IN') : '-',
          orderPaymentStatus: this.appWeavers[i].orderPaymentStatus,
          invoiceURL : this.appWeavers[i].invoiceURL ? this.appWeavers[i].invoiceURL : null,
          cocoonLots: this.appWeavers[i].cocoonLots,
          grossAmount: this.appWeavers[i].grossAmount,
          noOfBags: this.appWeavers[i].noOfBags,
          logistics: this.appWeavers[i].logistics,
          discount: this.appWeavers[i].discount,
          tussarSalesOrderItems: this.appWeavers[i].tussarSalesOrderItems,
          termsAndConditions: this.appWeavers[i].termsAndConditions,
          rmRepresentativeName: this.appWeavers[i].rmRepresentativeName ? this.appWeavers[i].rmRepresentativeName : null,
          rmRepresentativePhone: this.appWeavers[i].rmRepresentativePhone ? this.appWeavers[i].rmRepresentativePhone : null,
          deliveryNotes: this.appWeavers[i].deliveryNotes ? this.appWeavers[i].deliveryNotes : null,
          shippingAddress: this.appWeavers[i].shippingAddress ? this.appWeavers[i].shippingAddress : null,
          createdBy: this.appWeavers[i].createdBy,
          creditDays: this.appWeavers[i].creditDays,
          reelerData:this.appWeavers[i].reelerData,
        })
      }
         setTimeout(() => {                
           this.refreshTable(this.searchedTussarOrders);
         }, 100);
       })
  }
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
      let searchParams = `(orderPaymentStatus=in=${this.selectedStatus} and reeler.name==*${this.searchText.replace(/ /gi,"*")}* or reeler.phone==*${this.searchText.replace(/ /gi,"*")}* ${this.idParam})`;
      this.afterSearch(0, this.paginationData.pageSize, column, this.paginationData.currentDirection, searchParams)
    } else {
      this.getTussarSalesOrdersByStatus(0, this.paginationData.pageSize, column, this.paginationData.currentDirection, this.selectedStatus)
    }
     this.activeSort = column;
     this.paginationData.currentPage = 0;
  }
  formatPrice(price){
    const formatPrice = price.replace(/[, ]+/g, "").trim();    
    return +formatPrice;
    
  }
  async onPageSizeChange() {
    this.getTussarSalesOrdersByStatus(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus)

  }

  async onChangeOfStatusFilter(event) {
    this.paginationData.currentPage = 0;
    this.searchText = '';
    this.selectedStatus = event.target.value
    this.getTussarSalesOrdersByStatus(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus);
  }

  async showPayButtonOrNot(item){
    if(item.orderPaymentStatus == 'Pending'){
      return true;
    }
    return false;
  }
  
  listenAndRefreshPage(){
    this.getTussarSalesOrdersByStatus(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus);
  }

  async showPaymentDetails(item, content){    
    this.khathaOfReeler(item['id'], content);
  }

  khathaOfReeler(id, content) {
    this.reelerKhataList = [];
    this.ngxLoader.stop();
    this.api.getTussarReelarPayments(id).then(res => {
      console.log(res);
      
      if (res) {
        const khataList = res['_embedded']['tussarreelerpayment'];
        if (khataList.length) {
          for (let i = 0; i < khataList.length; i++) {
            this.reelerKhataList.push({
              amount: khataList[i].amount,
              lastModifiedDate: this.utils.getDisplayTime(khataList[i].lastModifiedDate),
              referenceNumber: khataList[i].referenceNumber
            })
          }
          this._cd.detectChanges();
        } else {
          this.reelerKhataList = [];
          this._cd.detectChanges();
        }
        this.modalRef = this.modalService.open(content)
          this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed`;
          });
      }
    }, err => {
      console.log(err);
    })

  }

  // delete cocoon order 

  async open(content, item) {
    this.deletedOrder = item;
    // this.lot.index = index;
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  async delete() {
    this.modalRef.close();
    this.ngxLoader.stop();
    this.api.deleteTussarSalesOrderOrderById(this.deletedOrder.id).then(resp => {
      this.paginationData.currentPage = 0;
    this.searchText = '';
    this.getTussarSalesOrdersByStatus(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus);
      this._cd.detectChanges();
      this.snackBar.open(this.deletedOrder.code + ' deleted successfully', 'Ok', {
        duration: 3000
      });
    }).catch(err => {
      console.error(err);
      this.snackBar.open('Failed to delete order ' + this.deletedOrder.code, 'Ok', {
        duration: 3000
      });
    });
  }

  OrderDetail(order) {
    localStorage.setItem('tussarLotOrderStatus', this.selectedStatus);
    this.router.navigate(['/resha-farms/tussar/tussar-order-details', order.id]);
  }
  
  editOrder(order) {    
    localStorage.setItem('tussarLotOrderStatus', this.selectedStatus);
    this.globalService.tempOrderData = order;
    this.globalService.tempValueData = [];
    this.router.navigate(['/resha-farms/tussar/tussar-lot-mark-sold', order.id]);
  }

}
