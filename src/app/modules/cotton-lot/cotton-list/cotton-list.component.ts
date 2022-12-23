import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { COTTON_LOT_STATUS } from 'src/app/constants/enum/constant.cottons';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { PaymentInfo } from '../../shared/generic-payment/generic-payment.component';

@Component({
  selector: 'app-cotton-list',
  templateUrl: './cotton-list.component.html',
  styleUrls: ['./cotton-list.component.scss']
})
export class CottonListComponent implements OnInit {
  searchText= '';

  cocoondata: any[] = [];
  paginationData = {
    currentPage: 0,
    pageSize: 10,
    total: 0,
    pages: [],
    currentColumn: 'createdDate',
    currentDirection: 'desc',
  };
  closeResult: string;
  amount: any;
  // searchText: number;
  idParam: string;
  selectedCocoonType: any;
  cottonid: any;
  SlectedCottonLot: any;
  totalLintSeedValue: any;
  addingLindSeed: any;
  outTunform: UntypedFormGroup;
  outTonWarningMsg: any;
  disableConfirmButton: any;

  rowDataList: any[] = [];
  res: any[] = [];
  totalRecords: number = 0;
  modalRef;
  selectedCottonLot: any[] = [];
  user = JSON.parse(localStorage.getItem('_ud'));
  filterForm: UntypedFormGroup = new UntypedFormGroup({
    status: new UntypedFormControl('(New,Sold,AVAILABLE)'),
    // orderStatus: new UntypedFormControl('(New,Purchased,Returned,Cancelled,AVAILABLE)'),
    transctionStatus: new UntypedFormControl('(REGULAR,MANUFACTURING)')

  })
  @Input()
  farmarId: number;
  CONSTANT = CONSTANT;
  cottonLotId: number;
  @ViewChild('changeStatusPopUp')
  changeStatusPopUp: ElementRef;
  rateperKgValue: any;
  netPaybleamnt: any;


  outTonFormIntilazation(){
   this.outTunform = new UntypedFormGroup({
      numberofkgs: new UntypedFormControl('',[Validators.required]),
      lint: new UntypedFormControl('0',[Validators.required,Validators.pattern('^[1-9]{1}[0-9]{0,3}([.][0-9]{1,5})?$')]),
      seeds: new UntypedFormControl('0',[Validators.required,Validators.pattern('^[1-9]{1}[0-9]{0,3}([.][0-9]{1,5})?$')]),
      roledust: new UntypedFormControl(),
      lintdust: new UntypedFormControl(),
      kwadi: new UntypedFormControl(),
      buyingprice: new UntypedFormControl('',[Validators.required]),
      uom: new UntypedFormControl('KGS')
  
    })
  }

  constructor(
    private apiSearch: SearchService,
    private utils: UtilsService,
    private _cd: ChangeDetectorRef,
    private ngxLoader: NgxUiLoaderService,
    private router: Router,
    private modalService: NgbModal,
    private api: ApiService,
    public globalService: GlobalService,
    private toaster:ToastrService,
  ) {
    this.disableConfirmButton = false;

   }


  ngOnInit(): void {
    this.outTonFormIntilazation();
    this.listenForFilterChanges();
    this.getCottonLotList();    
  }
  infoFromTable(info) {
    const { edit, data, details, index, payNow, paymentDetailes, popup, rowCheckBox } = info;
    details && (this.routeToDetailspage(index));
    edit && (this.routeToEditDetails(index));
    popup && this.changesStatusByOpeningPopup(data, index);//data is Status;
    // rowCheckBox && this.selectedCottonLotFromTable(index)
  }

  selectedCottonLotFromTable(event, cottonlot) {
    // this.res[index];
    // if (!this.selectedCottonLot.find(lot => lot?.id == cottonlot.id)) {
    //   this.selectedCottonLot.push(cottonlot);
    //   console.log(this.selectedCottonLot);

    // } else {
    //   this.selectedCottonLot.splice(this.selectedCottonLot.indexOf(lot => lot?.id == cottonlot.id), 1)
    //   console.log(this.selectedCottonLot);
    // }

    if (event.target.checked) {
      const found = this.selectedCottonLot.some(el => el.id === cottonlot.id);
      if (!found) {
        this.selectedCottonLot.push(cottonlot);
        let UnMatchedstatus =this.selectedCottonLot.find(ele=>ele.status == 'New');
        // if (UnMatchedstatus) {
        //     // alert('Select Cocoon Lots with Status Avilable To Mark Sold');
        //     this.disablemarksold = true;
        //     this.disableWarningMsg = " 'New' Lots Cannot be Mark Sold"
        //     // this.selectedCottonLot = [];
            
        // } else{
        //   this.disablemarksold = false;
        // }

      }
    } else {
      const lot = this.selectedCottonLot.findIndex((lotItem) => {
        return lotItem.id === cottonlot.id;
      });
      if (lot !== -1){
        this.selectedCottonLot.splice(lot, 1);
        let UnMatchedstatus =this.selectedCottonLot.find(ele=>ele.status == 'New');
        // if (UnMatchedstatus) {
        //     // alert('Select Cocoon Lots with Status Avilable To Mark Sold');
        //     this.disablemarksold = true;
        //     this.disableWarningMsg = " 'New' Lots Cannot be Mark Sold"
        //     // this.selectedLot = [];
            
        // } else{
        //   this.disablemarksold = false;
        // }   
        
      }
    }
  }

  cancellationReason;
  cottonLotOrderStatus: string;
  changesStatusByOpeningPopup(status, index) {
    this.cottonLotOrderStatus = status;
    this.cottonLotId = this.res[index].id;
    this.modalService.open(this.changeStatusPopUp);
  }

  routeToDetailspage(index) {
    this.router.navigate([`/resha-farms/cottonlot/details/`, this.res[index]?.id]);
  }

  routeToEditDetails(index) {
    this.router.navigate([`/resha-farms/cottonlot/crud/`, this.res[index]?.id]);
  }

  listenForFilterChanges() {
    this.filterForm.valueChanges.subscribe(value => {
      this.getCottonLotList();
    })
  }
  // onPageSizeChange() {
  //   this.getCottonLotList();

  // }
  async onPageChange(page) {  
    this.paginationData.currentPage = page;
    this.getCottonLotList();
  }
  async onPageSizeChange() {
    this.getCottonLotList()
  }
  async onSearch() {
    // if(this.selectAll) {
    //   this.selectAll = false;
    //   this.selectedBatchList = [];
    // }
    this.paginationData.currentPage=0;
    this.getCottonLotList();
  }
  

  buildSearchQuery(searchText:any=this.searchText) {
    const { status, transctionStatus } = this.filterForm.value;
    let query = `(status =in= ${status} and transactionType=in=${transctionStatus}`;
    if (this.searchText) {
      let text = this.searchText.replace(/ /gi, "*");
      let query: String = `(`;
      (query += `((farmerName == *${text}*  or farmerPhone == *${text}* or centerName==*${text}*) and status=in=${status} and transactionType=in=${transctionStatus}`);
      this.searchText.toString()?.toUpperCase()?.includes('RMCOLT') && !isNaN(parseInt(this.searchText.substring(6))) && (query += ` or id==${this.searchText.substring(6)}`)
      !isNaN(parseInt(this.searchText)) && (query += ` or id==${this.searchText}`)
      query += '))';
      return query;
    }
    (this.farmarId) && (query += ` and farmerId ==${this.farmarId} `);
    query += ')'
    return query;

  }

  getCottonLotList(paginationData=false,searchText='') {
    this.ngxLoader.start();
    this.apiSearch.getOrdersCotton(this.paginationData,'cottonlot',this.buildSearchQuery(searchText)).then(res=>{
      this.rowDataList = [];
      this.cocoondata = res['content'];
      console.log('dsfsdf', this.cocoondata)
      this.res = res['content'];
      res['content'].filter(record => {
        const obj = {};
        obj['RM CODE'] = {
          isDisplay: record.cottonLotStatus == 'Purchased' && record.status != 'Sold',
          code: record?.code,
          selected: this.selectedRecord(record.id)
        },
          // obj['Farmer Name'] = record?.farmerName ? record?.farmerName : ' - ',
          // obj['Farmer Phone'] = record?.farmerPhone ? record?.farmerPhone : ' - ',
          obj['Centre'] = record?.centerName ? record?.centerName : ' - ',
          obj['Type'] = record?.cottonType ? record?.cottonType : ' - ',
          obj['Weight'] = record?.lotWeight ? record?.lotWeight : ' - ',
          obj['Available Weight(in kgs)'] = record?.availableQuantity ? record?.availableQuantity : 0,
          obj['STATUS'] = record?.status ? record?.status : ' - ',
          obj['PAYMENT STATUS'] = record?.paymentStatus ? record?.paymentStatus : ' - ',
          obj['Order Status'] = {
            'status': record.cottonLotStatus,
            'STATUS_ORDERS': this.statusChangeConFig(record.cottonLotStatus)
          },
          obj['Date'] = record?.createdDate ? this.utils.getDisplayTime(record?.createdDate) : ' - ';
        let paymentInfo: PaymentInfo = { ...record };
        paymentInfo.totalQuantity = record['lotWeight']
        paymentInfo.displayTotalAmount = (record['netPayableAmount'])?.toString()
        paymentInfo.customerIdKey = "farmerId"
        paymentInfo.productIdKey = "cottonLot"
        paymentInfo.customerIdValue = record?.farmerId,
          paymentInfo.productIdValue = `/cottonlot/${record?.id}`;
        paymentInfo.endpoint = "cottonsvc/cottonfarmerpayout";
        obj['Actions'] = paymentInfo
        // this.CONSTANT.ID ='RM CODE',
        this.CONSTANT.SELECTE_POPUP = "Order Status";
        this.CONSTANT.SELECT_ROW = "RM CODE";
        this.CONSTANT.PAYMENT_GENERIC = 'Actions',

          this.rowDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this.paginationData.total = this.totalRecords;
      const pagesLength = this.totalRecords / this.paginationData.pageSize;
      this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
      this.ngxLoader.stop();
      this._cd.detectChanges();
    })
  }

  selectedRecord(id: number) {
    return this.selectedCottonLot.find(record => record.id == id) ? true : false;
  }

  statusChangeConFig(status) {
    switch (status) {
      case 'New':
        return COTTON_LOT_STATUS.NEW;
      case 'Purchased':
        return COTTON_LOT_STATUS.PURCHASED;
      case 'Returned':
        return COTTON_LOT_STATUS.RETURENED;
      case 'Cancelled':
        return COTTON_LOT_STATUS.CANCELLED;
    }
  }
  async onMarkSold() {
    this.globalService.cottonData = this.selectedCottonLot;
    this.router.navigate(['/resha-farms/cotton-orders/crud']);
  }

  markProcessing() {
    this.ngxLoader.start()
    this.api.patchCottonLot(this.cottonLotId, { cottonLotStatus: this.cottonLotOrderStatus }).then(res => {
      this.modalService.dismissAll();
      this.getCottonLotList();
    })
  }


  onCancel() {
    this.modalService.dismissAll();
  }
  navigateToNewLot() {
    this.router.navigate(['/resha-farms/cottonlot/crud']);
  }

  outtonprocesspopup(outton,item) {
    this.outTonFormIntilazation();
    this.outTonWarningMsg = "";
    this.SlectedCottonLot = item;
    console.log(item);
    
    this.outTunform.get('buyingprice')?.patchValue(this.SlectedCottonLot?.ratePerKg);
    this.netPaybleamnt = this.SlectedCottonLot.netPayableAmount;
    this.modalRef = this.modalService.open(outton)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  editCottonLDeatailes(item) {
   this.cottonid=item.id;
    this.router.navigate([`/resha-farms/cottonlot/details/`, item.id]);

  }
  editCottonCrud(item) {
    this.router.navigate(['/resha-farms/cottonlot/crud',item.id]);
  }
  changeBuyPrice(){
    this.netPaybleamnt = this.outTunform.value.buyingprice * this.SlectedCottonLot.availableQuantity;
  }
  OutTonProcess() {
    const params = {
      "lint": parseFloat(this.outTunform.value.lint),
      "noOfKgsUsed": parseFloat(this.outTunform.value.numberofkgs),
      "seeds":parseFloat (this.outTunform.value.seeds),
      "kawdi":parseFloat(this.outTunform.value.kwadi),
      "lintDust": parseFloat(this.outTunform.value.lintdust),
      "rollDust": parseFloat(this.outTunform.value.roledust),
      // "ratePerKg":this.SlectedCottonLot?.ratePerKg,
      "netPayableAmount":this.SlectedCottonLot.netPayableAmount,
      "uom":"KGS"
    }
    this.rateperKgValue = this.outTunform.value.buyingprice;

    this.api.updateOutTonProcess(params,this.SlectedCottonLot.id,this.rateperKgValue).then(response => {
      console.log(response);
      this.modalRef.close();
      this.toaster.success('OutTon Process Updated  successfully', 'Ok', {
        timeOut: 3000,
      })
      this.getCottonLotList();    
      this._cd.detectChanges();
    })

  }
  lintprice: any;
  seedsprice: any;
  pricecalculation() {
    this.amount = (this.outTunform.value.numberofkgs * 0.5 / 100);    
    this.outTunform.get('roledust').patchValue(parseFloat(this.amount))
    this.outTunform.get('lintdust').patchValue(this.amount)
    this.outTunform.get('kwadi').patchValue(this.amount)


  }

  lintSeedCalculate(){
    this.totalLintSeedValue = (this.outTunform.value.numberofkgs * 98.5 / 100);
    console.log(' this.totalLintSeedValue', this.totalLintSeedValue);
    
    this.addingLindSeed =  (parseFloat(this.outTunform.value.lint) +parseFloat( this.outTunform.value.seeds));
    console.log( this.addingLindSeed);
    console.log(this.outTunform);
    
    
    if (this.addingLindSeed > this.totalLintSeedValue ) {
      console.log('this value greater');
      this.disableConfirmButton = true;
      this.outTonWarningMsg = "Entered value is Greater Than The No.Of.kgs"

    } else {
      console.log('this is smaller value');
      this.outTonWarningMsg = ""
      this.disableConfirmButton = false;
    }
  }


}
