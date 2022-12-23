import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { ApiService } from 'src/app/services/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.scss']
})
export class SupplierDetailsComponent implements OnInit {
  searchText = '';
  isTableLoaded = false;
  farmerDetails;
  centerName;
  chaakiDate;
  id;
  paymentDetail;
  modalRef: any;
  closeResult: string;
  farmerKhataList: any[];
  khataSearchText = '';
  imageUploaded = false;
  imageFile = null;
  previewImage: string | ArrayBuffer;
  chawkiOrderSearch = '';
  iotDeviceList: any = [];
  iotDeviceDate = '';
  userType;
  iotDevicePaymentList:any;
  iotDevicePaymentForm: UntypedFormGroup;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private router: Router,
    public utils: UtilsService,
    private globalService: GlobalService,
    private snackBar: MatSnackBar,
    private ngxLoader : NgxUiLoaderService,
    private modalService: NgbModal,
    form: UntypedFormBuilder,
    private $gaService:GoogleAnalyticsService,
    ) { 
      this.userType = JSON.parse(localStorage.getItem('_ud'));
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
      }
    
    })

    this.getFarmerById(this.id);
  }
  noOfKYCDocs=[];
  kycFlag = false;

  ngOnInit(): void {
    this.api.getAllFarmerKycDocList(this.id , 'pupaesvc/pupaesupplier').then(res => {
      this.noOfKYCDocs = res['_embedded']['pupaesupplierkyc'];
      if(this.noOfKYCDocs.length  > 0){
        this.kycFlag = true;
      }
    })
    this.getAllCustomerTypes();
    //this._cd.detectChanges();
  }
  navigateToKyc(){
    if(this.farmerDetails.customerTypeName){
      this.router.navigate(['/resha-farms/kyc-form',this.id,'pupaesupplier',this.farmerDetails.customerTypeName])
    } else {
      this.snackBar.open( 'Please select customer type.', 'OK', {
        duration: 300
      })
    }
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
    this.api.updatePupaeSuppliers(params, this.id).then(res=>{
      this.getFarmerById(this.id);
      this.ngOnInit();
    })
    this.api.deleteKYCByPerforma('kyc/pupaeSupplier', this.id,'/pupaesvc').then(res=>{
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
  // navigateToKyc(){
  //   if(this.farmerDetails.customerTypeName){
  //     this.router.navigate(['kyc-form',this.id,'farmer',this.farmerDetails.customerTypeName])
  //   } else {
  //     this.snackBar.open( 'Please select customer type.', 'OK', {
  //       duration: 300
  //     })
  //   }
  // }
  async getFarmerById(id) {
    this.ngxLoader.stop();
    this.api.getPupaeSupplierById(id).then(res => {
      this.farmerDetails = res;
      this.centerName = res['centerName']
      if(this.farmerDetails.name) {
        this.farmerDetails.initial = this.farmerDetails.name.match(/(^\S\S?|\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
      }
      this.farmerDetails.displayType = this.farmerDetails.cocoonType ? this.globalService.getDisplayCocoonType(this.farmerDetails.cocoonType) : '-';
      //this.previewImage = res['farmer']['profilePicUrl'];
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
    this.api.updateFarmers(params,this.id,).then(res => {
      this.getFarmerById(this.id);
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
      this.api.uploadProfileImages(this.imageFile.target.files[0], this.id, 'FARMER').then(res => {
        //console.log(res);        
        if(res){
          this.snackBar.open('Image uploaded successfully', 'OK', {
            duration: 3000
          })
        }
      })
    }
  }

  editFarmer() {
    this.router.navigate(['/resha-farms/rm-pupae-suppliers/crud', this.farmerDetails.id]);
  }

  goBack() {
    this.router.navigate(['/resha-farms/rm-pupae-suppliers']);
  }

  lotDetail(lot) {
    this.router.navigate(['/resha-farms/cocoon-lot/details', lot.id]);
  }


  openPaymentDetails(paymentDetails, item) {
    this.paymentDetail = item;
    this.modalRef = this.modalService.open(paymentDetails)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  highlightText;

  payNow(payment, item) {
    this.paymentDetail = item;
    this.iotDevicePaymentForm.controls['amount'].setValue(item.dueAmount);
    this.highlightText = this.paymentDetail.dueAmount.toLocaleString('en-IN').split('.');
    this.iotDevicePaymentForm.controls['referenceNumber'].setValue('');
    this.iotDevicePaymentForm.controls['paymentMode'].setValue('Online');
    this.modalRef = this.modalService.open(payment, { size: 'lg' })
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }


  goToDeviceDetails(deviceId) {
    this.router.navigate(['/rearing-iot/details',{id: deviceId, farmerId: this.farmerDetails.code}]);
  }

  isControlValidForIot(controlName: string): boolean {
    const control = this.iotDevicePaymentForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForIot(controlName: string): boolean {
    const control = this.iotDevicePaymentForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForIot(validation, controlName): boolean {
    const control = this.iotDevicePaymentForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }



}
