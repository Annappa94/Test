import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { PaymentInfo } from '../../shared/generic-payment/generic-payment.component';

@Component({
  selector: 'app-cotton-order-details',
  templateUrl: './cotton-order-details.component.html',
  styleUrls: ['./cotton-order-details.component.scss']
})
export class CottonOrderDetailsComponent implements OnInit {

  constructor(private api:ApiService,private route:ActivatedRoute,private router:Router,private _cd:ChangeDetectorRef,public util:UtilsService) { }

  ngOnInit(): void {
    const { id } = this.route.snapshot.params;
    this.getCottonOrderDetails(id);
    this.getAllCottonOrderPayments(id);
  }

  cottonOrderDetails:any;
  khataList =[];
  getCottonOrderDetails(id:number){
    this.api.getCottonOrdersById(id).then((res:any)=>{
    this.getGinnerDetails(res?.ginnerId);
    let paymentInfo:PaymentInfo = {...res};
    paymentInfo.totalQuantity = res['sellingWeight']
    paymentInfo.displayTotalAmount = (res['netReceivableAmount'])?.toString()
    paymentInfo.customerIdKey = "ginner"
    paymentInfo.productIdKey ="cottonOrder"
    paymentInfo.customerIdValue = `/ginner/${res?.ginnerId}`,
    paymentInfo.productIdValue = `/cottonOrder/${res?.id}`,
    paymentInfo.endpoint = "cottonsvc/ginnerpayment";
    this.cottonOrderDetails = paymentInfo;
    this._cd.detectChanges();

    });
  }

  ginnerDetails;
  getGinnerDetails(id:number){
    this.api.getGinnerDetailsById(id).then(res=>{
      this.ginnerDetails = res;
      this._cd.detectChanges();
    });
  }
  
  lotDetails(item){
    this.router.navigate(['/resha-farms/cottonlot/details',item.cottonLotId])
  }
  goBack(){
   this.router.navigate(['/resha-farms/cotton-orders'])
  }

  getAllCottonOrderPayments(cottonOrderId){
    this.api.cottonSalesOrderPaymentHistoryByOrderId(cottonOrderId).then(res=>{
      this.khataList = res['_embedded']['ginnerpayout'];
    })
  }
  routeToGinner(){
    this.router.navigate(['ginners/details',this.ginnerDetails.id])
  }

  refresh(){
    this.ngOnInit();
  }
}
