import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SearchService } from 'src/app/services/api/search.service';
import { Router } from '@angular/router';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ApiService } from 'src/app/services/api/api.service';
import { DomSanitizer } from '@angular/platform-browser';

import { saveAs } from 'file-saver';
@Component({
  selector: 'app-warehouse-layout',
  templateUrl: './warehouse-layout.component.html',
  styleUrls: ['./warehouse-layout.component.scss']
})
export class WarehouseLayoutComponent implements OnInit {
  constructor(
    private apiSearch:SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private snackBar:MatSnackBar,
    private modalService:NgbModal,
    private api: ApiService,

    private sanitizer: DomSanitizer

  ) { 
    
  }
  tablesList:any=[];
  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  tableHeaders:any=[
    {name:"NAME", sortName:'name'},
    {name:"WAREHOUSE", sortName:'warehouse'},
    {name:"LANES", sortName:'lanes'},
    {name:"CREATED DATE", sortName:'createdDate'},
    {name:'ENABLED'},
    {name:'ACTION'},
  ];
  CONSTANT = CONSTANT;

  @ViewChild('deleteHTML')
  deleteHTML:ElementRef;

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    !initial && this.getWHList(paginationData,searchText);
  }
  infoFromTable(info){
    const { edit,deleteRecord,index,switchIconToggle, qrCode} = info;
    if(deleteRecord){
      this.deleteId = this.res[index]?.id;
      this.modalRef = this.modalService.open(this.deleteHTML)
    }
    edit&&(this.routeToEditPage(index));
    if(switchIconToggle){
      this.updateWarehouseLayout(this.res[index]);
     }
     if(qrCode){
      this.generateQRCode(this.res[index]);
     }
  }
  blo;
  imageurl:any;
 generateQRCode(data){
  this.api.getAllWarehouseQRCode(data.warehouse).subscribe(res=>{
    this.blo = res;
    let blob = new Blob([this.blo], { type: 'image/jpeg' });
    saveAs(blob, 'qrCode' + '.jpeg')
     })   
 }
 
 updateWarehouseLayout(record){
  this.apiSearch.updateRecord('warehouselayout',record?.id,{enabled:!record.enabled}).then(res=>{
    this.getWHList();
    this.snackBar.open('Updated Sucessfully', 'Ok', {
      duration: 3000
    });
  })
 }

  routeToEditPage(index){
    this.router.navigate([`bid/warehouse-layout-crud/`,this.res[index]?.id]);
  }
  getAllTableList(){
    this.apiSearch.specAPIForBid(false,'tablelayout', '').then(res=>{
      this.tablesList = res['content']
    })
  }
  buildSerachQuery(searchText){
    const text = searchText.replace(/ /gi,"*");
    if(searchText){
      
        return `( name==*${text}* )`
      
    }
  return false;
 }
  getWHList(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.specAPIForBid(paginationData,'warehouselayout', this.buildSerachQuery(searchText)).then(res=>{
      this.rowDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={};
        obj['NAME'] = record?.name?record.name:'',
        obj['WAREHOUSE'] = record?.warehouse?this.getWareHouseById(record.warehouse)?.name:'',
        obj['LANES'] = record?.lanes ? record?.lanes : ' - ',
        obj['CREATED DATE'] = record?.createdDate ? this.utils.getDisplayTime(record?.createdDate) : ' - ',
        obj['ENABLED'] = { 
          value:record?.enabled
        };
        obj['ACTION'] = 'ACTION',
        this.CONSTANT.QR ='ACTION',
        this.CONSTANT.RADIO_BUTTON = 'ENABLED',
        this.rowDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  ngOnInit(): void {
    this.getAllWarehouseList();
  }

  deleteId:number;
  deleteWareHouseLayout(){
    this.apiSearch.deleteRecord('warehouselayout',this.deleteId).then(res=>{
      this.modalRef.close();
      this.getWHList();
      this.snackBar.open('Deleted Successfully', 'Ok', {
        duration: 3000
      });
    }).catch(err=>{
      this.snackBar.open('Something went wrong', 'Ok', {
        duration: 3000
      });
    })
  }

  getWareHouseById(id:number){
    return this.wareHouseList.find(warehouse=>warehouse.id == id);
 }

 wareHouseList = [];
 getAllWarehouseList(){
   this.api.getAllWarehouse().then(res => {
      this.wareHouseList = res['_embedded']['warehouse'];
      this.getWHList();
      this._cd.detectChanges();
   });
 }

}
