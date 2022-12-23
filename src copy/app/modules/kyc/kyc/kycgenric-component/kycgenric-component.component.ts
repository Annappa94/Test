import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {  UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { KYC, VerificationType } from 'src/app/constants/enum/kyc.constant';
import { S3UrlResponse } from 'src/app/model/types/type.model';
import { ApiService } from 'src/app/services/api/api.service';
@Component({
  selector: 'app-kycgenric-component',
  templateUrl: './kycgenric-component.component.html',
  styleUrls: ['./kycgenric-component.component.scss']
})
export class KYCGenricComponentComponent implements OnInit,OnChanges {
  countAPIRequest = 0;
  countAPIResponse = 0;
  key;
  selectedIdList=[];
  tags=new UntypedFormControl([0]);
  verificationType:String[] = [...VerificationType]
  @Output()
  info:EventEmitter<any> = new EventEmitter<any>();
  kycDocList:UntypedFormGroup;
  loadingIndex;
  @Input()
  editData = {};

  @Input()
  personaType ='farmer'

  @Input()
  patchData;

  @Input()
  customerId;

  @Input()
  proofs:Object={};

  @Input()
  backBtnRoutePath = false

  KYC = {...KYC};
  constructor(
    private form:UntypedFormBuilder,
    private api:ApiService,
    private _cd:ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private router:Router,
    private modalService: NgbModal,
    private $gaService:GoogleAnalyticsService,
    private _location: Location
    ) { }
  
  sortOrder:any = (a: any, b: any): number => {
      const sortArray = [ 'csb_proof','identity_proof','address_proof','bank_proof'];
      return sortArray.indexOf(a['key']) - sortArray.indexOf(b['key']);
  }

  verify(){
    
  }
  ngOnChanges(changes: SimpleChanges): void { 
    if(!this.patchData){
      this.formInit()
      console.log(this.proofs)
      for (let key in this.proofs){

        console.log('key', key);
        this.kycDocList.addControl(key,new UntypedFormArray([]));
      }
      this.patchEditData(this.editData);
    }
    if(this.patchData){
      console.log("ppppppp",this.patchData)
      this.kycDocList.controls[this.patchData.key]['controls'][this.patchData.index].get("editId").patchValue(this.patchData.id)
      this.kycDocList.controls[this.patchData.key]['controls'][this.patchData.index].get("doc").patchValue(this.patchData.doc)
      // this.kycDocList.controls[this.patchData.index].get('id').patchValue(this.patchData.id)
    }
  }

  onVerificationTypeChange(value, item, index) {
    let arr = this.kycDocList.controls[item.key]['controls'][index].get("images") as UntypedFormArray;
    for(let i=0;i<arr.length;i++) {
        if(value=='NOT_APPLICABLE') {
        this.kycDocList.controls[item.key]['controls'][index].get("images").at(i)['controls']['imageUrl'].clearValidators();
        this.kycDocList.controls[item.key]['controls'][index].get("images").at(i)['controls']['tag'].clearValidators();
        this.kycDocList.controls[item.key]['controls'][index].get("images").at(i)['controls']['imageUrl'].updateValueAndValidity();
        this.kycDocList.controls[item.key]['controls'][index].get("images").at(i)['controls']['tag'].updateValueAndValidity();
    } else {
      this.kycDocList.controls[item.key]['controls'][index].get("images").at(i)['controls']['imageUrl'].setValidators(Validators.required);
      this.kycDocList.controls[item.key]['controls'][index].get("images").at(i)['controls']['tag'].setValidators(Validators.required);
      this.kycDocList.controls[item.key]['controls'][index].get("images").at(i)['controls']['imageUrl'].updateValueAndValidity();
      this.kycDocList.controls[item.key]['controls'][index].get("images").at(i)['controls']['tag'].updateValueAndValidity();
      ;
    }
  }
  this._cd.detectChanges();
  }



  formInit(){
    this.kycDocList= this.form.group({})
  }

  ngOnInit(): void {
  }

  save(data, index,key){
    this.info.emit({data, index, key});
  }

  patchEditData(data){
    this.selectedIdList=[];
    for (let key in data){
      let formb: UntypedFormGroup
      this.selectedIdList.push(data[key]?.id);
     for(let i=0;i<data[key].length;i++){
      let record =data[key][i].document?.attributes.find(ele=>ele.fieldType=='STRING')
      let validator = [Validators.required];
      if(record)
       validator = [Validators.required,Validators.minLength(record?.min),Validators.maxLength(record?.max)];

      formb = new UntypedFormGroup({
        name: new UntypedFormControl(data[key][i].kycNumber,validator),
        placeholder:new UntypedFormControl(data[key][i]?.name),
        editId: new UntypedFormControl(data[key][i]?.id),
        description:new UntypedFormControl(data[key][i]?.description),
        id: new UntypedFormControl(data[key][i]?.id),
        images: new UntypedFormArray([]),
        doc:new UntypedFormControl(data[key][i].document),
        verificationType:new UntypedFormControl(data[key][i].verificationType,[Validators.required])
      });
      let prev = this.tags.value
      this.tags.patchValue([data[key][i]?.document.id,...prev])
      let images = [...data[key][i]?.items];
      for(let j=0;j<images.length;j++){
        (formb.get("images") as UntypedFormArray).push(this.patchAllRequiredImages(images[j],data[key][i]?.document?.attributes, data[key][i].verificationType));
      }

       if (images.length == 0) {
         if (data[key][i].verificationType == 'NOT_APPLICABLE') {
           (formb.get("images") as UntypedFormArray).push(new UntypedFormGroup({
             imageUrl: new UntypedFormControl(''),
             tag: new UntypedFormControl(''),
           }));
         } else {
           (formb.get("images") as UntypedFormArray).push(new UntypedFormGroup({
             imageUrl: new UntypedFormControl('', [Validators.required]),
             tag: new UntypedFormControl('', [Validators.required]),
           }));
         }
       }
       (this.kycDocList.controls[key] as UntypedFormArray)?.push(formb);

     }
     this._cd.detectChanges();
   }
  }

  patchAllRequiredImages(image,attributes, verificationType){
    if(verificationType == 'NOT_APPLICABLE') {
      return new UntypedFormGroup({
        imageUrl:new UntypedFormControl(image.url),
        tag:new UntypedFormControl(image.tag),
        edit:new UntypedFormControl(!!attributes?.find(ele=>ele.fieldName==image.tag))/** To make this record not editable */
      });
    } else {
      return new UntypedFormGroup({
         imageUrl:new UntypedFormControl(image.url,[Validators.required]),
         tag:new UntypedFormControl(image.tag,[Validators.required]),
         edit:new UntypedFormControl(!!attributes?.find(ele=>ele.fieldName==image.tag))/** To make this record not editable */
       });
    }
  }

  addImages(item,index){
    ((this.kycDocList.controls[item.key] as UntypedFormArray).at(index).get('images') as UntypedFormArray).push(
      new UntypedFormGroup({
        imageUrl:new UntypedFormControl('',[Validators.required]),
        tag:new UntypedFormControl('',[Validators.required])
      })
      );
  }

  deleteImages(key,index,imageIndex){
    ((this.kycDocList.controls[key] as UntypedFormArray).at(index).get('images') as UntypedFormArray).removeAt(imageIndex)
  }

  constructDocFormObject(object){
    console.log(object,"object")
    let form:UntypedFormGroup;
    let record = object?.attributes?.find(ele=>ele.fieldType=='STRING');
    let validator = [Validators.required];
    if(record)
      validator = [Validators.required,Validators.minLength(record.min),Validators.maxLength(record.max)];
    form = new UntypedFormGroup({
      name: new UntypedFormControl('',validator),
      verificationType: new UntypedFormControl('',[Validators.required]),
      placeholder:new UntypedFormControl(object.name),
      description:new UntypedFormControl(object.description),
      min:new UntypedFormControl(record?.min),
      max:new UntypedFormControl(record?.max),
      id: new UntypedFormControl(object.id),
      editId: new UntypedFormControl(false),
      images: new UntypedFormArray([]),
      doc: new UntypedFormControl(object)
    });
    for(let i=0;i<object?.attributes.length;i++){
      if(object?.attributes[i]?.fieldType=='DOC')
      (form.get("images") as UntypedFormArray).push(new UntypedFormGroup({
        imageUrl:new UntypedFormControl('',[Validators.required]),
        tag:new UntypedFormControl(object?.attributes[i]?.fieldName,[Validators.required]),
        edit:new UntypedFormControl(true)
       }));
    }

    if(!!!object?.attributes.find(ele=>ele.fieldType=='DOC')){
      (form.get("images") as UntypedFormArray).push(new UntypedFormGroup({
        imageUrl:new UntypedFormControl('',[Validators.required]),
        tag:new UntypedFormControl('',[Validators.required]),
       }));
    }

    return form;
  }

  tempDiselectedArray = [];
  onDocumentSeclect(item,event){
     const findRecord = (this.kycDocList.controls[item.key] as UntypedFormArray).value.find(ele=>{
       if(ele?.doc?.id)
       return ele.doc.id==event.id
       return ele.id==event.id
      });

    if(!findRecord){
      let data = this.tempDiselectedArray.find(ele=>{
        if(ele?.value.doc?.id)
        return ele.value.doc.id==event.id
        return ele.value.id==event.id
       });
       if(data){
        (this.kycDocList.controls[item.key] as UntypedFormArray).push(data);
       }
       else{
        (this.kycDocList.controls[item.key] as UntypedFormArray).push(this.constructDocFormObject(event));
       }
       this._cd.detectChanges();
    }else{
      let index=(this.kycDocList.controls[item.key] as UntypedFormArray).value.findIndex(ele=>{
        if(ele?.doc?.id)
        return ele.doc.id==event.id
       return ele.id==event.id
      });

      this.tempDiselectedArray.push((this.kycDocList.controls[item.key] as UntypedFormArray).at(index));

      (this.kycDocList.controls[item.key] as UntypedFormArray).removeAt(index);
      this._cd.detectChanges();
    }
  }
 
  async calluploadImageToS3APICate(s3url:String,file,fileNameFromS3:String,index,key,imageIndex){
   try{
     this.countAPIRequest++;
     this._cd.detectChanges()
     await this.api.updateImageToS3Directly(s3url,file).then(res=>{
       
       ((this.kycDocList.controls[key] as UntypedFormArray).at(index).get('images') as UntypedFormArray).at(imageIndex).get("imageUrl").patchValue(fileNameFromS3)
       this.countAPIResponse++;
       this._cd.detectChanges();
       });
   }catch(err){
       this.countAPIResponse++;
       ((this.kycDocList.controls[key] as UntypedFormArray).at(index).get('images') as UntypedFormArray).at(imageIndex).get("imageUrl").patchValue('');
       this.snackBar.open('Image upload Failed', 'Ok', {
         duration: 3000
       });
       this._cd.detectChanges()
   }
 }
 
 async getS3CatUrl(fileType,file,index,key,imageIndex){
   try{
     this.countAPIRequest++;
     this._cd.detectChanges()
     await this.api.getKYCPresignedUrl(`kyc_${this.personaType}`,fileType.split('/')[1],this.customerId,key).then((res:S3UrlResponse)=>{
       this.calluploadImageToS3APICate(res.targetUrl,file,res.fileName,index,key,imageIndex);
       this.countAPIResponse++;
    })
   }catch(err){
    ((this.kycDocList.controls[key] as UntypedFormArray).at(index).get('images') as UntypedFormArray).at(imageIndex).get("imageUrl").patchValue('');
     this.snackBar.open('Image upload Failed', 'Ok', {
       duration: 3000
     });
     this.countAPIResponse++;
     this._cd.detectChanges()
   }
 
 }

 onImageUpload(image, index,key,imageIndex) {
  if (image) {
    const file = image.target.files[0];
    const reader = new FileReader();
    this.loadingIndex=index;
    reader.onload = () => {
      let previewImage = reader.result as string;
      this.getS3CatUrl(file.type,file,index,key,imageIndex);
      this._cd.detectChanges();
    };
    reader.readAsDataURL(file);
   }
}

expandImage=false;
modelImageUrl=null;
showImage(imageUrl) {
  if(imageUrl) {
    this.modelImageUrl=null;
    this.getprotectedUrl(imageUrl);
    this.expandImage = true;
  }
}


 async getprotectedUrl(imgUrl){
  const { targetUrl } : any = await this.api.getPresignedUrlForViewImage(imgUrl);
  this.modelImageUrl = targetUrl;
  this._cd.detectChanges()
}

//Input Validator

    isControlValid(key:any,controlName: string,index): boolean {
      const control = this.kycDocList.controls[key]['controls'][index]["controls"][controlName];
      return control.valid && (control.dirty || control.touched);
    }
  
    isControlInvalid(key,controlName: string,index): boolean {
      // const control = this.kycDocList.controls[controlName];
      const control = this.kycDocList.controls[key]['controls'][index]["controls"][controlName]
      return control.invalid && (control.dirty || control.touched);
    }
  
    controlHasError(key,validation, controlName,index): boolean {
      const control = this.kycDocList.controls[key]['controls'][index]["controls"][controlName]
      return control.hasError(validation) && (control.dirty || control.touched);
    }
  
    isControlTouched(key,controlName,index): boolean {
      const control =  this.kycDocList.controls[key]['controls'][index]["controls"][controlName];
      return control.dirty || control.touched;
    }

    confirmPopUp(confirm){
      this.modalService.open(confirm)
    }

    comfirmBack(){

      this.$gaService.event('KYC', 'KYC');
      this._location.back();
      this.modalService.dismissAll();
    }
}
