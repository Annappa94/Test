import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

const compareDate = (v1, v2) => new Date(v1) < new Date(v2) ? -1 : new Date(v1) > new Date(v2) ? 1 : 0;
const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
@Component({
    selector: 'app-farmer-marketplace',
    templateUrl: './farmer-marketplace.html',
    styleUrls: ['./farmer-marketplace.component.scss']
})

export class FarmerMarketPlaceComponent implements OnInit {

    searchedFarmers = [];
    filteredFarmersList = [];
    searchText = '';
    activeSort = '';
    isTableLoaded = false;
    inputOrders = [];
    paginationData = {
        currentPage : 0,
        pageSize    : 50,
        total       : 0,
        pages       : []
      };
      tableHeader = {
        farmerName : 1,
        farmerPhone : 0,
        productName : 0,
        productPrice : 0,
        sortOrderDate : 0,
        inputOrderStatus : 0,
      };

      followUpStatus = '';
      order;
      modalRef;
      closeResult: string;
      exportData = [];
      selectedStatus = 'New';
      user;
    constructor(
        private api: ApiService,
        private utils: UtilsService,
        private _cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private snackBar: MatSnackBar,
        private ngxLoader : NgxUiLoaderService
    ) {
        this.user = JSON.parse(localStorage.getItem('_ud'))
        // Get users with all administrative roles 
        this.getFarmerMarketPlaceOrders(this.selectedStatus);
    }

    ngOnInit(): void { }

    async getFarmerMarketPlaceOrders(status) {
        this.inputOrders = [];
        this.ngxLoader.stop();
        this.api.getFarmerMarketPlaceOrders(status).then(res => {

            for (const fio of res['_embedded']['farmerinputorder']) {
                var order = fio;
                order.orderDate = this.utils.getDisplayTime(fio['farmerInputOrder'].createdDate);
                order.sortOrderDate = fio['farmerInputOrder'].createdDate;
                order.id = fio['farmerInputOrder'].id;
                order.productPrice =  order.productPrice ? order.productPrice : 0;
                order.farmerName = order.farmerName.toLowerCase();
                this.inputOrders.push(order);
                this.exportData.push({
                  Farmer: order.farmerName,
                  Phone: order.farmerPhone,
                  Product: order.productName,
                  Price: order.productPrice ? order.productPrice : 0,
                  Date: order.orderDate,
                  Status: order.farmerInputOrder ? order.farmerInputOrder.inputOrderStatus : ''
                });
            }

            this.isTableLoaded = true;
            this.refreshTable(this.inputOrders);
        });
    }

  onChangeStatus(event) {
    this.searchText = '';
    const status = event.target.value;
    this.selectedStatus = status;
    if (status === 'all') {
      this.getFarmerMarketPlaceOrders(false);
    } else {
      this.getFarmerMarketPlaceOrders(status);
    }
  }

    async onPageChange(page) {
        this.paginationData.currentPage = page;
        if (this.searchText !== '') {
          this.refreshTable(this.searchedFarmers);
        } else {
          this.refreshTable(this.inputOrders);
        }
      }
      async refreshTable(farmersList) {
        console.log(farmersList);
        
        this.filteredFarmersList = [];
        this.paginationData.total = farmersList.length;
        const pagesLength = farmersList.length / this.paginationData.pageSize;
        // const pagesLength = farmersList.length / this.paginationData.pageSize < 5 ? farmersList.length / this.paginationData.pageSize : 5;
        this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
        // for (let i = 0; i < this.paginationData.pages.length; i++) {
        //   this.paginationData.pages[i] = this.paginationData.pages[i] + this.paginationData.currentPage;
        // }
        let skip = this.paginationData.currentPage * this.paginationData.pageSize;
        for (let i = 0; i < this.paginationData.pageSize; i++) {
          const farmer = farmersList[skip];
          if (farmer) {
            this.filteredFarmersList.push(farmer);
            skip++;
          } else {
            break;
          }
        }
        this._cd.detectChanges();
      }
      async onSearch() {
        this.searchedFarmers = this.inputOrders.filter(farmer => {
          const term = this.searchText.toLowerCase();
          console.log(farmer);
          
          return farmer.farmerName.toLowerCase().includes(term)
            || farmer.farmerPhone.toLowerCase().includes(term)
            || farmer.productName.toLowerCase().includes(term)
            || farmer.productPrice.toString().toLowerCase().includes(term)
            || farmer.orderDate.toLowerCase().includes(term)
            || farmer.farmerInputOrder.inputOrderStatus.toLowerCase().includes(term)
        });
        this.paginationData.currentPage = 0;
        this.refreshTable(this.searchedFarmers);
      }
      async onSort(column) {
        this.activeSort = column;
        this.paginationData.currentPage = 0;
        if (this.tableHeader[column] === 0) {
          this.tableHeader[column] = 1;
        } else {
          this.tableHeader[column] = 0;
        }
        if (this.searchText !== '') {
          this.searchedFarmers = [...this.searchedFarmers].sort((a, b) => {
            let res = null;
            if (column === 'orderDate') {
                res = compareDate(a[column], b[column]);
            } else {
              res = compare(a[column], b[column]);
            }  
             return this.tableHeader[column] === 1 ? res : -res;
          });
          this.refreshTable(this.searchedFarmers);
        } else {
          this.inputOrders = [...this.inputOrders].sort((a, b) => {
            let res = null;
            if (column === 'orderDate') {
                res = compareDate(a[column], b[column]);
            } else if(column === 'inputOrderStatus'){
              res = compare(a['farmerInputOrder'][column], b['farmerInputOrder'][column]);
              
            } else {
              res = compare(a[column], b[column]);
            }  
            return this.tableHeader[column] === 1 ? res : -res;
          });
          this.refreshTable(this.inputOrders);
        }
      }
      
      async onPageSizeChange() {
        if (this.searchText !== '') {
          this.refreshTable(this.searchedFarmers);
        } else {
          this.refreshTable(this.inputOrders);
        }
      }
    exportexcel(): void {
        let element = this.exportData;
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        var filename = 'farmer-marketplace-orders-' + (new Date()).toLocaleDateString() + '.xlsx'
        XLSX.writeFile(wb, filename);
    }

    openPopUp(content, status, order) {
      this.followUpStatus = status.target.value;
        this.order = order;
        this.modalRef = this.modalService.open(content)
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed`;
        });
    }

    markProcessing() {
        
        const reqObj = {
            inputOrderStatus: this.followUpStatus
        }

        this.ngxLoader.stop();
        this.api.updateFarmerMarketPlaceOrder(this.order.id, reqObj).then(response => {

            this.modalRef.close();
            this.snackBar.open('Marked order ' + this.followUpStatus.toLowerCase() + ' .', 'Ok', {
                duration: 3000
            });
            if(this.selectedStatus == 'all') {
              this.getFarmerMarketPlaceOrders(false);
            } else {
              this.getFarmerMarketPlaceOrders(this.selectedStatus);
            }
            

        }, err => {
            this.snackBar.open('Failed to mark order'  + this.followUpStatus.toLowerCase() + ' .', 'Ok', {
                duration: 3000
            });
            console.log(err);
        })

    }

}