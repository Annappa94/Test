import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-rm-center-audit',
  templateUrl: './rm-center-audit.component.html',
  styleUrls: ['./rm-center-audit.component.scss']
})
export class RmCenterAuditComponent implements OnInit {


  constructor(
    private apiSearch:SearchService,
    private utils:UtilsService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private route:ActivatedRoute,
  ) { }
  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;

  get rmCenterId(){
    return this.route.snapshot.paramMap.get("centerId");
  }


  tableHeaders:any=[
    {name:"ID", sortName:'id'},
    {name:"CENTER NAME", sortName:'centerName', sort:true},
    {name:"LOGISTICS COST /KG", sortName:'cocoonLotLogisticsCostPerKg', sort:true},
    {name:"WEIGHT LOSS", sortName:'cocoonLotWeightLoss', sort:true},
    {name:"BAG WEIGHT", sortName:'cocoonLotBagDeduction', sort:true},
    {name:'UPDATED DATE', sortName: 'lastModifiedDate',sort:true},
    {name:'UPDATED BY', sortName: 'lastModifiedBy',sort:true},
  ];

   CONSTANT = CONSTANT;

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    !initial && this.getCocoonPurchaseKhata(paginationData,searchText);
  }


  infoFromTable(info){
    const { edit,data,details,index,payNow,paymentDetailes} = info;
    console.log(data,payNow,paymentDetailes,index);
    details&&(this.routeToDetailspage(index));
  }
  
   routeToDetailspage(index){
    this.router.navigate([`crud/`,this.res[index]?.id]);
   }

   buildSerachQuery(searchText){
     
      return `(entityId == ${this.rmCenterId} and name==RMCenterAudit)`;
   }

  getCocoonPurchaseKhata(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getOrders(paginationData,'entityaudit',this.buildSerachQuery(searchText)).then(res=>{
      this.rowDataList = [];
      this.res = res['content'];
      res['content'].filter(record=>{
        const obj={};
        const { centerName, cocoonLotLogisticsCostPerKg, cocoonLotWeightLoss, cocoonLotBagDeduction, id,lastModifiedDate,lastModifiedBy} = record?.data;

        obj['ID'] = id ? id : ' - ',
        obj['CENTER NAME'] = centerName ? centerName : ' - ',
        obj['LOGISTICS COST /KG'] = cocoonLotLogisticsCostPerKg ? cocoonLotLogisticsCostPerKg.toLocaleString('en-IN')  : 0,
        obj['WEIGHT LOSS'] = cocoonLotWeightLoss ? cocoonLotWeightLoss.toLocaleString('en-IN') : 0,
        obj['BAG WEIGHT'] = cocoonLotBagDeduction ? cocoonLotBagDeduction.toLocaleString('en-IN') : 0,
        obj['UPDATED DATE'] = lastModifiedDate ? this.utils.getDisplayTime(lastModifiedDate)  : ' - ',
        obj['UPDATED BY'] = lastModifiedBy ? lastModifiedBy : ' - ',
        this.rowDataList.push(obj);
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }

  ngOnInit(): void {
    this.rmCenterId && this.getCocoonPurchaseKhata();
  }

}
