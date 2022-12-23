import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { relative } from 'path';

@Component({
  selector: 'app-ginner-list',
  templateUrl: './ginner-list.component.html',
  styleUrls: ['./ginner-list.component.scss']
})
export class GinnerListComponent implements OnInit {




filterForm:UntypedFormGroup = new UntypedFormGroup({
  contractActive:new UntypedFormControl('ALL'),
  gstnStatus :new UntypedFormControl('(Active,Inactive)')
})
  constructor(
    private apiSearch:SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private modalService: NgbModal,

  ) { }
  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;

  tableHeaders:any=[
    {name:"GINNING MILL ID", sortName:'id'},
    {name:"NAME PHONE NO.", sortName:'name', sort:true},
    {name:"GST NO", sortName:'address.city', sort:true},
    {name:'GSTIN STATUS', sortName: 'createdDate',sort:true},
    {name:'RELATIONSHIP', sortName: 'createdBy',sort:true},
    {name:'CREATED BY'},
    {name:"Last VERIFIED DATE & TIME", sortName:'phone', sort:true},
    {name:'CREATED DATE & TIME'},
    {name:'ACTION'},
  ];

 

   CONSTANT = CONSTANT;

  onPageChange(data){
    
    const {paginationData,searchText,initial} = data;
    !initial && this.getRetailers(paginationData,searchText);
  }


  infoFromTable(info){
    const { edit,data,details,index} = info;
    details&&(this.routeToDetailspage(index));
    edit&&(this.routeToEditPage(index));
  }

  routeToEditPage(index){
    this.router.navigate([`/resha-farms/ginners/crud/`,this.res[index]?.id]);
  }
  
   routeToDetailspage(index){
    this.router.navigate([`/resha-farms/ginners/details/`,this.res[index]?.id]);
   }

   listenForFilterChanges(){
    this.filterForm.valueChanges.subscribe(value=>{
      this.getRetailers();
      console.log('www',value.contractActive);
      console.log('sddf',value.relationship);
    })
  }

   buildSerachQuery(searchText){
      const { contractActive }  = this.filterForm.value;
      const text = searchText.replace(/ /gi,"*");
      if(searchText){

        let query = ``;

        if(!isNaN(searchText)){
          // query+= `( (phone==${searchText} or phone==*${text}* or phone==*${text}*)`
          
        }
        if(searchText.includes('RMGINNER')&&!isNaN(searchText.substring(8))){
          query+=`( (id==${searchText.substring(8)} or name==*${text}* or phone==*${text}*)`
        }else{
          query+= `( (name==*${text}* or phone==*${text}*)`
        }
        query+=  contractActive!='ALL'?` and contractActive==${contractActive})`:`)`;

        return query;
      }
  
    return   contractActive!='ALL'?`contractActive==${contractActive}`:false;
   }

  getRetailers(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getOrdersCotton(paginationData,'ginner',this.buildSerachQuery(searchText)).then(res=>{
      this.rowDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={};
        obj['GINNING MILL ID'] = record?.code ? record?.code : ' - ',
        obj['NAME PHONE NO.'] = `${record?.name} <br> ${record?.phone}`
        obj['GST NO'] = record?.gstNumber
        obj['GST IN STATUS'] = record?.gstNumberProfileDetails[0] ?.gstnStatus
        if (record?.contractActive == false) {
          obj['RELEATIONSHIP'] = record?.contractActive?record?.contractActive:'Regular'
        } else {
          obj['RELEATIONSHIP'] = 'Contract'
        }
        obj['CREATED BY'] = record?.createdBy ? record?.createdBy : ' - ',
        obj['Last VERIFIED DATE & TIME'] = record?.gstNumberProfileDetails[0] ? this.utils.getDisplayTime(record?.gstNumberProfileDetails[0]?.lastVerifiedAt) : ' - ',
        obj['CREATED DATE'] = record?.gstNumberProfileDetails[0] ? this.utils.getDisplayTime(record?.createdDate)  : ' - ',
        obj['CREATED BY'] = record?.createdBy ? record?.createdBy : ' - ',
        obj['ACTION'] = 'ACTION',
        this.CONSTANT.ID ='GINNING MILL ID',
        this.CONSTANT.ACTION ='ACTION',
        this.CONSTANT.HTML_CONTENT ='NAME PHONE NO.',
        
        this.rowDataList.push(obj);
        

      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  ngOnInit(): void {
    this.listenForFilterChanges()
    this.getRetailers();
  }



}
