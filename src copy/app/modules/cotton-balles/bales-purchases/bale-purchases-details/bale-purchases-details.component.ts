import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PaymentInfo } from 'src/app/modules/shared/generic-payment/generic-payment.component';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-bale-purchases-details',
  templateUrl: './bale-purchases-details.component.html',
  styleUrls: ['./bale-purchases-details.component.scss']
})
export class BalePurchasesDetailsComponent implements OnInit {

  data:any;
  res: any;
  CONSTANT: any;
  code;
  id;
  moistureImage:any;
  baleImage:any;
  weighBridgeSlipImage:any;
  testReportImage:any;
  cottonBaleImages:any[]=[];
  BalseSaleDetails: any;
  BalsePurchaseSaleDetails:any=[];

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
    this.balesPoPerformaById();
    this.orderListing();
   this.getBalePaymentHistory();
  }

  loadImages(){

    
      for(let o of this.cottonBaleImages){
        if(o['tag'].includes("moistureImage")){
          this.moistureImage=o['url'];
        }
        if(o['tag'].includes("baleImage")){
          this.baleImage=o['url'];
        }
        if(o['tag'].includes("weighBridgeSlipImage")){
          this.weighBridgeSlipImage=o['url'];
        }
        if(o['tag'].includes("testReportImage")){
          this.testReportImage=o['url'];
        }
      }
    
  }

  balesPoPerformaById(){
    this.ngxLoader.stop();
    this.api.getBalePurchaseById(this.id).then((res:any)=>{
      
      let paymentInfo:PaymentInfo = {...res};
      paymentInfo.totalQuantity = res['receivedWeight']
        //paymentInfo.dueAmount = 100
        paymentInfo.displayTotalAmount = (res['netPayableAmount'])?.toString()
        paymentInfo.customerIdKey = "ginner"
        paymentInfo.productIdKey ="cottonBaleListing"
        paymentInfo.customerIdValue = `/ginner/${res?.ginnerId}`,
        paymentInfo.productIdValue = `/cottonbalelisting/${res?.id}`,
        paymentInfo.endpoint = "cottonsvc/ginnerpayout";
        this.data = paymentInfo;
        this.cottonBaleImages=res['cottonBaleImages'],
        
        this._cd.detectChanges();
        
        if(this.cottonBaleImages.length>0){
          this.loadImages();
          }
       
    })
  }

  getBalePaymentHistory(){
    this.api.getBalePurchasepayments(this.id).then(res=>{
        this.BalseSaleDetails = res['_embedded']['ginnerpayout'];
        
    })
  }

  orderListing(){
    this.api.getOrderListing(this.id).then(res=>{
        this.BalsePurchaseSaleDetails = res['_embedded']['cottonbalesalesorder'];

        
    })
  }

  goBack(){
    this.router.navigate(['/resha-farms/bale-purchases'])
  }
  refresh(){
    this.ngOnInit();
  }

  routeToDetailsPage(lotId){
    this.router.navigate(['/resha-farms/bale-sales/details/'+ lotId])
  }
}
