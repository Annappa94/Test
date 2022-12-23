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
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-seeds-order-crud',
  templateUrl: './seeds-order-crud.component.html',
  styleUrls: ['./seeds-order-crud.component.scss']
})
export class SeedsOrderCrudComponent implements OnInit {

  @ViewChild(AddressPincodeFormComponent) addressForm: AddressPincodeFormComponent;
  @ViewChild('mutliGSTAdds') mutliGSTAdds: ElementRef;
  @ViewChild('gstInactiveStatus') gstInactiveStatus: ElementRef;
  createSeedsForm:UntypedFormGroup
  modalRef: any;
  closeResult: string;
  warehouseList: any;
  oilMillList: any;
  modelImageUrl: any;
  expandImage: boolean;
  id:any;
  selectedGstStatus: any;
  oilMilsListData: number;
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
  salesOrderData: any;
  slectedWarehouseGst: any;
  withInState: any;

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
    private globalService: GlobalService

  ) {
    console.log(this.globalService.cottonData);
    this.formIntilaization();
    this.withInState = true;
   }

   formIntilaization(){
    this.salesOrderData = this.globalService.cottonData;
    this.createSeedsForm = this.form.group({
      cottonSeedsOrderItems: new UntypedFormArray([]),
      selectedOilMill:new UntypedFormControl(),
      warehouseId: new UntypedFormControl(),
      gstNumber: new UntypedFormControl(),
      totalAmount: new UntypedFormControl(),
      sellingWeight: new UntypedFormControl(),
      actualSellingWeight: new UntypedFormControl(),
      sellingPricePerKg: new UntypedFormControl(),
      discountAmount: new UntypedFormControl(0),
      grossTotal:new UntypedFormControl('',Validators.required),
      hamaliDeduction: new UntypedFormControl(0),
      weighBridgeCharges:new UntypedFormControl(0),
      cgst: new UntypedFormControl(''),
      sgst: new UntypedFormControl(),
      igst: new UntypedFormControl(),
      netAmount:new UntypedFormControl(),
      creditDays: new UntypedFormControl(''),
      uploadedImage : new UntypedFormControl(),
      availableWeight:new UntypedFormControl(),
      billingAddress:new UntypedFormControl(),
      deduction:new UntypedFormControl(0),
      actualWeight:new UntypedFormControl(),
      sellingPrice:new UntypedFormControl(),
      pretaxAmount: new UntypedFormControl(),
  
    })

    if (this.salesOrderData) {
      this.salesOrderData.forEach(e => {
        (this.createSeedsForm.get('cottonSeedsOrderItems') as UntypedFormArray).push(new UntypedFormGroup({
          availableWeight:new UntypedFormControl(e.availableQuantity), 
          code:new UntypedFormControl(e.code),
          id:new UntypedFormControl(e.id),
          totalAmount: new UntypedFormControl(),
          sellingWeight: new UntypedFormControl(),
          actualSellingWeight: new UntypedFormControl(),
          sellingPricePerKg: new UntypedFormControl(),
          discountAmount: new UntypedFormControl(0),
          grossTotal:new UntypedFormControl(),
          netAmount:new UntypedFormControl(),
          deduction:new UntypedFormControl(0),
          actualWeight:new UntypedFormControl(),
          sellingPrice:new UntypedFormControl(e.pricePerKg),
          originalSellingPrice:new UntypedFormControl(e.pricePerKg),
          pretaxAmount: new UntypedFormControl(),
          
        }))
      })
      
    }

    

  
   }

  
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
  getOilMillsList() {
    this.api.searchAllOilMills( this.selectedStatus ).then(res => {
    this.oilMilsListData = res['content'];   

    })
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

  //Onchange oil mill
  async onChangeOilMill(event) {
    this.selectedStatus = event.target.value;  
    if (this.selectedStatus == undefined) {
      this.selectedStatus = ''
    }
    this.getOilMillById();
  }
  //
  getOilMillById() {
    this.api.searchOilMillbyId( this.selectedStatus).then(res => {
      this.gstDetails=res['gstNumberProfileDetails'][0];
      this._cd.detectChanges();
      this.gstComparing();
    })
  }
  async onChangeWareHouse(event) {
    this.api.getWarehouseById(event).then(res=>{
      console.log(res);
      this.slectedWarehouseGst = res['gstId'];
      this.gstComparing();
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

  priceCalculation(i){
    this.WeightCalculate =(this.createSeedsForm.get("cottonSeedsOrderItems") as UntypedFormArray).at(i).get('sellingWeight').value-(this.createSeedsForm.get("cottonSeedsOrderItems") as UntypedFormArray).at(i).get('deduction').value;
    (this.createSeedsForm.get("cottonSeedsOrderItems") as UntypedFormArray).at(i).get('actualWeight').patchValue(this.WeightCalculate);

    (this.createSeedsForm.get("cottonSeedsOrderItems") as UntypedFormArray).at(i).get('deduction').setValidators([Validators.required,Validators.max(    (this.createSeedsForm.get("cottonSeedsOrderItems") as UntypedFormArray).at(i).get('sellingWeight').value-1)]);
    (this.createSeedsForm.get("cottonSeedsOrderItems") as UntypedFormArray).at(i).get('deduction').updateValueAndValidity();

    this.grosstotalAmount= this.WeightCalculate * (this.createSeedsForm.get("cottonSeedsOrderItems") as UntypedFormArray).at(i).get('sellingPrice').value;
    (this.createSeedsForm.get("cottonSeedsOrderItems") as UntypedFormArray).at(i).get('grossTotal').patchValue(this.grosstotalAmount);

    // discount calculation
    let DiscountAmount = (this.createSeedsForm.get("cottonSeedsOrderItems") as UntypedFormArray).at(i).get('discountAmount').value;

    this.taxAmount = this.grosstotalAmount - DiscountAmount;
    (this.createSeedsForm.get("cottonSeedsOrderItems") as UntypedFormArray).at(i).get('pretaxAmount').patchValue(this.taxAmount);

    (this.createSeedsForm.get("cottonSeedsOrderItems") as UntypedFormArray).at(i).get('discountAmount').setValidators([Validators.required,Validators.max( this.grosstotalAmount -1 )]);
    (this.createSeedsForm.get("cottonSeedsOrderItems") as UntypedFormArray).at(i).get('discountAmount').updateValueAndValidity();
    (this.createSeedsForm.get("cottonSeedsOrderItems") as UntypedFormArray).at(i).get('sellingPrice').setValidators([Validators.required,Validators.min((this.createSeedsForm.get("cottonSeedsOrderItems") as UntypedFormArray).at(i).get('originalSellingPrice').value)]);
    (this.createSeedsForm.get("cottonSeedsOrderItems") as UntypedFormArray).at(i).get('sellingPrice').updateValueAndValidity();

    this.updateThePrice();
  }

  updateThePrice(){
    let allPurcasesData =  (this.createSeedsForm.get("cottonSeedsOrderItems") as UntypedFormArray);

    let globalGrossTotal:any = 0;
    let globalDiscount:any = 0;
    let gloabalPreTaxAmount:any = 0;
    let globalNetAmount:any = 0;
    let globalTotalWeight:any = 0;
    for(let lot of allPurcasesData.controls){
      let grossAmount = lot.value.grossTotal ? lot.value.grossTotal : 0;
      globalGrossTotal =  globalGrossTotal + (parseFloat(grossAmount) );

      let discountAmount = lot.value.discountAmount ? lot.value.discountAmount : 0;
      globalDiscount = parseFloat(globalDiscount) + parseFloat(discountAmount);

      let sellingWeight = lot.value.actualWeight ? lot.value.actualWeight : 0;
      globalTotalWeight = globalTotalWeight + parseFloat(sellingWeight);
    }

    gloabalPreTaxAmount = parseFloat(globalGrossTotal) -  parseFloat(globalDiscount);
    globalNetAmount = parseFloat(gloabalPreTaxAmount) + (parseFloat(gloabalPreTaxAmount) * 0.05);

    this.createSeedsForm.get('grossTotal').patchValue(parseFloat(globalGrossTotal)?.toFixed(2));
    this.createSeedsForm.get('discountAmount').patchValue(parseFloat(globalDiscount)?.toFixed(2));
    this.createSeedsForm.get('pretaxAmount').patchValue(parseFloat(gloabalPreTaxAmount)?.toFixed(2));
    this.createSeedsForm.get('totalAmount').patchValue(parseFloat(globalNetAmount)?.toFixed(2));
    // this.createSeedsForm.get('totalWeight').patchValue(parseFloat(globalTotalWeight)?.toFixed(2));

    if(this.withInState){
      this.createSeedsForm.get('sgst').patchValue((parseFloat(gloabalPreTaxAmount)*0.025)?.toFixed(2));
      this.createSeedsForm.get('cgst').patchValue((parseFloat(gloabalPreTaxAmount)*0.025)?.toFixed(2));
      this.createSeedsForm.get('igst').patchValue(0);
    }else{
      this.createSeedsForm.get('sgst').patchValue(0);
      this.createSeedsForm.get('cgst').patchValue(0);
      this.createSeedsForm.get('igst').patchValue((parseFloat(gloabalPreTaxAmount)*0.05)?.toFixed(2));
    }
  }

 
  //Create cotton seeds sales order
  createCottonSalesOrder(form){
    const payload= {
      "cottonSeedsOrderItems":[],
      // "warehouseId": parseInt(this.createSeedsForm.value.warehouseId),
      "warehouse": "warehouse/"+this.createSeedsForm.value.warehouseId,
      // "gstNumber": this.createSeedsForm.value.gstnumber,
      "hamaliDeduction": form ? parseFloat(form.hamaliDeduction) : 0,
      "weighBridgeCharges": form ? parseFloat(form.weighBridgeCharges) : 0,
      "cgst": parseFloat(this.createSeedsForm.value.cgst),
      "sgst":  parseFloat(this.createSeedsForm.value.sgst),
      "igst":  parseFloat(this.createSeedsForm.value.igst),
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
      "orderStatus": "NEW",
      "withInState": this.withInState,
      "paymentStatus": "PENDING",
      "rmReceipts": null,
      "cottonSeedsSalesOrderType":"COTTON_SEEDS_LISTING",
      "oilMill":"/oilMill/"+this.createSeedsForm.value.selectedOilMill
    } 
    form.cottonSeedsOrderItems.forEach(element => {
      payload['cottonSeedsOrderItems'].push({
        "cottonSeedsLotId": parseInt(element.id),
        "totalAmount": parseInt(element.grossTotal),
        "sellingWeight": parseInt(element.sellingWeight),
        "actualSellingWeight": parseInt(element.actualWeight),
        "sellingPricePerKg": parseInt(element.sellingPrice),
        "discountAmount": parseInt(element.discountAmount),
        "grossTotal":  parseInt(element.grossTotal),
        "deduction": parseInt(element.deduction),
        "preTaxAmount": parseInt(element.pretaxAmount)      
      });
    });
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
    this.router.navigate(['/resha-farms/Cotton-Seeds-purchase']);
  } 

    
    
    
}
  
  