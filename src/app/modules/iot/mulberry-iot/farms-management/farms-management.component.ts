import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-farms-management',
  templateUrl: './farms-management.component.html',
  styleUrls: ['./farms-management.component.scss']
})
export class FarmsManagementComponent implements OnInit {

  @ViewChild('content') div;


  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    private apiSearch:SearchService,
    private utils:UtilsService,
    private modalService: NgbModal,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
  ) { }

  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  closeResult: string;
  selectedLGPartner:any;
  paginationData:boolean = false;
  searchText:string = '';

  tableHeaders:any=[
    {name:"Farm Id", sortName:''},
    {name:"Farm Owner Name", sortName:'farmId', sort:true},
    {name:"Farm Owner Contact", sortName:'farmContact', sort:true},
    {name:"Farm Location", sortName:'farmLocation', sort:true},
    {name:"Farm District", sortName:'farmDistrict', sort:true},
    {name:"Farm State", sortName:'farmState', sort:true},
    {name:'ACTION'},
  ];

  // CONSTANT = CONSTANT;
  //  closeCreateEditModel() {
  //   this._cd.detectChanges();
  //   this.modalRef.close();
  // }

  // onPageChange(data){
  //   const {paginationData,searchText,initial} = data;
  //   this.paginationData = paginationData;
  //   this.searchText = searchText;

  //   !initial && this.getFarmsList(paginationData,searchText);

  // }

  // tableInfo(info){
  //   const { edit,data,details,index, switchIconToggle} = info;

  // }

  ngOnInit(): void {
  }

  // getFarmsList(paginationData=false,searchText=''){
  //   this.ngxLoader.stop();
  //   this.api.getALLFarmslist().then(res=>{
  //     this.farmsDataList = [];
  //     this.res = res['_embedded']['farms'];
  //     this.res.filter(record=>{
  //       console.log(record);
        
  //       const obj={};
  //       obj['Farm Id'] = record?. ? record?. : ' - ',
  //       obj['Farm Owner Name'] = record?. ? record?. : ' - ',
  //       obj['Farm Owner Contact'] = record?. ? record?. : ' - ',
  //       obj['Farm Location'] = record?. ? record?. : ' - ',
  //       obj['Farm District'] = record?. ? record?. : ' - ',
  //       obj['Farm State'] = 'ACTION',
  //       this.CONSTANT.ID ='RM CODE',
  //       this.CONSTANT.ACTION ='ACTION',
  //       this.farmsDataList.push(obj);
  //       console.log(this.farmsDataList);
        
  //     });

  //     this._cd.detectChanges();
  //   })
  // }

}
