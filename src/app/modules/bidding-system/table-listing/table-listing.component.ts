import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-table-listing',
  templateUrl: './table-listing.component.html',
  styleUrls: ['./table-listing.component.scss']
})
export class TableListingComponent implements OnInit {

  constructor(
    private apiSearch:SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private snackBar:MatSnackBar,
    private modalService:NgbModal,
  ) { }
  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;

  tableHeaders:any=[
    {name:"name", sortName:'name', sort:true},
    {name:"Total Capacity", sortName:'layout.capacity', sort:true},
    {name:"uom", sortName:'uom', sort:true},
    {name:"created Date", sortName:'createdDate', sort:true},
    {name:"ACTION"},
  ];

   CONSTANT = CONSTANT;

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    !initial && this.getTableLayout(paginationData,searchText);
  }

  @ViewChild('deleteHTML')
  deleteHTML:ElementRef;

  id:number;
  infoFromTable(info){
    const { edit,index,deleteRecord} = info;
    if(edit){
      this.routeToEditPage(this.res[index]?.id);
    }
    if(deleteRecord){
      this.id = this.res[index]?.id;
      this.modalRef = this.modalService.open(this.deleteHTML)
    }
  }

  routeToEditPage(id:number){
    this.router.navigate(['bid/table-crud',id])
  }

   getTableLayout(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.specAPIForBid(paginationData,'tablelayout').then(res=>{
      this.rowDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={};
        obj['name'] = record?.name?record?.name:' - ';
        obj['Total Capacity'] = record?.layout.reduce((total, record)=>record.capacity.reduce((sum,value)=>sum+value,0) + total,0);
        obj['uom'] = record?.uom ? record?.uom  : ' - ',
        obj['created Date'] = record?.createdDate ? this.utils.getDisplayTime(record?.createdDate) : ' - ',
        obj['ACTION'] = 'ACTION',
        this.CONSTANT.EDIT_DELETE ='ACTION'
        this.rowDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  deleteTableLayout(){
    this.apiSearch.deleteRecord('tablelayout',this.id).then(res=>{
      this.modalRef.close();
      this.getTableLayout();
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
    this.getTableLayout();
  }

}
