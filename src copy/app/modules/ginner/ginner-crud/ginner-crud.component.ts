import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { BankFormComponent } from 'src/app/modules/shared/bank-form/bank-form.component';
import { AddressPincodeFormComponent } from 'src/app/modules/shared/address-pincode-form/address-pincode-form.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ginner-crud',
  templateUrl: './ginner-crud.component.html',
  styleUrls: ['./ginner-crud.component.scss']
})
export class GinnerCrudComponent implements OnInit {
  @ViewChild(AddressPincodeFormComponent,) addressForm : AddressPincodeFormComponent;
  @ViewChild(BankFormComponent,) bankForm : BankFormComponent;
  id:number;

  formGroup:UntypedFormGroup = new UntypedFormGroup({
    name:new UntypedFormControl([],[Validators.required,CustomValidator.cannotContainOnlySpace, Validators.pattern("^[A-Za-z ]+$")]),
    phone:new UntypedFormControl([],[Validators.required,Validators.pattern('[1-9]{1}[0-9]{9}')]),
    productionCapacityBalesPerDay:new UntypedFormControl(),
    ginningLicenseNumber:new UntypedFormControl(),
    landSize:new UntypedFormControl(),
    gstNumber: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace, Validators.pattern("^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$")]),
    ginningCertificate:new UntypedFormControl(),
    kycPANNumber:new UntypedFormControl(),
    kycAdhaarNumber:new UntypedFormControl(),
    // address: new FormGroup({
    //   address:new FormControl(),
    //   city: new FormControl(),
    //   taluk: new FormControl(),
    //   village: new FormControl(),
    //   district: new FormControl(),
    //   state: new FormControl(),
    //   pincode: new FormControl(),
    //   region: new FormControl(),
    //   latitude:new FormControl(),
    //   longitude:new FormControl()
    // }),
    center:new UntypedFormControl(),
    refferedBy:new UntypedFormControl(),
    customerType:new UntypedFormControl('',[Validators.required]),
    
    // bankDetails:new FormArray([new FormGroup({
    //   beneficiaryName: new FormControl(''),
    //   bankName: new FormControl(''),
    //   accountNumber: new FormControl(''),
    //   ifscCode: new FormControl(''),
    // })]),
    cottonTypes:new UntypedFormControl(),
    gstnLegalName:new UntypedFormControl(''),
    principalPlaceBusiness: new UntypedFormControl(''),
    additionalPlaceBusiness: new UntypedFormControl(''),
    jurisdictionState: new UntypedFormControl(''),
    businessConstitution: new UntypedFormControl(''),
    dateRegisterd: new UntypedFormControl(''),
    taxpayerType: new UntypedFormControl(''),
    gstinstatus: new UntypedFormControl(''),
    cancelationDate: new UntypedFormControl(''),
    lastVerified: new UntypedFormControl(''),
    email: new UntypedFormControl(''),

})

  cottonTypes:any[] = ['BTCOTTON','DCHCOTTON']
  res: any;

  selectedCustomerType: any;
  verified: any;
  queryParams: any;
  constructor(private api:ApiService,
    private ngxLoader:NgxUiLoaderService,
    private _cd:ChangeDetectorRef,
    private snackBar:MatSnackBar,
    private router:Router,
    private utils: UtilsService,
    private toaster:ToastrService,
    private route:ActivatedRoute) {
      this.route.queryParams.subscribe(params =>{
        this.queryParams = params;
      });
     }

  ngOnInit(): void {
    this.verified = false;
    this.getCenters();
    this.getAllCustomerTypes();
    const { id } = this.route.snapshot.params;
    this.id = id;
    this.id&&this.getGinnerDetailsById();
    this.watchPosition();
    
  }

  goBack() {
    this.router.navigate(['/resha-farms/ginners']);
  }

  saveGinnerDetails(value:any){
    console.log(value)
    if(this.id){
      if(!this.verified && this.queryParams && this.queryParams?.redirecto && this.queryParams?.redirecto == 'ginner-crud'){
        this.toaster.error('Please Verify Bank Details', 'Bank Verification', {
          timeOut: 5000
        });
      } else {
        this.updateGinner(this.buildPayload(value));
      }
    }else{
      this.savePost(this.buildPayload(value));
    }

  }

  buildPayload(data){
    const bank = {
      accountNumber: this.bankForm.bankForm.value.accountNumber.trim(),
      beneficiaryName: this.bankForm.bankForm.value.beneficiaryName,
      ifscCode: this.bankForm.bankForm.value.ifscCode.trim(),
      bankName: this.bankForm.bankForm.value.bankName,
      branchName: this.bankForm.bankForm.value.branchName,
      verified:this.verified,
    }
    let payload = {...data,
      bankDetails : [bank],
      address: {
        address: this.addressForm.addressForm.value.address,
        village: this.addressForm.addressForm.value.village,
        city: this.addressForm.addressForm.value.city,
        district: this.addressForm.addressForm.value.district,
        taluk: this.addressForm.addressForm.value.taluk,
        region: this.addressForm.addressForm.value.region,
        state: this.addressForm.addressForm.value.state,
        pincode: this.addressForm.addressForm.value.pincode,
        latitude: this.addressForm.addressForm.value.latitude,
        longitude: this.addressForm.addressForm.value.longitude,
      },
    
    
    };
    // payload['center'] = payload['center'];
    payload['customerType'] = '/customerType/'+payload['customerType'];
    //delete payload['customerType'];
    return payload;
  }

  onBankStatuschange(eventData){
    this.verified = eventData;
  }

  getGinnerDetailsById(){
    this.api.getGinnerDetailsById(this.id).then((response:any)=>{
      console.log(response);
      
       if(response['customerTypeName']){
        const kycCustType = this.kycCustomerTypes.find(ele=>ele.name == response['customerTypeName'])
         this.formGroup.get('customerType').patchValue(kycCustType?.id);;
       }
       this.addressForm.addressForm.patchValue(response['address']);
       this.bankForm.bankForm.patchValue(response['bankDetails'][0])
       this.verified = response['bankDetails'][0] ? response['bankDetails'][0].verified: false;

      this.formGroup.get('name').patchValue(response['name'])
      this.formGroup.get('phone').patchValue(response['phone'])
      this.formGroup.get('gstNumber').patchValue(response['gstNumber'])
      this.formGroup.get('landSize').patchValue(response['landSize'])
      this.formGroup.get('productionCapacityBalesPerDay').patchValue(response['productionCapacityBalesPerDay'])
      this.formGroup.get('ginningLicenseNumber').patchValue(response['ginningLicenseNumber'])
      this.formGroup.get('cottonTypes').patchValue(response['cottonTypes'])
      this.formGroup.get('gstnLegalName')?.patchValue(response['gstNumberProfileDetails'][0]['gstnLegalName'])
      this.formGroup.get('email')?.patchValue(response['gstNumberProfileDetails'][0]['gstnEmail'])
      this.formGroup.get('principalPlaceBusiness')?.patchValue(response['gstNumberProfileDetails'][0]['principalPlaceOfBusiness'])
      this.formGroup.get('additionalPlaceBusiness')?.patchValue(response['gstNumberProfileDetails'][0]['additionalPlaceOfBusiness'])
      this.formGroup.get('jurisdictionState')?.patchValue(response['gstNumberProfileDetails'][0]['stateOfJurisdiction'])
      this.formGroup.get('businessConstitution')?.patchValue(response['gstNumberProfileDetails'][0]['businessConstitution'])
      this.formGroup.get('dateRegisterd')?.patchValue(response['gstNumberProfileDetails'][0]['registrationDate'])
      this.formGroup.get('taxpayerType')?.patchValue(response['gstNumberProfileDetails'][0]['taxPayerType'])
      this.formGroup.get('gstinstatus')?.patchValue(response['gstNumberProfileDetails'][0]['gstnStatus'])
      this.formGroup.get('cancelationDate')?.patchValue(response['gstNumberProfileDetails'][0]['cancellationDate'])
      this.formGroup.get('lastVerified')?.patchValue(this.utils.getDisplayTime(response['gstNumberProfileDetails'][0]['lastVerifiedAt']))
      this.formGroup.get('ginningCertificate').patchValue(response['ginningCertificate'])
      this.formGroup.get('baleDetails').get('landSize').patchValue(response['landSize'])
      this.formGroup.get('baleDetails').get('consumptionCapacity').patchValue(response['consumptionCapacity'])
      this.formGroup.get('baleDetails').get('productionCapacity').patchValue(response['productionCapacity'])
      this.formGroup.get('baleDetails').get('yarnType').patchValue(response['yarnTypes'])
      this.formGroup.get('baleDetails').get('cottonType').patchValue(response['cottonBaleType'])
      this.formGroup.get('center').patchValue(response['centerId'])
      
      // this.addressForm.addressForm.patchValue(response['address'])
      // this.bankForm.bankForm.patchValue(response['bankDetails'][0])
      
      // this.addressForm.addressForm.get('city').patchValue(response['address']['city'])
      // this.addressForm.addressForm.get('village').patchValue(response['address']['village'])
      // this.addressForm.addressForm.get('district').patchValue(response['address']['district'])
      // this.addressForm.addressForm.get('pincode').patchValue(response['address']['pincode'])
      // this.addressForm.addressForm.get('state').patchValue(response['address']['state'])
      // this.addressForm.addressForm.get('taluk').patchValue(response['address']['taluk'])
      // this.addressForm.addressForm.get('region').patchValue(response['address']['region'])
      // this.addressForm.addressForm.get('latitude').patchValue(response['address']['latitude'])
      // this.addressForm.addressForm.get('longitude').patchValue(response['address']['longitude'])

      // this.bankForm.bankForm.get('beneficiaryName').patchValue(res['bank']['beneficiaryName'])
      // this.bankForm.bankForm.get('bankName').patchValue(res['bank']['bankName'])
      // this.bankForm.bankForm.get('accountNumber').patchValue(res['bank']['accountNumber'])
      // this.bankForm.bankForm.get('ifscCode').patchValue(res['bank']['ifscCode'])
      // this.bankForm.bankForm.get('branchName').patchValue(res['branchName'])

      this.formGroup.patchValue(response);
       if(response['customerTypeName']){
        //  debugger
        const kycCustType = this.kycCustomerTypes.find(ele=>ele.name == response['customerTypeName'])
         this.formGroup.get('customerType').patchValue(kycCustType?.id);;
       }
      // this.formGroup.get("center").patchValue(res.centerId);
    })
  }

  centerList:any=[];
  async getCenters() {
    this.ngxLoader.stop();
    this.api.getCottonProcCenters().then(details => {
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      this._cd.detectChanges();
    }, err => {
      console.log(err);
    });
  }


  kycCustomerTypes:any = [];
  getAllCustomerTypes(){
    this.api.getAllCustomerTypes().then(res => {
      this.kycCustomerTypes = res['_embedded']['kyccustomer'];
      this._cd.detectChanges();
    });
  }


  savePost(payload){
    this.api.postGinner(payload).then(res=>{
      this.router.navigate(['/resha-farms/ginners']);
      this.snackBar.open('Ginning Created Successfully', 'Ok', {
        duration: 3000
      });
    });
  }

  updateGinner(payload){
    this.api.patchGinner(this.id,payload).then(res=>{
      this.addressForm.addressForm.get('address').patchValue(res['address']['address'])
      this.addressForm.addressForm.get('city').patchValue(res['address']['city'])
      this.addressForm.addressForm.get('village').patchValue(res['address']['village'])
      this.addressForm.addressForm.get('district').patchValue(res['address']['district'])
      this.addressForm.addressForm.get('pincode').patchValue(res['address']['pincode'])
      this.addressForm.addressForm.get('state').patchValue(res['address']['state'])
      this.addressForm.addressForm.get('taluk').patchValue(res['address']['taluk'])
      this.addressForm.addressForm.get('region').patchValue(res['address']['region'])
      this.addressForm.addressForm.get('latitude').patchValue(res['address']['latitude'])
      this.addressForm.addressForm.get('longitude').patchValue(res['address']['longitude'])

      this.bankForm.bankForm.get('beneficiaryName').patchValue(res['beneficiaryName'])
      this.bankForm.bankForm.get('bankName').patchValue(res['bankName'])
      this.bankForm.bankForm.get('accountNumber').patchValue(res['accountNumber'])
      this.bankForm.bankForm.get('ifscCode').patchValue(res['ifscCode'])
      this.bankForm.bankForm.get('branchName').patchValue(res['branchName'])


      this.router.navigate(['/resha-farms/ginners']);
      this.snackBar.open('Ginning Mill Updated Successfully', 'Ok', {
        duration: 3000
      });
    });
  }


  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          console.log("Latitude: " + position.coords.latitude +
            "Longitude: " + position.coords.longitude);
        }
        this.watchPosition();
      },
        (error) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  latitude;
  longitude;
  watchPosition(){
    let id = navigator.geolocation.watchPosition((position) =>{
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          if(position.coords.latitude === this.latitude){
            navigator.geolocation.clearWatch(id);
          }

          // this.formGroup.get('address.latitude').patchValue(this.latitude)
          // this.formGroup.get('address.longitude').patchValue(this.longitude)
          //console.log(this.latitude, this.longitude);

    }, (error) =>{console.log(error)},
    {
      enableHighAccuracy : true,
      timeout: 5000,
      maximumAge: 0
    }
    )
  }



  onImageUpload(image) {
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        let previewImage = reader.result as string;
        this.getS3CatUrl(file.type,file);
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  imageLoading:boolean = false;
  async getS3CatUrl(fileType,file){
    try{
      this.imageLoading = true;
      this._cd.detectChanges()
      await this.api.getKYCPresignedUrl(`kyc_farmer`,fileType.split('/')[1],122,"kyc").then((res:any)=>{
        this.calluploadImageToS3APICate(res.targetUrl,file,res.fileName);
        this.imageLoading = false;
      })
    }catch(err){
      this.formGroup.get('ginningCertificate').patchValue('')
      this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this.imageLoading = false;
      this._cd.detectChanges()
    }
  }

  async calluploadImageToS3APICate(s3url:String,file,fileNameFromS3:String){
    try{
      this.imageLoading = true;
      this._cd.detectChanges()
      await this.api.updateImageToS3Directly(s3url,file).then((res:any)=>{
        this.formGroup.get('ginningCertificate').patchValue(fileNameFromS3)
        this.imageLoading = false;
        this._cd.detectChanges();
        });
    }catch(err){
      this.imageLoading = false;
      this.formGroup.get('ginningCertificate').patchValue('')
        this.snackBar.open('Image upload Failed', 'Ok', {
          duration: 3000
        });
        this._cd.detectChanges()
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

gstVerified(value) {
  const payload = {
    name:this.formGroup.get('name').value,
    phone: this.formGroup.get('phone').value,
    customerType: "/kyccustomer/" + this.formGroup.get('customerType').value,
    gstNumber: this.formGroup.get('gstNumber').value,
    centerId: this.formGroup.get('center').value
  }
  this.ngxLoader.stop();
  this.api.gstVerificationforGinner(payload).then((res: any) => {
    this.snackBar.open('Ginning Mill Created Successfully', 'Ok', {
      duration: 3000
    });
    if (res) {
      this.res = res;
      this.id = this.res['id']
      this.getGinnerDetailsById()
      this.router.navigate([`/resha-farms/ginners/crud`, this.res['id']]);
    }
  })
}

    // Reeler Validations
    isControlValid(controlName: string): boolean {
      const control = this.formGroup.controls[controlName];
      return control.valid && (control.dirty || control.touched);
    }

    isControlInvalid(controlName: string): boolean {
      const control = this.formGroup.controls[controlName];
      return control.invalid && (control.dirty || control.touched);
    }

    controlHasError(validation, controlName): boolean {
      const control = this.formGroup.controls[controlName];
      return control.hasError(validation) && (control.dirty || control.touched);
    }

    isControlTouched(controlName): boolean {
      const control = this.formGroup.controls[controlName];
      return control.dirty || control.touched;
    }

    isControlValidForSpinning(controlName: string): boolean {
      const control = this.formGroup.controls[controlName];
      return control.valid && (control.dirty || control.touched);
    }
  
    isControlInvalidForSpinning(controlName: string): boolean {
      const control = this.formGroup.controls[controlName];
      return control.invalid && (control.dirty || control.touched);
    }
  
    controlHasErrorForSpinning(validation, controlName): boolean {
      const control = this.formGroup.controls[controlName];
      return control.hasError(validation) && (control.dirty || control.touched);
    }
  
    isControlTouchedForSpinning(controlName): boolean {
      const control = this.formGroup.controls[controlName];
      return control.dirty || control.touched;
    }
}
