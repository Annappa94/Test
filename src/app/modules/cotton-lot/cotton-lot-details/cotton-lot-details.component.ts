import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Params, Router} from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { PaymentInfo } from '../../shared/generic-payment/generic-payment.component';

@Component({
  selector: 'app-cotton-lot-details',
  templateUrl: './cotton-lot-details.component.html',
  styleUrls: ['./cotton-lot-details.component.scss']
})
export class CottonLotDetailsComponent implements OnInit {

  constructor(private route:ActivatedRoute,private router: Router,private api:ApiService,private _cd:ChangeDetectorRef,public util:UtilsService) { }

  ngOnInit(): void {
    const { id } = this.route.snapshot.params;
    this.getCottonDetails(id);
    this.getAllCottonLotPayments(id);
  }

  cottonLotDetails:any;
  getCottonDetails(id:number){
    this.api.getCottonLotDetailsById(id).then((res:any)=>{
    let paymentInfo:PaymentInfo = {...res};
    paymentInfo.totalQuantity = res['lotWeight']
    paymentInfo.displayTotalAmount = (res['netPayableAmount'])?.toString()
    paymentInfo.customerIdKey = "farmerId"
    paymentInfo.productIdKey ="cottonLot"
    paymentInfo.customerIdValue = res?.farmerId,
    paymentInfo.productIdValue = `/cottonlot/${res?.id}`;
    paymentInfo.endpoint = "cottonsvc/cottonfarmerpayout";
    this.cottonLotDetails = paymentInfo;

    this._cd.detectChanges();
    })
  }


  getFarmerdetails() {
    this.router.navigate(['/resha-farms/cotton-farmers/details', this.cottonLotDetails.farmerId]);
  }

  goBack(){
   this.router.navigate(['/resha-farms/cottonlot'])
  }
  ginnerDetailes(){
    this.router.navigate(['/resha-farms/ginners/details',this.cottonLotDetails.ginnerId])
  }

  khataList=[];
  getAllCottonLotPayments(cottonOrderId){
    this.api.cottonLotPaymentHistoryByOrderId(cottonOrderId).then(res=>{
      this.khataList=[];
      this.khataList = res['_embedded']['cottonfarmerpayout'];
      this._cd.detectChanges();
    })
  }


  refresh(){
    this.ngOnInit();
  }

}
