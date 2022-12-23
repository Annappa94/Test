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
  selector: 'app-oil-spinning-mill-list',
  templateUrl: './oil-spinning-mill-list.component.html',
  styleUrls: ['./oil-spinning-mill-list.component.scss']
})
export class OilSpinningMillListComponent implements OnInit {
  rowDataList:any;
  
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

  ngOnInit(): void {
    this.getspinningmillList();

  }
  spinningmillList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  closeResult: string;
  selectedLGPartner:any;
  paginationData:boolean = false;
  searchText:string = '';
  tableHeaders:any=[
    {name:"OIL MILL ID", sortName:'code'},
    {name:"Name PHONE NO", sortName:'name', sort:true},
    {name:"GST NO", sortName:'address.city', sort:true},
    {name:"GSTIN STATUS", sortName:'createdDate', sort:true},
    {name:'RELATIONSHIP', sortName: 'createdBy',sort:true},
    {name:'CREATED BY'},
    {name:"LAST VERIFIED DATE & TIME", sortName:'phone', sort:true},
    {name:'CREATED DATE & TIME'},
    {name:'ACTION'}
  ];
  CONSTANT = CONSTANT;
  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    this.paginationData = paginationData;
    this.searchText = searchText;
    !initial && this.getspinningmillList(paginationData,searchText);

  }

//   buildSerachQuery(searchText){
//     const text = searchText.replace(/ /gi,"*");
//     if(searchText){
//       if(!isNaN(searchText)){
//         return `( name==*${text}* or phone==*${text}* )`
//       }
//       if(searchText.includes('RMCOSM')&&!isNaN(searchText.substring(6))){
//         return `( code==${searchText.substring(6)} or name==*${text}* or phone==*${text}* )`
//       }else{
//         return `( name==*${text}* or phone==*${text}* )`
//       }
//     }
//   return false;
//  }

  buildSerachQuery(searchText){
    const text = searchText.replace(/ /gi,"*");
    if(searchText){
      if(!isNaN(searchText)){
        return `(id==${searchText} or name==*${text}* or phone==*${text}*)`
      }
      if(searchText.includes('RMCOSM')&&!isNaN(searchText.substring(6))){
        return `(id==${searchText.substring(6)} or name==*${text}* or phone==*${text}*)`
      }else{
        return `(name==*${text}* or phone==*${text}*)`
      }
    }
  return ;
  }

  getspinningmillList(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getOilSpinningMills(paginationData,this.buildSerachQuery(searchText)).then(res=>{
      this.rowDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={};
        obj['OIL MILL ID'] = record?.code ? record?.code : ' - ',
        obj['NAME PHONE NO.'] = `${record?.name} <br> ${record?.phone}`
        obj['GST NO'] = record?.gstNumber
        obj['GSTIN STATUS'] = record?.gstNumberProfileDetails[0]?.gstnStatus
        if (record?.contractActive == false) {
          obj['RELEATIONSHIP'] = record?.contractActive?record?.contractActive:'Regular'
        } else {
          obj['RELEATIONSHIP'] = record?.contractActive?record?.contractActive:'Contract'
        }
        obj['CREATED BY']=record?.createdBy
        obj['LAST VERIFIED DATE &TIME'] = record?.gstNumberProfileDetails[0]? this.utils.getDisplayTime(record?.lastModifiedDate)  : ' - ',
      obj['CREATED DATE & TIME']=record?.gstNumberProfileDetails[0]? this.utils.getDisplayTime(record?.createdDate)  : ' - ',
      obj['ACTION'] = 'ACTION',
        this.CONSTANT.ID ='OIL MILL ID',
        this.CONSTANT.ACTION ='ACTION',
        this.CONSTANT.HTML_CONTENT ='NAME PHONE NO.',
        this.rowDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  tableInfo(info){
    const { edit,data,details,index} = info;
    details&&(this.routeToDetailspage(index));
    edit&&(this.routeToEditPage(index));
  }

  routeToEditPage(index){
    this.router.navigate([`/resha-farms/oil-spinning-mills/crud`,this.res[index]?.id]);
  }
  
   routeToDetailspage(index){
    this.router.navigate([`/resha-farms/oil-spinning-mills/details`,this.res[index]?.id]);
   }

}

