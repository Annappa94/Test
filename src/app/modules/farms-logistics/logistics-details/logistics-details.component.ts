import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { SearchService } from 'src/app/services/api/search.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';

@Component({
  selector: 'app-logistics-details',
  templateUrl: './logistics-details.component.html',
  styleUrls: ['./logistics-details.component.scss']
})
export class LogisticsDetailsComponent implements OnInit {

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
  Vehicleres:any[]=[];
  totalRecords:number = 0;
  newDriverList:any[]=[];
  newVehicleList:any[]=[];
  driverRes: any;
  expiaryDate: Date;
  vehicleTypes: any;


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

  constructor(public utils:UtilsService,
    private api:ApiService,
    private apiSearch:SearchService,
    private _cd:ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private ngxLoader : NgxUiLoaderService,
    private modalService: NgbModal,
    private router:Router,
    private route:ActivatedRoute,
      private form: UntypedFormBuilder,
    ) {
      this.getAllVehicleTypes();
     }

    ngOnInit(): void {
      this.userType = JSON.parse(localStorage.getItem('_ud'));
      const { id } = this.route.snapshot.params;
      this.id = id;
      this.logisticsDetailsById();
      this.id&&this.getlogisticsDrivers();
      this.id&&this.getlogisticsVehicles();
      // this.id&&this.getAllGinnerKYC()
    }

    getAllVehicleTypes(){
      this.api.getVehicleType().then(res=>{
        this.vehicleTypes = res['content']
      })
    }

    driverTableHeaders:any=[
      {name:"RM DRIVER CODE", sortName:'code'},
      {name:"DRIVER NAME", sortName:'name', sort:true},
      {name:"DRIVER PHONE", sortName:'mobile', sort:true},
      {name:"STATUS", sortName:'status', sort:true},
      {name:'CREATED DATE', sortName: 'createdDate',sort:true},
      {name:'CREATED BY', sortName: 'createdBy',sort:true},
      {name:'ACTION'},
    ];
    vehicleTableHeaders:any=[
      {name:"RM VEHICLE CODE", sortName:'code'},
      {name:"VEHICLE TYPE", sortName:'name', sort:true},
      {name:"VEHICLE NUMBER", sortName:'mobile', sort:true},
      // {name:"STATUS", sortName:'city', sort:true},
      {name:'CREATED DATE', sortName: 'createdDate',sort:true},
      {name:'CREATED BY', sortName: 'createdBy',sort:true},
      {name:'ACTION'},
    ];
    CONSTANT = CONSTANT;

   onPageChange(data){
     const {paginationData,searchText,initial} = data;
      !initial && this.getlogisticsDrivers(paginationData,searchText);
   } //onVehiclePageChange

   onVehiclePageChange(data){
    const {paginationData,searchText,initial} = data;
     !initial && this.getlogisticsVehicles(paginationData,searchText);
  } 


   driverInfoFromTable(info){
     const { edit,data,details,index} = info;
     edit&&(this.routeToEditPage(index));

   }
   vehicleinfoFromTable(info){
     const { edit,data,details,index} = info;
     edit&&(this.routeTovehicleEditPage(index));
   }

   routeToEditPage(index){
     this.router.navigate([`/resha-farms/farms-logistics/crud/`,this.driverRes[index]?.id]);
   }

   routeTovehicleEditPage(index){
     this.router.navigate([`/resha-farms/farms-logistics/vehicle/curd/`,this.Vehicleres[index]?.id]);
   }

   closeCreateEditModel() {
     this._cd.detectChanges();
     this.modalRef.close();
   }

   changeDateTimeEvent(event: MatDatepickerInputEvent<Date>){
    this.createDriverForm.get('DlExpiryDate').patchValue('')
    let dateChange = new Date(event.value);
    this.expiaryDate= new Date((dateChange).setFullYear(new Date(dateChange).getFullYear() + 5));
  }

   openDriverForm(driverForm) {
     // this.category.reset();
     this.createFormParams();
     this.modalRef = this.modalService.open(driverForm)
     this.modalRef.result.then((result) => {
       this.closeResult = `Closed with: ${result}`;
     }, (reason) => {
       this.closeResult = `Dismissed`;
     });
   }
   
   openVehicleForm(vehicleForm) {
     // this.category.reset();
     this.createFormParams();
     this.modalRef = this.modalService.open(vehicleForm)
     this.modalRef.result.then((result) => {
       this.closeResult = `Closed with: ${result}`;
     }, (reason) => {
       this.closeResult = `Dismissed`;
     });
   }

   createDriver(driverData:any) {
     //this.newDriverList.push(driverData);
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
         "address": driverData?.address?.address,
         "city": driverData?.address?.city,
         "taluk": driverData?.address?.taluk,
         "village": driverData?.address?.village,
         "district": driverData?.address?.district,
         "state": driverData?.address?.state,
         "pincode": driverData?.address?.pincode,
         "region": driverData?.address?.region,
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

     this.api.createLogisticsCompanyDriver(payload).then(res=>{
       this.newDriverList.push(res);
       let driviresObj = []
       this.newDriverList.forEach((obj, index) => {
         driviresObj.push({
           "id" : obj.id
         })
       })
       let driverPaylod = {
         "drivers": driviresObj,
         "vehicles": []
       }
       this.snackBar.open('Driver Created Successfully', 'Ok', {
         duration: 3000
       });
        this.companyUpdate(driverPaylod);

       //this.router.navigate(['/ginners']);
       this.closeCreateEditModel();

     });
     // //this.totalRecords = res['totalElements'];
     this._cd.detectChanges();

   }

   createVehicle(vehicleData:any) {
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
     this.api.createLogisticsCompanyVehicle(payload).then(res=>{
       this.newVehicleList.push(res);
       let vehiclesObj = []
       this.newVehicleList.forEach((obj, index) => {
         vehiclesObj.push({
           "id" : obj.id
         })
       })
       let vehiclePaylod = {
         "drivers": [],
         "vehicles": vehiclesObj
       }
       this.snackBar.open('Vehicle Created Successfully', 'Ok', {
         duration: 3000
       });
        this.companyUpdate(vehiclePaylod);
        this.getlogisticsVehiclesById();
        this.closeCreateEditModel();
       //this.router.navigate(['/ginners']);

     });
     this._cd.detectChanges();

   }

   companyUpdate(paylod){
     this.api.createDriversForCompany(this.id, paylod).then(res=>{
       //this.newDriverList.push(res);
       //this.router.navigate(['/ginners']);
       this.getlogisticsDrivers();
       this.getlogisticsVehicles();
       this._cd.detectChanges();
      //  this.snackBar.open('Company Updated Successfully', 'Ok', { 
      //    duration: 3000
      //  });
     });
   }

    goBack() {
      this.router.navigate(['/resha-farms/farms-logistics']);
    }

    logisticsDetailsById(){
      this.api.getLogisticsDetailsById(this.id).then((res:any)=>{
        this.specificLogisticDetails = res;
        this._cd.detectChanges();
      })
    }

    buildSearchQuery(searchText){
      let query = `(`;
      if(searchText)
         query += ` (name == *${searchText}* or mobile == *${searchText}* `;
         searchText.toString()?.toUpperCase()?.includes('RMLPDR')&&!isNaN(parseInt(searchText.substring(6)))&&(query+=` or id==${searchText.substring(6)}`)
      
       if(searchText&&!isNaN(searchText)){
        //  query = `((name == *${searchText}*  or id ==${searchText} or mobile == *${searchText}*`
         query+=` or id ==${searchText}`;
          // searchText.toString()?.toUpperCase()?.includes('RMLPDR')&&!isNaN(parseInt(searchText.substring(6)))&&(query+=` or id==${searchText.substring(6)}`);
       }
       if(query.length>2)
        query+=`) and company.id==${this.id}`;
       else{
         return `company.id==${this.id}`;
       }
       
       query+=`)`;

       return query;
     }

     getlogisticsDrivers(paginationData=false,searchText=''){
      this.ngxLoader.stop();
      this.apiSearch.getAllDriversData(paginationData,this.buildSearchQuery(searchText)).then((response:any)=>{
        this.rowDriverDataList = [];
        this.driverRes = response['content'];
        this.driverRes.filter(record=>{
          //this.specificLogisticDetails = res;
          const driverobj={};
          driverobj['RM DRIVER CODE'] = record?.code ? record?.code : '',
          driverobj['DRIVER NAME'] = record?.name ? record?.name : ' - ',
          driverobj['DRIVER PHONE'] = record?.mobile ? record?.mobile  : ' - ',
          driverobj['STATUS'] = record?.logisticsPartnerStatus ? record?.logisticsPartnerStatus : ' - ',
          driverobj['CREATED DATE'] = record?.createdDate ? this.utils.getDisplayTime(record?.createdDate)  : ' - ',
          driverobj['CREATED BY'] = record?.createdBy ? record?.createdBy : ' - ',
          driverobj['ACTION'] = 'ACTION',
          //this.CONSTANT.ID ='RM CODE',
          this.CONSTANT.ACTION ='ACTION',
          this.rowDriverDataList.push(driverobj);
        });
        // this.totalRecords = response['totalElements'];
        this._cd.detectChanges();
        
      })
     }


     buildVehicleSearchQuery(searchText){
      let Vehiclequery = `(`;
      if(searchText)
         Vehiclequery += ` (vehicleNumber == *${searchText}* `;
         searchText.toString()?.toUpperCase()?.includes('RMLPDR')&&!isNaN(parseInt(searchText.substring(6)))&&(Vehiclequery+=` or id==${searchText.substring(6)}`)
      
       if(searchText&&!isNaN(searchText)){
        //  Vehiclequery = `((name == *${searchText}*  or id ==${searchText} or mobile == *${searchText}*`
         Vehiclequery+=` or id ==${searchText}`;
          // searchText.toString()?.toUpperCase()?.includes('RMLPDR')&&!isNaN(parseInt(searchText.substring(6)))&&(Vehiclequery+=` or id==${searchText.substring(6)}`);
       }
       if(Vehiclequery.length>2)
        Vehiclequery+=`) and company.id==${this.id}`;
       else{
         return `company.id==${this.id}`;
       }
       
       Vehiclequery+=`)`;

       return Vehiclequery;
     }
    
     getlogisticsVehicles(paginationData=false,searchText=''){
      this.ngxLoader.stop();
      this.apiSearch.getAllVehiclesData(paginationData,this.buildVehicleSearchQuery(searchText)).then((res:any)=>{
        this.rowVehicleDataList = [];
        this.Vehicleres = res['content'];
        this.Vehicleres.filter(record=>{
          //this.specificLogisticDetails = res;
          const obj={};
          obj['RM VEHICLE CODE'] = record?.code ? record?.code : '',
          obj['VEHICLE TYPE'] = record?.vehicleType ? record?.vehicleType : ' - ',
          obj['VEHICLE NUMBER'] = record?.vehicleNumber ? record?.vehicleNumber  : ' - ',
          // obj['CITY'] = record?.address ? record?.address?.city : ' - ',
          obj['CREATED DATE'] = record?.createdDate ? this.utils.getDisplayTime(record?.createdDate)  : ' - ',
          obj['CREATED BY'] = record?.createdBy ? record?.createdBy : ' - ',
          obj['ACTION'] = 'ACTION',
          //this.CONSTANT.ID ='RM CODE',
          this.CONSTANT.ACTION ='ACTION',
          this.rowVehicleDataList.push(obj);
        });
        //this.totalRecords = res['totalElements'];
        this._cd.detectChanges();
        
      })
     }


    getlogisticsDriversById(){
      this.ngxLoader.stop();
      this.api.getLogisticsDriverById(this.id).then((response:any)=>{
      })
    }


    getlogisticsVehiclesById(){
      this.api.getLogisticsVehiclesById(this.id).then((res:any)=>{
      })
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
