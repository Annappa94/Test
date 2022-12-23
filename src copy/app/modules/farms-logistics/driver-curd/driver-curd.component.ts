import { ChangeDetectorRef, Inject, LOCALE_ID, Component, OnInit } from '@angular/core';

import { formatDate } from '@angular/common';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';


@Component({
  selector: 'app-driver-curd',
  templateUrl: './driver-curd.component.html',
  styleUrls: ['./driver-curd.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class DriverCurdComponent implements OnInit {
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
  singleDRiverData;
  expiaryDate: Date;



  async createFormParams(){

    this.createDriverForm = this.form.group({
      driverName: new UntypedFormControl('',[Validators.required]),
      driverNumber: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
      nameOnDl:new UntypedFormControl([],[Validators.required,CustomValidator.cannotContainOnlySpace]),
      fatherName:new UntypedFormControl(),
      DrivingLienseNumber:new UntypedFormControl([],[Validators.required]),
      DlIssuedDate:new UntypedFormControl([],[Validators.required]),
      DlExpiryDate:new UntypedFormControl([],[Validators.required]),
      // vehicleNumber: new FormControl('',[Validators.required]),
      beneficiaryName: new UntypedFormControl('',[Validators.required]),
      bankName: new UntypedFormControl('',[Validators.required]),
      accountNumber: new UntypedFormControl('', [Validators.required]),
      ifscCode: new UntypedFormControl('', [Validators.required]),
      address:new UntypedFormControl(),
      city: new UntypedFormControl(),
      taluk: new UntypedFormControl(),
      village: new UntypedFormControl(),
      district: new UntypedFormControl(),
      state: new UntypedFormControl(),
      pincode: new UntypedFormControl(),
      region: new UntypedFormControl(),
      latitude:new UntypedFormControl(),
      longitude:new UntypedFormControl()

    });

    // this.createVehicleForm = this.form.group({
    //   vehicleType: new FormControl('', [Validators.required]),
    //   vehicleNumber: new FormControl('', [Validators.required]),
    //   documentName: new FormControl(''),
    //   rcNumber: new FormControl(''),
    //   rcDocUrl: new FormControl(''),
    //   rcProvider: new FormControl(''),

    //   insurancename:new FormControl('INSURANCE'),
    //   insuranceId: new FormControl(''),
    //   insuranceUrl: new FormControl(''),
    //   insuranceProvider: new FormControl(''),
    //   // receiptName
    //   // receiptNumber
    //   // url
    //   // receipt_issuer
    // });
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
    this.id && this.getDriverDetailsById();
    // this.api.getDriverCompanyData(this.id).then((res:any)=>{
    //   console.log('company',res);
    // })
  }
  changeDateTimeEvent(event: MatDatepickerInputEvent<Date>){
    this.createDriverForm.get('DlExpiryDate').patchValue('')
    let dateChange = new Date(event.value);
    this.expiaryDate= new Date((dateChange).setFullYear(new Date(dateChange).getFullYear() + 5));
  }

  getDriverDetailsById(){
    this.api.getSingleDriverById(this.id).then((res:any)=>{
      this.singleDRiverData = res;
      console.log(this.singleDRiverData);

      this.createDriverForm.get("driverName").patchValue(res['name'])
      this.createDriverForm.get("driverNumber").patchValue(res['mobile'])
      this.createDriverForm.get("DrivingLienseNumber").patchValue(this.singleDRiverData?.drivingLicense?.drivingLicenseNumber)
      this.createDriverForm.get("nameOnDl").patchValue(this.singleDRiverData?.drivingLicense?.nameOnDrivingLicense)
      // this.createDriverForm.get("DlExpiryDate").patchValue(new Date(this.singleDRiverData?.expiryDate))
      this.createDriverForm.get("fatherName").patchValue(this.singleDRiverData?.drivingLicense?.fatherName)

      if(this.singleDRiverData?.drivingLicense?.dateOfIssue) {
        let date;
        date = this.singleDRiverData?.drivingLicense?.dateOfIssue ? formatDate(this.singleDRiverData?.drivingLicense?.dateOfIssue, 'MM-dd-yyyy', this.locale) : ''
        const moment = _moment;
        this.createDriverForm.patchValue({
          DlIssuedDate: moment(date, "MM/DD/YYYY"),
        });
      }

      if(this.singleDRiverData?.drivingLicense?.expiryDate) {
        let date;
        date = this.singleDRiverData?.drivingLicense?.expiryDate ? formatDate(this.singleDRiverData?.drivingLicense?.expiryDate, 'MM-dd-yyyy', this.locale) : ''
        const moment = _moment;
        this.createDriverForm.patchValue({
          DlExpiryDate: moment(date, "MM/DD/YYYY"),
        });
      }

      this.createDriverForm.get("accountNumber").patchValue(this.singleDRiverData?.bankDetails[0]?.accountNumber)
      this.createDriverForm.get("beneficiaryName").patchValue(this.singleDRiverData?.bankDetails[0]?.beneficiaryName)
      this.createDriverForm.get("bankName").patchValue(this.singleDRiverData?.bankDetails[0]?.bankName)
      this.createDriverForm.get("ifscCode").patchValue(this.singleDRiverData?.bankDetails[0]?.ifscCode)

      this.createDriverForm.get("address").patchValue(this.singleDRiverData?.address?.address)
      this.createDriverForm.get("village").patchValue(this.singleDRiverData?.address?.village)
      this.createDriverForm.get("city").patchValue(this.singleDRiverData?.address?.city)
      this.createDriverForm.get("taluk").patchValue(this.singleDRiverData?.address?.taluk)
      this.createDriverForm.get("district").patchValue(this.singleDRiverData?.address?.district)
      this.createDriverForm.get("pincode").patchValue(this.singleDRiverData?.address?.pincode)
      this.createDriverForm.get("region").patchValue(this.singleDRiverData?.address?.region)
      this.createDriverForm.get("state").patchValue(this.singleDRiverData?.address?.state)
      // this.specificLogisticDetails = res;
      this._cd.detectChanges();
    })
  }

  saveDriverData(driverData){
    let payload = {
      "name":driverData?.driverName,
      "mobile":driverData?.driverNumber,
      "referredBy":"sanmi",
      "logisticsPartnerStatus":"ACTIVE",
      "logisticsSettlementTo":"SELF",
      "alternateContactDetails" : [{
        "name":driverData?.alternateContactDetails?.name,
        "alternateMobile":driverData?.alternateContactDetails?.alternateMobile,
        "relationship":driverData?.alternateContactDetails?.relationship
      }],
      "drivingLicense":{
        "drivingLicenseNumber":driverData?.DrivingLienseNumber,
        "nameOnDrivingLicense":driverData?.nameOnDl,
        // "expiryDate":driverData?.DlIssuedDate,
        "expiryDate":driverData?.DlExpiryDate,
        "fatherName":driverData?.fatherName
      },
      "address": {
        "address": driverData?.address,
        "city": driverData?.city,
        "taluk": driverData?.taluk,
        "village": driverData?.village,
        "district": driverData?.district,
        "state": driverData?.state,
        "pincode": driverData?.pincode,
        "region": driverData?.region,
        "latitude": null,
        "longitude": null
      },
      "bankDetails": [{
        "beneficiaryName": driverData?.beneficiaryName,
        "bankName": driverData?.bankName,
        "accountNumber": driverData?.accountNumber,
        "ifscCode": driverData?.ifscCode
      }],
    }
    this.updateDriverDetailsById(payload)
  }
  updateDriverDetailsById(payload){
    this.api.updateSingleDriverById(this.id,payload).then((res:any)=>{
      // this.specificLogisticDetails = res;
      this.router.navigate([`farms-logistics/details/`,this.singleDRiverData?.companyId]);

      this.snackBar.open('Driver Updated Successfully', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges();
    })
  }

  goBack(){
    this.router.navigate([`farms-logistics/details/`,this.singleDRiverData?.companyId]);
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

 // Driver form Validations
 isDriverFormControlValid(controlName: string): boolean {
  const control = this.createDriverForm.controls[controlName];
  return control.valid && (control.dirty || control.touched);
}

isDriverFormControlInvalid(controlName: string): boolean {
  const control = this.createDriverForm.controls[controlName];
  return control.invalid && (control.dirty || control.touched);
}

DriverFormcontrolHasError(validation, controlName): boolean {
  const control = this.createDriverForm.controls[controlName];
  return control.hasError(validation) && (control.dirty || control.touched);
}

isDriverFormControlTouched(controlName): boolean {
  const control = this.createDriverForm.controls[controlName];
  return control.dirty || control.touched;
}

}
