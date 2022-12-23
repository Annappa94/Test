import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { PaymentInfo } from 'src/app/modules/shared/generic-payment/generic-payment.component';

@Component({
  selector: 'app-purchase-inventory',
  templateUrl: './purchase-inventory.component.html',
  styleUrls: ['./purchase-inventory.component.scss']
})
export class PurchaseInventoryComponent implements OnInit {

  paginationData = {
    currentPage: 0,
    pageSize: 10,
    total: 0,
    pages: [],
    currentColumn: 'createdDate',
    currentDirection: 'desc',
  };
  modalRef: any;
  closeResult: string;
  modelImageUrl: any;
  expandImage: boolean;
  balePurchaseList: any [];
  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    private apiSearch:SearchService,
    private utils:UtilsService,
    private modalService: NgbModal,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    public globalService:GlobalService
  ) { 
    
  }
  stockcreateform: UntypedFormGroup = new UntypedFormGroup({
    vehiclceimage: new UntypedFormControl(''),
    fromdate: new UntypedFormControl(''),
    todate: new UntypedFormControl(''),
    numberofbales: new UntypedFormControl(''),
    driverName: new UntypedFormControl(''),
    vehicleId: new UntypedFormControl(''),
    logesticCost: new UntypedFormControl(''),
    totalCost:new UntypedFormControl(''),
    fromWarehouseId:new UntypedFormControl(''),
    toWarehouseId :new UntypedFormControl(''),
    driverId:new UntypedFormControl(''),
    address:new UntypedFormControl(''),
    weight:new UntypedFormControl('')
 


  })

  ngOnInit(): void {
    this.getBalePurchasesList()
  }

  async onPageChange(page) {
    this.paginationData.currentPage = page;
  
  }
  async onPageSizeChange() {
  }
  stock(stocktransfer) {
    this.modalRef = this.modalService.open(stocktransfer)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  showImage(imageUrl) {
    if (imageUrl) {
      this.modelImageUrl = null;
      this.getprotectedUrl(imageUrl);
      this.expandImage = true;
    }
  }
  async getprotectedUrl(imgUrl) {
    const { targetUrl }: any = await this.api.getPresignedUrlForViewImage(imgUrl);
    this.modelImageUrl = targetUrl;
    this._cd.detectChanges()
  }
  onImageUpload(image) {
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        let previewImage = reader.result as string;
        this.getS3CatUrl(file.type, file);
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  imageLoading: boolean = false;
  async getS3CatUrl(fileType, file) {
    try {
      this.imageLoading = true;
      this._cd.detectChanges()
      await this.api.getKYCPresignedUrl(`kyc_farmer`, fileType.split('/')[1], 122, "kyc").then((res: any) => {
        this.calluploadImageToS3APICate(res.targetUrl, file, res.fileName);
        this.imageLoading = false;
      })
    } catch (err) {
      this.stockcreateform.get('vehiclceimage').patchValue('')
      this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this.imageLoading = false;
      this._cd.detectChanges()
    }
  }

  async calluploadImageToS3APICate(s3url: String, file, fileNameFromS3: String) {
    try {
      this.imageLoading = true;
      this._cd.detectChanges()
      await this.api.updateImageToS3Directly(s3url, file).then((res: any) => {
        this.stockcreateform.get('vehiclceimage').patchValue(fileNameFromS3)
        this.imageLoading = false;
        this._cd.detectChanges();
      });
    } catch (err) {
      this.imageLoading = false;
      this.stockcreateform.get('vehiclceimage').patchValue('')
      this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges()
    }
  }
  buildSerachQuery(searchText:any){
    const {status,cottonType,paymentStatus} = this.stockcreateform.value;
    let query = `(status=in=${status} and baleType=in=${cottonType} and paymentStatus=in=${paymentStatus}`;
      if (searchText) {
      let text=searchText.replace(/ /gi,"*");
      let query:String=`(`;
      (query+=`((ginner.name==*${text}* or ginner.phone==*${text}*) and status=in=${status} and paymentStatus=in=${paymentStatus} and baleType=in=${cottonType}`);
      searchText.toString()?.toUpperCase()?.includes('RMCOBP')&&!isNaN(searchText.substring(6))&&(query+=` or id==${searchText.substring(6)}`)
      !isNaN(parseInt(searchText))&&(query+=` or id==${searchText}`)
      query+='))';
      return query;
    }
    // (this.ginnerId && (query+= ` and ginner.id==${this.ginnerId}`))
    // query+=')'
    // return query;

  }
  getBalePurchasesList(){
    this.ngxLoader.stop();
    this.api.getBalePurchases().then(res=>{
      this.balePurchaseList=res['content']
     
    })
  }


}
