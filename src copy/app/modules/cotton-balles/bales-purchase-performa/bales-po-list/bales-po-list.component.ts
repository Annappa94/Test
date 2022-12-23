import { ChangeDetectorRef, Component,ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { COTTON_BALE_PO_STATUS } from 'src/app/constants/enum/constant.cottonbalepo';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';


@Component({
  selector: 'app-bales-po-list',
  templateUrl: './bales-po-list.component.html',
  styleUrls: ['./bales-po-list.component.scss']
})
export class BalesPoListComponent implements OnInit {
  balePOTableDataList:any;
  balesPOList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  closeResult: string;
  selectedLGPartner:any;
  paginationData:boolean = false;
  searchText:string = '';
  cottonBalePOId:any;
  tableHeaders:any=[
    {name:"RM code", sortName:'id'},
    {name:"Spinning Unit Name", sortName:'spinningMill.name', sort:true},
    // {name:"Phone", sortName:'spinningMill.phone', sort:true},
    {name:"No.Of.Bales", sortName:'noOfBales', sort:true},
    {name:"Status", sortName:'status', sort:true},
    {name:"Created Date", sortName:'createdDate', sort:true},
    {name:'ACTION'},
  ];
  CONSTANT = CONSTANT;

  @Input()
  spinningMillPerformaID : number;


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

  filterForm:UntypedFormGroup = new UntypedFormGroup({
    status:new UntypedFormControl('(NEW,PROCESSING,FULFILLED,CANCELED)')
  })

  ngOnInit(): void {
    this.getBalePerformaList();
    this.listenForFilterChanges();
    
  }

  listenForFilterChanges(){
    this.filterForm.valueChanges.subscribe(value=>{
     this.getBalePerformaList();
    })
  }

  @ViewChild('changeStatusPopUp')
  changeStatusPopUp:ElementRef;

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    this.paginationData = paginationData;
    this.searchText = searchText;
    !initial && this.getBalePerformaList(paginationData,searchText);

  }


  tableInfo(info){
    const { edit,data,details,index, switchIconToggle,rowCheckBox,popup} = info;
    details&&(this.routeToDetailspage(index));
    edit&&(this.routeToEditPage(index));
    popup&&this.changesStatusByOpeningPopup(data,index);

    // switchIconToggle&&(this.openBlacklistPopUp(index));
    // rowCheckBox&&this.selectedDeviceListFromTable(index)

  }

  cancellationReason;
  cottonBalePOStatus:string;
  changesStatusByOpeningPopup(status,index){
   this.cottonBalePOStatus = status;
   this.cottonBalePOId = this.res[index].id;
   this.modalService.open(this.changeStatusPopUp);
  }

  markProcessing(){
    this.ngxLoader.stop()
    this.api.patchBalePerformaById(this.cottonBalePOId,{status:this.cottonBalePOStatus}).then(res=>{
      this.modalService.dismissAll();
      this.getBalePerformaList();
    })
  }

  onCancel(){
    this.modalService.dismissAll();
    this.getBalePerformaList();
  }


  routeToDetailspage(index){
    this.router.navigate([`/resha-farms/cotton-bale-po/details`,this.res[index].id]);
  }
  routeToEditPage(index){
    this.router.navigate([`/resha-farms/cotton-bale-po/crud`,this.res[index].id]);
  }


//   buildSerachQuery(searchText){
//     const text = searchText.replace(/ /gi,"*");
//     if(searchText){
//       if(!isNaN(searchText)){
//         return `( id==${searchText} or spinningMill.name==*${text}*)`
//       }
//       if(searchText.includes('RMCBPPO')&&!isNaN(searchText.substring(7))){
//         return `( id==${searchText.substring(7)} or spinningMill.name==*${text}* )`
//       }else{
//         return `( spinningMill.name==*${text}*)`
//       }
//     }
//   return false;
//  }

 buildSerachQuery(searchText:any){
  const {status} = this.filterForm.value;
  let query = `(status=in=${status}`;
      if (searchText) {
       let text=searchText.replace(/ /gi,"*");
       let query:String=`(`;
       (query+=`((spinningMill.name==*${text}*) and status=in=${status}`);
       searchText.toString()?.toUpperCase()?.includes('RMCBPPO')&&!isNaN(searchText.substring(7))&&(query+=` or id==${searchText.substring(7)}`)
       !isNaN(parseInt(searchText))&&(query+=` or id==${searchText}`)
       query+='))';
       return query;
     }
     (this.spinningMillPerformaID && (query+= ` and spinningMill.id==${this.spinningMillPerformaID}`))

     query+=')'
     return query;

 }
 routeToCrud(){
  this.router.navigate([`/resha-farms/cotton-bale-po/crud`]);
   
 }

  getBalePerformaList(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getCottonPerforma(paginationData,this.buildSerachQuery(searchText)).then(res=>{
      this.balePOTableDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={};
        obj['RM CODE'] = record?.code ? record?.code : ' - ',
        obj['Spinning Unit Name'] = record?.spinningMill ? record?.spinningMill?.name : ' - ',
        // obj['PHONE'] = record?.spinningMill ? record?.spinningMill.phone  : ' - ',
        obj['No.Of Bales'] = record?.noOfBales ? record?.noOfBales  : ' 0 ',
        obj['INVENTORY STATUS']= {
          'status': record?.status,
          'INVENTORY_STATUS':this.statusChangeConFig(record?.status)
        },
        //obj['STATUS'] = record?.status ? record?.status : ' - ',
        obj['CREATED DATE'] = record?.createdDate ?  this.utils.getDisplayDate(record?.createdDate)  : ' - ',
        obj['ACTION'] = 'ACTION',
        this.CONSTANT.ID ='RM CODE',
        this.CONSTANT.ACTION ='ACTION',
        this.CONSTANT.STATUS_SELECT_BOX="INVENTORY STATUS";

        this.balePOTableDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  statusChangeConFig(status){
    switch (status) {
      case 'NEW':
        return COTTON_BALE_PO_STATUS.NEW;
      case 'PROCESSING':
        return COTTON_BALE_PO_STATUS.PROCESSING;
      case 'FULFILLED':
        return COTTON_BALE_PO_STATUS.FULFILLED;
      case 'CANCELED':
        return COTTON_BALE_PO_STATUS.CANCELED;
    }
  }

  
}
