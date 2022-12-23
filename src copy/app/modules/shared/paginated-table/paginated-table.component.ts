import { KeyValue } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { RolesService } from 'src/app/services/roles/roles.service';

@Component({
  selector: 'app-paginated-table',
  templateUrl: './paginated-table.component.html',
  styleUrls: ['./paginated-table.component.scss']
})
export class PaginatedTableComponent implements OnInit,OnChanges,OnDestroy {
userType;
  constructor(
    private api:ApiService,
    private snackBar: MatSnackBar,
    private _cd: ChangeDetectorRef,
    public rolesService:RolesService
  ) { 

    this.userType = JSON.parse(localStorage.getItem('_ud'));
  }
searchText:any;
CONSTANT = CONSTANT;
@Input()
rowDataList:any=[];/**@Row_List */
@Input()
tableHeaders:any[]=[]; /** @Headers____Names */
@Input()
totalRecords;/** @Total No Of records */
@Input()
titleOfTable:String ='Title'/** @Table_Title */

@Input()
backButton:boolean = false;

@Input()
hidePagination:boolean = true;

@Input()
searchClass='col-lg-5';

@Input()
searchHint = "By Name and Phone.";

@Input()
isSearch:boolean = true;

@Input()
colorStatus=[
  'Active',
  'Completed',
  'Waiting',
  'paid'
]

@Input()
defaultImage:String ='./assets/media/users/blank.png';

tableHeader = {};/** @To show arrow mark during Sorting */

filteredList:any=[];/**@Display the records */

/**@Emitters for child components  */
@Output()
onPageChange:EventEmitter<any> = new EventEmitter();

@Output()
infoFromTable:EventEmitter<any> = new EventEmitter();

@Output()
listenAndRefreshPayment:EventEmitter<any> = new EventEmitter();

@Output()
listenAndRefreshRetailerDeposits:EventEmitter<any> = new EventEmitter();

@Input()
currentColumn ="createdDate";

@Input()
securedImage:boolean =false;

originalOrder:any = (a: KeyValue<number,string>, b: KeyValue<number,string>): number =>  0;

activeSort:any='';
paginationData = {
  currentPage : 0,
  pageSize    : 10,
  total       : 0,
  pages       : [],
  currentColumn : this.currentColumn ,
  currentDirection: 'desc',
};
modelImage;
expandImage=false;

ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.rowDataList);
    this.paginationData.currentColumn = this.currentColumn
    this.paginationData.total = this.totalRecords;
    this.refreshTable(this.rowDataList)
}

ngOnInit(): void {
   this.onPageChange.emit({paginationData:this.paginationData,searchText:this.searchText,initial:true})
}

search(){
  this.paginationData.currentPage = 0;
  this.onPageChange.emit({paginationData:this.paginationData,searchText:this.searchText});
}

edit(data,index){
  this.infoFromTable.emit({data,edit:true,index})
}

delete(index){
  this.infoFromTable.emit({deleteRecord:true,index})
}
generateQRCode(index){
  this.infoFromTable.emit({index,qrCode:true})
}
switchIconToggle(index){
  this.infoFromTable.emit({switchIconToggle:true,index})
}

details(data,index,detailsAttr=''){
  this.infoFromTable.emit({data,details:true,index,detailsAttr:detailsAttr})
}

async onPageChangeSelect(page) {
  this.paginationData.currentPage = page;
  this.onPageChange.emit({paginationData:this.paginationData,searchText:this.searchText});
}

/**@Paination_Logic */
async refreshTable(list) {
  this.filteredList = [];
  const pagesLength = this.paginationData.total / this.paginationData.pageSize;
  this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
  this.filteredList = list;
  this._cd.detectChanges();
}

/**@ChangePage @Emit */
async onPageSizeChange() {
  this.paginationData.currentPage = 0;
  this.onPageChange.emit({paginationData:this.paginationData,searchText:this.searchText});
}

/** Server Side Sorting */
async onSort(column) {
  this.activeSort = column;
  if (this.tableHeader[column] === 0) {
    this.paginationData.currentDirection = 'desc';
    this.tableHeader[column] = 1;
  } else {
    this.paginationData.currentDirection = 'asc';
    this.tableHeader[column] = 0;
  }
  this.paginationData.currentColumn = column;
  this.paginationData.currentPage = 0;
  this.onPageChange.emit({paginationData:this.paginationData,searchText:this.searchText});
  console.log(this.activeSort)
}

showImage(imgUrl){
  if(this.securedImage){
    this.getprotectedUrl(imgUrl);
  }else{
    this.expandImage = true;
    this.modelImage = imgUrl;
    this._cd.detectChanges();
  }
}

async getprotectedUrl(imgUrl){
  const { targetUrl } : any = await this.api.getPresignedUrlForViewImage(imgUrl);
  this.modelImage = targetUrl;
  this.expandImage = true;
  this._cd.detectChanges();
}

onStatusSelection(event,index){
  this.infoFromTable.emit({data:event?.target?.value,index,popup:true});
}

makerORChakersApproveReject(approved,rejected,index){
  this.infoFromTable.emit({approved,rejected,index,makersOrChakers:true});
}

reversalFromMudra(index:number){
  this.infoFromTable.emit({reversal:true,index});
}

payNow(index){
  this.infoFromTable.emit({payNow:true,index});
}

showPaymentDetailes(index){
  this.infoFromTable.emit({paymentDetailes:true,index});
}

blackList(index:number){
  this.infoFromTable.emit({isBlackList:true,index});
}

listenAndRefresh(){
  this.onPageChange.emit({paginationData:this.paginationData,searchText:this.searchText});
}

listenAndRefreshPaymentFunction(){
  this.listenAndRefreshPayment.emit();
}

onSelectCheckBoxRows(index){
  this.infoFromTable.emit({rowCheckBox:true,index});
}

ngOnDestroy(): void {
  this.CONSTANT.ACTION =''
  this.CONSTANT.PHONE =''
  this.CONSTANT.ID =''
  this.CONSTANT.IMAGEURL =''
  this.CONSTANT.SELECTE_POPUP =''
  this.CONSTANT.APPROVE_OR_REJECT =''
  this.CONSTANT.PAYMENT =''
  this.CONSTANT.BLACKLIST =''
  this.CONSTANT.DELETE =''
  this.CONSTANT.RADIO_BUTTON =''
  this.CONSTANT.QR =''
  this.CONSTANT.INVOICE =''
  this.CONSTANT.HTML_CONTENT =''
  this.CONSTANT.COCOON_PURCHASE_PAYMENT =''
  this.CONSTANT.RETAILER_DEPOSIT =''
  this.CONSTANT.RETAILER_DEPOSIT_APPROVE =''
  this.CONSTANT.ASSIGN_CREDIT_AMOUNT =''
  this.CONSTANT.DETAILS1 ='',
  this.CONSTANT.COTTON_PAYMENT = ''
  this.CONSTANT.BANK_ACCOUNT = ''
  this.CONSTANT.MANDATE_BANK_ACCOUNT_LIST = ''
  this.CONSTANT.STATUS_SELECT_BOX = ''
  this.CONSTANT.EDIT_HIDE_ACTION =''
}
}