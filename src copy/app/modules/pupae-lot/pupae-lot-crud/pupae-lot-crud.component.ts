import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SearchService } from 'src/app/services/api/search.service';
import { ApiService } from 'src/app/services/api/api.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalService } from 'src/app/services/global/global.service';
import { BankFormComponent } from 'src/app/modules/shared/bank-form/bank-form.component';
import { AddressPincodeFormComponent } from '../../shared/address-pincode-form/address-pincode-form.component';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';
@Component({
  selector: 'app-pupae-lot-crud',
  templateUrl: './pupae-lot-crud.component.html',
  styleUrls: ['./pupae-lot-crud.component.scss']
})
export class PupaeLotCrudComponent implements OnInit {
  @ViewChild(BankFormComponent,{static:true} ) bankForm : BankFormComponent;
  pupaeSupplierList:any[] = [];
  id:number;
  centerList = [];
  purchasedBy;

  pupaeTypes = [
    { value:'WetPupae',displayName:'WetPupae'},
    { value:'SDFull',displayName:'SDFull'},
    { value:'SD_Crushed',displayName:'SD_Crushed'},
    { value:'Semi_Clean',displayName:'Semi_Clean'},
    { value:'OD_Full',displayName:'OD_Full'},
    { value:'Sundry_Semi',displayName:'Sundry_Semi'},

    { value:'SILK_SHEET',displayName:'Silk Sheet'},
    { value:'TEASING_POWDER',displayName:'Teasing Powder'},
    { value:'TEASING_POWDER_FULL_CLEAN',displayName:'Teasing Powder_Full Clean'},
    { value:'CUT_COCOONS',displayName:'Cut Cocoons'},
    { value:'PUPAE_POWDER',displayName:'Pupae Powder'},
    { value:'SILK_WASTE_JOTE',displayName:'Silk Waste-Jote'},

  ]
  constructor(private apiSearch:SearchService,private _cd:ChangeDetectorRef,private api:ApiService,private snackBar:MatSnackBar,private router:Router,private route:ActivatedRoute,private modalService:NgbModal,
    private form:UntypedFormBuilder,private ngxLoader:NgxUiLoaderService, private globalService:GlobalService) { }

  pupaeCreateForm:UntypedFormGroup = new UntypedFormGroup({
    uom:new UntypedFormControl('KGS'),
    type:new UntypedFormControl('',[Validators.required]),
    code:new UntypedFormControl(),
    centerId:new UntypedFormControl(null,[Validators.required]),
    quantity:new UntypedFormControl(null,[Validators.required]),
    pricePerKg:new UntypedFormControl(null,[Validators.required]),
    grossTotal:new UntypedFormControl(null),
    outOfState:new UntypedFormControl(true,[Validators.required]),
    gst:new UntypedFormControl(null),
    cst:new UntypedFormControl(null),
    igst:new UntypedFormControl(null),
    netPaybleAmount:new UntypedFormControl(null,[Validators.required]),
    logisticsCost:new UntypedFormControl(0),
    creditDays:new UntypedFormControl(1,[Validators.required]),
    pupaeSupplier:new UntypedFormControl(null),
    rmRepresentative:new UntypedFormControl(null,[Validators.required]),

    // sellingPricePerKg:new FormControl(),
    
  });

  ngOnInit(): void {
    this.getCenters();
    this.listenForPupaeSupplierList();
    const { id } = this.route.snapshot.params;
    this.id = id;
    this.pupaeCreateForm.get('pupaeSupplier').setValidators(this.id?[]:[Validators.required]);
    this.pupaeCreateForm.get('pupaeSupplier').updateValueAndValidity();
    this.id&&this.getPupaeDetailsById(this.id);
    this.supplierFormInit();
    this.getAllUsers();
  }

  onSubmit(data){
    console.log(this.pupaeCreateForm)
    if(this.id){
      let payload = this.buildPayload(data);
      delete payload['pupaeSupplier']
      this.updatePupaeLot(payload);
    }else{

      let payload = this.buildPayload(data);
      payload["rmRepresentativeName"] = payload['rmRepresentative']?.name;
      payload["rmRepresentativePhone"] = payload['rmRepresentative']?.phone;
      payload['availableQuantity'] = payload['quantity'];
      payload['dueAmount'] = payload['netPaybleAmount'];
      payload['sellingPricePerKg'] = payload['pricePerKg'] + (payload['pricePerKg']*0.05)//) 5% Up tick
      payload['inventoryStatus'] = 'New';
      payload['paymentStatus'] = 'Pending';
      payload['orderStatus'] = 'New';
      this.createPupaeLot(payload);
    }
   console.log(data)
  }

  buildPayload(data){
    let payload = data;

    const bankDetails = {
      accountNumber: this.bankForm.bankForm.value.accountNumber.trim(),
      beneficiaryName: this.bankForm.bankForm.value.beneficiaryName,
      ifscCode: this.bankForm.bankForm.value.ifscCode.trim(),
      bankName: this.bankForm.bankForm.value.bankName,
      branchName: this.bankForm.bankForm.value.branchName,
    }
    payload['bank'] = bankDetails;
    payload["pupaeSupplier"] = `pupaesupplier/${data['pupaeSupplier']}`;
    return payload;
  } 


  updatePupaeLot(payload:any){
    this.apiSearch.updatePupaeLot(this.id,payload).then(res=>{
      this.snackBar.open('Lot Updated successfully', 'Ok', {
        duration: 3000
      });
      this.router.navigate(['/resha-farms/rm-pupae-lot'])
    }).catch(err=>{
      this.snackBar.open('Some thing went wrong', 'Ok', {
        duration: 3000
      });
    })
  }
  
createPupaeLot(payload:any){
  this.apiSearch.createPupaeLot(payload).then(res=>{
    this.snackBar.open('Lot Created successfully', 'Ok', {
      duration: 3000
    });
    this.router.navigate(['/resha-farms/rm-pupae-lot'])
  }).catch(err=>{
    this.snackBar.open('Some thing went wrong', 'Ok', {
      duration: 3000
    });
  })
}

  listenForPupaeSupplierList(){
    this.pupaeCreateForm.get('quantity').valueChanges.subscribe(res=>{
      this.calculateTheLogic();
    });
    this.pupaeCreateForm.get('pricePerKg').valueChanges.subscribe(res=>{
      this.calculateTheLogic();
    });
    this.pupaeCreateForm.get('outOfState').valueChanges.subscribe(res=>{
      this.calculateTheLogic();
    });
  }

  calculateTheLogic(){
    const  quantity = this.pupaeCreateForm.get("quantity").value;
    const  pricePerKg = this.pupaeCreateForm.get("pricePerKg").value;
    console.log(this.pupaeCreateForm.value)
    this.pupaeCreateForm.get("grossTotal").patchValue((quantity*pricePerKg)?.toFixed(2));// Gross Total = Quantity * Rate/KG
    this.pupaeCreateForm.get("netPaybleAmount").patchValue((quantity*pricePerKg)?.toFixed(2)); 
    //this.pupaeCreateForm.get("netPaybleAmount").patchValue(((quantity*pricePerKg)+(quantity*pricePerKg*0.05)).toFixed(2)); // Net Payable Amount = Gross total + GST ( 5% of Gross Total) + Coupon Amount
    // this.pupaeCreateForm.get("sellingPricePerKg").patchValue(((pricePerKg*0.05)+pricePerKg)?.toFixed())
    // this._cd.detectChanges();
  const grossTotal = this.pupaeCreateForm.get("grossTotal").value;
   if(JSON.parse(this.pupaeCreateForm.get("outOfState").value)){
    this.pupaeCreateForm.get("gst").patchValue((grossTotal*0.025)?.toFixed())
    this.pupaeCreateForm.get("cst").patchValue((grossTotal*0.025)?.toFixed())
    this.pupaeCreateForm.get("igst").patchValue(0)
   }else{
    this.pupaeCreateForm.get("gst").patchValue(0)
    this.pupaeCreateForm.get("cst").patchValue(0)
    this.pupaeCreateForm.get("igst").patchValue((grossTotal*0.05)?.toFixed())
   }

  }
  usersList:any[] = [];
  async getAllUsers() {
    this.usersList = [];
    this.api.getAllUsersList(this.globalService.pupaeRoles).then((res:any) => {
      if (res['_embedded']['user'] && res['_embedded']['user'].length) {
        this.usersList = res['_embedded']['user'];
      } else {
        this.usersList = [];
      }
      this._cd.detectChanges();
    });
  }


  getPupaeSupplierList(event){
    if(event.term.length % 2 == 0) { //name==*${event.term.replace(/ /gi,"*")}* or (removed as per deepak)
      let searchParams = `(phone==*${event.term.replace(/ /gi,"*")}*)`;
      this.apiSearch.getAllPupaeSuppliers(false, searchParams).then(res => {
        this.pupaeSupplierList = res['content'];
        this._cd.detectChanges();
      })
    }
    if( !event.term || event.term.length == 0) {
      this.pupaeSupplierList = [];
      this._cd.detectChanges();
    }
  }

  getPupaeDetailsById(id:number){
   this.apiSearch.getPupaeDetailsById(id).then(res=>{
     this.pupaeCreateForm.patchValue(res);
    //  this.bankForm.bankForm.get('beneficiaryName').patchValue(res['pupaeListObject']['beneficiaryName'])
    //  this.bankForm.bankForm.get('bankName').patchValue(res['pupaeListObject']['bankName'])
    //  this.bankForm.bankForm.get('accountNumber').patchValue(res['pupaeListObject']['accountNumber'])
    //  this.bankForm.bankForm.get('ifscCode').patchValue(res['pupaeListObject']['ifscCode'])
    //  this.bankForm.bankForm.get('branchName').patchValue(res['pupaeListObject']['branchName'])
     res['purchasedByName']&&res['purchasedByPhone'] &&(this.purchasedBy = res['purchasedByName']+' - '+res['purchasedByPhone']);
     this._cd.detectChanges();
   })
  }

  onSupplierSelection(id:number){
    let pupaeListObject =this.pupaeSupplierList.find(ele=>ele.id==id);
    
    pupaeListObject?.bankDetails.length && (this.bankForm.bankForm.patchValue(pupaeListObject?.bankDetails[0]));
    this.pupaeCreateForm.get('centerId').patchValue(pupaeListObject?.center);
  }

  clearAllTheData(){
    this.pupaeCreateForm.get('centerId').patchValue(null);
    this.pupaeCreateForm.get('bank').patchValue({
      accountNumber:null,
      beneficiaryName:null,
      ifscCode:null,
      bankName:null
    });
  }

  async getCenters() {
    this.api.getPupaeProcCenters().then(details => {
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
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

supplierCreateForm:UntypedFormGroup;
supplierFormInit(){
  this.supplierCreateForm = this.form.group({
    name: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace, Validators.pattern("^[A-Za-z ]+$")]),
    phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
    center: new UntypedFormControl('', [Validators.required]),
  });
}

createGinner(supplierForm) {
  // const bank = {
  //   accountNumber: this.bankForm.bankForm.value.accountNumber,
  //   beneficiaryName: this.bankForm.bankForm.value.beneficiaryName,
  //   ifscCode: this.bankForm.bankForm.value.ifscCode,
  //   bankName: this.bankForm.bankForm.value.bankName,
  //   branchName: this.bankForm.bankForm.value.branchName,
  // }
  const params = {
    name: supplierForm.name,
    phone: supplierForm.phone,
    center: supplierForm.center,
    // bankDetails : [bank],
  }
  this.ngxLoader.stop();
  this.api.pupaeSupplierOnboarding(params).then(res => {
    this.modalRef.close();
    if (res) {
      this.pupaeSupplierList.push(res);
      this.pupaeCreateForm.get('pupaeSupplier').patchValue(res['id']);
      this.supplierCreateForm.reset();
      this._cd.detectChanges();
      this.snackBar.open('Supplier Created successfully', 'Ok', {
        duration: 3000
      });
    }
  });
}

isControlValidForReeler(controlName: string): boolean {
  const control = this.supplierCreateForm.controls[controlName];
  return control.valid && (control.dirty || control.touched);
}

isControlInvalidForReeler(controlName: string): boolean {
  const control = this.supplierCreateForm.controls[controlName];
  return control.invalid && (control.dirty || control.touched);
}

controlHasErrorForReeler(validation, controlName): boolean {
  const control = this.supplierCreateForm.controls[controlName];
  return control.hasError(validation) && (control.dirty || control.touched);
}

isControlTouchedForReeler(controlName): boolean {
  const control = this.supplierCreateForm.controls[controlName];
  return control.dirty || control.touched;
}
}
