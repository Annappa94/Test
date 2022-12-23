// import { ThrowStmt } from '@angular/compiler';
import { LogLevel } from '@angular/compiler-cli/private/localize';
import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { CustomValidator } from 'src/app/modules/shared/custom-validator/custom.validator';



@Component({
  selector: 'app-device-type-crud',
  templateUrl: './device-type-crud.component.html',
  styleUrls: ['./device-type-crud.component.scss']
})
export class DeviceTypeCrudComponent implements OnInit {

  specificationList = [];
  dynamicBlock =  [];

  id: any;
  deviceSpecifications:any;
  initialdeviceSpecifications:any;
  selectedDeviceType:any;
  i = 0;
  category: UntypedFormGroup;
  countAPIRequest=0;
  countAPIResponse = 0;
  deviceTypeImages=[];
  deviceTypeDocuments=[];
  dropdownSettings: { singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string; itemsShowLimit: number; enableCheckAll: boolean; allowSearchFilter: boolean; };
  supportedServices: any[];
  selectedServices:any[];
  

  constructor(private api:ApiService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private snackBar:MatSnackBar,
    private fb: UntypedFormBuilder,
    private router:Router,
    private route:ActivatedRoute

    ) { 
      this.initialdeviceSpecifications = "";
      this.deviceTypeImages= [{
        "tag" : "",
        "url" : ""
      }];
      this.deviceTypeDocuments = [{
        "tag" : "",
        "url" : ""
      }]
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 4,
        enableCheckAll: false,
        allowSearchFilter: true
      };
      this.supportedServices = ['MULBERRY', 'REARING']
    }

    onServiceSelect(data){
      console.log(data);
      console.log(this.selectedServices);
      
    }

    onSelectAll(event){
      console.log(event);
    }

  devicetype:UntypedFormGroup = new UntypedFormGroup({
    deviceName:new UntypedFormControl('',[Validators.required,CustomValidator.cannotContainOnlySpace]),
    brand:new UntypedFormControl('', [Validators.required,CustomValidator.cannotContainOnlySpace]),
    manufacturer:new UntypedFormControl('', [Validators.required,CustomValidator.cannotContainOnlySpace]),
    vendor:new UntypedFormControl('', [Validators.required,CustomValidator.cannotContainOnlySpace]),
    businessVertical: new UntypedFormControl('', [Validators.required,CustomValidator.cannotContainOnlySpace]),
    productType:new UntypedFormControl('', [Validators.required,CustomValidator.cannotContainOnlySpace]),
    services:new UntypedFormControl('',[Validators.required]),
    
    // sellingRate:new FormControl('', [Validators.required,CustomValidator.cannotContainOnlySpace]),
    // currency:new FormControl('', [Validators.required,CustomValidator.cannotContainOnlySpace]),
    // purchaseRate:new FormControl('', [Validators.required,CustomValidator.cannotContainOnlySpace]),
    // totalUnits:new FormControl('', [Validators.required,CustomValidator.cannotContainOnlySpace]),
     deviceDocument: new UntypedFormControl(''),
     deviceImage: new UntypedFormControl(''),
     deviceSpecifications:new UntypedFormControl(''),
     model_version: new UntypedFormControl()
    })

    addDynamicBlock() {
      let dynamicBlock = this.devicetype.get('deviceSpecifications') as UntypedFormArray;
      dynamicBlock.push(this.fb.group({key : '', value: '' }));
      this.i++;
    }

    dataFromTextEditor(data){
      this.deviceSpecifications=data;
    }

   
    
    isControlValidForDevicetype(controlName: string): boolean {
      const control = this.devicetype.controls[controlName];
      return control.valid && (control.dirty || control.touched);
    }
    isControlInvalidForDevicetype(controlName: string): boolean {
      const control = this.devicetype.controls[controlName];
      return control.invalid && (control.dirty || control.touched);
    }
    controlHasErrorForDevicetype(validation, controlName): boolean {
      const control = this.devicetype.controls[controlName];
      return control.hasError(validation) && (control.dirty || control.touched);
    }

  isControlTouchedForDevicetype(controlName): boolean {
    const control = this.devicetype.controls[controlName];
    return control.dirty || control.touched;
  }

  saveDeviceType(value:any){

    let payload= {
    "deviceName": value.deviceName,
    "brand": value.brand,
    "manufacturer": value.manufacturer,
    "vendor": value.vendor,
    "model_version": value.model_version,
    "productType" : value.productType,
    "businessVertical":value.businessVertical,
    "deviceSpecifications": this.deviceSpecifications,
    "documents":this.deviceTypeDocuments,
    "images": this.deviceTypeImages,
    "supportedServices": this.devicetype.value.services
    }
    if(this.id ){
      payload['id'] = this.id;
      payload['code'] = this.selectedDeviceType.code;

      this.api.updateDeviceType(this.id, payload).then(res=>{
        this.snackBar.open('Device Type Updated Successfully', 'Ok', {
          duration: 3000
        });
        this.router.navigate(['/resha-farms/device-management/device-type']);
      });
      //this.goBack();      

    }else{
      this.api.createDeviceType(payload).then(res=>{
        this.snackBar.open('Device Type Created Successfully', 'Ok', {
          duration: 3000
        });
        this.router.navigate(['/resha-farms/device-management/device-type']);
      });
      this.devicetype.reset();
      //this.goBack();      

    }
  }

  clear(){
    this.devicetype.reset();
  }

// multiple images upload

async categoryPrameter(){
  this.category = this.fb.group({
    baseList: new UntypedFormArray([]),
    docsList:new UntypedFormArray([]),
  });
}
addCategory(index){
  (this. category.controls['baseList'] as UntypedFormArray).push(new UntypedFormGroup({
    tag:new UntypedFormControl(''),
    url:new UntypedFormControl(''),
  }));
}

deleteCategory(index){
  (this. category.controls['baseList'] as UntypedFormArray).removeAt(index)
}


listenForImageComponent(data){
  const {fileType,file,index} =data;
  this.getS3CatUrl(fileType,file,index);
  this.ngxLoader.stop();
}

async calluploadImageToS3APICate(s3url:String,file,fileNameFromS3:String,index){
 try{
   this.countAPIRequest++;
   this._cd.detectChanges()
   await this.api.updateImageToS3Directly(s3url,file).then(res=>{
     this.deviceTypeImages[index].url = fileNameFromS3;
    //  (this.category.get('baseList') as FormArray).controls[index].get('url').patchValue(fileNameFromS3);

     this.countAPIResponse++;
     this._cd.detectChanges();
     })
 }catch(err){
     this.countAPIResponse++;
     (this.category.get('baseList') as UntypedFormArray).controls[index].get('url').patchValue('');
     this.snackBar.open('Image upload Failed', 'Ok', {
       duration: 3000
     });
     this._cd.detectChanges()
 }
}

async getS3CatUrl(fileType,file,index){
 try{
   this.countAPIRequest++;
   this._cd.detectChanges()
   await this.api.getDeviceTypeImageS3Url(fileType.split('/')[1]).then((res:S3UrlResponse)=>{
     
     this.calluploadImageToS3APICate(res.targetUrl,file,res.fileName,index);
     this.countAPIResponse++;
  })
 }catch(err){
   (this.category.get('baseList') as UntypedFormArray).controls[index].get('url').patchValue('');
   this.snackBar.open('Image upload Failed', 'Ok', {
     duration: 3000
   });
   this.countAPIResponse++;
   this._cd.detectChanges()
 }

}

// documents upload
addDocsCategory(index){
  (this. category.controls['docsList'] as UntypedFormArray).push(new UntypedFormGroup({
    tag:new UntypedFormControl(''),
    url:new UntypedFormControl(''),
  }));
}

deleteDocsCategory(index){
  (this. category.controls['docsList'] as UntypedFormArray).removeAt(index)
}
listenForDocsImageComponent(data){
  const {fileType,file,index} =data;
  this.getDocsS3CatUrl(fileType,file,index);
  this.ngxLoader.stop();
}

async calluploaDocsToS3APICate(s3url:String,file,fileNameFromS3:String,index){
  try{
    this.countAPIRequest++;
    this._cd.detectChanges()
    await this.api.updateImageToS3Directly(s3url,file).then(res=>{
      this.deviceTypeDocuments[index].url = fileNameFromS3;
      //(this.category.get('docsList') as FormArray).controls[index].get('url').patchValue(fileNameFromS3);
 
      this.countAPIResponse++;
      this._cd.detectChanges();
      })
  }catch(err){
      this.countAPIResponse++;
      (this.category.get('docsList') as UntypedFormArray).controls[index].get('url').patchValue('');
      this.snackBar.open('Douments upload Failed', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges()
  }
 }
 
 async getDocsS3CatUrl(fileType,file,index){
  try{
    this.countAPIRequest++;
    this._cd.detectChanges()
    await this.api.getDeviceTypeDocsS3Url(fileType.split('/')[1]).then((res:S3UrlResponse)=>{
      
      this.calluploaDocsToS3APICate(res.targetUrl,file,res.fileName,index);
      this.countAPIResponse++;
   })
  }catch(err){
    (this.category.get('docsList') as UntypedFormArray).controls[index].get('url').patchValue('');
    this.snackBar.open('Document upload Failed', 'Ok', {
      duration: 3000
    });
    this.countAPIResponse++;
    this._cd.detectChanges()
  }
 
 }


ngOnInit(): void {
  const { id } = this.route.snapshot.params;
    this.id = id;
    this.id&&this.getDeviuceTypeDataById();    
    this.categoryPrameter();
    this.addCategory(1);
    this.addDocsCategory(1);
}

getDeviuceTypeDataById(){
  this.api.getDeviceTypesById(this.id).then(res=>{
    this.selectedDeviceType = res;
    this.devicetype.patchValue(res);
    this.devicetype.get('services').patchValue(res['supportedServices'])
    this.selectedServices = res['supportedServices'] ? res['supportedServices'] : [];
    this.initialdeviceSpecifications=this.selectedDeviceType['deviceSpecifications'];
    this.deviceTypeImages=this.selectedDeviceType.images;
    if(!this.deviceTypeImages.length){
      this.deviceTypeImages= [{
        "tag" : "",
        "url" : ""
      }];
    }
   
    this.deviceTypeDocuments=this.selectedDeviceType.documents;
    if(!this.deviceTypeDocuments.length){
      this.deviceTypeDocuments = [{
        "tag" : "",
        "url" : ""
      }]
    }
    
    this._cd.detectChanges();
  })
}

addImages(index){
  this.deviceTypeImages.push({
    "tag":"",
    "url":""
  });
}
removeImages(index){
  this.deviceTypeImages.splice(index , 1);
}

addDocuments(index){
  this.deviceTypeDocuments.push({
    "tag":"",
    "url":""
  });
}
removeDocuments(index){
  this.deviceTypeDocuments.splice(index , 1);
}

goBack(){
  this.router.navigate(['/resha-farms/device-management/device-type'])
}

}

export interface S3UrlResponse{
  targetUrl: String
  fileName:String
}