import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-chawki-batch-listing',
  templateUrl: './chawki-batch-listing.component.html',
  styleUrls: ['./chawki-batch-listing.component.scss']
})
export class ChawkiBatchListingComponent implements OnInit,OnChanges{
  errormsg: any;

  constructor(
    private apiSearch:SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private api:ApiService,
    private snackBar:MatSnackBar,
    private modalService:NgbModal,
  ) { }

  @Input()
  newRecordRefresh;

  ngOnChanges(changes: SimpleChanges): void {
    this.getChawkiByBatchId();
  }
  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  @Input()
  chawkiId:number = 0;
  
  @ViewChild('deleteBatchHTML')
  deleteBatchHTML:ElementRef;
  tableHeaders:any=[
    {name:"ID", sortName:'id'},
    {name:"AVAILABLE ON", sortName:'availableOn', sort:true},
    {name:"TOTAL AVAILABLE DFL", sortName:'totalAvailableDFL', sort:true},
    {name:"CURRENTLY AVAILABLE DFL", sortName:'currentlyAvailableDFL', sort:true},
    {name:'TYPE', sortName: 'batchType',sort:true},
    {name:'DELETE'},
  ];

   CONSTANT = CONSTANT;

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    !initial && this.getChawkiByBatchId(paginationData,searchText);
  }

  deleteBatchId:number;

  infoFromTable(info){
    const { deleteRecord, details,index,detailsAttr }= info;
    if(deleteRecord){
      this.deleteBatchId = this.res[index]?.id;
      this.modalRef = this.modalService.open(this.deleteBatchHTML)
      this.errormsg = " ";
    }

  }

   buildSerachQuery(searchText){
     if(searchText&&!isNaN(searchText))
      return `(chawki.id == ${this.chawkiId} and id == ${searchText})`;
     
      return `(chawki.id == ${this.chawkiId})`;
   }

   getChawkiByBatchId(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getAllChwakiOrders(paginationData,'chawkibatch',this.buildSerachQuery(searchText)).then(res=>{
      this.rowDataList = [];
      this.res = res['content'];

      res['content'].filter(record=>{
        const obj={};						
        obj['ID'] = record?.id ? record?.id : ' - ',
        obj['AVAILABLE ON'] = record?.availableOn ? this.utils.getDisplayTime(record?.availableOn) : ' - ',
        obj['TOTAL AVAILABLE DFL'] = record?.totalAvailableDFL ? record?.totalAvailableDFL?.toLocaleString('en-IN')  : 0,
        obj['CURRENTLY AVAILABLE DFL'] = record?.currentlyAvailableDFL ? record?.currentlyAvailableDFL?.toLocaleString('en-IN') : 0,
        obj['TYPE'] = record?.batchType ? record?.batchType  : ' - ',
        obj['DELETE'] = record?.currentlyAvailableDFL == record?.totalAvailableDFL,
        this.rowDataList.push(obj);
      });
      this.CONSTANT.DELETE = 'DELETE';
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }



  deleteBatch() {
    this.ngxLoader.stop();
    this.api.deleteBatchForChawki(this.deleteBatchId).then(res=> {
      this.getChawkiByBatchId();
      this.modalRef.close();
      this.snackBar.open('Batch Deleted Successfully', 'Ok', {
        duration: 3000
      });
    }, err=> {
      console.log(err);
      if (err.status == 409) {
        this.errormsg = "An order is already created for this batch ,so you can not delete this batch."
      } else{
        this.modalRef.close();
        this.snackBar.open('Could not delete batch, please try again', 'Ok', {
          duration: 3000
        });
      }

    })
  }

  ngOnInit(): void {
    this.chawkiId && this.getChawkiByBatchId();
  }



}
