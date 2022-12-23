import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
@Component({
  selector: 'app-buyers-list',
  templateUrl: './buyers-list.component.html',
  styleUrls: ['./buyers-list.component.scss']
})
export class BuyersListComponent implements OnInit {

  constructor(
    private apiSearch:SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    ) { }
    rowDataList:any[]=[];
    res:any[]=[];
    totalRecords:number = 0;
    modalRef;
  
    tableHeaders:any=[
      {name:"RM CODE", sortName:'id'},
      {name:"NAME", sortName:'name', sort:true},
      {name:"PHONE", sortName:'phone', sort:true},
      {name:"CITY", sortName:'address.city', sort:true},
      {name:'CREATED DATE', sortName: 'createdDate',sort:true},
      {name:'CREATED BY', sortName: 'createdBy',sort:true},
      {name:'ACTION'},
    ];
  
    CONSTANT = CONSTANT;
    onPageChange(data){
     const {paginationData,searchText,initial} = data;
     !initial && this.getSuppliers(paginationData,searchText);
   }
 
 
   infoFromTable(info){
     const { edit,data,details,index} = info;
     details&&(this.routeToDetailspage(index));
     edit&&(this.routeToEditPage(index));
   }
   routeToEditPage(index){
     this.router.navigate([`/resha-farms/rm-pupae-buyers/crud/`,this.res[index]?.id]);
   }
   
    routeToDetailspage(index){
     this.router.navigate([`/resha-farms/rm-pupae-buyers/details/`,this.res[index]?.id]);
    }
    buildSerachQuery(searchText){
     const text = searchText.replace(/ /gi,"*");
     if(searchText){
       if(!isNaN(searchText)){
         return `( id==${searchText} or name==*${text}* or phone==*${text}* )`
       }
       if(searchText.includes('RMPUPAEBY')&&!isNaN(searchText.substring(9))){
         return `( id==${searchText.substring(10)} or name==*${text}* or phone==*${text}* )`
       }else{
         return `( name==*${text}* or phone==*${text}* )`
       }
     }
   return false;
  }
 
 getSuppliers(paginationData=false,searchText=''){
   this.ngxLoader.stop();
   this.apiSearch.getAllPupaeBuyers(paginationData,this.buildSerachQuery(searchText)).then(res=>{
     this.rowDataList = [];
     this.res = res['content'];
     res['content'].filter(record=>{
       const obj={};
       obj['RM CODE'] = record?.code ? record?.code : ' - ',
       obj['NAME'] = record?.name ? record?.name : ' - ',
       obj['PHONE'] = record?.phone ? record?.phone  : ' - ',
       obj['CITY'] = record?.address ? record?.address?.city : ' - ',
       obj['CREATED DATE'] = record?.createdDate ? this.utils.getDisplayTime(record?.createdDate)  : ' - ',
       obj['CREATED BY'] = record?.createdBy ? record?.createdBy : ' - ',
       obj['ACTION'] = record,
       this.CONSTANT.ID ='RM CODE',
       this.CONSTANT.ACTION = 'ACTION',
       this.rowDataList.push(obj);
     });
     this.totalRecords = res['totalElements'];
     this._cd.detectChanges();
   })
 }
 
 ngOnInit(): void {
   this.getSuppliers();
 }

}
