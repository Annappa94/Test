import { ChangeDetectorRef, Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { S3UrlResponse } from 'src/app/model/types/type.model';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-farmer-kyc',
  templateUrl: './farmer-kyc.component.html',
  styleUrls: ['./farmer-kyc.component.scss']
})
export class FarmerKycComponent implements OnInit,OnChanges {
  kycForm:UntypedFormGroup;
  kycCustomerTypes:any = [];
  // selectedCustomerType = 1;
  selectedCustomerType;
  proofs :any={};
  farmarID;
  customerId:any
  editData : any = {};
  currentCustomer;
  microServicesUrls = { pupaebuyer:'pupaesvc',pupaesupplier:'pupaesvc' }
  kycDocList:UntypedFormGroup;
  patchData:any;
  countAPIRequest = 0;
  countAPIResponse = 0;
  selectedIdList:any;
  loadingIndex;
  queryParams:any;
  personaType = 'farmer';
  farmerRes:any;
  tags=new UntypedFormControl([0]);
  selectedCustomerName: any;
  Docs = [];
  emptydocsMsg: any;

  async kycCreationForms() {
    this.kycForm = this.form.group({
      customerType: new UntypedFormControl(''),
    });
  }
  constructor(
    public globalService: GlobalService,
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private ngxLoader : NgxUiLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private form: UntypedFormBuilder,
    ) { 
      this.route.queryParams.subscribe(params =>{
        this.queryParams = params;
      });
      this.farmarID = this.collectIdFromURL();
      console.log(' this.farmarID', this.farmarID);
      this.customerId = this.collectIdFromURL();
      this.personaTypeFromURL();
      this.selectedCustomerType = this.route.snapshot.paramMap.get("customerType");
      this.getfarmerdataById();
    }

  collectIdFromURL(){
   return this.route.snapshot.paramMap.get("id");
  }

  personaTypeFromURL(){
    this.currentCustomer = this.route.snapshot.paramMap.get("parsonaType");  
    return this.currentCustomer;
  }

  ngOnInit(): void {
    this.kycCreationForms();
    this.getAllCustomerTypes();
    //this.getAllFarmerKycDocList(this.farmarID);
  }

  getfarmerdataById(){
    this.api.getFarmerById(this.farmarID).then(res => {
      this.farmerRes = res['farmer'];      
      this.selectedCustomerName = this.farmerRes?.name;      
    })
  }
  updateFarmerName(){
    const params = {
      name: this.farmerRes?.name,
      phone:this.farmerRes?.phone,
    }
    this.api.updateFarmers(params,this.farmarID).then((res:any) => {
      if (res) {
        // Success Message
        // this.router.navigate(['/farmers-silk']);
        // this.snackBar.open('Updated Farmer successfully', 'Ok', {
        //   duration: 3000
        // });

      } else {
        this.snackBar.open('Failed to update farmer', 'Ok', {
          duration: 3000
        });
      }
    });
  }

  getAllCustomerTypes(){
    this.api.getAllCustomerTypes().then(res => {
      this.kycCustomerTypes = res['_embedded']['kyccustomer'];
      const kycCustomer = this.kycCustomerTypes.find(customer=>customer.name==this.selectedCustomerType)
      this.onSelectOfCustomerType(kycCustomer.id);
      this._cd.detectChanges();
    });
  }

  onSelectOfCustomerType(item) {
    this.api.getAllDocumentsListByCustomerTypes(item, this.currentCustomer.toUpperCase()).then(res => {
      this.ngxLoader.stop();
      this.getAllFarmerKycDocList(this.farmarID);
      this.proofs = { ...res };
      //console.log(this.proofs);
      this._cd.detectChanges();
    })
  }

  saveData(form){
    //console.log(form);
     this.Docs = [];
    for (var key in  form) {
        form[key].forEach(element => {
          let reqObj = {
              "farmer": {
                  "id": null
              },
              "verified": element.verified,
              "kycDocument": {
                  "id": element.doc?.id
              },
              "kycNumber": element.name,
              "items": []
          }
          element.images.forEach(img => {
            reqObj.items.push({
              "tag": img.tag,
              "url": img.imageUrl
            })
          });
          if(element.editId){
            reqObj['id'] = element.id;
            reqObj['createdBy']= element?.createdBy,
            reqObj['createdDate']= element?.createdDate,
            reqObj['kycEntityNameMatch']= element?.kycEntityNameMatch,
            reqObj['kycNumberMatch']=element?.kycNumberMatch,
            reqObj['result']=element?.result,
            reqObj['verificationDate']= element?.verificationDate
            this.Docs.push(reqObj);
          }else{
            this.Docs.push(reqObj);
          }
        });
    }
 
    if (this.Docs.length == 0) {
      this.emptydocsMsg = "Kindly Select Atleast One Proof";
      setTimeout (() => {
        this.emptydocsMsg = "";
        this._cd.detectChanges();
      }, 2000);
    } else{
      let newPayload = {
        farmerId: parseInt(this.farmarID),
        farmerKYCAudits: this.Docs
      }
      this.api.apiSaveFarmerKyc(newPayload).then(ures => {
        if(this.queryParams && this.queryParams?.redirecto && this.queryParams?.redirecto == 'cocoon-lot-crud'){
          this.router.navigate(['/resha-farms/cocoon-lot/crud'],{queryParams:{selectedFarmerId:this.farmarID}});
        }else{
          this.router.navigate(['/resha-farms/farmers-silk']);
        }
        this.updateFarmerName();
      })
    }
   

    
  }

  saveInfo(data){
    const { id ,images, name,editId,doc,verificationType} = data.data;
    let tempImage=[];

    images.filter(ele=>{
      let obj = {};
      obj['url'] = ele.imageUrl
      obj['tag'] = ele.tag
      tempImage.push(obj)
    });
   let kycDocument ;
   if(editId)
    kycDocument = `/kycdocument/${doc.id}`;
   else
    kycDocument = `/kycdocument/${id}`;

 
    let payload = {
      "verified":data.data.verificationType!=='SYSTEM'?true:false,
      "kycDocument":kycDocument,
      "kycNumber":name,
      "items":tempImage,
      "verificationType":verificationType,
    }
    payload[this.currentCustomer]=`/${this.currentCustomer}/${this.farmarID}`;

   if(!editId) 
   this.createFarmerKYC(payload,id,data['key'],data['index']);
   else
   this.updateFarmerKYC(payload,editId)
  }

  patchingData;
  createFarmerKYC(payload,id,key,index){
    payload['pupaeSupplier'] = payload['pupaesupplier'];
    payload['pupaeBuyer'] = payload['pupaebuyer'];
    let endPoint = this.currentCustomer;
    this.microServicesUrls[this.currentCustomer] &&( endPoint= this.microServicesUrls[this.currentCustomer] + '/'+ this.currentCustomer);
    this.ngxLoader.stop()
    this.api.createFarmerKYC(payload, endPoint).then(data=>{
      this.patchingData = {}
      this.patchingData['id'] = data['id'];
      this.patchingData['doc'] = data['document'];
      this.patchingData['key'] = key;
      this.patchingData['index'] = index;

      this.verifyKYC(payload,this.farmarID);
      this.snackBar.open('KYC Details Uploaded Succesfully', 'Ok', {
        duration: 3000
      });
    }).catch(err=>{
      console.log(err.error);
    });
  }

  sortOrder:any = (a: any, b: any): number => {
      const sortArray = [ 'csb_proof','identity_proof','address_proof','bank_proof'];
      return sortArray.indexOf(a['key']) - sortArray.indexOf(b['key']);
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

  constructDocFormObject(object){
    let form:UntypedFormGroup;
    let record = object?.attributes?.find(ele=>ele.fieldType=='STRING');
    let validator = [Validators.required];
    if(record)
      validator = [Validators.required,Validators.minLength(record.min),Validators.maxLength(record.max)];
    form = new UntypedFormGroup({
      name: new UntypedFormControl('',validator),
      verificationType: new UntypedFormControl('MANUAL',[Validators.required]),
      placeholder:new UntypedFormControl(object.name),
      description:new UntypedFormControl(object.description),
      verified: new UntypedFormControl('',[Validators.required] ),
      min:new UntypedFormControl(record?.min),
      max:new UntypedFormControl(record?.max),
      id: new UntypedFormControl(object.id),
      editId: new UntypedFormControl(false),
      images: new UntypedFormArray([]),
      doc: new UntypedFormControl(object),
      
    });
    for(let i=0;i<object?.attributes.length;i++){
      //console.log(object?.attributes);
      if(object?.attributes[i]?.fieldType=='DOC'){
        if(object?.attributes[i]?.mandatory){
          (form.get("images") as UntypedFormArray).push(new UntypedFormGroup({
            imageUrl:new UntypedFormControl('',[Validators.required]),
            tag:new UntypedFormControl(object?.attributes[i]?.fieldName,[Validators.required]),
            edit:new UntypedFormControl(true)
           }));
        }else{
          (form.get("images") as UntypedFormArray).push(new UntypedFormGroup({
            imageUrl:new UntypedFormControl(''),
            tag:new UntypedFormControl(object?.attributes[i]?.fieldName),
            edit:new UntypedFormControl(true)
           }));
        }
        
      }
      
    }

    if(!!!object?.attributes.find(ele=>ele.fieldType=='DOC')){
      (form.get("images") as UntypedFormArray).push(new UntypedFormGroup({
        imageUrl:new UntypedFormControl('',[Validators.required]),
        tag:new UntypedFormControl('',[Validators.required]),
       }));
    }

    return form;
  }


  updateFarmerKYC(payload,id){
    this.ngxLoader.stop();
    let endPoint = this.currentCustomer;
    this.microServicesUrls[this.currentCustomer] &&( endPoint= this.microServicesUrls[this.currentCustomer] + '/'+ this.currentCustomer);
    this.api.updateFarmerKYC(payload,id, endPoint).then(data=>{
      this.verifyKYC(payload,this.farmarID);
      this.snackBar.open('KYC Details Updated Succesfully', 'Ok', {
        duration: 3000
      });
    }).catch(err=>{
    });
  }

  getAllFarmerKycDocList(farmarID){
    this.ngxLoader.stop();
    let endPoint = this.currentCustomer;
    this.microServicesUrls[this.currentCustomer] &&( endPoint= this.microServicesUrls[this.currentCustomer] + '/'+ this.currentCustomer);
    this.api.getAllFarmerKycDocList(farmarID, endPoint).then(data=>{
      let obj = {};
      //console.log(data);
      data['_embedded'][`${this.currentCustomer}kyc`].filter(ele=>{
        if(obj[ele?.document?.type1]){
          obj[ele?.document?.type1].push({
            name:ele?.document?.name,
            description:ele?.document?.description,
            id:ele?.id,
            "kycNumber": ele?.kycNumber,
            verified:ele?.verified,
            items:ele.items,
            document:ele?.document,
            verificationType:ele?.verificationType,
            createdBy: ele?.createdBy,
            createdDate: ele?.createdDate,
            kycEntityNameMatch: ele?.kycEntityNameMatch,
            kycNumberMatch:ele?.kycNumberMatch,
            result:ele?.result,
            verificationDate: ele?.verificationDate
          })
        }else{
          obj[ele?.document?.type1]=[{
            name:ele?.document?.name,
            description:ele?.document?.description,
            id:ele?.id,
            document:ele?.document,
            "kycNumber": ele?.kycNumber,
            verified:ele?.verified,
            items:ele.items,
            verificationType:ele.verificationType,
            createdBy: ele?.createdBy,
            createdDate: ele?.createdDate,
            kycEntityNameMatch: ele?.kycEntityNameMatch,
            kycNumberMatch:ele?.kycNumberMatch,
            result:ele?.result,
            verificationDate: ele?.verificationDate
          }]
        }

        // if(ele?.document?.type2)
        // if(obj[ele?.document?.type2]){
        //   obj[ele?.document?.type2].push({
        //     name:ele?.document?.name,
        //     description:ele?.document?.description,
        //     id:ele?.id,
        //     "kycNumber": ele?.kycNumber,
        //     items:ele.items,
        //     document:ele?.document,
        //     verificationType:ele?.verificationType,
        //     createdBy: ele?.createdBy,
        //     createdDate: ele?.createdDate,
        //     kycEntityNameMatch: ele?.kycEntityNameMatch,
        //     kycNumberMatch:ele?.kycNumberMatch,
        //     result:ele?.result,
        //     verificationDate: ele?.verificationDate
        //   })
        // }else{
        //   obj[ele?.document?.type2]=[{
        //     name:ele?.document?.name,
        //     description:ele?.document?.description,
        //     id:ele?.id,
        //     document:ele?.document,
        //     "kycNumber": ele?.kycNumber,
        //     items:ele.items,
        //     verificationType:ele.verificationType,
        //     createdBy: ele?.createdBy,
        //     createdDate: ele?.createdDate,
        //     kycEntityNameMatch: ele?.kycEntityNameMatch,
        //     kycNumberMatch:ele?.kycNumberMatch,
        //     result:ele?.result,
        //     verificationDate: ele?.verificationDate
        //   }]
        // }

      });
      this.editData = obj;
      //console.log(this.editData);
      this.updateForm();
     // this.kycDocList= this.form.group({})
      this._cd.detectChanges()

    }).catch(err=>{

    });
  }

  ngOnChanges(changes: SimpleChanges): void { 
    this.updateForm();
  }

  updateForm(){
    if(!this.patchData){
      this.kycDocList= this.form.group({});
      //console.log(this.proofs)
      for (let key in this.proofs){

        console.log('key', key);

        this.kycDocList.addControl(key,new UntypedFormArray([]));
      }
      this.patchEditData(this.editData);
    }
    if(this.patchData){
      this.kycDocList.controls[this.patchData.key]['controls'][this.patchData.index].get("editId").patchValue(this.patchData.id)
      this.kycDocList.controls[this.patchData.key]['controls'][this.patchData.index].get("doc").patchValue(this.patchData.doc)
      // this.kycDocList.controls[this.patchData.index].get('id').patchValue(this.patchData.id)
    }
  }

  verifyKYC(payload,id){

    this.api.verifyKYC(payload,id, this.currentCustomer).then(re=>{
      if(re){
        let param = {
          kycVerified: re['data']
        }
        this.api.updateCustomers(param, id, this.currentCustomer).then(res=> {

        })
      }
    })
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
        placeholder:new UntypedFormControl(data[key][i]?.name, [Validators.required]),
        editId: new UntypedFormControl(data[key][i]?.id),
        description:new UntypedFormControl(data[key][i]?.description),
        id: new UntypedFormControl(data[key][i]?.id),
        images: new UntypedFormArray([]),
        doc:new UntypedFormControl(data[key][i].document),
        verificationType:new UntypedFormControl(data[key][i].verificationType,[Validators.required]),
        verified: new UntypedFormControl('',[Validators.required]),
        createdBy: new UntypedFormControl(data[key][i].createdBy),
        createdDate: new UntypedFormControl(data[key][i].createdDate),
        kycEntityNameMatch: new UntypedFormControl(data[key][i].kycEntityNameMatch),
        kycNumberMatch:new UntypedFormControl(data[key][i].kycNumberMatch),
        result:new UntypedFormControl(data[key][i].result),
        verificationDate: new UntypedFormControl(data[key][i].verificationDate)
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
       //console.log(this.kycDocList.controls);

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

goBack() {
  if(this.queryParams && this.queryParams?.redirecto && this.queryParams?.redirecto == 'cocoon-lot-crud'){
    this.router.navigate(['/resha-farms/cocoon-lot/crud']);
  }else{
    this.router.navigate(['/resha-farms/farmers-silk']);
  }
  // if(this.route.url?.includes('cotton')){
  //   this.route.navigate(['/cotton-farmers']);
  // }else{
  //   this.route.navigate(['/farmers']);
  // }
}


}
