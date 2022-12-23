import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ApiService } from 'src/app/services/api/api.service';


@Component({
  selector: 'app-logistics-list',
  templateUrl: './logistics-list.component.html',
  styleUrls: ['./logistics-list.component.scss']
})
export class LogisticsListComponent implements OnInit {

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
    {name:"RM CODE", sortName:'id'},
    {name:"COMPANY/OWNER NAME", sortName:'merchantName', sort:true},
    {name:"PHONE", sortName:'phone', sort:true},
    // {name:"STATUS", sortName:'status', sort:true},
    {name:"TYPE", sortName:'customerType', sort:true},
    {name:"BLACK LIST"},
    {name:"REFFERED BY", sortName:'refferedBy', sort:true},
    {name:'CREATED DATE', sortName: 'createdDate',sort:true},
    {name:'CREATED BY', sortName: 'createdBy',sort:true},
    {name:'ACTION'},
  ];

   CONSTANT = CONSTANT;

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    this.paginationData = paginationData;
    this.searchText = searchText;
    !initial && this.getLogisticsList(paginationData,searchText);
  }


  infoFromTable(info){
    const { edit,data,details,index, switchIconToggle} = info;
    details&&(this.routeToDetailspage(index));
    edit&&(this.routeToEditPage(index));
    switchIconToggle&&(this.openBlacklistPopUp(index));
  }

  openBlacklistPopUp(index){
    
    this.selectedLGPartner = this.res[index];
    this.modalRef = this.modalService.open(this.div)
    this.modalRef.result.then((result) => {
      this.getLogisticsList(this.paginationData,this.searchText);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  updateLPBlacklist(){
      this.modalRef.close();
      let reqObj;
      if(this.selectedLGPartner.isBlackListed){
        reqObj = {
          "isBlackListed":false
        }
      }else{
        reqObj = {
          "isBlackListed":true
        }
      }
      this.api.updateBlacklistLogisticsCompany(this.selectedLGPartner.id,reqObj).then(res => {
        this.getLogisticsList(this.paginationData,this.searchText);
        this.snackBar.open(this.selectedLGPartner.merchantName + ' updated Successfully', 'Ok', {
          duration: 3000
        });
      }, err => {
        console.log(err);
      })
  }

  routeToEditPage(index){
    if(this.router.url?.includes('yarn-logistics')){
      this.router.navigate([`/yarn-logistics/crud/`,this.res[index]?.id]);
      return;
    }
    this.router.navigate([`/resha-farms/farms-logistics/crud/`,this.res[index]?.id]);
  }

   routeToDetailspage(index){
    if(this.router.url?.includes('yarn-logistics')){
      this.router.navigate([`/yarn-logistics/details/`,this.res[index]?.id]);
      return;
    }
    this.router.navigate([`/resha-farms/farms-logistics/details/`,this.res[index]?.id]);
   }

   createNewLogisticPartner(){
    if(this.router.url?.includes('yarn-logistics')){
      this.router.navigate([`/yarn-logistics/crud`]);
      return;
    }
    this.router.navigate([`/resha-farms/farms-logistics/crud`]);
   }

   getLogisticsList(paginationData=false,searchText=''){
     this.ngxLoader.stop();
     this.apiSearch.getLogisticsCompanyData(paginationData,this.buildSerachQuery(searchText)).then(res=>{
       this.rowDataList = [];
       this.res = res['content'];
       res['content'].filter(record=>{
         const obj={};
         obj['RM CODE'] = record?.code ? record?.code : ' - ',
         obj['COMPANY/OWNER NAME'] = record?.merchantName ? record?.merchantName : ' - ',
         obj['PHONE'] = record?.mobile ? record?.mobile  : ' - ',
        //  obj['STATUS'] = record?.status ? record?.status : ' - ',
         obj['TYPE'] = record?.type ? record?.type : ' - ',
         obj['BLACK LIST'] = {
           value :  record?.isBlackListed ? true : false
         },
         obj['REFFERED BY'] = record?.referredBy ? record?.referredBy : ' - ',
         obj['CREATED DATE'] = record?.createdDate ? this.utils.getDisplayTime(record?.createdDate)  : ' - ',
         obj['CREATED BY'] = record?.createdBy ? record?.createdBy : ' - ',
         obj['ACTION'] = 'ACTION',
         this.CONSTANT.ID ='RM CODE',
         this.CONSTANT.ACTION ='ACTION',
         this.CONSTANT.RADIO_BUTTON = 'BLACK LIST',
         this.rowDataList.push(obj);
       });
       this.totalRecords = res['totalElements'];
       this._cd.detectChanges();
     })
   }

   buildSerachQuery(searchText){
      const text = searchText.replace(/ /gi,"*");
      if(searchText){
        if(!isNaN(searchText)){
          return `(id==${searchText} or merchantName==*${text}* or mobile==*${text}*)`
        }
        if(searchText.includes('RMGINNER')&&!isNaN(searchText.substring(8))){
          return `(id==${searchText.substring(8)} or merchantName==*${text}* or mobile==*${text}*)`
        }else{
          return `(merchantName==*${text}* or mobile==*${text}*)`
        }
      }
    return false;
   }



  ngOnInit(): void {
    this.getLogisticsList();
  }

}
