import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AllDevices, Device } from 'src/app/model/Iot/iotDevice.model';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-rearing-iot-management',
  templateUrl: './rearing-iot-management.component.html',
  styleUrls: ['./rearing-iot-management.component.scss']
})
export class RearingIotManagementComponent implements OnInit { 
  deviceList:any[]=[];
  user;
  constructor(private api:ApiService, 
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
  }
  searchText:any='';
  res:any;
  tableHeaders:any=[
    {name:"ID",sort:true},
    {name:"Chawki Date",sort:true},
    {name:"Created Date",sort:true},
    {name:"Customer",sort:true},
    {name:"Agronomist",sort:true},
    {name:"Device Description",sort:true},
    {name:"Action"}
 ];

 getDeviceAssociation(){
   this.ngxLoader.stop();
   this.api.getAllDeviceAssociations().then((res:any)=>{
    this.deviceList=[]; 
    this.res = res['_embedded']['devices'];
    res['_embedded']['devices'].forEach((device:any) => {
       this.deviceList.push({
        "ID": device['id'],
        "Chawki Date": device['chawkiDateInMillis']?this.util.getDisplayTime(parseInt(device['chawkiDateInMillis'])):'-',
        "Created Date": this.util.getDisplayTime(device.createdDate),
        "Customer": {name: device?.farmerName + '-' + device.phoneNumber,id:device?.rmFarmId},
        "Agronomist": device.agronomist?.name + '-' + device.agronomist['phoneNumber'],
        "Device Description": device['deviceDescription'] ? device['deviceDescription'] : '-',
        "Action":'edit'
      });
    });
    this._cd.detectChanges();
   })
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
 routeToPage(data){
   console.log(data);
    if(data.phone){
      const { Customer } = data?.item;
      if(Customer.id.includes('RMFARM'))
      return this.router.navigate(['/resha-farms/farmers/details',Customer.id.substring(6)]);
      else if(Customer.id.includes('RMCHAWKI'))
      return this.router.navigate(['/resha-farms/chawki/details',Customer.id.substring(8)]);
    }
   !isNaN(data)
   this.router.navigate(['/resha-farms/rearing-iot/details',{id: data?.ID, farmerId: data?.Customer?.id}]);
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