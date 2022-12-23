import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
const compareDate = (v1, v2) => new Date(v1) < new Date(v2) ? -1 : new Date(v1) > new Date(v2) ? 1 : 0;

@Component({
  selector: 'app-referral-coupon',
  templateUrl: './referral-coupons-list.component.html',
  styleUrls: ['./referral-coupons-list.component.scss']
})
export class ReferralCouponComponent implements OnInit {
  searchText = '';
  isTableLoaded = false;
  centersData = [];
  center;
  modalRef;
  closeResult: string;

  // table features
  activeSort = '';
  searchedCenters = [];
  filteredCentersList = [];
  paginationData = {
    currentPage: 0,
    pageSize: 50,
    total: 0,
    pages: []
  };

  tableHeader = {
    couponCode: 0,
    type: 0,
    value: 0,
    customerName: 0,
    customerId: 0,
    customerPhone: 0,
    referral: 0,
    customerRole: 0,
    sortCreatedDate: 0
  };

  referralCouponCount = 0;

  constructor(
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private utils: UtilsService,
    private router: Router,
    private ngxLoader : NgxUiLoaderService,
  ) { }

  ngOnInit(): void {
    this.getCenterList();
  }
  async getCenterList() {
    this.referralCouponCount = 0;
    this.centersData = [];
    this.ngxLoader.stop();
    this.api.getReferralCoupons().then(res => {
      res['_embedded']['referralcoupon'].forEach(element => {
        if(element.coupon.isReferral) {
          this.referralCouponCount++
        }
        this.centersData.push({
          id: element.coupon.id,
          createdDate: element.coupon.createdDate ? this.utils.getDisplayTime(element.coupon.createdDate) : '-',
          sortCreatedDate: element.coupon.createdDate ? element.coupon.createdDate : 0,
          couponCode: element.coupon.couponCode,
          type: element.coupon.type,
          value: element.coupon.value,
          isReferral: element.coupon.isReferral ? 'yes' : 'no',
          customerId: element.coupon.customerId ? element.coupon.customerId : '-',
          customerPhone: element.couponProjection ? element.couponProjection.phone ? element.couponProjection.phone : '-': '-',
          customerName: element.couponProjection ? element.couponProjection.name ? element.couponProjection.name : '-' : '-',
          customerRole: element.couponProjection ? element.couponProjection.role ? element.couponProjection.role : '-' : '-',

        })
      });
      this.refreshTable(this.centersData);
      this._cd.detectChanges();
    });
  }

  async onPageChange(page) {
    this.paginationData.currentPage = page;
    if (this.searchText !== '') {
      this.refreshTable(this.searchedCenters);
    } else {
      this.refreshTable(this.centersData);
    }
  }

  formatPrice(price){
    //console.log(price);
    const formatPrice = price.replace(/[, ]+/g, "").trim();    
    return +formatPrice;
  }

  async refreshTable(centersData) {
    this.filteredCentersList = [];
    this.paginationData.total = centersData.length;
    const pagesLength = centersData.length / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);

    let skip = this.paginationData.currentPage * this.paginationData.pageSize;
    for (let i = 0; i < this.paginationData.pageSize; i++) {
      const center = centersData[skip];
      if (center) {
        this.filteredCentersList.push(center);
        skip++;
      } else {
        break;
      }
    }
    this._cd.detectChanges();
  }
  async onSearch() {
    this.searchedCenters = this.centersData.filter(center => {
      const term = this.searchText.toLowerCase();
      return center.createdDate.toLowerCase().includes(term)
        || center.couponCode.toLowerCase().includes(term)
        || center.type.toLowerCase().includes(term)
        || center.value.toString().toLowerCase().includes(term)
        || center.customerId.toString().toLowerCase().includes(term)
        || center.customerName.toLowerCase().includes(term)
        || center.customerPhone.toLowerCase().includes(term)
        || center.customerRole.toLowerCase().includes(term)
        || center.isReferral.toLowerCase().includes(term)
        
    });
    this.paginationData.currentPage = 0;
    this.refreshTable(this.searchedCenters);
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
      this.searchedCenters = [...this.searchedCenters].sort((a, b) => {
        
        let res = null;
        if (column === 'createdDate') {
          
          res = compareDate(a[column], b[column]);
        } else if (column === 'displayTotalPrice' || column === 'displayPricePerKg'){
          res = compare(this.formatPrice(a[column]), this.formatPrice(b[column]));
        } else {
          res = compare(a[column], b[column]);
        }
        return this.tableHeader[column] === 1 ? res : -res;
      });
      this.refreshTable(this.searchedCenters);
    } else {
      this.centersData = [...this.centersData].sort((a, b) => {
        // console.log(this.formatDate(a[column]));
        let res = null;
        if (column === 'createdDate') {
          
          res = compareDate(a[column], b[column]);
        } else if (column === 'displayTotalPrice' || column === 'displayPricePerKg'){
          res = compare(this.formatPrice(a[column]), this.formatPrice(b[column]));
        } else {
          res = compare(a[column], b[column]);
        }
         
        return this.tableHeader[column] === 1 ? res : -res;
      });
      this.refreshTable(this.centersData);
    }
  }
  async onPageSizeChange() {
    if (this.searchText !== '') {
      this.refreshTable(this.searchedCenters);
    } else {
      this.refreshTable(this.centersData);
    }
  }

  navigateToDetails(item) {
    if(item.customerRole == 'FARMER') {
     this.router.navigate(['/resha-farms/farmers/details', item.customerId]);
    }
    if(item.customerRole == 'REELER') {
     this.router.navigate(['/reelers/crud', item.customerId]);
    }
    if(item.customerRole == 'WEAVER') {
     this.router.navigate(['/weavers/details', item.customerId]);
    }
  }

}
