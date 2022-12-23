import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-approved-settlements',
  templateUrl: './approved-settlements.component.html',
  styleUrls: ['./approved-settlements.component.scss']
})
export class ApprovedSettlementsComponent implements OnInit {

  constructor(
    private searchApi: SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    ) { }
    @Input()
    customerId:number;
    @Input()
    customerType:any;

    rowDataList:any[]=[];
    res:any[]=[];
    totalRecords:number = 0;
    modalRef;
    tableHeaders:any=[
      {name:"DEPOSIT ID", sortName:'id'},
      {name:"AMOUNT", sortName:'amount', sort:true},
      {name:"BALANCE", sortName:'balance', sort:true},
      {name:"STATUS", sortName:'settlementStatus', sort:true},
      {name:"REFERENCE", sortName:'referenceNumber', sort:true},
      {name:"NOTES", sortName:'rejectedReason', sort:true},
      {name:'UPDATED DATE', sortName: 'lastModifiedDate',sort:true},
      {name:'UPDATED BY', sortName: 'lastModifiedBy',sort:true},
    ];
    CONSTANT = CONSTANT;
    settlementStatusList:string[] = ['APPROVED','REJECTED'];
    filterForm:UntypedFormGroup = new UntypedFormGroup({
      settlementStatus:new UntypedFormControl('APPROVED'),
    });
  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    !initial && this.getRetailerDeposits(paginationData,searchText);
  }
  listenForFilterChange(){
    this.filterForm.valueChanges.subscribe(res=>{
      this.getRetailerDeposits();
    })
  }
  retailerAwaitingDeposits;
  ngOnInit(): void {
    this.getRetailerDeposits();
    this.listenForFilterChange();
  }
  getRetailerDeposits(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.searchApi.getCustomerDeposits(paginationData,this.buildSerachQuery(searchText)).then(res=>{
      this.rowDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={};
        obj['DEPOSIT ID'] = record?.id ? record?.id : ' - ',
        obj['AMOUNT'] = record?.amount ? record?.amount : ' - ',
        obj['BALANCE'] = record?.balance ? record?.balance : ' - ',
        obj['STATUS'] = record?.settlementStatus ? record?.settlementStatus : ' - ',
        obj['REFERENCE'] = record?.referenceNumber ? record?.referenceNumber : ' - ',
        obj['NOTES'] = record?.rejectedReason ? record?.rejectedReason : ' - ',
        obj['UPDATED DATE'] = record?.lastModifiedDate ? this.utils.getDisplayTime(record?.lastModifiedDate)  : ' - ',
        obj['UPDATED BY'] = record?.lastModifiedBy ? record?.lastModifiedBy : ' - ',
        
        this.CONSTANT.DETAILS2 ='DEPOSIT ID',
        this.rowDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }
  routeToDetailspage(index){
    this.router.navigate([`retailers/deposit-instance/`,this.customerType,this.res[index]?.id]);
   }
  infoFromTable(info){
    const { edit,data,details,index} = info;
    details&&(this.routeToDetailspage(index));
  }

  buildSerachQuery(searchText){
    const { settlementStatus} = this.filterForm.value;
    const text = searchText.replace(/ /gi,"*");
    let query = '';
    settlementStatus&&( query= `settlementStatus=in=${settlementStatus} and`)
    if(searchText){
      if(!isNaN(searchText)){

        return `( (${query} customerType=in=(${this.customerType?.toUpperCase()}) and customerId==${this.customerId}) and (customerId==${searchText} or customerName==*${text}* or phone==*${text}*) )`
      }
      else{
        return `((${query} customerType=in=(${this.customerType?.toUpperCase()}) and customerId==${this.customerId}) and (customerName==*${text}* or phone==*${text}*) )`
      }
    }
  return `(${query} customerType=in=(${this.customerType?.toUpperCase()}) and customerId==${this.customerId})`;
 }
}
