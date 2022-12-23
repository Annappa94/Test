import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { S3UrlResponse } from 'src/app/model/types/type.model';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-advisory-crud',
  templateUrl: './advisory-crud.component.html',
  styleUrls: ['./advisory-crud.component.scss']
})
export class AdvisoryCrudComponent implements OnInit {
  id;
  farmerId;
  farmerByID;
  advisoryForm: UntypedFormGroup;
  constructor(
    private route: ActivatedRoute,
    private api:ApiService, 
    private router:Router,
    private ngxLoader:NgxUiLoaderService,
    private _cd: ChangeDetectorRef,
    public utils: UtilsService,
    private form:UntypedFormBuilder,
    private snackBar:MatSnackBar,
    private $gaService:GoogleAnalyticsService,
  ) { 
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.deviceId = params['id'];
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

    this.advisoryFormBuild();
    this.getBedDisinfectants();
  }

  disinfectantsList = [];
  getBedDisinfectants(){
    this.api.getCBedDisinfectantsEnums().then(res=>{
      this.disinfectantsList = res['data']
    })
  }
  goBack(){
   this.router.navigate(['/resha-farms/rearing-iot/details',{id: this.id, farmerId: this.farmerId}]);
  }
  ngOnInit(): void {
    this.listenForRearingShedVisit();
    this.getInstarstages();
  }
  farmerDetails;
  getFarmerById(id){
    this.ngxLoader.stop();
    this.api.getFarmerById(id).then(res => {
      this.farmerDetails = res['farmer'];
      this._cd.detectChanges();
    });
  }
  advisoryFormBuild(){
    this.advisoryForm = this.form.group({
      chawkiDate: new UntypedFormControl('',Validators.required),
      instarStage: new UntypedFormControl('', Validators.required),
      dayOfChawki: new UntypedFormControl('', Validators.required),
      temperatureCurrent: new UntypedFormControl(''),
      humidityCurrent: new UntypedFormControl(''),
      airQuality: new UntypedFormControl(''),
      lightCurrent: new UntypedFormControl(''),
      bedDisinfectantUsed: new UntypedFormControl('', Validators.required),
      mulberryQuantity: new UntypedFormControl('', Validators.required),
      autoAdvisory: new UntypedFormControl(''),
      advisoryToFarmer: new UntypedFormControl('', Validators.required),
      remarks: new UntypedFormControl(''),
      rearingShedImageUrl: new UntypedFormControl(''),
      rearingShedVisit: new UntypedFormControl('false'),
      feedingTime: new UntypedFormControl('',[Validators.required]),
    })
  }

  deviceId;
  associatedDevicesInfo:any;
  async getdeviceAssociationById(){
    this.ngxLoader.stop();
    this.api.getRearingIotDeviceDetails(this.deviceId).then(res => {
        this.associatedDevicesInfo = res;  
        this.associatedDevicesInfo.createdDate = this.utils.getDisplayTime(this.associatedDevicesInfo?.createdDate)
        this.associatedDevicesInfo.chawkiDate =this.utils.getDisplayTime(parseInt(this.associatedDevicesInfo.chawkiDateInMillis));
        this.associatedDevicesInfo.chawkiEndDate = this.associatedDevicesInfo.chawkiEndDate ? this.utils.getDisplayTime(parseInt(this.associatedDevicesInfo.chawkiEndDate)) : null;
        this.advisoryForm.get('chawkiDate').patchValue(this.associatedDevicesInfo?.chawkiDate);
        this.advisoryForm.get('instarStage').patchValue(this.associatedDevicesInfo?.threshold?.instarStage);
        this.advisoryForm.get('dayOfChawki').patchValue(this.associatedDevicesInfo?.threshold?.dayOfChawki);
        this.advisoryForm.get('temperatureCurrent').patchValue(this.associatedDevicesInfo?.recordData?.temperature);
        this.advisoryForm.get('humidityCurrent').patchValue(this.associatedDevicesInfo?.recordData?.humidity);
        this.advisoryForm.get('airQuality').patchValue(this.associatedDevicesInfo?.threshold?.airQuality?.current);
        this.advisoryForm.get('lightCurrent').patchValue(this.associatedDevicesInfo?.threshold?.light?.current);
        this._cd.detectChanges();       
        this.getLatestSensorsData();
        this.getAttributes();
        this.getAlerts();
    })
  }

listenForRearingShedVisit(){
  this.advisoryForm.get("rearingShedVisit").valueChanges.subscribe(value=>{
    if(JSON.parse(value)){
      this.advisoryForm.get("rearingShedImageUrl").setValidators([Validators.required])
      this.advisoryForm.get("rearingShedImageUrl").updateValueAndValidity();
    }else{
      this.advisoryForm.get("rearingShedImageUrl").setValidators([]);
      this.advisoryForm.get("rearingShedImageUrl").updateValueAndValidity();
    }
  })
}

  getChawkiById(id){
    this.api.getChawkiById(id).then((response:any)=>{
      console.log(response);
      this.farmerDetails=response;
      this._cd.detectChanges();
    })
  }
  latestSensorRecords;
  getLatestSensorsData(){
    this.ngxLoader.stop();
    this.api.getLatestSensorsData(this.associatedDevicesInfo['deviceId'], this.farmerId ).then(res => {
      this.latestSensorRecords = res;
      this.updateLatestSensorReading(res)
      this._cd.detectChanges();
    })
}


updateLatestSensorReading(sensorReadings){
  const { airQuality,humidity,temperature,light} = sensorReadings;
  this.advisoryForm.get('temperatureCurrent').patchValue(temperature?.current)
  this.advisoryForm.get('humidityCurrent').patchValue(humidity?.current)
  this.advisoryForm.get('airQuality').patchValue(airQuality?.current)
  this.advisoryForm.get('lightCurrent').patchValue(light?.current)
  this._cd.detectChanges();
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

converTime(time) {  
  let hours = time?.split(":")[0];
  let minutes = time?.split(":")[1];
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2, '0');
    hours = hours.toString().padStart(2, '0');
    let strTime = hours + ':' + minutes + ':00 ' + ampm;
    return strTime;
}

bulidPayload(){
 const params = this.advisoryForm.value;
 const feedingTime = this.converTime(params.feedingTime);
 const idealReadings = this.associatedDevicesInfo?.threshold
 return {
  "instarStage":params?.instarStage,
  "dayOfChawki": params?.dayOfChawki,
  "chawkiDate": params?.chawkiDate,
  "temperature": {
      "current": params?.temperatureCurrent,
      "min":idealReadings?.temperature?.min,
      "max":idealReadings?.temperature?.max
  },
  "humidity": {
      "current": params?.humidityCurrent,
      "min":idealReadings?.humidity?.min,
      "max":idealReadings?.humidity?.max
  },
  "airQuality": {
      "current": params?.airQuality,
      "min":idealReadings?.airQuality?.min,
      "max":idealReadings?.airQuality?.max
  },
  "light": {
      "current": params?.lightCurrent,
      "min":idealReadings?.light?.min,
      "max":idealReadings?.light?.max
  },
  "bedDisinfectantUsed": params?.bedDisinfectantUsed,
  "mulberryQuantity":params?.mulberryQuantity,
  "feedingTime": feedingTime,
  "rearingShedVisit": JSON.parse(params?.rearingShedVisit),
  "rearingShedImageUrl": params?.rearingShedImageUrl,
  "advisory": params?.advisoryToFarmer, 
  "remarks" : params?.remarks,
  "deviceId":this.id
}

}

addAdvisory(){
  this.api.addAdvisories(this.bulidPayload()).then(res=>{
    this.$gaService.event('Create Advisory for rearing shed.');

    this.goBack();
  }).catch(err=>{
    this.snackBar.open('somthing went wrong', 'Ok', {
      duration: 3000
    });
  });
}


alertData= [];
getAlerts(){
  this.alertData = [];
  this.ngxLoader.stop();
    this.api.getAlertsData(this.associatedDevicesInfo['deviceId']).then(res => {
      this.alertData = res['_embedded']['deviceAlerts'];
      this.alertData.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      this.alertData.slice(0,5);
      this.alertData.length&&this.advisoryForm.get("autoAdvisory").patchValue(this.alertData[0]?.alertNotification?.advisoryMessage)
      this._cd.detectChanges();      
    })
}

instartStageList:String[]=[]
getInstarstages(){
  this.api.getInstarstages().then((res:any)=>{
   this.instartStageList = res.data;
   this._cd.detectChanges();
  });
}

onImageUpload(image) {
  if (image) {
    const file = image.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      let previewImage = reader.result as string;
      this.imageUploadURL = previewImage;
      this._cd.detectChanges();
    };
    this.getS3Url(file.type,file);
    reader.readAsDataURL(file);
    image.target.value =''
   }
}

async getS3Url(fileType,file){
  try{
    this.countAPIRequest++;
    this._cd.detectChanges();
    await this.api.getS3Url(fileType.split('/')[1],"rearingShedVisit").then((res:S3UrlResponse)=>{
      this.countAPIResponse++;
      this._cd.detectChanges();
      this.calluploadImageToS3API(res.targetUrl,file,res.fileName);
   });
  }catch(err){
    this.countAPIResponse++;
    this.imageUploadURL = '';
    this.advisoryForm.get('rearingShedImageUrl').patchValue('');
    this.snackBar.open('Image upload Failed', 'Ok', {
      duration: 3000
    });
    this._cd.detectChanges()
  }
}

imageUploadURL:String;

countAPIRequest:number = 0;
countAPIResponse:number = 0;

async calluploadImageToS3API(s3url:String,file,fileNameFromS3:String){
  try{
    this.countAPIRequest++;
    this._cd.detectChanges();
    await this.api.updateImageToS3Directly(s3url,file).then(res=>{
          this.countAPIResponse++;
          this.imageUploadURL = fileNameFromS3;
          this.advisoryForm.get('rearingShedImageUrl').patchValue(fileNameFromS3);
          this._cd.detectChanges()
      });
  }catch(err){
    this.countAPIResponse++
    this.imageUploadURL = '';
    this.advisoryForm.get('rearingShedImageUrl').patchValue('')
    this.snackBar.open('Image upload Failed', 'Ok', {
      duration: 3000
    });
    this._cd.detectChanges();
  }
}

}
