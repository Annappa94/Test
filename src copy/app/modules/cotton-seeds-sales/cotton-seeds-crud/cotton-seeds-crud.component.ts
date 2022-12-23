import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { distinctUntilChanged, distinctUntilKeyChanged } from 'rxjs/operators';
import { S3UrlResponse } from 'src/app/model/types/type.model';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { BankFormComponent } from 'src/app/modules/shared/bank-form/bank-form.component';
import { AddressPincodeFormComponent } from 'src/app/modules/shared/address-pincode-form/address-pincode-form.component';
import { SearchService } from 'src/app/services/api/search.service';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';
import { ToastrService } from 'ngx-toastr';
import { CottonApiService } from 'src/app/services/api/cotton-api.service';

@Component({
  selector: 'app-cotton-seeds-crud',
  templateUrl: './cotton-seeds-crud.component.html',
  styleUrls: ['./cotton-seeds-crud.component.scss']
})
export class CottonSeedsCrudComponent implements OnInit {
  @ViewChild(BankFormComponent, { static: false }) bankForm: BankFormComponent;
  @ViewChild('mutliGSTAdds') mutliGSTAdds: ElementRef;
  @ViewChild('gstInactiveStatus') gstInactiveStatus: ElementRef;
  modalRef: any;
  closeResult: string;
  warehouseList: any;
  oilMillList: any;
  modelImageUrl: any;
  expandImage: boolean;
  id:any;
  selectedGstStatus: any;
  selectedSpinningMill: any;
  selectedStatus: any;
  gstDetails: any;
  WeightCalculate: number;
  grosstotal: any;
  grosstotalAmount: number;
  taxAmount: number;
  payment:any;
  pretaxAmount: number;
  ginnerData: any;
  centerList: any=[];

  createSeedsForm:UntypedFormGroup = new UntypedFormGroup({
    selectedOilMill:new UntypedFormControl(),
    centerId: new UntypedFormControl('',[Validators.required]),
    ginner: new UntypedFormControl('',[Validators.required]),
    grade: new UntypedFormControl('',[Validators.required]),
    recivedWeight: new UntypedFormControl(),
    sellingPricePerKg: new UntypedFormControl(),
    grossTotal:new UntypedFormControl(),
    hamaliDeduction: new UntypedFormControl(0),
    weighBridgeCharges:new UntypedFormControl(0),
    cgst: new UntypedFormControl(0),
    sgst: new UntypedFormControl(0),
    igst: new UntypedFormControl(0),
    netAmount:new UntypedFormControl(),
    creditDays: new UntypedFormControl('',[Validators.required]),
    availableWeight:new UntypedFormControl(),
    billingAddress:new UntypedFormControl(),
    deduction:new UntypedFormControl(),
    actualWeight:new UntypedFormControl(),
    sellingPrice:new UntypedFormControl(),
    pretaxAmount: new UntypedFormControl(),
    representative:new UntypedFormControl(),
    buyingPrice:new UntypedFormControl(),
    finalreciveweight:new UntypedFormControl(),
    termesandCondition:new UntypedFormControl(),
    withInState:new UntypedFormControl(),
    rmRepresentative:new UntypedFormControl('',),
    HSNCode:new UntypedFormControl('1207'),
    rmRepresentativeName: new UntypedFormControl(),
    rmRepresentativePhone:new UntypedFormControl(),

  })
  bankDetails: any;
  selectedCenter: any;
  selectedGinner: any;
  selectedCenterGstNumber: any;
  selectedGinnerGstNumber: any;
  withInState: boolean;
  usersList: any[];
  selectedSeedlotData: any;
  BankVerified: any;
  queryParams: Params;
  constructor(
    private api: ApiService,
    private cottonApi: CottonApiService,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private modalService: NgbModal,
    private form: UntypedFormBuilder,
    private route:ActivatedRoute,
    private snackBar:MatSnackBar,
    private toaster:ToastrService,
    private _cd: ChangeDetectorRef,
    private globalService: GlobalService,

  ) { 
    
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.getSeedsDataById()
      }
    });
    this.getCenters()
    this.withInState = true;
    this.getAllUsers();
  }



  ngOnInit(): void {
  }


  async getAllUsers() {
    this.usersList = [];
    this.ngxLoader.start();
    this.api.getAllUsersList(this.globalService.cottonRoles).then((res: any) => {
      if (res['_embedded']['user'] && res['_embedded']['user'].length) {
        this.usersList = res['_embedded']['user'];
      } else {
        this.usersList = [];
      }
      this._cd.detectChanges();
      this.ngxLoader.stop();
    });
  }
  
  async getCenters() {
    this.api.getCottonProcCenters().then(details => {
        this.centerList = [];
        this.centerList = details['_embedded']['center'];      
      this._cd.detectChanges();
    }, err => {
    });
  }

  getSeedsDataById(){
    this.cottonApi.getCottonSeedsById(this.id).then(res=>{
      this.createSeedsForm.patchValue(res);
      this.selectedSeedlotData = res;
      this.createSeedsForm.get('centerId').patchValue(res['centerId'])
      this.createSeedsForm.get('ginner').patchValue(res['ginnerObj']['id'])
      this.createSeedsForm.get('HSNCode').patchValue(res['hsnCode'])
      this.createSeedsForm.get('grade').patchValue(res['rmGrade'])
      this.createSeedsForm.get('recivedWeight').patchValue(res['receivedWeight'])
      this.createSeedsForm.get('sgst').patchValue(res['sgst'])
      this.createSeedsForm.get('deduction').patchValue(res['weightDeduction'])
      this.createSeedsForm.get('finalreciveweight').patchValue(res['lotWeight'])
      this.createSeedsForm.get('grossTotal').patchValue(res['grossAmount'])
      this.createSeedsForm.get('buyingPrice').patchValue(res['pricePerKg'])
      this.createSeedsForm.get('hamaliDeduction').patchValue(res['hamaliDeduction'])
      this.createSeedsForm.get('recivedWeight').patchValue(res['receivedWeight'])
      this.createSeedsForm.get('termesandCondition').patchValue(res['termsAndConditions'])
      this.createSeedsForm.get('creditDays').patchValue(res['creditDays'])
      this.createSeedsForm.get('weighBridgeCharges').patchValue(res['weighBridgeCharges'])
      this.createSeedsForm.get('pretaxAmount').patchValue(res['netPayableAmount'])
      console.log(res);
    })
  }  

  getGinnerList(event) {
    if(event.term.length % 2 == 0) {
      let searchParams = `(name==*${event.term.replace(/ /gi,"*")}* or phone==*${event.term.replace(/ /gi,"*")}*)`;
      this.api.getAllInactiveContractGinners().then(res => {
        this.ginnerData = res['content'];
        this._cd.detectChanges();
      })
    }
    if( !event.term || event.term.length == 0) {
      this.ginnerData = [];
      this._cd.detectChanges();
    }
  }

  async onChangeCenter(event) {  
    this.selectedCenter = event.target.value;
    console.log(this.selectedCenter);
    this.api.getCenterById(this.selectedCenter).then(res => {
      console.log(res);
      this.selectedCenterGstNumber = res ? res['gstNumber'] : '';
      this.updateTheStateData();
    });
  }

  onChangeGinner(event,Bankverification){
    this.api.getGinnerDetailsById(event).then((response:any)=>{
      console.log('ginner====>',response);
      this.selectedGinner = response;
      this.selectedGinnerGstNumber = response ? response['gstNumber'] : '';
      this.bankDetails = this.selectedGinner?.bankDetails[0];
      this.BankVerified = this.bankDetails?.verified;
      this.bankForm?.bankForm.patchValue(this.selectedGinner?.bankDetails[0]);
      console.log(this.bankDetails);
      if (this.BankVerified == false) {
        this.modalRef = this.modalService.open(Bankverification)
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed`;            
        });
      }
      
      this.updateTheStateData(); 
      this._cd.detectChanges();

    })
  }

  proceedToKyc(){
    this.modalRef.close();
    // this.router.navigate(['/kyc-form/'+this.selectedFarmer+'/farmer/Company']);
      this.router.navigate(['/resha-farms/ginners/crud/'+this.selectedGinner?.id],{queryParams:{redirecto:'ginner-crud'}})
    
  }
  doNotProceed() {
    this.modalRef.close();
    // this.selectedFarmer = '';
    // this.lotCreateForm.reset();
    // this.router.navigate(['/cocoon-lot']);
  }

  updateTheStateData(){
    if (this.selectedCenterGstNumber != undefined && this.selectedGinnerGstNumber != undefined) {
      if (this.selectedCenterGstNumber.substr(0,2) == this.selectedGinnerGstNumber.substr(0,2)) {        
        this.withInState = true;
      } else {
        this.withInState = false;
      }
      this._cd.detectChanges();
      this.priceCalculation();
    }
    
  }

  async onChangeOilMill(event,payment) {
    this.selectedStatus = event.target.value; 
    this.modalRef = this.modalService.open(payment)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });   
    if (this.selectedStatus == undefined) {
      this.selectedStatus = ''
    }
  }

  priceCalculation(){
    this.WeightCalculate= this.createSeedsForm.value.recivedWeight-this.createSeedsForm.value.deduction
    console.log(this.WeightCalculate)
    this.createSeedsForm.get('finalreciveweight').patchValue(this.WeightCalculate)
    this.createSeedsForm.get('actualWeight').patchValue(this.WeightCalculate)
    this.grosstotalAmount= (this.createSeedsForm.value.finalreciveweight)*(this.createSeedsForm.value.buyingPrice)
    console.log('grosstoatl====>',this.grosstotalAmount);
    
    this.createSeedsForm.get('grossTotal').patchValue(this.grosstotalAmount)
    console.log(this.createSeedsForm.get('grossTotal').patchValue(this.grosstotalAmount));

    //this.taxAmount=this.createSeedsForm.value.grossTotal-this.createSeedsForm.value.deduction
    this.createSeedsForm.get('pretaxAmount').patchValue(this.grosstotalAmount + (this.grosstotalAmount * 0.05))

    if (this.withInState) {
      this.createSeedsForm.get('cgst').patchValue((this.grosstotalAmount* 0.025)?.toFixed(2))
      this.createSeedsForm.get('sgst').patchValue((this.grosstotalAmount* 0.025)?.toFixed(2))
      this.createSeedsForm.get('igst').patchValue(0)
    } else {
      this.createSeedsForm.get('cgst').patchValue(0)
      this.createSeedsForm.get('sgst').patchValue(0)
      this.createSeedsForm.get('igst').patchValue((this.grosstotalAmount* 0.05)?.toFixed(2))
    }
    this._cd.detectChanges();

    // this.createSeedsForm.get('cgst').patchValue(this.pretaxAmount)
    // this.createSeedsForm.get('sgst').patchValue(this.pretaxAmount)
    // this.createSeedsForm.get('igst').patchValue((this.createSeedsForm.value.pretaxAmount*5)/100)

  }

  //Create cotton seeds sales order

  createCottonSalesOrder(data){
    const payload= {
      "centerId":parseInt(this.createSeedsForm.value.centerId),
      "receivedWeight": parseInt(this.createSeedsForm.value.recivedWeight),
      "weightDeduction": parseInt(this.createSeedsForm.value.deduction),
      "lotWeight": parseInt(this.createSeedsForm.value.finalreciveweight),
      "pricePerKg": parseInt(this.createSeedsForm.value.buyingPrice),
      "grossTotal": (this.createSeedsForm.value.grossTotal),
      "sgst": parseFloat(this.createSeedsForm.value.sgst),
      "cgst":parseFloat(this.createSeedsForm.value.cgst),
      "igst": parseFloat(this.createSeedsForm.value.igst),
      "netPayableAmount": parseInt(this.createSeedsForm.value.pretaxAmount),
      "withInState": this.withInState,
      "status": "AVAILABLE",
      //  bankDetails :[this.bankDetails],
      bankDetails :null,
      "isDisplayActive": false,
      "paymentStatus": "PENDING",
      "termsAndConditions": this.createSeedsForm.value.termesandCondition,
      "rmGrade":this.createSeedsForm.value.grade,
      "hsnCode":"1207",
      "hamaliDeduction":parseInt(this.createSeedsForm.value.hamaliDeduction),
      "weighBridgeCharges":parseInt(this.createSeedsForm.value.weighBridgeCharges),
      "creditDays":parseInt(this.createSeedsForm.value.creditDays),
      "ginner": "/ginner/"+ this.createSeedsForm.value.ginner,
      "rmRepresentativeName": "",
      "rmRepresentativePhone": "",
      
    } 
    payload["rmRepresentativeName"] = this.createSeedsForm.value['rmRepresentative']?.name;
    payload["rmRepresentativePhone"] = this.createSeedsForm.value['rmRepresentative']?.phone;

    if (this.id) {
      this.cottonApi.patchSeedsOrderById(this.id,payload).then(res=>{
        console.log(res);
        this.toaster.success('Cotton Seeds Sales Order Updated successfully', 'Ok', {
          timeOut: 3000,
        })
        this.router.navigate(['/resha-farms/Cotton-Seeds-purchase']);
      })
    } else {
      this.cottonApi.createSeedsPurchaseOrder(payload).then(res=>{
        this.toaster.success('Cotton Seeds Sales Order Created successfully', 'Ok', {
          timeOut: 3000,
        })
        this.router.navigate(['/resha-farms/Cotton-Seeds-purchase']);
      })
    }
  }  

  goBack() {
    this.router.navigate(['/resha-farms/Cotton-Seeds-purchase']);
  }
     
  
}