import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SearchService } from 'src/app/services/api/search.service';

@Component({
  selector: 'app-coupon-details',
  templateUrl: './coupon-details.component.html',
  styleUrls: ['./coupon-details.component.scss']
})
export class CouponDetailsComponent implements OnInit {
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
    pageSize: 10,
    total: 0,
    pages: [],
    currentColumn: 'createdDate',
    currentDirection: 'desc',
  };

  tableHeader = {
    id: 0,
    couponAmount: 0,
    customerName: 0,
    createdDate: 0,
    customerPhone: 0
  };
  id;
  couponDetails;

  constructor(
    private api: ApiService,
    public utils: UtilsService,
    private route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    private searchAPI: SearchService
  ) {
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.getCouponUsers();
        this.getCouponDetails();
      }
    });
  }

  ngOnInit(): void {
  }

  getCouponDetails() {
    this.api.getCouponById(this.id).then(details => {
      this.couponDetails = details;
    })
  }

  goBack() {
    this.router.navigate(['/coupon-management-list']);
  }

  buildSearchQuery(searchText: any) {
    let setItInQuery: any = `(promotionalCoupon.id==${this.id})`;
    if (searchText) {
      let text = searchText.replace(/ /gi, "*");
      (searchText && (setItInQuery += ` and (customerName==*${text}* or customerPhone==*${text}*)`));
    }
    return setItInQuery;
  }


  getCouponUsers() {
    this.centersData = [];
    this.filteredCentersList =[];
    this.ngxLoader.stop();
    this.searchAPI.getAllPromotionalUsage(this.paginationData, this.buildSearchQuery(this.searchText)).then((res: any) => {
      this.paginationData.total = res.totalElements;
      let list = res['content'];
      if (list.length > 0) {
        list.forEach(element => {
          let type = ''
          if (element.usedFor == 'Cocoon lot listed by farmer') {
            type = 'FARMER'
          } else if (element.usedFor == 'Yarnlisting listed by reeler') {
            type = 'REELER'
          }
          this.centersData.push({
            id: element.id,
            createdDate: element.createdDate ? this.utils.getDisplayTime(element.createdDate) : '-',
            customerName: element.customerName.toLowerCase(),
            customerPhone: element.customerPhone,
            customerId: element.customerId,
            usedFor: element.usedFor.toLowerCase(),
            customerType: type.toLowerCase(),
            couponAmount: element.couponAmount
          })
        });
        this.refreshTable(this.centersData);
        this._cd.detectChanges();
      }
    })
  }

  async refreshTable(list) {
    this.filteredCentersList = [];
    const pagesLength = this.paginationData.total / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);

    this.filteredCentersList = list;
    this._cd.detectChanges();
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
    this.activeSort = column;
    this.paginationData.currentPage = 0;
    this.getCouponUsers();
  }


  async onPageChange(page) {
    this.paginationData.currentPage = page;
    this.getCouponUsers();
  }

  async onSearch() {
    this.paginationData.currentPage = 0;
    this.getCouponUsers();
  }

  async onPageSizeChange() {
    this.getCouponUsers();
  }

  customerDetails(item) {
    if (item.customerType.toLowerCase() == 'farmer') {
      this.router.navigate(['/resha-farms/farmers/details', item.customerId]);
    }

    if (item.customerType.toLowerCase() == 'reeler') {
      this.router.navigate(['/reelers/details', item.customerId]);
    }
  }

}
