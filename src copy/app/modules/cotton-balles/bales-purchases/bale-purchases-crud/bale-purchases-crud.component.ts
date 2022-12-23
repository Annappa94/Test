import { I } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { S3UrlResponse } from 'src/app/model/types/type.model';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CustomValidator } from 'src/app/modules/shared/custom-validator/custom.validator';

@Component({
  selector: 'app-bale-purchases-crud',
  templateUrl: './bale-purchases-crud.component.html',
  styleUrls: ['./bale-purchases-crud.component.scss']
})
export class BalePurchasesCrudComponent implements OnInit {
 
  ginnerCreateForm: UntypedFormGroup;
  centerList:any[] = [];
  ginnerData:any[] = [];
  cottonBaleImages:any[]=[];
  stateList = [{name:'Same State',value:'Same State'},{name:'Other State',value:"Other State"}]
  ginnerList: any = [];
  usersList: any= [];
  id:number;
  selectedGinner: any;
  couponValid = false;
  couponMsg = '';
  couponList: any = [];
  res;
  defaultPagination={
    currentPage : 0,
    pageSize    : 1000,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  }
  refferalCouponApplied = false;
  cottonTypesList = [{name:'BT COTTON',value:'BTCOTTON'},{name:'DCH COTTON',value:"DCHCOTTON"}] 
  ginnerName:any;
  ginnerPhone:any;
  edit = false;
  uom = 'KGS';
  balepurchasesCreateForm:UntypedFormGroup = this.form.group({
    code:new UntypedFormControl(''),
    ginner:new UntypedFormControl(''),
    balecenter:new UntypedFormControl('',Validators.required),
    cottonType:new UntypedFormControl(''),
    stapleLength:new UntypedFormControl('',Validators.required),
    micronaire:new UntypedFormControl(''),
    moistureContent:new UntypedFormControl(''),
    rd:new UntypedFormControl(''),
    varianceinrd:new UntypedFormControl(''),
    strength:new UntypedFormControl(''),
    elongation:new UntypedFormControl(''),
    trashcontent:new UntypedFormControl(''),
    //selectgrade:new FormControl('',Validators.required),
    numberofbales:new UntypedFormControl(''),
    receivedweight:new UntypedFormControl(0,[Validators.required, Validators.min(1)]),
    deduction:new UntypedFormControl(0),
    netweight:new UntypedFormControl(0),
    numberofcandies:new UntypedFormControl(''),
    ratepercandy:new UntypedFormControl('',Validators.required),
    rateperKg:new UntypedFormControl(''),
    grostotal:new UntypedFormControl(''),
    state:new UntypedFormControl(''),
    gst:new UntypedFormControl(''),
    dueAmount:[''],
    // netamount:[0,[Validators.required,Validators.min(1)]],
    // representative:new FormControl('',Validators.required),
    weighBridgeSlipImage:[null,[Validators.required]],
    testReportImage:[null,[Validators.required]],
    moistureImage:[],
    baleImage:[],
   
    cottonImages: new UntypedFormArray([]),
    couponAmount: new UntypedFormControl(0),
    couponCode: new UntypedFormControl(''),
    cgst:new UntypedFormControl(),
    igst:new UntypedFormControl(),
    sgst:new UntypedFormControl(),
    withInState:[true],
    // representativeName:[],
    // representativePhone:[],
    netPayableAmount:[],
  }) ;
  modalRef: any;
  closeResult: string;
  representive: any;
  constructor(
  private route: ActivatedRoute,
  private router: Router,
  private form: UntypedFormBuilder,
  private _cd: ChangeDetectorRef,
  private snackBar: MatSnackBar,
  private modalService: NgbModal,
  private cdr: ChangeDetectorRef,
  private ngxLoader: NgxUiLoaderService,
  private utils: UtilsService,
  private searchApi: SearchService,
  public globalService: GlobalService,
  private $gaService:GoogleAnalyticsService,
  private apiService:ApiService,
  private api: ApiService, 
  ) 
  {
    this.onValueChanges();
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
      }
    });

    if (this.id) {
      this.ngxLoader.stop();
      this.api.getBalePurchaseById(this.id).then((response:any) => {
        if (response) {
         
          this.balepurchasesCreateForm.get('ginner').patchValue(response['ginnerId'])
          
          this.balepurchasesCreateForm.get('cottonType').patchValue(response['baleType'])

          this.balepurchasesCreateForm.get('stapleLength').patchValue(response['stapleLengthInMm'])
          this.balepurchasesCreateForm.get('micronaire').patchValue(response['micronaire'])
          this.balepurchasesCreateForm.get('moistureContent').patchValue(response['moistureInPercentage'])
          this.balepurchasesCreateForm.get('rd').patchValue(response['rd'])
          this.balepurchasesCreateForm.get('varianceinrd').patchValue(response['rdVariance'])
          this.balepurchasesCreateForm.get('strength').patchValue(response['strength'])
          
          this.balepurchasesCreateForm.get('elongation').patchValue(response['elongation'])

          this.balepurchasesCreateForm.get('trashcontent').patchValue(response['wastageInPercentage'])

          this.balepurchasesCreateForm.get('numberofbales').patchValue(response['noOfBales'])
          // this.ginnerCreateForm.get('capacity').patchValue(response['centerId'])
          this.balepurchasesCreateForm.get('dueAmount').patchValue(response['dueAmount'])
          this.balepurchasesCreateForm.get('receivedweight').patchValue(response['receivedWeight'])
          this.balepurchasesCreateForm.get('deduction').patchValue(response['weightDeduction'])
          this.balepurchasesCreateForm.get('netweight').patchValue(response['netWeight'])
          this.balepurchasesCreateForm.get('numberofcandies').patchValue(response['totalCandies'])
          this.balepurchasesCreateForm.get('ratepercandy').patchValue(response['ratePerCandy'])
          this.balepurchasesCreateForm.get('grostotal').patchValue(response['grossAmount'])
          this.balepurchasesCreateForm.get('withInState').patchValue(response['withInState'])
          this.balepurchasesCreateForm.get('sgst').patchValue(response['sgst'])
          this.balepurchasesCreateForm.get('cgst').patchValue(response['cgst'])
          this.balepurchasesCreateForm.get('igst').patchValue(response['igst'])

          this.balepurchasesCreateForm.get('couponCode').patchValue(response['couponCode'])
          this.balepurchasesCreateForm.get('couponAmount').patchValue(response['couponAmount'])
          this.balepurchasesCreateForm.get('netPayableAmount').patchValue(response['netPayableAmount'])
          // this.balepurchasesCreateForm.get('representativeName').patchValue(response['rmRepresentativeName'])
          // this.balepurchasesCreateForm.get('representativePhone').patchValue(response['rmRepresentativePhone'])


          this.balepurchasesCreateForm.get('ginner').patchValue(response['ginnerId'])
          this.balepurchasesCreateForm.get('balecenter').patchValue(response['centerId'])

          this.cottonBaleImages=response['cottonBaleImages']
          let representiveObj;
          if (response.rmRepresentativeName) {
            representiveObj = {
              name: response.rmRepresentativeName,
              phone: response.rmRepresentativePhone
            }
          } else {
            representiveObj = {
              name: '-',
              phone: response.createdBy
            }
          }
          this.representive = representiveObj;
         
        } else {
          this.snackBar.open('Failed to find Spinning Mill', 'Ok', {
            duration: 3000
          });
        }
        this.getGinnerDetailsById(response['ginnerId']);

       
        for(let o of this.cottonBaleImages){
          
          this.balepurchasesCreateForm.get(o['tag']).patchValue(o['url'])
        }
      });
    }
  }

  getGinnerDetailsById(ginnerId){
    this.api.getGinnerDetailsById(ginnerId).then((res:any)=>{
    
      this.ginnerName=res['name'],
      this.ginnerPhone=res['phone']
      this._cd.detectChanges();
    })
  }
  ngOnInit(): void {
    this.getCenters();
    this.getAllUsers();
    this.ginnerFormInit();
    !this.id&&this.addCottonImages();
   
  }
  saveBalepurchase(balepurchasesCreateForm){
    const params = {
      ginner: '/ginner/'+balepurchasesCreateForm.ginner,
      center:{
        id:balepurchasesCreateForm.balecenter
      },
      baleType: balepurchasesCreateForm.cottonType,
      stapleLengthInMm: balepurchasesCreateForm.stapleLength,
      micronaire: balepurchasesCreateForm.micronaire,
      moistureInPercentage: balepurchasesCreateForm.moistureContent,
      rd: balepurchasesCreateForm.rd,

      rdVariance: balepurchasesCreateForm.varianceinrd,
      strength: balepurchasesCreateForm.strength,
      elongation: balepurchasesCreateForm.elongation,
      wastageInPercentage: balepurchasesCreateForm.trashcontent,
      noOfBales: balepurchasesCreateForm.numberofbales,
      balesDedudction: balepurchasesCreateForm.capacity,

      totalBales: balepurchasesCreateForm.name,
      receivedWeight: balepurchasesCreateForm.receivedweight,
      weightDeduction: balepurchasesCreateForm.deduction,
      netWeight: balepurchasesCreateForm.netweight,
      totalCandies: balepurchasesCreateForm.numberofcandies,
      ratePerCandy: balepurchasesCreateForm.ratepercandy,

      grossAmount: balepurchasesCreateForm.grostotal,
      withInState: balepurchasesCreateForm.withInState,
      sgst: balepurchasesCreateForm.sgst,
      cgst: balepurchasesCreateForm.cgst,
      igst: balepurchasesCreateForm.igst,
      couponCode: balepurchasesCreateForm.couponCode,
      couponAmount:0,

      netPayableAmount: balepurchasesCreateForm.netPayableAmount,
      dueAmount:balepurchasesCreateForm.netPayableAmount,
      rmRepresentativeName: this.representive?.name,
      rmRepresentativePhone: this.representive?.phone,

      cottonBaleImages:this.cottonBaleImages
    };
    
    if (this.id) {
      params['dueAmount']= this.balepurchasesCreateForm.get('dueAmount').value;
      
      this.ngxLoader.stop();
      this.api.updateBalePurchase(this.id, params).then((res:any) => {
        if (res) {
          // Success Message
          this.res=res;
          this.router.navigate(['/resha-farms/bale-purchases']);
          //this.modalService.open(this.kycFillcontent);
          this.snackBar.open('Updated Bale Purchase successfully', 'Ok', {
            duration: 3000
          });
        } else {
          this.snackBar.open('Failed to Update Bale Purchase', 'Ok', {
            duration: 3000
          });
        }
      });
    } else {
      this.ngxLoader.stop();
      this.api.createBalePurchase(params).then((res:any) => {
        if (res) {
          // Success Message
          this.res=res;
          this.router.navigate(['/resha-farms/bale-purchases']);
          //this.modalService.open(this.kycFillcontent);
          this.snackBar.open('Created Bale Purchase successfully', 'Ok', {
            duration: 3000
          });
        } else {
          this.snackBar.open('Failed to Create Bale Purchase', 'Ok', {
            duration: 3000
          });
        }
      });
    }
   
      
    
  }

  patchCottonLot(payload:any){
    this.apiService.patchCottonLot(this.id,payload).then(res=>{
      this.snackBar.open('Updated CottonLot successfully', 'Ok', {
        duration: 3000
      });
      this.router.navigate(['cottonlot']);
    }).catch(err=>{
      this.snackBar.open('Something went wrong ..', 'Ok', {
        duration: 3000
      });
    });
  }
 
  async getCenters() {
    this.apiService.getCottonBALESCenters().then(details => {
      this.centerList = [];
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      this._cd.detectChanges();
    }, err => {
    });
  }
  ginnerFormInit(){
  this.ginnerCreateForm = this.form.group({
    name: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace, Validators.pattern("^[A-Za-z ]+$")]),
    phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
    center: new UntypedFormControl('', [Validators.required]),
  });
}
async open(content) {
  this.modalRef = this.modalService.open(content)
  this.modalRef.result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed`;
  });
}
createGinner(ginnerForm) {
  const params = {
    name: ginnerForm.name,
    phone: ginnerForm.phone,
    center: ginnerForm.center
  }
  this.ngxLoader.stop();
  this.apiService.postGinner(params).then(res => {
    this.modalRef.close();
    if (res) {
      this.ginnerData.push(res);
      this.balepurchasesCreateForm.get('ginner').patchValue(res['id']);
      this.ginnerCreateForm.reset();;
      this._cd.detectChanges();
      this.snackBar.open('Ginner Created successfully', 'Ok', {
        duration: 3000
      });
    }
  });
}

async getAllUsers() {
  this.usersList = [];
  this.apiService.getAllUsersList(this.globalService.cottonBales).then((res:any) => {
    if (res['_embedded']['user'] && res['_embedded']['user'].length) {
      this.usersList = res['_embedded']['user'];
    } else {
      this.usersList = [];
    }
    this._cd.detectChanges();
  });
}
getGinnerList(event) {
  if(event.term.length % 2 == 0) { //name==*${event.term.replace(/ /gi,"*")}* or  (removed as per deepak)
    let searchParams = `(phone==*${event.term.replace(/ /gi,"*")}*)`;
    this.searchApi.getOrdersCotton(false, 'ginner',searchParams).then(res => {
      this.ginnerData = res['content'];
      this._cd.detectChanges();
    })
  }
  if( !event.term || event.term.length == 0) {
    this.ginnerData = [];
    this._cd.detectChanges();
  }
}

  isControlValidForBalesPurchase(controlName: string): boolean {
    const control = this.balepurchasesCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }
  isControlInvalidForBalesPurchase(controlName: string): boolean {
    const control = this.balepurchasesCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
  controlHasErrorForBalesPurchase(validation, controlName): boolean {
    const control = this.balepurchasesCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }
  isControlTouchedForBalesPurchase(controlName): boolean {
    const control = this.balepurchasesCreateForm.controls[controlName];
    return control.dirty || control.touched;
  }
  //----------IMAGE SECTION---------------//
  deleteCottonImages(index){
    (this.balepurchasesCreateForm.get('cottonImages') as UntypedFormArray).removeAt(index)
  }
  updateCottonImages(res){
     if(res?.cottonImages?.length){
     const images = res?.cottonImages;
     for(let i=0;i<images.length;i++){
       (this.balepurchasesCreateForm.get("cottonImages") as UntypedFormArray).push(new UntypedFormGroup({
         url:new UntypedFormControl(images[i].url),
         tag:new UntypedFormControl(images[i].tag)
       }))
     }
     }else{
     this.addCottonImages();
      }
    }
  addCottonImages(){
    (this.balepurchasesCreateForm.get('cottonImages') as UntypedFormArray).push(new UntypedFormGroup({
      tag:new UntypedFormControl('Cotton image'),
      url:new UntypedFormControl(''),
    }));
  }
  requestAPI:number = 0;
  responseAPI:number =0;
  onImageUpload(image,index,placeholder:any=false) {
  if (image) {
    const file = image.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      let previewImage = reader.result as string;
      this.getS3Url(file.type,file,index,placeholder);
      this._cd.detectChanges();
    };
    reader.readAsDataURL(file)
    this._cd.detectChanges();
  }
}
async calluploadImageToS3API(s3url:String,file,fileNameFromS3:String,index,placeholder){
  try{
    this.requestAPI++;
    this._cd.detectChanges()
    await this.apiService.updateImageToS3Directly(s3url,file).then(res=>{
    this.responseAPI++;  
      if(placeholder){
        this.balepurchasesCreateForm.get(placeholder).patchValue(fileNameFromS3);
      }else{
        (this.balepurchasesCreateForm.get('cottonImages') as UntypedFormArray).at(index).get("url").patchValue(fileNameFromS3);
      }
      const params = {
        "tag":placeholder,
        "url":fileNameFromS3
      }
      this.cottonBaleImages.push(params);
      this._cd.detectChanges();
    })
  }catch(err){
    this.responseAPI++;
    (this.balepurchasesCreateForm.get('cottonImages') as UntypedFormArray).at(index).get("url").patchValue('');
      this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges()
  }
}
async getS3Url(fileType,file,index,placeholder){
  try{
    this.requestAPI++;
    this._cd.detectChanges()
    await this.apiService.getS3Url(fileType.split('/')[1]).then((res:S3UrlResponse)=>{
      this.responseAPI++;
      //this.preImgUrl = res.fileName
      this.calluploadImageToS3API(res.targetUrl,file,res.fileName,index,placeholder);
   })
  }catch(err){
    this.responseAPI++;
    this.snackBar.open('Image upload Failed', 'Ok', {
      duration: 3000
    });
    this._cd.detectChanges()
  }
}
  //--------------IMAGE SECTION ENDS--------///
  async getV1Users() {
    this.usersList = [];
    this.ngxLoader.stop();
    this.apiService.getAllUsersList(this.globalService.v1Roles).then(res => {
      if (res['_embedded']['user'] && res['_embedded']['user'].length) {
        this.usersList = res['_embedded']['user'];
      } else {
        this.usersList = [];
      }
      this._cd.detectChanges();
    });
  }
  //--------COUPON CODE SECTION------------//
  redeemCode(formValue) {
    this.apiService.verifyCoupon(formValue.couponCode.toUpperCase(), this.balepurchasesCreateForm.get('ginner').value, this.balepurchasesCreateForm.get('netPayableAmount').value, 'COTTON_PURCHASE').then((res: any) => {
      if(res.status) {
        this.couponValid = true;
        this.balepurchasesCreateForm.get('couponAmount').patchValue(Math.floor(+res.value));
        this.couponMsg = Math.floor(+res.value) + ' Added Suceessfully. '
        let total = this.balepurchasesCreateForm.get('grossTotal').value;
        total = Math.round((+total + Number.EPSILON)*100)/100;
        total = total + this.balepurchasesCreateForm.get('couponAmount').value;
        this.balepurchasesCreateForm.get('netPayableAmount').patchValue(total);
        this._cd.detectChanges();
      } else {
        this.balepurchasesCreateForm.get('couponCode').patchValue('');
        this.couponValid = false;
        this.couponMsg = res.messgage;
      }
    }, err => {
      this.snackBar.open('Please select Ginner, enter Weight and Price', 'Ok', {
        duration: 3000
      });
    })
  }
  
  couponClicked(coupon) {
    if(this.balepurchasesCreateForm.get('couponAmount').value == 0) {
      this.balepurchasesCreateForm.get('couponCode').patchValue(coupon);
    }
  }
  
  cancelCouponRedeem() {
    if(+this.balepurchasesCreateForm.get('couponAmount').value > 0) {
      this.ngxLoader.stop();
      this.apiService.deleteCoupon(this.balepurchasesCreateForm.get('couponCode').value, this.balepurchasesCreateForm.get('ginner').value.id).then(res => {
        this.snackBar.open('Please apply the coupon again', 'Ok', {
          duration: 3000
        });
      })
    }
    this.couponMsg = '';
    this.balepurchasesCreateForm.get('couponCode').patchValue('');
    this.balepurchasesCreateForm.get('couponAmount').patchValue(0);
  }
  
  getAllPromotionalCoupons() {
    this.apiService.getAllCouponByCustomer('FARMER').then(res => {
      const coupons = res['_embedded']['promotionalcoupon'];
      if(coupons.length) {
        this.couponList=[];
        for(let i=0;i<coupons.length;i++) {
          if(coupons[i].isActive) {
            this.couponList.push(coupons[i]['couponCode'])
          }
        }
      }
    })
  }
  //---------------COUPON CODE SECTION ENDS---------//
  onValueChanges(){
    // this.balepurchasesCreateForm.get('receivedweight').valueChanges.subscribe(x=>{
    //   this.balepurchasesCreateForm.get('netweight').setValue(this.balepurchasesCreateForm.get('receivedweight').value - this.balepurchasesCreateForm.get('deduction').value);
    //   let rateperKg = (this.balepurchasesCreateForm.get('numberofcandies').value) / 355.6;
    //   this.balepurchasesCreateForm.get('rateperKg').setValue((rateperKg).toFixed(2));
    //   let rateperKgUpdated = this.balepurchasesCreateForm.get('rateperKg').value;
    //   let netWeight = this.balepurchasesCreateForm.get('netweight').value;
    //   let grossTotal = rateperKgUpdated * netWeight;
    //   this.balepurchasesCreateForm.get('grostotal').setValue((grossTotal).toFixed(2));
    //   this.updateTaxAmount();
    // })
    // this.balepurchasesCreateForm.get('deduction').valueChanges.subscribe(x=>{
    //   this.balepurchasesCreateForm.get('netweight').setValue(this.balepurchasesCreateForm.get('receivedweight').value - this.balepurchasesCreateForm.get('deduction').value);
    //   let rateperKg = (this.balepurchasesCreateForm.get('numberofcandies').value) / 355.6;
    //   this.balepurchasesCreateForm.get('rateperKg').setValue((rateperKg).toFixed(2));
    //   let rateperKgUpdated = this.balepurchasesCreateForm.get('rateperKg').value;
    //   let netWeight = this.balepurchasesCreateForm.get('netweight').value;
    //   let grossTotal = rateperKgUpdated * netWeight;
    //   this.balepurchasesCreateForm.get('grostotal').setValue((grossTotal).toFixed(2));
    //   this.updateTaxAmount();
    // })
    // this.balepurchasesCreateForm.get('ratepercandy').valueChanges.subscribe(x=>{
    //   let rateperKg = (this.balepurchasesCreateForm.get('numberofcandies').value) / 355.6;
    //   this.balepurchasesCreateForm.get('rateperKg').setValue((rateperKg).toFixed(2));
    //   let rateperKgUpdated = this.balepurchasesCreateForm.get('rateperKg').value;
    //   let netWeight = this.balepurchasesCreateForm.get('netweight').value;
    //   let grossTotal = rateperKgUpdated * netWeight;
    //   this.balepurchasesCreateForm.get('grostotal').setValue((grossTotal).toFixed(2));
    //   this.updateTaxAmount();
    // });

    this.balepurchasesCreateForm.get('netweight').setValue(this.balepurchasesCreateForm.get('receivedweight').value - this.balepurchasesCreateForm.get('deduction').value);
    let noofcandies = (this.balepurchasesCreateForm.get('netweight').value) / 355.6;
    this.balepurchasesCreateForm.get('numberofcandies').setValue((noofcandies).toFixed(2));
    let rateperKg = (this.balepurchasesCreateForm.get('ratepercandy').value) / 355.6;
    this.balepurchasesCreateForm.get('rateperKg').setValue((rateperKg).toFixed(2));
    let rateperKgUpdated = this.balepurchasesCreateForm.get('rateperKg').value;
    let netWeight = this.balepurchasesCreateForm.get('netweight').value;
    let grossTotal = rateperKgUpdated * netWeight;

    this.balepurchasesCreateForm.get('grostotal').setValue((grossTotal).toFixed(2));
    this.updateTaxAmount();


  }

  updateTaxAmount(){
      if(JSON.parse(this.balepurchasesCreateForm.get('withInState').value)){
        this.balepurchasesCreateForm.get('sgst').patchValue((parseFloat(this.balepurchasesCreateForm.get('grostotal').value)*0.025)?.toFixed(2));
        this.balepurchasesCreateForm.get('cgst').patchValue((parseFloat(this.balepurchasesCreateForm.get('grostotal').value)*0.025)?.toFixed(2));
        this.balepurchasesCreateForm.get('igst').patchValue(0);
       
        let grosstotalValue = this.balepurchasesCreateForm.get('grostotal').value;
        let netPayableAmount:any = parseFloat(grosstotalValue) * 1.05;
        this.balepurchasesCreateForm.get('netPayableAmount').setValue(parseFloat(netPayableAmount)?.toFixed(2));
      }else{
        this.balepurchasesCreateForm.get('sgst').patchValue(0);
        this.balepurchasesCreateForm.get('cgst').patchValue(0);
        this.balepurchasesCreateForm.get('igst').patchValue((parseFloat(this.balepurchasesCreateForm.get('grostotal').value)*0.05)?.toFixed(2));
        let grosstotalValue = this.balepurchasesCreateForm.get('grostotal').value;
      let netPayableAmount:any = parseFloat(grosstotalValue) * 1.05;
      this.balepurchasesCreateForm.get('netPayableAmount').setValue(parseFloat(netPayableAmount)?.toFixed(2));
      } 
  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.ginnerCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlValidForReeler(controlName: string): boolean {
    const control = this.ginnerCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }
  
  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.ginnerCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

}
