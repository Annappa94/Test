import { ChangeDetectorRef, Inject, LOCALE_ID, Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';

import { formatDate } from '@angular/common';
import { FormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';


@Component({
  selector: 'app-vehicle-curd',
  templateUrl: './vehicle-curd.component.html',
  styleUrls: ['./vehicle-curd.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class VehicleCurdComponent implements OnInit {

  specificLogisticDetails:any;
  userType:any;
  modalRef;
  closeResult;
  selectCustomerBoolean = false;
  kycCustomerTypes:any = [];
  selectedCustomerType = '';
  id;
  noOfKYCDocs;
  kycFlag = false;
  createDriverForm:UntypedFormGroup;
  createVehicleForm:UntypedFormGroup;
  rowDriverDataList:any[]=[];
  rowVehicleDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  newDriverList:any[]=[];
  newVehicleList:any[]=[];
  singleVehicleData;



  async createFormParams(){
    this.createVehicleForm = this.form.group({
      vehicleType: new UntypedFormControl('', [Validators.required]),
      vehicleNumber: new UntypedFormControl('', [Validators.required]),
      documentName: new UntypedFormControl('RC'),
      rcNumber: new UntypedFormControl(''),
      rcDocUrl: new UntypedFormControl(''),
      rcProvider: new UntypedFormControl(''),

      insurancename:new UntypedFormControl('INSURANCE'),
      insuranceId: new UntypedFormControl(''),
      insuranceUrl: new UntypedFormControl(''),
      insuranceProvider: new UntypedFormControl(''),
      // receiptName
      // receiptNumber
      // url
      // receipt_issuer
    });
  }


  constructor(private api:ApiService,
    private ngxLoader:NgxUiLoaderService,
    private _cd:ChangeDetectorRef,
    private snackBar:MatSnackBar,
    private router:Router,
    private route:ActivatedRoute,
    private modalService: NgbModal,
    private form: UntypedFormBuilder,
    private utils: UtilsService,

    @Inject(LOCALE_ID) private locale: string,


  ) { }

  ngOnInit(): void {
    this.createFormParams();
    const { id } = this.route.snapshot.params;
    this.id = id
    this.id && this.getVehicleDetailsById();
    // this.api.getDriverCompanyData(this.id).then((res:any)=>{
    // })
  }
  // goBack(){
  //   this.router.navigate([`farms-logistics/details/`,this.id]);
  // }

  getVehicleDetailsById(){
    this.api.getSingleVehicleById(this.id).then((res:any)=>{
      this.singleVehicleData = res;
      this.createVehicleForm.get("vehicleType").patchValue(res['vehicleType'])
      this.createVehicleForm.get("vehicleNumber").patchValue(res['vehicleNumber'])
      res.logisticsUrlDetails.forEach((obj, index) => {
        switch(obj.documentName){
          case 'RC':
            this.createVehicleForm.get("rcNumber").patchValue(obj['documentNumber']);
            this.createVehicleForm.get("rcProvider").patchValue(obj['documentProvider']);
          break;
          case 'INSURANCE':
            this.createVehicleForm.get("insuranceId").patchValue(obj['documentNumber']);
            this.createVehicleForm.get("insuranceProvider").patchValue(obj['documentProvider']);
          break;
        }
      })
      // this.createVehicleForm.get("DrivingLienseNumber").patchValue(res['drivingLicense']['drivingLicenseNumber'])
      // this.createVehicleForm.get("nameOnDl").patchValue(res['drivingLicense']['nameOnDrivingLicense'])
      // this.createVehicleForm.get("DlExpiryDate").patchValue(this.utils.getDisplayTime(this.singleVehicleData?.expiryDate))
      // this.createVehicleForm.get("fatherName").patchValue(res['drivingLicense']['fatherName'])

      // this.specificLogisticDetails = res;
      this._cd.detectChanges();
    })
  }

  saveVehicleData(vehicleData){
    let payload = {
      "vehicleType":vehicleData?.vehicleType,
      "vehicleNumber":vehicleData?.vehicleNumber,

      "logisticsUrlDetails": [{
          "documentName": vehicleData?.documentName,
          "documentNumber":vehicleData?.rcNumber,
          "documentUrl": " ",  //rcDocUrl
          "documentProvider":vehicleData?.rcProvider
        },
        {
          "documentName": vehicleData?.insurancename,
          "documentNumber":vehicleData?.insuranceId,
          "documentUrl": " ", //insuranceUrl
          "documentProvider":vehicleData?.insuranceProvider
        }
      ]
    }
    this.updateVehicleDetailsById(payload)
  }
  updateVehicleDetailsById(payload){
    this.api.updateSingleVehicleById(this.id,payload).then((res:any)=>{
      // this.specificLogisticDetails = res;
      this.router.navigate([`farms-logistics/details/`,this.singleVehicleData?.companyId]);
      this.snackBar.open('Vehicle Updated Successfully', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges();
    })
  }

  goBack(){
    this.router.navigate([`farms-logistics/details/`,this.singleVehicleData?.companyId]);
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
      this.createVehicleForm.get('rcDocUrl').patchValue('')
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
        this.createVehicleForm.get('rcDocUrl').patchValue(fileNameFromS3)
        this.imageLoading = false;
        this._cd.detectChanges();
        });
    }catch(err){
      this.imageLoading = false;
      this.createVehicleForm.get('rcDocUrl').patchValue('')
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

  // Vehicle form Validations
  isVehicleFormControlValid(controlName: string): boolean {
    const control = this.createVehicleForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isVehicleFormControlInvalid(controlName: string): boolean {
    const control = this.createVehicleForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  VehicleFormcontrolHasError(validation, controlName): boolean {
    const control = this.createVehicleForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isVehicleFormControlTouched(controlName): boolean {
    const control = this.createVehicleForm.controls[controlName];
    return control.dirty || control.touched;
  }

}
