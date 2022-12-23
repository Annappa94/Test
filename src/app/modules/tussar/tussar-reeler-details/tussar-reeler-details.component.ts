// import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api/api.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from 'src/app/services/api/search.service';
import { SETTLEMENT_STATUS } from 'src/app/constants/enum/mudra.constant';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';

@Component({
  selector: 'app-tussar-reeler-details',
  templateUrl: './tussar-reeler-details.component.html',
  styleUrls: ['./tussar-reeler-details.component.scss']
})
export class TussarReelerDetailsComponent implements OnInit {

  searchText = '';
  isTableLoaded = false;
  reelerDetails = null;
  id;
  reelerOrdersList = [];
  paymentDetail;
  modalRef: any;
  closeResult: string;
  reelerPaymentForm: UntypedFormGroup;
  depositFormGroup: UntypedFormGroup;
  reelerKhataList: any[];
  khataSearchText = ''
  centerName: any;
  user: any;
  reelerBankDetails;
  reelerYarnKhataList: any = [];
  searchYarnKhata = '';
  imageUploaded = false;
  imageFile = null;
  reeler:any;
  isRefDisabled=false;
  previewImage: string | ArrayBuffer;

  statusList = {...SETTLEMENT_STATUS}

  listOfSettelmentStatus = this.statusList.ACTIVE;

  statusDisplay:string;

  status:UntypedFormControl = new UntypedFormControl();
  mudraId:number;
  getDepositeType:any[]=[];
  @ViewChild('productPopupOpen')
  productLoanType:any

   @ViewChild('popupOpenSettle')
   statusPopup:any;
   statusType : any;
   userStatus : any;
   createStatusForm : UntypedFormGroup;
   productTypeList: any;
   depositTypeList:any;

  refreshOtherComponent:boolean = false;

  masterDataFromLoans:any;
  minDate
  maxDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    public router: Router,
    private utils: UtilsService,
    private modalService: NgbModal,
    private form : UntypedFormBuilder,
    private snackBar: MatSnackBar,
    public rolesService: RolesService,
    private ngxLoader : NgxUiLoaderService,
    private dialog:MatDialog,
    private apiSearch:SearchService
  ) {

    this.user = JSON.parse(localStorage.getItem('_ud'));
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
      }
      this.mudraId = params?.mudraId;
    });

    this.getReelerById(this.id);
    this.reelerPaymentForm = form.group({
      amount: new UntypedFormControl('', [Validators.required]),
      referenceNumber: new UntypedFormControl('', [Validators.required])
    })
    this.depositFormGroup = form.group({
      amount: new UntypedFormControl('', [Validators.required]),
      valueDate: new UntypedFormControl(''),
      referenceNumber: new UntypedFormControl(''),
      depositType: new UntypedFormControl(''),
      // referenceUrl: new FormControl('')

    })
    this.createStatusForm = this.form.group({
      settlementAmount: new UntypedFormControl('',[Validators.required,CustomValidator.cannotContainOnlySpace]),
      referenceNum: new UntypedFormControl('',[Validators.required,CustomValidator.cannotContainOnlySpace]),
      modeOfPayment: new UntypedFormControl('',[Validators.required,CustomValidator.cannotContainOnlySpace]),
      remarks: new UntypedFormControl('')
    });
    
  }

  noOfKYCDocs;
  kycFlag = false;
  ngOnInit(): void {
    this.api.getAllFarmerKycDocList(this.id , 'reeler').then(res => {
      this.noOfKYCDocs = res['_embedded']['reelerkyc'];
      if(this.noOfKYCDocs.length  > 0){
        this.kycFlag = true;
      }
    });
    this.getAllCustomerTypes();
    this.masterInformation();
    this.userStatus = JSON.parse(localStorage.getItem("_ud")).roles;
    this.getStatus()
    this.getLoanProduct();
    this.getDepositeTypeList();

  }
  selectCustomerBoolean = false;
  kycCustomerTypes:any = [];
  selectedCustomerType = '';
  getAllCustomerTypes(){
    this.api.getAllCustomerTypes().then(res => {
      this.kycCustomerTypes = res['_embedded']['kyccustomer'];
      //this.onSelectOfCustomerType(this.selectedCustomerType);
      this._cd.detectChanges();
    });
  }
  onSelectOfCustomerType(item, contentDelete) {
    this.selectedCustomerType = item;
    if(contentDelete){
      this.modalRef = this.modalService.open(contentDelete)
      this.modalRef.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed`;
      });
    
    }
  }
  ConfirmDeleteRecord(){
    const params = {
      customerType:'/kyccustomer/' + this.selectedCustomerType,
    }
    this.api.putReeler(this.id,params).then(res=>{
      this.getReelerById(this.id);
    })
    this.api.deleteKYCByPerforma('reeler', this.id).then(res=>{
      if(res){
        this.selectCustomerBoolean = false;
        this.ngOnInit();
        this.modalRef.close()
        
      }
    })
  }
  selectCustomerType(){
    this.selectCustomerBoolean = true;

  }
  title='';
  async getReelerById(id) {
    this.ngxLoader.stop();
    this.api.getReelerById(id).then(res => {
      this.reelerDetails = res['reeler'];
      this.centerName = res['centerName']
      if(this.reelerDetails.name) {
        this.reelerDetails.initial = this.reelerDetails.name.match(/(^\S\S?|\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
      }
      this.reelerBankDetails = this.reelerDetails.bankDetails.length ? this.reelerDetails.bankDetails[0] : {};
      this.previewImage = res['reeler']['profilePicUrl'];
      this.reelerDetails.appVersion = res['mobileInformation'] ? res['mobileInformation']['version'] : ''

      this.getCocoonOrderListOfReeler();
      this.reelerYarnKhata();
      // this.reelerCocoonKhata();
      this.title = this.reelerDetails['creditLimit']>0?`Update Credit Amount for ${this.reelerDetails.code}`:`Assign Credit Amount ${this.reelerDetails.code}`
      this._cd.detectChanges();
    });
  }

  remove(){
    this.previewImage = undefined;
    this.imageUploaded = false;
    this.imageFile = null;
    const params = {
      profilePicUrl: null
    }
    this.ngxLoader.stop();
    this.api.putReeler(this.id, params).then(res => {
      this.getReelerById(this.id);
    })
  }
  
  onImageUpload(image){
    this.imageFile = image;
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file);
      this.imageUploaded = true;
      
    this.ngxLoader.stop();
      this.api.uploadProfileImages(this.imageFile.target.files[0], this.id, 'REELER').then(res => {
        //console.log(res);        
        if(res){
          this.snackBar.open('Image uploaded successfully', 'OK', {
            duration: 3000
          })
        }
      })
    }
  }
  async getCocoonOrderListOfReeler() {
    this.api.getOrdersOfReeler(this.reelerDetails.id).then(res => {
      if (res && res['_embedded']['cocoonorder']) {
        const ordersList = res['_embedded']['cocoonorder'];
        this.reelerOrdersList = [];
        for (let i = 0; i < ordersList.length; i++) {
            this.reelerOrdersList.push({
              id: ordersList[i].id,
              code: ordersList[i].code,
              createdDate: ordersList[i].createdDate ? this.utils.getDisplayTime(ordersList[i].createdDate) : '-',
              totalAmount: ordersList[i].totalAmount.toLocaleString('en-IN'),
              totalWeight: ordersList[i].totalWeight,
              displayDueAmt: ordersList[i].dueAmount ? ordersList[i].dueAmount.toLocaleString('en-IN') : '0',
              dueAmount: Math.round(ordersList[i].dueAmount),
              sellingPricePerKg: Math.round(ordersList[i].sellingPricePerKg),
              orderPaymentStatus: ordersList[i].orderPaymentStatus,
              reelerId: ordersList[i].reelerId
            })
            this._cd.detectChanges();
        }

      } else {
        this.reelerOrdersList = [];
        this._cd.detectChanges();
      }
    })
  }

  payNow(payment, item) {
    this.paymentDetail = item;
    this.reelerPaymentForm.controls['amount'].setValue(item.dueAmount);
    this.reelerPaymentForm.controls['referenceNumber'].setValue('');
    this.api.getReelerById(item.reelerId).then((res:any)=>{
      this.reeler=res.reeler;
      if(this.reeler.availableAdvance>0){
        this.reelerPaymentForm.get('referenceNumber').patchValue(`from advance available ${this.reeler.availableAdvance}`);
        this.isRefDisabled=true;
      }
      this.modalRef = this.modalService.open(payment)
    });
    this.modalRef.result.then((result) => {
      this.isRefDisabled=false;
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  showDetails(content, item) {
    this.reelerCocoonKhata(item.id, content);
  }

  reelerPayment() {
    if (this.reelerPaymentForm.value.amount && this.reelerPaymentForm.value.referenceNumber) {
      const reqObj = {
        amount: this.reelerPaymentForm.value.amount,
        referenceNumber: this.reelerPaymentForm.value.referenceNumber,
        paymentOn: Date.parse(new Date().toString()),
        cocoonOrder: 'cocoonorder/' + this.paymentDetail.id,
        reeler: '/reeler/' + this.reelerDetails.id,
        screenshotUrl: null
      }
      this.ngxLoader.stop();
      this.api.payReelerDueAmount(reqObj).then(response => {
        // this.reelerCocoonKhata();
        this.getCocoonOrderListOfReeler();
        this.modalRef.close();
        this.snackBar.open('Payment of Rs. ' + reqObj.amount + ' Done Succesfully', 'Ok', {
          duration: 3000
        });
        this.reelerPaymentForm.controls['referenceNumber'].setValue('');
        this.reelerPaymentForm.controls['amount'].setValue('');
      }, err => {
        console.log(err);
      })
    } else {
      this.snackBar.open('Please Enter Amount and Reference Number', 'Ok', {
        duration: 3000
      });
    }
  }

  navigateToKyc(){

    if(this.reelerDetails.customerTypeName){
      this.router.navigate(['/resha-farms/kyc-form', this.id, 'reeler',this.reelerDetails.customerTypeName])
    } else {
      this.snackBar.open( 'Please select customer type.', 'OK', {
        duration: 300
      })
    }
  }

  reelerCocoonKhata(id, content) {
    this.reelerKhataList = [];
    // if (this.reelerDetails.id) {
    this.api.getReelerKhata(id).then(res => {
      if (res) {
        const khataList = res['_embedded']['reelerpayment'];
        if (khataList.length) {
          for (let i = 0; i < khataList.length; i++) {
            this.reelerKhataList.push({
              amount: khataList[i].amount,
              lastModifiedDate: this.utils.getDisplayTime(khataList[i].lastModifiedDate),
              referenceNumber: khataList[i].referenceNumber
            })
          }
          this.modalRef = this.modalService.open(content)
          this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed`;
          });
          this._cd.detectChanges();
        } else {
          this.reelerKhataList = [];
          this._cd.detectChanges();
        }
      }
    }, err => {
      console.log(err);
    })

    // }
  }

  createNewReeler() {
    this.router.navigate(['/reelers/crud']);
  }

  editReeler() {
    this.router.navigate(['/resha-farms/tussar/tussar-reeler-crud', this.reelerDetails.id]);
  }

  goBack() {
    this.router.navigate(['/resha-farms/tussar/tussar-reeler-list']);
  }

  orderDetail(item) {
    this.router.navigate(['/resha-farms/cocoon-orders/details', item.id]);

  }

  reelerYarnKhata() {
    this.api.reelerYarnKhata(this.reelerDetails.id).then(res => {
      if (res) {
        const khataList = res['_embedded']['yarnlisting'];
        if (khataList.length) {
          for (let i = 0; i < khataList.length; i++) {
            this.reelerYarnKhataList.push({
              code: khataList[i]['yarnListing'].code,
              id: khataList[i]['yarnListing'].id,
              weight: khataList[i]['yarnListing'].weight ?  khataList[i]['yarnListing'].weight : '-',
              totalPrice: khataList[i]['yarnListing'].totalPrice ? khataList[i]['yarnListing'].totalPrice.toLocaleString('en-IN') : '',
              pricePerKg: khataList[i]['yarnListing'].pricePerKg ? khataList[i]['yarnListing'].pricePerKg : '-',
              denier: khataList[i]['yarnListing'].denier ? khataList[i]['yarnListing'].denier : '-',
              type: khataList[i]['yarnListing'].type ? khataList[i]['yarnListing'].type : '-',
              twistedType: khataList[i]['yarnListing'].twistedType ? khataList[i]['yarnListing'].twistedType : '-',
              paymentStatus: khataList[i]['yarnListing'].paymentStatus              
            })
          }
          this._cd.detectChanges();
        } else {
          this.reelerYarnKhataList = [];
          this._cd.detectChanges();
        }
      }
    })
  }
  @ViewChild('popupOpen')
  popupOpenContent:any;
  recordDepositPayment(){
    this.dialog.open(this.popupOpenContent,{ 
      width: '50vw',
      maxHeight: '60vh',
     });
  }
  close(){
    this.dialog.closeAll();
    this.depositFormGroup.reset();
  }

  slectedDepositType:any;
  onDepositTypeSelection(event){
    this.slectedDepositType = event.target.value
  }

  getDepositeTypeList(){
    this.ngxLoader.stop();
    this.api.getDepositeType().then(res=>{
      this.getDepositeType = res['content'].map(x=>x.value)      
    })
  }


  save(data){
    
    data['depositType'] = this.slectedDepositType;
    data['valueDate'] = Date.parse(data['valueDate']);
    this.ngxLoader.stop();
    this.api.makeDepositForMudra(data, this.bnpl?this.bnplAccountId:this.invoiceFinancingAccId, this.productType).then(res=>{
    this.dialog.closeAll();
    this.masterInformation();
    this.depositFormGroup.reset();
    this.snackBar.open('Deposit recorded successfully.', 'OK', {
      duration: 300
    })
    this.refreshOtherComponent = !this.refreshOtherComponent;
    this.getReelerById(this.id);
    }), err => {
      console.log(err);
    }
  }
  yarnDetails(item) {
    this.router.navigate(['/yarn-po/details', item.id]);
  }

  listenAndRefresh(){
    this.refreshOtherComponent = !this.refreshOtherComponent;
    this._cd.detectChanges();
    this.getReelerById(this.id);
    this.masterInformation();
    this.updateStatus();
    this.writtenOff()
    this.settledOff()
  }
  selectedProductType="";
  masterLoanInfo;
  bnplAccountIdArray;
  bnplAccountId;
  bnpl:boolean = false;
  invoiceFinancingAccId;
  suppliersBoolean = false;
  invoiceFinanceAccountId;
  masterInformation(){
    this.apiSearch.creditLoans(false,'creditlinesvc/creditlimit/master/spec',`(customer.profile==REELER and customer.externalCustomerId==${this.id})`).then(res=>{
      this.masterLoanInfo = res['content'][0];
      this.bnplAccountIdArray = res['content'];
      this.depositFormGroup.get('amount').setValidators([Validators.required,Validators.max(this.masterDataFromLoans?.totalOutstandingAmount)]);
      this.depositFormGroup.get('amount').updateValueAndValidity();
      this.bnplAccountIdArray.forEach(element => {
        if(element.productType==='INVOICE_FINANCING'){
          this.suppliersBoolean = true;
          this.invoiceFinanceAccountId = element.id;
          
        }
      });
      this._cd.detectChanges();
    });
    
  }

  routeToBank(){
    this.router.navigate(['bank',this.mudraId,'REELER',this.reelerDetails.phone,this.reelerDetails.name])
  }

  // payment Validations
  isControlValidForReeler(controlName: string): boolean {
    const control = this.reelerPaymentForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.reelerPaymentForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.reelerPaymentForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  updateStatus(){
    let payload = {
      //"productType": "BNPL",
      //"customerId": this.mudraId,
      "accountId":this.selectedProductType,
      "status": this.statusType.toUpperCase()
    }
    this.ngxLoader.stop();
    this.api.updateStatus(payload).then((res =>{
      this.snackBar.open('Status changed Successfully', 'OK', {
        duration : 3000
      });
      this.modalService.dismissAll();
    })).catch(err=>{
      this.snackBar.open(err.error['message'], 'OK', {
        duration: 5000
      })
    })
  }

  writtenOff(){
    let payload = { 
      "depositType":"WRITE_OFF"
    }
    this.ngxLoader.stop();
    this.api.writtenOff(`accountId=${this.selectedProductType}`,payload).then((res =>{
      this.snackBar.open('Status changed to be Written off Successfully', 'OK', {
        duration : 3000
      });
      this.modalService.dismissAll();
    })).catch(err=>{
      this.snackBar.open(err.error['message'], 'OK', {
        duration: 5000
      })
    })
  }

  settledOff(){
    let payload = { 
      "amount":this.createStatusForm.get('settlementAmount').value,
      "depositType":"SETTLE"
    }
    this.ngxLoader.stop();
    this.api.settledOff(`accountId=${this.selectedProductType}`,payload).then((res =>{
      this.snackBar.open('Status changed to Settled Successfully', 'OK', {
        duration : 3000
      });
      this.modalService.dismissAll();
    })).catch(err=>{
      this.snackBar.open(err.error['message'], 'OK', {
        duration: 5000
      })
    })
  }

  getStatus(){
    this.ngxLoader.stop();
    if(this.mudraId){
      this.api.getAccStatus('REELER',this.mudraId).then((res =>{
        this.status.patchValue(res['content'][0]?.status?res['content'][0]?.status:null);
      }))
    }
  }
  onStatusSelection(event){
    this.modalService.open(this.statusPopup)
    this.statusType = event.target.value;
    this.listOfSettelmentStatus = this.statusList[this.statusType];
    let status = {
      ACTIVE:'Active',
      INACTIVE:'In Active',
      BLOCKED:'Blocked',
      WRITTEN_OFF:'Written Off',
      SETTLED:'Settled',
      TO_BE_SETTLED:'To Be Settle'
    }
    this.statusDisplay = status[this.statusType];

    this.status.patchValue(this.statusType);
  }
  closeNgbModal(){
    this.modalService.dismissAll();
    this.createStatusForm.reset()
  }
  markToBeSettled(){
    if(this.statusType == 'SETTLED'){
      this.settledOff()
    }else if(this.statusType == 'WRITTEN_OFF'){
      this.writtenOff()
    }else{
      this.updateStatus()
    }
  }

  productType:string;
  sendProductType(data){
    this.productType = data?.productTypeName;
    this.bnplAccountIdArray?.forEach(element => {
      if(this.productType==='BNPL' && element.productType==='BNPL'){
        this.bnpl = true; 
        this.bnplAccountId = element.id;
      } else if(this.productType==='INVOICE_FINANCING' && element.productType==='INVOICE_FINANCING') {
        this.bnpl = false;
        this.invoiceFinancingAccId = element.id;
      }
      
    });
  }
  sendTotalOutstanding(data){
    this.masterDataFromLoans = data;
    this.depositFormGroup.get('amount').setValidators([Validators.required,Validators.max(this.masterDataFromLoans?.totalOutstandingAmount)]);
    
  }
  addProduct(){
    this.modalService.open(this.productLoanType)
  }
  getLoanProduct(){
    this.apiSearch.getProductType().then(res=>{
      this.productTypeList =res['content'].map(x=>x.value);
    })    
  }
}


  

  // constructor() { }

  // ngOnInit(): void {
  // }


