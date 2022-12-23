import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ApiService } from 'src/app/services/api/api.service';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions
} from "ng-apexcharts";
import { NgxUiLoaderService } from 'ngx-ui-loader';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-coupon-management',
  templateUrl: './coupon-management.component.html',
  styleUrls: ['./coupon-management.component.scss']
})
export class CouponManagementComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  searchText = '';
  isTableLoaded = false;
  advisoryData = [];
  deleteCoupon;
  modalRef;
  closeResult: string;
  couponCodeList: any = [];
  couponUsageList: any = [];
  user;
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
    centerName: 0,
    ownerName: 0,
    ownerPhoneNumber: 0,
    region: 0,
  };
  expandImage = false;
  modelImage = '';
  constructor(
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private utils: UtilsService,
    private ngxLoader : NgxUiLoaderService
    ) {
      this.user = JSON.parse(localStorage.getItem('_ud'))
        this.getAllCoupons();
     }

  ngOnInit(): void {
    this.chartOptions = {
      series: [
        {
          name: "Orders",
          data: []
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: []
      }
    };
  }
  getAllCoupons(){
    this.advisoryData = [];
    this.ngxLoader.stop();
    this.api.getAllCoupons().then((res: any) => {
      if(res.length) {
        res.forEach(element => {
          this.couponCodeList.push(element.couponCode);
          this.couponUsageList.push(element.couponUsedNoOfTimes ? element.couponUsedNoOfTimes : 0);
          this.advisoryData.push({
            id: element.id,
            couponCode: element.couponCode,
            fromDate: element.createdDate ? this.utils.getDisplayTime(element.fromDate) : '',
            toDate: element.createdDate ? this.utils.getDisplayTime(element.toDate) : '',
            createdDate: element.createdDate ? this.utils.getDisplayTime(element.createdDate) : '',
            createdBy: element.createdBy ? element.createdBy : '-',
            lastModifiedBy: element.lastModifiedBy ? element.lastModifiedBy : '-',
            lastModifiedDate: element.lastModifiedDate ? this.utils.getDisplayTime(element.lastModifiedDate) : '-',
            applicableFor : element.applicableFor ? element.applicableFor : [],
            value: element.value ? element.value : 0,
            isActive: element.isActive ? 'Yes' : 'No',
            type: element.type,
            minTransactionAmount: element.minTransactionAmount ? element.minTransactionAmount : '',
            description: element.description ? element.description : '',
            noOfTimesCanBeUsedPerCustomer: element.noOfTimesCanBeUsedPerCustomer ? element.noOfTimesCanBeUsedPerCustomer : '',
            noOfTimesCanBeUsedTotal: element.noOfTimesCanBeUsedTotal ? element.noOfTimesCanBeUsedTotal: '',
            couponUsedNoOfTimes: element.couponUsedNoOfTimes ? element.couponUsedNoOfTimes : 0,
            totalAmountRedeemed: element.totalUsageValue ? Math.round((element.totalUsageValue + Number.EPSILON)*100)/100 : 0
          })
        });
      }
      //console.log(res);
      this.generateChart();
      console.log(this.advisoryData);
      
      this._cd.detectChanges();
    });
  }

  generateChart() {
    this.chartOptions = {
      series: [
        {
          name: "Orders",
          data: this.couponUsageList
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: this.couponCodeList
      }
    };
  }
  
  createNew() {
    this.router.navigate(['/resha-farms/coupon-management-crud']);
  }

  couponDetails(item) {
    this.router.navigate(['/resha-farms/coupon-details', item.id]);
  }

  open(content, item) {
    this.deleteCoupon = item;
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  delete() {

    this.modalRef.close();
    this.ngxLoader.stop();
    this.api.deleteCouponCode(this.deleteCoupon.id).then(res => {
        this.getAllCoupons();
        this.snackBar.open(this.deleteCoupon.couponCode + ' deleted successfully', 'Ok', {
          duration: 3000
        });
      
    })
  }

  edit(item) {
    this.router.navigate(['/resha-farms/coupon-crud', item.id]);
  }

  showImage(item) {
    this.modelImage = item.imageUrls;
    this.expandImage = true;
  }

}

