import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { items } from 'fusioncharts';
import { AddressPincodeFormComponent } from '../../shared/address-pincode-form/address-pincode-form.component';

@Component({
  selector: 'app-seeds-sales-order-crud',
  templateUrl: './seeds-sales-order-crud.component.html',
  styleUrls: ['./seeds-sales-order-crud.component.scss']
})
export class SeedsSalesOrderCrudComponent implements OnInit {
  @ViewChild(AddressPincodeFormComponent) addressForm: AddressPincodeFormComponent;
  
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
  selectedSpinningMill: number;
  selectedStatus: any;
  paginationData: any;
  inventoryDetails: any;
  selectedOilMill: any;
  gstDetails: any;
  WeightCalculate: number;
  grosstotal: any;
  grosstotalAmount: number;
  taxAmount: number;
  payment:any;
  pretaxAmount: number;
  errorMsg: string;
  selectedWarehouseId: any;
  slectedWarehouseGst: any;
  withInState: boolean;
  selectedOilMillId: any;
  latestPriceSheet: any;
  minPrice: any;
  maxPrice: number;

  constructor(
    private api: ApiService,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private modalService: NgbModal,
    private form: UntypedFormBuilder,
    private route:ActivatedRoute,
    private snackBar:MatSnackBar,
    private toaster:ToastrService,
    private _cd: ChangeDetectorRef,
  ) { }

  createSeedsForm:UntypedFormGroup = new UntypedFormGroup({
    selectedOilMill:new UntypedFormControl(),
   warehouseId: new UntypedFormControl(),
    gstNumber: new UntypedFormControl(),
    totalAmount: new UntypedFormControl(),
    sellingWeight: new UntypedFormControl('',Validators.required),
    actualSellingWeight: new UntypedFormControl(),
    sellingPricePerKg: new UntypedFormControl(''),
    discountAmount: new UntypedFormControl(0),
    grossTotal:new UntypedFormControl('',Validators.required),
    hamaliDeduction: new UntypedFormControl(0),
    weighBridgeCharges:new UntypedFormControl(0),
    cgst: new UntypedFormControl(0),
    sgst: new UntypedFormControl(0),
    igst: new UntypedFormControl(0),
    netAmount:new UntypedFormControl(),
    creditDays: new UntypedFormControl('',),
    uploadedImage : new UntypedFormControl(),
    availableWeight:new UntypedFormControl(),
    billingAddress:new UntypedFormControl(),
    deduction:new UntypedFormControl(0),
    actualWeight:new UntypedFormControl(),
    sellingPrice:new UntypedFormControl(),
    pretaxAmount: new UntypedFormControl(),

  })
 
  ngOnInit(): void {
    this.getWarehouses();
    this.getOilMillsList();
   
  }
  gstStatusInactive(payment){  
    this.modalRef = this.modalService.open(payment)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  //get warehouse list
  async getWarehouses() {
    this.ngxLoader.start();
    this.api.getListOfWareHouses().then(details => {
      this.warehouseList = details['content'];
      this._cd.detectChanges()
      this.ngxLoader.stop();
    })
  }
  getOilMillsList() {
    this.api.searchAllOilMills( this.selectedStatus ).then(res => {
      this.selectedSpinningMill = res['content'];   
      this._cd.detectChanges();
    })
  }

  //Onchange oil mill
  async onChangeOilMill(event) {
    this.selectedOilMillId = event.target.value;  
    if (this.selectedOilMillId == undefined) {
      this.selectedOilMillId = ''
    }
    this.getOilMillById();
  }
  //
  getOilMillById() {
    this.api.searchOilMillbyId( this.selectedOilMillId).then(res => {
      this.gstDetails=res['gstNumberProfileDetails'][0];
      this._cd.detectChanges();
      this.gstComparing();
    })
  }
  async onChangeWareHouse(event) {
    this.selectedWarehouseId = event.target.value;
    this.invetoryList();
    this.api.getWarehouseById( this.selectedWarehouseId).then(res=>{
      console.log(res);
      this.slectedWarehouseGst = res['gstId'];
      this.gstComparing();
      this._cd.detectChanges();
    })
    this.getWarehousePriceSheet();
  }
  invetoryList(){
    this.api.estimatedInventoryList(this.selectedWarehouseId).then(response=>{
    this.inventoryDetails=response;   
      this.createSeedsForm.get('availableWeight').patchValue(this.inventoryDetails['seeds'])
    this._cd.detectChanges();
  
    })
  }

  gstComparing(){
    if (this.gstDetails?.gstNumber != undefined && this.slectedWarehouseGst != undefined) {
      if (this.gstDetails?.gstNumber.substr(0,2) ==  this.slectedWarehouseGst.substr(0,2)) {
        this.withInState = true;      
      } else {
        this.withInState = false;
      }
    }
  }

  getWarehousePriceSheet() {
    this.api.getPriceSheetOfWarehouse().then(response => {
      this.latestPriceSheet = response['content'];
      this._cd.detectChanges();
      this.maxPrice = 0;
      this.minPrice = 0
      this.latestPriceSheet.forEach(item => {
        if (item?.event.params?.id == this.selectedWarehouseId) {
          this.minPrice  = item.conditions[0].value[0];
           this.maxPrice  = item.conditions[0].value[1];
           
        }
      })
      this.createSeedsForm.get('sellingPrice').patchValue(this.maxPrice);
    })
  }



  priceCalculation(){
    if (this.createSeedsForm.value.sellingWeight > this.createSeedsForm.value.availableWeight) {
      this.errorMsg = "Selling weight is shoudn't be more than avilable"
    } else {
      this.errorMsg = " ";
    }
    this.WeightCalculate= this.createSeedsForm.value.sellingWeight-this.createSeedsForm.value.deduction
    console.log(this.WeightCalculate)
    this.createSeedsForm.get('actualWeight').patchValue(this.WeightCalculate)
    this.createSeedsForm.get('deduction').setValidators([Validators.required,Validators.max(this.createSeedsForm.get('sellingWeight').value-1)]);
    this.createSeedsForm.get('deduction').updateValueAndValidity();
    this.grosstotalAmount= this.WeightCalculate*this.createSeedsForm.value.sellingPrice
    this.createSeedsForm.get('grossTotal').patchValue(this.grosstotalAmount)
    this.taxAmount=this.createSeedsForm.value.grossTotal-this.createSeedsForm.value.discountAmount
    this.createSeedsForm.get('pretaxAmount').patchValue(this.taxAmount)
    // this.pretaxAmount=(this.createSeedsForm.value.pretaxAmount*2.5)/100
    this.createSeedsForm.get('discountAmount').setValidators([Validators.required,Validators.max(this.createSeedsForm.get('grossTotal').value-1)]);
    this.createSeedsForm.get('discountAmount').updateValueAndValidity();
    this.createSeedsForm.get('totalAmount').patchValue(this.createSeedsForm.value.pretaxAmount + (this.createSeedsForm.value.pretaxAmount*0.05));
    if(this.withInState){
      this.createSeedsForm.get('sgst').patchValue((parseFloat(this.createSeedsForm.value.pretaxAmount)*0.025)?.toFixed(2));
      this.createSeedsForm.get('cgst').patchValue((parseFloat(this.createSeedsForm.value.pretaxAmount)*0.025)?.toFixed(2));
      this.createSeedsForm.get('igst').patchValue(0);
    }else{
      this.createSeedsForm.get('sgst').patchValue(0);
      this.createSeedsForm.get('cgst').patchValue(0);
      this.createSeedsForm.get('igst').patchValue((parseFloat(this.createSeedsForm.value.pretaxAmount)*0.05)?.toFixed(2));
    }
  
  }


  //Create cotton seeds sales order
  createCottonSalesOrder(){
    const payload= {
      // "warehouseId": parseInt(this.createSeedsForm.value.warehouseId),
      "warehouse": "warehouse/"+this.createSeedsForm.value.warehouseId,
      "gstNumber": this.createSeedsForm.value.gstnumber,
      "totalAmount": parseInt(this.createSeedsForm.value.grossTotal),
      "sellingWeight": parseInt(this.createSeedsForm.value.sellingWeight),
      "actualSellingWeight": parseInt(this.createSeedsForm.value.actualWeight),
      "sellingPricePerKg": parseInt(this.createSeedsForm.value.sellingPrice),
      "discountAmount": parseInt(this.createSeedsForm.value.discountAmount),
      "grossTotal":  parseInt(this.createSeedsForm.value.grossTotal),
      "hamaliDeduction":  parseInt(this.createSeedsForm.value.hamaliDeduction),
      "weighBridgeCharges":  parseInt(this.createSeedsForm.value.weighBridgeCharges),
      "cgst": parseFloat(this.createSeedsForm.value.cgst),
      "sgst":  parseFloat(this.createSeedsForm.value.sgst),
      "igst":  parseFloat(this.createSeedsForm.value.igst),
      "netAmount":  parseInt(this.createSeedsForm.value.grossTotal),
      address: {
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
      "creditDays": parseInt(this.createSeedsForm.value.creditDays),
      "invoiceURL":  this.createSeedsForm.value.invoiceURL,
      "orderStatus":  this.createSeedsForm.value.orderStatus,
      "paymentStatus":  this.createSeedsForm.value.paymentstatus,
      "rmReceipts":  this.createSeedsForm.value.rmReceipts,
      "cottonSeedsSalesOrderType":"ESTIMATED_INVENTORY",
      "oilMill":"/oilMill/"+this.createSeedsForm.value.selectedOilMill
    } 
    this.api.createSalesOrder(payload).then(res=>{
      this.toaster.success('Cotton Seeds Sales Order Created successfully', 'Ok', {
        timeOut: 3000,
      })
      this.router.navigate(['/resha-farms/cotton-seeds-order/list']);

    })

  }
  //upload cotton-seeds image here
  showImage(imageUrl) {
    if (imageUrl) {
      this.modelImageUrl = null;
      this.getprotectedUrl(imageUrl);
      this.expandImage = true;
    }
  }
  async getprotectedUrl(imgUrl) {
    const { targetUrl }: any = await this.api.getPresignedUrlForViewImage(imgUrl);
    this.modelImageUrl = targetUrl;
    this._cd.detectChanges()
  }
  onImageUpload(image) {
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        let previewImage = reader.result as string;
        this.getS3CatUrl(file.type, file);
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
  imageLoading: boolean = false;
  async getS3CatUrl(fileType, file) {
    try {
      this.imageLoading = true;
      this._cd.detectChanges()
      await this.api.getRearingIotFollowupNoteImageUrl(fileType.split('/')[1]).then((res: any) => {
        this.calluploadImageToS3APICate(res.targetUrl, file, res.fileName);
        this.imageLoading = false;
      })
    } catch (err) {
      this.createSeedsForm.get('uploadedImage').patchValue('')
    
      this.imageLoading = false;
      this._cd.detectChanges()
    }
  }

  async calluploadImageToS3APICate(s3url: String, file, fileNameFromS3: String) {
    try {
      this.imageLoading = true;
      this._cd.detectChanges()
      await this.api.updateImageToS3Directly(s3url, file).then((res: any) => {
        this.createSeedsForm.get('uploadedImage').patchValue(fileNameFromS3)
        this.imageLoading = false;
        this._cd.detectChanges();
      });
    } catch (err) {
      this.imageLoading = false;
      this.createSeedsForm.get('uploadedImage').patchValue('')
      this._cd.detectChanges()
    }
  }
  goBack() {
    this.router.navigate(['/resha-farms/cotton-seeds-order/list']);
  }
  
  
}
