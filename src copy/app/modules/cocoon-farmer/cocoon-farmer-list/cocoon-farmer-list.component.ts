import { ChangeDetectorRef, Inject, LOCALE_ID, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { MatDialog } from '@angular/material/dialog';
import { FollowupsCrudComponent } from '../../shared/followup-crud/followups-crud.component';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-cocoon-farmer-list',
  templateUrl: './cocoon-farmer-list.component.html',
  styleUrls: ['./cocoon-farmer-list.component.scss']
})


export class CocoonFarmerListComponent implements OnInit {
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
    productType:new UntypedFormControl('Silk'),
    csbStatus_Done:new UntypedFormControl(''),
    csbStatus_Pending:new UntypedFormControl('')
  })
  userType:any;
  documentVerified: string;
  textSearch;
  enableSearch: boolean = false;
  idParam;

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
    private apiSearch:SearchService,) {
    this.userType = JSON.parse(localStorage.getItem('_ud'));
   }
   productType:string = 'Silk';
    ngOnInit() {
      this.filter.get('productType').patchValue(this.productType);
      this.getFarmerList();
      this.listenForFilterChanges();
    }
    async onPageChange(page) {
      this.paginationData.currentPage = page;
      this.getFarmerList()
      // if(this.enableSearch){
      //   const { productType } = this.filter.value;
      //   let searchParams = `(name==*${this.searchText.replace(/ /gi,"*")}* or phone==*${this.searchText.replace(/ /gi,"*")}* ${this.idParam} ${this.centerParam} and productType=in=${productType})`;
      // } else {
      //   this.getFarmerList()
      // }
    }
  
    listenForFilterChanges(){
      this.filter.valueChanges.subscribe(response=>{
        // if(response.csbStatus_Done && response.csbStatus_Pending){
        //     this.isdocumentsVerified = "";
        // }else if(response.csbStatus_Done && ){

        // }        
        this.getFarmerList();
        // this.afterSearch(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection,  this.onSearch()) 

      })
    }

  async refreshTable(farmersList) {
    this.filteredFarmersList = [];
    this.paginationData.total = this.totalElements;
    const pagesLength = this.totalElements / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
    this.filteredFarmersList = farmersList;
    this._cd.detectChanges();
  }

  getFarmerList() {
    this.farmersList = [];
    this.ngxLoader.stop();
    // const { productType } = this.filter.value;
    // getAllFarmersListByPage
    this.apiSearch.getAllCocoonFarmersListData(this.paginationData,this.buildSerachQuery()).then(res => {
      this.totalElements = res['totalElements'];  
          
      res['content'].forEach(element => {
        if (element.chaakiDate !== undefined && element.chaakiDate !== null){
          this.datePipe = formatDate(element.chaakiDate, 'dd-MM-yyyy hh:mm', this.locale);
        }
        this.farmersList.push({
          id: element.id,
          name: element.name ? element.name.toLowerCase() : '-',
          phone: element.phone ? element.phone : '-',
          chaakiDate: element.chaakiDate ? this.utils.getDisplayDate(element.chaakiDate) : '-',
          type: element.cocoonType ? element.cocoonType : '-',
          village: element.address ? element.address.village ? element.address.village : '-' : '-',
          center: element.centerName ? element.centerName : '-',
          status: element.status ? element.status : '-',
          farmer : element ? element : '-',
          code : element.code ? element.code : '-',
          refferedBy: element.refferedBy ? element.refferedBy.toLowerCase() : '-',
          displayCocoonType:  element.cocoonType ? this.globalService.getDisplayCocoonType(element.cocoonType) : '-',
          createdDate: this.utils.getDisplayDate(element.createdDate),
          appVersion: element.mobileInformation ? element.mobileInformation.version : '-',
          productType:element.productType ,
          documentVerified : element.eligibleForTransactions,
          customerTypeName:element.customerTypeName
        });
      });
      this.refreshTable(this.farmersList);
      this._cd.detectChanges();
      //this.filteredFarmersList = this.farmersList;
    });
  }
  

  async onSearch() {
    
    this.enableSearch = true;
    this.paginationData.currentPage=0;
    this.getFarmerList();
  }

  buildSerachQuery(searchText:any=this.searchText){
    const { csbStatus_Done,csbStatus_Pending } = this.filter.value;    
    if (this.filter.value.csbStatus_Done == true && this.filter.value.csbStatus_Pending == true) {
      this.documentVerified = null;
    } else if (this.filter.value.csbStatus_Done == true) {
      this.documentVerified = 'true';
    } else if(this.filter.value.csbStatus_Pending == true){
      this.documentVerified = 'false';
    } else {
      this.documentVerified = null;
    }
    let docverified= this.documentVerified;
    if (docverified != null) {
      let query = `(productType=in=${this.productType} and eligibleForTransactions == ${docverified} `;
        if (this.searchText) {
         let text=this.searchText.replace(/ /gi,"*");
         
         let query:String=`(`;
         (query+=`((name == *${text}*  or phone == *${text}* or centerName == *${text}*) and productType=in=${this.productType} or eligibleForTransactions == ${docverified}`);
         this.searchText.toString()?.toUpperCase()?.includes('RMFARM')&&!isNaN(this.searchText.substring(6))&&(query+=` or id==${this.searchText.substring(6)}`)
         !isNaN(parseInt(this.searchText))&&(query+=` or id==${this.searchText}`)
         query+='))';
         return query;
       }
       query+=')'
       return query;
    } else {
      let query = `(`;
        if (this.searchText) {
         let text=this.searchText.replace(/ /gi,"*");
         
         let query:String=`(`;
         (query+=`((name == *${text}*  or phone == *${text}* or centerName == *${text}*)`);
         this.searchText.toString()?.toUpperCase()?.includes('RMFARM')&&!isNaN(this.searchText.substring(6))&&(query+=` or id==${this.searchText.substring(6)}`)
         !isNaN(parseInt(this.searchText))&&(query+=` or id==${this.searchText}`);
         query+=`) and productType=in=${this.productType} `
         query+=')';
         return query;
       }


       return `productType=in=${this.productType} `;
    }
    
      
   }


  centerParam;
  appFarmers: any;
  // async onSearch() {
  //   this.paginationData.currentPage = 0;
  //   if(isNaN(this.searchText)){
  //     if(this.searchText.includes('RMFARM')&&!isNaN(this.searchText.substring(6))){
  //       this.searchText = this.searchText.substring(6);        
  //       this.idParam = ' or id==' + this.searchText;
  //       this.centerParam = ''
  //     } else {
  //       this.idParam = '';
  //       this.centerParam =  `or center.centerName==*${this.searchText.replace(/ /gi,"*")}*`;
  //     }
  //   } else {
  //     this.centerParam = '';
  //     this.idParam = ' or id==' + this.searchText;
  //   }
  //   const { productType } = this.filter.value;
  //   let searchParams = `(name==*${this.searchText.replace(/ /gi,"*")}* or phone==*${this.searchText.replace(/ /gi,"*")}* ${this.idParam} ${this.centerParam}) and productType=in=${productType}`;
  //   //this.afterSearch(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, searchParams) 
  // }

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
    } else {
      this.getFarmerList()
    }
     this.activeSort = column;
     this.paginationData.currentPage = 0;
  }
  
  async onPageSizeChange() {
    this.getFarmerList()
  }

  createNew() {
    this.router.navigate(['/resha-farms/farmers-silk/crud']);
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
        this.getFarmerList();
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
    this.getFarmerList();
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
      this.getFarmerList();
    })
  }

  editFarmer(farmer) {
    if(this.productType == 'Cotton'){
      this.router.navigate(['/resha-farms/cotton-farmers/crud', farmer.id]);
    }else{
      this.router.navigate(['/resha-farms/farmers-silk/crud', farmer.id]);
    }
  }
  farmerDetail(farmer) {
      this.router.navigate(['/resha-farms/farmers-silk/details', farmer.id]);
  }
  redirectToKycPage(item, farmerId,customerTypeName){
    if(customerTypeName){
      this.router.navigate(['/resha-farms/farmers-kyc/'+farmerId+'/farmer/'+customerTypeName]);
    }else{
      let reqObj = {
        "customerType": '/kyccustomer/1'
      };
      this.api.updateFarmers(reqObj, farmerId).then(res => {
        this.router.navigate(['/resha-farms/farmers-kyc/'+farmerId+'/farmer/individual']);
      })
    }
    

  }
}

