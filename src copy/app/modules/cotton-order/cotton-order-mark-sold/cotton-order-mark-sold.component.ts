import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { S3UrlResponse } from 'src/app/model/types/type.model';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { SalesOrderBlockComponent } from '../../sales-order-block-popup/sales-order-block-popup.component';
import { AddressPincodeFormComponent } from '../../shared/address-pincode-form/address-pincode-form.component';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';

@Component({
  selector: 'app-cotton-order-mark-sold',
  templateUrl: './cotton-order-mark-sold.component.html',
  styleUrls: ['./cotton-order-mark-sold.component.scss']
})
export class CottonOrderMarkSoldComponent implements OnInit {
  @ViewChild('address') addressForm : AddressPincodeFormComponent;


  constructor(private globalService:GlobalService,
    private router:Router,private form:UntypedFormBuilder,
    private _cd:ChangeDetectorRef,
    private api:SearchService,
    private apiService:ApiService,
    private modalService:NgbModal,
    private snackBar:MatSnackBar,
    private ngxLoader:NgxUiLoaderService) { }
  id:number;
  COTTON_SALES_ORDER = [0,2,5,7,15,30]
  ginnerData:any[] = [];
  usersList:any = [];
  markSoldForm:UntypedFormGroup =  this.form.group({
   ginner:[null,[Validators.required]],
   netAmount:[0,[Validators.required,Validators.min(1)]],
   discountAmount:[],
   grossTotal:[null,[Validators.min(1)]],
   weightAtGinnerMill:[],
   sellingWeight:[],
   rmRepresentative:[null,[Validators.required]],
   rmRepresentativeName:[],
   rmRepresentativePhone:[],
   weighbridgeCharges:[],
   hamaliDeduction:[],
   weighbridgeImage:[null,[Validators.required]],
   creditDays:[0,[Validators.required]],
   preTaxAmount:[null,[Validators.min(1)]],
   netReceivableAmount:[null,[Validators.min(1)]],
   cgst:[],
   igst:[],
   sgst:[],
   withInState:[true],
   cottonOrderItems:this.form.array([
   ]),
   address:this.form.group({
    address:[''],
    village:[''],
    city:[''],
    district:[''],
    taluk:[''],
    region:[''],
    state:[''],
    pincode:['']
   }),
   logistics:this.form.group({
    driverName:[],
    driverNumber:[null,[Validators.pattern('[1-9]{1}[0-9]{9}')]],
    vehicleNumber:[],
    totalCost:[],
   }),
   weightDeduction:[0],
   minGrossTotal: new UntypedFormControl(0)
  });
  user;
  ngOnInit(): void {
  this.user = JSON.parse(localStorage.getItem('_ud'));
  this.getAllUsers();
  this.listenForHamaliDeductionWeighbridgeCharges();
  this.ginnerFormInit();
  this.getCenters();
  if(this.globalService.cottonData){
    for(let lot of this.globalService.cottonData){
      (this.markSoldForm.get('cottonOrderItems') as UntypedFormArray).push(this.form.group({
        cottonLotCode:[lot.code],
        cottonType:[lot.cottonType],
        cottonGrade:[lot.grade],
        weightAtGinnerMill:[lot.availableQuantity],
        sellingWeight:[(lot.availableQuantity),[Validators.min(1),Validators.max(lot.availableQuantity-lot.wastageQuantity)]],
        sellingPricePerKg:[lot.sellingPricePerKg,[Validators.min(lot.sellingPricePerKg)]],
        totalAmount:[lot.netAmount],
        wastageQuantity:[0,[Validators.max(lot.availableQuantity)]],
        available:[lot.availableQuantity],
        discountAmount:[0],
        grossAmount:[],
        buyPrice:[lot.ratePerKg],
        cottonLotId:[lot.id],
        availablePlaceholder:[lot.availableQuantity,[Validators.min(1)]],
        minSellingPrice:[lot.sellingPricePerKg],
    }));
    }
    this.updateThePrice();
    this._cd.detectChanges();
  }
   this.noDataRouteToListingPage();
  }


  listenForHamaliDeductionWeighbridgeCharges(){
    this.markSoldForm.get('hamaliDeduction').valueChanges.subscribe(x=>{
      this.updateThePrice();
    })
    this.markSoldForm.get('weighbridgeCharges').valueChanges.subscribe(x=>{
      this.updateThePrice();
    })
    this.markSoldForm.get('withInState').valueChanges.subscribe(x=>{
      this.updateThePrice();
    })
  }

  buildPayload(data){
   let payload = {...data};
   payload['dueAmount'] = payload['netReceivableAmount'];
   payload['ginner'] = `/ginner/${payload['ginner']['id']}`;
   payload["rmRepresentativeName"] = payload['rmRepresentative']?.name;
   payload["rmRepresentativePhone"] = payload['rmRepresentative']?.phone;
   return payload;
  }

  onSubmit(value){
    this.createCottonSalesOrder(value);
  }

  createCottonSalesOrder(payload:any){
    console.log(payload);
    
    // if (this.user.phonenumber != '9886125599' && +payload.discountAmount > 0 && +  (payload.minGrossTotal - payload.minGrossTotal * 0.02) > payload.preTaxAmount) {
    //   this.modalRef = this.modalService.open(SalesOrderBlockComponent, { backdrop: 'static', size: 'lg', keyboard: false, centered: true });
    // } else {
      this.api.createCottonSalesOrder(this.buildPayload(payload)).then(res => {
        this.router.navigate(['cotton-orders'])
        this.snackBar.open('Sales order created successfully ', 'Ok', {
          duration: 3000
        });
      })
    // }

  }

  listenForMarkSoldValueChanges(index:number){
    this.updateThePrice();
    (this.markSoldForm.get('cottonOrderItems') as UntypedFormArray).at(index).get('sellingWeight').valueChanges.subscribe(data=>{
      this.updateThePrice();
      // (this.markSoldForm.get('cottonOrderItems') as FormArray).at(index).get('wastageQuantity').patchValue(0);
    });
    (this.markSoldForm.get('cottonOrderItems') as UntypedFormArray).at(index).get('wastageQuantity').valueChanges.subscribe(data=>{
      this.updateThePrice();
    });
    (this.markSoldForm.get('cottonOrderItems') as UntypedFormArray).at(index).get('sellingPricePerKg').valueChanges.subscribe(data=>{
      this.updateThePrice();
    });
    (this.markSoldForm.get('cottonOrderItems') as UntypedFormArray).at(index).get('discountAmount').valueChanges.subscribe(data=>{
      this.updateThePrice();
    });
  }

  updateThePrice(){
    let lots:UntypedFormArray = (this.markSoldForm.get('cottonOrderItems') as UntypedFormArray);

   let globalGrossTotal:any = 0;
   let globalDiscount:any = 0;
   let globalNetAmount:any = 0;
   let globalSellingWeight:any = 0;
   let globalWeightDeduction:any =0;
   let minGrossTotal = 0;
    for(let lot of lots.controls){
      let sellingWeight =lot.value.sellingWeight //Selling Weight = Selling Weight - Deduction
      let grossTotal:any = sellingWeight * lot.value.sellingPricePerKg; // Gross Total = Actual Selling Weight( in Kgs) * Selling Rate/ KG

      globalDiscount += +lot.value.discountAmount;
      globalSellingWeight += sellingWeight;
      globalGrossTotal += grossTotal;
      globalWeightDeduction +=lot.value.wastageQuantity;
      let sellingTotal = grossTotal - lot.value.discountAmount;
      lot.get('totalAmount').patchValue(parseFloat(sellingTotal?.toFixed(2)));
      lot.get('grossAmount').patchValue(parseFloat(grossTotal)?.toFixed(2));
      // lot.get('availablePlaceholder').patchValue(lot.value.available-lot.value.wastageQuantity);
      // minGrossTotal += +lot.value.minSellingPrice * +sellingWeight;      
    }

    let preTaxAmount:any =  globalGrossTotal - globalDiscount;// Pre-Tax Amount = Gross Total - Discount Amount
    let netAmount =  preTaxAmount + (preTaxAmount*0.05);// Net Amount = Pre-tax Amount + GST ( % of Pre-Tax Amount )
    let netReceivableAmount:any =  netAmount - (this.markSoldForm.get('weighbridgeCharges').value+this.markSoldForm.get('hamaliDeduction').value)   // Net Receivable Amount = Net Amount - ( Hamali Deduction + Weighbridge Charges ).
    // this.markSoldForm.get('minGrossTotal').patchValue(minGrossTotal);
    this.markSoldForm.get('preTaxAmount').patchValue(Math.round((preTaxAmount + Number.EPSILON)*100)/100);
    this.markSoldForm.get('netReceivableAmount').patchValue(Math.round((netReceivableAmount + Number.EPSILON)*100)/100);
    this.markSoldForm.get('netAmount').patchValue(Math.round((netAmount + Number.EPSILON)*100)/100);
    this.markSoldForm.get('sellingWeight').patchValue(Math.round((globalSellingWeight + Number.EPSILON)*100)/100);
    this.markSoldForm.get('discountAmount').patchValue(Math.round((globalDiscount + Number.EPSILON)*100)/100);
    this.markSoldForm.get('grossTotal').patchValue(Math.round((globalGrossTotal + Number.EPSILON)*100)/100);
    this.markSoldForm.get('weightDeduction').patchValue(Math.round((globalWeightDeduction + Number.EPSILON)*100)/100)
    if(JSON.parse(this.markSoldForm.get('withInState').value)){
      this.markSoldForm.get('sgst').patchValue((Math.round((preTaxAmount*0.025) + Number.EPSILON)*100)/100);
      this.markSoldForm.get('cgst').patchValue((Math.round((preTaxAmount*0.025) + Number.EPSILON)*100)/100);
      this.markSoldForm.get('igst').patchValue(0);
    }else{
      this.markSoldForm.get('sgst').patchValue(0);
      this.markSoldForm.get('cgst').patchValue(0);
      this.markSoldForm.get('igst').patchValue(Math.round(((preTaxAmount*0.05) + Number.EPSILON)*100)/100);
    }

  }


  weightdeductionChange(i){
    let sellingWeight:any =(this.markSoldForm.get("cottonOrderItems") as UntypedFormArray).at(i).get('weightAtGinnerMill').value-(this.markSoldForm.get("cottonOrderItems") as UntypedFormArray).at(i).value.wastageQuantity;
    (this.markSoldForm.get("cottonOrderItems") as UntypedFormArray).at(i).get('sellingWeight').patchValue(sellingWeight);
    (this.markSoldForm.get("cottonOrderItems") as UntypedFormArray).at(i).get('sellingWeight').setValidators([Validators.max(sellingWeight)]);
    (this.markSoldForm.get("cottonOrderItems") as UntypedFormArray).at(i).get('sellingWeight').updateValueAndValidity();
    this.updateThePrice();
  }

  listenForMarkSoldSellingWeight(i){
    // (this.markSoldForm.get("cottonOrderItems") as FormArray).at(i).get('wastageQuantity').patchValue(0);
    let sellingWeight:any =(this.markSoldForm.get("cottonOrderItems") as UntypedFormArray).at(i).get('available').value-(this.markSoldForm.get("cottonOrderItems") as UntypedFormArray).at(i).value.wastageQuantity;

    (this.markSoldForm.get("cottonOrderItems") as UntypedFormArray).at(i).get('sellingWeight').setValidators([Validators.max(sellingWeight)]);
    (this.markSoldForm.get("cottonOrderItems") as UntypedFormArray).at(i).get('sellingWeight').updateValueAndValidity();

    this.updateThePrice();
  }


  noDataRouteToListingPage(){
    if(this.globalService?.tempValueData){
      this.router.navigate(['/cottonlot']);
    }
  }

  getGinnerList(event) {
    if(event.term.length % 2 == 0) {
      let searchParams = `(name==*${event.term.replace(/ /gi,"*")}* or phone==*${event.term.replace(/ /gi,"*")}*)`;
      this.api.getOrdersCotton(false, 'ginner',searchParams).then(res => {
        this.ginnerData = res['content'];
        this._cd.detectChanges();
      })
    }
    if( !event.term || event.term.length == 0) {
      this.ginnerData = [];
      this._cd.detectChanges();
    }
  }

  async getAllUsers() {
    this.usersList = [];
    this.apiService.getAllUsersList(this.globalService.cottonRoles).then((res:any) => {
      if (res['_embedded']['user'] && res['_embedded']['user'].length) {
        this.usersList = res['_embedded']['user'];
      } else {
        this.usersList = [];
      }
      this._cd.detectChanges();
    });
  }

  centerList:any[] = [];

  async getCenters() {
    this.apiService.getCentersList().then(details => {
      this.centerList = [];
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      this._cd.detectChanges();
    }, err => {
    });
  }

modalRef;
closeResult: string;
async open(content) {
  this.modalRef = this.modalService.open(content)
  this.modalRef.result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed`;
  });
}
ginnerCreateForm:UntypedFormGroup;
ginnerFormInit(){
  this.ginnerCreateForm = this.form.group({
    name: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace, Validators.pattern("^[A-Za-z ]+$")]),
    phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
    center: new UntypedFormControl('', [Validators.required]),
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
      this.markSoldForm.get('ginner').patchValue(res['id']);
      this.ginnerCreateForm.reset();;
      this._cd.detectChanges();
      this.snackBar.open('Ginner Created successfully', 'Ok', {
        duration: 3000
      });
    }
  });
}

isControlValidForReeler(controlName: string): boolean {
  const control = this.ginnerCreateForm.controls[controlName];
  return control.valid && (control.dirty || control.touched);
}

isControlInvalidForReeler(controlName: string): boolean {
  const control = this.ginnerCreateForm.controls[controlName];
  return control.invalid && (control.dirty || control.touched);
}

controlHasErrorForReeler(validation, controlName): boolean {
  const control = this.ginnerCreateForm.controls[controlName];
  return control.hasError(validation) && (control.dirty || control.touched);
}

isControlTouchedForReeler(controlName): boolean {
  const control = this.ginnerCreateForm.controls[controlName];
  return control.dirty || control.touched;
}

requestAPI:number = 0;
responseAPI:number =0;
onImageUpload(image,index,placeholder:any=false) {
  if (image) {
    const file = image.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      let previewImage = reader.result as string;
      this.getS3Url(file.type,file,index);
      this._cd.detectChanges();
    };
    reader.readAsDataURL(file)
    this._cd.detectChanges();
  }
}

async calluploadImageToS3API(s3url:String,file,fileNameFromS3:String,index){
  try{
    this.requestAPI++;
    this._cd.detectChanges()
    await this.apiService.updateImageToS3Directly(s3url,file).then(res=>{
    this.responseAPI++;
      this.markSoldForm.get('weighbridgeImage').patchValue(fileNameFromS3);
      this._cd.detectChanges();
    })
  }catch(err){
    this.responseAPI++;
    this.markSoldForm.get('weighbridgeImage').patchValue('');
    this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges()
  }
}
async getS3Url(fileType,file,index){
  try{
    this.requestAPI++;
    this._cd.detectChanges()
    await this.apiService.getS3Url(fileType.split('/')[1]).then((res:S3UrlResponse)=>{
      this.responseAPI++;
      this.calluploadImageToS3API(res.targetUrl,file,res.fileName,index);
   })
  }catch(err){
    this.responseAPI++;
    this.snackBar.open('Image upload Failed', 'Ok', {
      duration: 3000
    });
    this._cd.detectChanges()
  }
}
OnselectGinner(item) {
  this.markSoldForm.get('ginner').patchValue(item);
  this.addressForm.addressForm.get('address').patchValue((item['address'] && item['address']['address']) ? item['address']['address'] : "");
  this.addressForm.addressForm.get('village').patchValue((item['address'] && item['address']['village']) ? item['address']['village'] : "" );
  this.addressForm.addressForm.get('city').patchValue((item['address'] && item['address']['city']) ? item['address']['city'] : "" );
  this.addressForm.addressForm.get('district').patchValue((item['address'] && item['address']['district']) ? item['address']['district'] : "" );
  this.addressForm.addressForm.get('taluk').patchValue((item['address'] &&item['address']['taluk']) ? item['address']['taluk'] : "" );
  this.addressForm.addressForm.get('region').patchValue((item['address'] && item['address']['region']) ? item['address']['region'] : "" );
  this.addressForm.addressForm.get('state').patchValue((item['address'] && item['address']['state']) ? item['address']['state'] : "" );
  this.addressForm.addressForm.get('pincode').patchValue((item['address'] && item['address']['pincode']) ? item['address']['pincode'] : "" );
  this.addressForm.addressForm.get('latitude').patchValue((item['address'] &&item['address']['latitude']) ? item['address']['latitude'] : "" );
  this.addressForm.addressForm.get('longitude').patchValue((item['address'] && item['address']['longitude']) ? item['address']['longitude']: "" );
}



}

export interface CottonOrder{
  "cottonLotId": number,
  "cottonLotCode": string,
  "cottonType": string,
  "cottonGrade": number,
  "sellingWeight": number,
  "sellingPricePerKg": number,
  "totalAmount": number,
  "markSold": boolean,
  "wastageQuantity": number,
  "discountAmount": number,
  "grossAmount": number,
  "buyPrice": number
}

export interface CottonOrderItems{
  "cottonOrderItems": Array<CottonOrder>
}
