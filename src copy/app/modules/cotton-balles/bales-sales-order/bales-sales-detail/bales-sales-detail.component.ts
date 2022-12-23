import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PaymentInfo } from 'src/app/modules/shared/generic-payment/generic-payment.component';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';


@Component({
  selector: 'app-bales-sales-details',
  templateUrl: './bales-sales-detail.component.html'
})
export class BalesSalesDetailsComponent implements OnInit {
  data:any;
  res: any;
  CONSTANT: any;
  code;
  id;
  BalseSalePaymentDetails:any;
  saleOrderImage:any[]=[];

  constructor(
    private route: ActivatedRoute,
    private api:ApiService, 
    private router:Router,
    private ngxLoader:NgxUiLoaderService,
    private _cd: ChangeDetectorRef,
    public utils: UtilsService,
    private apiSearch:SearchService,
  ) {
    this.id = this.route.snapshot.params.id;
   }

  ngOnInit(): void {
    this.balesSalesOrderById();
    this._cd.detectChanges();
    this.getBalePaymentHistory();
  }

  balesSalesOrderById(){
    this.ngxLoader.stop();
    this.api.getBalesSalesOrderByID(this.id).then((res:any)=>{
      
      let paymentInfo:PaymentInfo = {...res};
        paymentInfo.totalQuantity = res['totalWeight']
        //paymentInfo.dueAmount = 100
        paymentInfo.displayTotalAmount = (res['netAmount'])?.toString()
        paymentInfo.customerIdKey = "spinningMill"
        paymentInfo.productIdKey ="cottonBaleSalesOrder"
        paymentInfo.customerIdValue = `/spinningmill/${res?.spinningMillId}`,
        paymentInfo.productIdValue = `/cottonbalesalesorder/${res?.id}`,
        paymentInfo.endpoint = "cottonsvc/spinningmillpayment";
        this.data = paymentInfo;
        this.saleOrderImage=res['cottonBaleSalesOrderImages'][0].url;
        this._cd.detectChanges();
    })
  }

  getBalePaymentHistory(){
    this.api.getBaleSalespayments(this.id).then(res=>{
        this.BalseSalePaymentDetails = res['_embedded']['spinningmillpayment'];
    })
  }

  goBack(){
    this.router.navigate(['/bale-sales'])
  }
  refresh(){
    this.ngOnInit();
  }
  routeToLotDetailsPage(lotId){
    this.router.navigate(['/bale-purchases/details/'+ lotId])
  }

  // getBaleDetails(){
  //   this.api.getBalesSalesOrderByID(this.id).then(res=>{
  //   let paymentInfo:PaymentInfo = {...res};
  //   paymentInfo.displayTotalAmount = (res['totalAmount'])?.toString()
  //   })
  // }

}
