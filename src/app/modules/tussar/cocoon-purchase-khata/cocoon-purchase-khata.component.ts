import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-cocoon-purchase-khata',
  templateUrl: './cocoon-purchase-khata.component.html',
  styleUrls: ['./cocoon-purchase-khata.component.scss']
})
export class CocoonPurchaseKhataComponent implements OnInit {
  user:any;
  constructor(
    private apiSearch:SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private api:ApiService,
    private router:Router,
    private snackBar:MatSnackBar,
    private form: UntypedFormBuilder,
    private modalService:NgbModal,
  ) { 

    this.user = JSON.parse(localStorage.getItem('_ud'));
  }
  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
 
  @ViewChild('paymentDetailesHtml')
  paymentDetailesHtml:ElementRef;

  @Input()
  reelerId:number =0;

  @Output()
  listenAndRefresh:EventEmitter<any> = new EventEmitter<any>();
  
  @Input()
  masterLoanInfo:any;

  tableHeaders:any=[
    {name:"RM CODE", sortName:'id'},
    {name:"PRICE/KG (RS.)", sortName:'sellingPricePerKg', sort:true},
    {name:"WEIGHT(KG)", sortName:'totalWeight', sort:true},
    {name:'AMOUNT(RS.)', sortName: 'totalAmount',sort:true},
    {name:'DUE(RS.)', sortName: 'dueAmount',sort:true},
    {name:"ORDER DATE",sortName:'createdDate', sort:true},
    {name:"ACTION"},
   ];
   CONSTANT = CONSTANT;

   buildSerachQuery(searchText){
    if(searchText&&!isNaN(searchText))
     return `(reeler.id == ${this.reelerId} and id ==${searchText} )`;
     
     return `(reeler.id == ${this.reelerId})`;
   }

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    !initial && this.getCocoonPurchaseKhata(paginationData,searchText);
  }


  infoFromTable(info){
    const { edit,data,details,index,payNow,paymentDetailes} = info;
    if(paymentDetailes){
      const { reelerPayments } = this.res[index]
      this.reelerPaymentDetails(reelerPayments,this.paymentDetailesHtml);
    }
    details&&(this.routeToDetailspage(index));
  }
  
   routeToDetailspage(index){
    this.router.navigate([`/resha-farms/cocoon-orders/details/`,this.res[index]?.id]);
   }


  getCocoonPurchaseKhata(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getOrders(paginationData,'cocoonorder',this.buildSerachQuery(searchText)).then(res=>{
      this.rowDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={}
        obj['RM CODE'] = record?.code ? record?.code : ' - ',
        obj['PRICE/KG (RS.)'] = record?.sellingPricePerKg ? record?.sellingPricePerKg : ' - ',
        obj['WEIGHT(KG)'] = record?.totalWeight ? record?.totalWeight : 0,
        obj['AMOUNT(RS.)'] = record?.totalAmount ? record?.totalAmount.toLocaleString('en-IN') : 0,
        obj['DUE(RS.)'] = record?.dueAmount ? record?.dueAmount.toLocaleString('en-IN')  : 0,
        obj['ORDER DATE'] = record?.createdDate ? this.utils.getDisplayTime(record?.createdDate): ' - ',
        obj['ACTION'] = record,
        this.CONSTANT.ID ='RM CODE',
        this.CONSTANT.COCOON_PURCHASE_PAYMENT = 'ACTION',
        this.rowDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  ngOnInit(): void {
    this.reelerId&&this.getCocoonPurchaseKhata();
  }

  reelerKhataList:any[] = [];
  closeResult;
  reelerPaymentDetails(khataList:any[]=[],content){
        if (khataList.length) {
          for (let i = 0; i < khataList.length; i++) {
            this.reelerKhataList.push({
              amount: khataList[i].amount,
              lastModifiedDate: this.utils.getDisplayTime(khataList[i].lastModifiedDate),
              referenceNumber: khataList[i].referenceNumber
            })
          }
          this.modalRef = this.modalService.open(content)
          this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed`;
          });
          this._cd.detectChanges();
        } else {
          this.reelerKhataList = [];
          this._cd.detectChanges();
        }
  }

  listenAndRefreshPayment(){
    this.getCocoonPurchaseKhata();
    this.listenAndRefresh.emit();
  }
}
