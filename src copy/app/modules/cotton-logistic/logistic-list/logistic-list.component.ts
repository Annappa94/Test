// import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolesService } from 'src/app/services/roles/roles.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { E } from '@angular/cdk/keycodes';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Item } from 'src/app/model/checkers/checkers.model';
import { COCOON_LOGISTICS_STATUS } from 'src/app/constants/enum/cocoonlogistics';

@Component({
  selector: 'app-logistic-list',
  templateUrl: './logistic-list.component.html',
  styleUrls: ['./logistic-list.component.scss']
})
export class LogisticListComponent implements OnInit {

  
  searchText = '';
  id = '';
  status = '';
  isTableLoaded = false;
  fileName = 'logistics-list.xlsx';
  dispatchedLotsData = [];

  driverDetails: any = [];
  logisticStatus: boolean = false;
  idParam;
  searchedReelers = [];
  filteredDispatchedLotsData = [];
  activeSort = '';
  user;
  paginationData = {
    currentPage: 0,
    pageSize: 10,
    total: 0,
    pages: [],
    currentColumn: 'createdDate',
    currentDirection: 'desc',
  };
  tableHeader = {
    logistics: {
      'driverName': 0,
      'driverNumber': 0,
      'totalCost': 0,
    },
    createdDate: 0,
    logisticsCostPerKg: 0,
    paymentStatus: 0,
    toCenter: {
      'centerName': 0,
    },
    center: {
      'centerName': 0,
    },
    toCenterName: 0,
    // deliveredTime: 0,

  };
  markSoldItem;
  modalRef;
  closeResult;
  deletedLogistics: any;
  seletedStatus = 'Pending'
  dispatchedStatus = '(NEW,CANCELLED,SHIPPED,DELIVERED)'
  logisticsDetail: any;
  driverDetail: any;
  editLogisticsForm: UntypedFormGroup;
  centerList: any = [];
  warehouseList: any = [];
  updateLogisticsId;
  payoutReferenceNumber: any;
  totallogestic: [];


  constructor(
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    private utils: UtilsService,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    public rolesService: RolesService,
    private form: UntypedFormBuilder,
    private ngxLoader: NgxUiLoaderService,
    private $gaService: GoogleAnalyticsService,
  ) {
    this.user = JSON.parse(localStorage.getItem('_ud'));

  }

  ngOnInit(): void {
    this.getAllDispatchedLots(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.seletedStatus, this.dispatchedStatus);
    this.createLogisticsParam();
    this.getCenters();
    this.getWarehouses();
    this.getAllDrivers();
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

  COCOON_LOGISTICS_STATUS = COCOON_LOGISTICS_STATUS
  patchinglogisticocoonstatus(id, payload) {
    this.ngxLoader.stop();
    this.api.patchingcocoonlotlogisticsstatus(id, payload).then(res => {
      console.log(id, payload);
      this.modalService.dismissAll();
      this.COCOON_LOGISTICS_STATUS = COCOON_LOGISTICS_STATUS;
      this.getAllDispatchedLots(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.seletedStatus, this.logisticStatus);


    })
  }

  onclickStatus(event, id) {
    console.log(event.target.value, id);
    this.patchinglogisticocoonstatus(id, { status: this.status });
  }


  @ViewChild('changeStatusPopUp')
  changeStatusPopUp: ElementRef;
  cancellationReason;


  onCancel() {
    this.modalService.dismissAll();
    this.getAllDispatchedLots(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.seletedStatus, this.logisticStatus);
  }

  openStatuspopup(content, id, val) {
    console.log(val);
    this.id = id;
    this.status = val;
    this.modalRef = this.modalService.open(content)
  }


  selectedDriverObj;
  selectedDriverId;
  selectedDriverName;
  selectedDriverMobile;
  createLogisticsForm: UntypedFormGroup;
  vehiclesList = [];
  selectedvehicleNumber;
  selectedVehicleId;
  driverList = [];
  updateBankDetials: any;
  driverToChanged(driverData) {
    this.selectedDriverObj = this.filteredDispatchedLotsData;
    if (this.selectedDriverObj?.companyId) {
      this.getlogisticsVehiclesById(driverData?.companyId)
      this.editLogisticsForm.get('vehicleNumber').patchValue(this.selectedDriverObj?.shipment?.vehicleNumber);
      this.selectedDriverId = driverData?.id;
      this.selectedDriverName = driverData?.name;
      this.selectedDriverMobile = driverData?.mobile;
      // vehicleNumber: new FormControl('',[Validators.required]),
      this.editLogisticsForm.get('beneficiaryName').patchValue(this.selectedDriverObj?.shipment?.driverBankDetails[0]?.beneficiaryName);
      this.editLogisticsForm.get('bankName').patchValue(this.selectedDriverObj?.shipment?.driverBankDetails[0]?.bankName);
      this.editLogisticsForm.get('accountNumber').patchValue(this.selectedDriverObj?.shipment?.driverBankDetails[0]?.accountNumber);
      this.editLogisticsForm.get('ifscCode').patchValue(this.selectedDriverObj?.shipment?.driverBankDetails[0]?.fscCode);
    }
  }
  getlogisticsVehiclesById(companyId) {
    this.ngxLoader.stop();
    this.api.getLogisticsVehiclesById(companyId).then((res: any) => {
      this.vehiclesList = res['_embedded']['vehicles']
    })
  }
  vehicleToChanged(vehicleNumber) {
    this.selectedvehicleNumber = vehicleNumber?.vehicleNumber;
    this.selectedVehicleId = vehicleNumber?.id;
  }
  getAllDrivers() {
    this.api.fetchAllDriversList().then(res => {
      this.driverList = res['_embedded']['driver']
    });
  }
  updateDriverDetailsById() {
    let payload = {
      "bankDetails": [{
        "beneficiaryName": this.updateBankDetials?.beneficiaryName,
        "bankName": this.updateBankDetials?.bankName,
        "accountNumber": this.updateBankDetials?.accountNumber,
        "ifscCode": this.updateBankDetials?.ifscCode
      }],
    }
    this.api.updateSingleDriverById(this.selectedDriverObj?.id, payload).then((res: any) => {
      this._cd.detectChanges();
    })
  }

  selectedLot = [];



  async onChangeStatusfilter(event) {
    this.paginationData.currentPage = 0;
    this.searchText = '';
    this.dispatchedStatus = event.target.value;
    this.getAllDispatchedLots(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.seletedStatus, this.dispatchedStatus);
    localStorage.setItem('status', this.dispatchedStatus);
  }


  totalElements: any;
  textSearch;
  enableSearch: boolean = false;
  async getAllDispatchedLots(page, size, column, direction, status, dispatchedStatus) {
    this.ngxLoader.stop();
    this.dispatchedLotsData = [];
    this.api.getCottonLogisticsList(page, size, column, direction, status, dispatchedStatus).then(res => {
      console.log('sdfdsf', res)
      this.totalElements = res['totalElements'];
      this.totallogestic = res['content'];
      res['content'].forEach(element => {
        let lotsList = '';
        if (element.cocoonLotIds && element.cocoonLotIds.length) {
          for (let i = 0; i < element.cocoonLotIds.length; i++) {
            lotsList = lotsList + element.cocoonLotIds[i].code.toUpperCase() + ' ';
          }
        }

        let searchLots = '';
        if (element.cocoonLotIds && element.cocoonLotIds.length) {
          for (let i = 0; i < element.cocoonLotIds.length; i++) {
            searchLots += element.cocoonLotIds[i].code.toLowerCase();
          }
        }

        this.dispatchedLotsData.push({
          code: element.code ? element.code : '-',
          id: element.id,
          createdDate: element.createdDate ? this.utils.getDisplayTime(element.createdDate) : '-',
          // deliveredTime: element.deliveredTime,
          sortCreatedDate: element.createdDate ? element.createdDate : 0,
          logisticsCostPerKg: element.logisticsCostPerKg ? element.logisticsCostPerKg : '-',
          totalCost: element.shipment ? element.shipment.totalCost : '-',
          driverNumber: element.shipment ? element.shipment?.driverPhone : '0',
          driverName: element.shipment ? element.shipment?.driverName ? element.shipment.driverName.toLowerCase() : '-' : '-',
          cocoonLot: element.cocoonLotIds ? element.cocoonLotIds : [],
          paymentStatus: element.paymentStatus,
          fromCenter: element.fromCenterName?.toLowerCase(),
          toCenter: element.toCenterName?.toLowerCase(),
          toWareHouse: element.toWareHouseName?.toLowerCase(),
          searchLots: searchLots,
          logistics: element.logistics,
          fromCenterId: element.fromCenterId,
          status: element.status,
          statusList: this.COCOON_LOGISTICS_STATUS[element.status],
          vehicleNumber: element.logistics ? element.logistics.vehicleNumber : '-',
          beneficiaryName: element.logistics ? element.logistics.bank.beneficiaryName : '',
          bankName: element.logistics ? element.logistics.bank ? element.logistics.bank.bankName : '' : '',
          accountNumber: element.logistics ? element.logistics.bank ? element.logistics.bank.accountNumber : '' : '',
          ifscCode: element.logistics ? element.logistics.bank ? element.logistics.bank.ifscCode : '' : '',
          toCenterId: element.toCenterId,
          toWarehouseId: element.toWareHouseId,
          shipToType: element.shipToType,
          shipment: element.shipment,
          items: element.items,
          payoutStatus: element.payoutStatus,
          toCenterAddress: element.toCenterAddress ? element.toCenterAddress : '-',
          payoutReferenceNumber: element.payoutReferenceNumber ? element.payoutReferenceNumber : null
        })
      });
      this.refreshTable(this.dispatchedLotsData);
      this._cd.detectChanges();

    }, err => {
      console.log(err);

    });
  }
  refreshTable(reelerList) {
    this.filteredDispatchedLotsData = [];

    this.paginationData.total = this.totalElements;
    const pagesLength = this.totalElements / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
    this.filteredDispatchedLotsData = reelerList;
    console.log('filter', this.filteredDispatchedLotsData)
    this._cd.detectChanges();

  }
  async onPageChange(page) {
    this.paginationData.currentPage = page;
    if (this.enableSearch) {
      let searchParams = `(payoutStatus=in=${this.seletedStatus} and logistics.driverName==*${this.searchText.replace(/ /gi, "*")}* or logistics.driverNumber==*${this.searchText.replace(/ /gi, "*")}*`;
      !isNaN(parseInt(this.searchText)) && (searchParams += ` or id==${parseInt(this.searchText)}`)
      // RMCOCOONLOG24400
      this.searchText?.includes('RMCOCOONLOG')
        && (!isNaN(parseInt(this.searchText?.substring(11))))
        && (searchParams += ` or id==${parseInt(this.searchText?.substring(11))}`);
      searchParams += ")";
      this.paginationData.currentPage = 0;
      this.afterSearch(page, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, searchParams)
    } else {
      this.getAllDispatchedLots(page, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.seletedStatus, this.logisticStatus)
    }
  }
  async onSearchKey(e) {
    this.textSearch = e.target.value;
    if (this.textSearch.length > 1) {
      this.enableSearch = true;
    } else if (this.textSearch.length < 1) {
      this.enableSearch = false;
      this.searchedReelers = [];
      this.paginationData.currentPage = 0;
      this.getAllDispatchedLots(this.paginationData.currentPage, this.paginationData.pageSize, 'createdDate', 'desc', this.seletedStatus, this.logisticStatus);

    }
  }
  async onSearch() {
    this.paginationData.currentPage = 0;
    let searchParams = `(driver.name==${this.searchText.replace(/ /gi, "*")} or driver.mobile==${this.searchText.replace(/ /gi, "*")}`;
    !isNaN(parseInt(this.searchText))
    this.searchText?.includes('RMLOGDO')
      && (!isNaN(parseInt(this.searchText?.substring(7))))
      && (searchParams += ` or id==${parseInt(this.searchText?.substring(7))}`);
    searchParams += ")";
    this.paginationData.currentPage = 0;
    this.afterSearch(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, searchParams)

  }
  appWeavers: any;
  afterSearch(page, size, column, direction, searchParams) {
    this.ngxLoader.stop();
    this.api.searchAllLogistics(page, size, column, direction, searchParams).then(res => {

      this.totalElements = res['totalElements'];

      this.dispatchedLotsData = [];
      this.searchedReelers = [];
      this.appWeavers = res['content'];
      this.appWeavers.forEach(element => {
        let lotsList = '';
        if (element.cocoonLotIds && element.cocoonLotIds.length) {
          for (let i = 0; i < element.cocoonLotIds.length; i++) {
            lotsList = lotsList + element.cocoonLotIds[i].code.toUpperCase() + ' ';
          }
        }

        let searchLots = '';
        if (element.cocoonLotIds && element.cocoonLotIds.length) {
          for (let i = 0; i < element.cocoonLotIds.length; i++) {
            searchLots += element.cocoonLotIds[i].code.toLowerCase();
          }
        }
        this.dispatchedLotsData.push({

          code: element.code ? element.code : '-',
          id: element.id,
          createdDate: element.createdDate ? this.utils.getDisplayDate(element.createdDate) : '-',
          // deliveredTime: element.deliveredTime,
          sortCreatedDate: element.createdDate ? element.createdDate : 0,
          logisticsCostPerKg: element.logisticsCostPerKg ? element.logisticsCostPerKg : '-',
          totalCost: element.shipment ? element.shipment.totalCost : '-',
          driverNumber: element.shipment ? element.shipment?.driverPhone : '0',
          driverName: element.shipment ? element.shipment?.driverName ? element.shipment.driverName.toLowerCase() : '-' : '-',
          cocoonLot: element.cocoonLotIds ? element.cocoonLotIds : [],
          paymentStatus: element.paymentStatus,
          fromCenter: element.fromCenterName?.toLowerCase(),
          toCenter: element.toCenterName?.toLowerCase(),
          toWareHouse: element.toWareHouseName?.toLowerCase(),
          searchLots: searchLots,
          logistics: element.logistics,
          fromCenterId: element.fromCenterId,
          status: element.status,
          statusList: this.COCOON_LOGISTICS_STATUS[element.status],
          vehicleNumber: element.logistics ? element.logistics.vehicleNumber : '-',
          beneficiaryName: element.logistics ? element.logistics.bank.beneficiaryName : '',
          bankName: element.logistics ? element.logistics.bank ? element.logistics.bank.bankName : '' : '',
          accountNumber: element.logistics ? element.logistics.bank ? element.logistics.bank.accountNumber : '' : '',
          ifscCode: element.logistics ? element.logistics.bank ? element.logistics.bank.ifscCode : '' : '',
          toCenterId: element.toCenterId,
          toWarehouseId: element.toWareHouseId,
          shipToType: element.shipToType,
          shipment: element.shipment,
          items: element.items,
          payoutStatus: element.payoutStatus,
          toCenterAddress: element.toCenterAddress ? element.toCenterAddress : '-',
          payoutReferenceNumber: element.payoutReferenceNumber ? element.payoutReferenceNumber : null
        })

      });

      this.refreshTable(this.dispatchedLotsData);

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
    if (this.enableSearch) {
      let searchParams = `(paymentStatus=in=${this.seletedStatus} and logistics.driverName==*${this.searchText.replace(/ /gi, "*")}* or logistics.driverNumber==*${this.searchText.replace(/ /gi, "*")}*`;
      !isNaN(parseInt(this.searchText)) && (searchParams += ` or id==${parseInt(this.searchText)}`)
      this.searchText?.includes('RMCOCOONLOG')
        && (!isNaN(parseInt(this.searchText?.substring(11))))
        && (searchParams += ` or id==${parseInt(this.searchText?.substring(11))}`);
      searchParams += ')';
      this.afterSearch(0, this.paginationData.pageSize, column, this.paginationData.currentDirection, searchParams)
    } else {
      this.getAllDispatchedLots(0, this.paginationData.pageSize, column, this.paginationData.currentDirection, this.seletedStatus, this.logisticStatus)
    }
    //this.getFarmerList(0, this.paginationData.pageSize, column, this.paginationData.currentDirection)
    this.activeSort = column;
    this.paginationData.currentPage = 0;
  }
  async onPageSizeChange() {
    this.getAllDispatchedLots(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.seletedStatus, this.logisticStatus)

  }

  lotDetails(item) {
    //e.preventDefault();
    // this.router.navigate(['/cocoon-lot/details', item['itemId']]);
  }

  markAsSold() {
    const param = {
      payoutDate: Date.parse(new Date().toString()),
      payoutStatus: 'Paid',
      payoutReferenceNumber: this.payoutReferenceNumber
    }
    this.ngxLoader.stop();
    this.api.updateLogisticsDetails(this.markSoldItem.shipment?.id, param).then(res => {
      this.$gaService.event('Cocoon lot logistics payout', ` payoutReferenceNumber =  ${param.payoutReferenceNumber}`);

      this.modalRef.close();
      if (this.seletedStatus == 'Paid' || this.seletedStatus == 'Pending') {
        this.getAllDispatchedLots(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.seletedStatus, this.logisticStatus)
      }
      else {
        this.getAllDispatchedLots(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, false, this.logisticStatus);
      }
      this.snackBar.open('Paid Suceessfully', 'Ok', {
        duration: 3000
      });
    }, err => {
      this.modalRef.close();
      this.snackBar.open('Payment Failed', 'Ok', {
        duration: 3000
      });
    })
  }

  makePayment(markSold, item) {
    this.markSoldItem = item;
    this.payoutReferenceNumber = '';
    this.modalRef = this.modalService.open(markSold)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  async onChangeOfStatusFilter(event) {
    this.paginationData.currentPage = 0;
    this.searchText = '';
    let status = event.target.value;
    this.seletedStatus = status;
    if (status == 'Paid' || status == 'Pending') {
      // this.seletedStatus = status;
      this.getAllDispatchedLots(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.seletedStatus, this.dispatchedStatus)
    } else {
      this.getAllDispatchedLots(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, false, this.logisticStatus)

    }
  }

  async confirmDelete(content, item) {
    this.deletedLogistics = item;
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  logisticsDetails(item, content) {
    if (item.shipment) {
      this.driverDetail = item.shipment;
      console.log('sdfdsf', this.driverDetail)
      this.driverDetail.totalCost = this.driverDetail.totalCost;
      //this.driverDetail.payoutReferenceNumber =  item.payoutReferenceNumber ? item.payoutReferenceNumber : null
    } else {
      this.driverDetail = ''
    }
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  deleteLogistics() {
    this.ngxLoader.stop();
    this.api.deleteLogistics(this.deletedLogistics.id).then(res => {
      this.snackBar.open('Logistics Deleted Suceessfully', 'Ok', {
        duration: 3000
      });
      if (this.seletedStatus == 'Paid' || this.seletedStatus == 'Pending') {
        this.getAllDispatchedLots(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.seletedStatus, this.logisticStatus)
      } else {
        this.getAllDispatchedLots(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, false, this.logisticStatus)

      }
      this.modalRef.close()
    }, err => {
      this.modalRef.close();
      this.snackBar.open('Could not delete', 'Ok', {
        duration: 3000
      });
    })
  }

  openEditLogistics(item, content) {
    this.selectedDriverId = item;
    this.selectedDriverName = item?.shipment?.driverName;
    this.selectedDriverMobile = item.shipment?.driverPhone;
    this.selectedvehicleNumber = item.shipment?.vehicleNumber;
    console.log(this.selectedDriverName + this.selectedDriverMobile);
    this.editLogisticsForm.get('fromCenterId').patchValue(item?.shipment?.startPointName)
    this.editLogisticsForm.get('toCenterId').patchValue(item?.shipment?.endPointName)
    this.editLogisticsForm.get('totalCost').patchValue(item?.shipment?.totalCost);
    this.editLogisticsForm.get('driverNumber').patchValue(this.selectedDriverMobile);
    this.editLogisticsForm.get('beneficiaryName').patchValue(item?.shipment?.driverBankDetails[0]?.beneficiaryName);
    this.editLogisticsForm.get('bankName').patchValue(item?.shipment?.driverBankDetails[0]?.bankName);
    this.editLogisticsForm.get('accountNumber').patchValue(item?.shipment?.driverBankDetails[0]?.accountNumber);
    this.editLogisticsForm.get('ifscCode').patchValue(item?.shipment?.driverBankDetails[0]?.ifscCode);



    if (item.status == "NEW") {

      this.editLogisticsForm.get('driverNumber').enable();
      this.editLogisticsForm.get('driverName').enable();
      this.editLogisticsForm.get('vehicleNumber').enable();
    } else {
      this.editLogisticsForm.get('driverNumber').disable();
      this.editLogisticsForm.get('driverName').disable();
      this.editLogisticsForm.get('vehicleNumber').disable();
    }

    console.log(item);
    this.updateLogisticsId = item.id;
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
    this.editLogisticsForm.patchValue(item?.shipment)
    // this.editLogisticsForm.get('totalCost').patchValue(item['logistics']['totalCost']);
    if (item.shipToType == 'RM_CENTER') {
      this.editLogisticsForm.get('toWarehouseId').clearValidators();
      this.editLogisticsForm.get('toWarehouseId').updateValueAndValidity();
    } else if (item.shipToType == 'RM_WAREHOUSE') {
      this.editLogisticsForm.get('toCenterId').clearValidators();
      this.editLogisticsForm.get('toCenterId').updateValueAndValidity();
    }
  }


  async createLogisticsParam() {
    this.editLogisticsForm = this.form.group({
      totalCost: new UntypedFormControl('', [Validators.required]),
      driverName: new UntypedFormControl('', [Validators.required]),
      driverNumber: new UntypedFormControl('',[Validators.required]),
      vehicleNumber: new UntypedFormControl('', [Validators.required]),
      beneficiaryName: new UntypedFormControl('', [Validators.required]),
      bankName: new UntypedFormControl('', [Validators.required]),
      accountNumber: new UntypedFormControl('', [Validators.required]),
      ifscCode: new UntypedFormControl('', [Validators.required]),
      fromCenterId: new UntypedFormControl('', [Validators.required]),
      toCenterId: new UntypedFormControl('', [Validators.required]),
      //toWarehouseId: new UntypedFormControl('', [Validators.required]),
      shipToType: new UntypedFormControl('',)
    });

  }

  editLogisticsDetails(form) {
    let param = {
      totalCost: +form.totalCost,
      shipment: {
        driverName: this.selectedDriverName,
        driverNumber: this.selectedDriverMobile,
        vehicleNumber: this.selectedvehicleNumber,

        bank: {
          beneficiaryName: form.beneficiaryName,
          bankName: form.bankName,
          accountNumber: form.accountNumber,
          ifscCode: form.ifscCode,
        }
      },
    }

    let driverParam = {
      "name": this.selectedDriverName,
      "bankDetails": [{
        "beneficiaryName": form.beneficiaryName,
        "bankName": form.bankName,
        "accountNumber": form.accountNumber,
        "ifscCode": form.ifscCode
      }

      ]
    }
    this.api.getDriverDetailsFromNumber(form.driverNumber).then(res => {
      this.driverDetails = res['content'][0];
      console.log("driver detailes", this.driverDetails)

      this.api.updateLogisticsCompanyDriver(this.driverDetails['id'], driverParam).then(res => {
      })
      console.log(this.driverDetails['id']);


      this.ngxLoader.stop();


      if (this.selectedDriverId?.shipment?.id) {
        this.api.updateCocoonLogistics(param, this.selectedDriverId?.shipment?.id).then(res => {
          if (this.seletedStatus == 'Paid' || this.seletedStatus == 'Pending') {
            this.getAllDispatchedLots(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, this.seletedStatus, this.dispatchedStatus)
          } else {
            this.getAllDispatchedLots(0, this.paginationData.pageSize, this.paginationData.currentColumn, this.paginationData.currentDirection, false, this.dispatchedStatus)

          }
          this.modalRef.close();
          this.snackBar.open('Details updated suceessfully', 'Ok', {
            duration: 3000
          });
        }, err => {
          this.modalRef.close();
          this.snackBar.open('Could not update, please try again', 'Ok', {
            duration: 3000
          });
        })
      }
    })

  }

  async getCenters() {
    this.ngxLoader.stop();
    this.api.getCentersList().then(details => {
      console.log('center list', details);
      if (details) {
        this.centerList = details['_embedded']['center'];


      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.editLogisticsForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.editLogisticsForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  isControlValidForReeler(controlName: string): boolean {
    const control = this.editLogisticsForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

}
