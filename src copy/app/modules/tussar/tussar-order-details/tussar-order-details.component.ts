import { Component, OnInit,ChangeDetectorRef, EventEmitter, Output  } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-tussar-order-details',
  templateUrl: './tussar-order-details.component.html',
  styleUrls: ['./tussar-order-details.component.scss']
})
export class TussarOrderDetailsComponent implements OnInit {
  id;
  orderDetails;
  reelerDetails;
  lotList;
  reelerKhata = [];
  modalRef: any;
  closeResult: string;
  paymentDetail: any;
  user: any;
  multiRole = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private utils: UtilsService,
    private _cd: ChangeDetectorRef,
    form: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private modalService: NgbModal,
    public globalService: GlobalService,
    public rolesService: RolesService,
    private ngxLoader : NgxUiLoaderService,
    private $gaService:GoogleAnalyticsService,
  ) {
    this.user = JSON.parse(localStorage.getItem('_ud'));
    this.multiRole = this.user.roles;
    if(this.multiRole.length == 2 && this.multiRole.includes('COperationsAgent') && this.multiRole.includes('COCOON_PROCUREMENT_EXEC') && this.multiRole.includes('COCOON_SALES_EXEC') && this.multiRole.includes('FinanceManager')){
      this.user.role = 'COperationsAgent,COCOON_PROCUREMENT_EXEC,COCOON_SALES_EXEC,FinanceManager'
    }
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.getTussarOrderById(this.id);
      }
    });
   }

  ngOnInit(): void {
  }
  getTussarOrderById(id) {
    this.ngxLoader.stop();
    this.api.getTussarSalesOrderById(id).then(res => {
      this.orderDetails = res;
      this.orderDetails.createdDate =  this.orderDetails.createdDate ? this.utils.getDisplayTime(this.orderDetails.createdDate) : '-',
      this.orderDetails.lastModifiedDate =  this.orderDetails.lastModifiedDate ? this.utils.getDisplayTime(this.orderDetails.lastModifiedDate) : '-',
      this.lotList = res['tussarSalesOrderItems'];
      // if(this.lotList && this.lotList.length) {
      //   for(let i=0;i<this.lotList.length;i++) {
      //     this.lotList[i].displayCocoonType = this.lotList[i].cocoonLot.type ? this.globalService.getDisplayCocoonType(this.lotList[i].cocoonLot.type) : '-';
      //   }
      // }
      
      this.getReelerDetailsById(this.orderDetails?.reelerData?.id);
      this._cd.detectChanges();
    })
  }

  getReelerDetailsById(reelerId) {
    this.ngxLoader.stop();
    this.api.getReelerById(reelerId).then(res => {
      this.reelerDetails = res;
      // this.getReelerKhata();
      this._cd.detectChanges();
    })
  }

  farmerDetail(item) {
    this.router.navigate(['/resha-farms/farmers/details', item.farmerId]);
  }
  
  lotDetail(item) {
    // this.router.navigate(['/farmer-details', item.farmerId]);
  }

  goToReelerDetails() {
    this.router.navigate(['/resha-farms/tussar/tussar-reeler-details', this.reelerDetails['reeler'].id]);
  }

  getReelerKhata() {
    this.ngxLoader.stop();
    this.api.getReelerKhata(this.orderDetails.id).then(res => {
      const khata= res['_embedded']['reelerpayment'];
      this.reelerKhata = [];
      for (let i = 0; i < khata.length; i++) {
        this.reelerKhata.push({
          amount: khata[i].amount,
          referenceNumber: khata[i].referenceNumber,
          paymentOn: khata[i].createdDate ? this.utils.getDisplayTime(khata[i].createdDate) : '-',
        })
        }
      this._cd.detectChanges();
    })
  }

  goBack() {
    this.router.navigate(['/resha-farms/tussar/tussar-order-list']);
  }

  lotDetails(item) {
    this.router.navigate(['/resha-farms/cocoon-lot/details', item.cocoonLotId]);
  }

  deleteOrder() {
    this.ngxLoader.stop();
    this.api.deleteTussarSalesOrderOrderById(this.orderDetails.id).then(success => {
      this.modalRef.close();
      this.snackBar.open('Order Deleted Successfully', 'Ok', {
        duration: 3000,
      });
    this.router.navigate(['/resha-farms/tussar/tusaar-order-list']);
    })
  }

  deleteConfirmatin(deleteLot) {
    this.modalRef = this.modalService.open(deleteLot)
          this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed`;
          });
  }

  listenAndRefresh(){
    this.getReelerKhata();
    this.getTussarOrderById(this.id);
  }

}
