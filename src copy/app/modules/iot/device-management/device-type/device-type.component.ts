import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-device-type',
  templateUrl: './device-type.component.html',
  styleUrls: ['./device-type.component.scss']
})
export class DeviceTypeComponent implements OnInit {

  @ViewChild('content') div;
  filterForm:UntypedFormGroup = new UntypedFormGroup({
    productType:new UntypedFormControl('(IOT,INPUT,MACHINERY)'),
    businessVertical:new UntypedFormControl('(RESHA_FARMS)'),
  })

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
    this.listenForFilterChanges();
    this.getDeviceTypeList();
  }

  listenForFilterChanges(){
    this.filterForm.valueChanges.subscribe(value=>{
     this.getDeviceTypeList();
    })
  }

  deviceDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  closeResult: string;
  selectedLGPartner:any;
  paginationData:boolean = false;
  searchText:string = '';


  tableHeaders:any=[
    {name:"ID", sortName:'code'},
    {name:"Device Name", sortName:'deviceName', sort:true},
    {name:"Brand", sortName:'brand', sort:true},
    {name:"Manufacture", sortName:'manufacturer', sort:true},
    {name:"Vendor Name", sortName:'vendor', sort:true},
    {name:"Business Vertical", sortName:'businessVertical', sort:true},
    {name:"Product Type", sortName:'productType', sort:true},
    // {name:"Rate", sortName:'rate', sort:true},
    //{name:"Currency", sortName:'currency', sort:true},
    // {name:"Purchase Rate", sortName:'purchaseRate', sort:true},
    // {name:"Total Units", sortName:'totalUnits', sort:true},
    //{name:"Onhand Units", sortName:'onhandUnits', sort:true},
    // {name:"Available Units", sortName:'availableUnits', sort:true},
    {name:'ACTION'},
  ];

  CONSTANT = CONSTANT;
  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    this.paginationData = paginationData;
    this.searchText = searchText;
    !initial && this.getDeviceTypeList(paginationData,searchText);
  }


  tableInfo(info){
    const { edit,data,details,index} = info;
    // details&&(this.routeToDetailspage(index));

    details&&(this.routeToDeviceDeviceTypeDetails(index));

    edit&&(this.routeToEditPage(index));
    // switchIconToggle&&(this.openBlacklistPopUp(index));
  }
  
  routeToDeviceDeviceTypeDetails(index){
    this.router.navigate([`/resha-farms/device-management/devicetype-details`,this.res[index].id]);
  }

  routeToEditPage(index){
    this.router.navigate([`/resha-farms/device-management/device-type-crud`,this.res[index]?.id]);
  }

  getDeviceTypeList(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getAllDeviceTypeData(paginationData,this.buildSerachQuery(searchText)).then(res=>{
      this.deviceDataList = [];
      
      this.res = res['content'];
      this.res.filter(record=>{
        
        const obj={};
        obj['ID'] = record?.code ? record?.code : ' - ',
        obj['Device Name'] = record?.deviceName ? record?.deviceName : ' - ',
        obj['Brand'] = record?.brand ? record?.brand  : ' - ',
        obj['Manufacture'] = record?.manufacturer ? record?.manufacturer : ' - ',
        obj['Vendor Name'] = record?.vendor ? record?.vendor : ' - ',
        obj['Business Vertical'] = record?.businessVertical ? record?.businessVertical : ' - ',
        obj['Product Type'] = record?.productType ? record?.productType : ' - ',
        // obj['Rate'] = record?.sellingRate ? record?.sellingRate : ' - ',
        //obj['Currency'] = record?.currency ? record?.currency : ' - ',
        // obj['Purchase Rate'] = record?.purchaseRate ? record?.purchaseRate : ' - ',
        // obj['Total Units'] =  ' - ',
        //obj['Onhand Units'] =  ' - ',
        // obj['Available Units'] =  ' - ',
        obj['ACTION'] = 'ACTION',
        // this.CONSTANT.ID ='RM CODE',
        this.CONSTANT.ID ='ID',
        this.CONSTANT.ACTION ='ACTION',
        this.deviceDataList.push(obj);
        
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  buildSerachQuery(searchText){
  //   const text = searchText.replace(/ /gi,"*");
  //   if(searchText){
  //     if(!isNaN(searchText)){
  //       return `(code==*RMDTYPE${searchText}* or deviceName==*${text}* or brand==*${text}* or manufacturer==*${text}* or vendor==*${text}*)`
  //     }
  //     if(searchText.includes('RMDTYPE')&&!isNaN(searchText.substring(7))){
  //       return `(code==*RMDTYPE${searchText.substring(7)}* or deviceName==*${text}* or brand==*${text}* or manufacturer==*${text}* or vendor==*${text}*)`
  //     }else{
  //       return `(deviceName==*${text}* or brand==*${text}* or manufacturer==*${text}* or vendor==*${text}*)`
  //     }
  //   }
  // return ;

  const { productType,businessVertical} = this.filterForm.value;
  let query = `(productType=in=${productType} and businessVertical=in=${businessVertical}`;
  if (searchText) {
    let text=searchText.replace(/ /gi,"*");
    let query:String=`(`;
    (query+=`((code==*RMDTYPE${text}* or deviceName==*${text}* or brand==*${text}* or manufacturer==*${text}* or vendor==*${text}*) and productType =in= ${productType} and businessVertical=in=${businessVertical}`);
    searchText.toString()?.toUpperCase()?.includes('RMDTYPE')&&!isNaN(parseInt(searchText.substring(7)))&&(query+=` or code==*RMDTYPE${searchText.substring(7)}*`)
    !isNaN(parseInt(searchText))&&(query+=` or code==*RMDTYPE${text}*`)
    query+='))';
    return query;
  }
   query+=')'
   return query;
 }

}
