import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ApiService } from 'src/app/services/api/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalService } from 'src/app/services/global/global.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { PaymentInfo } from '../../shared/generic-payment/generic-payment.component';
@Component({
  selector: 'app-pupae-lot-details',
  templateUrl: './pupae-lot-details.component.html',
  styleUrls: ['./pupae-lot-details.component.scss']
})
export class PupaeLotDetailsComponent implements OnInit {
  pupaeOrderDetails;
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private router: Router,
    public util: UtilsService,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    public globalService: GlobalService,
    public rolesService: RolesService,
    private ngxLoader : NgxUiLoaderService,
    private form :UntypedFormBuilder,
    private $gaService:GoogleAnalyticsService,
    ) { 

    }

    pupaeDetails;
  ngOnInit(): void {
    const { id } = this.route.snapshot.params;
    this.getPupaeDetailsById(id);
    this.getAllPupaeLotPayments(id);
  }

  getPupaeDetailsById(id:number){
    this.api.getPupaeDetailsById(id).then((res:any)=>{
     console.log(res);
     this.getPupaeSupplierById(res.pupaeSupplierId)
     let paymentInfo:PaymentInfo = {...res};
     paymentInfo.totalQuantity = res['sellingWeight']
     paymentInfo.displayTotalAmount = (res['netPaybleAmount'])?.toString()
     paymentInfo.customerIdKey = "pupaeSupplier"
     paymentInfo.productIdKey ="pupaeListing"
     paymentInfo.customerIdValue = `/pupaeSupplier/${res?.pupaeSupplierId}`,
     paymentInfo.productIdValue = `/pupaeListing/${res?.id}`,
     paymentInfo.endpoint = "pupaesvc/pupaesupplierpayout";
     this.pupaeOrderDetails = paymentInfo;
     this._cd.detectChanges();
    })
  }

  goBack(){
    this.router.navigate(['/resha-farms/rm-pupae-lot'])
  }

  khataList=[];
  getAllPupaeLotPayments(cottonOrderId){
    this.api.pupaeLotPaymentHistoryByOrderId(cottonOrderId).then(res=>{
      this.khataList=[];
      this.khataList = res['_embedded']['pupaesupplierpayout'];
      this._cd.detectChanges();
    })
  }

  routeToSupplier(){
    this.router.navigate(['/resha-farms/rm-pupae-suppliers/details',this.pupaeSupplier.id])
  }

  pupaeSupplier;
  getPupaeSupplierById(id:number){
    this.api.getPupaeSupplierById(id).then(res=>{
      this.pupaeSupplier = res;
      this._cd.detectChanges();
    })
  }
}
