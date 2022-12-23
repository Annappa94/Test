import { ChangeDetectorRef, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { BankServiceService } from 'src/app/services/api/bank-service.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { GoogleAnalyticsService } from 'ngx-google-analytics';


@Component({
  selector: 'bank-form',
  templateUrl: './bank-form.component.html'
})
export class BankFormComponent implements OnInit{

  @Input()
  layouttype:String;

  @Input()
  accname:boolean;

  @Input()
  accnumber:boolean;

  @Input()
  ifsccode:boolean;

  @Input()
  bankname:boolean;

  @Input()
  branchname:boolean;

  @Input()
  showHideButton:boolean;

  @Input()
  customerId:Number;

  @Input()
  customerType:String;

  @Input()
  productType:String;

  @Input()
  isVerfied:boolean;

  @Output()
  bankVerified = new EventEmitter<any>();

 
  bankForm: UntypedFormGroup;
  bankInformation:any;


  constructor(
    private api: ApiService,
    private bankService: BankServiceService,
    private _cd: ChangeDetectorRef,
    private form: UntypedFormBuilder,
    private ngxLoader: NgxUiLoaderService,
    private snackBar: MatSnackBar,
    private toaster:ToastrService,
    private $gaService:GoogleAnalyticsService,


  ) {
    this.layouttype = 'popup';
    this.showHideButton = false;
   }

  ngOnInit(): void {
    this.createBankForm();
  }


  createBankForm(){
    let validator = [Validators.required];
    this.bankForm = this.form.group({
        beneficiaryName: new UntypedFormControl('', this.accname? [Validators.required]: []),
        accountNumber: new UntypedFormControl('',this.accnumber? [Validators.required]: []),
        ifscCode: new UntypedFormControl('',this.ifsccode? [Validators.required]: []),
        bankName:new UntypedFormControl('', this.bankname? [Validators.required]: []),
        branchName: new UntypedFormControl('',this.branchname? [Validators.required]: [])
      })
  }



  getBankInfo() {
    if (this.bankForm.get('ifscCode').value) {
        this.ngxLoader.stop();
      this.bankService.getBankDetailsByIfscCode(this.bankForm.get('ifscCode').value).then(bankInfo => {
        console.log(bankInfo);
        // this.bankInformation = bankInfo['content'];
        this.bankForm.get('bankName').patchValue(bankInfo?.['BANK']);
        this.bankForm.get('branchName').patchValue(bankInfo?.['BRANCH']);
        if (bankInfo == null) {
          this.snackBar.open('Kindly Enter Valid IFSC Code', 'Ok', {
            duration: 3000
           
          });          
        }
      })
    }
  }

  verifyBankInfo(){
    this.ngxLoader.stop();
    let reqOBJ={
      productType:this.productType,
      customerId:this.customerId, 
      customerType:this.customerType, 
      accountNumber:this.bankForm.value.accountNumber, 
      bankName:this.bankForm.value.bankName, 
      ifscCode:this.bankForm.value.ifscCode, 
      name: this.bankForm.value.beneficiaryName,
      branchName: this.bankForm.value.branchName,
      beneficiaryName:this.bankForm.value.beneficiaryName,
    }
    this.bankService.validateBankAccount(reqOBJ).then((response:any)=>{
      if (response?.responseCode == 200) {//success
        this.toaster.success(response?.message, 'OK', {
          timeOut: 3000
        });
        this.bankVerified.emit(true);
        this.$gaService.event('Penny Drop Validation', ` customerId =  ${this.customerId}, customerType = ${this.customerType}`);

        // window.location.reload();
      }
      if (response?.responseCode == 409) {
         this.toaster.error(response?.message, 'Ok', {
          timeOut: 3000
        });
        this.showHideButton=true;
      }
    })
  }


}