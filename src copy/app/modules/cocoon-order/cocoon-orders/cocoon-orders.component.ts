import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  selector: 'app-cocoon-orders',
  templateUrl: './cocoon-orders.html',
  styleUrls: ['./cocoon-orders.component.scss']
})
export class CocoonOrdersComponent implements OnInit {

  cocoonOrders = [];
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
  searchedCocoonOrders = [];
  filteredCocoonOrdersList = [];
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
    totalWeight: 0,
    totalAmount: 0,
    reeler: {
      'name': 0,
      'phone': 0,
    },
    dueAmount: 0,
    orderPaymentStatus: 0,
    createdDate: 0,
    cartId: 0,
    soldFromLocation:'',

  };
  selectedStatus = '(Pending)';
  deletedOrder;
  multiRole = [];
  payments: Object;
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
    let status = localStorage.getItem('cocoonLotOrderStatus')
    localStorage.setItem('cocoonLotOrderStatus', '');
    if(status) {
      this.selectedStatus = status;
      this.getCocoonOrdersByStatus(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus);
    } else {
      this.getCocoonOrdersByStatus(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', 'Pending');
    }
  }

  ngOnInit(): void {
  }
  async getCocoonOrdersByStatus(page, size, column, direction, status) {
    this.cocoonOrders = [];
    this.ngxLoader.stop();
    this.api.getAllCocoonSOListByPage(page, size, column, direction, status).then(res => {

      if (res && res['content']) {
        const ordersList = res['content'];
        
    this.totalElements = res['totalElements'];
        this.createCocoonOrderData(ordersList);
      } else {
        this.cocoonOrders = [];
      }

      this._cd.detectChanges();
    });

  }
  totalElements: any;
  textSearch;
  enableSearch: boolean = false;
  idParam;
  async createCocoonOrderData(ordersList) {
    this.cocoonOrders = [];
    for (let i = 0; i < ordersList.length; i++) {
      this.cocoonOrders.push({
        id: ordersList[i].id,
        code: ordersList[i].code,
        cartId: ordersList[i].cartId,
        soldFromLocation: ordersList[i].locationInfo?.rmCenter?.centerName,

        paidAmount: ordersList[i].paidAmount,
        createdDate: ordersList[i].createdDate ? this.utils.getDisplayTime(ordersList[i].createdDate) : '-',
        sortCreatedDate: ordersList[i].createdDate ? ordersList[i].createdDate : 0,
        totalAmount: ordersList[i].totalAmount,
        displayTotalAmount: ordersList[i].totalAmount?.toLocaleString('en-IN'),
        totalWeight: Math.ceil(ordersList[i].totalWeight),
        reelerId: ordersList[i].reelerId,
        reeler: ordersList[i].reelerName ? ordersList[i].reelerName.toLowerCase() : '-',
        reelerPhone: ordersList[i].reelerPhone,
        dueAmount: ordersList[i].dueAmount ? ordersList[i].dueAmount : '0',
        displayDueAmt: ordersList[i].dueAmount ? ordersList[i].dueAmount.toLocaleString('en-IN') : '0',
        sellingPricePerKg: ordersList[i].sellingPricePerKg ? ordersList[i].sellingPricePerKg.toLocaleString('en-IN') : '-',
        orderPaymentStatus: ordersList[i].orderPaymentStatus,
        invoiceURL : ordersList[i].invoiceURL ? ordersList[i].invoiceURL : null,
        cocoonLots: ordersList[i].cocoonLots,
        noOfBags: ordersList[i].noOfBags,
        logistics: ordersList[i].logistics,
        discount: ordersList[i].discount,
        ewayBillNo : ordersList[i].ewayBillNo ? ordersList[i].ewayBillNo : '',
        ewayBillImage : ordersList[i].ewayBillImage ? ordersList[i].ewayBillImage : '',
        cocoonOrderItems: ordersList[i].cocoonOrderItems,
        grossAmount: ordersList[i].grossAmount,
        termsAndConditions: ordersList[i].termsAndConditions ? ordersList[i].termsAndConditions : null,
        rmRepresentativeName: ordersList[i].rmRepresentativeName ? ordersList[i].rmRepresentativeName : null,
        rmRepresentativePhone: ordersList[i].rmRepresentativePhone ? ordersList[i].rmRepresentativePhone : null ,
        shippingAddress: ordersList[i].shippingAddress ? ordersList[i].shippingAddress : null,
        deliveryNotes: ordersList[i].deliveryNotes ? ordersList[i].deliveryNotes : null,
        createdBy: ordersList[i].createdBy,
        creditDays: ordersList[i].creditDays,
        reelerPayments: ordersList[i].reelerPayments,
        salesOrderType:ordersList[i].salesOrderType,
      })
    }
    this.refreshTable(this.cocoonOrders);
    this._cd.detectChanges();
  }

  async onPageChange(page) {
    this.paginationData.currentPage = page;
    if(this.enableSearch){
      
      let searchParams = `(orderPaymentStatus=in=${this.selectedStatus} and reeler.name==*${this.searchText.replace(/ /gi,"*")}* or reeler.phone==*${this.searchText.replace(/ /gi,"*")}* ${this.idParam})`;
      this.afterSearch(page, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, searchParams)
    } else {
      this.getCocoonOrdersByStatus(page, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus)
    }
  }
  async refreshTable(cocoonOrders) {
    
    this.filteredCocoonOrdersList = [];    
    this.paginationData.total = this.totalElements;
    const pagesLength = this.totalElements / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
    this.filteredCocoonOrdersList = cocoonOrders;
    this._cd.detectChanges();
  }
  async onSearchKey(e){
    this.textSearch = e.target.value;
    if(this.textSearch.length > 1){
      this.enableSearch = true;
    } else if(this.textSearch.length < 1) {
        this.enableSearch = false;
        this.searchedCocoonOrders = [];
        this.paginationData.currentPage = 0;
        this.getCocoonOrdersByStatus(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus);

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
    this.api.searchCocoonSO(page, size, column, direction, searchParams).then(res => {
      this.totalElements = res['totalElements'];
      
      this.cocoonOrders = [];    
      this.searchedCocoonOrders = [];
      this.appWeavers = res['content'];
      for (let i = 0; i < this.appWeavers.length; i++) {
        this.searchedCocoonOrders.push({
          id: this.appWeavers[i].id,
          code: this.appWeavers[i].code,
          cartId: this.appWeavers[i].cartId,
          soldFromLocation: this.appWeavers[i].locationInfo?.rmCenter?.centerName,

          paidAmount: this.appWeavers[i].paidAmount,
          createdDate: this.appWeavers[i].createdDate ? this.utils.getDisplayTime(this.appWeavers[i].createdDate) : '-',
          sortCreatedDate: this.appWeavers[i].createdDate ? this.appWeavers[i].createdDate : 0,
          totalAmount: this.appWeavers[i].totalAmount,
          displayTotalAmount: this.appWeavers[i].totalAmount.toLocaleString('en-IN'),
          totalWeight: Math.ceil(this.appWeavers[i].totalWeight),
          reelerId: this.appWeavers[i].reelerId,
          reeler: this.appWeavers[i].reelerName ? this.appWeavers[i].reelerName.toLowerCase() : '-',
          reelerPhone: this.appWeavers[i].reelerPhone,
          dueAmount: this.appWeavers[i].dueAmount ? this.appWeavers[i].dueAmount : '0',
          displayDueAmt: this.appWeavers[i].dueAmount ? this.appWeavers[i].dueAmount.toLocaleString('en-IN') : '0',
          sellingPricePerKg: this.appWeavers[i].sellingPricePerKg ? this.appWeavers[i].sellingPricePerKg.toLocaleString('en-IN') : '-',
          orderPaymentStatus: this.appWeavers[i].orderPaymentStatus,
          invoiceURL : this.appWeavers[i].invoiceURL ? this.appWeavers[i].invoiceURL : null,
          cocoonLots: this.appWeavers[i].cocoonLots,
          grossAmount: this.appWeavers[i].grossAmount,
          noOfBags: this.appWeavers[i].noOfBags,
          logistics: this.appWeavers[i].logistics,
          discount: this.appWeavers[i].discount,
          cocoonOrderItems: this.appWeavers[i].cocoonOrderItems,
          termsAndConditions: this.appWeavers[i].termsAndConditions,
          rmRepresentativeName: this.appWeavers[i].rmRepresentativeName ? this.appWeavers[i].rmRepresentativeName : null,
          rmRepresentativePhone: this.appWeavers[i].rmRepresentativePhone ? this.appWeavers[i].rmRepresentativePhone : null,
          deliveryNotes: this.appWeavers[i].deliveryNotes ? this.appWeavers[i].deliveryNotes : null,
          shippingAddress: this.appWeavers[i].shippingAddress ? this.appWeavers[i].shippingAddress : null,
          createdBy: this.appWeavers[i].createdBy,
          creditDays: this.appWeavers[i].creditDays,
          reelerPayments: this.appWeavers[i].reelerPayments,
          
        })
      }
         setTimeout(() => {                
           this.refreshTable(this.searchedCocoonOrders);
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
      this.getCocoonOrdersByStatus(0, this.paginationData.pageSize, column, this.paginationData.currentDirection, this.selectedStatus)
    }
     this.activeSort = column;
     this.paginationData.currentPage = 0;
  }
  formatPrice(price){
    const formatPrice = price.replace(/[, ]+/g, "").trim();    
    return +formatPrice;
    
  }
  async onPageSizeChange() {
    this.getCocoonOrdersByStatus(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus)

  }

  async onChangeOfStatusFilter(event) {
    this.paginationData.currentPage = 0;
    this.searchText = '';
    this.selectedStatus = event.target.value
    this.getCocoonOrdersByStatus(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus);
  }

  async showPayButtonOrNot(item){
    if(item.orderPaymentStatus == 'Pending'){
      return true;
    }
    return false;
  }
  
  listenAndRefreshPage(){
    this.getCocoonOrdersByStatus(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus);
  }

  async showPaymentDetails(item, content){
    this.reelerCocoonKhata(item.id, content);
  }
  // khathaOfReeler(item, content) {
  //   this.reelerKhataList = [];
  //   // this.ngxLoader.start();
  //   // item['reelerPayments'];
  //   // this.api.getReelerKhata(id).then((res:any) => {
  //     // if (res) {
  //       // const khataList = res['_embedded']['reelerpayment'];
  //       const khataList =    item['reelerPayments'];
  //       if (khataList?.length) {
  //         for (let i = 0; i < khataList.length; i++) {
  //           this.reelerKhataList.push({
  //             amount: khataList[i].amount,
  //             lastModifiedDate: this.utils.getDisplayTime(khataList[i].lastModifiedDate),
  //             referenceNumber: khataList[i].referenceNumber,
  //           })
  //         }
  //         this._cd.detectChanges();
  //       } else {
  //         this.reelerKhataList = [];
  //         this._cd.detectChanges();
  //       }
  //       this.modalRef = this.modalService.open(content)
  //         this.modalRef.result.then((result) => {
  //           this.closeResult = `Closed with: ${result}`;
  //         }, (reason) => {
  //           this.closeResult = `Dismissed`;
  //         });
  //     // }
  // }
  reelerCocoonKhata(id, content) {
    this.reelerKhataList = [];
    this.api.getCocoonReelerKhataforPayments(id).then(res => {
      if (res) {
        const khataList = res['_embedded']['reelerpayment'];
        if (khataList.length) {
          for (let i = 0; i < khataList.length; i++) {
            this.reelerKhataList.push({
              amount: khataList[i].amount,
              lastModifiedDate: this.utils.getDisplayTime(khataList[i].lastModifiedDate),
              referenceNumber: khataList[i].referenceNumber,
            })
          }
          this.modalRef = this.modalService.open(content)
          this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed`;
          });
          this._cd.detectChanges();
        } else {
          this.reelerKhataList = [];
          this.modalRef = this.modalService.open(content)
          this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed`;
          });
          this._cd.detectChanges();
        }
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
    this.api.deleteCocoonOrder(this.deletedOrder.id).then(resp => {
      this.paginationData.currentPage = 0;
    this.searchText = '';
    this.getCocoonOrdersByStatus(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus);
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
    localStorage.setItem('cocoonLotOrderStatus', this.selectedStatus);
    this.router.navigate(['/resha-farms/cocoon-orders/details', order.id]);
  }
  
  editOrder(order) {
    localStorage.setItem('cocoonLotOrderStatus', this.selectedStatus);
    this.globalService.tempOrderData = order;
    this.globalService.tempValueData = [];
    this.router.navigate(['/resha-farms/cocoon-orders/crud', order.id]);
  }
  
}
