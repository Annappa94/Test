import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormArray, UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { SearchService } from 'src/app/services/api/search.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CustomValidator } from 'src/app/modules/shared/custom-validator/custom.validator';
@Component({
  selector: 'app-divce-list-details',
  templateUrl: './divce-list-details.component.html',
  styleUrls: ['./divce-list-details.component.scss']
})
export class DivceListDetailsComponent implements OnInit {
  id: any;
  deviceDetails;
  deviceLogResponse: any;

  paginationData = {
    currentPage : 0,
    pageSize    : 10,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  };



  constructor(
    public utils:UtilsService,
    private api:ApiService,
    private apiSearch:SearchService,
    private _cd:ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private ngxLoader : NgxUiLoaderService,
    private modalService: NgbModal,
    private router:Router,
    private route:ActivatedRoute,
      private form: UntypedFormBuilder,
  ) {
    this.deviceDetails={};

   }

  ngOnInit(): void {
    const { id } = this.route.snapshot.params;
      this.id = id;
      this.id&&this.getDeviceDataById();
      
  }

  goBack(){
    this.router.navigate(['/device-management/device-list'])
  }
  routeTodevicetype(id){
    this.router.navigate([`/device-management/devicetype-details`,id]);
  }

  getDeviceDataById(){
    this.api.getDeviceDataByID(this.id).then(res=>{
      this.deviceDetails = res;
      this.getDeviceLogById();
    })

  }
  getDeviceLogById(){
    this.api.getDeviceLogs(this.deviceDetails?.code,this.paginationData).then(res=>{
      this.deviceLogResponse = res['content'];
      this.paginationData.total=res['totalElements'];
      this.refreshTable(this.deviceLogResponse);

    })
  }

  // pgenation code
  async onPageChange(page) {
    this.paginationData.currentPage = page;
    this.getDeviceLogById();
  }
  
  async onPageSizeChange() {
    this.paginationData.currentPage = 0;
    this.getDeviceLogById();
  }

  async refreshTable(list) {
    // this.res = [];
    const pagesLength = this.paginationData.total / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
    // this.res = list;
    this._cd.detectChanges();
  }
  
  // async onSort(column) {
  //   this.activeSort = column;
  //   this.paginationData.currentColumn = column;
  //   if (this.tableHeader[column] === 0) {
  //     this.paginationData.currentDirection = 'desc';
  //     this.tableHeader[column] = 1;
  //   } else {
  //     this.paginationData.currentDirection = 'asc';
  //     this.tableHeader[column] = 0;
  //   }
  //   this.activeSort = column;
  //   this.paginationData.currentPage = 0;
  //    this.getDeviceLogById();
  // }
  


}
