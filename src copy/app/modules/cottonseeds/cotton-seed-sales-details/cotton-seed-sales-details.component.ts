import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { CottonApiService } from 'src/app/services/api/cotton-api.service';
import { ActivatedRoute, Params } from '@angular/router';
import { PaymentInfo } from '../../shared/generic-payment/generic-payment.component';



@Component({
  selector: 'app-cotton-seed-sales-details',
  templateUrl: './cotton-seed-sales-details.component.html',
  styleUrls: ['./cotton-seed-sales-details.component.scss']
})
export class CottonSeedSalesDetailsComponent implements OnInit {
  userType;
  id;
  seedsorderDetails:any;
  seedsSaleOrderPaymentDetails:any;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router:Router,
    private _cd: ChangeDetectorRef,
    private cottonApi: CottonApiService,
  ) { 
    
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
      }
    });
    this.getSeedsOrderById(this.id);
  }

  ngOnInit(): void {
    this.getSeedsOrderPaymentDetailsById(this.id);
    this._cd.detectChanges();
    this.getSeedsOrderById(this.id)
  }
  

  goBack(){
    this.router.navigate(['/resha-farms/cotton-seeds-order/list'])
  }
  getSeedsOrderById(id){
    this.cottonApi.getSeedsSalesOderById(id).then((res:any)=>{
      let paymentInfo:PaymentInfo = {...res};
      paymentInfo.displayTotalAmount = (res['netAmount'])?.toString();


      paymentInfo.productIdKey ="cottonSeedsSalesOrder",
      paymentInfo.productIdValue = `/cottonSeedsSalesOrder/${this.id}`,

      paymentInfo.customerIdKey ="oilMill",
      paymentInfo.customerIdValue = `/oilMill/${res?.oilMillId}`,

      paymentInfo.endpoint = "cottonsvc/oilmillpayment";
      this.seedsorderDetails = paymentInfo;
      this._cd.detectChanges();
    })
  }
  refresh(){
    this.ngOnInit()
  }

  getSeedsOrderPaymentDetailsById(id){
    this.cottonApi.getSeedsSalesOderPaymentsById(id).then(res=>{
      if(res){
        this.seedsSaleOrderPaymentDetails = res["_embedded"]["oilmillpayment"];
      }
    })
    this._cd.detectChanges();
  }
  

}
