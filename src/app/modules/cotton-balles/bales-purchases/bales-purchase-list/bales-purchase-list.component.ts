import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { PaymentInfo } from 'src/app/modules/shared/generic-payment/generic-payment.component';

@Component({
  selector: 'app-bales-purchase-list',
  templateUrl: './bales-purchase-list.component.html',
  styleUrls: ['./bales-purchase-list.component.scss']
})
export class BalesPurchaseListComponent implements OnInit {
  balePOTableDataList:any;
  balesPOList:any[]=[];
  res:any[]=[];
  cottonTypesSelected:any[]=[];
  map = new Map<string, string>(); 
  isValidCottonCombination:boolean = true;
  totalRecords:number = 0;
  modalRef;
  closeResult: string;
  selectedLGPartner:any;
  paginationData:boolean = false;
  searchText:string = '';
  selectedPurchaseLot:any[] = []
  tableHeaders:any=[
    {name:"RM code", sortName:'id'},
    {name:"Ginning Name", sortName:'ginner.name', sort:true},
    // {name:"Mobile Number", sortName:'phone', sort:true},
    // {name:"Center", sortName:'center', sort:true},
    {name:"Type", sortName:'baleType', sort:true},

    {name:"Total Bales", sortName:'noOfBales', sort:true},
    {name:"Available Quantity", sortName:'availableQuantity', sort:true},
    {name:"Status", sortName:'status', sort:true},
    {name:"Payment Status", sortName:'status', sort:true},
    {name:'ACTION'}
  ];
  CONSTANT = CONSTANT;

  @Input()
  ginnerId:number;


  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    private apiSearch:SearchService,
    private utils:UtilsService,
    private modalService: NgbModal,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    public globalService:GlobalService
  ) { 
    
  }

  filterForm:UntypedFormGroup = new UntypedFormGroup({
    status:new UntypedFormControl('(AVAILABLE,SOLD)'),
    cottonType:new UntypedFormControl('(BTCOTTON,DCHCOTTON)'),
    paymentStatus:new UntypedFormControl('(PENDING,PAID)'),
  })

  listenForFilterChanges(){
    this.filterForm.valueChanges.subscribe(value=>{
     this.getBalePurchasesList();
    })
  }

  ngOnInit(): void {
    this.getBalePurchasesList();
    this.listenForFilterChanges();
  }

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    this.paginationData = paginationData;
    this.searchText = searchText;
    !initial && this.getBalePurchasesList(paginationData,searchText);

  }


  tableInfo(info){
    const { edit,data,details,index, switchIconToggle,rowCheckBox} = info;
    edit&&(this.routeToEditPage(index));
    details&&(this.routeToDetailspage(index));
    // edit&&(this.routeToEditPage(index));
    // switchIconToggle&&(this.openBlacklistPopUp(index));
    rowCheckBox&&this.selectedPurchaseListFromTable(index)

  }

  routeToEditPage(index){
    this.router.navigate([`/resha-farms/bale-purchases/crud`,this.res[index]?.id]);
  }
  
  routeToDetailspage(index){
    this.router.navigate([`/resha-farms/bale-purchases/details`,this.res[index].id]);
  }

  selectedPurchaseListFromTable(index:number){
    let balePurchase = this.balePOTableDataList[index];
    let rmCode=balePurchase["RM ID"]["code"];
    let cottonType=balePurchase["Type"];

    if(!this.map.has(rmCode)){
      this.map.set(rmCode,cottonType);
    }
    else{
      this.map.delete(rmCode);
    }

    this.res[index];
    if(!this.selectedPurchaseLot.find(lot=>lot?.id == this.res[index].id)){
     this.selectedPurchaseLot.push(this.res[index]);

    }else{
      this.selectedPurchaseLot.splice(this.selectedPurchaseLot.indexOf(lot=>lot?.id == this.res[index].id),1)
    }
  }
  selectedRecord(id:number){
    return this.selectedPurchaseLot.find(record=>record.id == id)?true:false;
  }
  async onMarkSold() {
   
    this.checkIsValidCottonTypes();
    if(this.isValidCottonCombination){
      this.globalService.cottonData = this.selectedPurchaseLot;
      this.router.navigate(['/resha-farms/bale-sales/crud']);
    }else{
      alert("Please Select Purchases Lot with Same Cotton Type");
    }

  }

//   buildSerachQuery(searchText){
//     const text = searchText.replace(/ /gi,"*");
//     if(searchText){
//       if(!isNaN(searchText)){
//         return `( id==${searchText} or name==*${text}* or number==*${text}* )`
//       }
//       if(searchText.includes('RMSCFARM')&&!isNaN(searchText.substring(8))){
//         return `( id==${searchText.substring(8)} or name==*${text}* or number==*${text}* )`
//       }else{
//         return `( name==*${text}* or number==*${text}* )`
//       }
//     }
//   return false;
//  }

  buildSerachQuery(searchText:any){
    const {status,cottonType,paymentStatus} = this.filterForm.value;
    let query = `(status=in=${status} and baleType=in=${cottonType} and paymentStatus=in=${paymentStatus}`;
      if (searchText) {
      let text=searchText.replace(/ /gi,"*");
      let query:String=`(`;
      (query+=`((ginner.name==*${text}* or ginner.phone==*${text}*) and status=in=${status} and paymentStatus=in=${paymentStatus} and baleType=in=${cottonType}`);
      searchText.toString()?.toUpperCase()?.includes('RMCOBP')&&!isNaN(searchText.substring(6))&&(query+=` or id==${searchText.substring(6)}`)
      !isNaN(parseInt(searchText))&&(query+=` or id==${searchText}`)
      query+='))';
      return query;
    }
    (this.ginnerId && (query+= ` and ginner.id==${this.ginnerId}`))
    query+=')'
    return query;

  }

  getBalePurchasesList(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getBalePurchases(paginationData,this.buildSerachQuery(searchText)).then(res=>{
      this.balePOTableDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={};
        // obj['RM CODE'] ={
        //   code:record?.code ? record?.code : ' - ',
        //   selected:this.selectedRecord(record.id)
        // },
        obj['RM ID'] = {
          isDisplay:record.status=='AVAILABLE' && record.status !='Sold',
          code:record?.code,
          selected:this.selectedRecord(record.id)
        },
        obj['Ginning Name'] = record.ginnerObj ? record.ginnerObj.name ? record.ginnerObj.name : '-' : '-',
        // obj['Mobile Number'] = record.ginner ? record.ginner.phone ? record.ginner.phone : '-' : '-',
        // obj['Center'] = record.ginner ? record.ginner.center ? record.ginner.center : '-' : '-',
        obj['Type'] = record?.baleType ? record?.baleType : ' - ',
        obj['Total Bales'] = record?.noOfBales ? record?.noOfBales  : ' 0 ',
        obj['Available Quantity'] = record?.availableQuantity ? record?.availableQuantity  : '0',
        obj['Status'] = record?.status ? record?.status : ' - ',
        obj['Payment Status'] = record?.paymentStatus ? record?.paymentStatus :'-';
        let paymentInfo:PaymentInfo = {...record};
        paymentInfo.totalQuantity = record['receivedWeight']
        //paymentInfo.dueAmount = 100

        paymentInfo.displayTotalAmount = (record['netPayableAmount'])?.toString()
        paymentInfo.customerIdKey = "ginner"
        paymentInfo.productIdKey ="cottonBaleListing"
        paymentInfo.customerIdValue = `/ginner/${record?.ginnerId}`,
        paymentInfo.productIdValue = `/cottonbalelisting/${record?.id}`,
        paymentInfo.endpoint = "cottonsvc/ginnerpayout";
        obj['Payement Action'] =paymentInfo ,
        obj['editAction'] = {isHide:(record?.dueAmount < record?.netPayableAmount || (record?.availableQuantity < record?.netWeight) )} 
        this.CONSTANT.SELECT_ROW="RM ID";
        this.CONSTANT.EDIT_HIDE_ACTION ='editAction',
        this.CONSTANT.STATUS = 'Status'
        this.CONSTANT.PAYMENTSTATUS = 'Payment Status'
        this.CONSTANT.BALE_PURCHASE_PAYMENT_GENERIC ='Payement Action',
        this.balePOTableDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }
  refresh(){
    this.ngOnInit();
  }
  routeToCrud(){
    this.router.navigate([`/resha-farms/bale-purchases/crud`]);
     
   }

   checkIsValidCottonTypes(){
    this.map.forEach((value: string, key: string) => {
      if(!this.cottonTypesSelected.includes(value)){
       this.cottonTypesSelected.push(value);
      }
  });
  if(this.cottonTypesSelected.length>1){
    this.isValidCottonCombination=false;
  }else{
    this.isValidCottonCombination=true;
  }
  this.cottonTypesSelected=[];
  }
  
}
