import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit,OnChanges {

  constructor(
    private route:ActivatedRoute,
    private api:ApiService,
    private _cd:ChangeDetectorRef,
    public utils:UtilsService,
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    private snackBar:MatSnackBar
    ) { 
  }
  ngOnChanges(changes: SimpleChanges): void {
   this.customerId && this.customerType && this.getDocList();
   this.mudraKycAddId && this.getMudraDocumentList();
  }

  @Input()
  refreshOtherComponent:boolean;
  
  @Input()
  customerType:string;
  
  @Input()
  customerId:number;

  @Input()
  apiServiceURL:string;

  @Input()
  mudraKycAddId:number;

  uploadedDocList:any [] = [];

  verifying:boolean = false;
  docIdPlaceholder;

  ngOnInit(): void {
    
  }

  navigateToResult(documentData){
    if(this.customerId){
      this.router.navigate(['resha-mudra/result/', this.customerType, this.customerId, btoa(JSON.stringify(documentData))])
    }else{
      this.router.navigate(['resha-mudra/result/', this.customerType, this.mudraKycAddId, btoa(JSON.stringify(documentData))])
    }
  }
  getDocList(){
    this.ngxLoader.stop();
    let API_ENDPOINT = this.customerType?.toLowerCase();
    this.apiServiceURL&&(API_ENDPOINT=this.apiServiceURL+'/'+this.customerType?.toLowerCase())
    this.api.getAllFarmerKycDocList(this.customerId,API_ENDPOINT).then((res:any[])=>{
      this.uploadedDocList = res['_embedded'][`${this.customerType?.toLowerCase()}kyc`];
      this._cd.detectChanges();
    })
  }

  verifyNow(doc:any){
    this.ngxLoader.stop();
    this.docIdPlaceholder = doc?.id
    if(!this.verifying){
      this.verifying = true;
      if(this.mudraKycAddId){
        this.api.verifyMudraKYCService('CUSTOMER',doc?.id).then(res=>{
          this.verifying = false;
          this.getMudraDocumentList();
        }).catch(err=>{
          this.snackBar.open(err?.error?.localizedMessage, 'Ok', {
            duration: 5000
          });
        }).finally(()=>{
          this.verifying = false;
        });
      } else {

        this.api.verifyKYCService(this.customerType,doc?.id).then(res=>{
          this.verifying = false;
          this.getDocList();
          //this.mudraKycAddId ?this.getMudraDocumentList():this.getDocList();
  
        }).catch(err=>{
          this.snackBar.open(err?.error?.localizedMessage, 'Ok', {
            duration: 5000
          });
        }).finally(()=>{
          this.verifying = false;
        });
      }
    }
  }

  getMudraDocumentList(){
    this.api.getAllMudraCustomerKycDocList(this.mudraKycAddId).then(res=>{
      this.uploadedDocList = res['_embedded']['customerkyc'];
      this._cd.detectChanges();
    })
  }
}
