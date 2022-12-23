import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomValidator } from 'src/app/modules/shared/custom-validator/custom.validator';

@Component({
  selector: 'app-device-list-crud',
  templateUrl: './device-list-crud.component.html',
  styleUrls: ['./device-list-crud.component.scss']
})
export class DeviceListCrudComponent implements OnInit {
  modalRef;
  closeResult;
  createDeviceForm:UntypedFormGroup;
  i = 0;
  deviceTypeList: any;
  deviceTypeDatabyId: any;
  deviceTypeCode: any;
  deviceTypeId: any;
  centerList: any;
  warehouseList: any;
  id: any;
  selectedAssignee: any;
  usersList: any[];
  roles = ['ADMINISTRATOR', 'COperationsAgent','COCOON_PROCUREMENT_EXEC','COCOON_SALES_EXEC', 'COperationsManager','COCOON_PROCUREMENT_MANAGER',  'COCOON_SALES_MANAGER', 'YOperationsAgent', 'YOperationsManager', 'FinanceManager', 'FinanceHead', 'CCenterAgent', 'CCenterManager','FarmInputAgent','FarmInputManager', 'RetailSalesAgent', 'RetailSalesManager', 'RetailSourcingAgent', 'RetailSourcingManager', 'LogisticsManager', 'MudraAgent', 'MudraManager', 'CottonAgent','CottonManager','PupaeAgent','PupaeManager'];
  HQobj: any;
  changedLocationValue: any;
  changedLocationType: any;
  selectedDeviceData: Object;
  deviceSimNumber:any;
  removeAddStar: boolean;
  Devicedetailes: any;


  async deviceCrudForms() {
    this.createDeviceForm = this.form.group({
      deviceSerialId: new UntypedFormControl('',[Validators.required]),
      deviceTypeList: new UntypedFormControl(''),
      locationType: new UntypedFormControl('HQ'),
      simNumber: new UntypedFormControl(''),
      location: new UntypedFormControl(''),
      status: new UntypedFormControl(''),
      deviceHealth: new UntypedFormControl(''),
      assigneeName: new UntypedFormControl(''),
      assigneePhone: new UntypedFormControl(''),
      deviceType: new UntypedFormControl('',[Validators.required]),
    });
  }



  constructor(
    private api: ApiService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private modalService: NgbModal,
    private form: UntypedFormBuilder,
    private route:ActivatedRoute,
    private snackBar:MatSnackBar,

  ) { 
    this.getCenters();
    this.getWarehouses();
  }

  createreqobj(){
    let reqObj = {
      "deviceSpecifications" : {}
    }

    let dynamicBlock = this.createDeviceForm.get('deviceSpecificationsTest') as UntypedFormArray;
    dynamicBlock.value.forEach((obj, index) => {
      reqObj.deviceSpecifications[obj['key']] = obj['value'];
    })

  }

  ngOnInit(): void {
    this.deviceCrudForms();
    this.getAllUsers();
    this.getDeviceTypeName();
    this.changedLocationType = "HQ";
    this.changedLocationValue = {
      'name': 'Corporate Office'
    };

    const { id } = this.route.snapshot.params;
    this.id = id;
    this.id&&this.getDeviceDataById();
    this.createDeviceForm.get('location').patchValue(this.HQobj);

  }

  goBack(){
    this.router.navigate(['/resha-farms/device-management/device-list'])
  }

  getDeviceDataById(){
    this.api.getDeviceDataByID(this.id).then(res=>{
      this.selectedDeviceData = res;
      this.deviceTypeId = this.selectedDeviceData['deviceTypeId'] ? this.selectedDeviceData['deviceTypeId'] : "";
      this.createDeviceForm.patchValue(res);  
      this.createDeviceForm.get('deviceType').patchValue(res['deviceTypeId']);
      this.createDeviceForm.get('location').patchValue((res['location']['centerName']) || res['location']['name']) ;

     
    })
  }

  getDeviceTypeName(){
    this.api.searchAllDeviceType().then(res=>{
      console.log('Device list',res)
      this.deviceTypeList = res['content'];
      
      this._cd.detectChanges();
    })
  }


  getDeviuceTypeDataById(eventdata){
    this.deviceTypeId =eventdata;
    this.devicedetails();
    console.log('dsdfs',this.deviceTypeId);
  }
  devicedetails(){
    this.ngxLoader.stop();
    this.api.getDeviceDetailessById(this.deviceTypeId).then(res=>{
      this.Devicedetailes = res;
      if (this.Devicedetailes?.supportedServices[0] == 'REARING') {
        this.createDeviceForm.get('simNumber').addValidators(Validators.required);
        this.createDeviceForm.get('simNumber').updateValueAndValidity();
        this.removeAddStar = true;
      } else {
        this.createDeviceForm.get('simNumber').clearValidators();
        this.createDeviceForm.get('simNumber').updateValueAndValidity();
        this.removeAddStar = false;
      }
      console.log("Detailes data",this.Devicedetailes)
    })
  }

  changeLocationType(event) {
    this.changedLocationType = event;
    this.createDeviceForm.get('location').patchValue('');

    if (event == 'HQ') {
      this.changedLocationValue = {
        'name': 'Corporate Office'
      };
    } else {
      this.changedLocationValue = {
        'name': ''
      };
    }
   
  }
  
  changeLocation(event){
    if (event == 'Corporate Office') {
      this.changedLocationValue = {
        'name': event
      };
    } else {
      this.changedLocationValue = event;
    }
      
  }

  createDevice(value){
    
    let reqObj = {
      "deviceSerialId": value.deviceSerialId,
      "deviceTypeId":  this.deviceTypeId,
      "simNumber": value.simNumber,
      //"location": null,
      "location": this.changedLocationValue,
      "locationType": value.locationType,
      "assigneeId" : this.selectedAssignee?.id ? this.selectedAssignee?.id : null,
      "status": "AVAILABLE",
      "health": "NORMAL",
      "deviceDetails": null, 
    }
    if (this.id) {
      this.selectedDeviceData['deviceSerialId'] = value.deviceSerialId;
      this.selectedDeviceData['deviceTypeId'] = this.deviceTypeId;
      this.selectedDeviceData['simNumber'] =  value.simNumber;
      this.selectedDeviceData['location'] =  this.changedLocationValue;
      this.selectedDeviceData['locationType'] =  value.locationType;
      this.selectedDeviceData['assigneeId'] =  this.selectedAssignee?.id ? this.selectedAssignee?.id : null;
      this.api.updateDeviceData(this.id,this.selectedDeviceData).then(response => {
        this.snackBar.open('Devices Updated Successfully', 'Ok', {
          duration: 3000
        });
       // this.goBack();
       this.router.navigate(['/resha-farms/device-management/device-list']);
        
      })
    } else {
      this.api.createNewDevice(reqObj).then(response => {
        this.snackBar.open('Devices Created Successfully', 'Ok', {
          duration: 3000
        });
        this.router.navigate(['/resha-farms/device-management/device-list']);
       //this.goBack();
        
      })
    }
  }

  async getCenters() {
    this.ngxLoader.stop();
    this.api.getCentersList().then(details => {
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }

  async getWarehouses() {
    this.ngxLoader.stop();
    this.api.getWarehouseList().then(details => {
      if (details) {
        this.warehouseList = details['_embedded']['warehouse'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }

  assignedToChanged(assigneData){
    this.selectedAssignee = assigneData
  

  }
  


  async getAllUsers() {
    this.usersList = [];
    this.ngxLoader.stop();
    this.api.getAllUsersList(this.roles).then(res => {
      if (res['_embedded']['user'] && res['_embedded']['user'].length) {
        this.usersList = [...res['_embedded']['user']];

      } else {
        this.usersList = [];
      }
      this._cd.detectChanges();
    });
  }



}

