import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import * as _moment from 'moment';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-iot-device-details',
  templateUrl: './iot-device-details.component.html',
  styleUrls: ['./iot-device-details.component.scss']
})
export class IotDeviceDetailsComponent implements OnInit {
id;
farmerId;
farmerByID;
userType;
associatedDevicesInfo:any;
  constructor(
    private route: ActivatedRoute,
    private api:ApiService, 
    private router:Router,
    private ngxLoader:NgxUiLoaderService,
    private _cd: ChangeDetectorRef,
    public utils: UtilsService,
    private apiSearch:SearchService,
    ) { 
      this.userType = JSON.parse(localStorage.getItem('_ud'));

      this.route.params.subscribe((params: Params) => {
        //console.log(params);
        
        if (params['id']) {
          this.id = params['id'];
          this.farmerId = params['farmerId'];
          this.farmerByID = params['farmerId'];
          this.farmerByID = this.farmerByID.substring(6)
          this.getdeviceAssociationById();
            //  this.farmerDetails
            if(params['farmerId']?.includes('RMFARM')){
              this.getFarmerById(this.farmerByID);
            }
            else{
              this.getChawkiById(params['farmerId']?.substring(8));
            }
        }
      });
    }

    routeToCustomer(){
      this.farmerDetails.code?.includes("RMFARM")?this.router.navigate(['/resha-farms/farmers/details',this.farmerDetails.id]):
      this.router.navigate(['/resha-farms/chawki/details',this.farmerDetails.id])
    }
    farmerDetails;
    getFarmerById(id){
      this.ngxLoader.stop();
      this.api.getFarmerById(id).then(res => {
        this.farmerDetails = res['farmer'];
        //console.log(this.farmerDetails);
        
        this._cd.detectChanges();
      });
    }
    async getdeviceAssociationById(){
      this.ngxLoader.stop();
      this.api.getAssociatedDeviceByFarmId(this.farmerId).then(res => {
          this.associatedDevicesInfo = res[0];   
          this.associatedDevicesInfo.createdDate = this.utils.getDisplayTime(this.associatedDevicesInfo.createdDate)
          this.associatedDevicesInfo.chawkiDate =this.utils.getDisplayTime(parseInt(this.associatedDevicesInfo.chawkiDateInMillis));
          this.associatedDevicesInfo.chawkiEndDate = this.associatedDevicesInfo.chawkiEndDate ? this.utils.getDisplayTime(parseInt(this.associatedDevicesInfo.chawkiEndDate)) : null;
          this._cd.detectChanges();       
          this.getLatestSensorsData();
          this.getAttributes();
          this.getAlerts();
      })
    }

    getChawkiById(id){
      this.api.getChawkiById(id).then((response:any)=>{
        console.log(response);
        this.farmerDetails=response;
        // this.address.reset();
        // this.farmerCreate.get("name").patchValue(response['name'])
        // this.farmerCreate.get("phoneNumber").patchValue(response['phone'])
        // // this.farmerCreate.get("chaakiDate").patchValue(_moment(response['farmer']['chaakiDate']))
        // this.farmerCreate.get("code").patchValue(response['code']);
        // response?.address&&this.address.patchValue(response?.address);
        this._cd.detectChanges();
      })
    }
  ngOnInit(): void {
    this.getAdvisory();
    this.getInstarstages();
  }
  latestSensorRecords;
    getLatestSensorsData(){
      this.ngxLoader.stop();
      this.api.getLatestSensorsData(this.associatedDevicesInfo['deviceId'], this.farmerId ).then(res => {
        this.latestSensorRecords = res;
        this._cd.detectChanges();
      })
  }
  attrubutesData;
  getAttributes(){
    this.ngxLoader.stop();
      this.api.getAttributesData(this.associatedDevicesInfo['deviceId'], this.farmerId ).then(res => {
        this.attrubutesData = res;
        this._cd.detectChanges();
        //console.log(this.attrubutesData);
        
      })
  }
  alertData= [];
  getAlerts(){
    this.alertData = [];
    this.ngxLoader.stop();
      this.api.getAlertsData(this.associatedDevicesInfo['deviceId']).then(res => {
        this.alertData = res['_embedded']['deviceAlerts'];
        
          this.alertData.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
          this.alertData.slice(0,5)
        this._cd.detectChanges();
     // console.log(this.alertData);
        
      })
  }
  
  goBack(){

    this.router.navigate(['/resha-farms/rearing-iot'])
  }

/** Advisory table list */
  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  date ={ start:null, end: null};
  
  tableHeaders:any=[
    {name:"Date", sortName:'createdDate'},
    {name:"Instar stage", sortName:'instarStage', sort:true},
    {name:"Instar day", sortName:'dayOfChawki', sort:true},
    {name:"temperature", sortName:'temperature.current', sort:true},
    {name:"Advisory By Agronomist", sortName:'advisory', sort:true},
    {name:'Image'}
  ];

   CONSTANT = CONSTANT;

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    !initial && this.getAdvisory(paginationData,searchText);
  }

  listenForDate(data){
    this.date = data;
    this.getAdvisory();
  }

   buildSerachQuery(searchText:any='',dates=this.date){
 
    let searchQuery= `( deviceId == ${this.id} `

      if(dates['start']&&dates['end']){
        const {start,end} = dates;
        searchQuery += ` and ( createdDate>=${start} and createdDate<=${end})`
      }
      if(parseInt(searchText)){
        searchQuery += ` and dayOfChawki == ${searchText}`
      }

      if(this.selectedInstar){
        searchQuery += ` and instarStage == '${this.selectedInstar}'`
      }
      searchQuery+=')'

      return searchQuery;
   }

  getAdvisory(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getOrders(paginationData,'advisories',this.buildSerachQuery(searchText)).then(res=>{
      this.rowDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={};
        obj['Date'] = record?.createdDate ? this.utils.getDisplayTime(record?.createdDate) : ' - ',
        obj['Instar stage'] = record?.instarStage ? record?.instarStage : ' - ',
        obj['Instar day'] = record?.dayOfChawki ? record?.dayOfChawki : 0,
        obj['temperature'] = record?.temperature?.current ? record?.temperature?.current: ' - ',
        obj['Advisory By Agronomist'] = record?.advisory ? record?.advisory: ' - ',
        obj['Image'] = record?.rearingShedImageUrl ? record?.rearingShedImageUrl  : null,
        this.rowDataList.push(obj);
        this.CONSTANT.IMAGEURL ='Image';
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  downLoadXLFile(){
      this.ngxLoader.stop();
      this.apiSearch.downloadReport(this.buildSerachQuery(),'iotadvisories').then(res => {
        if (res) {
          this.downLoadFile(res, "application/ms-excel", 'Iot_Advisories');
        }
        this._cd.detectChanges();
      }).catch(err=>{
        this._cd.detectChanges();
      });
   }

   instartStageList:String[]=[]
   getInstarstages(){
     this.api.getInstarstages().then((res:any)=>{
      this.instartStageList = res.data;
      this._cd.detectChanges();
     });
   }

  selectedInstar:string;
  onInstartStage(instar){
    this.selectedInstar = instar;
    this.getAdvisory();
  }

   downLoadFile(data: any, type: string, reportType) {
    const moment = _moment;
    let blob = new Blob([data], { type: type });
    saveAs(blob, reportType + moment().format('YYYY-MM-DD HH:mm:ss') + '.xls')
  }
}
