import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AllDevices, Device } from 'src/app/model/Iot/iotDevice.model';
import { ApiService } from 'src/app/services/api/api.service';
import * as _moment from 'moment';
import { GlobalService } from 'src/app/services/global/global.service';
import { FollowUpComponent } from 'src/app/modules/shared/dialog-models/follow-up/follow-up.component';

@Component({
  selector: 'app-rearing-iot-management-crud',
  templateUrl: './rearing-iot-management-crud.component.html',
  styleUrls: ['./rearing-iot-management-crud.component.scss'],
})
export class RearingIotManagementCrudComponent implements OnInit {
  deviceCreateForm:UntypedFormGroup;
  selectedFarmer:any;
  selectedAgronomist:any;
  closeResult;
  farmerList:any[]=[];
  modalRef;
  edit:any=false;
  typeList:any[]=[]
  sensorsList:any[]=[];
  farmerCreate:UntypedFormGroup;
  address:UntypedFormGroup;
  minDate:any;
  settingDeatils:UntypedFormGroup;
  centerList:any[]=[];
  latitude:any;
  longitude:any;
  availableDevice:AvailableDevice[]=[];
  id:any;
  selectedDevice:any;
  cocoonTypeList = [
    {
      displayName : 'Bivoltine Seed',
      code: 'SEEDCOCOON'
    },
    {
      displayName : 'Bivoltine Hybrid',
      code: 'BIVOLTINE'
    },
    {
      displayName : 'CB Gold',
      code: 'CBGOLD'
    }
];
  farmerCreateForm: UntypedFormGroup;
  addFarmerNameForm: UntypedFormGroup;
  farmerDetails;
  farmerId;
  updateChawkiNameForm;
  devicePaymentForm:UntypedFormGroup;
  termsAndConditions:any;
  dataEdit;

  constructor(private form:UntypedFormBuilder,
    private api:ApiService,
    private modalService:NgbModal,
    private _cd: ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private snackBar:MatSnackBar,
    private router:Router,
    private activatedRouter:ActivatedRoute,
    private global:GlobalService
    ) {
      this.farmerFormInit();
      this.createForm();
      this.farmerParams();
      this.initUpdateChawkiNameForm();
      this.id=this.activatedRouter.snapshot.paramMap.get('id');
      if(this.id)
        this.getDevicesById(this.id)
     }
  

     initUpdateChawkiNameForm(){
      this.updateChawkiNameForm = this.form.group({
        name:['',Validators.required]
      });
     }
  farmerFormInit(){
    this.addFarmerNameForm = this.form.group({
      name: new UntypedFormControl('', Validators.required),
    })
  }
  
  updateChawkiName(name){
     this.api.updateChawki(name,this.selectedFarmer?.substring(8)).then((res:any)=>{
      this.modalRef.close();
      this.farmerList = [];
      this.selectedFarmer = res['code'];
      let response=res;
      response.type ='Chawki'
      this.farmerList.push(response);
      this.onFarmerSelection()
      this.addFarmerNameForm.reset();
      this.snackBar.open('Updated successfully', 'Ok', {
        duration: 3000
      });
     })
  }

  ngOnInit(): void {
    this.getCenters();
    this.getLocation();
    this.getAgronomistList();
    this.getAvailableDevice();
  }

  getDevicesById(id){
    this.api.getAssociatedDeviceById(id).then((res:any)=>{
      this.deviceCreateForm.get('type').patchValue(res['deviceId'])
      this.deviceCreateForm.get('des').patchValue(res['deviceDescription'])
      this.deviceCreateForm.get('agroName').patchValue(res['agronomist']['name'])
      this.deviceCreateForm.get('agroPhone').patchValue(res['agronomist']['phoneNumber'])

      // this.farmerCreate.get('name').patchValue(res['farmer']['name'])
      this.farmerCreate.get('phoneNumber').patchValue(res['phoneNumber'])
      this.farmerCreate.get('displayFarmer').patchValue( res?.farmerName +' - '+ res?.phoneNumber)
      this.farmerCreate.get('additionalPhoneNumber').patchValue(res['additionalPhoneNumber'])
      // this.farmerCreate.get('chaakiDate').patchValue(res['chawkiDate'])
      this.farmerCreate.get('code').patchValue(res['rmFarmId']);
      this.farmerId = res['rmFarmId'].substring(6);
      
      this.farmerCreate.get("chaakiDate").patchValue(_moment(res['chawkiDateInMillis']))
      this.farmerCreate.get("chawkiEndDate").patchValue(_moment(res['chawkiEndDate']));
      if(res['chawkiDateInMillis']) {
        let date = new Date(res['chawkiDateInMillis'])
        let year = date.getFullYear();
        let month = date.getMonth();
        this.minDate = _moment(new Date(year, month, date.getDate()));
      }
      res['rmFarmId'].includes('RMFARM')?
      this.getFarmerById(this.farmerId):
      this.getChawkiById(res['rmFarmId']?.substring(8));
      this.api.getIotDevicePayment(id).then(devicePaymentFormValue=> {
        this.devicePaymentForm.patchValue(devicePaymentFormValue);
        this.termsAndConditions=devicePaymentFormValue['termsAndConditions'];
      })
   });
   }

  getAvailableDevice(){
    this.ngxLoader.stop();
    this.api.getAvailableDevice().then((res:AvailableDevice[])=>{
      this.availableDevice=res  ;
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.watchPosition();
      },
        (error) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  watchPosition(){
    let id = navigator.geolocation.watchPosition((position) =>{
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          if(position.coords.latitude === this.latitude){
            navigator.geolocation.clearWatch(id);
          }
          this.address.get('longitude').patchValue(this.longitude)
          this.address.get('latitude').patchValue(this.latitude)    
                
    }, (error) =>{console.log(error)},
    {
      enableHighAccuracy : true,
      timeout: 5000,
      maximumAge: 0
    }
    )
  }

  async farmerParams(){
// New Farmer Create

    this.farmerCreateForm = this.form.group({
      name: new UntypedFormControl('', Validators.required),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
      center: new UntypedFormControl('',[Validators.required]),
      cocoonType: new UntypedFormControl('',[Validators.required]),
      bankDetails: new UntypedFormArray([]),
    });
    (this.farmerCreateForm.controls['bankDetails'] as UntypedFormArray).push(new UntypedFormGroup({
      beneficiaryName: new UntypedFormControl(''),
      bankName: new UntypedFormControl(''),
      accountNumber: new UntypedFormControl(''),
       ifscCode: new UntypedFormControl(''),
   })); 
  }

  createForm(){
    this.deviceCreateForm = this.form.group({
      serialNumber: new UntypedFormControl(''),
      type: new UntypedFormControl('',[Validators.required]),
      des: new UntypedFormControl('',[Validators.required]),
      agroName: new UntypedFormControl(''),
      agroPhone: new UntypedFormControl('', [Validators.required]),
    });

    this.address = this.form.group({
      address: new UntypedFormControl('',[Validators.required]),
        village: new UntypedFormControl(''),
        district: new UntypedFormControl(''),
        city:new UntypedFormControl(''),
        pincode: new UntypedFormControl(''),
        taluk: new UntypedFormControl(''),
        state: new UntypedFormControl(''),
        region: new UntypedFormControl(''),
        latitude: new UntypedFormControl(''),
        longitude: new UntypedFormControl(''),
    });

    this.settingDeatils = this.form.group({
      temperature:new UntypedFormArray([new UntypedFormGroup({
        min:new UntypedFormControl('',[Validators.required]),
        max:new UntypedFormControl('',[Validators.required])
      })]),
      humidity:new UntypedFormArray([new UntypedFormGroup({
          min:new UntypedFormControl('',[Validators.required]),
          max:new UntypedFormControl('',[Validators.required])
      })]),
      airQuality:new UntypedFormArray([new UntypedFormGroup({
          min:new UntypedFormControl('',[Validators.required]),
          max:new UntypedFormControl('',[Validators.required])
      })]),
      light:new UntypedFormArray([new UntypedFormGroup({
          min:new UntypedFormControl('',[Validators.required]),
          max:new UntypedFormControl('',[Validators.required])
      })]),
    });

    this.farmerCreate = this.form.group({
      name: new UntypedFormControl('',[Validators.required]),
      phoneNumber:new UntypedFormControl('',[Validators.required]),
      displayFarmer:new UntypedFormControl(''),
      chaakiDate:new UntypedFormControl(''),
      chawkiEndDate:new UntypedFormControl(''),
      additionalPhoneNumber:new UntypedFormControl('',[Validators.pattern('[1-9]{1}[0-9]{9}')]),
      code:new UntypedFormControl('',[Validators.required]),
    });
    
    this.devicePaymentForm = this.form.group({
      price: new UntypedFormControl(0, [Validators.required]),
      inState:new UntypedFormControl('inState'),
      cgst:new UntypedFormControl(0),
      sgst:new UntypedFormControl(0),
      igst:new UntypedFormControl(0),
      depositAmount:new UntypedFormControl(0,[Validators.required]),
      totalAmount:new UntypedFormControl(0,),
      termsAndConditions: new UntypedFormControl(''),
      tenure: new UntypedFormControl(0)
    })
  }

  @ViewChild('updateFarmerName') updateFarmerName: ElementRef;
  @ViewChild('updateChawkiNameContent') updateChawkiNameContent: ElementRef;
  async onFarmerSelection() {
    if(this.selectedFarmer) {
      if (this.selectedFarmer?.includes('RMFARM')) {
        this.getFarmerById(this.selectedFarmer?.substring(6))
     }else{
       // RMCHAWKI
       this.getChawkiById(this.selectedFarmer?.substring(8))
     }
    }
    
  }

  captureChangeForBill() {
    let total = 0;
    let cgst = 0;
    let price = this.devicePaymentForm.get('price').value;
    cgst = Math.round(((9/ 100) * price + Number.EPSILON)*100)/100;
    if(this.devicePaymentForm.get('inState').value == 'inState') {
      this.devicePaymentForm.get('cgst').patchValue(cgst);
      this.devicePaymentForm.get('sgst').patchValue(cgst);
      this.devicePaymentForm.get('igst').patchValue(0);
    } else {
      this.devicePaymentForm.get('cgst').patchValue(0);
      this.devicePaymentForm.get('sgst').patchValue(0);
      this.devicePaymentForm.get('igst').patchValue(2*cgst);
    }
    total = Math.round(((price + (2*cgst)) + Number.EPSILON)*100)/100;
    this.devicePaymentForm.get('totalAmount').patchValue(total);
    if(this.devicePaymentForm.get('totalAmount').value > 0 && (this.devicePaymentForm.get('totalAmount').value == this.devicePaymentForm.get('depositAmount').value)) {
      this.devicePaymentForm.get('tenure').patchValue(0);
    }
    this._cd.detectChanges();
  }

  onDeviceSelection(){
    this.availableDevice.forEach(ele=>{
      if(this.selectedDevice==ele.id){
        this.deviceCreateForm.get('type').patchValue(ele.id);
        this.deviceCreateForm.get('des').patchValue(ele.description);
      }
    });
  }

  clearDeviceForm(){
    this.deviceCreateForm.get('type').patchValue('');
    this.deviceCreateForm.get('des').patchValue('');
  }

  agronomistList = [];
  getAgronomistList(){
    this.api.getAllUsersList('Agronomist').then(res=>{
      this.agronomistList = res['_embedded']['user']
      
    })
  }
  getFarmersList(event) {
    let filterList=['Farmer','Chawki']
    if(event.term.length % 2 == 0) {
      this.api.searchAll(event.term).then((res:any) => {
        this.farmerList = res.filter(data=>filterList.includes(data.type)&& !(data?.phone.includes('__DELETED')) );
        this._cd.detectChanges();
      })
    }
    if( !event.term || event.term.length == 0) {
      this.farmerList = [];
      this._cd.detectChanges();
    }
  }

  getChawkiById(id){
    this.isFarmer = false;
    this.api.getChawkiById(id).then((response:any)=>{
      console.log(response);
      this.address.reset();
      this.farmerCreate.get("name").patchValue(response['name'])
      this.farmerCreate.get("phoneNumber").patchValue(response['phone'])
      // this.farmerCreate.get("chaakiDate").patchValue(_moment(response['farmer']['chaakiDate']))
      this.farmerCreate.get("code").patchValue(response['code']);
      response?.address&&this.address.patchValue(response?.address);
      this._cd.detectChanges();

      if(response['name'] == ""){            
        this.modalRef = this.modalService.open(this.updateChawkiNameContent)
          this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed`;
          });
      }

    })
  }
isFarmer = true;
  getFarmerById(id){
    this.isFarmer = true;
    this.ngxLoader.stop();
    this.api.getFarmerById(id).then((response:any) => {
      this.farmerDetails = response['farmer'];
      this.farmerCreate.get('additionalPhoneNumber').patchValue(response?.farmer?.['alternatePhone'])
      if (response) {
        this.address.reset();
        this.farmerCreate.get("name").patchValue(response['farmer']['name'])
        this.farmerCreate.get("phoneNumber").patchValue(response['farmer']['phone'])
        this.farmerCreate.get("chaakiDate").patchValue(_moment(response['farmer']['chaakiDate']))
        //this.farmerCreate.get("chawkiEndDate").patchValue(_moment(response['farmer']['chawkiEndDate']))
        this.farmerCreate.get("code").patchValue(response['farmer']['code']);
        this.address.patchValue(response['farmer']['address']);
        //if(response['farmer']&&response['farmer']['address'])
        if(response['farmer']['name'] == ""){            
          this.modalRef = this.modalService.open(this.updateFarmerName)
            this.modalRef.result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
              this.closeResult = `Dismissed`;
            });
        }
      }


      this._cd.detectChanges();
    });
  }

  async open(content) {
    this.modalRef = this.modalService.open(FollowUpComponent,{backdrop: 'static',size: 'md', keyboard: false, centered: true})
    this.modalRef.componentInstance.customerTypeList = [ 'Farmer','Chawki' ]
    this.modalRef.componentInstance.customerType = 'Farmer';
    this.modalRef.componentInstance.resoponeFromFollowUp.subscribe((res) => {
      console.warn(res);
      this.selectedFarmer = res['code'];
      this.farmerList.push(res);
      this.onFarmerSelection()
      this.farmerCreateForm.reset();
    });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  getAllIotDevices(){
    this.ngxLoader.stop();
    let id=new Set();
    let description=new Set();
    this.api.getAllIotDevices().then((res:AllDevices) =>{
      res.data.forEach((device:Device)=>{
           id.add(device.id);
           description.add(device.name)
       });
      this.sensorsList=[...description];
      this.typeList=[...id];
    });
  }

  saveAllTheData(device,address,farmer, devicePaymentForm){
    this.ngxLoader.stop();
    let coordinates= null;
   (this.latitude&&this.longitude&&(coordinates=[this.latitude,this.longitude]));
   let location = null;
   if(coordinates){
      location = {
        coordinates,
        type: "Point"
      }
   }
  if(this.id){
    let param:any={};
    param.chawkiEndDate = Date.parse(this.farmerCreate.get('chawkiEndDate').value);
    let postAttribute:any = {
      agronomist: {
        name: device.agroName,
        phoneNumber: device.agroPhone
    },
    chawkiEndDate: param.chawkiEndDate
    }
    this.farmerCreate.get('additionalPhoneNumber').value&&(param.additionalPhoneNumber=this.farmerCreate.get('additionalPhoneNumber').value);
   let date=new Date(farmer['chaakiDate'] ).toLocaleString(('en-IN'), {year: 'numeric', month: '2-digit',day: '2-digit' });
    this.api.updateAssociatedDeviceById(postAttribute,this.id).then(res=>{
      this.snackBar.open('Device updated successfully', 'Ok', {
        duration: 3000
     });
     if(farmer.code.includes('RMFARM'))
     this.api.updateFarmers({
      name: farmer.name,
      address:{
       address: address.address,
       region:address.region,
       city:address.city,
       district:address.district,
       pincode:address.pincode,
       state:address.state,
       taluk:address.taluk,
       village:address.village,
       location: location
      },
      alternatePhone:param.additionalPhoneNumber ? param.additionalPhoneNumber : null,
      chaakiDate:this.farmerCreate.get('chaakiDate').value
     },farmer.code.substr(6))
     this.router.navigate(['/resha-farms/rearing-iot'])
    })
 }
 if(!this.id){ 
  let additionalPhoneNumber=null;
  let chawkiDate =null;
   if(farmer.code.includes('RMFARM')){
    chawkiDate = Date.parse(farmer.chaakiDate);
   }
  this.farmerCreate.get('additionalPhoneNumber').value&&(additionalPhoneNumber = this.farmerCreate.get('additionalPhoneNumber').value);
   this.api.deviceAssociations({
    deviceId: device.type,
    // deviceId: device.serialNumber,
    // type: device.type,
    deviceDescription: device.des,
    agronomist: {
        name: device.agroName,
        phoneNumber: device.agroPhone
    },
    alternatePhone:additionalPhoneNumber,
    chawkiDate: chawkiDate,
    // farmer: {
        phoneNumber:farmer.phoneNumber,
        farmerName: farmer.name,
        rmFarmId: farmer.code
    // },
    
}).then((res:any)=>{
  // create payment for device 
  let params = {
    deviceId: res.id,
    customerId: farmer.code.includes('RMFARM') ? farmer.code.substr(6) : farmer.code.substr(8),
    customerType: farmer.code.includes('RMFARM') ? 'FARMER' : 'CHAWKI',
    price: devicePaymentForm.price,
    cgst: devicePaymentForm.cgst ? devicePaymentForm.cgst : 0,
    sgst: devicePaymentForm.sgst ? devicePaymentForm.sgst : 0,
    igst: devicePaymentForm.igst ? devicePaymentForm.igst : 0,
    depositAmount: devicePaymentForm.depositAmount ? devicePaymentForm.depositAmount : 0,
    tenure: devicePaymentForm.tenure ? devicePaymentForm.tenure : 0,
    totalAmount: devicePaymentForm.totalAmount ? devicePaymentForm.totalAmount : 0,
    termsAndConditions: this.termsAndConditions,
    deviceName: device.des,
  }
  this.api.iotDevicePayment(params).then(res=> {
    
  })
     this.snackBar.open('Device Created successfully', 'Ok', {
        duration: 3000
     });
    if(farmer.code.includes('RMFARM'))
    this.api.updateFarmers({
       name: farmer.name,
       address:{
        address: address.address,
        region:address.region,
        city:address.city,
        district:address.district,
        pincode:address.pincode,
        state:address.state,
        taluk:address.taluk,
        village:address.village,
        location: location
       },
       alternatePhone:additionalPhoneNumber,
       chaakiDate:this.farmerCreate.get('chaakiDate').value
  },farmer.code.substr(6))
  else
  this.api.updateChawki({address:{
    address: address.address,
    region:address.region,
    city:address.city,
    district:address.district,
    pincode:address.pincode,
    state:address.state,
    taluk:address.taluk,
    village:address.village,
    location: location
   }},farmer.code.substr(8));
     this.router.navigate(['/resha-farms/rearing-iot'])
  });
}
}

  clearFarmerForm(){
    this.farmerCreate.reset();
  }
  async getCenters() {
    this.api.getCentersList().then(details => {
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }

  agronomistChange(){
    this.agronomistList.forEach(ele=>{
      if(this.deviceCreateForm.get('agroPhone').value==ele.phone)
      this.deviceCreateForm.get('agroName').patchValue(ele.name);
    });
  }


  addFarmerName(farmerName){
    const params = {
      name: farmerName.name,
    }
    this.ngxLoader.stop();
    this.api.updateFarmers(params, this.selectedFarmer?.substring(6)).then((res:any) =>{
      this.modalRef.close();
      if(res){
        this.farmerList = [];
        this.selectedFarmer = res['code'];
        let response=res;
        response.type ='Farmer'
        this.farmerList.push(response);
        this.onFarmerSelection()
        this.addFarmerNameForm.reset();
        this.snackBar.open('Updated successfully', 'Ok', {
          duration: 3000
        });
      }
    })
  }


  isControlValid(controlName: string): boolean {
    const control = this.addFarmerNameForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.addFarmerNameForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.addFarmerNameForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.addFarmerNameForm.controls[controlName];
    return control.dirty || control.touched;
  }
  isControlValidChawki(controlName: string): boolean {
    const control = this.addFarmerNameForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidChawki(controlName: string): boolean {
    const control = this.addFarmerNameForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorChawki(validation, controlName): boolean {
    const control = this.addFarmerNameForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedChawki(controlName): boolean {
    const control = this.addFarmerNameForm.controls[controlName];
    return control.dirty || control.touched;
  }

  isControlValidForReeler(controlName: string): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlValidFor(controlName: string): boolean {
    const control = this.farmerCreate.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidFor(controlName: string): boolean {
    const control = this.farmerCreate.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorFor(validation, controlName): boolean {
    const control = this.farmerCreate.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedForReeler(controlName): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.dirty || control.touched;
  }
  createFarmer(farmerForm){
    const params = {
      name: farmerForm.name,
        phone: farmerForm.phone,
        alternatePhone: '',
        farmArea: '',
        chaakiDate: null,
        capacity: '',
        chaakiCenterName: '',
        chaakiCenterPhone: '',
        refferedBy: '',
        farmEquipments: [],
        cocoonType: farmerForm.cocoonType,
        address: {
          address: '',
          city: '',
          taluk: '',
          village: '',
          district: '',
          state: '',
          pincode: '',
          region: ''
        },
        kycPANNumber: '',
        kycAdhaarNumber: '',
        bankDetails: farmerForm.bankDetails,
        
        center: '/center/' + farmerForm.center
    }   
    this.ngxLoader.stop();
    
    this.api.farmersOnboarding(params).then((res:any) => {
      this.modalRef.close();
      if(res){
        this.selectedFarmer = res['code'];
        let response=res;
        response.type ='Farmer'
        this.farmerList.push(response);
        this.onFarmerSelection()
        this.farmerCreateForm.reset();
        this.snackBar.open('Created farmer successfully', 'Ok', {
          duration: 3000
        });
      }
    });
    
  }

  dataFromTextEditor(data){
    this.termsAndConditions=data;
  }

}
export interface AvailableDevice{
  id: String,
  description: String
}