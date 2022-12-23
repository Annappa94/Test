import { ChangeDetectorRef, Inject, LOCALE_ID, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { MatDialog } from '@angular/material/dialog';
import { FollowupsCrudComponent } from '../../shared/followup-crud/followups-crud.component';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
@Component({
  selector: 'app-farmers-view',
  templateUrl: './farmers-view.component.html',
  styleUrls: ['./farmers-view.component.scss']
})
export class FarmersViewComponent implements OnInit {
  farmersList = [];
  searchedFarmers = [];
  filteredFarmersList = [];
  searchText;
  activeSort = '';
  datePipe;
  user;
  modalRef;
  closeResult: string;
  fileName = 'farmers-list.xlsx';

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
      'village' : 0,
    },
    center: {
      'centerName' : 0
    },
    cocoonType : 0,
    createdDate: 0,
  };
  blacklist:any;
  exportData = [];
  totalElements: any;
  filter:UntypedFormGroup = new UntypedFormGroup({
    productType:new UntypedFormControl('Silk')
  })
  userType:any;
  constructor(
    private api: ApiService,
    private utils: UtilsService,
    private router: Router,
    private _cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private globalService: GlobalService,
    @Inject(LOCALE_ID) private locale: string,
    public dialog: MatDialog,
    private ngxLoader : NgxUiLoaderService,
    private route:ActivatedRoute,
  ) {
    this.userType = JSON.parse(localStorage.getItem('_ud'));
   }
   productType:string = 'Silk';
  ngOnInit() {
    this.router.url.includes('cotton') && (this.productType = 'Cotton');
    this.filter.get('productType').patchValue(this.productType);
    this.getFarmerList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc');
    this.listenForFilterChanges();
  }
  
  listenForFilterChanges(){
    this.filter.valueChanges.subscribe(response=>{
      this.getFarmerList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc');
    })
  }

  async getFarmerList(page, size, column, direction) {
    this.farmersList = [];
    this.ngxLoader.stop();
    const { productType } = this.filter.value;
    this.api.getAllFarmersListByPage(page, size, column, direction,productType).then(res => {
      this.totalElements = res['totalElements'];
      res['content'].forEach(element => {
        if (element.chaakiDate !== undefined && element.chaakiDate !== null){
          this.datePipe = formatDate(element.chaakiDate, 'dd-MM-yyyy hh:mm', this.locale);
        }
        this.farmersList.push({
          id: element.id,
          name: element.name ? element.name.toLowerCase() : '-',
          phone: element.phone ? element.phone : '-',
          chaakiDate: element.chaakiDate ? this.utils.getDisplayTime(element.chaakiDate) : '-',
          type: element.cocoonType ? element.cocoonType : '-',
          village: element.address ? element.address.village ? element.address.village : '-' : '-',
          center: element.centerName ? element.centerName : '-',
          status: element.status ? element.status : '-',
          farmer : element ? element : '-',
          code : element.code ? element.code : '-',
          refferedBy: element.refferedBy ? element.refferedBy.toLowerCase() : '-',
          displayCocoonType:  element.cocoonType ? this.globalService.getDisplayCocoonType(element.cocoonType) : '-',
          createdDate: this.utils.getDisplayTime(element.createdDate),
          appVersion: element.mobileInformation ? element.mobileInformation.version : '-',
          productType:element.productType 
        });
      });
      this.refreshTable(this.farmersList);
    });
  }
  
  async onPageChange(page) {
    this.paginationData.currentPage = page;
    if(this.enableSearch){
      const { productType } = this.filter.value;
      let searchParams = `(name==*${this.searchText.replace(/ /gi,"*")}* or phone==*${this.searchText.replace(/ /gi,"*")}* ${this.idParam} ${this.centerParam} and productType=in=${productType})`;
      this.afterSearch(page, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, searchParams)
    } else {
      this.getFarmerList(page, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection)
    }
  }
  async refreshTable(farmersList) {
    this.filteredFarmersList = [];
    this.paginationData.total = this.totalElements;
    const pagesLength = this.totalElements / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
    this.filteredFarmersList = farmersList;
    this._cd.detectChanges();
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
        this.searchedFarmers = [];
        this.paginationData.currentPage = 0;
        this.getFarmerList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc');

    }
  }
  centerParam;
  appFarmers: any;
  async onSearch() {
    this.paginationData.currentPage = 0;
    if(isNaN(this.searchText)){
      if(this.searchText.includes('RMFARM')&&!isNaN(this.searchText.substring(6))){
        this.searchText = this.searchText.substring(6);        
        this.idParam = ' or id==' + this.searchText;
        this.centerParam = ''
      } else {
        this.idParam = '';
        this.centerParam =  `or center.centerName==*${this.searchText.replace(/ /gi,"*")}*`;
      }
    } else {
      this.centerParam = '';
      this.idParam = ' or id==' + this.searchText;
    }
    const { productType } = this.filter.value;
    let searchParams = `(name==*${this.searchText.replace(/ /gi,"*")}* or phone==*${this.searchText.replace(/ /gi,"*")}* ${this.idParam} ${this.centerParam}) and productType=in=${productType}`;
    this.afterSearch(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, searchParams)
    
  }
  afterSearch(page, size, column, direction, searchParams){
    this.ngxLoader.stop();
    this.api.searchAllFarmers(page, size, column, direction, searchParams).then(res => {
      this.totalElements = res['totalElements'];
      this.farmersList = [];    
      this.searchedFarmers = [];
      this.appFarmers = res['content'];
         this.appFarmers.forEach(element => {
           this.searchedFarmers.push({
             id: element.id,
             name: element.name ? element.name.toLowerCase() : '-',
             phone: element.phone ? element.phone : '-',
             chaakiDate: element.chaakiDate ? this.utils.getDisplayTime(element.chaakiDate) : '-',
             type: element.cocoonType ? element.cocoonType : '-',
             village: element.address ? element.address.village ? element.address.village : '-' : '-',
             center: element.centerName ? element.centerName : '-',
             status: element.status ? element.status : '-',
             farmer : element ? element : '-',
             code : element.code ? element.code : '-',
             refferedBy: element.refferedBy ? element.refferedBy : '-',
             createdDate: this.utils.getDisplayTime(element.createdDate),
             displayCocoonType:  element.cocoonType ? this.globalService.getDisplayCocoonType(element.cocoonType) : '-',
             appVersion: element.appVersion ? element.appVersion : '-',
             productType: element.productType
           });
         });
         setTimeout(() => {                
           this.refreshTable(this.searchedFarmers);
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
      const { productType } = this.filter.value;
      let searchParams = `(name==*${this.searchText.replace(/ /gi,"*")}* or phone==*${this.searchText.replace(/ /gi,"*")}* ${this.idParam} ${this.centerParam}  and productType=in=${productType})`;
      this.afterSearch(0, this.paginationData.pageSize, column, this.paginationData.currentDirection, searchParams)
    } else {
      this.getFarmerList(0, this.paginationData.pageSize, column, this.paginationData.currentDirection)
    }
    //this.getFarmerList(0, this.paginationData.pageSize, column, this.paginationData.currentDirection)
     this.activeSort = column;
     this.paginationData.currentPage = 0;
  }
  
  async onPageSizeChange() {
    this.getFarmerList(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection)
  }

  createNew() {
    if(this.productType == 'Cotton'){
      this.router.navigate(['/resha-farms/cotton-farmers/crud']);
    }else{
      this.router.navigate(['/resha-farms/farmers/crud']);
    }
  }
  open(content, item) {
    //console.log(item);
    this.user = item;
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed`;
    });
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

  delete(){
    this.modalRef.close();
    this.ngxLoader.stop();
    this.api.deleteFarmer(this.user.id).then(res => {
      if (res){
        this.getFarmerList(this.paginationData.currentPage, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection);
        this.snackBar.open(this.user.centerName + ' Deleted Successfully', 'Ok', {
          duration: 3000
        });
      } else {
        this.snackBar.open('Cannot delete the farmer', 'Ok', {
          duration: 3000
        });
      }
    });
  }

  blackListFramer(content,item){
    this.blacklist=item;
    this.modalRef = this.modalService.open(content);
    this.getFarmerList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc');
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  blacklistFarmerAPI(){
    this.modalRef.close();
    this.ngxLoader.stop();
    this.api.updateFarmers({isBlackListed:!this.blacklist.farmer.isBlackListed},this.blacklist.farmer.id).then(res=>{
      this.snackBar.open('Updated Successfully', 'Ok', {
        duration: 3000
      });
      this.getFarmerList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc');
    })
  }

  editFarmer(farmer) {
    if(this.productType == 'Cotton'){
      this.router.navigate(['/resha-farms/cotton-farmers/crud', farmer.id]);
    }else{
      this.router.navigate(['/resha-farms/farmers/crud', farmer.id]);
    }
  }
  farmerDetail(farmer) {
    if(this.productType == 'Cotton'){
      this.router.navigate(['/resha-farms/cotton-farmers/details', farmer.id]);
    }else{
      this.router.navigate(['/resha-farms/farmers/details', farmer.id]);
    }
  }
}
