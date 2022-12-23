import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgModule } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/services/global/global.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-manufactured-inventory',
  templateUrl: './manufactured-inventory.component.html',
  styleUrls: ['./manufactured-inventory.component.scss']
})
export class ManufacturedInventoryComponent implements OnInit {

  paginationData = {
    currentPage: 0,
    pageSize: 10,
    total: 0,
    pages: [],
    currentColumn: 'createdDate',
    currentDirection: 'desc',
  };
  modalRef: any;
  closeResult: string;
  modelImageUrl: any;
  expandImage: boolean;
  manufacturedDetailes: any;
  filterList: [];
  driverList = [];
  vehiclesList: [];
  warehouseList: any[];
  selectedTransfer: any;
  selectedBaleLot = [];
  selectedStockTransfer: any;
  // vehicleTypes: [];
  selectedDriverObj: any;
  selectedDriverId: any;
  selectedDriverName: any;
  selectedDriverMobile: any;
  selectedvehicleNumber: any;
  selectedVehicleId: any;
  fromAddress: any;
  selectedWarehouse: any;
  selectedToWarehouse: any;
  toAddress: any;
  searchText: string;
  selectedStatus: any;
  // selectedStatus ='(AVAILABLE,SOLD)';

  filterForm: UntypedFormGroup = new UntypedFormGroup({
    currentLocation: new UntypedFormControl(''),
    status :new UntypedFormControl('(AVAILABLE,Sold)')
  })
  selectedValue: any;
  outTonWarningMsg: any;
  disableConfirmButton: any;
  selectedCurreWareHouse: any[];
  disableWarningMsg: string;
  selectedFromWarehouseID: any;
  selectedWeight: any;

  constructor(private modalService: NgbModal,
    private api: ApiService,
    private ngxLoader: NgxUiLoaderService,
    private toaster: ToastrService,
    private snackBar: MatSnackBar,
    private _cd: ChangeDetectorRef,
    private router: Router,
    private globalService: GlobalService
  ) {
    this.selectedStatus = '';
    this.disableConfirmButton = false;
  }

  ngOnInit(): void {
    this.manufacturedList()
    this.getWarehouses();
    this.getAllDrivers();

  }

  listenForFilterChanges() {
    this.filterForm.valueChanges.subscribe(value => {
      // console.log(value);
      this.manufacturedList();
    })
  }

  //stock crate form
  stockcreateform: UntypedFormGroup = new UntypedFormGroup({
    vehiclceimage: new UntypedFormControl(''),
    numberofbales: new UntypedFormControl('',[Validators.pattern('[1-9]{1}[0-9]{0,10}')]),
    driverName: new UntypedFormControl(''),
    vehicleId: new UntypedFormControl('', [Validators.required]),
    logesticCost: new UntypedFormControl(''),
    totalCost: new UntypedFormControl('',[Validators.required]),
    fromWarehouseId: new UntypedFormControl('',[Validators.required]),
    toWarehouseId: new UntypedFormControl('',[Validators.required]),
    driverId: new UntypedFormControl('', [Validators.required]),
    address: new UntypedFormControl(''),
    weight: new UntypedFormControl('',[Validators.pattern('[1-9]{1}[0-9]{0,10}')]),
    availableQuantity: new UntypedFormControl('')
    // setValidators([Validators.min(setPrice),Validators.required]);


  })
  //pagination
  async onPageSizeChange() {
    this.manufacturedList();
  }
  async onPageChange(page) {
    this.paginationData.currentPage = page;
    this.manufacturedList();
  }

  getAllDrivers() {
    this.api.fetchAllDriversList().then(res => {
      this.driverList = res['_embedded']['driver']
      console.log(this.driverList);
    });
  }
  driverToChanged(driverData) {
    this.selectedDriverObj = driverData;
    if (this.selectedDriverObj?.companyId) {
      this.getlogisticsVehiclesById(driverData?.companyId)
      this.selectedDriverId = driverData?.id;
      this.selectedDriverName = driverData?.name;
      this.selectedDriverMobile = driverData?.mobile;
    }

  }
  vehicleToChanged(vehicleNumber) {
    this.selectedvehicleNumber = vehicleNumber?.vehicleNumber;
    this.selectedVehicleId = vehicleNumber?.id;
  }
  getlogisticsVehiclesById(companyId) {
    this.api.getLogisticsVehiclesById(companyId).then((res: any) => {
      this.vehiclesList = res['_embedded']['vehicles']
    })
  }


  OnchageFromCenter(warehouseList) {
    this.selectedWarehouse = warehouseList;
    console.log(this.selectedWarehouse);

    if (this.selectedWarehouse?.id) {
      this.stockcreateform.get('fromWarehouseId').patchValue(this.selectedWarehouse?.id);
      this.fromAddress = this.selectedWarehouse?.address
    }
  }


  onchangeValue() {
    this.outTonWarningMsg = "";
    let nobales = parseInt(this.stockcreateform.value.numberofbales);
    let stockbales = parseInt(this.selectedStockTransfer);
    if (nobales > stockbales) {
      this.outTonWarningMsg = "Entered value is greater than available bales";
      this._cd.detectChanges();
    }else{
  
      
    }
  }

  OnchageToWarehouse(warehouseList) {
    this.selectedToWarehouse = warehouseList;
    console.log(this.selectedToWarehouse);
    if (this.selectedWarehouse?.id) {
      this.stockcreateform.get('toWarehouseId').patchValue(this.selectedToWarehouse?.name);
      this.toAddress = this.selectedToWarehouse?.address;

    }
  }
  async getWarehouses() {
    this.ngxLoader.start();
    this.api.getWarehouseList().then(details => {
      if (details) {
        this.warehouseList = details['_embedded']['warehouse'];
        this._cd.detectChanges();

      }
      this.ngxLoader.stop();

    }, err => {
      console.log(err);
    });
  }
  //stock creation params
  createStockTransfer() {

    let params = {

      "items": [{
        "type": "MANUFACTURED_COTTON_BALE",
        "itemId": this.selectedBaleLot[0]?.id,
        "quantity": parseInt(this.stockcreateform.value.numberofbales),
        "weight": parseInt(this.stockcreateform?.value?.weight),
      }],
      "startPointId": this.selectedFromWarehouseID,
      "endPointId": this.selectedToWarehouse?.id,
      "shipFrom": "RM_WAREHOUSE",
      "shipTo": "RM_WAREHOUSE",
      "type": "MANUFACTURED_COTTON_BALES",
      "driverId": this.selectedDriverId,
      "vehicleId": this.stockcreateform.value.vehicleId,
      "cgst": 0,
      "sgst": 0,
      "igst": 0,
      "totalCost": this.stockcreateform.value.totalCost,
      "businessVertical": "RESHAFARMS",
      "businessDivision": "COTTONBALES",
      "ewayBillNumber": "FZDXGCHFJ8787",
      "ewayBillImage": this.stockcreateform.value.vehiclceimage,
      "fromAddress": this.fromAddress,
      "toAddress": this.toAddress
    }
    console.log('stok transfer', params);
    this.api.createStockTransfer(params).then(response => {
      this.toaster.success('Stock Transfer Created Successfully', 'Ok', {
        timeOut: 3000,
      })
      this.modalRef.close();
      this.manufacturedList();
      this._cd.detectChanges();
    })


  }
  //stock transfer pop up
  stockTransferPopup(stocktransfer, selectedBaleLot) {
    this.stockcreateform.reset();
    this.selectedStockTransfer = selectedBaleLot.reduce((prv, curr) => curr.availableQuantity + prv, 0);
    this.selectedWeight = selectedBaleLot[0].availableWeight
     this.selectedFromWarehouseID = selectedBaleLot[0].warehouseCurrentLocation.id;
     this.fromAddress = selectedBaleLot[0].warehouseCurrentLocation?.address;
   this.OnchageFromCenter(selectedBaleLot[0].warehouseCurrentLocation);
   // this.stockcreateform.get('fromWarehouseId').disable();
    this.modalRef = this.modalService.open(stocktransfer)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    })
  
    
  
  }
  
  // vehicale image
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
      await this.api.getKYCPresignedUrl(`kyc_farmer`, fileType.split('/')[1], 122, "kyc").then((res: any) => {
        this.calluploadImageToS3APICate(res.targetUrl, file, res.fileName);
        this.imageLoading = false;
      })
    } catch (err) {
      this.stockcreateform.get('vehiclceimage').patchValue('')
      this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this.imageLoading = false;
      this._cd.detectChanges()
    }
  }

  async calluploadImageToS3APICate(s3url: String, file, fileNameFromS3: String) {
    try {
      this.imageLoading = true;
      this._cd.detectChanges()
      await this.api.updateImageToS3Directly(s3url, file).then((res: any) => {
        this.stockcreateform.get('vehiclceimage').patchValue(fileNameFromS3)
        this.imageLoading = false;
        this._cd.detectChanges();
      });
    } catch (err) {
      this.imageLoading = false;
      this.stockcreateform.get('vehiclceimage').patchValue('')
      this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges()
    }
  }


  async onSelectBaleItem(event, item) {
    if (event.target.checked) {
      const found = this.selectedBaleLot.some(el => el.id === item.id);
      if (!found) {
        this.selectedBaleLot.push(item);
      }
    } else {
      const lot = this.selectedBaleLot.findIndex((lotItem) => {
        return lotItem.id === item.id;
      });
      if (lot !== -1) {
        this.selectedBaleLot.splice(lot, 1);
      }
    }


  }
  //filter by current warehouse
  async onChangeWareHouse(event) {
    this.paginationData.currentPage = 0;
    this.selectedStatus = event.target.value;
    this.manufacturedList()
  }
  async onChangeStatus(event) {
    this.paginationData.currentPage = 0;
    this.selectedStatus = event.target.value;
    this.manufacturedList()
  }
  async onSearch() {
    this.paginationData.currentPage = 0;
    this.manufacturedList();
  }
  async onMarkSold() {
    this.globalService.cottonData = this.selectedBaleLot;
    this.router.navigate(['/resha-farms/cotton-bales/sales-crud']);

  }
  buildSerachQuery(searchText: any = this.searchText) {
    const { currentLocation,status } = this.filterForm.value;
    let query = `(`;
    if (searchText) {
      let text = searchText.replace(/ /gi, "*");
      let query: String = `(`;
      (query += `(status=in=${status}`);
      searchText.toString()?.toUpperCase()?.includes('RMCOBLA') && !isNaN(parseInt(searchText.substring(7))) && (query += ` or id==${searchText.substring(7)}`)
      !isNaN(parseInt(searchText)) && (query += ` and id==${searchText}`)
      query += '))';
      return query;
    }
    if (currentLocation) {
      query += `currentLocation.id =in= ${currentLocation} and status=in=${status}`
    } 
    query += ')'

    return query.length <= 2 ? `status=in=${status}` : query;
  }

  manufacturedList() {
    this.api.getAllManufacturedList(this.paginationData, this.buildSerachQuery()).then(res => {
      this.filterList = res['content'];
      this.paginationData.total = res['totalElements'];
      // this.manufacturedDetailes=res['content'][0];
      this._cd.detectChanges();

      console.log('detailes', this.manufacturedDetailes);
      const pagesLength = this.paginationData.total / this.paginationData.pageSize;
      this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
    })
  }
}
