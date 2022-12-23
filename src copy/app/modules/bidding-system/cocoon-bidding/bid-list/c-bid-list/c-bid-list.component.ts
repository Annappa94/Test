import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { Router } from '@angular/router';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { WAREHOUSE_BID_STATUS } from 'src/app/constants/enum/constant.warehouse';

@Component({
  selector: 'app-c-bid-list',
  templateUrl: './c-bid-list.component.html',
  styleUrls: ['./c-bid-list.component.scss']
})
export class CBidListComponent implements OnInit {

  constructor(
    private apiSearch: SearchService,
    private utils: UtilsService,
    private _cd: ChangeDetectorRef,
    private ngxLoader: NgxUiLoaderService,
    private router: Router,
    private snackBar:MatSnackBar,
    private modalService:NgbModal,
    private api: ApiService,
  ) { }
  tablesList:any=[];
  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  tableHeaders: any = [
    { name: "Details"},
    { name: "startTime", sortName: 'startTime' ,sort:true},
    { name: "endTime", sortName: 'endTime' ,sort:true},
    { name: "ware house", sortName: 'warehouse' ,sort:true},
    { name: "status", sortName: 'status' ,sort:true},
    { name: 'start' },
    { name: 'ACTION' },
  ];
  CONSTANT = CONSTANT;
  onPageChange(data) {
    const { paginationData, searchText, initial } = data;
    !initial && this.getBidList(paginationData, searchText);
  }
  infoFromTable(info) {
    const { edit,deleteRecord,switchIconToggle,popup,data, index ,details} = info;
    details&&this.routeToLiveBidding(index)
    edit && (this.routeToEditPage(index));
    popup&&this.updateStatus(data,this.res[index]);
    if(deleteRecord){
      this.deleteId = this.res[index]?.id;
      this.modalRef = this.modalService.open(this.deleteHTML)
    }
    if(switchIconToggle){
     this.initilizeBid(this.res[index]?.id)
    }

  }

  routeToLiveBidding(index:number){
    this.router.navigate(['/resha-farms/bid/live-bidding',this.res[index].id,this.res[index].status]);
  }

  updateStatus(status,data){
      this.updateStatusAPI(data?.id,{status:status});
  }

  routeToEditPage(index) {
    this.router.navigate([`/resha-farms/bid/bidding-crud`, this.res[index]?.id]);
  }

  buildSerachQuery(searchText) {
    const text = searchText.replace(/ /gi, "*");
    if (searchText) {

      return `( name==*${text}* )`

    }
    return false;
  }
  getBidList(paginationData = false, searchText = '') {
    this.ngxLoader.stop();
    this.apiSearch.specAPIForBid(paginationData, 'biddings', this.buildSerachQuery(searchText)).then(res => {
      this.rowDataList = [];
      this.res = res['content'];
      res['content'].filter(record => {
          const obj = {};
          obj['Details'] = 'Details',
          obj['startTime'] = record?.startTime ? this.utils.getDisplayTime(record.startTime) : ' - ',
          obj['endTime'] = record?.endTime ? this.utils.getDisplayTime(record.endTime) : ' - ',
          obj['ware house'] = record?.warehouse ? this.getWareHouseById(record?.warehouse)?.name : ' - ',
          obj['status'] = record?.status ? record?.status : ' - ',
          obj['start'] = { 
            value:record?.enabled,
            isEnabled:record?.status == 'COMPLETED' || record?.status == 'CANCELLED' ,
            readonly:record?.status == 'COMPLETED' || record?.status == 'CANCELLED'
          };
          obj['ACTION'] = 'ACTION',
          obj["status"] = {
            'status': record.status,
            'STATUS_ORDERS':this.statusChangeConFig(record.status)
          },
          this.CONSTANT.SELECTE_POPUP="status";
          this.CONSTANT.ACTION = 'ACTION',
          this.CONSTANT.RADIO_BUTTON = 'start',
          this.CONSTANT.PHONE = 'Details',
          this.rowDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  statusChangeConFig(status){
    switch (status) {
      case 'NEW':
        return WAREHOUSE_BID_STATUS.CURR_NEW;
      case 'INPROGRESS':
        return WAREHOUSE_BID_STATUS.CURR_INPROGRESS;
      case 'COMPLETED':
        return WAREHOUSE_BID_STATUS.CURR_COMPLETED;
      case 'CANCELLED':
        return WAREHOUSE_BID_STATUS.CURR_CANCELLED;
    }
  }

  getWareHouseById(id:number){
     return this.wareHouseList.find(warehouse=>warehouse.id == id);
  }

  wareHouseList = [];
  getAllWarehouseList(){
    this.api.getAllWarehouse().then(res => {
       this.wareHouseList = res['_embedded']['warehouse'];
      this.getBidList();
      this._cd.detectChanges();
    });
  }

  updateStatusAPI(id:number,payload){
   this.apiSearch.updateRecord('bidding',id,payload).then(res=>{
    this.getBidList();
    this.snackBar.open('Updated Successfully', 'Ok', {
      duration: 3000
    });
   }).catch(err=>{
    this.snackBar.open('Something went wrong', 'Ok', {
      duration: 3000
    })
   });
  }

  deleteId:number;
  @ViewChild("deleteHTML")
  deleteHTML:ElementRef;

  deleteBid(){
    this.apiSearch.deleteRecord('bidding',this.deleteId).then(res=>{
      this.modalRef.close();
      this.getBidList();
      this.snackBar.open('Deleted Successfully', 'Ok', {
        duration: 3000
      });
    }).catch(err=>{
      this.snackBar.open('Something went wrong', 'Ok', {
        duration: 3000
      });
    })
  }

  ngOnInit(): void {
    this.getAllWarehouseList();
  }

  initilizeBid(id :number){
    this.ngxLoader.stop();
    this.apiSearch.initializeBid(id).then(res=>{
      this.getBidList();
      this.snackBar.open('Started Successfully', 'Ok', {
        duration: 3000
      });
    }).catch(err=>{
      this.getBidList();
      this.snackBar.open(err?.error?.message, 'Ok', {
        duration: 5000
      });
    })
  }

}
