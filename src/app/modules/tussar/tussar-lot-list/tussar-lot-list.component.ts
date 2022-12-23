import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import { info } from 'console';



@Component({
  selector: 'app-tussar-lot-list',
  templateUrl: './tussar-lot-list.component.html',
  styleUrls: ['./tussar-lot-list.component.scss']
})
export class TussarLotListComponent implements OnInit {
  lot;
  modalRef;
  closeResult: string;
  statuses = ['New', 'Sold'];
  searchText;
  isTableLoaded = false;
  lotsData = [];
  selectedLot = [];
  markSoldItem;
  selectedStatus ='(Sold,Available)';
  selectedCocoonType = '(TUSSAR)'
  selectedPaymentStatus ='PENDING';
  markSoldVisible = true;
  fileName= 'cocoon-list.xlsx';
  user;

  // table features
  activeSort = '';
  searchedLots = [];
  filterdLotsList = [];
  paginationData = {
    currentPage : 0,
    pageSize    : 10,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  };

  tableHeader = {
    id: 1,
    farmer: {
      'name': 0,
      'phone': 0
    },
    rmGrade: 0,
    isDisplayActive: 0,
    type: 0,
    lotWeight: 0,
    pricePerKg: 0,
    totalPrice: 0,
    status: 0,
    paymentStatus: 0,
    createdDate: 0,
    center: {
      centerName: 0
    },
    availableQuantity: 0,
    uom: 0
  };
  exportData = [];
  createLogisticsForm: UntypedFormGroup;
  sellingPriceForm: UntypedFormGroup;
  centerList = [];
  warehouseList = [];
  estimationArray = [];
  sellingLotDetails;
  totalElements: any;

  preImgUrl;
  category:UntypedFormGroup;
  countAPIResponse=0;
  countAPIRequest=0;
  userType;
  validationText = '';
  validMessage = '';
  splittedFilterHolder = '(childLots== false and cocoonLotOrigin==FARM)'
  multiRole = [];
  driverList= [];
  vehiclesList= [];
  selectedDriverName;
  selectedDriverMobile;
  selectedvehicleNumber;
  selectedDriverId;
  selectedVehicleId;
  selectedDriverObj;
  updateBankDetials: any;
  disablemarksold: any;
  disableWarningMsg: any;

  constructor(
    private router: Router,
    private api: ApiService,
    private utils: UtilsService,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private _cd: ChangeDetectorRef,
    public globalService: GlobalService,
    private form: UntypedFormBuilder,
    public rolesService: RolesService,
    private ngxLoader : NgxUiLoaderService,
    private $gaService:GoogleAnalyticsService,) {
      this.userType = JSON.parse(localStorage.getItem('_ud'));

    this.categoryPrameter();
    let status = localStorage.getItem('tussarLotStatus');

    localStorage.setItem('tussarLotStatus', '');
    // let cocoonLotTypeFilter =  localStorage.getItem('cocoonLotTypeFilter');
    // localStorage.setItem('cocoonLotTypeFilter', '');
    this.selectedStatus = '(Sold,Available)';
    // this.selectedCocoonType = cocoonLotTypeFilter ? cocoonLotTypeFilter : '(SEEDCOCOON,CBGOLD,BIVOLTINE,TUSSAR)';
    // this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType);
    this.getTussarLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus,);


    this.user = JSON.parse(localStorage.getItem('_ud'));
    this.multiRole = this.user.roles;
    if(this.multiRole.length == 2 && this.multiRole.includes('COperationsAgent') && this.multiRole.includes('COCOON_PROCUREMENT_EXEC') && this.multiRole.includes('COCOON_SALES_EXEC') && this.multiRole.includes('FinanceManager')){
      this.user.role = 'COperationsAgent,COCOON_PROCUREMENT_EXEC,COCOON_SALES_EXEC,FinanceManager'
    }
    this.createFormParams();
    //this.getCenters();
    //this.getWarehouses();
    //this.getAllDrivers();
     }

  ngOnInit(): void {
  }
  createNewTussarLot(){
    localStorage.setItem('tussarLotStatus', this.selectedStatus);
    // localStorage.setItem('cocoonLotTypeFilter', this.selectedCocoonType);
    this.router.navigate(['/resha-farms/tussar/tussar-lot-crud']);
  }
  getAllDrivers(){
    this.api.fetchAllDriversList().then(res=>{
      this.driverList = res['_embedded']['driver']
    });
  }

  driverToChanged(driverData){
    this.selectedDriverObj = driverData;
    if(this.selectedDriverObj?.companyId){
      this.getlogisticsVehiclesById(driverData?.companyId)
      this.selectedDriverId = driverData?.id;
      this.selectedDriverName = driverData?.name;
      this.selectedDriverMobile = driverData?.mobile;
      // vehicleNumber: new FormControl('',[Validators.required]),
      this.createLogisticsForm.get('beneficiaryName').patchValue(this.selectedDriverObj?.bankDetails[0]?.beneficiaryName);
      this.createLogisticsForm.get('bankName').patchValue(this.selectedDriverObj?.bankDetails[0]?.bankName);
      this.createLogisticsForm.get('accountNumber').patchValue(this.selectedDriverObj?.bankDetails[0]?.accountNumber);
      this.createLogisticsForm.get('ifscCode').patchValue(this.selectedDriverObj?.bankDetails[0]?.ifscCode);
    }

  }
  vehicleToChanged(vehicleNumber){
    this.selectedvehicleNumber = vehicleNumber?.vehicleNumber;
    this.selectedVehicleId = vehicleNumber?.id;
  }

  getlogisticsVehiclesById(companyId){
    this.api.getLogisticsVehiclesById(companyId).then((res:any)=>{
      this.vehiclesList = res['_embedded']['vehicles']
    })
  }

  exportexcel(): void {
    let element = this.exportData;
       const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
  }
  async onSelectAll(event){
    this.lotsData.forEach(cocoon => {
      cocoon.selected = event.target.checked;
    });
    if (event.target.checked) {
      this.selectedLot = this.lotsData;
    } else {
      this.selectedLot = [];
    }
  }

  async onSelectCocoon(event, cocoon){
      if (event.target.checked) {
        const found = this.selectedLot.some(el => el.id === cocoon.id);
        
        if (!found) {
          this.selectedLot.push(cocoon);
          // let UnMatchedstatus =this.selectedLot.find(ele=>ele.status == 'New');
          // if (UnMatchedstatus) {
          //     this.disablemarksold = 'true';
          //     this.disableWarningMsg = " 'New' Lots Cannot be Mark Sold"              
          // } 
        }
      } else {
        const lot = this.selectedLot.findIndex((lotItem) => {
          return lotItem.id === cocoon.id;
        });
        if (lot !== -1){
          this.selectedLot.splice(lot, 1);
        }
      } 
  }

  async getTussarLotsList(page, size, column, direction, status,) {
    this.lotsData = [];
    this.exportData = [];
    this.ngxLoader.stop();
    this.api.getAllTussarList(page, size, column, direction, status).then(res => {
      console.log('tussar list',res)
      this.totalElements = res['totalElements'];
      if (res && res['content']) {
        res['content'].forEach(element => {
          this.lotsData.push({
            selected: false,
            id: element.id,
            code: element.code,
            farmerName: element?.farmerName? element?.farmerName : '-',
            farmerPhone: element?.farmerPhone? element?.farmerPhone : '-',
            centerName: element?.centerName? element?.centerName : '-',
            rmGrade: element.rmGrade,
            receivedUnits: element.receivedUnits,
            availableQuantity: element.availableQuantity ? element.availableQuantity : '0',
            tussarlogisticsCost: element?.farmer?.center?.cocoonLotLogisticsCostPerKg ? element?.farmer?.center?.cocoonLotLogisticsCostPerKg : '-',
            rateperTussarPeice: element.ratePerPiece,
            grossTotalTussar:element.grossTotalAmount,
            status: element.status,
            uom: element.uom ? element.uom: '-',
            tussarlastModifiedDate: element.createdDate ? this.utils.getDisplayTime(element.createdDate) : '-',
            lotWeight: element.receivedQuantity ? element.receivedQuantity.toFixed(2) : 0,
            pricePerKg: element.pricePerKg ? element.pricePerKg : 0,
            displayPricePerKg: element.pricePerKg ? (element.pricePerKg.toFixed(2))?.toLocaleString('en-IN') : '-',
            totalPrice: element.totalPrice ? element.totalPrice : 0,
            displayTotalPrice: element.totalPrice ? (element.totalPrice)?.toLocaleString('en-IN') : '-',
            paymentStatus: element.paymentStatus ? element.paymentStatus : '-',
            invoiceURL: element.invoiceURL ? element.invoiceURL : null,
            sortCreatedDate: element.createdDate ? element.createdDate : 0,
            lot: element ? element : '-',
            record:element,
            receivedWeightPricePerKg: element.receivedWeightPricePerKg ? element.receivedWeightPricePerKg : element.pricePerKg,
            displayReceivedWeightPricePerKg: element.receivedPricePerPc ? element.receivedPricePerPc?.toLocaleString('en-IN') : element.pricePerKg?.toLocaleString('en-IN')
          });
        });
        this.refreshTable(this.lotsData);
        console.log(this.lotsData);
        this._cd.detectChanges();
      }
    });
  }

  async onPageChange(page) {
    this.paginationData.currentPage = page;
    if(this.enableSearch){

      let searchParams = `((status=in=${this.selectedStatus}) and type=in=${this.selectedCocoonType} and (farmer.name==*${this.searchText.replace(/ /gi,"*")}* or farmer.phone==*${this.searchText.replace(/ /gi,"*")}* or center.centerName==*${this.searchText.replace(/ /gi,"*")}*))`;
      this.afterSearch(page, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, searchParams)
    } else {
      // this.getCocoonLotsList(page, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus, this.selectedCocoonType)
      this.getTussarLotsList(page, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus,)
    }
  }

  async refreshTable(reelerList) {
    this.filterdLotsList = [];
    this.paginationData.total = this.totalElements;
    const pagesLength = this.totalElements / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
    this.filterdLotsList = reelerList;
    this.retainSelectedState();
    this._cd.detectChanges();
  }

  retainSelectedState() {
    for(let i=0;i<this.filterdLotsList.length;i++) {
      const found = this.selectedLot.some(el => el.id === this.filterdLotsList[i].id);
        if (found) {
          this.filterdLotsList[i].selected = true;
          this._cd.detectChanges();
        } else {
          this.filterdLotsList[i].selected = false;
          this._cd.detectChanges();
        }
    }
    this._cd.detectChanges();
  }

  textSearch;
  enableSearch: boolean = false;
  idParam;

  async onSearchKey(e){
    this.textSearch = e.target.value;
    if(this.textSearch.length > 1){
      this.enableSearch = true;
    } else if(this.textSearch.length < 1) {
        this.enableSearch = false;
        this.searchedLots = [];
        this.paginationData.currentPage = 0; 
        if (this.selectedStatus === '(Sold)' || this.selectedStatus === '(Available)') {
          // this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType);
          this.getTussarLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus,);

    
        } else {
          // this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', false, this.selectedCocoonType);
          this.getTussarLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus);

        }
    }
  }

  async onSearch() {
    this.paginationData.currentPage = 0;
    if(isNaN(this.searchText)){
      if(this.searchText.includes('RMLOT')&&!isNaN(this.searchText.substring(5))){
        this.searchText = this.searchText.substring(5);
          this.idParam =  `or id==${this.searchText}`;
      } else {
        this.idParam = '';
      }
    } else {
      this.idParam =  `or id==${this.searchText}`;
    }
    let searchParams = `((status=in=${this.selectedStatus}) and type=in=${this.selectedCocoonType} and (farmer.name==*${this.searchText.replace(/ /gi,"*")}* or farmer.phone==*${this.searchText.replace(/ /gi,"*")}* or center.centerName==*${this.searchText.replace(/ /gi,"*")}* ${this.idParam}))`;
    this.afterSearch(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, searchParams)

  }

  appWeavers: any;
  afterSearch(page, size, column, direction, searchParams){
    this.ngxLoader.stop();
    this.api.searchTussarLot(page, size, column, direction, searchParams).then(res => {
      this.totalElements = res['totalElements'];

      this.lotsData = [];
      this.searchedLots = [];
      this.appWeavers = res['content'];
         this.appWeavers.forEach(element => {

          this.searchedLots.push({
            selected: false,
            id: element.id,
            code: element.code,
            farmerName: element?.farmerName? element?.farmerName : '-',
            farmerPhone: element?.farmerPhone? element?.farmerPhone : '-',
            centerName: element?.centerName? element?.centerName : '-',
            rmGrade: element.rmGrade,
            receivedUnits: element.receivedUnits,
            availableQuantity: element.availableQuantity ? element.availableQuantity : '0',
            tussarlogisticsCost: element?.farmer?.center?.cocoonLotLogisticsCostPerKg ? element?.farmer?.center?.cocoonLotLogisticsCostPerKg : '-',
            rateperTussarPeice: element.ratePerPiece,
            grossTotalTussar:element.grossTotalAmount,
            status: element.status,
            uom: element.uom ? element.uom: '-',
            tussarlastModifiedDate: element.createdDate ? this.utils.getDisplayTime(element.createdDate) : '-',
            lotWeight: element.receivedQuantity ? element.receivedQuantity.toFixed(2) : 0,
            pricePerKg: element.pricePerKg ? element.pricePerKg : 0,
            displayPricePerKg: element.pricePerKg ? (element.pricePerKg.toFixed(2))?.toLocaleString('en-IN') : '-',
            totalPrice: element.totalPrice ? element.totalPrice : 0,
            displayTotalPrice: element.totalPrice ? (element.totalPrice)?.toLocaleString('en-IN') : '-',
            paymentStatus: element.paymentStatus ? element.paymentStatus : '-',
            invoiceURL: element.invoiceURL ? element.invoiceURL : null,
            sortCreatedDate: element.createdDate ? element.createdDate : 0,
            lot: element ? element : '-',
            record:element,
            receivedWeightPricePerKg: element.receivedWeightPricePerKg ? element.receivedWeightPricePerKg : element.pricePerKg,
            displayReceivedWeightPricePerKg: element.receivedPricePerPc ? element.receivedPricePerPc?.toLocaleString('en-IN') : element.pricePerKg?.toLocaleString('en-IN')
          })
        });
         setTimeout(() => {
           this.refreshTable(this.searchedLots);
         }, 100);
       })
  }

  async onSort(column) {
    this.activeSort = column;
    this.paginationData.currentColumn = column;
    if (this.tableHeader[column] === 0) {
      this.paginationData.currentDirection = 'desc';
      this.tableHeader[column] = 1;
    } else {
      this.paginationData.currentDirection = 'asc';
      this.tableHeader[column] = 0;
    }
    if(this.enableSearch){
      let searchParams = `((status=in=${this.selectedStatus}) and type=in=${this.selectedCocoonType} and (farmer.name==*${this.searchText.replace(/ /gi,"*")}* or farmer.phone==*${this.searchText.replace(/ /gi,"*")}* or center.centerName==*${this.searchText.replace(/ /gi,"*")}*))`;
      this.afterSearch(0, this.paginationData.pageSize, column, this.paginationData.currentDirection, searchParams)
    } else {
      // this.getCocoonLotsList(0, this.paginationData.pageSize, column, this.paginationData.currentDirection, this.selectedStatus, this.selectedCocoonType)
      this.getTussarLotsList(0, this.paginationData.pageSize, column, this.paginationData.currentDirection, this.selectedStatus,)


    }
     this.activeSort = column;
     this.paginationData.currentPage = 0;
  }
 
  async onPageSizeChange() {
    // this.getCocoonLotsList(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus, this.selectedCocoonType)
    this.getTussarLotsList(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus,)


  }
  formatPrice(price){
    const formatPrice = price.replace(/[, ]+/g, "").trim();
    return +formatPrice;
  }

  async onChangeRole(event) {
    this.paginationData.currentPage = 0;
    this.searchText = '';
    this.selectedLot = [];
    this.selectedStatus = event.target.value;
    localStorage.setItem('tussarLotStatus', this.selectedStatus);    
    // this.getCocoonLotsList(0, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType);
    // this.getTussarLotsList(0, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus);
    this.getTussarLotsList(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus);


  }


  onChangeSplitedFilterHolder(event){
    this.splittedFilterHolder = event.target.value;
    if (this.selectedStatus === '(New, Sold)') {
      // this.getCocoonLotsList(0, this.paginationData.pageSize, 'createdDate', 'desc', false, this.selectedCocoonType);
      this.getTussarLotsList(0, this.paginationData.pageSize, 'createdDate', 'desc', false);

    } else {
      // this.getCocoonLotsList(0, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType);
      this.getTussarLotsList(0, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus);

    }
  }

  async open(content, item, index) {
    this.lot = item;
    this.lot.index = index;
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  async deleteTussar() {
    this.modalRef.close();
    this.ngxLoader.stop();
    this.api.deleteTussarLot(this.lot.id).then(resp => {
    this.getTussarLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus);
      this._cd.detectChanges();
      this.snackBar.open(this.lot.code + ' deleted successfully', 'Ok', {
        duration: 3000
      });
    }).catch(err => {
      console.error(err);
      this.snackBar.open('Failed to delete lot ' + this.lot.code, 'Ok', {
        duration: 3000
      });
    });
  }

  

  async editLot(lot) {
    localStorage.setItem('tussarLotStatus', this.selectedStatus);
    // localStorage.setItem('cocoonLotTypeFilter', this.selectedCocoonType);
    this.router.navigate(['/resha-farms/tussar/tussar-lot-crud', lot.id]);
  }

  async onMarkSold() {
    localStorage.setItem('tussarLotStatus', this.selectedStatus);
    // localStorage.setItem('cocoonLotTypeFilter', this.selectedCocoonType);
    this.globalService.tempValueData = this.selectedLot;
    this.router.navigate(['/resha-farms/tussar/tussar-lot-mark-sold']);
  }

  async createFormParams(){

    this.createLogisticsForm = this.form.group({
      totalCost: new UntypedFormControl('', [Validators.required]),
      // driverName: new FormControl('',[Validators.required]),
      // driverNumber: new FormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
      // vehicleNumber: new FormControl('',[Validators.required]),
      beneficiaryName: new UntypedFormControl('',[Validators.required]),
      bankName: new UntypedFormControl('',[Validators.required]),
      accountNumber: new UntypedFormControl('', [Validators.required]),
      ifscCode: new UntypedFormControl('', [Validators.required]),
      center: new UntypedFormControl('', [Validators.required]),
      shipToType: new UntypedFormControl('RM_CENTER', [Validators.required]),
      toCenterId: new UntypedFormControl(''),
      toWarehouse: new UntypedFormControl(''),
      ewayBillNo: new UntypedFormControl(''),
      toCenterAddress: new UntypedFormControl('')
    });

    this.sellingPriceForm = this.form.group({
      sellingPricePerKg: new UntypedFormControl(''),
      sellWeight: new UntypedFormControl(''),
    });
  }

  // openLogisticsForm(logisticForm) {
  //   this.category.reset();
  //   this.createFormParams();
  //   this.preImgUrl=null;
  //   (this. category.controls['baseList'] as FormArray).clear()
  //   this.addCategory(1);
  //   this.modalRef = this.modalService.open(logisticForm)
  //   this.modalRef.result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed`;
  //   });
  // }

  changeshipto(value){
    this.createLogisticsForm.get('shipToType').patchValue(value);
  }

  async getCenters() {
    this.ngxLoader.stop();
    this.api.getCentersList().then(details => {
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }

  async getWarehouses() {
    this.ngxLoader.stop();
    this.api.getWarehouseList().then(details => {
      if (details) {
        this.warehouseList = details['_embedded']['warehouse'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }

  checkIfCenterSame() {
    if(this.createLogisticsForm.value.toCenterId != this.createLogisticsForm.value.center) {
      this.createLogisticsForm.get('toCenterAddress').patchValue('');
    }
  }

  dispatchLots(form) {
   
    this.updateBankDetials = form
    let coconLots =[];
    for(let i=0; i<this.selectedLot.length; i++) {
      coconLots.push('/cocoonlot/' + this.selectedLot[i].id)
    }
    let param = {
      isOutOfBand: true,

      logistics: {
      driverName: this.selectedDriverName,
      driverNumber: this.selectedDriverMobile,
      vehicleNumber: this.selectedvehicleNumber,
      totalCost: +form.totalCost,
      dispatchTime: Date.parse(new Date().toString()),
      bank: {
        beneficiaryName: form.beneficiaryName,
        bankName: form.bankName,
        accountNumber: form.accountNumber.trim(),
        ifscCode: form.ifscCode.trim(),
      }
      },
      cocoonLots: coconLots,
      shipToType:form.shipToType,
      center: '/center/' + form.center,
      toCenter: '/center/' + form.toCenterId,
      toWarehouse:'/warehouse/'+ form.toWarehouse,
      toCenterAddress: form.toCenterAddress ? form.toCenterAddress : null
    }
    let remSalesImages = [];
    param['ewayBillNo'] = this.createLogisticsForm.get('ewayBillNo').value;
    param['ewayBillImage'] = this.preImgUrl;
        for(let i=0;i<this.category.value.baseList.length;i++){
          remSalesImages.push({
            "tag":this.category.value.baseList[i].tag ,
            "url": this.category.value.baseList[i].imageUrl
          })
        }
    param['cocoonLotLogisticImages']= remSalesImages;
    if(param['shipToType'] == "RM_CENTER"){
      delete param['toWarehouse'];
    }else if(param['shipToType'] == "RM_WAREHOUSE"){
      delete param['toCenter'];
    }
    this.ngxLoader.stop();
    this.api.dispatchCocoonLots(param).then(res => {
      let LogisticDispatchOrder;

      this.selectedLot = [];
      this.modalRef.close();
      this.createLogisticsForm.reset();
      // this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType);
      this.getTussarLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus);


      this.snackBar.open('Lot dispatched successfully', 'Ok', {
        duration: 3000
      });
      
      this.updateDriverDetailsById();



      if(param['shipToType'] == "RM_CENTER"){
        LogisticDispatchOrder = {
          "shipmentId": res["id"],
          "dispatchOrderType": "COCOON_LOTS",
          "startPointId": form.center,
          "endPointId": form.toCenterId,
          "shipFrom" : "RM_CENTER",
          "shipTo" : "RM_CENTER",
          "driver": "/driver/" +  this.selectedDriverId,
          "vehicle":"/vehicle/" + this.selectedVehicleId
        }

      }else if(param['shipToType'] == "RM_WAREHOUSE"){
        LogisticDispatchOrder = {
          "shipmentId": res["id"],
          "dispatchOrderType": "COCOON_LOTS",
          "startPointId": form.center,
          "endPointId": form.toWarehouse,
          "shipFrom" : "RM_CENTER",
          "shipTo" : "RM_WAREHOUSE",
          "driver": "/driver/" +  this.selectedDriverId,
          "vehicle":"/vehicle/" + this.selectedVehicleId
        }
      }

      // this.api.dispatchCocoonLots(LogisticDispatchOrder).then(res=>{
      //   this.selectedLot = [];
      //   this.modalRef.close();
      //   this.createLogisticsForm.reset();
      //   this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType);
      //   this.snackBar.open('Lot dispatched successfully', 'Ok', {
      //     duration: 3000
      //   });
      //   this.updateDriverDetailsById();
      // })

    }, err => {
      this.snackBar.open('Failed to dispatch lots', 'Ok', {
        duration: 3000
      });
    })
  }

  updateDriverDetailsById(){
    let payload = {
      "bankDetails": [{
        "beneficiaryName": this.updateBankDetials?.beneficiaryName,
        "bankName": this.updateBankDetials?.bankName,
        "accountNumber": this.updateBankDetials?.accountNumber.trim(),
        "ifscCode": this.updateBankDetials?.ifscCode.trim()
      }],
    }
    this.api.updateSingleDriverById(this.selectedDriverObj?.id,payload).then((res:any)=>{
      this._cd.detectChanges();
      this.getAllDrivers();
    })
  }

  createEstimate() {
    let estimationObj = {
      pricePerKg: 0,
      totalWeight: 0,
      totalCost: 0,
      logisticCost: 0,
      estimatedPrice: 0,
      lots: [],
      estimatedPricePerKg: 0
    };

    for (let i = 0; i < this.selectedLot.length; i++) {
      estimationObj.pricePerKg += this.selectedLot[i].totalPrice;
      estimationObj.totalWeight += +this.selectedLot[i].availableQuantity;
      estimationObj.logisticCost += this.selectedLot[i].logisticsCost;
      estimationObj.lots.push(this.selectedLot[i].code);
    }
    estimationObj.pricePerKg = (estimationObj.pricePerKg + estimationObj.logisticCost) / estimationObj.totalWeight;
    estimationObj.totalCost = (estimationObj.pricePerKg * estimationObj.totalWeight) + estimationObj.logisticCost;
    estimationObj.estimatedPricePerKg = (estimationObj.pricePerKg * 0.05) + estimationObj.pricePerKg;
    estimationObj.estimatedPrice = (estimationObj.estimatedPricePerKg * estimationObj.totalWeight) + estimationObj.logisticCost;
    this.estimationArray.push(estimationObj);
  }

  clearEstimate(i) {
    this.estimationArray.splice(i, 1)
  }

  deleteRecord(i) {
    this.selectedLot.splice(i, 1);
    this.retainSelectedState();
  }

  lotDetail(lot) {
    localStorage.setItem('tussarLotStatus', this.selectedStatus);
    // localStorage.setItem('cocoonLotTypeFilter', this.selectedCocoonType);
    this.router.navigate(['/resha-farms/tussar/tussar-lot-details', lot.id]);
  }

  markSoldConfirmation(item, content) {
    this.markSoldItem = item;
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  markAsSold() {
    const sp = {
      paymentStatus: 'Paid'
    }
    this.api.patchTussarLotById(this.markSoldItem.id, sp).then(res => {
      this.getTussarLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus);
      this.modalRef.close();
      this.snackBar.open('Paid Suceessfully', 'Ok', {
        duration: 3000
      });
    })

  }
  markActiveForSell(lot, sellingForm) {
    this.sellingLotDetails = lot;
    this.sellingLotDetails.total = 0;
    this.sellingLotDetails.wastageQty = 0;
    this.sellingLotDetails.sellWeight = this.sellingLotDetails.availableQuantity - Math.round(this.sellingLotDetails.availableQuantity / 100);
    this.sellingLotDetails.sellWeight = Math.round((this.sellingLotDetails.sellWeight) + Number.EPSILON)*100/100;
    let sp = lot.pricePerKg + (lot.logisticsCost > 0 ? lot.logisticsCost / lot.lot.lotWeight : 0);
    let uptikSp = sp + Math.round((sp * 0.05) + Number.EPSILON)*100/100;
    this.sellingLotDetails.minPrice = Math.round(uptikSp + Number.EPSILON)*100/100;
    this.sellingPriceForm.get('sellingPricePerKg').patchValue(Math.round(uptikSp + Number.EPSILON)*100/100);
    this.sellingPriceForm.get('sellWeight').patchValue(this.sellingLotDetails.sellWeight);
    this.sellingLotDetails.total = this.sellingPriceForm.value.sellingPricePerKg * this.sellingPriceForm.value.sellWeight;
    this.sellingLotDetails.displayTotal =  this.sellingLotDetails.total?.toLocaleString('en-IN');
    this._cd.detectChanges();
    if(lot.isDisplayActive) {
      this.modalRef = this.modalService.open(sellingForm);
      this.modalRef.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed`;
      });
    } else {
      this.showHideLot(this.sellingLotDetails, {disable: true});
    }
  }

  onValueChangesOfSellingPrice() {
    this.sellingLotDetails.wastageQty = 0;
    this.sellingLotDetails.wastageQty = this.sellingLotDetails.availableQuantity - this.sellingPriceForm.get('sellWeight').value;
    this.sellingLotDetails.wastageQty =Math.round((this.sellingLotDetails.wastageQty + Number.EPSILON) * 100) / 100
    if(this.sellingPriceForm.value.sellingPricePerKg && this.sellingPriceForm.value.sellingPricePerKg > 0) {
      this.sellingLotDetails.total = this.sellingPriceForm.value.sellingPricePerKg * this.sellingPriceForm.value.sellWeight;
      this.sellingLotDetails.total = Math.round(this.sellingLotDetails.total + Number.EPSILON)*100/100
      this.sellingLotDetails.displayTotal =  this.sellingLotDetails.total?.toLocaleString('en-IN');
    } else {
      this.sellingLotDetails.total = 0;
      this.sellingLotDetails.displayTotal = '0';
    }
  }

  showHideLot(item, form) {
    let param = {};
    if(form.disable) {
      param = {
        isDisplayActive : false
      }
    } else {
      param = {
        isDisplayActive : true,
        askingPricePerKg: form.sellingPricePerKg,
        askingWeight: form.sellWeight
      }
    }
    this.ngxLoader.stop();
    this.api.updateTussarLotById(item.id, param).then(res => {
      if(this.modalRef) {
        this.modalRef.close();
      }
      // this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType);
      this.getTussarLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus);



      this.snackBar.open(item.code + ' Updated successfully', 'Ok', {
        duration: 3000
      });
    }, err => {
      this.snackBar.open('Could not update, Please try again', 'Ok', {
        duration: 3000
      });
    })
  }

  onCancel() {
    this.sellingPriceForm.reset();
    this.modalRef.close();
    // this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType);
    this.getTussarLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus);

  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.createLogisticsForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.createLogisticsForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  isControlValidForReeler(controlName: string): boolean {
    const control = this.createLogisticsForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  controlHasErrorForSellingPrice(validation, controlName): boolean {
    const control = this.sellingPriceForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  onImageUpload(image) {
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        let previewImage = reader.result as string;
        this.getS3Url(file.type,file);
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file)
      this._cd.detectChanges();
    }
  }
  async calluploadImageToS3API(s3url:String,file,fileNameFromS3:String){
    try{
      this._cd.detectChanges()
      await this.api.updateImageToS3Directly(s3url,file).then(res=>{
        this.preImgUrl = fileNameFromS3
        this._cd.detectChanges();
        })
    }catch(err){
        this.snackBar.open('Image upload Failed', 'Ok', {
          duration: 3000
        });
        this._cd.detectChanges()
    }
  }
  async getS3Url(fileType,file){
    try{
      this._cd.detectChanges()
      await this.api.getCocoonLotLogistics_BiilsS3Url(fileType.split('/')[1]).then((res:S3UrlResponse)=>{
        //this.preImgUrl = res.fileName
        this.calluploadImageToS3API(res.targetUrl,file,res.fileName);
     })
    }catch(err){
      this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges()
    }
  }

  async categoryPrameter(){
    this.category = this.form.group({
      baseList: new UntypedFormArray([
      ])
    });
  }
  addCategory(index){
    (this. category.controls['baseList'] as UntypedFormArray).push(new UntypedFormGroup({
      tag:new UntypedFormControl(''),
      imageUrl:new UntypedFormControl(''),
    }));
  }

  deleteCategory(index){
    (this. category.controls['baseList'] as UntypedFormArray).removeAt(index)
  }


  listenForImageComponent(data){
    const {fileType,file,index} =data;
    this.getS3CatUrl(fileType,file,index);
  }

  async calluploadImageToS3APICate(s3url:String,file,fileNameFromS3:String,index){
   try{
     this.countAPIRequest++;
     this._cd.detectChanges()
     await this.api.updateImageToS3Directly(s3url,file).then(res=>{
       (this.category.get('baseList') as UntypedFormArray).controls[index].get('imageUrl').patchValue(fileNameFromS3);
       this.countAPIResponse++;
       this._cd.detectChanges();
       })
   }catch(err){
       this.countAPIResponse++;
       (this.category.get('baseList') as UntypedFormArray).controls[index].get('imageUrl').patchValue('');
       this.snackBar.open('Image upload Failed', 'Ok', {
         duration: 3000
       });
       this._cd.detectChanges()
   }
 }

 async getS3CatUrl(fileType,file,index){
   try{
     this.countAPIRequest++;
     this._cd.detectChanges()
     await this.api.getCocoonLotLogistics_BiilsS3Url(fileType.split('/')[1]).then((res:S3UrlResponse)=>{
       this.calluploadImageToS3APICate(res.targetUrl,file,res.fileName,index);
       this.countAPIResponse++;
    })
   }catch(err){
     (this.category.get('baseList') as UntypedFormArray).controls[index].get('imageUrl').patchValue('');
     this.snackBar.open('Image upload Failed', 'Ok', {
       duration: 3000
     });
     this.countAPIResponse++;
     this._cd.detectChanges()
   }

 }

 openMarkAsSold(content, item) {
  this.markSoldItem = item;
  console.log(item);

  this.validMessage  = 'wastage ' + this.markSoldItem.availableQuantity + item.uom;
  console.log(this.validMessage);

    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
 }

 markLotAsSold() {
   let param = {
    status: 'Sold',
    wastageQuantity: parseInt(this.markSoldItem.availableQuantity),
    availableQuantity: 0
   }
   this.api.updateTussarLotById(this.markSoldItem.id, param).then(res => {
    this.$gaService.event('Cocoon mark sold with wastage', this.markSoldItem.id);

     this.validationText = '';
    // this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType);
    this.getTussarLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus);

    this.modalRef.close();
    this.snackBar.open('Cocoon lot updated successfully', 'Ok', {
      duration: 3000
    });
   })
 }

 routeToSplitScreen(){
   console.log(this.selectedLot);

  this.router.navigate(['/resha-farms/bid/cocoon-spliting'],{ queryParams: {selectedLot:JSON.stringify(this.selectedLot)}})
 }

 validateLotIds(){
  // let UnMatchedstatus =this.selectedLot.find(ele=>ele.status == 'New');
  // if (UnMatchedstatus) {
  //   alert('Select Cocoon Lots with Status Avilable To Mark Sold');
  //   this.disablemarksold
  //   // this.selectedLot = [];
  // } else{
    // this.api.validateLotIds(this.selectedLot.map(ele=>ele=ele.id)).then((res:any)=>{
    //   if(res?.responseCode == 200&&!res?.data.length){
    //    this.onMarkSold();
    //   }
    // }).catch(err=>{
    //    this.snackBar.open(err?.error?.data?.toString()+ '  ' +err?.error?.message, 'Ok', {
    //      duration: 8000
    //    });
    // });

    this.onMarkSold();
  
   
  

 }

 tussarlotsData = [];
 exportTussarData = [];
 filterdTussarLotsList = [];

 async refreshTussarTable(tussarreelerList) {
  this.filterdTussarLotsList = [];
  this.paginationData.total = this.totalElements;
  const pagesLength = this.totalElements / this.paginationData.pageSize;
  this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
  this.filterdTussarLotsList = tussarreelerList;
  this.retainTussarSelectedState();
  this._cd.detectChanges();
}

retainTussarSelectedState() {
  for(let i=0;i<this.filterdTussarLotsList.length;i++) {
    const found = this.selectedLot.some(el => el.id === this.filterdTussarLotsList[i].id);
      if (found) {
        this.filterdTussarLotsList[i].selected = true;
        this._cd.detectChanges();
      } else {
        this.filterdTussarLotsList[i].selected = false;
        this._cd.detectChanges();
      }
  }
  this._cd.detectChanges();
}

async delete() {
  this.modalRef.close();
  this.ngxLoader.stop();
  this.api.deleteTussarLot(this.lot.id).then(resp => {
  this.getTussarLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus,);
    this._cd.detectChanges();
    this.snackBar.open(this.lot.code + ' deleted successfully', 'Ok', {
      duration: 3000
    });
  }).catch(err => {
    console.error(err);
    this.snackBar.open('Failed to delete lot ' + this.lot.code, 'Ok', {
      duration: 3000
    });
  });
}

}
export interface S3UrlResponse{
  targetUrl: String
  fileName:String
}

