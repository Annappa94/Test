import { ChangeDetectorRef, Component, ElementRef, Inject, LOCALE_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UtilsService } from 'src/app/services/utils/utils.service';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import { SearchService } from 'src/app/services/api/search.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { S3UrlResponse } from 'src/app/model/types/type.model';
import { AddressPincodeFormComponent } from 'src/app/modules/shared/address-pincode-form/address-pincode-form.component';
import { BankFormComponent } from 'src/app/modules/shared/bank-form/bank-form.component';

import { Condition } from 'selenium-webdriver';
import { I } from '@angular/cdk/keycodes';
import { ToastrService } from 'ngx-toastr';
import { ThisReceiver } from '@angular/compiler';
import { CustomValidator } from 'src/app/modules/shared/custom-validator/custom.validator';


@Component({
  selector: 'app-cocoon-crud',
  templateUrl: './cocoon-crud.html',
  styleUrls: ['./cocoon-crud.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class CocoonCRUDComponent {
  @ViewChild('address') addressForm : AddressPincodeFormComponent;
  @ViewChild('bank') bankForm : BankFormComponent;

  selectedFarmer: any;
  lotCreateForm: UntypedFormGroup;
  farmerCreateForm: UntypedFormGroup;
  chawkiCreateForm: UntypedFormGroup;
  addFarmerNameForm: UntypedFormGroup;
  farmerList: any = [];
  lotId: any;
  edit = false;
  centerList;
  centerListByUser;
  lotDetails;
  couponValid = false;
  couponMsg = '';
  couponList: any = [];
  selectedFarmerDetails: any;
  user: any;
  farmerRes;
  isOTPSent:any;
  iskycVerified=false;
  removeAddStar = false;
  createdFarmerId:any;
  execLimit:any;
  l1Limit:any;
  l2Limit:any;
 

  cocoonTypeList = [
    {
      displayName: 'Bivoltine Seed',
      code: 'SEEDCOCOON'
    },
    {
      displayName: 'Bivoltine Hybrid',
      code: 'BIVOLTINE'
    },
    {
      displayName: 'CB Gold',
      code: 'CBGOLD'
    },
    // {
    //   displayName: 'Tussar',
    //   code: 'TUSSAR'
    // }
  ];
  loading:boolean=false;
  reshamandiRate: any;
  reshamandiRateByType;
  invalidRate = false;
  refferalCouponApplied = false;

  farmerLotKhata: any = [];
  farmerLotCount = 0;
  minDate;
  chaakiDate;

  farmerHasIotDevice : boolean = false;

  defaultPagination={
    currentPage : 0,
    pageSize    : 1000,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  }
  imageFile: any;
  previewImage:any
  imageUploaded: boolean = false;
  imageUploading:boolean = false;
  usersList: any = [];
  chawkiList:any = [];
  minimumCentreBagWeight:number = 0;
  selectedChawki: any;
  farmeCSBkycVerification: any;
  farmercustomerTypeName: any;
  documentsList:any;
  queryParams:any;

  executiveApprovalPrice:any;
  L1ApprovalPrice:any;
  L2ApprovalPrice:any;
  userPriceData=[];
  typeOfCocoon: any;
  SelectedcocoonPriceValues=[];
  selectedRmGrade: any;
  selectedGradeList:any=[];
  userRelatedGroupId: any;
  userApplicableRate: any;
  isApprovalRequestRequired: boolean;
  alertMessage: string;
  farmerBankVerfication: any;
  bank_verification: any;
  userRelatedGroupName: any;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private form: UntypedFormBuilder,
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private ngxLoader: NgxUiLoaderService,
    private utils: UtilsService,
    private searchApi: SearchService,
    public globalService: GlobalService,
    private $gaService:GoogleAnalyticsService,
    private toaster:ToastrService,
    private popupconfig: NgbModalConfig,


    @Inject(LOCALE_ID) private locale: string,) {
      this.user = JSON.parse(localStorage.getItem('_ud'));
      console.log(this.user.roles);
      this.isApprovalRequestRequired = false;
    this.centerListByUser = [];

    const currentYear = moment().year();
    const currentMonth = moment().month();
    const currentDay = moment().date();
    this.isOTPSent =false;
    this.minDate = moment([currentYear, currentMonth, currentDay]);

    let today = new Date();
    let todayEpoch = Date.parse(today.toString());
    let chaakiDateEpoch = new Date(todayEpoch);
    let finalChaakiDate =  chaakiDateEpoch.setDate((today.getDate() + 8));
    this.chaakiDate = formatDate(finalChaakiDate, 'MM-dd-yyyy', this.locale);

    this.user = JSON.parse(localStorage.getItem('_ud'));
    this.getCentersByLoginId();
    this.getCenters();
    this.createLotForm();
    this.getmandiList();
    this.getAllPromotionalCoupons();
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.lotId = params['id'];
        this.getCoonLotDetail(this.lotId);
        this.edit = true;
        
      } else {
        if(this.globalService.globalFarmLotData){
          this.patchLocaldata(this.globalService.globalFarmLotData);
        }
        this.edit = false;
      }

    });
    this.farmerParams();
    this.chawkiParams();
    this.getAllUsers();
    //this.getAllChawkis();
    this.getAllCustomerTypes();
    this.addFarmerNameForm = this.form.group({
      name: new UntypedFormControl('', Validators.required),
    })
    this.removeAddStar = false;
    this.route.queryParams.subscribe(params =>{
      console.log(params);
      this.queryParams = params;
      if(this.queryParams.selectedFarmerId){
        
        //this.getFarmersList({'term' : this.queryParams.selectedFarmerPhone});
        this.selectedFarmer = parseInt(this.queryParams.selectedFarmerId);
        this.getCouponCodeForAFarmer();
        this.enterFarmerDetails(this.selectedFarmer, true, true);
        
      }
    });
   
    this.farmerBankVerfication = false;

  }

  // getAllChawkis(){
  //   this.api.getAllChawkis().then(res=>{
  //     this.chawkiList = res['_embedded']['chawki']
  //   });
  // }

  getAllChawkis(event) {
    if (event.term.length % 2 == 0) { 
      let searchParams = `((name==*${event.term.replace(/ /gi,"*")}* or phone==*${event.term.replace(/ /gi,"*")}*) and phone!=*DELETED*)`;
      this.api.getChawkiList(searchParams,'createdDate', 'desc', 0,100).then(res => {
        this.chawkiList = res['content'];
        this._cd.detectChanges();
      })
    }
    if (!event.term || event.term.length == 0) {
      this.chawkiList = [];
      this._cd.detectChanges();
    }
  }

  kycCustomerTypes:any = [];
  getAllCustomerTypes(){
    this.api.getAllCustomerTypes().then(res => {
      this.kycCustomerTypes = res['_embedded']['kyccustomer'];
      this._cd.detectChanges();
    });
  }

  chawkiToChanged(data){
    console.log(data);
    
    if(data){
      this.lotCreateForm.get('chaakiCenterName').patchValue(data['name'] ? data['name'] : '');
      this.lotCreateForm.get('chaakiCenterPhone').patchValue(data['phone']  ? data['phone']  : '');
      this.lotCreateForm.get('chaakiRegion').patchValue(( data['address'] && data['address']['region']  )? data['address']['region']  : '');
      this.lotCreateForm.get('chaakiCity').patchValue((data['address'] && data['address']['city'] )? data['address']['city']  : '');
      this.lotCreateForm.get('chaakiRegion').clearValidators();
      this.lotCreateForm.get('chaakiCity').clearValidators();
      this.lotCreateForm.get('chaakiRegion').updateValueAndValidity();
      this.lotCreateForm.get('chaakiCity').updateValueAndValidity();
      
    }else{
      this.lotCreateForm.get('chaakiCenterName').patchValue('');
      this.lotCreateForm.get('chaakiCenterPhone').patchValue('');
      this.lotCreateForm.get('chaakiRegion').patchValue('');
      this.lotCreateForm.get('chaakiCity').patchValue('');
    }
    
  }

  chawkiModalRef;
  closeChawkiResult: string;
  async openChawkiModel(content) {
    this.chawkiModalRef = this.modalService.open(content)
    this.chawkiModalRef.result.then((result) => {
      this.closeChawkiResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeChawkiResult = `Dismissed`;
    });
  }

  async chawkiParams(){
    this.chawkiCreateForm = this.form.group({
      name: new UntypedFormControl('', Validators.required),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
      nearestRmCenterId: new UntypedFormControl('', [Validators.required]),
      nearestRmCenterName: new UntypedFormControl(''),
      bankDetails: new UntypedFormArray([]),
      address: new UntypedFormControl(''),
      city: new UntypedFormControl(''),
      taluk: new UntypedFormControl(''),
      village: new UntypedFormControl(''),
      district: new UntypedFormControl(''),
      state: new UntypedFormControl(''),
      pincode: new UntypedFormControl(''),
      region: new UntypedFormControl('')
    });
    (this.chawkiCreateForm.controls['bankDetails'] as UntypedFormArray).push(new UntypedFormGroup({
      beneficiaryName: new UntypedFormControl(''),
      bankName: new UntypedFormControl(''),
      accountNumber: new UntypedFormControl(''),
      ifscCode: new UntypedFormControl(''),
    }));
  }

  createChawki(chawkiForm) {
    const params = {
      "name":chawkiForm.name,
      "phone": chawkiForm.phone,
      "alternatePhone":"",
      "nurseryArea":"",
      "equipments":[],
      "refferedBy":"",
      "kycPANNumber":"",
      "kycAdhaarNumber":"",
      "govRegistrationId":"",
      "crcCapacity":"",
      "batchesPerMonth":"",
      "averageSizeOfBatch":"",
      "noOfLabour":"",
      "disinfectionMgmt":"",
      "nameOfEggGrainage":"",
      "sourceOfEggs":"Private",
      "cropFailureHistory":"",
      "rmDiscount":"",
      "nearestRmCenterId": chawkiForm.nearestRmCenterId,
      "nearestRmCenterName": chawkiForm.nearestRmCenterName,
      "chawkiTypes":[
        {"type":"GOLD","price":null},
        {"type":"WHITE","price":null}
      ],
      "name_hi":"",
      "name_kn":"",
      "name_mr":"",
      "name_te":"",
      "name_ta":"",
      "address":{
        "address":chawkiForm.address,
        "city":chawkiForm.city,
        "taluk":chawkiForm.taluk,
        "village":chawkiForm.village,
        "district":chawkiForm.district,
        "state":chawkiForm.state,
        "pincode":chawkiForm.pincode,
        "region":chawkiForm.region,
        "latitude":"",
        "longitude":""
      },
      "bankDetails":{
        "beneficiaryName":"",
        "bankName":"",
        "accountNumber":"",
        "ifscCode":""
      }
    }
    this.ngxLoader.stop();
    this.api.chawkiOnBoarding(params).then(res => {
      this.chawkiModalRef.close();
      if (res) {
        this.selectedChawki = res['name'] + '-' + res['phone'];
        this.chawkiToChanged(res);
        this.chawkiList.unshift(res);
        //this.onFarmerSelection('')
        this.chawkiCreateForm.reset();
        this.snackBar.open('Created chawki successfully', 'Ok', {
          duration: 3000
        });
      }
    });

  }

  onCenterSelect(event) {
    for (let i = 0; i < this.centerList.length; i++) {
      if (this.centerList[i].id == event.target.value) {
        this.chawkiCreateForm.get('nearestRmCenterName').patchValue(this.centerList[i].centerName);
        break;
      }
    }
  }

  
  

  patchLocaldata(data){
    this.selectedFarmer = data?.farmer?.id;
    this.enterFarmerDetails(this.selectedFarmer, false, false);
    this.lotCreateForm.patchValue(data.data);

    if(this.lotCreateForm.get('couponAmt').value > 0) {
      this.couponValid = true;
      this.couponMsg = this.lotCreateForm.get('couponAmt').value + ' Added Suceessfully. '
    }
    this.farmerRes = {...data.farmer};
    this.farmerList = [];
    this.farmerList.push(data?.farmer);
  }

  clearLocalData(){
    this.globalService.globalFarmLotData=false;
  }

  async farmerParams() {

    this.farmerCreateForm = this.form.group({
      name: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace, Validators.pattern("^[A-Za-z ]+$")]),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
      mobileOTP: new UntypedFormControl(''),
      center: new UntypedFormControl('', [Validators.required]),
      cocoonType: new UntypedFormControl('', [Validators.required]),
      customerType: new UntypedFormControl('1'),
      bankDetails: new UntypedFormArray([]),
      idProofForm: new UntypedFormGroup({
        kycDocument: new UntypedFormControl(''),
        verified: new UntypedFormControl(''),
        kycNumber: new UntypedFormControl(''),
        frontImageUrl:new UntypedFormControl(''),
        frontImageTag:new UntypedFormControl(''),
        backImageUrl: new UntypedFormControl(''),
        backImageTag: new UntypedFormControl(''),
        id: new UntypedFormControl('')
      }),
      cbsProofForm: new UntypedFormGroup({
        kycDocument: new UntypedFormControl(''),
        verified: new UntypedFormControl(''),
        kycNumber: new UntypedFormControl(''),
        frontImageUrl:new UntypedFormControl(''),
        frontImageTag:new UntypedFormControl(''),
        backImageUrl: new UntypedFormControl(''),
        backImageTag: new UntypedFormControl(''),
        id: new UntypedFormControl('')
      }),

    });
    (this.farmerCreateForm.controls['bankDetails'] as UntypedFormArray).push(new UntypedFormGroup({
      beneficiaryName: new UntypedFormControl(''),
      bankName: new UntypedFormControl(''),
      accountNumber: new UntypedFormControl(''),
      ifscCode: new UntypedFormControl(''),
    }));
  }



  async createLotForm() {
    this.lotCreateForm = this.form.group({
      farmer: new UntypedFormControl(''),
      type: new UntypedFormControl('', Validators.required),
      code: new UntypedFormControl(''),
      rmGrade: new UntypedFormControl(null),
      grade: new UntypedFormControl('', [Validators.required, Validators.min(1)]),
      lotWeight: new UntypedFormControl(0, [Validators.required, Validators.min(0)]),
      pricePerKg: new UntypedFormControl('', [Validators.required, Validators.min(1)]),
      totalPrice: new UntypedFormControl('', Validators.required),
      beneficiaryName: new UntypedFormControl(''),
      bankName: new UntypedFormControl(''),
      accountNumber: new UntypedFormControl(''),
      ifscCode: new UntypedFormControl(''),
      center: new UntypedFormControl('', [Validators.required]),
      noOfBags: new UntypedFormControl(''),
      paymentAfterDays: new UntypedFormControl('3'),
      couponCode: new UntypedFormControl(''),
      couponAmt: new UntypedFormControl(0),
      //kycPANNumber: new FormControl(''),
      //kycAdhaarNumber: new FormControl('', [Validators.required]),
      chaakiDate: new UntypedFormControl(),


      address: new UntypedFormControl(''),
      village: new UntypedFormControl(''),
      district: new UntypedFormControl(''),
      city: new UntypedFormControl(''),
      pincode: new UntypedFormControl(''),
      taluk: new UntypedFormControl(''),
      state: new UntypedFormControl(''),
      region: new UntypedFormControl(''),

      chaakiRegion: new UntypedFormControl(''),
      chaakiCity: new UntypedFormControl(''),
      chaakiCenterName: new UntypedFormControl('', [Validators.required]),
      chaakiCenterPhone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),

      centerCocoonLogisticCostPerKg: new UntypedFormControl(0, [Validators.min(0)]),
      centerCocoonWeightLoss: new UntypedFormControl(0,[Validators.min(0)]),
      receivedWeight: new UntypedFormControl(0,[Validators.required, Validators.min(1)]),
      recomendedRate: new UntypedFormControl(''),
      receivedWeightPricePerKg: new UntypedFormControl(0,[Validators.required, Validators.min(1)]),
      centerTotalLogisticsCost: new UntypedFormControl(0),
      actualGrossAmount: new UntypedFormControl(0),
      cocoonRendittaImage: new UntypedFormControl(''),
      systemPredictedGrade: new UntypedFormControl(''),
      cocoonRendittaId: new UntypedFormControl(''),
      lotSoldBy: new UntypedFormControl(''),
      centerPerBagWeightDeduction: new UntypedFormControl(''),
      centerTotalBagWeightDeduction: new UntypedFormControl(''),
      centerTotalCocoonWeightLoss: new UntypedFormControl(0),
      centerBagWeightDeductionOverride: new UntypedFormControl(false),
      backupCenterCocoonWeightLoss: new UntypedFormControl(0,[Validators.min(0)]),
      representive: new UntypedFormControl('', Validators.required),
    });
    if(!this.lotId) {
      this.lotCreateForm.patchValue({
        chaakiDate: moment(this.chaakiDate, "MM/DD/YYYY"),
      });
    }
  }

  farmerInfoEdit:any;
  farmerCenter:any
  async getCoonLotDetail(lotId) {
    this.ngxLoader.stop();
    this.api.getCocoonLotById(lotId).then((response:any) => {
     
      this.farmerInfoEdit = response['farmerName'] + " - " + response['farmerPhone']
      this.farmerCenter = response['centerName'] 
      if (response) {
        if(response['uom']=='PCS'){
          this.uom = 'PCS';
          this.cdr.detectChanges();
        }
        if(response['paymentStatus'] !== 'Paid'){
          this.api.getCocoonLotByIdProjection(lotId).then(lotDetails => {
            this.selectedFarmer = lotDetails['farmerId'];
            this.getCouponCodeForAFarmer()
            if (lotDetails['discountValue'] && lotDetails['discountValue'] > 0) {
              this.lotCreateForm.get('couponAmt').patchValue(lotDetails['discountValue']);
              this.couponMsg = lotDetails['discountValue'] + ' Added Suceessfully. '
              this.couponValid = true;
            }
          })
          if(response['cocoonRendittaId']) {
            this.api.getRendittaGradingById(response['cocoonRendittaId']).then(gradingData=> {
            this.previewImage = gradingData['imageUrl'];
            this.lotCreateForm.get('systemPredictedGrade').patchValue(gradingData['rmGrade']);
            // this.lotCreateForm.get('rmGrade').patchValue('Reshmandi'+ gradingData['rmGrade']);

            })
          }
          this.lotDetails = response; 
          console.log(this.lotDetails);
                   
          this.lotCreateForm.patchValue(response);
          this.cdr.detectChanges();
          this.onCocoonTypeChange();
          this.lotCreateForm.get('receivedWeightPricePerKg').patchValue(this.lotDetails?.receivedWeightPricePerKg);
          this.lotCreateForm.get('center').patchValue(this.lotDetails?.centerId);
          this.mapCenterData();
          this.lotCreateForm.get('backupCenterCocoonWeightLoss').patchValue(response['centerCocoonWeightLoss']);
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
          this.lotCreateForm.get('representive').patchValue(representiveObj);
          this.lotCreateForm.get('chaakiCenterName').patchValue(response['chawkiName']);
          this.lotCreateForm.get('chaakiCenterPhone').patchValue(response['chawkiNumber']);
          
          this.lotCreateForm.get('grade').patchValue(response['grade']);
          this.lotCreateForm.get('rmGrade').patchValue(response['rmGrade']);
          this.lotCreateForm.get('farmer').setValue(response['farmerId'].substring(6));
          console.log(response['farmerId'].substring(6));
          
          let farmerDetails = this.enterFarmerDetails(response['farmerId'].substring(6), false, false);
          // if (response['_embedded']['farmer']['farmer']['bankDetails'][0] != null) {
          //   this.bankForm.bankForm.get('bankName').setValue(response['_embedded']['farmer']['farmer']['bankDetails'][0]['bankName']);
          //   this.bankForm.bankForm.get('accountNumber').setValue(response['_embedded']['farmer']['farmer']['bankDetails'][0]['accountNumber']);
          //   this.bankForm.bankForm.get('beneficiaryName').setValue(response['_embedded']['farmer']['farmer']['bankDetails'][0]['beneficiaryName']);
          //   this.bankForm.bankForm.get('ifscCode').setValue(response['_embedded']['farmer']['farmer']['bankDetails'][0]['ifscCode']);
          //   this.bankForm.bankForm.get('branchName').setValue(response['_embedded']['farmer']['farmer']['bankDetails'][0]['branchName']);

          // }
          this.bankForm.bankForm.patchValue(response['farmerBankDetails'][0])
          this.addressForm.addressForm.patchValue(response['farmerAddress']);
          if (this.lotDetails?.couponAmount > 0) {
            this.redeemCode(this.lotDetails);
          }
        } else {
          this.router.navigate(['error-1'])
        }

      } else {
        console.log('Response for getCocoonLotById found to be ', response);
        this.snackBar.open('Failed to find reeler', 'Ok', {
          duration: 3000
        });
      }
    });
  }

  enterFarmerDetails(farmerId, patchBankDetails, checkName) {
    this.api.getFarmerById(farmerId).then(res => {
      this.selectedFarmerDetails = res;

      this.farmerRes = res['farmer'];   

      this.farmeCSBkycVerification =  res['farmer']?.eligibleForTransactions;
      this.farmerList.push(res['farmer']);
      this.iskycVerified=res['farmer']?.kycVerified;
      //this.lotCreateForm.get('kycAdhaarNumber').patchValue(res['farmer']['kycAdhaarNumber']);
      //this.lotCreateForm.get('kycPANNumber').patchValue(res['farmer']['kycPANNumber']);
      
      this.addressForm.addressForm.get('address').patchValue(res['farmer']['address']['address']);
      this.addressForm.addressForm.get('village').patchValue(res['farmer']['address']['village']);
      this.addressForm.addressForm.get('city').patchValue(res['farmer']['address']['city']);
      this.addressForm.addressForm.get('district').patchValue(res['farmer']['address']['district']);
      this.addressForm.addressForm.get('taluk').patchValue(res['farmer']['address']['taluk']);
      this.addressForm.addressForm.get('region').patchValue(res['farmer']['address']['region']);
      this.addressForm.addressForm.get('state').patchValue(res['farmer']['address']['state']);
      this.addressForm.addressForm.get('pincode').patchValue(res['farmer']['address']['pincode']);

      // if(!this.globalService.globalFarmLotData){
      //   this.lotCreateForm.get('chaakiCenterName').patchValue(res['farmer']['chaakiCenterName'] ? res['farmer']['chaakiCenterName'] : '');
      //   this.lotCreateForm.get('chaakiCenterPhone').patchValue(res['farmer']['chaakiCenterPhone'] ? res['farmer']['chaakiCenterPhone'] : '');
      //   this.lotCreateForm.get('chaakiRegion').patchValue(res['farmer']['chaakiRegion'] ? res['farmer']['chaakiRegion'] : '');
      //   this.lotCreateForm.get('chaakiCity').patchValue(res['farmer']['chaakiCity'] ? res['farmer']['chaakiCity'] : '');
      // } removed as we are selecting chawki from dropdown.

      this.clearLocalData();


      if(patchBankDetails) {
        if (res['farmer']['bankDetails'][0] != null) {
          this.bankForm.bankForm.get('accountNumber').patchValue(res['farmer']['bankDetails'][0]['accountNumber'])
          this.bankForm.bankForm.get('beneficiaryName').patchValue(res['farmer']['bankDetails'][0]['beneficiaryName'])
          this.bankForm.bankForm.get('ifscCode').patchValue(res['farmer']['bankDetails'][0]['ifscCode'])
          this.bankForm.bankForm.get('bankName').patchValue(res['farmer']['bankDetails'][0]['bankName'])
          this.bankForm.bankForm.get('branchName').patchValue(res['farmer']['bankDetails'][0]['branchName'])

        }
      }
      if(checkName) {
        this.selectedFarmerDetails = res;
          if (res['farmer']['name'] === "") {
            this.modalRef = this.modalService.open(this.updateFarmerName)
            this.modalRef.result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
              this.closeResult = `Dismissed`;
            });
          }
        //  this.lotCreateForm.get('center').setValue(res['centerId']);
          // if(!this.edit) {
          //   this.mapCenterData();
          // }
          //this.lotCreateForm.get('type').setValue(res['farmer']['cocoonType']);
         // this.onCocoonTypeChange();
      }
      this.cdr.detectChanges();
      return res;
    })
  }

  getFarmersList(event) {
    if (event.term.length % 2 == 0) { //name==*${event.term.replace(/ /gi,"*")}* or  removed as per deepak request searchAllFarmers
      let searchParams = `phone=${event.term.replace(/ /gi,"*")}`;
      this.api.searchFarmersByPhone('Silk', 50, 'createdDate', 'desc', searchParams).then((res:any) => {
        console.log(res);        
        // this.farmerList = res['content'].filter(data=>!(data?.phone.includes('__DELETED')) );
        this.farmerList = res.filter(data=>!(data?.phone.includes('__DELETED')) );
        this._cd.detectChanges();
      })
    }
    if (!event.term || event.term.length == 0) {
      this.farmerList = [];
      this._cd.detectChanges();
    }
  }

  async getCenters() {
    
    //this.ngxLoader.stop();
    this.api.getCocoonCenters().then(details => {
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }

  async getCentersByLoginId() {
    let id =JSON.parse(localStorage._ud)?.internalid;
    console.log(id);
    //this.ngxLoader.stop();
    this.api.getCenterByUserId(id).then(details => {
      
      if (details) {
        this.centerListByUser = details;
        this.lotCreateForm.get('center').setValue(this.centerListByUser[0]?.['id']);
        this.mapCenterData();
      }else{
       this.centerListByUser = [];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }

  getAllPromotionalCoupons() {
    this.ngxLoader.stop();
    // let search = `((isActive==true and applicableFor=in=(FARMER)) and (advancedConfiguration.target=='COCOON_PURCHASE' or category=='CLASSIC'))`
    let search = `(isActive==true and applicableFor=in=(FARMER))`
    this.searchApi.getAllPromotionalCoupons(this.defaultPagination, search).then(res => {
      const coupons = res['content'];
      if (coupons.length) {
            for (let i = 0; i < coupons.length; i++) {
              if (coupons[i].isActive) {
                this.couponList.push(coupons[i]['couponCode'])
              }
            }
          }
    });
  }

  couponClicked(coupon) {
    if (this.lotCreateForm.get('couponAmt').value == 0) {
      this.lotCreateForm.get('couponCode').patchValue(coupon);
    }
  }

  getCouponCodeForAFarmer() {
    //this.ngxLoader.stop();
    this.api.getReferralCouponOfFarmer(this.selectedFarmer).then(res => {
      if (this.couponList && this.couponList.length) {
        if (this.refferalCouponApplied) {
          this.couponList[this.couponList.length - 1] = res['couponCode'];
        } else {
          this.couponList[this.couponList.length] = res['couponCode'];
        }
      } else {
        this.couponList[0] = res['couponCode'];
      }
      this.refferalCouponApplied = true;
    });
  }

  @ViewChild('updateFarmerName') updateFarmerName: ElementRef;
  @ViewChild('yarnPurchaseConfirmation') yarnPurchaseConfirmation: ElementRef;

  async onFarmerSelection(farmerCSBverification,farmerKhata) {   
    this.popupconfig.backdrop = 'static';
    this.popupconfig.keyboard = false; 
    this.farmerHasIotDevice = false;
    this.farmerLotCount = 0;
    this.farmerLotKhata = [];
    this.cancelCouponRedeem();
    if (this.selectedFarmer) {
      let code = 'RMFARM' + this.selectedFarmer;
      this.api.getFarmerById(this.selectedFarmer).then(res => {
        this.farmerRes = res['farmer'];        
        this.farmercustomerTypeName = this.farmerRes?.customerTypeName;
        this.farmeCSBkycVerification = this.farmerRes?.eligibleForTransactions;
        this.farmerBankVerfication = this.farmerRes?.bankDetails[0]?.verified;
        console.log(this.farmerBankVerfication);
        if (this.bank_verification) {
         
          if (this.farmeCSBkycVerification == false ||  this.farmerBankVerfication == false) {
            this.modalRef = this.modalService.open(farmerCSBverification)
            this.modalRef.result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
              this.closeResult = `Dismissed`;            
            });
          } else {
            this.api.getAssociatedDeviceByFarmId(code).then((deviceList:any) => {        
              if(deviceList && deviceList.length) {
                this.farmerHasIotDevice = true;
                this.cdr.detectChanges();
              }
            })
      
            // this.enterFarmerDetails(this.selectedFarmer, true, false);
            this.api.getKhathaListofFarmer(this.selectedFarmer).then(res => {
              let khata = res['_embedded']['cocoonlot'];
              if (khata.length) {
                this.farmerLotCount = khata.length;
                for (let i = 0; i < khata.length; i++) {
                  if (khata[i].cocoonLot.status == 'New') {
                    let obj = {
                      weight: khata[i].cocoonLot.lotWeight,
                      pricePerKg: khata[i].cocoonLot.lotWeight,
                      id: khata[i].cocoonLot.id,
                      code: khata[i].cocoonLot.code,
                      type: khata[i].cocoonLot.type,
                      createdDate: khata[i].cocoonLot.createdDate ? this.utils.getDisplayTime(khata[i].cocoonLot.createdDate) : '-'
                    }
                    this.farmerLotKhata.push(obj);
                  }
      
                }
               
                
                if (farmerKhata && this.farmerLotKhata.length) {
                  this.modalRef = this.modalService.open(farmerKhata)
                  this.modalRef.result.then((result) => {
                    this.closeResult = `Closed with: ${result}`;
                  }, (reason) => {
                    this.closeResult = `Dismissed`;
                  });
                }
              }
            })
            this.getCouponCodeForAFarmer();
            this.enterFarmerDetails(this.selectedFarmer, true, true);
            this.cdr.detectChanges();
          }
        } else{
          this.farmerBankVerfication = false;
          if (this.farmeCSBkycVerification == false) {
            this.modalRef = this.modalService.open(farmerCSBverification)
            this.modalRef.result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
              this.closeResult = `Dismissed`;            
            });
          } else {
            this.api.getAssociatedDeviceByFarmId(code).then((deviceList:any) => {        
              if(deviceList && deviceList.length) {
                this.farmerHasIotDevice = true;
                this.cdr.detectChanges();
              }
            })
      
            // this.enterFarmerDetails(this.selectedFarmer, true, false);
            this.api.getKhathaListofFarmer(this.selectedFarmer).then(res => {
              let khata = res['_embedded']['cocoonlot'];
              if (khata.length) {
                this.farmerLotCount = khata.length;
                for (let i = 0; i < khata.length; i++) {
                  if (khata[i].cocoonLot.status == 'New') {
                    let obj = {
                      weight: khata[i].cocoonLot.lotWeight,
                      pricePerKg: khata[i].cocoonLot.lotWeight,
                      id: khata[i].cocoonLot.id,
                      code: khata[i].cocoonLot.code,
                      type: khata[i].cocoonLot.type,
                      createdDate: khata[i].cocoonLot.createdDate ? this.utils.getDisplayTime(khata[i].cocoonLot.createdDate) : '-'
                    }
                    this.farmerLotKhata.push(obj);
                  }
      
                }
               
                
                if (farmerKhata && this.farmerLotKhata.length) {
                  this.modalRef = this.modalService.open(farmerKhata)
                  this.modalRef.result.then((result) => {
                    this.closeResult = `Closed with: ${result}`;
                  }, (reason) => {
                    this.closeResult = `Dismissed`;
                  });
                }
              }
            })
            this.getCouponCodeForAFarmer();
            this.enterFarmerDetails(this.selectedFarmer, true, true);
            this.cdr.detectChanges();
          }
        }
        
  
      })
      
     

    }
  }

  doNotProceed() {
    this.modalRef.close();
    this.selectedFarmer = '';
    this.lotCreateForm.reset();
    // this.router.navigate(['/cocoon-lot']);
  }

  proceed() {
    this.modalRef.close();
  }

  proceedToKyc(){
    this.modalRef.close();
    // this.router.navigate(['/kyc-form/'+this.selectedFarmer+'/farmer/Company']);
    if (this.bank_verification) {
      this.router.navigate(['/resha-farms/farmers-silk/crud/'+this.selectedFarmer],{queryParams:{redirecto:'cocoon-lot-crud'}})
    } else {
      if(this.farmercustomerTypeName){
        this.router.navigate(['/resha-farms/farmers-kyc/'+this.selectedFarmer+'/farmer/'+this.farmercustomerTypeName],{queryParams:{redirecto:'cocoon-lot-crud'}});
      } else {
        this.snackBar.open( 'Please update customer type for this farmer.', 'OK', {
          duration: 5000
        })
        this.selectedFarmer = '';
        this.lotCreateForm.reset();
      }
    }
    
  }

  goTolotDetails(item) {
    this.modalRef.close();
    this.router.navigate(['/resha-farms/cocoon-lot/details', item.id]);
  }

  async onSubmit(lotForm) {
    this.modalRef.close();
    this.loading=true;
    let uptikSp = lotForm.pricePerKg + (Math.round(((lotForm.pricePerKg * 0.05) + Number.EPSILON)*100)/100);
    const params = {
      // farmer: this.selectedFarmer ? '/farmers/' + this.selectedFarmer : '/farmers/' + lotForm.farmer,
      "farmer": {
        "id": this.selectedFarmer
      },
      "center": {
        "id" :lotForm.center
      },
      type: lotForm.type,
      status: 'New',
      grade: lotForm.grade,
      noOfBags: lotForm.noOfBags,
      rmGrade: lotForm.rmGrade,
      lotWeight: lotForm.lotWeight,
      pricePerKg: lotForm.pricePerKg,
      totalPrice: lotForm.totalPrice,
      paymentAfterDays: +lotForm.paymentAfterDays,
      //center: '/center/' + lotForm.center,
      couponCode: lotForm.couponAmt ? lotForm.couponCode.toUpperCase() : '',
      couponAmount: lotForm.couponAmt ? lotForm.couponAmt: null,
      bank: {
        accountNumber: this.bankForm.bankForm.value.accountNumber.trim(),
        beneficiaryName: this.bankForm.bankForm.value.beneficiaryName,
        ifscCode: this.bankForm.bankForm.value.ifscCode.trim(),
        bankName: this.bankForm.bankForm.value.bankName,
        branchName:this.bankForm.bankForm.value.branchName,
        verified:this.farmerBankVerfication,
      },
      isDisplayActive: false,
      sellingPricePerKg: uptikSp,
      availableQuantity: lotForm.lotWeight,
      centerCocoonLogisticCostPerKg: lotForm.centerCocoonLogisticCostPerKg ? lotForm.centerCocoonLogisticCostPerKg : null,
      centerCocoonWeightLoss: lotForm.centerCocoonWeightLoss ? lotForm.centerCocoonWeightLoss : null,
      receivedWeightPricePerKg: lotForm.receivedWeightPricePerKg,
      receivedWeight: lotForm.receivedWeight,
      actualGrossAmount: lotForm.actualGrossAmount,
      centerTotalLogisticsCost: lotForm.centerTotalLogisticsCost,
      cocoonRendittaImage: lotForm.cocoonRendittaImage ? lotForm.cocoonRendittaImage : null,
      recommendedGrade: lotForm.systemPredictedGrade ? lotForm.systemPredictedGrade : null,
      cocoonRendittaId: lotForm.cocoonRendittaId ? lotForm.cocoonRendittaId : null,
      lotSoldBy: lotForm.lotSoldBy ? lotForm.lotSoldBy : null,
      centerPerBagWeightDeduction: lotForm.centerPerBagWeightDeduction ? lotForm.centerPerBagWeightDeduction : null,
      centerTotalBagWeightDeduction: lotForm.centerTotalBagWeightDeduction ? lotForm.centerTotalBagWeightDeduction : null,
      centerTotalCocoonWeightLoss: lotForm.centerTotalCocoonWeightLoss ? lotForm.centerTotalCocoonWeightLoss : null,
      centerBagWeightDeductionOverride: lotForm.centerBagWeightDeductionOverride ? lotForm.centerBagWeightDeductionOverride : false,
      uom: this.uom,
      recommendedPrice:lotForm.recomendedRate,
      executiveLimit:this.execLimit,
      l1Limit:this.l1Limit,
      l2Limit:this.l2Limit
      
    };
    let patchFarmerBankDetails = {
      center: '/center/' + lotForm.center,
      // "center": {
      //   "id" :lotForm.center
      // },
      cocoonType: lotForm.type,

      chaakiRegion: lotForm.chaakiRegion,
      chaakiCity: lotForm.chaakiCity,
      chaakiCenterName: lotForm.chaakiCenterName,
      chaakiCenterPhone: lotForm.chaakiCenterPhone,

      bankDetails: [
        {
          accountNumber: this.bankForm.bankForm.value.accountNumber.trim(),
          beneficiaryName: this.bankForm.bankForm.value.beneficiaryName,
          ifscCode: this.bankForm.bankForm.value.ifscCode.trim(),
          bankName: this.bankForm.bankForm.value.bankName,
          branchName:this.bankForm.bankForm.value.branchName,

        }
      ],
      address: {
        address: this.addressForm.addressForm.value.address,
        village: this.addressForm.addressForm.value.village,
        city: this.addressForm.addressForm.value.city,
        district: this.addressForm.addressForm.value.district,
        taluk: this.addressForm.addressForm.value.taluk,
        region: this.addressForm.addressForm.value.region,
        state: this.addressForm.addressForm.value.state,
        pincode: this.addressForm.addressForm.value.pincode
      }
    }
    if(lotForm.chaakiDate) {
      patchFarmerBankDetails['chaakiDate'] = Date.parse(lotForm.chaakiDate.toString());
    }
    this.ngxLoader.stop();
    this.api.patchBankDetailsForFarmer(patchFarmerBankDetails, this.selectedFarmer ? this.selectedFarmer : lotForm.farmer).then(response => {
      this.$gaService.event('Create lot', ` LotWeight =  ${lotForm.lotWeight}, LotTotalPrice = ${lotForm.totalPrice}`);
    })
    if (this.lotId) {
      this.ngxLoader.stop();
      this.loading=true;
      this.api.putCocoonLot(this.lotId, params).then(res => {
        this.loading=false;
        if (res) {
          if (lotForm.cocoonRendittaId) {
            let reqObj = {
              cocoonLotId: this.lotId,
              farmerId : this.selectedFarmer,
              cocoonType:lotForm.type,
              centerId:lotForm.center,
              feedBackGrade:lotForm.rmGrade,
              pricePerKg: lotForm.pricePerKg,
              sellingPricePerKg: uptikSp
            }
            this.api.updateRendittaWithCocoonLot(reqObj, lotForm.cocoonRendittaId).then(rendittaUpdated => {
              this.$gaService.event('Renditta image', ` Cocoon lot id =  ${this.lotId}, SystemPredictedGrade = ${lotForm.systemPredictedGrade}`);
            })
          }
          // Success Message
          this.clearLocalData()
          this.router.navigate(['/resha-farms/cocoon-lot']);
          this.snackBar.open('Updated lot successfully', 'Ok', {
            duration: 3000
          });
        } else {
          this.snackBar.open('Failed to update lot', 'Ok', {
            duration: 3000
          });
        }
      }).catch(err=>{
        this.loading=false;
      });
    } else {
      params['rmRepresentativePhone'] = lotForm.representive.phone;
      params['rmRepresentativeName'] = lotForm.representive.name;
      this.ngxLoader.stop();
      this.api.postCocoonLot(params).then((res:any) => {
        // update renditta grade
        if (lotForm.cocoonRendittaId) {
          let reqObj = {
            cocoonLotId: res.id,
            farmerId : this.selectedFarmer,
            cocoonType:lotForm.type,
            centerId:lotForm.center,
            feedBackGrade:lotForm.rmGrade,
            pricePerKg: lotForm.pricePerKg,
            sellingPricePerKg: uptikSp
          }
          this.api.updateRendittaWithCocoonLot(reqObj, lotForm.cocoonRendittaId).then(rendittaUpdated => {

          })
        }
        this.loading=true;
        if (res) {
          // create followups
          let chaakiDateEpoch = Date.parse(lotForm.chaakiDate.toString())
          let today = new Date(chaakiDateEpoch);
          let newTodayDate = new Date();
          let followUpDate = new Date(chaakiDateEpoch);
          let finalDate =  followUpDate.setDate((today.getDate() + 18));
          this.api.getCenterById(lotForm.center).then(center => {
            const params = {
              customerType: 'FARMER',
              type: 'SALE_TO_RM',
              note: 'last Cocoon Purchase date:' + newTodayDate.getDate() + '/' + (newTodayDate.getMonth() + 1) + '/' + newTodayDate.getFullYear() + ', follow-up for next cycle.',
              followUpDate: finalDate,
              status: 'Active',
              assignedToPhone: center['ownerPhoneNumber'],
              assignedToName: center['ownerName'],
              customerId: this.selectedFarmer,
              customerName: this.selectedFarmerDetails ? this.selectedFarmerDetails['farmer'].name ? this.selectedFarmerDetails['farmer'].name : '' : '',
              customerPhone: this.selectedFarmerDetails ? this.selectedFarmerDetails['farmer'].phone : '',
              centerId: lotForm.center,
              centerName: center['centerName'],
              assignedBy: 'Tech Reshamandi'
            };
            this.api.createFollowUp(params).then(res => {
              this.router.navigate(['/resha-farms/cocoon-lot']);
              this.loading=false;
              this.snackBar.open('Created lot successfully', 'Ok', {
                duration: 3000
              });
            })
          })
        } else {
          this.snackBar.open('Failed to create lot', 'Ok', {
            duration: 3000
          });
        }
      }).catch(err=>{
        this.loading=false;
      });
    }
  }

  onCocoonTypeChange() {
    if(this.lotCreateForm.get('type').value == 'BIVOLTINE') {
      this.typeOfCocoon = "BIVOLTINE"
    }
    if(this.lotCreateForm.get('type').value == 'CBGOLD') {
      this.typeOfCocoon = "CBGOLD"
    }
      if (this.userPriceData.length ==0) {
        //alert('Please select Center first');
        this.alertMessage ="Please select Center and farmer first"; 
      } else {
        this.alertMessage =""; 
        this.SelectedcocoonPriceValues= [];
        this.userPriceData.forEach(item =>{
          if (item.event.params.type == this.typeOfCocoon) {
            this.SelectedcocoonPriceValues.push(item);            
          }
        })
      }

      this.uom = 'KGS';
      if(this.selectedFarmer){
        this.enterFarmerDetails(this.selectedFarmer, true, false);
        this.lotCreateForm.get('chaakiCenterName').addValidators(Validators.required);
        this.lotCreateForm.get('chaakiCenterPhone').addValidators([Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]);
        this.lotCreateForm.get('chaakiRegion').addValidators(Validators.required);
        this.lotCreateForm.get('chaakiCity').addValidators(Validators.required);  
      }else{
        this.alertMessage ="Please select Center and farmer first"; 
      }
        
    if (this.lotCreateForm.get('type').value && (this.lotCreateForm.get('type').value == 'BIVOLTINE')) {
      this.lotCreateForm.get('systemPredictedGrade').addValidators(Validators.required);
      this.lotCreateForm.get('systemPredictedGrade').updateValueAndValidity();
      this.removeAddStar = true;
    } else {
      this.lotCreateForm.get('systemPredictedGrade').clearValidators();
      this.lotCreateForm.get('systemPredictedGrade').updateValueAndValidity();
      this.removeAddStar = false;
    }
    //this.validatePrice();
   // this.mapCenterData();
      if(this.lotCreateForm.get('rmGrade').value){
        this.onGradeValueChanges();
      }
    this.cdr.detectChanges();
  }

  updateRecomendedPrice(){
    if(this.typeOfCocoon){
      this.alertMessage =""; 
        this.SelectedcocoonPriceValues= [];
        this.userPriceData.forEach(item =>{
          if (item.event.params.type == this.typeOfCocoon) {
            this.SelectedcocoonPriceValues.push(item);
          }
        })
        this.cdr.detectChanges();

        if(this.selectedRmGrade){
          this.onGradeValueChanges();
        }
    }
  }

  mapCenterData() {
    this.alertMessage = "";
    let centerId = this.lotCreateForm.get('center').value;
    this.getCEnterdetailsBycenterID(centerId);
    this.getPriceDataForCenter(centerId);
    


    if(centerId && this.uom === 'KGS') {
      for (let i=0;i<this.centerListByUser.length;i++) {
        if(this.centerListByUser[i].id==centerId) {
          this.minimumCentreBagWeight = this.centerListByUser[i].cocoonLotBagDeduction ? this.centerListByUser[i].cocoonLotBagDeduction : 0;
          this.lotCreateForm.get('centerCocoonWeightLoss').patchValue(this.centerListByUser[i].cocoonLotWeightLoss ? this.centerListByUser[i].cocoonLotWeightLoss : 0);
          this.lotCreateForm.get('backupCenterCocoonWeightLoss').patchValue(this.centerListByUser[i].cocoonLotWeightLoss ? this.centerListByUser[i].cocoonLotWeightLoss : 0);
          this.lotCreateForm.get('centerCocoonLogisticCostPerKg').patchValue(this.centerListByUser[i].cocoonLotLogisticsCostPerKg ? this.centerListByUser[i].cocoonLotLogisticsCostPerKg : 0);
          this.lotCreateForm.get('centerPerBagWeightDeduction').patchValue(this.centerListByUser[i].cocoonLotBagDeduction ? this.centerListByUser[i].cocoonLotBagDeduction : 0);
          this.cdr.detectChanges()
          break;
        }
      }
    } else {
      this.minimumCentreBagWeight = 0;
      this.lotCreateForm.get('centerCocoonWeightLoss').patchValue(0);
      this.lotCreateForm.get('centerCocoonLogisticCostPerKg').patchValue(0);
      this.lotCreateForm.get('centerPerBagWeightDeduction').patchValue(0);
      this.lotCreateForm.get('backupCenterCocoonWeightLoss').patchValue(0);
      this.cdr.detectChanges()
    }
    this.onValueChanges();
  }

  getCEnterdetailsBycenterID(centerid){
    this.api.getCenterById(centerid).then(center => {
      console.log(center);
      
    })
  }

  // getting recomnded rate for the user
  getPriceDataForCenter(centerId){
    this.api.getCenterPriceSheet(centerId).then(response=>{
      this.userPriceData = response['content'];
      this.getUserGroupBycnteranduserIds();

      // this.userPriceData.forEach(item=>{

      // })
      // this.executiveApprovalPrice
      // this.L1ApprovalPrice
      // this.L2ApprovalPrice

      // this.executiveApprovalPrice = this.userPriceData['conditions[0]']['value[1]'];
      // console.log(' this.executiveApprovalPrice', this.executiveApprovalPrice);
      
      
    })
  }
  getUserGroupBycnteranduserIds(){
    // getUserGroupData
    let centerId = this.lotCreateForm.get('center').value;
    let id =JSON.parse(localStorage._ud)?.internalid;
    this.api.getUserGroupData(centerId,id).then(res=>{      
      // this.userRelatedGroupId = res['_embedded'] ? res['_embedded']['centergroup'][0].id : "";
      this.userRelatedGroupId = res ? res['id'] : "";
      this.userRelatedGroupName = res ? res['groupName'] : "";
      this.updateRecomendedPrice();//to reset the recomended price .

    })
  }

  getGroupIndex(applicableto, entity){
    for(let i=0; i < applicableto.length; i++) {
      if(applicableto[i].entity == entity) {
        return i;
      }
    }
    return -1 ;
  }

  onGradeValueChanges(){
    // if (this.lotCreateForm.get('rmGrade').value == 'A_PLUS') {
    //   this.selectedRmGrade = "A_PLUS";
    // } else if(this.lotCreateForm.get('rmGrade').value == 'B_PLUS'){
    //  this.selectedRmGrade = "B_PLUS";
    // } else {
     this.selectedRmGrade = this.lotCreateForm.get('rmGrade').value;
   // }

    this.selectedGradeList = this.SelectedcocoonPriceValues.find( grade => grade.event.params.grade ==  this.selectedRmGrade );

    this.execLimit= this.selectedGradeList.conditions[0].value[1];
    this.l1Limit=this.selectedGradeList.conditions[1].value[1];
    this.l2Limit=this.selectedGradeList.conditions[2].value[1];
    


    if(this.selectedGradeList){
      this.selectedGradeList['conditions'].forEach( condition => {
          let groupIndex = this.getGroupIndex(condition['applicabaleTo'], 'RMGROUP');
          if(groupIndex > -1){
            let data = condition['applicabaleTo'][groupIndex]['ids'].findIndex(id => (id == this.userRelatedGroupId));
            if(data > -1){
              this.userApplicableRate = {}
              this.userApplicableRate.recomndedRate =  this.selectedGradeList['event']['params']['recomendedRate'];
              //this.lotCreateForm.get('receivedWeightPricePerKg').patchValue(this.userApplicableRate.recomndedRate);
              this.lotCreateForm.get('recomendedRate').patchValue(this.userApplicableRate.recomndedRate);
              this._cd.detectChanges();
              if(condition['operator'] == "between"){
                this.userApplicableRate.isvalidatinRequired = true;
                this.userApplicableRate.minRate = condition['value'][0];
                this.userApplicableRate.maxRate = condition['value'][1];
              }else if(condition['operator'] == "greaterThan"){
                this.userApplicableRate.isvalidatinRequired = false;
                this.userApplicableRate.minRate = 0;
                this.userApplicableRate.maxRate = 'NA';
              }else{
                this.userApplicableRate.isvalidatinRequired = false;
              }
          }
        }
      })
    }else{
      this.userApplicableRate = {}
      this.userApplicableRate.recomndedRate = false;
      this.lotCreateForm.get('receivedWeightPricePerKg').patchValue(0);
      this.lotCreateForm.get('recomendedRate').patchValue(0);
    }
    

    // this.SelectedcocoonPriceValues.forEach(slectedGrade =>{

    //   if(slectedGrade.event.params.grade ==  this.selectedRmGrade ){
    //     this.selectedGradeList = slectedGrade;

    //     this.selectedGradeList['conditions'].forEach( condition => {
    //         let groupIndex = this.getGroupIndex(condition['applicabaleTo'], 'RMGROUP');
    //         if(groupIndex > -1){
    //           let data = condition['applicabaleTo'][groupIndex]['ids'].findIndex(id => (id == this.userRelatedGroupId));
    //           if(data > -1){
    //             this.userApplicableRate = {}
    //             this.userApplicableRate.recomndedRate =  this.selectedGradeList['event']['params']['recomendedRate'];
    //             this.lotCreateForm.get('receivedWeightPricePerKg').patchValue(this.userApplicableRate.recomndedRate);
    //             this.lotCreateForm.get('recomendedRate').patchValue(this.userApplicableRate.recomndedRate);
    //             this._cd.detectChanges();
    //             if(condition['operator'] == "between"){
    //               this.userApplicableRate.isvalidatinRequired = true;
    //               this.userApplicableRate.minRate = condition['value'][0];
    //               this.userApplicableRate.maxRate = condition['value'][1];
    //             }else if(condition['operator'] == "greaterThan"){
    //               this.userApplicableRate.isvalidatinRequired = false;
    //               this.userApplicableRate.minRate = 0;
    //               this.userApplicableRate.maxRate = 'NA';
    //             }else{
    //               this.userApplicableRate.isvalidatinRequired = false;
    //             }
    //         }
    //       }
    //     })
    //   }

    // })

    this.lotCreateForm.get('centerCocoonWeightLoss').patchValue(this.lotCreateForm.get('backupCenterCocoonWeightLoss').value)
      let centerWeightLossTotal = this.lotCreateForm.get('centerCocoonWeightLoss').value > 0 ? this.lotCreateForm.get('receivedWeight').value > 0 ?
                                  (this.lotCreateForm.get('centerCocoonWeightLoss').value * this.lotCreateForm.get('receivedWeight').value /100): 0 : 0

      centerWeightLossTotal = Math.round((centerWeightLossTotal + Number.EPSILON)*100)/100;

      if(this.lotCreateForm.get('rmGrade').value && (this.lotCreateForm.get('rmGrade').value == 'JHILLI' || this.lotCreateForm.get('rmGrade').value == 'DOUBLECOCOON')) {
        centerWeightLossTotal = 0;
        this.lotCreateForm.get('centerCocoonWeightLoss').patchValue(0);
      }

      this._cd.detectChanges();
  }

  atFarmerLocation(value) {
    if(!value) {
     // this.mapCenterData();
      if (this.lotCreateForm.get('type').value && (this.lotCreateForm.get('type').value == 'BIVOLTINE')){
        this.lotCreateForm.get('systemPredictedGrade').addValidators(Validators.required);
        this.lotCreateForm.get('systemPredictedGrade').updateValueAndValidity();
        this.removeAddStar = true;
      }
    }else{
      if(this.lotCreateForm.get('type').value && (this.lotCreateForm.get('type').value == 'BIVOLTINE')){
        this.lotCreateForm.get('systemPredictedGrade').clearValidators();
        this.lotCreateForm.get('systemPredictedGrade').updateValueAndValidity();
        this.removeAddStar = false;
      }
    }
  }

  uom = 'KGS';
  onValueChanges() {
   // this.cancelCouponRedeem();
      this.lotCreateForm.get('centerCocoonWeightLoss').patchValue(this.lotCreateForm.get('backupCenterCocoonWeightLoss').value)
      let centerWeightLossTotal = this.lotCreateForm.get('centerCocoonWeightLoss').value > 0 ? this.lotCreateForm.get('receivedWeight').value > 0 ?
                                  (this.lotCreateForm.get('centerCocoonWeightLoss').value * this.lotCreateForm.get('receivedWeight').value /100): 0 : 0

      centerWeightLossTotal = Math.round((centerWeightLossTotal + Number.EPSILON)*100)/100;

      this.lotCreateForm.get('centerTotalCocoonWeightLoss').patchValue(centerWeightLossTotal);


      let totalBagsWeight = this.lotCreateForm.get('centerPerBagWeightDeduction').value > 0 ? this.lotCreateForm.get('noOfBags').value > 0 ?
                              (this.lotCreateForm.get('centerPerBagWeightDeduction').value * this.lotCreateForm.get('noOfBags').value)/1000 : 0 : 0;

      this.lotCreateForm.get('centerTotalBagWeightDeduction').patchValue(totalBagsWeight);

      let totalWeightLoss =centerWeightLossTotal + totalBagsWeight;

      let actualWeight = this.lotCreateForm.get('receivedWeight').value > 0 ?
                            this.lotCreateForm.get('receivedWeight').value - totalWeightLoss: this.lotCreateForm.get('receivedWeight').value;

      actualWeight = Math.round((actualWeight + Number.EPSILON)*100)/100;

      this.lotCreateForm.get('lotWeight').patchValue(actualWeight);

      let actualPricePerKg = this.lotCreateForm.get('centerCocoonLogisticCostPerKg').value > 0 ?
                                this.lotCreateForm.get('receivedWeightPricePerKg').value - this.lotCreateForm.get('centerCocoonLogisticCostPerKg').value : this.lotCreateForm.get('receivedWeightPricePerKg').value;
      actualPricePerKg = Math.round((actualPricePerKg + Number.EPSILON)*100)/100;

      this.lotCreateForm.get('pricePerKg').patchValue(actualPricePerKg);

      let centerTotalLogisticsCost = this.lotCreateForm.get('centerCocoonLogisticCostPerKg').value > 0 ? this.lotCreateForm.get('centerCocoonLogisticCostPerKg').value * this.lotCreateForm.get('lotWeight').value : 0;

      centerTotalLogisticsCost = Math.round((centerTotalLogisticsCost + Number.EPSILON)*100)/100;

      this.lotCreateForm.get('centerTotalLogisticsCost').patchValue(centerTotalLogisticsCost);

      let total = this.lotCreateForm.get('lotWeight').value * this.lotCreateForm.get('pricePerKg').value;

      total = Math.round((total + Number.EPSILON)*100)/100;

      total = total + this.lotCreateForm.get('couponAmt').value;

      let actualGrossAmount = this.lotCreateForm.get('lotWeight').value * this.lotCreateForm.get('receivedWeightPricePerKg').value;

      actualGrossAmount = Math.round((actualGrossAmount + Number.EPSILON)*100)/100;

      this.lotCreateForm.get('actualGrossAmount').patchValue(actualGrossAmount);

      this.lotCreateForm.get('totalPrice').patchValue(total.toFixed(2));
    this.cdr.detectChanges();
    this.validateUserPrice();
  }

  validateUserPrice(){
    console.log(this.userApplicableRate);
    if(this.userApplicableRate && this.userApplicableRate.isvalidatinRequired && (this.userApplicableRate.maxRate < this.lotCreateForm.get('receivedWeightPricePerKg').value) && this.lotCreateForm.get('receivedWeight').value && this.lotCreateForm.get('grade').value){ // && this.lotCreateForm.get('receivedWeightPricePerKg').value
      this.isApprovalRequestRequired = true;
    }else{
      if(this.selectedFarmer && this.isApprovalRequestRequired){
        this.enterFarmerDetails(this.selectedFarmer, true, true);
      }
      this.isApprovalRequestRequired = false;
    }
    
    this._cd.detectChanges();
    
  }

  validatePrice() {
    this.reshamandiRateByType = this.getReshamandiPriceByType();
    if (this.reshamandiRateByType) {
      if (this.lotCreateForm.get('receivedWeightPricePerKg').value > this.reshamandiRateByType.maxRate) {
        this.invalidRate = true;
        this._cd.detectChanges();
      } else {
        this.invalidRate = false;
        this._cd.detectChanges();
      }
    }
  }

  async getmandiList() {
    this.ngxLoader.stop();
    this.api.getMandiPrices().then(res => {
      const mandiList = res['_embedded']['mandi'];
      for (let i = 0; i < mandiList.length; i++) {
        if (mandiList[i].name.toUpperCase() == 'RESHAMANDI') {
          this.reshamandiRate = mandiList[i];
          break;
        }
      }
      this.cdr.detectChanges();
    }, err => {
      console.log(err);
    });
  }

  getReshamandiPriceByType() {
    for (let i = 0; i < this.reshamandiRate.mandiRateByType.length; i++) {
      if (this.reshamandiRate.mandiRateByType[i].type == this.lotCreateForm.get('type').value) {
        return this.reshamandiRate.mandiRateByType[i];
      }
    }
  }

  // Lot Validations
  isControlValidForLot(controlName: string): boolean {
    const control = this.lotCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForLot(controlName: string): boolean {
    const control = this.lotCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForLot(validation, controlName): boolean {
    const control = this.lotCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedForLot(controlName): boolean {
    const control = this.lotCreateForm.controls[controlName];
    return control.dirty || control.touched;
  }

  redeemCode(formValue) {
    if (this.edit) {
      this.selectedFarmer = this.lotCreateForm.get('farmer').value;
    }
    this.ngxLoader.stop();
    this.api.verifyCoupon(formValue.couponCode.toUpperCase(), this.selectedFarmer, this.lotCreateForm.get('totalPrice').value, 'COCOON_PURCHASE').then((res: any) => {
      if (res.status) {
        this.couponValid = true;
        this.lotCreateForm.get('couponAmt').patchValue(res.value);
        this.couponMsg = this.lotCreateForm.get('couponAmt').value + ' Added Suceessfully. '
        let total = this.lotCreateForm.get('totalPrice').value;
        total = Math.round((+total + Number.EPSILON)*100)/100;
        total = total + this.lotCreateForm.get('couponAmt').value;
        this.lotCreateForm.get('totalPrice').patchValue(total);
        this.cdr.detectChanges();
      } else {
        this.couponValid = false;
        this.couponMsg = res.messgage;
      }
      this._cd.detectChanges();
    }, err => {
      this.snackBar.open('Please select farmer, enter weight and price', 'Ok', {
        duration: 3000
      });
    })
  }

  cancelCouponRedeem() {
    if (this.lotCreateForm.get('couponAmt').value > 0) {
      this.ngxLoader.stop();
      this.api.deleteCoupon(this.lotCreateForm.get('couponCode').value, this.selectedFarmer).then(res => {
        this.snackBar.open('Please apply the coupon again', 'Ok', {
          duration: 3000
        });
      })
    }
    this.couponMsg = '';
    this.lotCreateForm.get('couponCode').patchValue('');
    let total = this.lotCreateForm.get('totalPrice').value - this.lotCreateForm.get('couponAmt').value;
    this.lotCreateForm.get('totalPrice').patchValue(total.toFixed(2));
    this.lotCreateForm.get('couponAmt').patchValue(0);
  }


  modalRef;
  closeResult: string;
  async open(content) {
    this.createdFarmerId = "";
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  async openConfirmation() {
    

    this.modalRef = this.modalService.open(this.yarnPurchaseConfirmation)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  initiateOtp(farmerForm){
    let reqObj = {
      "phone":farmerForm.phone,
      "profile":"FARMER"
    }
    this.api.apiTemporaryOboardFarmer(reqObj).then(res => {
      this.api.apiGenerateFarmerOTP(farmerForm.phone).then(res => {
        this.isOTPSent =true;
        this._cd.detectChanges();
      })
    })
}

resendOtp(farmerForm){
  this.api.apiResendFarmerOTP(farmerForm.phone).then(res => {
    this.isOTPSent =true;
  })
}

validateOTP(farmerForm){
  let reqobj = {
      "phone": farmerForm.phone,
      "otp": farmerForm.mobileOTP
    }
  
  this.api.apiValidateFarmerOTP(reqobj).then(res => {
      this.createFarmer(farmerForm);
  })

}


  createFarmer(farmerForm) {
    const params = {
      name: farmerForm.name,
      phone: farmerForm.phone,
      alternatePhone: '',
      farmArea: '',
      chaakiDate: Date.parse(new Date().toString()),
      capacity: '',
      chaakiCenterName: '',
      chaakiCenterPhone: '',
      refferedBy: '',
      farmEquipments: [],
      cocoonType: farmerForm.cocoonType,
      address: {
        address: '',
        city: '',
        taluk: '',
        village: '',
        district: '',
        state: '',
        pincode: '',
        region: ''
      },
      kycPANNumber: '',
      kycAdhaarNumber: '',
      bankDetails: farmerForm.bankDetails,

      center: '/center/' + farmerForm.center
    }
    this.ngxLoader.stop();
    this.api.farmersOnboarding(params).then(res => {
     // this.modalRef.close();
      if (res) {
        this.selectedFarmer = res['id'];
        this.createdFarmerId = res['id'];
        this.farmerList.push(res);
        this.onFarmerSelection('','')
      //  this.farmerCreateForm.reset();
        this.snackBar.open('Created farmer successfully', 'Ok', {
          duration: 3000
        });
      }
    }, err => {
      console.log(err);
      if(err.status == '409'){
        this.isOTPSent =false;
      }
    });

  }
  addFarmerName(farmerName) {    
    const params = {
      name: farmerName.name
    }
    this.ngxLoader.stop();
    this.api.updateFarmers(params, this.selectedFarmer).then(res => {
      this.modalRef.close();
      if (res) {
        this.farmerList = [];
        this.selectedFarmer = res['id'];
        this.farmerList.push(res);
        this.onFarmerSelection('','')
        this.addFarmerNameForm.reset();
        this.snackBar.open('Updated successfully', 'Ok', {
          duration: 3000
        });
      }
    })
  }
  isControlValidForReeler(controlName: string): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlValidForChawki(controlName: string): boolean {
    const control = this.chawkiCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  isControlInvalidForChawki(controlName: string): boolean {
    const control = this.chawkiCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  controlHasErrorForChawki(validation, controlName): boolean {
    const control = this.chawkiCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedForReeler(controlName): boolean {
    const control = this.farmerCreateForm.controls[controlName];
    return control.dirty || control.touched;
  }
  isControlValid(controlName: string): boolean {
    const control = this.addFarmerNameForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.addFarmerNameForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.addFarmerNameForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.addFarmerNameForm.controls[controlName];
    return control.dirty || control.touched;
  }

  onCocoonImageUpload(image){
   
    this.imageUploading = true;
    this.imageFile = image;
    if (image) {
      const file = image.target.files[0];

      const lastModified = new Date(image.target.files[0].lastModified);
      const now = new Date();
      const msBetweenDates = Math.abs(lastModified.getTime() - now.getTime());
      // convert ms to hours                  min  sec   ms
      const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);
       if (hoursBetweenDates < 24) {
        const reader = new FileReader();
        reader.onload = () => {
          this.ngxLoader.stop();
          this.previewImage = reader.result as string;
          this.getS3CatUrl(file.type,file)
          this._cd.detectChanges();
        };
        reader.readAsDataURL(file);
      } else {
        this.toaster.error('Oops! Upload latest image.', 'OK', {
          timeOut: 4000
        });
      }
    }
    image.target.value='';
  }

    /**@Get s3 url to upload file */
    async getS3CatUrl(fileType,file){
      
      try{
        this.ngxLoader.stop();
        this._cd.detectChanges();
        await this.api.rendittagradingS3Url(fileType.split('/')[1]).then((res:S3UrlResponse)=>{
          this.ngxLoader.stop();
          this.calluploadImageToS3API(res.targetUrl,file,res.fileName);
        })
      }catch(err){
        console.log(err);
        
        this.imageUploading = false;
        this.ngxLoader.stop();
        this.imageUploaded = false;
        this.remove();
        this.snackBar.open('Image upload Failed', 'Ok', {
          duration: 3000
        });
        this.previewImage = null;
        this._cd.detectChanges()
      }

    }

      /***S3 API call */
  async calluploadImageToS3API(s3url:String,file,fileNameFromS3:any){
    this.ngxLoader.stop();
    try{
      this.ngxLoader.stop();
      this._cd.detectChanges();
      this.api.updateImageToS3Directly(s3url,file).then(res=>{
        this.ngxLoader.stop();
        this._cd.detectChanges();
        this.lotCreateForm.get('cocoonRendittaImage').patchValue(fileNameFromS3);
        this.previewImage = fileNameFromS3;
        this.imageUploaded = true;
        this.imageUploading = false;
        // get system generated grade
        if(this.edit && this.lotCreateForm.get('cocoonRendittaId').value) {
          this.api.deleteRendittaGradingById(this.lotCreateForm.get('cocoonRendittaId').value).then(res=> {
            let params = {
                cocoonRendittaId: null
            }
            this.api.putCocoonLot(this.lotId, params).then(lotUpdated => {

            })
            let reqObj =  {
              url:fileNameFromS3
            }
            this.ngxLoader.stop();
            this.api.getRendittaGrading(reqObj).then((res:any) => {
              if(res.responseCode == 200) {
                this.lotCreateForm.get('systemPredictedGrade').patchValue(res.data.predictedGrade);
                this.lotCreateForm.get('cocoonRendittaId').patchValue(res.data.rendittaGradeId);
                this.lotCreateForm.get('rmGrade').patchValue('Reshmandi'+ res.data.predictedGrade);
                console.log( this.lotCreateForm.get('rmGrade').value);
                

                let params = {
                    cocoonRendittaId: res.data.rendittaGradeId
                }
              this.api.putCocoonLot(this.lotId, params).then(lotUpdated => {

              })
                this.cdr.detectChanges();
               // this.ngxLoader.stop();
              } else {
                  this.remove();
                  this.ngxLoader.stop();
                  this.snackBar.open('Image upload Failed, please try again', 'Ok', {
                    duration: 3000
                  });
              }
            })
          })
        } else {
          this.ngxLoader.stop();
          this._cd.detectChanges();
          let reqObj =  {
            url:fileNameFromS3
          }
          this.api.getRendittaGrading(reqObj).then((res:any) => {
            if(res.responseCode == 200) {
              this.lotCreateForm.get('systemPredictedGrade').patchValue(res.data.predictedGrade);
              this.lotCreateForm.get('cocoonRendittaId').patchValue(res.data.rendittaGradeId);
              this.lotCreateForm.get('rmGrade').patchValue(res.data.predictedGrade);
              this.onGradeValueChanges();
              this.cdr.detectChanges();
              //this.ngxLoader.stop();
            } else {
                this.remove();
                this.ngxLoader.stop();
                this.snackBar.open('Image upload Failed, please try again', 'Ok', {
                  duration: 3000
                });
            }
          })
        }


        this._cd.detectChanges();
        })
    }catch(err){
      console.log(err);
      
        this.imageUploaded = false;
        this.ngxLoader.stop();
        this.lotCreateForm.get('cocoonRendittaImage').patchValue('');
        this.snackBar.open('Image upload Failed', 'Ok', {
          duration: 3000
        });
        this.remove();
        this._cd.detectChanges()
    }
  }

  remove(){
    this.previewImage = undefined;
    this.imageUploaded = false;
    this.imageFile = null;
    this.lotCreateForm.get('systemPredictedGrade').patchValue('');
    this.cdr.detectChanges();
  }

  async getAllUsers() {
    this.usersList = [];
    this.ngxLoader.stop();
    this.api.getAllUsersList(this.globalService.v2Roles).then(res => {
      if (res['_embedded']['user'] && res['_embedded']['user'].length) {
        this.usersList = res['_embedded']['user'];
      } else {
        this.usersList = [];
      }
      this._cd.detectChanges();
    });
  }



  redirectToFarmerCrud(){
    this.router.navigate(['/resha-farms/farmers-silk/crud'],{queryParams:{redirecto:'cocoon-lot-crud'} });
  }

  getCenterName(lotForm):string {  
    let centerObj = this.centerListByUser.find(x=>x.id==lotForm.center);
    
    return centerObj['centerName'];
 } 

  // Approval flow API's Intigration
  raiseTicketForApproval(lotForm){
    // this.modalRef.close();
    //this.loading=true;
    let centerName=this.getCenterName(lotForm)
    let uptikSp = lotForm.pricePerKg + (Math.round(((lotForm.pricePerKg * 0.05) + Number.EPSILON)*100)/100);
    const ticketParms = {
      "processDefinitionKey" : "EscalateMatrixProcess",
      "data" :{
        createdByName: this.user.name ? this.user.name: "",
        createdByNumber:this.user.phonenumber ? this.user.phonenumber: "",
        createdByGroup: this.userRelatedGroupName,
        newValue :lotForm.receivedWeightPricePerKg,
        farmer:  this.farmerRes,
        type: lotForm.type,
        status: 'New',
        grade: lotForm.grade,
        noOfBags: lotForm.noOfBags,
        rmGrade: lotForm.rmGrade,
        lotWeight: lotForm.lotWeight,
        pricePerKg: lotForm.pricePerKg,
        totalPrice: lotForm.totalPrice,
        paymentAfterDays: +lotForm.paymentAfterDays,
        center: '/center/' + lotForm.center,
        SelectedcenterID:lotForm.center + '' ,
        selectedCenterName:centerName,
        couponCode: lotForm.couponAmt ? lotForm.couponCode.toUpperCase() : '',
        couponAmount: lotForm.couponAmt ? lotForm.couponAmt: null,
        bank: {
          accountNumber: lotForm.accountNumber.trim(),
          beneficiaryName: lotForm.beneficiaryName,
          ifscCode: lotForm.ifscCode.trim(),
          bankName: lotForm.bankName,
        },
        isDisplayActive: false,
        sellingPricePerKg: uptikSp,
        availableQuantity: lotForm.lotWeight,
        centerCocoonLogisticCostPerKg: lotForm.centerCocoonLogisticCostPerKg ? lotForm.centerCocoonLogisticCostPerKg : null,
        centerCocoonWeightLoss: lotForm.centerCocoonWeightLoss ? lotForm.centerCocoonWeightLoss : null,
        receivedWeightPricePerKg: lotForm.receivedWeightPricePerKg,
        receivedWeight: lotForm.receivedWeight,
        actualGrossAmount: lotForm.actualGrossAmount,
        centerTotalLogisticsCost: lotForm.centerTotalLogisticsCost,
        cocoonRendittaImage: lotForm.cocoonRendittaImage ? lotForm.cocoonRendittaImage : null,
        recommendedGrade: lotForm.systemPredictedGrade ? lotForm.systemPredictedGrade : null,
        cocoonRendittaId: lotForm.cocoonRendittaId ? lotForm.cocoonRendittaId : null,
        lotSoldBy: lotForm.lotSoldBy ? lotForm.lotSoldBy : null,
        centerPerBagWeightDeduction: lotForm.centerPerBagWeightDeduction ? lotForm.centerPerBagWeightDeduction : null,
        centerTotalBagWeightDeduction: lotForm.centerTotalBagWeightDeduction ? lotForm.centerTotalBagWeightDeduction : null,
        centerTotalCocoonWeightLoss: lotForm.centerTotalCocoonWeightLoss ? lotForm.centerTotalCocoonWeightLoss : null,
        centerBagWeightDeductionOverride: lotForm.centerBagWeightDeductionOverride ? lotForm.centerBagWeightDeductionOverride : false,
        uom: this.uom,
        userSelectedGrade: this.selectedGradeList,
        createdbyGroupId: this.userRelatedGroupId
      }
    }    
    this.api.createApprovalTicket(ticketParms).then(response=>{
      console.log('tikt creation==>',response);
      this.router.navigate(['/resha-farms/cocoon-lot/approval-tickets']);
      
    })
  }

  ngOnInit(): void {
    this.api.getConfigByConfig('com.reshamandi.v1.cocoon_lot.procurement.bank_verification').then((res:any)=> {
      this.bank_verification = res?.value;
      console.log(this.bank_verification);
      
    });
  }
  
}