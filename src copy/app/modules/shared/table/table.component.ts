import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
// import * as EventEmitter from 'events';
const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
const compareDate = (v1, v2) => new Date(v1) < new Date(v2) ? -1 : new Date(v1) > new Date(v2) ? 1 : 0;

@Component({
  selector: 'RMtable',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit,OnChanges {
  filteredFarmersList:any=[]
  userType:any;
  enableSearch:any;
  @Input()
  tableFlags='Iot';
  @Input()
  searchText:any='';
  searchedData:any=[];
  @Input()
  rowDataList:any=[];
  @Input()
  tableHeaders:any[]=[{name:"first"},{name:"second"}];
  tableHeader = {
  };
  filteredList:any=[]
  originalOrder:any = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }
  expandImage = false;
  modelImage = '';
  activeSort:any='';
  paginationData = {
    currentPage : 0,
    pageSize    : 50,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  };

  @Output()
  listen:any=new EventEmitter();
  @Output()
  crud:any=new EventEmitter();

  constructor(private _cd: ChangeDetectorRef) { }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.rowDataList,"rowDataList")
    if(this.searchText&&this.searchText.trim()!=='')
      this.onSearch()
    else 
      this.refreshTable(this.rowDataList);
   if(this.tableHeaders){
      this.tableHeader={};
      for(let i=0;i<this.tableHeaders.length;i++){
        this.tableHeader[this.tableHeaders[i].name]=0;
      }
    }
  }

  ngOnInit(): void {
    this.userType = JSON.parse(localStorage.getItem('_ud'));
  }

  formatPrice(price){
    //console.log(price);
    const formatPrice = price.replace(/[, ]+/g, "").trim();    
    return +formatPrice;
    
  }

  onSort(column) {
    const compareDate = (v1, v2) => new Date(v1) < new Date(v2) ? -1 : new Date(v1) > new Date(v2) ? 1 : 0;
    this.activeSort = column;
    this.paginationData.currentPage = 0;
    if (this.tableHeader[column] === 0) {
      this.tableHeader[column] = 1;
    } else {
      this.tableHeader[column] = 0;
    }
    if (this.searchText&&this.searchText.trim() !== '') {
      this.searchedData = [...this.searchedData].sort((a, b) => {
        let flag;
        for(let i=0;i<this.tableHeaders.length;i++){
          if(this.tableHeaders[i].name==column){
           flag=this.tableHeaders[i].type?this.tableHeaders[i].type:'';
           break;
          }
        }

        let res=null;
        if(flag=='Price')
          res = compare(this.formatPrice(a[column]), this.formatPrice(b[column]));
        else if(flag=='Date')
          res = compareDate(a[column].split('/')[1]+'/'+a[column].split('/')[0]+'/'+a[column].split('/')[2], b[column].split('/')[1]+'/'+b[column].split('/')[0]+'/'+b[column].split('/')[2]);
        else if(flag=='Object')
           res = compare(a[column]['name'], b[column]['name']);
        else
          res = compare(a[column], b[column]);

        return this.tableHeader[column] === 1 ? res : -res;
      });
      this.refreshTable(this.searchedData);
    } else {
      let flag;
      this.rowDataList = [...this.rowDataList].sort((a, b) => {
        for(let i=0;i<this.tableHeaders.length;i++){
          if(this.tableHeaders[i].name==column){
           flag=this.tableHeaders[i].type?this.tableHeaders[i].type:'';
           break;
          }
        }
        let res;
        if(flag=='Price')
          res = compare(this.formatPrice(a[column]), this.formatPrice(b[column]));
        else if(flag=='Date')
          res = compareDate(a[column].split('/')[1]+'/'+a[column].split('/')[0]+'/'+a[column].split('/')[2], b[column].split('/')[1]+'/'+b[column].split('/')[0]+'/'+b[column].split('/')[2]);
        else if(flag=='Object')
          res = compare(a[column]['name'], b[column]['name']);
         else
          res = compare(a[column], b[column]);
        return this.tableHeader[column] === 1 ? res : -res;
      });
      this.refreshTable(this.rowDataList);
    }
  }

  async onSearch() {
    this.searchedData = this.rowDataList.filter(center => {
      let temp=Object.assign({},center);
      (temp['Customer']&&temp['Customer']['name'])&&(temp['Customer']=temp['Customer']['name']);
      return this.isPresent(Object.values(temp),this.searchText.toLowerCase())
    });
    this.paginationData.currentPage = 0;
    this.refreshTable(this.searchedData);
  }

  isPresent(array:string[],searchText:string){
    for(let i=0;i<array.length;i++){
     if(String(array[i]).toLowerCase().includes(searchText)){
      return true;
     }
    }
    return false;
  }

  async onPageChange(page) {
    this.paginationData.currentPage = page;
    if (this.searchText&&this.searchText !== '') {
      this.refreshTable(this.searchedData);
    } else {
      this.refreshTable(this.rowDataList);
    }
  }

  async refreshTable(dataList) {
    this.filteredList = [];
    this.paginationData.total = dataList.length;
    const pagesLength = dataList.length / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);

    let skip = this.paginationData.currentPage * this.paginationData.pageSize;
    for (let i = 0; i < this.paginationData.pageSize; i++) {
      const center = dataList[skip];
      if (center) {
        this.filteredList.push(center);
        skip++;
      } else {
        break;
      }
    }
    this._cd.detectChanges();
  }

  async onPageSizeChange() {
    this.paginationData.currentPage = 0;
    if (this.searchText&&this.searchText !== '') {
      this.refreshTable(this.searchedData);
    } else {
      this.refreshTable(this.rowDataList);
    }
  }

  edit(item,index){
    this.crud.emit({edit:true,item,index})
  }
  delete(item){
    this.crud.emit({delete:true,item})
  }
  routePage(index){
    this.listen.emit(index)
  }

  showImage(url) {
    this.modelImage = url;
    this.expandImage = true;
  }
  routeRetailerPage(item,index){
    this.listen.emit({item,phone:true,index});
  }
}
