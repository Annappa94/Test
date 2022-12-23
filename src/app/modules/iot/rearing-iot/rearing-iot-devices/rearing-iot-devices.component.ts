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
  selector: 'app-rearing-iot-devices',
  templateUrl: './rearing-iot-devices.component.html',
  styleUrls: ['./rearing-iot-devices.component.scss']
})
export class RearingIotDevicesComponent implements OnInit {
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
  agronomistList = [];


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
    {name:"Id",sortName:'plotId',sort:true},
    {name:"Farmer",sortName:'farmerName',sort:true},
    {name:"device Serial No",sortName:'deviceSerialId', sort:true},
    {name:"device Id",sortName:'deviceCode', sort:true},
    {name:"Agronomist",sortName:'agronomistName',sort:true},
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
  details&&(this.routeToDeviceDetailsPage(index));
}

routeToDetailspage(index){
 //  this.router.navigate(['/mulberry-iot/details/'+ data?.ID,farmerId: data?.Customer?.id]);
  //this.router.navigate(['/mulberry-iot/details',this.res[index].plotCode]);
 }

 routeToEditPage(index){
  this.router.navigate(['/resha-farms/rearing-iot/devices/crud/',this.res[index].id]);
 }

 getDeviceAssociation(paginationData=false,searchText=''){
   this.ngxLoader.stop();
   this.apiSearch.getRearingIotdevicesData(this.paginationData,this.buildSerachQuery(searchText)).then((res:any)=>{
    this.deviceList=[]; 
    this.res = res['content'];    
    this.res.filter(record=>{
      const obj={};
      obj['Id'] = record?.deviceId ? record?.deviceId : ' - ',
      obj['Customer'] = record?.farmerName + '-' +record?.farmerPhone ? record?.farmerName + '-' +record?.farmerPhone : ' - ',
      obj['device Serial No'] = record?.deviceSerialId ? record?.deviceSerialId : ' - ',
      obj['device Id'] = record?.deviceCode ? record?.deviceCode : ' - ',
      obj['Agronomist'] = record?.agronomistName + '-' + record.agronomistPhone ? ((record?.agronomistName  || '')+ '-' + (record.agronomistPhone || '')) : ' - ',
      // obj['Created Date'] = this.util.getDisplayTime(record.createdDate);
      obj['ACTION'] = 'ACTION',
      // this.CONSTANT.ID ='Farmer',
      this.CONSTANT.ACTION ='ACTION',
      // this.CONSTANT.SELECTE_POPUP="Agronomist";
      this.CONSTANT.ID ='Id',
      this.deviceList.push(obj);  
    });
    this.totalRecords = res['totalElements'];
    this._cd.detectChanges();
   })
 } 

 buildSerachQuery(searchText){
  const text = searchText.replace(/ /gi,"*");
  if(searchText){
    if(!isNaN(searchText)){
      return `(farmerPhone==*${text}* or farmerName==*${text}* or agronomistName==*${text}* or agronomistPhone==${text}* or deviceSerialId==${text}*)`
    }
    else{
      return `(farmerPhone==*${text}* or farmerName==*${text}* or agronomistName==*${text}* or agronomistPhone==${text}* or deviceSerialId==${text}*)`
    }
  }
return ;
}

 editRoute(data){
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
  getAgronomistList(){
    this.api.getAllUsersList('Agronomist').then(res=>{
      this.agronomistList = res['_embedded']['user'];
    })
  }
  routeToDeviceDetailsPage(index){
    this.router.navigate(['/resha-farms/rearing-iot/rearing-iot-device-details', this.res[index].deviceId])
  }
}
