import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SearchService } from 'src/app/services/api/search.service';

@Component({
  selector: 'app-iot-devices',
  templateUrl: './iot-devices.component.html',
  styleUrls: ['./iot-devices.component.scss']
})
export class IotDevicesComponent implements OnInit {
  deviceDataList: any[];
  res: any;
  totalRecords: any;
  paginationData = {
    currentPage : 0,
    pageSize    : 10,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  };
  
   tableHeader = {
    code: 0,
    createdDate: 0,
    id:0
   };

  constructor(
    private ngxLoader:NgxUiLoaderService,
    private apiSearch:SearchService,
    private _cd:ChangeDetectorRef,
    private router: Router,

  ) {

   }

  ngOnInit(): void {
    this.getDeviceTypeSubscription();
  }

  getDeviceTypeSubscription(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getAllSubscriptionsData(paginationData,this.buildSerachQuery(searchText)).then(res=>{
      this.deviceDataList = [];
      
      this.res = res['content'];
      this.paginationData.total = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  buildSerachQuery(searchText){
    //const { productType,businessVertical} = this.filterForm.value;
    let query = `(productType=in=IOT and businessVertical=in=RESHA_FARMS and active==true`;
    if (searchText) {
      let text=searchText.replace(/ /gi,"*");
      let query:String=`(`;
      (query+=`((code==*RMDTYPE${searchText}* or deviceName==*${text}* or brand==*${text}* or manufacturer==*${text}* or vendor==*${text}*) and productType =in=IOT and businessVertical=in=RESHA_FARMS`);
      searchText.toString()?.toUpperCase()?.includes('RMDTYPE')&&!isNaN(parseInt(searchText.substring(7)))&&(query+=` or code==*RMDTYPE${searchText.substring(7)}*`)
      !isNaN(parseInt(searchText))&&(query+=` or code==*RMDTYPE${searchText}*`)
      query+='))';
      return query;
    }
      query+=')'
      return query;
 }


async onPageChange(page) {
  console.log(page);
  this.paginationData.currentPage = page;
  this.getDeviceTypeSubscription();
}

async onPageSizeChange() {
  this.paginationData.currentPage = 0;
  this.getDeviceTypeSubscription();
}

redirectoDeviceType(id){
  this.router.navigate(['/resha-farms/device-management/devicetype-details/',id])
}

}
