import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ginner-details',
  templateUrl: './ginner-details.component.html',
  styleUrls: ['./ginner-details.component.scss']
})
export class GinnerDetailsComponent implements OnInit {

  ginnerDetails:any;
  userType:any;
  addressPresent: boolean;
  gstDetails: any[];

  gstNumber: any;


  gstform: any = new UntypedFormGroup({
    gstNumber: new UntypedFormControl('',[Validators.required, Validators.pattern("^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$")]),
    
  })

  constructor(public utils:UtilsService,
    private api:ApiService,
    private _cd:ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private ngxLoader : NgxUiLoaderService,
    private modalService: NgbModal,
    private router:Router,
    private toaster:ToastrService,
    private route:ActivatedRoute
    ) {
      this.addressPresent = false;
     }

  ngOnInit(): void {
    this.userType = JSON.parse(localStorage.getItem('_ud'));
    const { id } = this.route.snapshot.params;
    this.id = id;
    this.id&&this.ginnerDetailsById();
    this.id&&this.getAllCustomerTypes();
    this.id&&this.getAllGinnerKYC()
  }

  editGinner(){
    this.router.navigate(['/resha-farms/ginners/crud',this.ginnerDetails.id]);
  }

  goBack() {
    this.router.navigate(['/resha-farms/ginners']);
  }

  noOfKYCDocs;
  kycFlag = false;

  getAllGinnerKYC(){
    this.ngxLoader.stop();
    this.api.getAllFarmerKycDocList(this.id , 'ginner').then(res => {
      this.noOfKYCDocs = res['_embedded']['ginnerkyc'];
      if(this.noOfKYCDocs.length  > 0){
        this.kycFlag = true;
      }
    });
  }

  modalRef;
  closeResult;
  selectCustomerBoolean = false;
  kycCustomerTypes:any = [];
  selectedCustomerType = '';
  id;

  ginnerDetailsById(){
    this.api.getGinnerDetailsById(this.id).then((res:any)=>{
      this.gstDetails = [];
      this.ginnerDetails = res;
      this.ginnerDetails?.gstNumberProfileDetails?.forEach(item => {
        this.gstDetails?.push(item);
      })
      if (this.ginnerDetails?.address != null && this.ginnerDetails?.address?.pincode != "") {
        this.addressPresent = true;
      } else {
        this.addressPresent = false;
      }
      console.log(this.addressPresent);
      
      this._cd.detectChanges();
    })
  }

  openGSTPpopup(gstpopup) {
    this.gstNumber = '';
    this.modalRef = this.modalService.open(gstpopup)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  verifyGST() {
    let reqObj ={
      "gstnumber":this.gstNumber.trim(),
      "id":parseInt(this.id),
      "cottonVendorType":"GINNER_MILL"
    }
    this.api.updateMoreGstNumber(reqObj).then(response => {
      console.log(response);
      this.modalRef.close();
      this.ginnerDetailsById();
    }, error => {
      console.log(error);
    })
  }


  getAllCustomerTypes(){
    this.api.getAllCustomerTypes().then(res => {
      this.kycCustomerTypes = res['_embedded']['kyccustomer'];
      this._cd.detectChanges();
    });
  }

  onSelectOfCustomerType(item, contentDelete) {
    this.selectedCustomerType = item;
    if(contentDelete){
      this.modalRef = this.modalService.open(contentDelete);
    }
  }

  ConfirmDeleteRecord(){
    const params = {
      customerType:'/kyccustomer/' + this.selectedCustomerType,
     
    }

    this.toaster.success('change the customer type successfully', 'Ok', {
      timeOut: 3000,
      
    })
    
    this.api.patchGinner(this.id,params).then(res=>{
      this.modalRef.close;
      this.ginnerDetailsById();
      this.deleteRecord();
    })
  }

  deleteRecord(){
    this.api.deleteKYCByPerforma('kyc/ginner', this.id,'/cottonsvc').then(res=>{
      console.log('trigger delete',res);
  
      
      if(res){
        this.selectCustomerBoolean = false;
        this.ginnerDetailsById();
        this.modalRef.close();
      }
    })
  }

  selectCustomerType(){
    this.selectCustomerBoolean = true;
  }

  navigateToKyc(){
    if(this.ginnerDetails.customerTypeName){
      this.router.navigate(['/resha-farms/kyc-form',this.id,'ginner',this.ginnerDetails.customerTypeName])
    } else {
      this.snackBar.open( 'Please select customer type.', 'OK', {
        duration: 300
      })
    }
  }
}
