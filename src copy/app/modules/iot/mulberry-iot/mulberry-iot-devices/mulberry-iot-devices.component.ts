import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AllDevices, Device } from 'src/app/model/Iot/iotDevice.model';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { SearchService } from 'src/app/services/api/search.service';
import { CONSTANT } from 'src/app/constants/pagination.constant';

@Component({
  selector: 'app-mulberry-iot-devices',
  templateUrl: './mulberry-iot-devices.component.html',
  styleUrls: ['./mulberry-iot-devices.component.scss']
})
export class MulberryIotDevicesComponent implements OnInit {

  deviceList:any[]=[];
  user;
  searchText:string = '';
  res:any;
  paginationData = {
    currentPage : 0,
    pageSize    : 10,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  };
  totalRecords:number = 0;

  constructor(private api:ApiService, 
              private apiSearch:SearchService,
              private ngxLoader:NgxUiLoaderService,
              private util:UtilsService,
              private router:Router,
              private snackBar:MatSnackBar,
              private _cd:ChangeDetectorRef
              ) { 
                this.user = JSON.parse(localStorage.getItem('_ud'))
              }

  ngOnInit(): void {
    this.getDeviceAssociation();
    this.getAgronomistList();
  }
  CONSTANT = CONSTANT;

 
  tableHeaders:any=[
    {name:"Plot ID",sortName:'plotId',sort:true},
    {name:"Farmer",sortName:'farmerName',sort:true},
    {name:"plot Code",sortName:'plotCode', sort:true},
    {name:"device Code",sortName:'deviceCode', sort:true},
    {name:"Agronomist",sortName:'agronomistName',sort:true},
    // {name:"Created Date",sort:true},
    {name:"Action"}
 ];

 onPageChange(data){
  const {paginationData,searchText,initial} = data;
  this.paginationData = paginationData;
  this.searchText = searchText;
  !initial && this.getDeviceAssociation(paginationData,searchText);
}


tableInfo(info){
  const { edit,data,details,index} = info;
  details&&(this.routeToDetailspage(index));
  // details&&(this.routeToDeviceDeviceTypeDetails(index));
  edit&&(this.routeToEditPage(index));
  // switchIconToggle&&(this.openBlacklistPopUp(index));
}

routeToDetailspage(index){
  console.log(index);
 //  this.router.navigate(['/mulberry-iot/details/'+ data?.ID,farmerId: data?.Customer?.id]);
  this.router.navigate(['/resha-farms/mulberry-iot/details',this.res[index].plotCode]);
 }

 routeToEditPage(index){
  this.router.navigate(['/resha-farms/mulberry-iot/mulbery-crud', {id: this.res[index].id, plotCode: this.res[index].deviceCode}]);
 }

 getDeviceAssociation(paginationData=false,searchText=''){
   this.ngxLoader.stop();
   this.apiSearch.getMulberryIotdevicesData(this.paginationData,this.buildSerachQuery(searchText)).then((res:any)=>{
    this.deviceList=[]; 
    this.res = res['content'];
    this.res.filter(record=>{
      console.log(record);
      const obj={};
      obj['PlotID'] = record?.plotId ? record?.plotId : ' - ',
      obj['Farmer'] = record?.farmerName + '-' +record?.farmerPhone ? record?.farmerName + '-' +record?.farmerPhone : ' - ',
      obj['Plot Code'] = record?.plotCode ? record?.plotCode  : ' - ',
      obj['device Code'] = record?.deviceCode ? record?.deviceCode : ' - ',
      obj['Agronomist'] = record?.agronomistName + '-' + record.agronomistPhone ? ((record?.agronomistName  || '')+ '-' + (record.agronomistPhone || '')) : ' - ',
      // obj['Created Date'] = this.util.getDisplayTime(record.createdDate);
      obj['ACTION'] = 'ACTION',
      this.CONSTANT.ID ='PlotID',
      // this.CONSTANT.ID ='Farmer',
      this.CONSTANT.ACTION ='ACTION',
      // this.CONSTANT.SELECTE_POPUP="Agronomist";
      this.deviceList.push(obj);
      console.log(this.deviceList);
      
    });
    this.totalRecords = res['totalElements'];
    this._cd.detectChanges();
   })
 } 

 buildSerachQuery(searchText){
  const text = searchText.replace(/ /gi,"*");
  if(searchText){
    if(!isNaN(searchText)){
      return `(farmerPhone==*${text}* or plotCode==*${text}* or farmerName==*${text}* or agronomistName==*${text}* or agronomistPhone==${text}*)`
    }
    else{
      return `(farmerPhone==*${text}* or plotCode==*${text}* or farmerName==*${text}* or agronomistName==*${text}* or agronomistPhone==${text}*)`
    }
  }
return ;
}

 editRoute(data){
   console.log(data)
   if(data.edit){
    const { ID } = data?.item;
     this.router.navigate(['/resha-farms/rearing-iot/crud',ID])
   }else if(data.delete){
     this.api.deleteDeviceAssociation(this.res[data?.index].id).then(res=>{
      this.snackBar.open('Deleted successfully', 'Ok', {
        duration: 3000
      });
      this.getDeviceAssociation();
     })
   }
 }

 

  syncDeviceData(){
    this.api.syncMulberrydata().then(res=>{
      this.snackBar.open('Synced successfully', 'Ok', {
        duration: 3000
      });
    })
  }
  agronomistList = [];
  getAgronomistList(){
    this.api.getAllUsersList('Agronomist').then(res=>{
      this.agronomistList = res['_embedded']['user']
      console.log(' this.agronomistList', this.agronomistList);
      
      
    })
  }

}


export interface device{
  "id" : String,
  "deviceId": String,
  "deviceDescription":String,
  "chawkiDate": String,
  "agronomist": {
      "name": String,
      "phoneNumber":String
  },
  "phoneNumber":String,
  "farmerName":String,
   "battery": number,
  "lastReadingsDateTime": number,
  "deviceStatus" : String,
  "rssi": String,
  "powerMode": String,
  'rmFarmId':String,
  "threshold":any
}