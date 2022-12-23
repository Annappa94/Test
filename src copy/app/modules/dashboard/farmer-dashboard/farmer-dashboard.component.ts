import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { ChartType, ChartOptions } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as _moment from 'moment';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexYAxis,
  ApexStroke,
  ApexTitleSubtitle,
  ApexFill,
  ApexLegend,
  ApexTooltip
} from "ng-apexcharts";

export type apexPieChartByWeight = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
};


@Component({
  selector: 'app-farmer-dashboard',
  templateUrl: './farmer-dashboard.component.html',
  styleUrls: ['./farmer-dashboard.component.scss']
})
export class FarmerDashboardComponent implements OnInit {
  @ViewChild("chart") charts: ChartComponent;
  public apexPieChartByWeight: Partial<apexPieChartByWeight>;
  public apexPieChartByCenter: Partial<apexPieChartByWeight>;
  // public apexPieChartByWeight: Partial<apexPieChartByWeight>;


  totals;
  cocoonAnalytics;
  progressBarWidth = {
    BIVOLTINE: '',
    CBGOLD: '',
    SEEDCOCOON: ''
  }
  paymentAnalytics: any;
  cocoonSoldWastage;
  cocoonLotAnalytics;
  totalCenter = 0;
  logisticsExpense = 0;
  // pie chart
  public pieChartOptions

  pieChartWgtByCenterData;

  pieChartLogisticsByCenterData;
  pieChartLogisticsByCenterLabel;

  public pieChartLabels
  public pieChartData
  public pieChartType
  public pieChartLegend
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors;

  // line chart

  public lineChartData;
  public lineChartLabels: Label[] = [];
  public lineChartOption: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: '#7ed321',
      borderColor: 'rgba(148,159,177,0.7)',
      pointBackgroundColor: 'rgba(148,159,177,0.7)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.6)'
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  startDate: any;
  endDate: any;
  totalLots = 0
  weightByCenterValue = 'lastWeek';
  logisticsExpByCenterValue = 'lastWeek';
  lotTrends = 'lastWeek';
  operations = 'lastWeek';

  constructor(
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private router: Router,
    private ngxLoader : NgxUiLoaderService,
  ) {
    this.totals = {};
    this.cocoonAnalytics = {};
    this.cocoonAnalytics.byType = {};
    this.populateDashboardObjects();
    this.getPaymentAnalytics();
    //this.getNewLotCount(); -> Not needed, returned now in totals api
    this.getCoconLotAnalytics();
    this.getAllCenters();
    this.operationsAnalytics(this.operations);
    this.lotTrendsDate(this.lotTrends);
    this.logisticsByCenter(this.logisticsExpByCenterValue);
    this.weightByCenter(this.weightByCenterValue);
  }

  ngOnInit(): void {
    this.apexPieChartByWeight = {
      series: [
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: [],
        labels: {
          formatter: function(val) {
            return val + "Kg";
          }
        }
      },
      yaxis: {
        title: {
          text: undefined
        }
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val + "Kg";
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
        show:true,
      },
      fill: {
        opacity: 1
      }
    };
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
    this.pieChartLabels = [];
    this.pieChartData = [];
    this.pieChartType = 'pie';
    this.pieChartLegend = true;
    this.pieChartPlugins = [pluginDataLabels];
    
    this.apexPieChartByCenter = {
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

  getCoconLotAnalytics() {
    this.ngxLoader.stop();
    this.api.getCocoonLotAnalytics().then(res => {
      this.cocoonLotAnalytics = res;
      this.ngxLoader.stop();
    }, err => {
      console.log(err);
    })
  }

  operationsAnalytics(value) {
    const moment = _moment;
    if (value === 'all') {
      let today = Date.parse(moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toISOString());
      let allData = Date.parse(moment('2021-01-01T00:00:00Z').toISOString());
      this.getCoocoonLotWastage(allData, today);
      this.getLogisticsExpense(allData, today);
    }

    else if (value === 'lastWeek') {
      let beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
      let day = beforeOneWeek.getDay()
      let diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
      let lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
      let lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));
      var fromDate = Date.parse(new Date(lastMonday.getFullYear(), lastMonday.getMonth(), lastMonday.getDate(), 0,0,0,0).toISOString());
      let toDate = Date.parse(new Date(lastSunday.getFullYear(), lastSunday.getMonth(), lastSunday.getDate(), 23, 59,59,0).toISOString());
      this.getCoocoonLotWastage(fromDate, toDate);
      this.getLogisticsExpense(fromDate, toDate);
    }
    else if (value === 'lastMonth') {
      let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth() - 1;
      let firstDay = Date.parse(new Date(y, m, 1).toISOString());
      let lastDay = Date.parse(new Date(y, m + 1, 0, 23, 59, 59, 0).toISOString());
      this.getLogisticsExpense(firstDay, lastDay);
    }
  }

  getLogisticsExpense(fromDate, toDate) {
    this.ngxLoader.stop();
    this.api.getCocoonLogisticsExpenses(fromDate, toDate).then(res => {
      this.logisticsExpense = res['logisticsExpenses'];
      this.ngxLoader.stop();
      this._cd.detectChanges();
    }, err => {
      console.log(err);
    })
  }

  getCoocoonLotWastage(fromDate, toDate) {
    this.ngxLoader.stop();
    this.api.getCocoonSoldWastage(fromDate, toDate).then(res => {
      this.cocoonSoldWastage = res['wastage'];
      this.ngxLoader.stop();
    }, err => {
      console.log(err);
    })
  }

  weightByCenter(value) {
    const moment = _moment;
    if (value === 'all') {
      let today = Date.parse(moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toISOString());
      let allData = Date.parse(moment('1970-01-01T00:00:00Z').toISOString());
      this.getWeightByCenter(allData, today);
    }

    else if (value === 'lastWeek') {
      let beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
      let day = beforeOneWeek.getDay()
      let diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
      let lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
      let lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));
      var fromDate = Date.parse(new Date(lastMonday.getFullYear(), lastMonday.getMonth(), lastMonday.getDate(), 0,0,0,0).toISOString());
      let toDate = Date.parse(new Date(lastSunday.getFullYear(), lastSunday.getMonth(), lastSunday.getDate(), 23, 59,59,0).toISOString());
      this.getWeightByCenter(fromDate, toDate);
    }
    else if (value === 'lastMonth') {
      let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth() - 1;
      let firstDay = Date.parse(new Date(y, m, 1).toISOString());
      let lastDay = Date.parse(new Date(y, m + 1, 0, 23, 59, 59, 0).toISOString());
      this.getWeightByCenter(firstDay, lastDay);
    }
  }

  getWeightByCenter(fromDate, toDate) {
    this.ngxLoader.stop();
    this.api.getProcuredAndSoldWeightByCenter(fromDate, toDate).then(res => {
      this.ngxLoader.stop();
      this.apexPieChartByWeight = {
        series: res['cocoonLotProcuredAndSoldWeightByCenter'],
        chart: {
          type: "bar",
          // height: 350,
          stacked: true
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        stroke: {
          width: 1,
          colors: ["#fff"]
        },
        xaxis: {
          categories: res['centerNames'],
          labels: {
            formatter: function(val) {
              return val + "Kg";
            }
          }
        },
        yaxis: {
          title: {
            text: undefined
          }
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val + "Kg";
            }
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          // offsetX: 40,
          show:true,
        },
        fill: {
          opacity: 1
        }
      };
      this.pieChartWgtByCenterData = res['centerNames'];
      this._cd.detectChanges();
    }, err => {
      console.log(err);
    })
  }

  logisticsByCenter(value) {
    const moment = _moment;
    if (value === 'all') {
      let today = Date.parse(moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toISOString());
      let allData = Date.parse(moment('1970-01-01T00:00:00Z').toISOString());
      this.getLogisticsByCenter(allData, today);
    }

    else if (value === 'lastWeek') {
      let beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
      let day = beforeOneWeek.getDay()
      let diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
      let lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
      let lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));
      var fromDate = Date.parse(new Date(lastMonday.getFullYear(), lastMonday.getMonth(), lastMonday.getDate(), 0,0,0,0).toISOString());
      let toDate = Date.parse(new Date(lastSunday.getFullYear(), lastSunday.getMonth(), lastSunday.getDate(), 23, 59,59,0).toISOString());
      this.getLogisticsByCenter(fromDate, toDate);
    }
    else if (value === 'lastMonth') {
      let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth() - 1;
      let firstDay = Date.parse(new Date(y, m, 1).toISOString());
      let lastDay = Date.parse(new Date(y, m + 1, 0, 23, 59, 59, 0).toISOString());
      this.getLogisticsByCenter(firstDay, lastDay);
    }
  }

  getLogisticsByCenter(fromDate, toDate) {
    this.ngxLoader.stop();
    this.api.getLogisticsExpensesByCenter(fromDate, toDate).then(res => {
      this.ngxLoader.stop();
      this.apexPieChartByCenter = {
        series: [
          {
            name: "Rs.",
            data: res[1]
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
          categories: res[0]
        }
      };
      this.pieChartLogisticsByCenterData = res[1];
      this.pieChartLogisticsByCenterLabel = res[0];
    }, err => {
      console.log(err);
    });
  }

  getCocoonLotTrends(fromDate, toDate) {
    this.ngxLoader.stop();
    this.api.getCocoonLotTrend(fromDate, toDate).then(res => {
      this.ngxLoader.stop();
      const data = res['weights'];
      const label = res['createdDateSet'];
      this.lineChartLabels = label;
      this.lineChartData = [
        { data: data, label: 'Weight Vs Time' },
      ];
      this._cd.detectChanges();
    });
  }

  lotTrendsDate(value) {
    const moment = _moment;
    if (value === 'all') {
      let today = Date.parse(moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toISOString());
      let allData = Date.parse(moment('2021-01-01T00:00:00Z').toISOString());
      this.getCocoonLotTrends(allData, today);
    }

    else if (value === 'lastWeek') {
      let beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
      let day = beforeOneWeek.getDay()
      let diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
      let lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
      let lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));
      var fromDate = Date.parse(new Date(lastMonday.getFullYear(), lastMonday.getMonth(), lastMonday.getDate(), 0,0,0,0).toISOString());
      let toDate = Date.parse(new Date(lastSunday.getFullYear(), lastSunday.getMonth(), lastSunday.getDate(), 23, 59,59,0).toISOString());
      this.getCocoonLotTrends(fromDate, toDate);

    }
    else if (value === 'lastMonth') {
      let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth() - 1;
      let firstDay = Date.parse(new Date(y, m, 1).toISOString());
      let lastDay = Date.parse(new Date(y, m + 1, 0, 23, 59, 59, 0).toISOString());
      this.getCocoonLotTrends(firstDay, lastDay);
    }
  }


  async populateDashboardObjects() {
    this.ngxLoader.stop();
    this.api.getCocoonLotsAnalytics().then(res => {
      this.ngxLoader.stop();
      this.cocoonAnalytics = res;
      if (this.cocoonAnalytics.byType && this.cocoonAnalytics.byType.BIVOLTINE > 0) {
        this.progressBarWidth.BIVOLTINE = (this.cocoonAnalytics.byType.BIVOLTINE / 5000) * 100 + '%';
      }
      else {
        this.progressBarWidth.BIVOLTINE = "0%"
      }

      if (this.cocoonAnalytics.byType && this.cocoonAnalytics.byType.CBGOLD > 0) {
        this.progressBarWidth.CBGOLD = (this.cocoonAnalytics.byType.CBGOLD / 5000) * 100 + '%';
      }
      else {
        this.progressBarWidth.CBGOLD = "0%"
      }

      if (this.cocoonAnalytics.byType && this.cocoonAnalytics.byType.SEEDCOCOON > 0) {
        this.progressBarWidth.SEEDCOCOON = (this.cocoonAnalytics.byType.SEEDCOCOON / 5000) * 100 + '%';
      }
      else {
        this.progressBarWidth.SEEDCOCOON = "0%"
      }

      this._cd.detectChanges();
    });

    this.ngxLoader.stop();
    this.api.getTotalsAnalytics().then(res => {
      this.ngxLoader.stop();
      this.totals = res;
      this._cd.detectChanges();
    });
  }

  async getNewLotCount() {
    this.ngxLoader.stop();
    this.api.getCocoonLotsList(false).then(res => {
      this.ngxLoader.stop();
      this.totalLots = res['page'].totalElements ? res['page'].totalElements : 0;
    })
  }

  async getAllCenters() {
    this.ngxLoader.stop();
    this.api.getAllCenter().then(res => {
      this.ngxLoader.stop();
      this.totalCenter = res['page'].totalElements ? res['page'].totalElements : 0;
      this._cd.detectChanges();
    })
  }

  async getPaymentAnalytics() {
    this.ngxLoader.stop();
    this.api.paymentAnalytics().then(res => {
      this.paymentAnalytics = res;
      this._cd.detectChanges();
    }, err => {
      console.log(err);
    });
  }

}
