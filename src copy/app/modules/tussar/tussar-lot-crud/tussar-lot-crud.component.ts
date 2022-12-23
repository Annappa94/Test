import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef, ElementRef, Inject, LOCALE_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { AddressFormComponent } from 'src/app/modules/shared/address-form/address-form.component';
import { ACCOUNTNUMBER, IFSCCODE } from 'src/app/constants/enum/regex.validator';
import { BankFormComponent } from '../../shared/bank-form/bank-form.component';
import { AddressPincodeFormComponent } from '../../shared/address-pincode-form/address-pincode-form.component';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';




@Component({
  selector: 'app-tussar-lot-crud',
  templateUrl: './tussar-lot-crud.component.html',
  styleUrls: ['./tussar-lot-crud.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TussarLotCrudComponent  implements OnInit {
  @ViewChild(AddressPincodeFormComponent,{static:true} ) addressForm : AddressPincodeFormComponent;
  @ViewChild(BankFormComponent,{static:true} ) bankForm : BankFormComponent;
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
  isOTPSent: any;
  iskycVerified = false;
  removeAddStar = false;
  createdFarmerId: any;
  farmerData:any;
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
    {
      displayName: 'Tussar',
      code: 'TUSSAR'
    }
  ];

  tussarlotform: any = new UntypedFormGroup({
    farmerId: new UntypedFormControl(),
    centerId: new UntypedFormControl(),
    nextCropDate: new UntypedFormControl(),
    receivedUnits: new UntypedFormControl('',Validators.required),
    ratePerPiece: new UntypedFormControl('',Validators.required),
    grossTotalAmount: new UntypedFormControl(),
    couponCode: new UntypedFormControl(),
    couponAmt: new UntypedFormControl(),
    netPayableAmount: new UntypedFormControl(''),
    // paymentStatus: new FormControl('online'),
    lotSoldBy: new UntypedFormControl(),
    lotWeight: new UntypedFormControl(),
    logisticsCost: new UntypedFormControl(),
    tussarRendittaId:new UntypedFormControl(''),
    code: new UntypedFormControl(''),
    farmerName:new UntypedFormControl(),
    grade:new UntypedFormControl('',Validators.required),
    representative:new UntypedFormControl(''),
    rmGrade:new UntypedFormControl('',Validators.required),
    totalPrice: new UntypedFormControl(''),

    bank: new UntypedFormGroup({
      accountNumber: new UntypedFormControl(''),
      beneficiaryName: new UntypedFormControl(''),
      ifscCode: new UntypedFormControl(''),
      bankName: new UntypedFormControl(''),
      branchName:new UntypedFormControl()

    }),
    // address: new FormGroup({
    //   city: new FormControl(),
    //   district: new FormControl(),
    //   state: new FormControl(),
    //   pincode: new FormControl(),
    //   region: new FormControl(),
      
    // }),
    uom: new UntypedFormControl(),
    status: new UntypedFormControl(''),
      paymentStatus: new UntypedFormControl()

  })
  isbankverified: any;
  amount: number;
  cuponamount: any;
 
  getLotDetails;
  formerDetail
  
  loading: boolean = false;
  reshamandiRate: any;
  reshamandiRateByType;
  invalidRate = false;
  refferalCouponApplied = false;

  farmerLotKhata: any = [];
  farmerLotCount = 0;
  minDate;
  chaakiDate;

  farmerHasIotDevice: boolean = false;

  defaultPagination = {
    currentPage: 0,
    pageSize: 1000,
    total: 0,
    pages: [],
    currentColumn: 'createdDate',
    currentDirection: 'desc',
  }
  imageFile: any;
  previewImage: any
  imageUploaded: boolean = false;
  imageUploading: boolean = false;
  usersList: any = [];
  chawkiList: any = [];
  minimumCentreBagWeight: number = 0;
  selectedChawki: any;
  farmeCSBkycVerification: any;
  farmercustomerTypeName: any;
  documentsList: any;
  queryParams: any;
  uom = 'PCS';


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
    private $gaService: GoogleAnalyticsService,
    @Inject(LOCALE_ID) private locale: string,) {
    const currentYear = moment().year();
    const currentMonth = moment().month();
    const currentDay = moment().date();
    this.isOTPSent = false;
    this.minDate = moment([currentYear, currentMonth, currentDay]);

    let today = new Date();
    let todayEpoch = Date.parse(today.toString());
    let chaakiDateEpoch = new Date(todayEpoch);
    let finalChaakiDate = chaakiDateEpoch.setDate((today.getDate() + 8));
    this.chaakiDate = formatDate(finalChaakiDate, 'MM-dd-yyyy', this.locale);

    this.user = JSON.parse(localStorage.getItem('_ud'));
    this.getCenters();
    this.createLotForm();
    this.getmandiList();
    this.getAllPromotionalCoupons();
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.lotId = params['id'];
        
        // this.getCoonLotDetail(this.lotId);
        this.getTussarlotByid();
        this.edit = true;

      } else {
        if (this.globalService.globalFarmLotData) {
          this.patchLocaldata(this.globalService.globalFarmLotData);
        }
        this.edit = false;
      }

    });
    this.farmerParams();
    // this.chawkiParams();
    this.getAllUsers();
    // this.getAllChawkis();
    this.getAllCustomerTypes();
    this.addFarmerNameForm = this.form.group({
      name: new UntypedFormControl('', Validators.required),
    })
    this.removeAddStar = false;
    // this.getCentersByLoginId();
    this.route.queryParams.subscribe(params => {
      // console.log(params);
      this.queryParams = params;
      if (this.queryParams.selectedFarmerId) {
        //this.getFarmersList({'term' : this.queryParams.selectedFarmerPhone});
        this.selectedFarmer = parseInt(this.queryParams.selectedFarmerId);
        this.getCouponCodeForAFarmer();        
        this.enterFarmerDetails(this.selectedFarmer, true, true);
      }
    });
    this.isbankverified = false;

  }

  ngOnInit(): void {
    // this.getCentersByLoginId();
    //this.getTussarlotByid()
    // console.log('selectedFarmer',this.selectedFarmer)
    console.log('efdsfsdf',this.tussarlotform.value)

  }
  getAllChawkis() {
    this.api.getAllChawkis().then(res => {
      this.chawkiList = res['_embedded']['chawki']
    });
  }
  kycCustomerTypes: any = [];
  getAllCustomerTypes() {
    this.api.getAllCustomerTypes().then(res => {
      this.kycCustomerTypes = res['_embedded']['kyccustomer'];
      this._cd.detectChanges();
    });
  }

  chawkiToChanged(data) {
    if (data) {
      this.lotCreateForm.get('chaakiCenterName').patchValue(data['name'] ? data['name'] : '');
      this.lotCreateForm.get('chaakiCenterPhone').patchValue(data['phone'] ? data['phone'] : '');
      this.lotCreateForm.get('chaakiRegion').patchValue((data['address'] && data['address']['region']) ? data['address']['region'] : '');
      this.lotCreateForm.get('chaakiCity').patchValue((data['address'] && data['address']['city']) ? data['address']['city'] : '');
      this.lotCreateForm.get('chaakiRegion').clearValidators();
      this.lotCreateForm.get('chaakiCity').clearValidators();
      this.lotCreateForm.get('chaakiRegion').updateValueAndValidity();
      this.lotCreateForm.get('chaakiCity').updateValueAndValidity();

    } else {
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

  createChawki(chawkiForm) {
    const params = {
      "name": chawkiForm.name,
      "phone": chawkiForm.phone,
      "alternatePhone": "",
      "nurseryArea": "",
      "equipments": [],
      "refferedBy": "",
      "kycPANNumber": "",
      "kycAdhaarNumber": "",
      "govRegistrationId": "",
      "crcCapacity": "",
      "batchesPerMonth": "",
      "averageSizeOfBatch": "",
      "noOfLabour": "",
      "disinfectionMgmt": "",
      "nameOfEggGrainage": "",
      "sourceOfEggs": "Private",
      "cropFailureHistory": "",
      "rmDiscount": "",
      "nearestRmCenterId": chawkiForm.nearestRmCenterId,
      "nearestRmCenterName": chawkiForm.nearestRmCenterName,
      "chawkiTypes": [
        { "type": "GOLD", "price": null },
        { "type": "WHITE", "price": null }
      ],
      "name_hi": "",
      "name_kn": "",
      "name_mr": "",
      "name_te": "",
      "name_ta": "",
      "address": {
        "address": chawkiForm.address,
        "city": chawkiForm.city,
        // "taluk": chawkiForm.taluk,
        "village": chawkiForm.village,
        "district": chawkiForm.district,
        "state": chawkiForm.state,
        "pincode": chawkiForm.pincode,
        "region": chawkiForm.region,
        "latitude": "",
        "longitude": ""
      },
      "bankDetails": {
        "beneficiaryName": "",
        "bankName": "",
        "accountNumber": "",
        "ifscCode": ""
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


  patchLocaldata(data) {
    this.selectedFarmer = data?.farmer?.id;
    this.enterFarmerDetails(this.selectedFarmer, false, false);
    this.lotCreateForm.patchValue(data.data);

    if (this.lotCreateForm.get('couponAmt').value > 0) {
      this.couponValid = true;
      this.couponMsg = this.lotCreateForm.get('couponAmt').value + ' Added Suceessfully. '
    }
    this.farmerRes = { ...data.farmer };
    this.farmerList = [];
    this.farmerList.push(data?.farmer);
  }

  clearLocalData() {
    this.globalService.globalFarmLotData = false;
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
        frontImageUrl: new UntypedFormControl(''),
        frontImageTag: new UntypedFormControl(''),
        backImageUrl: new UntypedFormControl(''),
        backImageTag: new UntypedFormControl(''),
        id: new UntypedFormControl('')
      }),
      cbsProofForm: new UntypedFormGroup({
        kycDocument: new UntypedFormControl(''),
        verified: new UntypedFormControl(''),
        kycNumber: new UntypedFormControl(''),
        frontImageUrl: new UntypedFormControl(''),
        frontImageTag: new UntypedFormControl(''),
        backImageUrl: new UntypedFormControl(''),
        backImageTag: new UntypedFormControl(''),
        id: new UntypedFormControl('')
      }),

    });
    (this.farmerCreateForm.controls['bankDetails'] as UntypedFormArray).push(new UntypedFormGroup({
      beneficiaryName: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace, Validators.pattern("^[A-Za-z ]+$")]),
      bankName: new UntypedFormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace, Validators.pattern("^[A-Za-z ]+$")]),
      accountNumber: new UntypedFormControl('', [Validators.pattern(ACCOUNTNUMBER), CustomValidator.cannotContainOnlySpace, Validators.required]),
      ifscCode: new UntypedFormControl('', [Validators.pattern(IFSCCODE), CustomValidator.cannotContainOnlySpace, Validators.required]),
    }));
  }



  async createLotForm() {
    this.lotCreateForm = this.form.group({
      farmerId: new UntypedFormControl(''),
      type: new UntypedFormControl('TUSSAR', Validators.required),
      code: new UntypedFormControl(''),
      rmGrade: new UntypedFormControl(''),
      // grade: new FormControl(''),
      lotWeight: new UntypedFormControl(0, [Validators.required, Validators.min(0)]),
      pricePerKg: new UntypedFormControl('', [Validators.required, Validators.min(1)]),
      totalPrice: new UntypedFormControl('', Validators.required),
      // beneficiaryName: new FormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace, Validators.pattern("^[A-Za-z ]+$")]),
      // bankName: new FormControl('', [Validators.required, CustomValidator.cannotContainOnlySpace, Validators.pattern("^[A-Za-z ]+$")]),
      // accountNumber: new FormControl('', [Validators.pattern(ACCOUNTNUMBER), Validators.required, CustomValidator.cannotContainOnlySpace,]),
      // ifscCode: new FormControl('', [Validators.pattern(IFSCCODE), CustomValidator.cannotContainOnlySpace, Validators.required]),
      // centerId: new FormControl('', [Validators.required]),
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
      // taluk: new FormControl(''),
      state: new UntypedFormControl(''),
      region: new UntypedFormControl(''),

      chaakiRegion: new UntypedFormControl(''),
      chaakiCity: new UntypedFormControl(''),
      chaakiCenterName: new UntypedFormControl('', [Validators.required]),
      chaakiCenterPhone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),

      centerCocoonLogisticCostPerKg: new UntypedFormControl(0, [Validators.min(0)]),
      centerCocoonWeightLoss: new UntypedFormControl(0, [Validators.min(0)]),
      receivedWeight: new UntypedFormControl(0, [Validators.required, Validators.min(1)]),
      receivedWeightPricePerKg: new UntypedFormControl(0, [Validators.required, Validators.min(1)]),
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
      backupCenterCocoonWeightLoss: new UntypedFormControl(0, [Validators.min(0)]),
      representive: new UntypedFormControl('', Validators.required),
    });
    if (!this.lotId) {
      this.lotCreateForm.patchValue({
        chaakiDate: moment(this.chaakiDate, "MM/DD/YYYY"),
      });
    }
  }

  async getCoonLotDetail(lotId) {
    this.ngxLoader.stop();
    this.api.getCocoonLotById(lotId).then((response: any) => {
      if (response) {
        if (response['uom'] == 'PCS') {
          this.uom = 'PCS';
          this.cdr.detectChanges();
        }
        if (response['paymentStatus'] !== 'Paid') {
          this.api.getCocoonLotByIdProjection(lotId).then(lotDetails => {
            this.selectedFarmer = lotDetails['farmerId'];
            this.getCouponCodeForAFarmer()
            if (lotDetails['discountValue'] && lotDetails['discountValue'] > 0) {
              this.lotCreateForm.get('couponAmt').patchValue(lotDetails['discountValue']);
              this.couponMsg = lotDetails['discountValue'] + ' Added Suceessfully. '
              this.couponValid = true;
            }
          })
          if (response['cocoonRendittaId']) {
            this.api.getRendittaGradingById(response['cocoonRendittaId']).then(gradingData => {
              this.previewImage = gradingData['imageUrl'];
              this.lotCreateForm.get('systemPredictedGrade').patchValue(gradingData['rmGrade']);
            })
          }
          this.lotDetails = response;
          this.lotCreateForm.patchValue(response);
          this.onCocoonTypeChange();
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
          this.lotCreateForm.get('representative').patchValue(representiveObj);
          this.lotCreateForm.get('centerId').patchValue(response['centerId']);
          this.lotCreateForm.get('farmer').setValue(response['_embedded']['farmer']['farmer']['id']);
          let farmerDetails = this.enterFarmerDetails(response['_embedded']['farmer']['farmer']['id'], false, false);
          if (response['_embedded']['farmer']['farmer']['bankDetails'][0] != null) {
            this.lotCreateForm.get('bank').patchValue(response['_embedded']['farmer']['farmer']['bankDetails'][0]);
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
      this.farmerRes = res['farmer'];
      this.farmeCSBkycVerification = res['farmer']?.eligibleForTransactions;
      this.farmerList.push(res['farmer']);
      this.iskycVerified = res['farmer']?.kycVerified;
      //this.lotCreateForm.get('kycAdhaarNumber').patchValue(res['farmer']['kycAdhaarNumber']);
      //this.lotCreateForm.get('kycPANNumber').patchValue(res['farmer']['kycPANNumber']);

      this.lotCreateForm.get('address').patchValue(res['farmer']['address']['address']);
      this.lotCreateForm.get('village').patchValue(res['farmer']['address']['village']);
      this.lotCreateForm.get('city').patchValue(res['farmer']['address']['city']);
      this.lotCreateForm.get('district').patchValue(res['farmer']['address']['district']);
      // this.lotCreateForm.get('taluk').patchValue(res['farmer']['address']['taluk']);
      this.lotCreateForm.get('region').patchValue(res['farmer']['address']['region']);
      this.lotCreateForm.get('state').patchValue(res['farmer']['address']['state']);
      this.lotCreateForm.get('pincode').patchValue(res['farmer']['address']['pincode']);

      // if(!this.globalService.globalFarmLotData){
      //   this.lotCreateForm.get('chaakiCenterName').patchValue(res['farmer']['chaakiCenterName'] ? res['farmer']['chaakiCenterName'] : '');
      //   this.lotCreateForm.get('chaakiCenterPhone').patchValue(res['farmer']['chaakiCenterPhone'] ? res['farmer']['chaakiCenterPhone'] : '');
      //   this.lotCreateForm.get('chaakiRegion').patchValue(res['farmer']['chaakiRegion'] ? res['farmer']['chaakiRegion'] : '');
      //   this.lotCreateForm.get('chaakiCity').patchValue(res['farmer']['chaakiCity'] ? res['farmer']['chaakiCity'] : '');
      // } removed as we are selecting chawki from dropdown.

      this.clearLocalData();


      if (patchBankDetails) {
        if (res['farmer']['bankDetails'][0] != null) {
          this.lotCreateForm.get('accountNumber').patchValue(res['farmer']['bankDetails'][0]['accountNumber'])
          this.lotCreateForm.get('beneficiaryName').patchValue(res['farmer']['bankDetails'][0]['beneficiaryName'])
          this.lotCreateForm.get('ifscCode').patchValue(res['farmer']['bankDetails'][0]['ifscCode'])
          this.lotCreateForm.get('bankName').patchValue(res['farmer']['bankDetails'][0]['bankName'])
        }
      }
    
      this.cdr.detectChanges();
      return res;
    })
  }
  farmerDetails;
  getFarmersList(event) {
    if (event.term.length % 2 == 0) {
      let searchParams = `((name==*${event.term.replace(/ /gi, "*")}* or phone==*${event.term.replace(/ /gi, "*")}*) and productType=='Tussar')`;
      this.api.searchAllFarmers(0, 50, 'createdDate', 'desc', searchParams).then(res => {
        this.farmerDetails = res['content'][0]
        console.log('formerDetails',res['content'][0]);
        
        this.farmerList = res['content'].filter(data => !(data?.phone.includes('__DELETED')));
        console.log('farmerList',this.farmerList);
        
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
    this.api.getTussarProcCenters().then(details => {
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }

  // async getCentersByLoginId() {
  //   let id = JSON.parse(localStorage._ud)?.internalid;
    // console.log(id);
    //this.ngxLoader.stop();
  //   this.api.getCenterByUserId(id).then(details => {
  //     if (details) {
  //       this.centerListByUser = details;
  //       console.log('centerListByUser', this.centerListByUser);

  //     }
  //     this._cd.detectChanges();

  //   }, err => {
  //     console.log(err);
  //   });
  // }

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
    if (this.tussarlotform.get('couponAmt').value == 0) {
      this.tussarlotform.get('couponCode').patchValue(coupon);
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

  async onFarmerSelection(farmerBankVerification, farmerKhata) {
    console.log('slectedd farmers', this.selectedFarmer);

    this.farmerHasIotDevice = false;
    this.farmerLotCount = 0;
    this.farmerLotKhata = [];
    this.cancelCouponRedeem();
    if (this.selectedFarmer) {
      let code = 'RMFARM' + this.selectedFarmer;
      this.api.getFarmerById(this.selectedFarmer).then(res => {

        this.verified = res['farmer']['bankDetails'][0] ? res['farmer']['bankDetails'][0].verified: false;
        console.log(this.verified );
        
        this.addressForm.addressForm.patchValue(res['farmer']['address'])
        this.bankForm.bankForm.patchValue(res['farmer']['bankDetails'][0])
        this.farmerRes = res['farmer'];
        this.farmercustomerTypeName = this.farmerRes?.customerTypeName;
        this.farmeCSBkycVerification = this.farmerRes?.eligibleForTransactions;
        this.isbankverified = this.farmerRes?.bankDetails[0]?.verified;
        if ( this.isbankverified == false) {
          this.modalRef = this.modalService.open(farmerBankVerification)
          this.modalRef?.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed`;
          });
        } else {
          this.api.getAssociatedDeviceByFarmId(code).then((deviceList: any) => {
            if (deviceList && deviceList.length) {
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

  proceedToKyc() {
    this.modalRef.close();
    console.log(this.verified);
    if (this.verified == false) {
      this.router.navigate(['/resha-farms/tussar/tussar-farmer-crud/'+this.selectedFarmer],{queryParams:{redirecto:'tussar-lot-crud'}})
    } else {
      if (this.farmercustomerTypeName) {

        this.router.navigate(['/resha-farms/farmers-kyc/' + this.selectedFarmer + '/farmer/' + this.farmercustomerTypeName], { queryParams: { redirecto: 'cocoon-lot-crud' } });
      } else {
        this.snackBar.open('Please update customer type for this farmer.', 'OK', {
          duration: 5000
        })
        this.selectedFarmer = '';
        this.lotCreateForm.reset();
      }
    }
    // this.router.navigate(['/kyc-form/'+this.selectedFarmer+'/farmer/Company']);

    
  }






  goTolotDetails(item) {
    this.modalRef.close();
    this.router.navigate(['/resha-farms/cocoon-lot/details', item.id]);
  }


  onCocoonTypeChange() {
    if(this.lotCreateForm.get('type').value && (this.lotCreateForm.get('type').value == 'TUSSAR')){
      this.uom = 'PCS';
      this.lotCreateForm.get('chaakiCenterName').clearValidators();
      this.lotCreateForm.get('chaakiCenterPhone').clearValidators();
      this.lotCreateForm.get('chaakiRegion').clearValidators();
      this.lotCreateForm.get('chaakiCity').clearValidators();
      this.lotCreateForm.get('centerPerBagWeightDeduction').clearValidators();
      this.lotCreateForm.get('chaakiCenterName').updateValueAndValidity();
      this.lotCreateForm.get('chaakiCenterPhone').updateValueAndValidity();
      this.lotCreateForm.get('chaakiRegion').updateValueAndValidity();
      this.lotCreateForm.get('chaakiCity').updateValueAndValidity();
      this.lotCreateForm.get('centerPerBagWeightDeduction').updateValueAndValidity();
    } else {
      this.uom = 'KGS'
      this.enterFarmerDetails(this.selectedFarmer, true, false);
      this.lotCreateForm.get('chaakiCenterName').addValidators(Validators.required);
      this.lotCreateForm.get('chaakiCenterPhone').addValidators([Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]);
      this.lotCreateForm.get('chaakiRegion').addValidators(Validators.required);
      this.lotCreateForm.get('chaakiCity').addValidators(Validators.required);
    }
    
    if (this.lotCreateForm.get('type').value && (this.lotCreateForm.get('type').value == 'BIVOLTINE')) {
      this.lotCreateForm.get('systemPredictedGrade').addValidators(Validators.required);
      this.removeAddStar = true;
    } else {
      this.lotCreateForm.get('systemPredictedGrade').clearValidators();
      this.lotCreateForm.get('systemPredictedGrade').updateValueAndValidity();
      this.removeAddStar = false;
    }
    this.validatePrice();
    this.mapCenterData();
    this.cdr.detectChanges();
  }

  mapCenterData() {
    let centerId = this.lotCreateForm.get('centerId').value;
    if (centerId && this.uom === 'KGS') {
      console.log('kkk');

      for (let i = 0; i < this.centerList.length; i++) {
        if (this.centerList[i].id == centerId) {
          this.minimumCentreBagWeight = this.centerList[i].cocoonLotBagDeduction ? this.centerList[i].cocoonLotBagDeduction : 0
          this.lotCreateForm.get('centerCocoonWeightLoss').patchValue(this.centerList[i].cocoonLotWeightLoss ? this.centerList[i].cocoonLotWeightLoss : 0);
          this.lotCreateForm.get('backupCenterCocoonWeightLoss').patchValue(this.centerList[i].cocoonLotWeightLoss ? this.centerList[i].cocoonLotWeightLoss : 0);
          this.lotCreateForm.get('centerCocoonLogisticCostPerKg').patchValue(this.centerList[i].cocoonLotLogisticsCostPerKg ? this.centerList[i].cocoonLotLogisticsCostPerKg : 0);
          this.lotCreateForm.get('centerPerBagWeightDeduction').patchValue(this.centerList[i].cocoonLotBagDeduction ? this.centerList[i].cocoonLotBagDeduction : 0);
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

  atFarmerLocation(value) {
    if (!value) {
      this.mapCenterData();
      if (this.lotCreateForm.get('type').value && (this.lotCreateForm.get('type').value == 'BIVOLTINE')) {
        this.lotCreateForm.get('systemPredictedGrade').addValidators(Validators.required);
        this.removeAddStar = true;
      }
    } else {
      if (this.lotCreateForm.get('type').value && (this.lotCreateForm.get('type').value == 'BIVOLTINE')) {
        this.lotCreateForm.get('systemPredictedGrade').clearValidators();
        this.lotCreateForm.get('systemPredictedGrade').updateValueAndValidity();
        this.removeAddStar = false;
      }
    }
  }
  // isControlInvalidForLot(controlName: string): boolean {
  //   const control = this.lotCreateForm.controls[controlName];
  //   return control.invalid && (control.dirty || control.touched);
  // }
  // uom = 'KGS';
  onValueChanges() {
    // this.cancelCouponRedeem();
    this.lotCreateForm.get('centerCocoonWeightLoss').patchValue(this.lotCreateForm.get('backupCenterCocoonWeightLoss').value)
    let centerWeightLossTotal = this.lotCreateForm.get('centerCocoonWeightLoss').value > 0 ? this.lotCreateForm.get('receivedWeight').value > 0 ?
      (this.lotCreateForm.get('centerCocoonWeightLoss').value * this.lotCreateForm.get('receivedWeight').value / 100) : 0 : 0

    centerWeightLossTotal = Math.round((centerWeightLossTotal + Number.EPSILON) * 100) / 100;

    if (this.lotCreateForm.get('rmGrade').value && (this.lotCreateForm.get('rmGrade').value == 'JHILLI' || this.lotCreateForm.get('rmGrade').value == 'DOUBLECOCOON')) {
      centerWeightLossTotal = 0;
      this.lotCreateForm.get('centerCocoonWeightLoss').patchValue(0);
    }

    this.lotCreateForm.get('centerTotalCocoonWeightLoss').patchValue(centerWeightLossTotal);


    let totalBagsWeight = this.lotCreateForm.get('centerPerBagWeightDeduction').value > 0 ? this.lotCreateForm.get('noOfBags').value > 0 ?
      (this.lotCreateForm.get('centerPerBagWeightDeduction').value * this.lotCreateForm.get('noOfBags').value) / 1000 : 0 : 0;

    this.lotCreateForm.get('centerTotalBagWeightDeduction').patchValue(totalBagsWeight);

    let totalWeightLoss = centerWeightLossTotal + totalBagsWeight;

    let actualWeight = this.lotCreateForm.get('receivedWeight').value > 0 ?
      this.lotCreateForm.get('receivedWeight').value - totalWeightLoss : this.lotCreateForm.get('receivedWeight').value;

    actualWeight = Math.round((actualWeight + Number.EPSILON) * 100) / 100;

    this.lotCreateForm.get('lotWeight').patchValue(actualWeight);

    let actualPricePerKg = this.lotCreateForm.get('centerCocoonLogisticCostPerKg').value > 0 ?
      this.lotCreateForm.get('receivedWeightPricePerKg').value - this.lotCreateForm.get('centerCocoonLogisticCostPerKg').value : this.lotCreateForm.get('receivedWeightPricePerKg').value;
    actualPricePerKg = Math.round((actualPricePerKg + Number.EPSILON) * 100) / 100;

    this.lotCreateForm.get('pricePerKg').patchValue(actualPricePerKg);

    let centerTotalLogisticsCost = this.lotCreateForm.get('centerCocoonLogisticCostPerKg').value > 0 ? this.lotCreateForm.get('centerCocoonLogisticCostPerKg').value * this.lotCreateForm.get('lotWeight').value : 0;

    centerTotalLogisticsCost = Math.round((centerTotalLogisticsCost + Number.EPSILON) * 100) / 100;

    this.lotCreateForm.get('centerTotalLogisticsCost').patchValue(centerTotalLogisticsCost);
     
    let total = this.lotCreateForm.get('lotWeight').value * this.lotCreateForm.get('pricePerKg').value;

    total = Math.round((total + Number.EPSILON) * 100) / 100;

    total = total + this.lotCreateForm.get('couponAmt').value;

    let actualGrossAmount = this.lotCreateForm.get('lotWeight').value * this.lotCreateForm.get('receivedWeightPricePerKg').value;

    actualGrossAmount = Math.round((actualGrossAmount + Number.EPSILON) * 100) / 100;

    this.lotCreateForm.get('actualGrossAmount').patchValue(actualGrossAmount);

    this.lotCreateForm.get('totalPrice').patchValue(total.toFixed(2));
    this.cdr.detectChanges();
    this.validatePrice();
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


  redeemCode(formValue) {
    if (this.edit) {
      this.selectedFarmer = this.tussarlotform.get('farmer').value;
    }
    this.ngxLoader.stop();
    this.api.verifyCoupon(formValue.couponCode.toUpperCase(), this.selectedFarmer, this.tussarlotform.get('totalPrice').value, 'COCOON_PURCHASE').then((res: any) => {
      if (res.status) {
        this.couponValid = true;
        this.tussarlotform.get('couponAmt').patchValue(res.value);
        this.couponMsg = this.tussarlotform.get('couponAmt').value + ' Added Suceessfully. '
        let total = this.tussarlotform.get('totalPrice').value;
        total = Math.round((+total + Number.EPSILON) * 100) / 100;
        total = total + this.tussarlotform.get('couponAmt').value;
        this.tussarlotform.get('netPayableAmount').patchValue(total)
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
    if (this.tussarlotform.get('couponAmt').value > 0) {
      this.ngxLoader.stop();
      this.api.deleteCoupon(this.tussarlotform.get('couponCode').value, this.selectedFarmer).then(res => {
        this.snackBar.open('Please apply the coupon again', 'Ok', {
          duration: 3000
        });
      })
    }
    this.couponMsg = '';
    this.tussarlotform.get('couponCode').patchValue('');
    let total = this.tussarlotform.get('totalPrice').value - this.tussarlotform.get('couponAmt').value;
    this.tussarlotform.get('totalPrice').patchValue(total.toFixed(2));
    this.tussarlotform.get('couponAmt').patchValue(0);
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

  initiateOtp(farmerForm) {
    console.log(farmerForm);
    let reqObj = {
      "phone": farmerForm.phone,
      "profile": "FARMER"
    }
    this.api.apiTemporaryOboardFarmer(reqObj).then(res => {
      this.api.apiGenerateFarmerOTP(farmerForm.phone).then(res => {
        console.log(res);
        this.isOTPSent = true;
        this._cd.detectChanges();
      })
    })
  }

  resendOtp(farmerForm) {
    console.log(farmerForm);
    this.api.apiResendFarmerOTP(farmerForm.phone).then(res => {
      console.log(res);
      this.isOTPSent = true;
    })
  }

  validateOTP(farmerForm) {
    let reqobj = {
      "phone": farmerForm.phone,
      "otp": farmerForm.mobileOTP
    }

    this.api.apiValidateFarmerOTP(reqobj).then(res => {
      console.log(res);
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
      // address: {
      //   address: '',
      //   city: '',
      //   // taluk: '',
      //   village: '',
      //   district: '',
      //   state: '',
      //   pincode: '',
      //   region: ''
      // },
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
        this.onFarmerSelection('', '')
        this.updateKYCDetails();
        //  this.farmerCreateForm.reset();
        this.snackBar.open('Created farmer successfully', 'Ok', {
          duration: 3000
        });
      }
    }, err => {
      console.log(err);
      if (err.status == '409') {
        this.isOTPSent = false;
      }
    });

  }
  addFarmerName(farmerName) {
    console.log(farmerName);
    const params = {
      name: farmerName.name
    }
    this.ngxLoader.stop();
    this.api.updateFarmers(params, this.selectedFarmer).then(res => {
      this.modalRef.close();
      if (res) {
        this.farmerList = [];
        this.selectedFarmer = res['id']['farmerName'];
        this.farmerList.push(res);
        this.onFarmerSelection('', '')
        this.addFarmerNameForm.reset();
        this.snackBar.open('Updated successfully', 'Ok', {
          duration: 3000
        });
      }
    })
  }

  onCocoonImageUpload(image) {
    this.ngxLoader.stop();
    this.imageUploading = true;
    this.imageFile = image;
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
        this.getS3CatUrl(file.type, file)
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file);
    }
    image.target.value = '';
  }

  /**@Get s3 url to upload file */
  async getS3CatUrl(fileType, file) {
    try {
      this._cd.detectChanges()
      await this.api.rendittagradingS3Url(fileType.split('/')[1]).then((res: S3UrlResponse) => {
        this.calluploadImageToS3API(res.targetUrl, file, res.fileName);
      })
    } catch (err) {
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
  async calluploadImageToS3API(s3url: String, file, fileNameFromS3: any) {
    try {
      this._cd.detectChanges()
      this.api.updateImageToS3Directly(s3url, file).then(res => {
        this.lotCreateForm.get('cocoonRendittaImage').patchValue(fileNameFromS3);
        this.previewImage = fileNameFromS3;
        this.imageUploaded = true;
        this.imageUploading = false;
        // get system generated grade
        if (this.edit && this.lotCreateForm.get('cocoonRendittaId').value) {
          this.api.deleteRendittaGradingById(this.lotCreateForm.get('cocoonRendittaId').value).then(res => {
            let params = {
              cocoonRendittaId: null
            }
            this.api.putCocoonLot(this.lotId, params).then(lotUpdated => {

            })
            let reqObj = {
              url: fileNameFromS3
            }
            this.api.getRendittaGrading(reqObj).then((res: any) => {
              if (res.responseCode == 200) {
                this.lotCreateForm.get('systemPredictedGrade').patchValue(res.data.predictedGrade);
                this.lotCreateForm.get('cocoonRendittaId').patchValue(res.data.rendittaGradeId);
                let params = {
                  cocoonRendittaId: res.data.rendittaGradeId
                }
                this.api.putCocoonLot(this.lotId, params).then(lotUpdated => {

                })
                this.cdr.detectChanges();
                this.ngxLoader.stop();
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
          let reqObj = {
            url: fileNameFromS3
          }
          this.api.getRendittaGrading(reqObj).then((res: any) => {
            if (res.responseCode == 200) {
              this.lotCreateForm.get('systemPredictedGrade').patchValue(res.data.predictedGrade);
              this.lotCreateForm.get('cocoonRendittaId').patchValue(res.data.rendittaGradeId);
              this.cdr.detectChanges();
              this.ngxLoader.stop();
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
    } catch (err) {
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

  remove() {
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

  getKycDocuments(id) {
    this.api.getAllDocumentsListByCustomerTypes(id, 'FARMER').then(res => {
      console.log(res);
      this.documentsList = res;
      this._cd.detectChanges();
    })
  }


  onchangeCustomerType() {
    this.getKycDocuments(this.farmerCreateForm.get('customerType').value);
  }

  updateKYCDetails() {
    let idProofPayload = {
      "verified": true,
      "kycDocument": "/kycdocument/" + this.farmerCreateForm.get('idProofForm.kycDocument').value,
      "kycNumber": this.farmerCreateForm.get('idProofForm.kycNumber').value,
      "items": [
        {
          "url": this.farmerCreateForm.get('idProofForm.frontImageUrl').value,
          "tag": this.farmerCreateForm.get('idProofForm.frontImageTag').value
        },
        {
          "url": this.farmerCreateForm.get('idProofForm.backImageUrl').value,
          "tag": this.farmerCreateForm.get('idProofForm.backImageTag').value
        }
      ],
      "verificationType": "MANUAL",
      "farmer": "/farmer/" + this.selectedFarmer
    }

    let cbsProofPayload = {
      "verified": true,
      "kycDocument": "/kycdocument/" + this.farmerCreateForm.get('cbsProofForm.kycDocument').value,
      "kycNumber": this.farmerCreateForm.get('cbsProofForm.kycNumber').value,
      "items": [
        {
          "url": this.farmerCreateForm.get('cbsProofForm.frontImageUrl').value,
          "tag": this.farmerCreateForm.get('cbsProofForm.frontImageTag').value
        },
        {
          "url": this.farmerCreateForm.get('cbsProofForm.backImageUrl').value,
          "tag": this.farmerCreateForm.get('cbsProofForm.backImageTag').value
        }
      ],
      "verificationType": "MANUAL",
      "farmer": "/farmer/" + this.selectedFarmer
    }
    if (this.farmerCreateForm.get('idProofForm.id').value) {
      this.api.updateFarmerKYC(idProofPayload, this.farmerCreateForm.get('idProofForm.id').value, 'farmer').then(res => {
        console.log(res);
      })
    } else {
      this.api.createFarmerKYC(idProofPayload, 'FARMER').then(res => {
        console.log(res);
      })
    }

    if (this.farmerCreateForm.get('cbsProofForm.id').value) {
      this.api.updateFarmerKYC(cbsProofPayload, this.farmerCreateForm.get('cbsProofForm.id').value, 'farmer').then(res => {
        console.log(res);
      })
    } else {
      this.api.createFarmerKYC(cbsProofPayload, 'FARMER').then(res => {
        console.log(res);
      })
    }
    // this.router.navigate(['/farmers-silk']);
    this.snackBar.open('Updated Farmer successfully', 'Ok', {
      duration: 3000
    });
  }

  redirectToFarmerCrud() {
    this.router.navigate(['/resha-farms/tussar/tussar-farmer-crud'], { queryParams: { redirecto: 'cocoon-lot-crud' } });
  }



  // tussar functionality

  filldata(){
    this.amount=this.tussarlotform.get('ratePerPiece').value * this.tussarlotform.get('receivedUnits').value;
    this.tussarlotform.get('totalPrice').patchValue(this.amount)
    this.tussarlotform.get('grossTotalAmount').patchValue(this.amount)
    let total = this.amount + this.tussarlotform.get('couponAmt').value;    
    this.tussarlotform.get('netPayableAmount').patchValue(total.toFixed(2))
    this.cdr.detectChanges();
  }
  save(tussarlot) {
    console.log(tussarlot);
    const params = {
    grade:tussarlot.grade,
    rmGrade:tussarlot.rmGrade,
    nextCropDate:tussarlot.nextCropDate,
    couponCode: tussarlot.couponCode,
    couponAmount: tussarlot.couponAmt,
    tussarRendittaId:tussarlot.tussarRendittaId,
    "totalPrice": tussarlot.netPayableAmount,
    "receivedQuantity": tussarlot.receivedUnits,
    "availableQuantity": tussarlot.receivedUnits,
    "receivedPricePerPc": tussarlot.ratePerPiece,
    "actualGrossAmount": tussarlot.grossTotalAmount,
    "farmer": {
      "id": this.selectedFarmer
    },
    "center": {
      "id" :tussarlot.centerId
    },
    bank:this.bankForm.bankForm.value,
    address: this.addressForm.addressForm.value,
    
    // address: {
    //   village: this.addressForm.addressForm.value.village,
    //   city: this.addressForm.addressForm.value.city,
    //   district: this.addressForm.addressForm.value.district,
    //   taluk: this.addressForm.addressForm.value.taluk,
    //   region: this.addressForm.addressForm.value.region,
    //   state: this.addressForm.addressForm.value.state,
    //   pincode: this.addressForm.addressForm.value.pincode,
    //   latitude: this.addressForm.addressForm.value.latitude,
    //   longitude: this.addressForm.addressForm.value.longitude,
    // },
    uom:'PCS',
    status: 'Available',
    };
   

    if(!this.lotId){
      params['rmRepresentativeName'] = tussarlot.representative?.name;
      params['rmRepresentativePhone'] = tussarlot.representative?.phone;
    }
    console.log(params);
    
    if(this.lotId){
      this.patchTussarlotByid(this.lotId,params);
    }else{
    this.api.postTussarlot(params).then(res=>{
      console.log('POST',res); 
      console.log('efdsfsdf',this.tussarlotform.value)
      this.router.navigate(['/resha-farms/tussar/tussar-lot-list']);
      this.snackBar.open('Created lot successfully', 'Ok', {
        duration: 3000
      });

    })
  }
    
  }

  patchTussarlotByid(id,tussarlot) {
    this.api.patchTussarlotByid(id,tussarlot).then((res:any)=>{
      console.log('sadsa',res)
      this.api.updateFarmers({address:this.addressForm.addressForm.value},res.farmer.id)
      this.router.navigate(['/resha-farms/tussar/tussar-lot-list'])
    })
  }
  

  getTussarlotByid(){
    this.api.getTussarlotByid(this.lotId).then(res=>{
      this.formerDetail = res
      console.log('formerDetail',this.formerDetail)
      this.getLotDetails = res;
      let addresss = res['farmer']['address']
      let bank= res['bank']
      this.bankForm.bankForm.patchValue(res['bank'])
      this.tussarlotform.get('centerId').patchValue(res['centerId']);
      this.selectedFarmer = res['farmer'];
      this.tussarlotform.get('farmerId').patchValue(res['farmer']['id'])
      // this.addressForm.addressForm.patchValue(res['address']);
      this.bankForm.bankForm.patchValue(res['bank'])
      this.addressForm.addressForm.get('village').patchValue(res['farmer']['address']['village'])
      this.addressForm.addressForm.get('pincode').patchValue(res['farmer']['address']['pincode'])
      this.addressForm.addressForm.get('taluk').patchValue(res['farmer']['address']['taluk'])
      this.addressForm.addressForm.get('city').patchValue(res['farmer']['address']['city'])
      this.addressForm.addressForm.get('district').patchValue(res['farmer']['address']['district'])
      this.addressForm.addressForm.get('latitude').patchValue(res['farmer']['address']['latitude'])
      this.addressForm.addressForm.get('longitude').patchValue(res['farmer']['address']['longitude'])
      this.addressForm.addressForm.get('address').patchValue(res['farmer']['address']['address'])
      this.addressForm.addressForm.get('state').patchValue(res['farmer']['address']['state'])
      this.addressForm.addressForm.get('region').patchValue(res['farmer']['address']['region'])  
      this.tussarlotform.get('receivedUnits').patchValue(res['receivedQuantity']);
      this.tussarlotform.get('ratePerPiece').patchValue(res['receivedPricePerPc']);
      this.tussarlotform.get('grossTotalAmount').patchValue(res['actualGrossAmount']);
      this.tussarlotform.get('couponCode').patchValue(res['couponCode']);
      this.tussarlotform.get('netPayableAmount').patchValue(res['totalPrice']);
      
      // this.tussarlotform.get('representative').patchValue(res['representative'].rmRepresentativePhone);
      this.tussarlotform.get('lotSoldBy').patchValue(res['lotSoldBy']);
      this.tussarlotform.get('grade').patchValue(res['grade']);
      this.tussarlotform.get('rmGrade').patchValue(res['rmGrade']);
      this.tussarlotform.get('code').patchValue(res['code']);
      this.tussarlotform.get('farmerName').patchValue(res['farmerName']);
      let representiveObj;
      if (this.formerDetail.rmRepresentativeName) {
        representiveObj = {
          name: this.formerDetail.rmRepresentativeName,
          phone: this.formerDetail.rmRepresentativePhone
        }
      } else {
        representiveObj = {
          name: '-',
          phone: this.formerDetail.createdBy
        }
      }
    })
  }
  // Lot Validations
  isControlValidForLot(controlName: string): boolean {
    const control = this.tussarlotform.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForLot(controlName: string): boolean {
    const control = this.tussarlotform.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForLot(validation, controlName): boolean {
    const control = this.tussarlotform.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedForLot(controlName): boolean {
    const control = this.tussarlotform.controls[controlName];
    return control.dirty || control.touched;
  }

  
  saveDataApiCall(tussarlot){
       this.save(tussarlot);
  }
  
  verified:any;
  onBankStatuschange(eventData){
    this.verified = eventData;
  }

  gotoTussarfarmer(){
    this.router.navigate(['/resha-farms/tussar/tussar-farmer-crud',this.selectedFarmer]);
     this.modalService.dismissAll();
  }

  
}
function obj(obj: any) {
  throw new Error('Function not implemented.');
}

function res(res: any): (reason: any) => PromiseLike<never> {
  throw new Error('Function not implemented.');
}

