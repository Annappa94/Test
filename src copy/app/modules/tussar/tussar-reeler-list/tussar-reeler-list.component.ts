// import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx'; 
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FollowupsCrudComponent } from '../../shared/followup-crud/followups-crud.component';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-tussar-reeler-list',
  templateUrl: './tussar-reeler-list.component.html',
  styleUrls: ['./tussar-reeler-list.component.scss']
})
export class TussarReelerListComponent implements OnInit {



  searchText;
  isTableLoaded = false;
  fileName= 'reelers-list.xlsx';  
  reelersData = [];   
  
  searchedReelers = [];
  filteredReelersList = [];
  activeSort = '';
  userType;
  paginationData = {
    currentPage : 0,
    pageSize    : 10,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  };
  tableHeader = {
    id : 1,
    name : 0,
    phone : 0,
    chaakiDate : 0,
    address: {
      'city' : 0,
    },
    center: {
      'centerName' : 0
    },
    createdDate: 0,
    availableAdvance: 0,
  };
  exportData = [];
  blacklist:any;
  closeResult;
  modalRef;
  constructor(
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    private utils: UtilsService,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private ngxLoader : NgxUiLoaderService,
  ) {    
    this.userType = JSON.parse(localStorage.getItem('_ud'));
  }

  ngOnInit(): void {
    this.getReelerList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc');
  }
  
  totalElements: any;
  async getReelerList(page, size, column, direction) {
    this.ngxLoader.stop();
    this.api.getAllTussarReelersListByPage(page, size, column, direction).then(res => {
      this.reelersData=[]
      this.totalElements = res['totalElements'];
      res['content'].forEach(element => {
        this.reelersData.push({
          id: element.id,
          code: element.code ? element.code : '-',
          name: element.name ? element.name.toLowerCase() : '-',
          phone: element.phone ? element.phone : '-',
          city: element.address ? element.address.city ? element.address.city.toLowerCase() : '-' : '-',
          reeler: element ? element : '-',
          center: element.centerName ? element.centerName : '-' ,
          refferedBy: element.refferedBy ? element.refferedBy.toLowerCase() : '-',
          createdDate: this.utils.getDisplayTime(element.createdDate),
          sortCreatedDate: element.createdDate ? element.createdDate : 0,
          availableAdvance: element.availableAdvance ? element.availableAdvance : '-',
          appVersion: element.mobileInformation ? element.mobileInformation.version : '-'
        })
      });
      this.refreshTable(this.reelersData);
    });
  }
  
  @Output()
  listenAndRefreshPayment:EventEmitter<any> = new EventEmitter();
  listenAndRefreshPaymentFunction(){
    this.listenAndRefreshPayment.emit();
  }
  async refreshTable(reelerList) {
    this.filteredReelersList = [];    
    this.paginationData.total = this.totalElements;
    const pagesLength = this.totalElements / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
    this.filteredReelersList = reelerList;
    this._cd.detectChanges();
  }
  async onPageChange(page) {
    this.paginationData.currentPage = page;
    if(this.enableSearch){
      let searchParams = `(name==*${this.searchText.replace(/ /gi,"*")}* or phone==*${this.searchText.replace(/ /gi,"*")}* ${this.idParam} ${this.centerParam} and  productType=='Tussar')`;
      this.afterSearch(page, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, searchParams)
    } else {
      this.getReelerList(page, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection)
    }
  }
  textSearch;
  enableSearch: boolean = false;
  idParam;
  async onSearchKey(e){
    this.textSearch = e.target.value;
    if(this.textSearch.length > 1){
      this.enableSearch = true;
    } else if(this.textSearch.length < 1) {
        this.enableSearch = false;
        this.searchedReelers = [];
        this.paginationData.currentPage = 0;
        this.getReelerList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc');

    }
  }
  centerParam;
  async onSearch() {
    this.paginationData.currentPage = 0;
    if(isNaN(this.searchText)){
      if(this.searchText.includes('RMREELER')&&!isNaN(this.searchText.substring(8))){
        this.searchText = this.searchText.substring(8);
          this.idParam =  `and id==${this.searchText}`;
          this.centerParam = ''
      } else {
        this.idParam = '';
        this.centerParam =  `and center.centerName==*${this.searchText.replace(/ /gi,"*")}*`;
      }
    } else {
      this.centerParam = ''
      this.idParam =  `and id==${this.searchText}`;
    }
    let searchParams = `(name==*${this.searchText.replace(/ /gi,"*")}* and phone==*${this.searchText.replace(/ /gi,"*")}* ${this.idParam} ${this.centerParam})`;
    this.afterSearch(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, searchParams) 
  }
  appReelers: any;
  afterSearch(page, size, column, direction, searchParams){
    this.ngxLoader.stop();
    this.api.searchAllReelers(page, size, column, direction, searchParams).then(res => {
      this.totalElements = res['totalElements'];
      this.reelersData = [];    
      this.searchedReelers = [];
      this.appReelers = res['content'];
         this.appReelers.forEach(element => {
          this.searchedReelers.push({
            id: element.id,
            code: element.code ? element.code : '-',
            name: element.name ? element.name.toLowerCase() : '-',
            phone: element.phone ? element.phone : '-',
            city: element.address ? element.address.city ? element.address.city.toLowerCase() : '-' : '-',
            reeler: element ? element : '-',
            center: element.centerName ? element.centerName : '-' ,
            refferedBy: element.refferedBy ? element.refferedBy.toLowerCase() : '-',
            createdDate: this.utils.getDisplayTime(element.createdDate),
            sortCreatedDate: element.createdDate ? element.createdDate : 0,
            availableAdvance: element.availableAdvance ? element.availableAdvance : '-',
            appVersion: element.mobileInformation ? element.mobileInformation.version : '-'
          })
         });
         setTimeout(() => {                
           this.refreshTable(this.searchedReelers);
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
      let searchParams = `(name==*${this.searchText.replace(/ /gi,"*")}* or phone==*${this.searchText.replace(/ /gi,"*")}* ${this.idParam} ${this.centerParam})`;
      this.afterSearch(0, this.paginationData.pageSize, column, this.paginationData.currentDirection, searchParams)
    } else {
      this.getReelerList(0, this.paginationData.pageSize, column, this.paginationData.currentDirection)
    }
    //this.getFarmerList(0, this.paginationData.pageSize, column, this.paginationData.currentDirection)
     this.activeSort = column;
     this.paginationData.currentPage = 0;
  }
  async onPageSizeChange() {
    this.getReelerList(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection)

  }
  createNewReeler() {
    this.router.navigate(['/resha-farms/tussar/tussar-reeler-crud']);
  }

  editReeler(reeler) {
    this.router.navigate(['/resha-farms/tussar/tussar-reeler-crud', reeler.id]);
  }
  blackListFarmer(content,item){
    this.blacklist=item;
    this.modalRef = this.modalService.open(content);
    this.getReelerList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc');
     this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  blacklistFarmerAPI(){
    this.modalRef.close();
    this.ngxLoader.stop();
    this.api.putReeler(this.blacklist.reeler.id,{isBlackListed:!this.blacklist.reeler.isBlackListed}).then(res=>{
      this.snackBar.open('Updated Successfully', 'Ok', {
        duration: 3000
      });
      this.getReelerList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc')
     })
  }

  createFollowUp(): void {
    this._cd.detectChanges();
    let dialogRef = this.dialog.open(FollowupsCrudComponent, {
      width: '80vw',
      maxHeight: '68vh',
      data: { item: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this._cd.detectChanges();
      }
    });
  }

  reelerDetails(reeler) {
    //e.preventDefault();
    this.router.navigate(['/resha-farms/tussar/tussar-reeler-details', reeler.id]);
  }

}

  // constructor() { }

  // ngOnInit(): void {
  // }


