import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import * as _moment from 'moment';
import { saveAs } from 'file-saver';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-rearing-iot-device-details',
  templateUrl: './rearing-iot-device-details.component.html',
  styleUrls: ['./rearing-iot-device-details.component.scss']
})
export class RearingIotDeviceDetailsComponent implements OnInit {
  rearingIotDeviceData: any;
  createdFarmerId:any
  lifeCycleTracker: any;
  modelImageUrl: any;
  expandImage: boolean;
  deviceInformation: any;
  deviceId;
  userType;
  farmerId;
  farmerByID;
  farmerDetails;
  latestSensorRecords;
  attrubutesData;
  alertData = [];
  advisoryInfo: any;
  silkFarmerDeviceAllocationId: any;


  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    private _cd: ChangeDetectorRef,
    public utils: UtilsService,
    private apiSearch: SearchService,
    private modalService: NgbModal,
    private toaster: ToastrService,

  ) {
    this.userType = JSON.parse(localStorage.getItem('_ud'));
    this.route.params.subscribe((params: Params) => {
      this.deviceId = params["deviceId"]
    });
    this.getRearingIOTdeviceDetails();
    this.getdeviceDetailsbyid();
  }

  chakidateForm:UntypedFormGroup = new UntypedFormGroup({
    chawkiDate:new UntypedFormControl(),
  });
  

  //record Advisory Form Start
  recordAdvisoryForm:UntypedFormGroup = new UntypedFormGroup({
    chawkiStartDate: new UntypedFormControl(),
    currentTemperature: new UntypedFormControl(),
    rearingQuantity:  new UntypedFormControl(),
    advisoryProvidedToFarmer:  new UntypedFormControl(), 
    visitedFarmer:  new UntypedFormControl(),
    disinfectantUsed: new UntypedFormControl(),
    instarStage:  new UntypedFormControl(),
    currentHumidity: new UntypedFormControl(),
    autoAdvisory:  new UntypedFormControl(),
    remarks:  new UntypedFormControl(),
    instarDay: new UntypedFormControl(),
    feedingTime:  new UntypedFormControl(),
    uploadedImage: new UntypedFormControl(),
    
  });

  getRearingIOTdeviceDetails(){
    this.ngxLoader.stop();
    this.api.getRearingIotDeviceByID(this.deviceId).then(res => {
      this.rearingIotDeviceData = res;
      console.log('sdsdf',this.rearingIotDeviceData);
      this._cd.detectChanges();
    })
  }

  ngOnInit(): void {
    this.getInstarstages();    
    // this.getRearingAdvisoryList();
  }


  getdeviceDetailsbyid() {
    this.ngxLoader.stop();
    this.api.getRearingIotDeviceDetails(this.deviceId).then(res => {
      this.deviceInformation = res;
      this.silkFarmerDeviceAllocationId=this.deviceInformation ?  this.deviceInformation?.lifecycleTracker?.deviceAllocationId : '';
      this.getAdvisory();
      this.getRearingAdvisoryList();
      this._cd.detectChanges();
    })
  }
  
  getFarmerById(id) {
    this.ngxLoader.stop();
    this.api.getFarmerById(id).then(res => {
      this.farmerDetails = res['farmer'];
      this._cd.detectChanges();
    });
  }
  getChawkiById(id) {
    this.api.getChawkiById(id).then((response: any) => {
      console.log(response);
      this.farmerDetails = response;
      this._cd.detectChanges();
    })
  }

  getLatestSensorsData() {
    this.ngxLoader.stop();
    this.api.getLatestSensorsData(this.deviceInformation['deviceId'], this.farmerId).then(res => {
      this.latestSensorRecords = res;
      this._cd.detectChanges();
    })
  }

  getAttributes() {
    this.ngxLoader.stop();
    this.api.getAttributesData(this.deviceInformation['deviceId'], this.farmerId).then(res => {
      this.attrubutesData = res;
      this._cd.detectChanges();

    })
  }
  goBack() {
    this.router.navigate(['/resha-farms/rearing-iot'])
  }
  rowDataList: any[] = [];
  rowList: any[] = [];
  res: any[] = [];
  totalRecords: number = 0 ;
  modalRef;
  date = { start: null, end: null };

  tableHeaders: any = [
    { name: "Date", sortName: 'createdDate' },
    { name: "Instar stage", sortName: 'instarStage', sort: true },
    { name: "Instar day", sortName: 'dayOfChawki', sort: true },
    // { name: "temperature", sortName: 'temperature.current', sort: true },
    { name: "Advisory Provided By Farmer", sortName: 'ProvidedToFarmer', sort: true },
    {name:"CurrentTemperature ",sortName:'CurrentTemperature',sort:true},
    {name:"Current Humidity",sortName:'CurrentHumidity',sort:true},
    {name:"Image",sortName:'status',sort:true},


    // { name: 'Image' }
  ];
  Headers: any = [
    { name: "Date", sortName: 'createdDate' },
    { name: "Auto Advisory", sortName: 'instarStage', sort: true },
  ];

  CONSTANT = CONSTANT;

  onPageChange(data) {
    const { paginationData, searchText, initial } = data;
    !initial && this.getAdvisory(paginationData, searchText);
  }

  listenForDate(data) {
    this.date = data;
    this.getAdvisory();
  }

  buildSerachQuery(searchText: any = '', dates = this.date) {
    let searchQuery = `( deviceId == ${this.deviceId} `
    if (dates['start'] && dates['end']) {
      const { start, end } = dates;
      searchQuery += ` and ( createdDate>=${start} and createdDate<=${end})`
    }
    if (parseInt(searchText)) {
      searchQuery += ` and dayOfChawki == ${searchText}`
    }
    if (this.selectedInstar) {
      searchQuery += ` and instarStage == '${this.selectedInstar}'`
    }
    searchQuery += ')'
    return searchQuery;
  }

  getAdvisory(paginationData = false, searchText = '') {
    this.ngxLoader.stop();
    this.api.getAllAdvisoryList(this.silkFarmerDeviceAllocationId).then(res => {
      console.log('advisory list',res)

      this.rowDataList = [];
      this.res = res['content'];

      res['content']?.filter(record => {
        console.log('res', record);
        const obj = {};
        obj['Date'] = record?.chawkiStartDate ? this.utils.getDisplayTime(record?.chawkiStartDate) : ' - ',
        obj['Advisory By Agronomist'] = record?.instarStage ? record?.instarStage : ' - ',
        obj['Advisory Type'] = record?.instarDay ? record?.instarDay : ' - ',
        obj['ProvidedToFarmer'] = record?.advisoryProvidedToFarmer ? record?.advisoryProvidedToFarmer : ' - ',
        obj['CurrentTemperature'] = record?.currentTemperature ? record?.currentTemperature : ' - ',
        obj['CurrentHumidity'] = record?.currentHumidity ? record?.currentHumidity : ' - ',
        obj['Image'] = record?.uploadedImageUrl ? record?.uploadedImageUrl : ' - ',
       
        this.rowDataList.push(obj);
        this._cd.detectChanges();
      })
      this.CONSTANT.IMAGEURL = 'Image';
      this.totalRecords = res['content'].length;
  })
  }
          // obj['Image'] = record?.rearingShedImageUrl ? record?.rearingShedImageUrl : null,
          // obj['Instar stage'] = record?.currentStage ? record?.currentStage : ' - ',
          // obj['Instar day'] = record?.dayOfChawki ? record?.dayOfChawki : 0,
          // obj['temperature'] = record?.temperature?.current ? record?.temperature?.current : ' - ',



  getRearingAdvisoryList(paginationData = false, searchText = '') {
    this.ngxLoader.stop();
    this.api.getRearingAllAdvisoryList(this.silkFarmerDeviceAllocationId).then(res => {
      console.log('',res)

      this.rowList = [];
      this.res = res['content'];

      res['content']?.filter(record => {
        console.log('res', record);
        const obj = {};
        obj['Date'] = record?.createdOn ? this.utils.getDisplayTime(record?.createdOn) : ' - ',
        obj['Auto Advisory'] = record?.messageBody? record?.messageBody : '',
        this.rowList.push(obj);
      })
      this._cd.detectChanges();

      this.CONSTANT.IMAGEURL = 'Image';
      this.totalRecords = res['advisories'].length;
  })
  }

  downLoadXLFile() {
    this.ngxLoader.stop();
    this.apiSearch.downloadReport(this.buildSerachQuery(), 'iotadvisories').then(res => {
      if (res) {
        this.downLoadFile(res, "application/ms-excel", 'Iot_Advisories');
      }
      this._cd.detectChanges();
    }).catch(err => {
      this._cd.detectChanges();
    });
  }

  instartStageList: String[] = []
  getInstarstages() {
    this.api.getInstarstages().then((res: any) => {
      this.instartStageList = res.data;
      this._cd.detectChanges();
    });
  }

  selectedInstar: string;
  onInstartStage(instar) {
    this.selectedInstar = instar;
    this.getAdvisory();
  }

  downLoadFile(data: any, type: string, reportType) {
    const moment = _moment;
    let blob = new Blob([data], { type: type });
    saveAs(blob, reportType + moment().format('YYYY-MM-DD HH:mm:ss') + '.xls')
  }
  gobackToDeviceList() {
    this.router.navigate(['/resha-farms/rearing-iot/devices'])
  }
  routeToCustomer() {
    this.farmerDetails.code?.includes("RMFARM") ? this.router.navigate(['/resha-farms/farmers/details', this.farmerDetails.id]) :
      this.router.navigate(['/resha-farms/chawki/details', this.farmerDetails.id])
  }

  closeResult: string;
  openchakidatepopup(content){
    this.chakidateForm.get('chawkiDate').patchValue(new Date(this.deviceInformation?.chawkiDate));
    this.modalRef = this.modalService.open(content)
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed`;
        });

  }
  recordAdvisory(advisory,deviceInformation){
    this.getTicketDetails();
    this.recordAdvisoryForm.reset();
    this.modalRef = this.modalService.open(advisory,{ size: 'lg', backdrop: 'static' })
    this.recordAdvisoryForm.get('chawkiStartDate').patchValue( new Date(this.deviceInformation?.chawkiDate));
    this.recordAdvisoryForm.get('instarStage').patchValue(this.deviceInformation?.lifecycleTracker?.currentStage)
    this.recordAdvisoryForm.get('instarDay').patchValue(this.deviceInformation?.lifecycleTracker?.dayOfChawki)
    this.recordAdvisoryForm.get('currentTemperature').patchValue(this.deviceInformation?.readingData?.temperature)
    this.recordAdvisoryForm.get('currentHumidity').patchValue(this.deviceInformation?.readingData?.humidity)
    this.modalRef.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
        this.closeResult = `Dismissed`;
    });
    this._cd.detectChanges();
    this.getAdvisory();
   


  }
  cancelDateChange() {
    this.modalRef.close();
  }

  getTicketDetails() {
    this.api.getTicketDetailes(this.deviceInformation?.deviceAllocationDetails?.farmerId).then(res=>{
      this.advisoryInfo = res['content'][0];
      console.log('===========>',this.advisoryInfo);
      this.recordAdvisoryForm.get('autoAdvisory').patchValue(this.advisoryInfo?.messageBody)
      this._cd.detectChanges();

      
    })
  }

  updateChawkidate() {
    const params = {
      chaakiDate: new Date(this.chakidateForm.get('chawkiDate').value).getTime()
    }    
    this.api.updateChawkiDateForIotFarmer(this.deviceInformation?.deviceAllocationDetails?.farmerId,params).then(res => {
      this.modalRef.close();
      this.getdeviceDetailsbyid()
      // window.location.reload()
      this.toaster.success('Chawki Date updated successfully', 'Chawki Date Changes', {
        timeOut: 3000,
      })
      this._cd.detectChanges();
    });
   
  }
  

  Lifecycletracker() {

    const params = {
      farmerId: this.deviceInformation?.deviceAllocationDetails?.farmerId
    }

    this.api.onlifeCycleTracker(params).then(res => {
      this.lifeCycleTracker=res;
      console.log('lifecycle tracker',res)
      window.location.reload()

    });
  }
  // createRecordAdvisory payload
  createRecordAdvisory() {
    let payload= {
      "farmerId": this.deviceInformation?.deviceAllocationDetails?.farmerId,
      "silkFarmerDeviceAllocationId": this.deviceInformation?.lifecycleTracker?.deviceAllocationId,
      "silkwormLifecycleTrackerId":this.deviceInformation?.lifecycleTracker?.id,
      "chawkiStartDate": Date.parse(this.recordAdvisoryForm.value.chawkiStartDate),
      "currentTemperature": parseInt(this.recordAdvisoryForm.value.currentTemperature),
      "mulberryQuantity": this.recordAdvisoryForm.value.rearingQuantity,
      "advisoryProvidedToFarmer": this.recordAdvisoryForm.value.advisoryProvidedToFarmer,
      "visitedFarmer": this.recordAdvisoryForm.value.visitedFarmer,
      "instarStage": this.recordAdvisoryForm.value.instarStage,
      "currentHumidity": parseInt(this.recordAdvisoryForm.value.currentHumidity),
      "disinfectantUsed": this.recordAdvisoryForm.value.disinfectantUsed,
      "autoAdvisory": this.recordAdvisoryForm.value.autoAdvisory,
      "remarks": this.recordAdvisoryForm.value.remarks,
      "instarDay": parseInt(this.recordAdvisoryForm.value.instarDay),
      "feedingTime": Date.parse(this.recordAdvisoryForm.value.feedingTime),
      "uploadedImageUrl": this.recordAdvisoryForm.value.uploadedImage

    }
    this.api.createAdvisory(payload).then(res=>{
      this.getAdvisory();
      this.toaster.success('Record Advisory  Created  successfully', 'Ok', {
        timeOut: 3000,
      })
    })
 
     this.modalRef.close();
 

     
   
  }
  

  //upload Advisory Image

  showImage(imageUrl) {
    if (imageUrl) {
      this.modelImageUrl = null;
      this.getprotectedUrl(imageUrl);
      this.expandImage = true;
    }
  }
  async getprotectedUrl(imgUrl) {
    const { targetUrl }: any = await this.api.getPresignedUrlForViewImage(imgUrl);
    this.modelImageUrl = targetUrl;
    this._cd.detectChanges()
  }
  onImageUpload(image) {
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        let previewImage = reader.result as string;
        this.getS3CatUrl(file.type, file);
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
  imageLoading: boolean = false;
  async getS3CatUrl(fileType, file) {
    try {
      this.imageLoading = true;
      this._cd.detectChanges()
      await this.api.getRearingIotFollowupNoteImageUrl(fileType.split('/')[1]).then((res: any) => {
        this.calluploadImageToS3APICate(res.targetUrl, file, res.fileName);
        this.imageLoading = false;
      })
    } catch (err) {
      this.recordAdvisoryForm.get('uploadedImage').patchValue('')
    
      this.imageLoading = false;
      this._cd.detectChanges()
    }
  }

  async calluploadImageToS3APICate(s3url: String, file, fileNameFromS3: String) {
    try {
      this.imageLoading = true;
      this._cd.detectChanges()
      await this.api.updateImageToS3Directly(s3url, file).then((res: any) => {
        this.recordAdvisoryForm.get('uploadedImage').patchValue(fileNameFromS3)
        this.imageLoading = false;
        this._cd.detectChanges();
      });
    } catch (err) {
      this.imageLoading = false;
      this.recordAdvisoryForm.get('uploadedImage').patchValue('')
      this._cd.detectChanges()
    }
  }

  

}
