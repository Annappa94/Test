import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import { ChartType } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
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
  selector: 'app-chawki-dashboard',
  templateUrl: './chawki-dashboard.component.html',
  styleUrls: ['./chawki-dashboard.component.scss']
})
export class ChawkiDashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptionsForTopSoldItems: Partial<ChartOptions>;
  
  totals;
  paymentAnalytics: any;
  yarnTrends = 'lastWeek';
  operations = 'lastWeek';
  orders = 'all';

  paymentMethod = 'all';
  paymentStatus = 'all';
  orderStatus = 'all';
  topChawkiOrders = 'all';
  topSoldItems = 'all';

  barChartTopChawkiOrderData = [];
  barChartTopSoldItemsData = [];

  orderAnalytics;
    // pie chart
    public pieChartOptions

    pieChartForOrderStatusData;
    pieChartForOrderStatusLabel;
  
    pieChartforPmtStatusData;
    pieChartforPmtStatusLabel;
  
    pieChartforPmtMethodLabels;
    pieChartforPmtMethodData;

    public pieChartType
    public pieChartLegend
    public pieChartPlugins = [pluginDataLabels];
    public pieChartColors;
  
    @ViewChild(BaseChartDirective, { static: true }) charts: BaseChartDirective;

  constructor(
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private router: Router,
    private ngxLoader : NgxUiLoaderService
  ){
    this.ngxLoader.stop();
    this.getPaymentAnalytics();
    this.getTotalAnalytics();
    this.getOrderAnalytics(this.orders);
    this.getPmtMethodAnalytics(this.paymentMethod);
    this.getPmtStatusAnalytics(this.paymentStatus);
    this.getChawkiAnalyticsByOrdrStatus(this.orderStatus);
    this.getChawkiAnalyticsTopOrders(this.topChawkiOrders);
    this.getTopSoldItems(this.topSoldItems);
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

    this.chartOptionsForTopSoldItems = {
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

  };
    
  ngOnInit(): void {  
    this.pieChartOptions = {
      responsive: true,
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: '#7ed321'
      }
      },
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            return value;
          },
        },
        label: {
          display: true
        }
      }
    };

    this.pieChartType = 'pie';
    this.pieChartLegend = true;
    this.pieChartPlugins = [pluginDataLabels];

    this.pieChartforPmtMethodLabels = [];
    this.pieChartforPmtMethodData = [];
    this.pieChartforPmtStatusData = [];
    this.pieChartforPmtStatusLabel = [];
  }

  getTotalAnalytics() {
    const moment = _moment;
    let today = Date.parse(moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toISOString());      
    let allData = Date.parse(moment('1970-01-01T00:00:00Z').toISOString());
    this.ngxLoader.stop();
    this.api.getChawkiTotalsAnalytics(allData, today).then(res => {
      this.totals = res;
    })
  }

  async getPaymentAnalytics() {
    this.api.getChawkiPaymentAnalytics().then(res => {
      this.paymentAnalytics = res;
      this._cd.detectChanges();
    }, err=> {
      console.log(err);
    });
  }

  farmerDetails(farmer) {
    this.router.navigate(['/resha-farms/farmers/details', farmer.id]);
  }
  
  chawkiDetails(chawki) {
    this.router.navigate(['/resha-farms/chawki/details', chawki.id]);
  }

  

  getOrderAnalytics(value) {
    const moment = _moment;
    if(value === 'all') {
      let today = Date.parse(moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toISOString());      
      let allData = Date.parse(moment('1970-01-01T00:00:00Z').toISOString());
      this.getChawkiOrderAnalytics(allData, today);
    }
     
     else if(value === 'lastWeek') {
      let beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
      let day = beforeOneWeek.getDay()
      let diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
      let lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
      let lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));
      var fromDate = Date.parse(new Date(lastMonday.getFullYear(), lastMonday.getMonth(), lastMonday.getDate(), 0,0,0,0).toISOString());
      let toDate = Date.parse(new Date(lastSunday.getFullYear(), lastSunday.getMonth(), lastSunday.getDate(), 23, 59,59,0).toISOString());
      this.getChawkiOrderAnalytics(fromDate, toDate);
    }
     else if(value === 'lastMonth') {
      let date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth() - 1;
    let firstDay = Date.parse(new Date(y, m, 1).toISOString());
    let lastDay = Date.parse(new Date(y, m + 1, 0, 23, 59, 59, 0).toISOString());
    this.getChawkiOrderAnalytics(firstDay, lastDay);           
    }
  }

  getChawkiOrderAnalytics(fromDate, toDate) {
    this.ngxLoader.stop();
    this.api.getChawkiOrderAnalytics(fromDate, toDate).then(res=> {
      this.orderAnalytics = res;
      this._cd.detectChanges();
    }, err => {
      console.log(err);
    })
  }

  getPmtMethodAnalytics(value) {
    const moment = _moment;
    if(value === 'all') {
      let today = Date.parse(moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toISOString());      
      let allData = Date.parse(moment('1970-01-01T00:00:00Z').toISOString());
      this.getChawkiPmtMethodAnalytics(allData, today);
    }
     
     else if(value === 'lastWeek') {
      let beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
      let day = beforeOneWeek.getDay()
      let diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
      let lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
      let lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));
      var fromDate = Date.parse(new Date(lastMonday.getFullYear(), lastMonday.getMonth(), lastMonday.getDate(), 0,0,0,0).toISOString());
      let toDate = Date.parse(new Date(lastSunday.getFullYear(), lastSunday.getMonth(), lastSunday.getDate(), 23, 59,59,0).toISOString());
      this.getChawkiPmtMethodAnalytics(fromDate, toDate);
    }
     else if(value === 'lastMonth') {
      let date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth() - 1;
    let firstDay = Date.parse(new Date(y, m, 1).toISOString());
    let lastDay = Date.parse(new Date(y, m + 1, 0, 23, 59, 59, 0).toISOString());
    this.getChawkiPmtMethodAnalytics(firstDay, lastDay);           
    }
  }

  getChawkiPmtMethodAnalytics(fromDate, toDate) {
    this.ngxLoader.stop();
    this.api.getChawkiPmtMethodAnalytics(fromDate, toDate).then(res=> {
      this.pieChartforPmtMethodLabels = res['label'];
      this.pieChartforPmtMethodData = res['data'];
      this._cd.detectChanges();
    }, err => {
      console.log(err);
    })
  }

  getPmtStatusAnalytics(value) {
    const moment = _moment;
    if(value === 'all') {
      let today = Date.parse(moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toISOString());      
      let allData = Date.parse(moment('1970-01-01T00:00:00Z').toISOString());
      this.getChawkiPmtStatusAnalytics(allData, today);
    }
     
     else if(value === 'lastWeek') {
      let beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
      let day = beforeOneWeek.getDay()
      let diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
      let lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
      let lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));
      var fromDate = Date.parse(new Date(lastMonday.getFullYear(), lastMonday.getMonth(), lastMonday.getDate(), 0,0,0,0).toISOString());
      let toDate = Date.parse(new Date(lastSunday.getFullYear(), lastSunday.getMonth(), lastSunday.getDate(), 23, 59,59,0).toISOString());
      this.getChawkiPmtStatusAnalytics(fromDate, toDate);
    }
     else if(value === 'lastMonth') {
      let date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth() - 1;
    let firstDay = Date.parse(new Date(y, m, 1).toISOString());
    let lastDay = Date.parse(new Date(y, m + 1, 0, 23, 59, 59, 0).toISOString());
    this.getChawkiPmtStatusAnalytics(firstDay, lastDay);           
    }
  }

  getChawkiPmtStatusAnalytics(fromDate, toDate) {
    this.ngxLoader.stop();
    this.api.getChawkiPmtStatusAnalytics(fromDate, toDate).then(res=> {
      this.pieChartforPmtStatusLabel = res['label'];
      this.pieChartforPmtStatusData = res['data'];
      this._cd.detectChanges();
    }, err => {
      console.log(err);
    })
  }

  getChawkiAnalyticsByOrdrStatus(value) {
    const moment = _moment;
    if(value === 'all') {
      let today = Date.parse(moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toISOString());      
      let allData = Date.parse(moment('1970-01-01T00:00:00Z').toISOString());
      this.getChawkiAnalyticsByOrderStatus(allData, today);
    }
     
     else if(value === 'lastWeek') {
      let beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
      let day = beforeOneWeek.getDay()
      let diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
      let lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
      let lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));
      var fromDate = Date.parse(new Date(lastMonday.getFullYear(), lastMonday.getMonth(), lastMonday.getDate(), 0,0,0,0).toISOString());
      let toDate = Date.parse(new Date(lastSunday.getFullYear(), lastSunday.getMonth(), lastSunday.getDate(), 23, 59,59,0).toISOString());
      this.getChawkiAnalyticsByOrderStatus(fromDate, toDate);
    }
     else if(value === 'lastMonth') {
      let date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth() - 1;
    let firstDay = Date.parse(new Date(y, m, 1).toISOString());
    let lastDay = Date.parse(new Date(y, m + 1, 0, 23, 59, 59, 0).toISOString());
    this.getChawkiAnalyticsByOrderStatus(firstDay, lastDay);           
    }
  }

  getChawkiAnalyticsByOrderStatus(fromDate, toDate) {
    this.ngxLoader.stop();
    this.api.getChawkiAnalyticsByOrderStatus(fromDate, toDate).then(res=> {
      this.pieChartForOrderStatusLabel = res['label'];
      this.pieChartForOrderStatusData = res['data'];
      this._cd.detectChanges();
    }, err => {
      console.log(err);
    })
  }

  // get top orders for chawki's

  getChawkiAnalyticsTopOrders(value) {
    const moment = _moment;
    if(value === 'all') {
      let today = Date.parse(moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toISOString());      
      let allData = Date.parse(moment('1970-01-01T00:00:00Z').toISOString());
      this.getChawkiAnalyticsByMostOrders(allData, today);
    }
     
     else if(value === 'lastWeek') {
      let beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
      let day = beforeOneWeek.getDay()
      let diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
      let lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
      let lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));
      var fromDate = Date.parse(new Date(lastMonday.getFullYear(), lastMonday.getMonth(), lastMonday.getDate(), 0,0,0,0).toISOString());
      let toDate = Date.parse(new Date(lastSunday.getFullYear(), lastSunday.getMonth(), lastSunday.getDate(), 23, 59,59,0).toISOString());
      this.getChawkiAnalyticsByMostOrders(fromDate, toDate);
    }
     else if(value === 'lastMonth') {
      let date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth() - 1;
    let firstDay = Date.parse(new Date(y, m, 1).toISOString());
    let lastDay = Date.parse(new Date(y, m + 1, 0, 23, 59, 59, 0).toISOString());
    this.getChawkiAnalyticsByMostOrders(firstDay, lastDay);           
    }
  }

  getChawkiAnalyticsByMostOrders(fromDate, toDate) {
    this.ngxLoader.stop();
    this.api.getChawkiAnalyticsTopChawkiOrders(fromDate, toDate).then(res=> {
      this.barChartTopChawkiOrderData = res['data'];
      this.chartOptions = {
        series: [
          {
            name: "Orders",
            data: res['data']
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
          categories: res['label']
        }
      };
      this._cd.detectChanges();
    }, err => {
      console.log(err);
    })
  }

  getTopSoldItems(value) {
    const moment = _moment;
    if(value === 'all') {
      let today = Date.parse(moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toISOString());      
      let allData = Date.parse(moment('1970-01-01T00:00:00Z').toISOString());
      this.getTopMostSoldItems(allData, today);
    }
     
     else if(value === 'lastWeek') {
      let beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
      let day = beforeOneWeek.getDay()
      let diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
      let lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
      let lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));
      var fromDate = Date.parse(new Date(lastMonday.getFullYear(), lastMonday.getMonth(), lastMonday.getDate(), 0,0,0,0).toISOString());
      let toDate = Date.parse(new Date(lastSunday.getFullYear(), lastSunday.getMonth(), lastSunday.getDate(), 23, 59,59,0).toISOString());
      this.getTopMostSoldItems(fromDate, toDate);
    }
     else if(value === 'lastMonth') {
      let date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth() - 1;
    let firstDay = Date.parse(new Date(y, m, 1).toISOString());
    let lastDay = Date.parse(new Date(y, m + 1, 0, 23, 59, 59, 0).toISOString());
    this.getTopMostSoldItems(firstDay, lastDay);           
    }
  }

  getTopMostSoldItems(fromDate, toDate) {
    this.ngxLoader.stop();
    this.api.getChawkiAnalyticsTopSoldItems(fromDate, toDate).then(res=> {
      this.barChartTopSoldItemsData = res['data'];
      this.chartOptionsForTopSoldItems = {
        series: [
          {
            name: "Orders",
            data: res['data']
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
          categories: res['label']
        }
      };
      this._cd.detectChanges();
    }, err => {
      console.log(err);
    })
  }
  
}
