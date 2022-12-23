import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { PaymentInfo } from '../../shared/generic-payment/generic-payment.component';

@Component({
  selector: 'app-pupae-order-details',
  templateUrl: './pupae-order-details.component.html',
  styleUrls: ['./pupae-order-details.component.scss']
})
export class PupaeOrderDetailsComponent implements OnInit {

  constructor(private api:ApiService,private route:ActivatedRoute,private router:Router,private _cd:ChangeDetectorRef,public util:UtilsService) { }

  ngOnInit(): void {
    const { id } = this.route.snapshot.params;
    this.getPupaeOrderDetails(id);
    this.getAllPupaeOrderPayments(id);
  }

  cottonOrderDetails:any;
  khataList =[];
  getPupaeOrderDetails(id:number){
    this.api.getPupaeOrdersById(id).then((res:any)=>{
    res?.pupaeBuyerId&&this.getPupaeBuyersById(res?.pupaeBuyerId);
    let paymentInfo:PaymentInfo = {...res};
    paymentInfo.totalQuantity = res['sellingWeight']
    paymentInfo.displayTotalAmount = (res['netAmount'])?.toString()
    paymentInfo.customerIdKey = "pupaebuyer"
    paymentInfo.productIdKey ="pupaeorder"
    paymentInfo.customerIdValue = `/pupaebuyer/${res?.pupaeBuyerId}`,
    paymentInfo.productIdValue = `/pupaeorder/${res?.id}`,
    paymentInfo.endpoint = "pupaesvc/pupaebuyerpayout";
    this.cottonOrderDetails = paymentInfo;
    this._cd.detectChanges();

    });
  }
  
  lotDetails(item){
    this.router.navigate(['/resha-farms/rm-pupae-lot/details/',item.pupaeLotId])
  }
  goBack(){
   this.router.navigate(['/resha-farms/pupae-order'])
  }

  getAllPupaeOrderPayments(pupaeOrderId){
    this.api.pupaeSalesOrderPaymentHistoryByOrderId(pupaeOrderId).then(res=>{
      this.khataList = res['_embedded']['pupaebuyerpayout'];
      this._cd.detectChanges();
    })
  }

  routeToBuyer(){
    this.router.navigate(['/resha-farms/rm-pupae-buyers/details',this.pupaeBuyer.id])
  }

  pupaeBuyer;
  getPupaeBuyersById(id:number){
    this.api.getPupaeBuyererById(id).then(res=>{
      this.pupaeBuyer = res;
      this._cd.detectChanges();
    })
  }


  refresh(){
    this.ngOnInit();
  }

}
