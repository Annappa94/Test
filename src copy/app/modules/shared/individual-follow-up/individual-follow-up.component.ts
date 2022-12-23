import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { FollowupsCrudComponent } from '../followup-crud/followups-crud.component';

@Component({
  selector: 'app-individual-follow-up',
  templateUrl: './individual-follow-up.component.html',
  styleUrls: ['./individual-follow-up.component.scss']
})
export class IndividualFollowUpComponent implements OnInit {
  constructor(
    private apiSearch:SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private api:ApiService,
    private router:Router,
    public dialog: MatDialog,
  ) { }
  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;

  @Input()
  customerId:number;
  @Input() customerRole;
  @Input() customerName;
  @Input() customerPhone;

  tableHeaders:any=[
    {name:"ASSIGNEE NAME", sortName:'assignedToName'},
    {name:"ASSIGNEE PHONE", sortName:'assignedToPhone', sort:true},
    {name:"ASSIGNED BY", sortName:'assignedBy', sort:true},
    {name:"STATUS", sortName:'status', sort:true},
    {name:'FOLLOW UP TYPE', sortName: 'type',sort:true},
    {name:'NOTE', sortName: 'note',sort:true},
    {name:'LAST MODIFIED DATE', sortName: 'lastModifiedDate',sort:true},
    {name:'FOLLOW UP DATE', sortName: 'followUpDate',sort:true},
    {name:'EDIT'},
  ];

  defaultPage = {
    currentPage : 0,
    pageSize    : 10,
    total       : 0,
    pages       : [],
    currentColumn : 'lastModifiedDate',
    currentDirection: 'desc',
  }

   CONSTANT = CONSTANT;

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    !initial && this.getCocoonPurchaseKhata(paginationData,searchText);
  }


  infoFromTable(info){
    const { edit,index} = info;
    edit&&this.createOrEditFollowUp(this.res[index]);
  }

   buildSerachQuery(searchText){
     if(searchText){
      let text=searchText.replace(/ /gi,"*");
      return `( (customerId == ${this.customerId} and customerType == ${this.customerRole}) and ( note==*${text}* or assignedBy==*${text}* or assignedToPhone==*${text}* or assignedToName==*${text}*) )`;
     }
     return `(customerId == ${this.customerId} and customerType == ${this.customerRole})`;
   }

  getCocoonPurchaseKhata(paginationData = this.defaultPage,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getOrders(paginationData,'followup',this.buildSerachQuery(searchText)).then(res=>{
      this.rowDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={};
        obj['ASSIGNEE NAME'] = record?.assignedToName ? record?.assignedToName : ' - ',
        obj['ASSIGNEE PHONE'] = record?.assignedToPhone ? record?.assignedToPhone : ' - ',
        obj['ASSIGNED BY'] = record?.assignedBy ? record?.assignedBy : ' - ',
        obj['STATUS'] = record?.status ? record?.status : ' - ',
        obj['FOLLOW UP TYPE'] = record?.type ? record?.type  : ' - ',
        obj['NOTE'] = record?.note ? record?.note : ' - ',
        obj['LAST MODIFIED DATE'] = record?.lastModifiedDate ? this.utils.getDisplayTime(record?.lastModifiedDate) : ' - ',
        obj['FOLLOW UP DATE'] = record?.followUpDate ? this.utils.getDisplayTime(record?.followUpDate) : ' - ',
        this.CONSTANT.STATUS = 'STATUS',
        obj[this.CONSTANT.ACTION]='',
        this.rowDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  ngOnInit(): void {
    this.customerId && this.getCocoonPurchaseKhata();
  }


  createOrEditFollowUp(item = false) {
    let dialogRef
    this._cd.detectChanges();
    if(item) {
      item['customerType']=this.customerRole;
      dialogRef = this.dialog.open(FollowupsCrudComponent, {
        width: '80vw',
        maxHeight: '68vh',
        data: { item: item}
      });
    } else {
      const obj = {
        customerId: this.customerId,
        customerName: this.customerName,
        customerType: this.customerRole,
        customerPhone: this.customerPhone
      }
      dialogRef = this.dialog.open(FollowupsCrudComponent, {
        width: '80vw',
        maxHeight: '68vh',
        data: { item: obj}
      });
    }
    
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this._cd.detectChanges();
        this.getCocoonPurchaseKhata();
      }
    });
  }

}
