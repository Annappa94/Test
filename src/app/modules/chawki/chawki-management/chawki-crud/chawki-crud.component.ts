import { Inject, LOCALE_ID, Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { ApiService } from 'src/app/services/api/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { S3UrlResponse } from 'src/app/model/types/type.model';
import { I } from '@angular/cdk/keycodes';
import { BankFormComponent } from 'src/app/modules/shared/bank-form/bank-form.component';
import { AddressPincodeFormComponent } from 'src/app/modules/shared/address-pincode-form/address-pincode-form.component';
import { CustomValidator } from 'src/app/modules/shared/custom-validator/custom.validator';

@Component({
  selector: 'app-chawki-crud',
  templateUrl: './chawki-crud.html',
  styleUrls: ['./chawki-crud.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ChawkiCRUDComponent {

  @ViewChild(BankFormComponent,{static:true} ) bankForm : BankFormComponent;
  @ViewChild(AddressPincodeFormComponent,{static:true} ) addressForm : AddressPincodeFormComponent;
  chawkiCreateForm: UntypedFormGroup;
  centerList;
  id;
  equipmentsList = [
    { val: 'CRStands', name: 'CR Stands' },
    { val: 'RearingTrays', name: 'Rearing Trays' },
    { val: 'Sprayer', name: 'Sprayer' },
    { val: 'Humidifier', name: 'Humidifier' },
    { val: 'LeafChoppingDevice', name: 'Leaf Chopping Device' },
    { val: 'RoomHeater', name: 'Room Heater' },
    { val: 'IncubationFrame', name: 'Incubation Frame' },
    { val: 'BrushingNets', name: 'Brushing Nets' },
    { val: 'BedCleaningNets', name: 'Bed Cleaning Nets' },
    { val: 'Microscope', name: 'Microscope' },
    { val: 'FeedingStands', name: 'Feeding Stands' },
    { val: 'IronStandWithBasin', name: 'Iron Stand with Basin' },
    { val: 'DisinectionMask', name: 'Disinection Mask' },
    { val: 'WetAndDryBulbThermometer', name: 'Wet and Dry bulb thermometer' },
    { val: 'FlameGunWithCylinder', name: 'Flame gun with cylinder' },
    { val: 'LeafChoppingDevice', name: 'Leaf Chopping Device' },

  ]

  delBank;
  modalRef;
  closeResult;
  deleteBankIndex;
  chawkiDetails;
  latitude;
  longitude;

  regCertificateImgFile = null;
  regCertificateFilePreviewImage: any;
  regCertificateImgUploaded = false;

  trainingCertificateImgUploaded = false;
  trainingCertificateImgFile = null;
  trainingCertificateFilePreviewImage: any;

  nurseryAreaPhotoPreviewImage: string | ArrayBuffer;
  nurseryAreaPhotoImgUploaded = false;
  nurseryAreaPhotoImgFile = null;

  crcImageUploaded = false;
  imageFile = [];
  crcPreviewImage: any = [];
  crcImageUrls: any = [];

  chawkiImageFile = [];
  chawkiImagePreviewImage: any = [];
  chawkiImageUploaded = false;

  deleteImageIndex = -1;

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
    }
  ]

  chawkiTypes = [{
		type: "GOLD",
		price: null,
    crcPrice:null,
    sellingPrice:null,
    crcDiscount:null,
    actualBuyingPrice:null
	},
  {
		type: "WHITE",
		price: null,
    crcPrice:null,
    sellingPrice:null,
    crcDiscount:null,
    actualBuyingPrice:null
	}];
  saveNotClicked = true;
  expandImage=false;
  modelImageUrl=null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private form: UntypedFormBuilder,
    private api: ApiService,
    private snackBar: MatSnackBar,
    private _cd: ChangeDetectorRef,
    private modalService: NgbModal,
    @Inject(LOCALE_ID) private locale: string,
    private ngxLoader : NgxUiLoaderService

  ) {
    this.getCenters();
    // Check if update
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
      }
    });
    this.chawkiCreateForm = this.form.group({
      name: new UntypedFormControl('', [Validators.required,CustomValidator.cannotContainOnlySpace]),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
      alternatePhone: new UntypedFormControl(''),
      nurseryArea: new UntypedFormControl(''),
      priceForWhite: new UntypedFormControl(''),
      priceForGold: new UntypedFormControl(''),
      equipments: new UntypedFormControl(''),
      refferedBy: new UntypedFormControl(''),
      kycPANNumber: new UntypedFormControl(''),
      kycAdhaarNumber: new UntypedFormControl(''),
      govRegistrationId: new UntypedFormControl(''),
      crcCapacity: new UntypedFormControl(''),
      batchesPerMonth: new UntypedFormControl(''),
      averageSizeOfBatch: new UntypedFormControl(''),
      noOfLabour: new UntypedFormControl(''),
      disinfectionMgmt: new UntypedFormControl(''),
      nameOfEggGrainage: new UntypedFormControl(''),
      sourceOfEggs: new UntypedFormControl('Private'),
      cropFailureHistory: new UntypedFormControl(''),
      rmDiscount: new UntypedFormControl(''),

      beneficiaryName: new UntypedFormControl(''),
      bankName: new UntypedFormControl(''),
      accountNumber: new UntypedFormControl(''),
      latitude: new UntypedFormControl(''),
      longitude: new UntypedFormControl(''),
      name_hi: new UntypedFormControl('', [Validators.required,CustomValidator.cannotContainOnlySpace]),
      name_kn: new UntypedFormControl('', [Validators.required,CustomValidator.cannotContainOnlySpace]),
      name_te: new UntypedFormControl('', [Validators.required,CustomValidator.cannotContainOnlySpace]),
      name_ta: new UntypedFormControl('', [Validators.required,CustomValidator.cannotContainOnlySpace]),
      name_mr: new UntypedFormControl('', [Validators.required,CustomValidator.cannotContainOnlySpace]),
      
      nearestRmCenterId: new UntypedFormControl('', [Validators.required]),
      nearestRmCenterName: new UntypedFormControl(''),
      chawkiType: new UntypedFormControl(''),
      crcPrice:new UntypedFormControl(''),
      sellingPrice:new UntypedFormControl(''),
      crcDiscount:new UntypedFormControl(''),
      actualBuyingPrice:new UntypedFormControl(''),
    });


    if (this.id) {
      this.ngxLoader.stop();
      this.api.getChawkiById(this.id).then(response => {
        if (response) {
          this.chawkiCreateForm.patchValue(response);
          this.chawkiDetails = response;
          this.regCertificateFilePreviewImage = this.chawkiDetails['regCertificateUrl'];
          this.trainingCertificateFilePreviewImage = this.chawkiDetails['trainingCertificateUrl'];
          this.nurseryAreaPhotoPreviewImage = this.chawkiDetails['nurseryAreaPhotoUrl'];
          this.chawkiImagePreviewImage = this.chawkiDetails['chawkiImageUrls'];
          this.crcImageUrls = [this.chawkiDetails['chawkiInfrastructureImageUrls']];
          this.crcPreviewImage = this.chawkiDetails['chawkiInfrastructureImageUrls'];
          this._cd.detectChanges();
          
          this.bankForm.bankForm.patchValue(response['bankDetails'])
          this.addressForm.addressForm.patchValue(response['address'])

          // if (response['address'] != null) {
          //   this.chawkiCreateForm.get('address').patchValue(response['address']['address'])
          //   this.chawkiCreateForm.get('city').patchValue(response['address']['city'])
          //   this.chawkiCreateForm.get('village').patchValue(response['address']['village'])
          //   this.chawkiCreateForm.get('district').patchValue(response['address']['district'])
          //   this.chawkiCreateForm.get('pincode').patchValue(response['address']['pincode'])
          //   this.chawkiCreateForm.get('state').patchValue(response['address']['state'])
          //   this.chawkiCreateForm.get('taluk').patchValue(response['address']['taluk'])
          //   this.chawkiCreateForm.get('region').patchValue(response['address']['region'])
          // }

          // if (response['bankDetails'] != null) {
          //   this.chawkiCreateForm.get('accountNumber').patchValue(response['bankDetails']['accountNumber'])
          //   this.chawkiCreateForm.get('beneficiaryName').patchValue(response['bankDetails']['beneficiaryName'])
          //   this.chawkiCreateForm.get('ifscCode').patchValue(response['bankDetails']['ifscCode'])
          //   this.chawkiCreateForm.get('bankName').patchValue(response['bankDetails']['bankName'])
          // }

          if (response['chawkiTypes'] && response['chawkiTypes'].length) {
           
            let priceOfWhiteIndex = this.getTypeIndex(response['chawkiTypes'],'WHITE')
            if(priceOfWhiteIndex > -1) {
              this.chawkiCreateForm.get('chawkiType').patchValue(response['chawkiTypes'][priceOfWhiteIndex]['type']),
              this.chawkiCreateForm.get('priceForWhite').patchValue(response['chawkiTypes'][priceOfWhiteIndex]['price']),
              this.chawkiCreateForm.get('crcPrice').patchValue(response['chawkiTypes'][priceOfWhiteIndex]['crcPrice']),
              this.chawkiCreateForm.get('crcDiscount').patchValue(response['chawkiTypes'][priceOfWhiteIndex]['crcDiscount']),
              this.chawkiCreateForm.get('sellingPrice').patchValue(response['chawkiTypes'][priceOfWhiteIndex]['sellingPrice']),
              this.chawkiCreateForm.get('actualBuyingPrice').patchValue(response['chawkiTypes'][priceOfWhiteIndex]['actualBuyingPrice'])


            } else {
              this.chawkiCreateForm.get('priceForWhite').patchValue('')
            }
            let priceOfGoldIndex = this.getTypeIndex(response['chawkiTypes'],'GOLD')
            if(priceOfGoldIndex > -1) {
              this.chawkiCreateForm.get('chawkiType').patchValue(response['chawkiTypes'][priceOfGoldIndex]['type']),
              this.chawkiCreateForm.get('priceForGold').patchValue(response['chawkiTypes'][priceOfGoldIndex]['price']),
              this.chawkiCreateForm.get('crcPrice').patchValue(response['chawkiTypes'][priceOfGoldIndex]['crcPrice']),
              this.chawkiCreateForm.get('crcDiscount').patchValue(response['chawkiTypes'][priceOfGoldIndex]['crcDiscount']),
              this.chawkiCreateForm.get('sellingPrice').patchValue(response['chawkiTypes'][priceOfGoldIndex]['sellingPrice']),
              this.chawkiCreateForm.get('actualBuyingPrice').patchValue(response['chawkiTypes'][priceOfGoldIndex]['actualBuyingPrice'])

            } else {
              this.chawkiCreateForm.get('priceForGold').patchValue('')
            }
            this._cd.detectChanges();

          }

        } else {
          console.log("Response for getChawkiById found to be ", response)
          this.snackBar.open('Failed to find Chawki', 'Ok', {
            duration: 3000
          });
        }
      })
    }
    this.getLocation();
  }

  onCenterSelect(event) {
    for (let i = 0; i < this.centerList.length; i++) {
      if (this.centerList[i].id == event.target.value) {
        this.chawkiCreateForm.get('nearestRmCenterName').patchValue(this.centerList[i].centerName);
        break;
      }
    }
  }

  getTypeIndex(chawkiTypes, type) {
    for(let i=0; i < chawkiTypes.length; i++) {
      if(chawkiTypes[i].type == type && chawkiTypes[i].price > 0) {
        return i;
      }
    }
    return -1 ;
  }

  goBack() {
    this.router.navigate(['/resha-farms/chawki']);
  }
  OnvalueChanges(){
    this.chawkiCreateForm.get('actualBuyingPrice').patchValue(this.chawkiCreateForm.get('crcPrice').value - this.chawkiCreateForm.get('crcDiscount').value);
    this._cd.detectChanges();
  }

  async saveChawkiDetails(chawkiForm) {
    this.getLocation()
    this.saveNotClicked = false;
    if (chawkiForm.chawkiType == 'GOLD') {
      this.chawkiTypes[0].price = chawkiForm.sellingPrice,
      this.chawkiTypes[0].crcPrice = chawkiForm.crcPrice,
      this.chawkiTypes[0].crcDiscount = chawkiForm.crcDiscount,
      this.chawkiTypes[0].sellingPrice = chawkiForm.sellingPrice,
      this.chawkiTypes[0].actualBuyingPrice = chawkiForm.actualBuyingPrice

    }
    if (chawkiForm.chawkiType == 'WHITE') {
      this.chawkiTypes[1].price = chawkiForm.sellingPrice,
      this.chawkiTypes[1].crcPrice = chawkiForm.crcPrice,
      this.chawkiTypes[1].crcDiscount = chawkiForm.crcDiscount,
      this.chawkiTypes[1].sellingPrice = chawkiForm.sellingPrice,
      this.chawkiTypes[1].actualBuyingPrice = chawkiForm.actualBuyingPrice

    }

    // if(chawkiForm.priceForGold) {
    //   this.chawkiTypes[0].price = chawkiForm.priceForGold
    // }
    // if(chawkiForm.priceForWhite) {
    //   this.chawkiTypes[1].price = chawkiForm.priceForWhite
    // }
    const params = {
      name: chawkiForm.name,
      phone: chawkiForm.phone,
      alternatePhone: chawkiForm.alternatePhone,
      nurseryArea: chawkiForm.nurseryArea,
      equipments: chawkiForm.equipments ? chawkiForm.equipments : [],
      refferedBy: chawkiForm.refferedBy,
      kycPANNumber: chawkiForm.kycPANNumber,
      kycAdhaarNumber: chawkiForm.kycAdhaarNumber,
      govRegistrationId: chawkiForm.govRegistrationId,
      crcCapacity: chawkiForm.crcCapacity,
      batchesPerMonth: chawkiForm.batchesPerMonth,
      averageSizeOfBatch: chawkiForm.averageSizeOfBatch,
      noOfLabour: chawkiForm.noOfLabour,
      disinfectionMgmt: chawkiForm.disinfectionMgmt,
      nameOfEggGrainage: chawkiForm.nameOfEggGrainage,
      sourceOfEggs: chawkiForm.sourceOfEggs,
      cropFailureHistory: chawkiForm.cropFailureHistory,
      rmDiscount: chawkiForm.rmDiscount,
      nearestRmCenterId: chawkiForm.nearestRmCenterId,
      nearestRmCenterName: chawkiForm.nearestRmCenterName,
      chawkiTypes: this.chawkiTypes,
      name_hi: chawkiForm.name_hi,
      name_kn: chawkiForm.name_kn,
      name_mr: chawkiForm.name_mr,
      name_te: chawkiForm.name_te,
      name_ta: chawkiForm.name_ta,
   
      address: {
        address: this.addressForm.addressForm.value.address,
        village: this.addressForm.addressForm.value.village,
        city: this.addressForm.addressForm.value.city,
        district: this.addressForm.addressForm.value.district,
        taluk: this.addressForm.addressForm.value.taluk,
        region: this.addressForm.addressForm.value.region,
        state: this.addressForm.addressForm.value.state,
        pincode: this.addressForm.addressForm.value.pincode,
        latitude: this.addressForm.addressForm.value.latitude,
        longitude: this.addressForm.addressForm.value.longitude,
      },
      bankDetails : {
        accountNumber: this.bankForm.bankForm.value.accountNumber,
        beneficiaryName: this.bankForm.bankForm.value.beneficiaryName,
        ifscCode: this.bankForm.bankForm.value.ifscCode,
        bankName: this.bankForm.bankForm.value.bankName,
        branchName: this.bankForm.bankForm.value.branchName,
      }
      // address: {
      //   address: chawkiForm.address,
      //   city: chawkiForm.city,
      //   taluk: chawkiForm.taluk,
      //   village: chawkiForm.village,
      //   district: chawkiForm.district,
      //   state: chawkiForm.state,
      //   pincode: chawkiForm.pincode,
      //   region: chawkiForm.region,
      //   latitude: chawkiForm.latitude,
      //   longitude: chawkiForm.longitude
      // },
      
      // bankDetails: {
      //   beneficiaryName: chawkiForm.beneficiaryName,
      //   bankName: chawkiForm.bankName,
      //   accountNumber: chawkiForm.accountNumber,
      //   ifscCode: chawkiForm.ifscCode
      // }
    };
    if (this.chawkiDetails && this.chawkiDetails['regCertificateUrl'] === '' && this.regCertificateImgUploaded === false) {
      params['regCertificateUrl'] = '';
    } 
    // else {
    //   params['regCertificateUrl'] = this.chawkiDetails['regCertificateUrl'];
    // }
    if (this.chawkiDetails && this.chawkiDetails['trainingCertificateUrl'] === '' && this.trainingCertificateImgUploaded === false) {
      params['trainingCertificateUrl'] = '';
    } 
    // else {
    //   params['trainingCertificateUrl'] = this.chawkiDetails['trainingCertificateUrl']
    // }
    if (this.chawkiDetails && this.chawkiDetails['nurseryAreaPhotoUrl'] === '' && this.nurseryAreaPhotoImgUploaded === false) {
      params['nurseryAreaPhotoUrl'] = '';
    } 
    // else {
    //   params['nurseryAreaPhotoUrl'] = this.chawkiDetails['nurseryAreaPhotoUrl']
    // }
    if (this.chawkiDetails && this.chawkiDetails['chawkiInfrastructureImageUrls'].length == 0 && this.crcImageUploaded === false) {
      params['chawkiInfrastructureImageUrls'] = [];
    }
    if (this.chawkiDetails && this.chawkiDetails['chawkiImageUrls'].length == 0 && this.chawkiImageUploaded === false) {
      params['chawkiImageUrls'] = [];
    }

    if (this.id) {
      if (this.chawkiDetails['phone'] == params['phone']) {
        delete params['phone'];
      }
      this.ngxLoader.stop();
      this.api.updateChawki(params, this.id,).then(async res => {
        if (res) {
          this.snackBar.open('Updated Chawki successfully', 'Ok', {
            duration: 3000
          });
          await this.uploadImage(res['id']);
        } else {
          this.snackBar.open('Failed to update Chawki', 'Ok', {
            duration: 3000
          });
          this.router.navigate(['/resha-farms/chawki']);
        }
      }, err => {
        // this.uploadImage(this.id);
        console.log(err);
      });
    } else {
      this.ngxLoader.stop();
      this.api.chawkiOnBoarding(params).then(async res => {
        if (res) {
          this.snackBar.open('Created Chawki successfully', 'Ok', {
            duration: 3000
          });
          await this.uploadImage(res['id']);
        } else {
          this.snackBar.open('Failed to created Chawki', 'Ok', {
            duration: 3000
          });
          this.router.navigate(['/resha-farms/chawki']);
        }
      }, err => {
        console.log(err);
      });
    }
    this.goBack();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.watchPosition();
      },
        (error) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  watchPosition(){
    let id = navigator.geolocation.watchPosition((position) =>{
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          if(position.coords.latitude === this.latitude){
            navigator.geolocation.clearWatch(id);
          }
          this.chawkiCreateForm.get('longitude').patchValue(this.longitude)
          this.chawkiCreateForm.get('latitude').patchValue(this.latitude)    
                
    }, (error) =>{console.log(error)},
    {
      enableHighAccuracy : true,
      timeout: 5000,
      maximumAge: 0
    }
    )
  }

  async uploadImage(id) {
    this.id = id;
    if (this.nurseryAreaPhotoImgUploaded || this.crcImageUploaded || this.chawkiImageUploaded) {
      this.ngxLoader.stop();
      await this.api.uploadChawkiDocImages(this.nurseryAreaPhotoImgFile ? this.nurseryAreaPhotoImgFile.target ? this.nurseryAreaPhotoImgFile.target.files[0] ?
          this.nurseryAreaPhotoImgFile.target.files[0] : null : null : null,
        this.imageFile,
        this.chawkiImageFile,
        this.nurseryAreaPhotoImgUploaded,
        this.crcImageUploaded,
        this.chawkiImageUploaded,
        id).then(res => {
        }, err => {
          this.snackBar.open('Could not upload, Please try again', 'Ok', {
            duration: 3000
          });
          return;
        });
    }
    if(this.regCertificateImgUploaded) {
      this.getS3CatUrl(this.regCertificateImgFile.target.files[0].type,this.regCertificateImgFile.target.files[0], 'regCertificateUrl');
    }

    if(this.trainingCertificateImgUploaded) {
      this.getS3CatUrl(this.trainingCertificateImgFile.target.files[0].type,this.trainingCertificateImgFile.target.files[0], 'trainingCertificateUrl');
    }
    this.router.navigate(['/resha-farms/chawki']);
    this._cd.detectChanges();
  }

  showImage(imageUrl) {
    if(imageUrl) {
      if(this.id) {
        this.modelImageUrl=null;
        this.getprotectedUrl(imageUrl);
        this.expandImage = true;
      } else {
        this.modelImageUrl=imageUrl;
        this.expandImage = true;
        this._cd.detectChanges();
      }
    }
  }

   async getprotectedUrl(imgUrl){
    const { targetUrl } : any = await this.api.getPresignedUrlForViewImage(imgUrl);
    this.modelImageUrl = targetUrl;
    this._cd.detectChanges()
  }

  removeRegCetificate() {
    this.regCertificateFilePreviewImage = undefined;

    if (this.chawkiDetails) {
      this.chawkiDetails['regCertificateUrl'] = '';
    }
    this.regCertificateImgUploaded = false;
    this.regCertificateImgFile = null;
  }

  async getCenters() {
    this.ngxLoader.stop();
    this.api.getCocoonProcCenters().then(details => {
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }

  onTraingCertificateUpload(image) {
    this.trainingCertificateImgFile = image;
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.trainingCertificateFilePreviewImage = reader.result as string;
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file);
      this.trainingCertificateImgUploaded = true;
    }
  }

  removeTrainingCetificate() {
    this.trainingCertificateFilePreviewImage = undefined;
    if (this.chawkiDetails) {
      this.chawkiDetails['trainingCertificateUrl'] = '';
    }
    this.trainingCertificateImgUploaded = false;
    this.trainingCertificateImgFile = null;
  }

  nurseryAreaPhotoUpload(image) {
    this.nurseryAreaPhotoImgFile = image;
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.nurseryAreaPhotoPreviewImage = reader.result as string;
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file);
      this.nurseryAreaPhotoImgUploaded = true;
    }
  }

  removeNurseryAreaPhoto() {
    this.nurseryAreaPhotoPreviewImage = undefined;
    if (this.chawkiDetails) {
      this.chawkiDetails['nurseryAreaPhotoUrl'] = '';
    }
    this.nurseryAreaPhotoImgUploaded = false;
    this.nurseryAreaPhotoImgFile = null;
  }

  deleteImage(deleteForm, index) {
    this.deleteImageIndex = index;
    this.modalRef = this.modalService.open(deleteForm)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  remove() {
    this.crcPreviewImage.splice(this.deleteImageIndex, 1);
    const params = {
      chawkiInfrastructureImageUrls: this.crcPreviewImage
    }
    if (this.id) {
      this.ngxLoader.stop();
      this.api.updateChawki(params, this.id).then(res => {
        if (res) {
          this.crcPreviewImage = res['chawkiInfrastructureImageUrls']
          this.modalRef.close();
        }
      })
    }
    this.modalRef.close();
    this.imageFile.splice(this.deleteImageIndex, 1);
    this._cd.detectChanges();
  }

  async getS3CatUrl(fileType,file,key){
    try{
      this._cd.detectChanges()
      await this.api.getKYCPresignedUrl(`kyc_chawki`,fileType.split('/')[1],this.id,'registration').then((res:S3UrlResponse)=>{
        this.calluploadImageToS3APICate(res.targetUrl,file,res.fileName,key);
     })
    }catch(err){
      this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges()
    }
  
  }

  async calluploadImageToS3APICate(s3url:String,file,fileNameFromS3:String, key){
   let reqObj = {};
   reqObj[key]='';
    try{
      this._cd.detectChanges()
      await this.api.updateImageToS3Directly(s3url,file).then(res=>{
        reqObj[key] = fileNameFromS3;
        this.api.updateChawki(reqObj, this.id).then(res=> {

        });
        this._cd.detectChanges();
        });
    }catch(err){
        this.snackBar.open('Image upload Failed', 'Ok', {
          duration: 3000
        });
        this._cd.detectChanges()
    }
  }
 
  onRegCertificateUpload(image) {
    this.regCertificateImgFile = image;
   if (image) {
     const file = image.target.files[0];
     const reader = new FileReader();
     reader.onload = () => {
       let previewImage = reader.result as string;
        this.regCertificateFilePreviewImage = reader.result as string;
       this._cd.detectChanges();
      this.regCertificateImgUploaded = true;
       
     };
     reader.readAsDataURL(file);
    }
 }
 
  onImageUpload(images) {
    for (let i = 0; i < images.target.files.length; i++) {
      this.imageFile.push(images.target.files[i]);
    }
    if (images) {
      const files = images.target.files;
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          this.crcPreviewImage.push(reader.result as string);
          this._cd.detectChanges();
        };
        reader.readAsDataURL(files[i]);

      }
      this.crcImageUploaded = true;
    }
  }

  onChawkiImageUpload(images) {
    for (let i = 0; i < images.target.files.length; i++) {
      this.chawkiImageFile.push(images.target.files[i]);
    }
    if (images) {
      const files = images.target.files;
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          this.chawkiImagePreviewImage.push(reader.result as string);
          this._cd.detectChanges();
        };
        reader.readAsDataURL(files[i]);
      }
      this.chawkiImageUploaded = true;
    }
  }

  removeChawkiImg() {
    this.chawkiImagePreviewImage.splice(this.deleteImageIndex, 1);
    const params = {
      chawkiImageUrls: this.chawkiImagePreviewImage
    }
    if (this.id) {
      this.ngxLoader.stop();
      this.api.updateChawki(params, this.id).then(res => {
        if (res) {
          this.chawkiImagePreviewImage = res['chawkiImageUrls']
          this.modalRef.close();
        }
      })
    }
    this.modalRef.close();
    this.chawkiImageFile.splice(this.deleteImageIndex, 1);
    this._cd.detectChanges();
  }

  // Reeler Validations
  isControlValidForReeler(controlName: string): boolean {
    const control = this.chawkiCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.chawkiCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.chawkiCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedForReeler(controlName): boolean {
    const control = this.chawkiCreateForm.controls[controlName];
    return control.dirty || control.touched;
  }
}