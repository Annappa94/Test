import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { SalesOrderBlockComponent } from '../../sales-order-block-popup/sales-order-block-popup.component';
import { AddressPincodeFormComponent } from '../../shared/address-pincode-form/address-pincode-form.component';

@Component({
  selector: 'app-pupae-order',
  templateUrl: './pupae-order.component.html',
  styleUrls: ['./pupae-order.component.scss']
})
export class PupaeOrderComponent implements OnInit {
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
  pupaeBuyerList:any[] = [];
  usersList:any = [];
  markSoldForm:UntypedFormGroup =  this.form.group({
   pupaeBuyer:[null,[Validators.required]],
   netAmount:[0,[Validators.required,Validators.min(1)]],
   discountAmount:[],
   grossTotal:[null,[Validators.min(1)]],
   sellingWeight:[],
   rmRepresentative:[null,[Validators.required]],
   rmRepresentativeName:[],
   rmRepresentativePhone:[],
   creditDays:[0,[Validators.required]],
   preTaxAmount:[null,[Validators.min(1)]],
   minGrossTotal: new UntypedFormControl(0),
  //  netReceivableAmount:[null,[Validators.min(1)]],
   cgst:[],
   igst:[],
   sgst:[],
   withInState:[true],
   pupaeOrderItems:this.form.array([
   ]),
  //  address:this.form.group({
  //   address:[],
  //   village:[],
  //   city:[],
  //   district:[],
  //   taluk:[],
  //   region:[],
  //   state:[],
  //   pincode:[]
  //  }),
   logistics:this.form.group({
    driverName:[],
    driverNumber:[null,[Validators.pattern('[1-9]{1}[0-9]{9}')]],
    vehicleNumber:[],
    totalCost:[]
   })
  });
  user;
  ngOnInit(): void {
  this.user = JSON.parse(localStorage.getItem('_ud'));
  this.getAllUsers();
  this.listenForHamaliDeductionWeighbridgeCharges();
  this.getCenters();
  if(this.globalService.cottonData){
    console.log(this.globalService.cottonData)
    for(let lot of this.globalService.cottonData){
      (this.markSoldForm.get('pupaeOrderItems') as UntypedFormArray).push(this.form.group({
        pupaeLotCode:[lot.code],
        pupaeType:[lot.type],
        cottonGrade:[lot.grade],
        sellingWeight:[(lot.availableQuantity)],
        sellingPricePerKg:[lot.pricePerKg,[Validators.min(lot.pricePerKg)]],
        //sellingPricePerKg:[lot.sellingPricePerKg],
        totalAmount:[lot.netAmount],
        wastageQuantity:[0],
        available:[lot.availableQuantity],
        discountAmount:[0],
        grossAmount:[],
        buyPrice:[lot.pricePerKg],
        pupaeLotId:[lot.id],
        availablePlaceholder:[lot.availableQuantity,[Validators.min(1)]],
        minSellingPrice:[lot.pricePerKg],
    }));
    }
    this.updateThePrice();
    this._cd.detectChanges();
  }
   this.noDataRouteToListingPage();
   this.buyerFormInit();
  }


  listenForHamaliDeductionWeighbridgeCharges(){
    this.markSoldForm.get('withInState').valueChanges.subscribe(x=>{
      this.updateThePrice();
    })
  }

  buildPayload(data){
   let payload = {...data};
   payload['pupaeBuyer'] = `/pupaeBuyer/${payload['pupaeBuyer']}`;
   payload["rmRepresentativeName"] = payload['rmRepresentative']?.name;
   payload["rmRepresentativePhone"] = payload['rmRepresentative']?.phone;
   payload['type']="WetPupae";
   return payload;
  }

  onSubmit(value){
    this.createCottonSalesOrder(value);
  }

  createCottonSalesOrder(payload:any){
    // if(this.user.phonenumber != '9886125599' && payload.discountAmount > 0 && (payload.minGrossTotal - payload.minGrossTotal * 0.02) > payload.netAmount) {
    //   this.modalRef = this.modalService.open(SalesOrderBlockComponent,{backdrop: 'static',size: 'lg', keyboard: false, centered: true});
    // } else {
      this.api.createPupaeSalesOrder(this.buildPayload(payload)).then(res=>{
        this.router.navigate(['/resha-farms/pupae-order'])
        this.snackBar.open('Sales order created successfully ', 'Ok', {
          duration: 3000
        });
      })
    // }

  }

  listenForMarkSoldValueChanges(index:number){
    this.updateThePrice();
    (this.markSoldForm.get('pupaeOrderItems') as UntypedFormArray).at(index).get('sellingWeight').valueChanges.subscribe(data=>{
      this.updateThePrice();
    });
    (this.markSoldForm.get('pupaeOrderItems') as UntypedFormArray).at(index).get('wastageQuantity').valueChanges.subscribe(data=>{
      this.updateThePrice();
    });
    (this.markSoldForm.get('pupaeOrderItems') as UntypedFormArray).at(index).get('sellingPricePerKg').valueChanges.subscribe(data=>{
      this.updateThePrice();
    });
    (this.markSoldForm.get('pupaeOrderItems') as UntypedFormArray).at(index).get('discountAmount').valueChanges.subscribe(data=>{
      this.updateThePrice();
    });
  }

  updateThePrice(){
    let lots:UntypedFormArray = (this.markSoldForm.get('pupaeOrderItems') as UntypedFormArray);

   let globalGrossTotal:any = 0;
   let globalDiscount:any = 0;
   let globalSellingWeight:any = 0; 
   let minGrossTotal = 0;

    for(let lot of lots.controls){      
      let sellingWeight =lot.value.sellingWeight //Selling Weight = Selling Weight 
      let grossTotal = sellingWeight * lot.value.sellingPricePerKg; //  Gross Total = Selling Weight( in Kgs) * Selling Rate/ KG
      // minGrossTotal += sellingWeight * lot.value.minSellingPrice;
     
      globalDiscount += +lot.value.discountAmount;
      globalSellingWeight += sellingWeight;
      globalGrossTotal += grossTotal;

      let preTaxAmount = grossTotal - lot.value.discountAmount; // Pre-Tax Amount = Gross Total - Discount Amount
      lot.get('totalAmount').patchValue(preTaxAmount);
      lot.get('grossAmount').patchValue(grossTotal);
      lot.get('availablePlaceholder').patchValue(lot.value.available);
    }
    
    // this.markSoldForm.get('minGrossTotal').patchValue(minGrossTotal);
    //let preTaxAmount:any =  globalGrossTotal - globalDiscount;
    // Pre-Tax Amount = Gross Total - Discount Amount
    let netAmount:any =  globalGrossTotal - globalDiscount;// Net Amount = Pre-tax Amount + GST ( 5% of Pre-Tax Amount )
    //this.markSoldForm.get('preTaxAmount').patchValue(parseFloat(preTaxAmount)?.toFixed(2));
    this.markSoldForm.get('netAmount').patchValue(Math.round((netAmount + Number.EPSILON)*100)/100);
    this.markSoldForm.get('sellingWeight').patchValue(Math.round((globalSellingWeight + Number.EPSILON)*100)/100);
    this.markSoldForm.get('discountAmount').patchValue(Math.round((globalDiscount + Number.EPSILON)*100)/100);
    this.markSoldForm.get('grossTotal').patchValue(Math.round((globalGrossTotal + Number.EPSILON)*100)/100);

    // if(JSON.parse(this.markSoldForm.get('withInState').value)){
    //   this.markSoldForm.get('sgst').patchValue((parseFloat(preTaxAmount)*0.025)?.toFixed(2));
    //   this.markSoldForm.get('cgst').patchValue((parseFloat(preTaxAmount)*0.025)?.toFixed(2));
    //   this.markSoldForm.get('igst').patchValue(0);
    // }else{
    //   this.markSoldForm.get('sgst').patchValue(0);
    //   this.markSoldForm.get('cgst').patchValue(0);
    //   this.markSoldForm.get('igst').patchValue((parseFloat(preTaxAmount)*0.05)?.toFixed(2));
    // }

  }

 

  noDataRouteToListingPage(){
    if(this.globalService?.tempValueData){
      this.router.navigate(['/resha-farms/pupae-order']);
    }
  }

  getPupaeBuyerList(event) {
    if(event.term.length % 2 == 0) {
      let searchParams = `(name==*${event.term.replace(/ /gi,"*")}* or phone==*${event.term.replace(/ /gi,"*")}*)`;
      this.api.getAllPupaeBuyers(false,searchParams).then(res => {
        this.pupaeBuyerList = res['content'];        
        this._cd.detectChanges();
      })
    }
    if( !event.term || event.term.length == 0) {
      this.pupaeBuyerList = [];
      this._cd.detectChanges();
    }
  }

  async getAllUsers() {
    this.usersList = [];
    this.apiService.getAllUsersList(this.globalService.pupaeRoles).then((res:any) => {
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
    this.apiService.getPupaeProcCenters().then(details => {
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

buyerCreateForm:UntypedFormGroup;
buyerFormInit(){
  this.buyerCreateForm = this.form.group({
    name: new UntypedFormControl('', Validators.required),
    phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
    center: new UntypedFormControl('', [Validators.required]),
  });
}

createGinner(buyerForm) {
  const params = {
    name: buyerForm.name,
    phone: buyerForm.phone,
    center: buyerForm.center
  }
  this.ngxLoader.stop();
  this.apiService.pupaeBuyerOnboarding(params).then(res => {
    this.modalRef.close();
    if (res) {
      this.pupaeBuyerList.push(res);
      this.markSoldForm.get('pupaeBuyer').patchValue(res['id']);
      this.buyerCreateForm.reset();
      this._cd.detectChanges();
      this.snackBar.open('Buyer Created successfully', 'Ok', {
        duration: 3000
      });
    }
  });
}

Onselectbuyer(item){
    this.markSoldForm.get('pupaeBuyer').patchValue(item.id);
    this.addressForm.addressForm.get('address').patchValue(item['address']['address']);
    this.addressForm.addressForm.get('village').patchValue(item['address']['village']);
    this.addressForm.addressForm.get('city').patchValue(item['address']['city']);
    this.addressForm.addressForm.get('district').patchValue(item['address']['district']);
    this.addressForm.addressForm.get('taluk').patchValue(item['address']['taluk']);
    this.addressForm.addressForm.get('region').patchValue(item['address']['region']);
    this.addressForm.addressForm.get('state').patchValue(item['address']['state']);
    this.addressForm.addressForm.get('pincode').patchValue(item['address']['pincode']);
    this.addressForm.addressForm.get('latitude').patchValue(item['address']['latitude']);
    this.addressForm.addressForm.get('longitude').patchValue(item['address']['longitude']);

  
}

isControlValidForReeler(controlName: string): boolean {
  const control = this.buyerCreateForm.controls[controlName];
  return control.valid && (control.dirty || control.touched);
}

isControlInvalidForReeler(controlName: string): boolean {
  const control = this.buyerCreateForm.controls[controlName];
  return control.invalid && (control.dirty || control.touched);
}

controlHasErrorForReeler(validation, controlName): boolean {
  const control = this.buyerCreateForm.controls[controlName];
  return control.hasError(validation) && (control.dirty || control.touched);
}

isControlTouchedForReeler(controlName): boolean {
  const control = this.buyerCreateForm.controls[controlName];
  return control.dirty || control.touched;
}

}
