import { ChangeDetectorRef, Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-cocoon-list',
  templateUrl: './cocoon-list.component.html',
  styleUrls: ['./cocoon-list.component.scss']
})
export class CocoonListComponent implements OnInit {

  loading:Boolean=false;
  lot;
  modalRef;
  closeResult: string;
  statuses = ['New', 'Sold'];
  searchText;
  isTableLoaded = false;
  lotsData = [];
  selectedLot = [];
  markSoldItem;
  selectedStatus ='(New,Sold,Intransit,Available)';
  selectedCocoonType = '(SEEDCOCOON,CBGOLD,BIVOLTINE)'
  selectedPaymentStatus ='PENDING';
  selectedPaymentType ='(TO_PAY,AWAITING_ACK,Paid,PAYOUT_REQUESTED)';
  markSoldVisible = true;
  fileName= 'cocoon-list.xlsx';
  user;
  salesUptick: any;

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
  createpayoutrequest:UntypedFormGroup;
  sellingPriceForm: UntypedFormGroup;
  payoutForm: UntypedFormGroup;
  centerList = [];
  warehouseList = [];
  estimationArray = [];
  sellingLotDetails;
  totalElements: any;
  item:any;
  i:any;

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
  reelerKhataList: any[];
  planStatus: any;
  planId: any;
  apiSearch: any;
  subscriptionPlan: any;
  selectedpayoutlot: any[];
  totalamount: any;
  payoutResponse: any;
  exixtingLotIds: any;
  exixtingLotIdsMsg: any;
  disableRequestPayout: boolean;
  lotsRequstedPayout: any;
  SaleCenterList: any;
  procCenterlist: any;
  fromAddress: any;
  toAddress: any;
  transPoartTypes: any;
  vehicleCapacityTypes: any[];
  salesRoles =['COCOON_SALES_EXEC','COCOON_SALES_MANAGER','COCOON_SALES_HEAD'];
  salesRoleFound:any;
  sellingPriceUptick: { A_PLUS: number; A: number; B_PLUS: number; B: number; C: number; DOUBLECOCOON: number; JHILLI: number; };
  lotCartItems: any;
  cartLotItemsID: any[];
  showPayoutRequest: any;
  enableC2Ysale: any;
  constructor(
    private api: ApiService,
    private utils: UtilsService,
    private router: Router,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private _cd: ChangeDetectorRef,
    public globalService: GlobalService,
    private form: UntypedFormBuilder,
    public rolesService: RolesService,
    private ngxLoader : NgxUiLoaderService,
    private $gaService:GoogleAnalyticsService,
    private toaster:ToastrService,

  ) {
    this.disableRequestPayout = false;
    this.userType = JSON.parse(localStorage.getItem('_ud'));

    let UserRoleFilter = this.userType.roles.some(i => this.salesRoles.includes(i));
    if (UserRoleFilter) {
      this.salesRoleFound = true;
    } else {
      this.salesRoleFound = false;
    }
    
    this.salesUptick = {
      "A_PLUS": 1,
      "A" : 1,
      "B_PLUS": 1,
      "B" : 1,
      "C":1,
      "DOUBLECOCOON":1,
      "JHILLI":1
    };

    this.sellingPriceUptick = {
      "A_PLUS": 1,
      "A" : 1,
      "B_PLUS": 1,
      "B" : 1,
      "C":1,
      "DOUBLECOCOON":1,
      "JHILLI":1
    };
    this.api.getConfigByConfig('com.reshamandi.v1.cocoon_lot.procurement.payout').then((res:any) => {
      this.showPayoutRequest = JSON.parse(res?.value);
      console.log(this.sellingPriceUptick);
    })

    if(UserRoleFilter || this.userType.role == 'COCOON_SALES_EXEC' || this.userType.role == 'COCOON_SALES_MANAGER'|| this.userType.role == 'COCOON_SALES_HEAD') {

      this.api.getConfigByConfig('com.reshamandi.v1.cocoon_lot.sales.uptick').then((res:any) => {
        this.sellingPriceUptick = JSON.parse(res?.value);
        console.log(this.sellingPriceUptick);
      })
      this.api.getConfigByConfig('com.reshamandi.v1.cocoon_lot.procurement.sales.uptick.a_plus').then((res:any)=> {
        this.salesUptick['A_PLUS'] = res?.value;
        console.log(this.salesUptick);
        
      });
      this.api.getConfigByConfig('com.reshamandi.v1.cocoon_lot.procurement.sales.uptick.a').then((res:any)=> {
        this.salesUptick['A'] = res?.value;
        console.log(this.salesUptick);
        
      });
      this.api.getConfigByConfig('com.reshamandi.v1.cocoon_lot.procurement.sales.uptick.b_plus').then((res:any)=> {
        this.salesUptick['B_PLUS'] = res?.value;
        console.log(this.salesUptick);
        
      });
      this.api.getConfigByConfig('com.reshamandi.v1.cocoon_lot.procurement.sales.uptick.b').then((res:any)=> {
        this.salesUptick['B'] = res?.value;
        console.log(this.salesUptick);
        
      });
      this.api.getConfigByConfig('com.reshamandi.v1.cocoon_lot.procurement.sales.uptick.c').then((res:any)=> {
        this.salesUptick['C'] = res?.value;
        console.log(this.salesUptick);
        
      });
    }
    

    this.categoryPrameter();
    let status = localStorage.getItem('cocoonLotStatus');

    localStorage.setItem('cocoonLotStatus', '');
    let cocoonLotTypeFilter =  localStorage.getItem('cocoonLotTypeFilter');
    localStorage.setItem('cocoonLotTypeFilter', '');
    this.selectedStatus = '(New,Sold,Intransit,Available)';
    this.selectedCocoonType = cocoonLotTypeFilter ? cocoonLotTypeFilter : '(SEEDCOCOON,CBGOLD,BIVOLTINE)';
    this.selectedPaymentType ='(TO_PAY,AWAITING_ACK,Paid,PAYOUT_REQUESTED)';
    this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType,this.selectedPaymentType);
    this.user = JSON.parse(localStorage.getItem('_ud'));
    this.multiRole = this.user.roles;
    if(this.multiRole.length == 2 && this.multiRole.includes('COperationsAgent') && this.multiRole.includes('COCOON_PROCUREMENT_EXEC') && this.multiRole.includes('COCOON_SALES_EXEC') && this.multiRole.includes('FinanceManager')){
      this.user.role = 'COperationsAgent,COCOON_PROCUREMENT_EXEC,COCOON_SALES_EXEC,FinanceManager'
    }
    this.createFormParams();
    this.getCenters();
    this.getWarehouses();
    this.getSalesCenters();
    this.getAllDrivers();
    this.getAllTransportTypes();
    this.getAllVehicleCapacityTypes();
  }

  ngOnInit(): void {
    
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
      // this.createLogisticsForm.get('beneficiaryName').patchValue(this.selectedDriverObj?.bankDetails[0]?.beneficiaryName);
      // this.createLogisticsForm.get('bankName').patchValue(this.selectedDriverObj?.bankDetails[0]?.bankName);
      // this.createLogisticsForm.get('accountNumber').patchValue(this.selectedDriverObj?.bankDetails[0]?.accountNumber);
      // this.createLogisticsForm.get('ifscCode').patchValue(this.selectedDriverObj?.bankDetails[0]?.ifscCode);
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
    this.disableRequestPayout = false;
      if (event.target.checked) {
        const found = this.selectedLot.some(el => el.id === cocoon.id);
        if (!found) {
          this.selectedLot.push(cocoon);
          let UnMatchedstatus =this.selectedLot.find(ele=>ele.status == 'New');
          let UnMatchedCenterType =this.selectedLot.find(ele=>ele.centerType == "PROCUREMENT");
          let splitedLots = this.selectedLot.find(ele=>ele?.lot?.cocoonLotOrigin == "SPLIT");
          let sameCocoonType = this.selectedLot.every( (val, i, Array) => val.type == Array[0].type )
          let currentLocationoflot = this.selectedLot.every((val, i, Array) => val.liveLocationId == Array[0].liveLocationId)

          if (UnMatchedstatus){
              // alert('Select Cocoon Lots with Status Avilable To Mark Sold');
              this.disablemarksold = true;
              this.disableWarningMsg = " 'New' Lots Cannot be Mark Sold"
              // this.selectedLot = [];   
          }
          else if(UnMatchedCenterType){
            this.disablemarksold = true;
            this.disableWarningMsg = "PROCUREMENT Center Lots Cannot be Mark Sold"
          }else if (splitedLots) {
            this.disableRequestPayout = true;
            this.disableWarningMsg = " 'SPLIT' Lots Cannot be Requested for Payout"
          }else if(!currentLocationoflot){
            this.disablemarksold = true;     //---Checking weather lots are in in same sales location--------------------
            this.disableWarningMsg = " Lots Cannot be Mark Sold"
          } else if (sameCocoonType) {
            this.enableC2Ysale = true;            
          }else{
            this.disablemarksold = false;
            this.disableRequestPayout = false;
            this.enableC2Ysale = false;
          }          

        }
      } else {
        const lot = this.selectedLot.findIndex((lotItem) => {
          return lotItem.id === cocoon.id;
        });
        if (lot !== -1){
          this.selectedLot.splice(lot, 1);
          let UnMatchedstatus =this.selectedLot.find(ele=>ele.status == 'New');
          let UnMatchedCenterType =this.selectedLot.find(ele=>ele.centerType == "PROCUREMENT");

          let splitedLots = this.selectedLot.find(ele=>ele?.lot?.cocoonLotOrigin == "SPLIT");
          let currentLocationoflot = this.selectedLot.every( (val, i, Array) => val.liveLocationId == Array[0].liveLocationId )

          if (UnMatchedstatus) {
              // alert('Select Cocoon Lots with Status Avilable To Mark Sold');
              this.disablemarksold = true;
              this.disableWarningMsg = " 'New' Lots Cannot be Mark Sold"
              // this.selectedLot = [];
              
          } else if (splitedLots) {
            this.disableRequestPayout = true;
            this.disableWarningMsg = " 'SPLIT' Lots Cannot be Requested for Payout"
          } else if(UnMatchedCenterType){
            this.disablemarksold = true;
            this.disableWarningMsg = "PROCUREMENT Center Lots Cannot be Mark Sold"
          }else if (!currentLocationoflot) {
            this.disablemarksold = true;
            this.disableWarningMsg = " Lots Cannot be Mark Sold"

          }else{
            this.disablemarksold = false;
            this.disableRequestPayout = false;
          }  
          
          // checking lots every thing same cocoontype
          let sameCocoonType = this.selectedLot.every( (val, i, Array) => val.type === Array[0].type )
          if (sameCocoonType) {
            this.enableC2Ysale = true;
          } else {
            this.enableC2Ysale = false;
          }
          //---Checking weather lots are in in same sales location--------------------
          
          //----------------------------
        }
      }
      console.log(this.selectedLot);
      
  }

  async getCocoonLotsList(page, size, column, direction, status, cocoonType, paymentStatus) {
    this.lotsData = [];
    this.exportData = [];
    this.ngxLoader.stop();
    this.api.getAllCocoonLotByPage(page, size, column, direction, status, cocoonType, paymentStatus, this.splittedFilterHolder).then(res => {
      this.totalElements = res['totalElements'];
      if (res && res['content']) {
        res['content'].forEach(element => {
          
          let displaySalesTotalPrice:any = ((element.totalPrice - element.grossAmount)  + (element.lotWeight * (element.receivedWeightPricePerKg * this.sellingPriceUptick[element.rmGrade] * this.salesUptick[element.rmGrade]) )).toFixed(2);
          console.log(displaySalesTotalPrice);
          this.lotsData.push({
            selected: false,
            id: element.id,
            code: element.code,
            farmerName: element.farmerName? element.farmerName : '-',
            liveLocation: element.location?.rmCenter?.centerName? element.location?.rmCenter?.centerName : '-',
            liveLocationId: element.location?.rmCenter?.id? element.location?.rmCenter?.id : '-',
            liveLocationCenterType: element.location?.locationInfo? element.location?.locationInfo : '-',


            centerType: element.location?.rmCenter?.centerType? element.location?.rmCenter?.centerType : '-',
            farmerPhone: element.farmerPhone? element.farmerPhone : '-',
            centerName: element.centerName ? element.centerName : '-',
            grade: element.grade ? element.grade : '-',
            rmGrade: element.rmGrade ? element.rmGrade : '-',
            type: element.type ? element.type : '-',
            displayCocoonType : element.type ? this.globalService.getDisplayCocoonType(element.type) : '-',
            lotWeight: element.lotWeight ? element.lotWeight.toFixed(2) : 0,
            availableQuantity: element.availableQuantity ? element.availableQuantity.toFixed(2) : 0,
            pricePerKg: element.pricePerKg ? element.pricePerKg : 0,
            displayPricePerKg: element.pricePerKg ? (element.pricePerKg.toFixed(2)).toLocaleString('en-IN') : '-',
            totalPrice: element.totalPrice ? element.totalPrice : 0,
            displayTotalPrice: element.totalPrice ? (displaySalesTotalPrice).toLocaleString('en-IN')  : '-',
            status: element.status ? element.status : '-',
            paymentStatus: element.paymentStatus ? element.paymentStatus : '-',
            invoiceURL: element.invoiceURL ? element.invoiceURL : null,
            lastModifiedDate: element.createdDate ? this.utils.getDisplayTime(element.createdDate) : '-',
            sortCreatedDate: element.createdDate ? element.createdDate : 0,
            lot: element ? element : '-',
            isDisplayActive : element.isDisplayActive ? element.isDisplayActive : false,
            bookings: element.bookings ? element.bookings : 0,
            logisticsCost: element.logisticsCost ? element.logisticsCost.toFixed(2) : 0,
            askingPricePerKg: element.askingPricePerKg,
            askingWeight: element.askingWeight,
            record:element,
            uom: element.uom,
            receivedWeightPricePerKg: element.receivedWeightPricePerKg ? element.receivedWeightPricePerKg : element.pricePerKg,
            displayReceivedWeightPricePerKg: element.receivedWeightPricePerKg ? (element.receivedWeightPricePerKg * this.sellingPriceUptick[element.rmGrade] * this.salesUptick[element.rmGrade]).toFixed(2) : element.pricePerKg.toLocaleString('en-IN'),
            warehouseSplitReceivedWeight:element?.warehouseSplitReceivedWeight ? element?.warehouseSplitReceivedWeight : '-',
            cocoonLotOrigin:element?.cocoonLotOrigin,
          });
        });
        this.refreshTable(this.lotsData);
        this._cd.detectChanges();
      }
    });
  }

  async onPageChange(page) {
    this.paginationData.currentPage = page;
    if(this.enableSearch){

      let searchParams = `((status=in=${this.selectedStatus}) and type=in=${this.selectedCocoonType} and paymentStatus=in=${this.selectedPaymentType} and (farmer.name==*${this.searchText.replace(/ /gi,"*")}* or farmer.phone==*${this.searchText.replace(/ /gi,"*")}* or center.centerName==*${this.searchText.replace(/ /gi,"*")}*))`;

      this.afterSearch(page, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, searchParams)
    } else {
      this.getCocoonLotsList(page, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus, this.selectedCocoonType, this.selectedPaymentType)
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
        if (this.selectedStatus === '(New)' || this.selectedStatus === '(Sold)' || this.selectedStatus === '(Intransit)' || this.selectedStatus === '(Available)') {
          this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType,this.selectedPaymentType);
        } else {
          this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', false, this.selectedCocoonType,this.selectedPaymentType);
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
    let searchParams = `((status=in=${this.selectedStatus}) and type=in=${this.selectedCocoonType} and paymentStatus=in=${this.selectedPaymentType} and (farmer.name==*${this.searchText.replace(/ /gi,"*")}* or farmer.phone==*${this.searchText.replace(/ /gi,"*")}* or center.centerName==*${this.searchText.replace(/ /gi,"*")}* ${this.idParam}))`;
    this.afterSearch(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, searchParams)

  }

  appWeavers: any;
  afterSearch(page, size, column, direction, searchParams){
    this.ngxLoader.stop();
    this.api.searchCocoonLot(page, size, column, direction, searchParams).then(res => {
      this.totalElements = res['totalElements'];

      this.lotsData = [];
      this.searchedLots = [];
      this.appWeavers = res['content'];
         this.appWeavers.forEach(element => {
          let displaySalesTotalPrice:any = ((element.totalPrice - element.grossAmount)  + (element.lotWeight * (element.receivedWeightPricePerKg * this.sellingPriceUptick[element.rmGrade] * this.salesUptick[element.rmGrade]) )).toFixed(2);

          this.searchedLots.push({
            selected: false,
            id: element.id,
            code: element.code,
            farmerName: element.farmerName? element.farmerName : '-',
            liveLocation: element.location?.rmCenter?.centerName? element.location?.rmCenter?.centerName : '-',
            liveLocationId: element.location?.rmCenter?.id? element.location?.rmCenter?.id : '-',
            liveLocationCenterType: element.location?.locationInfo? element.location?.locationInfo : '-',


            centerType: element.location?.rmCenter?.centerType? element.location?.rmCenter?.centerType : '-',
            farmerPhone: element.farmerPhone? element.farmerPhone : '-',
            centerName: element.centerName ? element.centerName : '-',
            grade: element.grade ? element.grade : '-',
            rmGrade: element.grade ? element.rmGrade : '-',
            type: element.type ? element.type : '-',
            displayCocoonType : element.type ? this.globalService.getDisplayCocoonType(element.type) : '-',
            lotWeight: element.lotWeight ? element.lotWeight.toFixed(2) : 0,
            availableQuantity: element.availableQuantity ? element.availableQuantity.toFixed(2) : 0,
            pricePerKg: element.pricePerKg ? element.pricePerKg : 0,
            displayPricePerKg: element.pricePerKg ? (element.pricePerKg.toFixed(2)).toLocaleString('en-IN') : '-',
            totalPrice: element.totalPrice ? element.totalPrice : 0,
            displayTotalPrice: element.totalPrice ? (displaySalesTotalPrice).toLocaleString('en-IN') : '-',
            status: element.status ? element.status : '-',
            paymentStatus: element.paymentStatus ? element.paymentStatus : '-',
            invoiceURL: element.invoiceURL ? element.invoiceURL : null,
            lastModifiedDate: element.createdDate ? this.utils.getDisplayTime(element.createdDate) : '-',
            sortCreatedDate: element.createdDate ? element.createdDate : 0,
            lot: element ? element : '-',
            isDisplayActive : element.isDisplayActive ? element.isDisplayActive : false,
            bookings: element.bookings ? element.bookings : 0,
            logisticsCost: element.logisticsCost? element.logisticsCost.toFixed(2)  : 0,
            askingPricePerKg: element.askingPricePerKg,
            askingWeight: element.askingWeight,
            uom: element.uom,
            record:element,
            receivedWeightPricePerKg: element.receivedWeightPricePerKg ? element.receivedWeightPricePerKg : element.pricePerKg,
            displayReceivedWeightPricePerKg: element.receivedWeightPricePerKg ? (element.receivedWeightPricePerKg * this.sellingPriceUptick[element.rmGrade] * this.salesUptick[element.rmGrade]).toFixed(2) : element.pricePerKg.toLocaleString('en-IN')

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
      this.getCocoonLotsList(0, this.paginationData.pageSize, column, this.paginationData.currentDirection, this.selectedStatus, this.selectedCocoonType, this.selectedPaymentType)
    }
     this.activeSort = column;
     this.paginationData.currentPage = 0;
  }
 
  async onPageSizeChange() {
    this.getCocoonLotsList(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus, this.selectedCocoonType,this.selectedPaymentType)
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
    localStorage.setItem('cocoonLotStatus', this.selectedStatus);
    this.getCocoonLotsList(0, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType,this.selectedPaymentType);
  }

  onChangeCocoonType(cocoonType) {
    this.paginationData.currentPage = 0;
    this.searchText = '';
    this.selectedLot = [];
    this.selectedCocoonType = cocoonType.target.value;
    localStorage.setItem('cocoonLotTypeFilter', this.selectedCocoonType);
    this.getCocoonLotsList(0, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType,this.selectedPaymentType);
  }

  onChangePaymentStatusType(cocoonType) {
    this.paginationData.currentPage = 0;
    this.searchText = '';
    this.selectedLot = [];
    this.selectedPaymentType = cocoonType.target.value;
    localStorage.setItem('cocoonLotTypeFilter', this.selectedPaymentType);
    this.getCocoonLotsList(0, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType,  this.selectedPaymentType);
  }

  onChangeSplitedFilterHolder(event){
    this.splittedFilterHolder = event.target.value;
    if (this.selectedStatus === '(New, Sold)') {
      this.getCocoonLotsList(0, this.paginationData.pageSize, 'createdDate', 'desc', false, this.selectedCocoonType,this.selectedPaymentType);
    } else {
      this.getCocoonLotsList(0, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType,this.selectedPaymentType);
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
  getSubscriptionPlans(paginationData=false,searchText=''){
    this.apiSearch.getAllSubscriptionsData(paginationData,this.buildSerachQuery(searchText)).then(res=>{
        console.log(res);
        this.subscriptionPlan = res['content'];
        this._cd.detectChanges();        
    })
  }

  buildSerachQuery(searchText){
    const text = searchText.replace(/ /gi,"*");
    if(searchText){
      if(!isNaN(searchText)){
        return `(code==*RMDSUBP${searchText}* or deviceName==*${text}* or brand==*${text}* or manufacturer==*${text}* or vendor==*${text}*)`
      }
      if(searchText.includes('RMDSUBP')&&!isNaN(searchText.substring(7))){
        return `(code==*RMDSUBP${searchText.substring(7)}* or deviceName==*${text}* or brand==*${text}* or manufacturer==*${text}* or vendor==*${text}*)`
      }else{
        return `(deviceName==*${text}* or brand==*${text}* or manufacturer==*${text}* or vendor==*${text}*)`
      }
    }
  return ;
 }





  async delete() {
    this.modalRef.close();
    this.ngxLoader.stop();
    this.api.deleteCocoonLot(this.lot.id).then(resp => {
    this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType,this.selectedPaymentType);
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
  

  async createNew() {
    localStorage.setItem('cocoonLotStatus', this.selectedStatus);
    localStorage.setItem('cocoonLotTypeFilter', this.selectedCocoonType);
    this.router.navigate(['/resha-farms/cocoon-lot/crud']);
  }
  async request() {
    
    this.router.navigate(['/resha-farms/cocoon-lot/request-payout']);
  }
  patchPlanStatus(StatusRequest,status,id){
    this.planStatus = status;
    this.planId = id;
    this.modalRef = this.modalService.open(StatusRequest);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed`;
    });
    console.log(status);

  }
  planStatusChangeApi(){
    this.ngxLoader.stop();

    this.api.patchSubscriptionPlan(this.planId,this.planStatus).then(response=>{
      console.log(response);
      
      this.getSubscriptionPlans();
      this.modalRef.close();
    }, error => {
      this.modalRef.close();
      console.log(error);
      
    })
  }

  async editLot(lot) {
    localStorage.setItem('cocoonLotStatus', this.selectedStatus);
    localStorage.setItem('cocoonLotTypeFilter', this.selectedCocoonType);
    this.router.navigate(['/resha-farms/cocoon-lot/crud', lot.id]);
  }

  async onMarkSold() {
    localStorage.setItem('cocoonLotStatus', this.selectedStatus);
    localStorage.setItem('cocoonLotTypeFilter', this.selectedCocoonType);
    this.globalService.tempValueData = this.selectedLot;
    this.router.navigate(['/resha-farms/cocoon-orders/crud']);
  }

  async createFormParams(){

    this.createLogisticsForm = this.form.group({
      totalCost: new UntypedFormControl('', [Validators.required]),
      // driverName: new FormControl('',[Validators.required]),
      // driverNumber: new FormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
      // vehicleNumber: new FormControl('',[Validators.required]),
      // beneficiaryName: new UntypedFormControl('',[Validators.required]),
      // bankName: new UntypedFormControl('',[Validators.required]),
      // accountNumber: new UntypedFormControl('', [Validators.required]),
      // ifscCode: new UntypedFormControl('', [Validators.required]),
      center: new UntypedFormControl('', [Validators.required]),
      fromcenter:new UntypedFormControl('', [Validators.required]),
      selectdriver:new UntypedFormControl('', [Validators.required]),
      SelectVehicle:new UntypedFormControl('', [Validators.required]),
      procenter:new UntypedFormControl('', [Validators.required]),
      shipToType: new UntypedFormControl('RM_CENTER', [Validators.required]),
      toCenterId: new UntypedFormControl(''),
      toWarehouse: new UntypedFormControl(''),
      ewayBillNo: new UntypedFormControl(''),
      toCenterAddress: new UntypedFormControl(''),
      insuranceAvilable: new UntypedFormControl(false),
      insuranceId:new UntypedFormControl(''),
      insuranceProvider:new UntypedFormControl(''),
      transportationType :new UntypedFormControl(''),
      vehicleCapacity:new UntypedFormControl(''),
    });

    this.sellingPriceForm = this.form.group({
      sellingPricePerKg: new UntypedFormControl(''),
      sellWeight: new UntypedFormControl(''),
    });
  }  
  openLogisticsForm(logisticForm) {
    console.log(this.selectedLot);
    
    this.category.reset();
    this.createFormParams();
    this.preImgUrl=null;
    (this. category.controls['baseList'] as UntypedFormArray).clear()
    this.addCategory(1);
    this.modalRef = this.modalService.open(logisticForm)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  changeshipto(value){
    this.createLogisticsForm.get('shipToType').patchValue(value);
  }

  async getCenters() {
    this.ngxLoader.stop();
    this.api.getCocoonProcCenters().then(details => {
      if (details) {
        this.centerList = details['_embedded']['center'];
        this.procCenterlist = details['_embedded']['center'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }
  async getSalesCenters() {
    this.ngxLoader.stop();
    this.api.getCocoonSalesCenters().then(details => {
      if (details) {
        this.SaleCenterList = details['_embedded']['center'];
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

  getAllTransportTypes(){
    this.api.getTransportType().then(response=>{
      this.transPoartTypes = response['content'];
    })
  }

  getAllVehicleCapacityTypes(){
    this.api.getVehicleCapacityType().then(response=>{
      this.vehicleCapacityTypes = response['content'];
      
    })
  }

  checkIfCenterSame() {
    
    
    if(this.createLogisticsForm.value.toCenterId != this.createLogisticsForm.value.center) {
      this.createLogisticsForm.get('toCenterAddress').patchValue('');
    }
  }

  OnchageFromCenter(CenterData) {
    console.log(CenterData);
    
    this.createLogisticsForm.get('center').patchValue(CenterData?.id)
    this.fromAddress = CenterData?.address;
  }
  OnchageToCenter(CenterData) {
    console.log(CenterData);
    if (CenterData != undefined) {
      this.createLogisticsForm.get('toCenterId').patchValue(CenterData?.id)

    } else {
      this.createLogisticsForm.get('toCenterId').patchValue('')

    }
    this.toAddress = CenterData?.address;
  }

  dispatchLots(form) {
   this.loading= true;
    this.updateBankDetials = form
    let coconLots =[];
    for(let i=0; i<this.selectedLot.length; i++) {
      // coconLots.push('/cocoonlot/' + this.selectedLot[i].id)
      console.log(this.selectedLot[i]);
      
      // coconLots.push({"id":this.selectedLot[i].id})
      coconLots.push({
        "type": "COCOON_LOT",
        "itemId": this.selectedLot[i].id,
        "quantity": this.selectedLot[i].lotWeight,
        "unitOfMeasurement": this.selectedLot[i].uom,
        "value": this.selectedLot[i].totalPrice
      })


    }
    // let param = {
    //   isOutOfBand: true,

    //   logistics: {
    //   driverName: this.selectedDriverName,
    //   driverNumber: this.selectedDriverMobile,
    //   vehicleNumber: this.selectedvehicleNumber,
    //   totalCost: +form.totalCost,
    //   dispatchTime: Date.parse(new Date().toString()),
    //   bank: {
    //     beneficiaryName: form.beneficiaryName,
    //     bankName: form.bankName,
    //     accountNumber: form.accountNumber,
    //     ifscCode: form.ifscCode,
    //   }
    //   },
    //   cocoonLots: coconLots,
    //   shipToType:form.shipToType,
    //   // center: '/center/' + form.center,
    //   // toCenter: '/center/' + form.toCenterId,
    //   // toWarehouse:'/warehouse/'+ form.toWarehouse,
    //   center: {"id": form.center},
    //   toCenter: {"id": form.toCenterId},
    //   toWarehouse:{"id": form.toWarehouse},
    //   toCenterAddress: form.toCenterAddress ? form.toCenterAddress : null
    // }
    // let remSalesImages = [];
    // param['ewayBillNo'] = this.createLogisticsForm.get('ewayBillNo').value;
    // param['ewayBillImage'] = this.preImgUrl;
    //     for(let i=0;i<this.category.value.baseList.length;i++){
    //       remSalesImages.push({
    //         "tag":this.category.value.baseList[i].tag ,
    //         "url": this.category.value.baseList[i].imageUrl
    //       })
    //     }
    // param['cocoonLotLogisticImages']= remSalesImages;
    // if(param['shipToType'] == "RM_CENTER"){
    //   delete param['toWarehouse'];
    // }else if(param['shipToType'] == "RM_WAREHOUSE"){
    //   delete param['toCenter'];
    // }

    let param ={
      "items": coconLots,
      "startPointId": parseInt(form.center),
      "endPointId":  parseInt(form.toCenterId),
      "shipFrom": "RM_CENTER",
      "shipTo": "RM_CENTER",
      "type": "COCOON_LOTS",
      "driverId":this.selectedDriverId,
      "vehicleId":this.selectedVehicleId,
      "actualCost": form.totalCost,
      "cgst": 0,
      "sgst": 0,
      "igst": 0,
      "totalCost": form.totalCost,
      "businessVertical": "RESHAFARMS",
      "businessDivision": "COCOON",
      "ewayBillNumber": this.createLogisticsForm.get('ewayBillNo').value,
      "ewayBillImage": this.preImgUrl,
      "fromAddress": this.fromAddress,
      "toAddress": this.toAddress,
      "isInsuranceAvailable":form.insuranceAvilable,
      "insuranceId":form.insuranceId,
      "insuranceProvider":form.insuranceProvider,
      "transportationType":form.transportationType,
      "vehicleCapacityUtilisation":form.vehicleCapacity,
    }
    this.ngxLoader.stop();

    console.log(param);
    
    this.api.dispatchShipmentCocoonLots(param).then(res => {
      this.selectedLot = [];
      this.modalRef.close();
      this.createLogisticsForm.reset();
      this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType,this.selectedPaymentType);
      this.toaster.success('Lot dispatched successfully', 'Ok', {
        timeOut: 3000
      });
      
      
      
      this.updateDriverDetailsById();



      // if(param['shipToType'] == "RM_CENTER"){
      //   LogisticDispatchOrder = {
      //     "shipmentId": res["id"],
      //     "dispatchOrderType": "COCOON_LOTS",
      //     "startPointId": form.center,
      //     "endPointId": form.toCenterId,
      //     "shipFrom" : "RM_CENTER",
      //     "shipTo" : "RM_CENTER",
      //     "driver": "/driver/" +  this.selectedDriverId,
      //     "vehicle":"/vehicle/" + this.selectedVehicleId
      //   }

      // }else if(param['shipToType'] == "RM_WAREHOUSE"){
      //   LogisticDispatchOrder = {
      //     "shipmentId": res["id"],
      //     "dispatchOrderType": "COCOON_LOTS",
      //     "startPointId": form.center,
      //     "endPointId": form.toWarehouse,
      //     "shipFrom" : "RM_CENTER",
      //     "shipTo" : "RM_WAREHOUSE",
      //     "driver": "/driver/" +  this.selectedDriverId,
      //     "vehicle":"/vehicle/" + this.selectedVehicleId
      //   }
      // }

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
      this.loading= false;
    })
  }


  updateDriverDetailsById(){
    let payload = {
      "bankDetails": [{
        "beneficiaryName": this.updateBankDetials?.beneficiaryName,
        "bankName": this.updateBankDetials?.bankName,
        "accountNumber": this.updateBankDetials?.accountNumber,
        "ifscCode": this.updateBankDetials?.ifscCode
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
      receivedWeightPricePerKg: 0,
      totalWeight: 0,
      totalCost: 0,
      logisticCost: 0,
      estimatedPrice: 0,
      sellingWeightCost:0,
      totalPrice:0,
      lots: [],
      estimatedPricePerKg: 0
    };

    for (let i = 0; i < this.selectedLot.length; i++) {
      estimationObj.pricePerKg += this.selectedLot[i].totalPrice;
      estimationObj.totalWeight += +this.selectedLot[i].availableQuantity;
      estimationObj.logisticCost += this.selectedLot[i].logisticsCost;
      estimationObj.sellingWeightCost += (this.selectedLot[i].receivedWeightPricePerKg * this.sellingPriceUptick[this.selectedLot[i].rmGrade] * this.salesUptick[this.selectedLot[i].rmGrade] * this.selectedLot[i].availableQuantity)
      estimationObj.receivedWeightPricePerKg += (this.selectedLot[i].receivedWeightPricePerKg * this.sellingPriceUptick[this.selectedLot[i].rmGrade] * this.salesUptick[this.selectedLot[i].rmGrade])
      estimationObj.totalPrice += (this.selectedLot[i].availableQuantity * this.selectedLot[i].receivedWeightPricePerKg * this.sellingPriceUptick[this.selectedLot[i].rmGrade] * this.salesUptick[this.selectedLot[i].rmGrade])
      estimationObj.lots.push(this.selectedLot[i].code);
    }
    estimationObj.pricePerKg = (estimationObj.pricePerKg + estimationObj.logisticCost) / estimationObj.totalWeight;
    estimationObj.totalCost = (estimationObj.pricePerKg * estimationObj.totalWeight) + estimationObj.logisticCost;
    //estimationObj.estimatedPricePerKg = Math.round((estimationObj.receivedWeightPricePerKg)/this.selectedLot.length);
    estimationObj.estimatedPricePerKg =  Math.round(estimationObj.sellingWeightCost /  estimationObj.totalWeight);
   // estimationObj.estimatedPrice = Math.round((estimationObj.estimatedPricePerKg * estimationObj.totalWeight));
    estimationObj.estimatedPrice = Math.round(estimationObj.totalPrice);
    this.estimationArray.push(estimationObj);
  }

  clearEstimate(i) {
    this.estimationArray.splice(i, 1)
  }

  deleteRecord(i) {
    this.selectedLot.splice(i, 1);
    let UnMatchedstatus =this.selectedLot.find(ele=>ele.status == 'New');
    if (UnMatchedstatus) {
        // alert('Select Cocoon Lots with Status Avilable To Mark Sold');
        this.disablemarksold = true;
        this.disableWarningMsg = " 'New' Lots Cannot be Mark Sold"
        // this.selectedLot = [];
        
    } else{
      this.disablemarksold = false;
    }
    this.retainSelectedState();
  }
  

  lotDetail(lot) {
    localStorage.setItem('cocoonLotStatus', this.selectedStatus);
    localStorage.setItem('cocoonLotTypeFilter', this.selectedCocoonType);
    this.router.navigate(['/resha-farms/cocoon-lot/details', lot.id]);
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

    this.api.patchCocoonLot(this.markSoldItem.id, sp).then(res => {
      this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType,this.selectedPaymentType);
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
    this.sellingLotDetails.displayTotal =  this.sellingLotDetails.total.toLocaleString('en-IN');
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
      this.sellingLotDetails.displayTotal =  this.sellingLotDetails.total.toLocaleString('en-IN');
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
    this.api.updateCocoonLotById(item.id, param).then(res => {
      if(this.modalRef) {
        this.modalRef.close();
      }
      this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType,this.selectedPaymentType);
      this.toaster.success(item.code + ' Updated successfully', 'Ok', {
        timeOut: 3000
      });
    }, err => {
      this.toaster.error('Could not update, Please try again', 'Ok', {
        timeOut: 3000
      });
    })
  }

  onCancel() {
    this.sellingPriceForm.reset();
    this.modalRef.close();
    this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType,this.selectedPaymentType);
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
  this.validMessage  = 'wastage ' + this.markSoldItem.availableQuantity + item.uom;
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
   this.api.updateCocoonLotById(this.markSoldItem.id, param).then(res => {
    this.$gaService.event('Cocoon mark sold with wastage', this.markSoldItem.id);

     this.validationText = '';
    this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.selectedStatus, this.selectedCocoonType,this.selectedPaymentType);
    this.modalRef.close();
    
    this.toaster.success('Cocoon lot updated Successfully', 'Cocoon Lot', {
      timeOut: 5000
    });
   })
 }

 routeToSplitScreen(){

  this.router.navigate(['/resha-farms/bid/cocoon-spliting'],{ queryParams: {selectedLot:JSON.stringify(this.selectedLot)}})
 }
 

 validateLotIds(saleType){
  localStorage.setItem('cocoonLotSaleType', saleType);
  // let UnMatchedstatus =this.selectedLot.find(ele=>ele.status == 'New');
  // if (UnMatchedstatus) {
  //   alert('Select Cocoon Lots with Status Avilable To Mark Sold');
  //   this.disablemarksold
  //   // this.selectedLot = [];
  // } else{
    this.api.validateLotIds(this.selectedLot.map(ele=>ele=ele.id)).then((res:any)=>{
      if(res?.responseCode == 200&&!res?.data.length){
       this.onMarkSold();
      }
    }).catch(err=>{
       this.snackBar.open(err?.error?.data?.toString()+ '  ' +err?.error?.message, 'Ok', {
         duration: 8000
       });
    });
  
   
  

 }


   // payout functinality
  //  Payoutrequest(Requestpayout, item){
  //   this.selectedLot = [];
  //   this.selectedLot.push(item);
  //   this.create(Requestpayout);
  //  }

   Request(Requestpayout, item)
   {
    this.selectedLot = [];
    this.selectedLot.push(item);
    this.create(Requestpayout);
   }

  async create(Requestpayout) {
    this.disableRequestPayout = false;
    // this.lot.index = index;
    let UnMatchedstatus =this.selectedLot.find(ele=>ele.paymentStatus == 'AWAITING_ACK' || ele.paymentStatus == 'Paid' || ele.paymentStatus == 'PAYOUT_REQUESTED' || ele?.lot?.cocoonLotOrigin == "SPLIT");
    console.log(UnMatchedstatus);
    
    if (UnMatchedstatus) {
        this.disableRequestPayout = true;
        this.disableWarningMsg = "Cannot request payout for selected lot since farmer acknowledgment pending or already paid or payout requested"  ; 
    } else{
      this.disableRequestPayout = false;
      console.log(this.selectedLot);
      this.selectedpayoutlot=[];
      this.totalamount = 0;
      this.selectedLot.forEach(item=>{
        this.totalamount += item?.lot?.grossAmount;
        console.log(this.totalamount);        
        this.selectedpayoutlot.push({
          itemId:item?.lot?.id,
          itemType: "COCOON_LOT",
          stakeHolderName:item?.lot?.farmerName ? item?.lot?.farmerName :' ',
          stakeHolderPhone:item?.lot?.farmerPhone ,
          stakeHolderType: "FARMER",
          stakeHolderId:parseInt(item?.lot?.farmerId.slice(6)),
          centerName:item?.lot?.centerName,
          centerId: item?.lot?.centerId,
        })
        const myJSON = JSON.stringify(item?.lot?.id);
        console.log('myJSON',myJSON);


      })
      console.log(this.selectedpayoutlot);
      

      // this.modalRef = this.modalService.open(Requestpayout)
      // this.modalRef.result.then((result) => {
      //   this.closeResult = `Closed with: ${result}`;
      // }, (reason) => {
      //   this.closeResult = `Dismissed`;
      // });
      this.createRequestPayout();
    }
  
  }

  // payoutrequest() {
  //   let payoutPayload = {
  //     "businessVertical": "RESHAFARMS",
  //     "businessDivision":"COCOON",
  //     "payoutItems": this.selectedpayoutlot
  //   }

  //   this.api.createPayout(payoutPayload).then((res:any)=>{
  //     this.router.navigate(['/cocoon-lot']);
  //     this.modalRef.close();
  //     this.payoutResponse =res? res['removedItems']:[];
  //     this.selectedLot = [];
  //     this.exixtingLotIds =[];
  //     if (res['removedItems'].length) {
  //       res['removedItems'].forEach(item => {
  //         this.exixtingLotIds.push(item?.stakeHolder?.itemId);
  //       });
  //       this.toaster.error(this.exixtingLotIds.toString() + ' ' +'this LOTs is already in Payout Process', 'Payout Process', {
  //         timeOut: 5000
  //       });
        
  //     } else {
  //       this.toaster.success('Payout request Created Successfully', 'Payout Process', {
  //         timeOut: 5000
  //       });
  //     }
      
  //     setTimeout(() => {
  //       this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus, this.selectedCocoonType, this.selectedPaymentType)
  //     }, 500);

    
  //   })
  // }
cancel(i) {
  this.selectedLot.splice(i);
  let selectedLot =this.selectedLot.find(ele=>ele.status == 'New');
  if (this.selectedLot) {
      selectedLot = true;
  } else{
    selectedLot = false;
  }
  this.retainSelectedState();
  this.router.navigate(['/resha-farms/cocoon-lot']);
  this.modalRef.close();
  this.snackBar.open('Cancel request Payout', 'Ok', {
    duration: 3000,
    
  })

}

  //payout Request cart 
  @ViewChild('RequestpayoutLots') RequestpayoutLots: ElementRef;

  createRequestPayout(){
    let payoutPayload = {
      "businessVertical": "RESHAFARMS",
      "businessDivision":"COCOON",
      "businessSubDivision" : "COCOON_LOT",
      "payoutItems": this.selectedpayoutlot
        
    }
    this.api.createPayoutRequest(payoutPayload).then(res=>{
      console.log(res);
      // this.modalRef.close();
      this.lotsRequstedPayout = res;
      this.lotCartItems = res['cartItems']
      this.totalamount = 0;
      this.cartLotItemsID = [];
      this.lotsRequstedPayout?.cartItems.forEach(item=>{
        this.totalamount += item?.payoutAmount;
        console.log(this.totalamount);
        this.cartLotItemsID.push(item?.itemId);
        
      })
      this.payoutResponse =res? res['removedItems']:[];
      this.exixtingLotIds =[];
      if (res['removedItems'].length) {
        res['removedItems'].forEach(item => {
          this.exixtingLotIds.push(item?.itemId);
          // this.exixtingLotIdsMsg = this.exixtingLotIds.toString(); 
        });
        this.toaster.error(this.exixtingLotIds.toString() + ' ' +'this LOTs is already in Payout Process', 'Payout Process', {
          timeOut: 5000
        });
        
      }

      this.modalRef = this.modalService.open(this.RequestpayoutLots)
      this.modalRef.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed`;
      });
      
    })
  } 
  patchRequestPayout(status){
    this.loading=true;
    this.ngxLoader.start();
    let payoutPayload = {
      "status":status,
      "cartId":this.lotsRequstedPayout?.cartId,
    }
    this.api.patchPayoutRequest(payoutPayload).then(res=>{
      console.log(res);
      this.loading=false;
      this.ngxLoader.stop();
      this.$gaService.event('Payout Request', ` Cocoon lot id =  ${this.cartLotItemsID.toString()}, Created By = ${this.userType.name}`);
      this.modalRef.close();
      this.selectedLot = [];
      this.retainSelectedState();
      this.payoutResponse =res? res['removedItems']:[];
      this.exixtingLotIds =[];
      this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus, this.selectedCocoonType, this.selectedPaymentType)
      if (res['removedItems'].length) {
        res['removedItems'].forEach(item => {
          this.exixtingLotIds.push(item?.stakeHolder?.itemId);
          // this.exixtingLotIdsMsg = this.exixtingLotIds.toString(); 
        });
        this.toaster.error(this.exixtingLotIds.toString() + ' ' +'this LOTs is already in Payout Process', 'Payout Process', {
          timeOut: 5000
        });
        
      } else {
        if (status == 'CANCEL') {
          this.toaster.error('Payout request Cancelled Successfully', 'Payout Cancelled', {
            timeOut: 5000
          });
          this.modalRef.close();
        } else {
          this.toaster.success('Payout request Created Successfully', 'Payout Process', {
            timeOut: 5000
          });
        }
        

      }
      
      setTimeout(() => {
        this.getCocoonLotsList(this.paginationData.currentPage, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.selectedStatus, this.selectedCocoonType, this.selectedPaymentType)
      }, 500);
      
    })
  } 

}





export interface S3UrlResponse{
  targetUrl: String
  fileName:String
}
