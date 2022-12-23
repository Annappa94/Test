import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import { ApiService } from 'src/app/services/api/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SearchService } from 'src/app/services/api/search.service';
import { S3UrlResponse } from 'src/app/model/types/type.model';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

@Component({
  selector: 'app-chawki-orders',
  templateUrl: './chawki-orders.html',
  styleUrls: ['./chawki-orders.component.scss']
})
export class ChawkiOrdersComponent implements OnInit {

  chawkiOrders = [];
  searchText = '';
  fileName= 'chawki-orders-list.xlsx';  
  user: any;

  // table features
  activeSort = '';
  searchedChawkiOrders = [];
  filteredChawkiOrdersList = [];
  paginationData = {
    currentPage : 0,
    pageSize    : 10,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  };

  tableHeader = {
    id: 0,
    "fmr.name": 0,
    "fmr.phone": 0,
    "chawki.name": 0,
    "chawki.phone": 0,
    inputOrderStatus: 0,
    paymentStatus: 0,
    chawkiPayoutStatus: 0,
    createdDate:0,
    chawkiType: 0,
    pricePerDFL: 0,
    totalDFLs: 0,
    totalDiscount: 0,
    totalAmount: 0,
    cartId:0
  };
  // selectedOrderStatus : any = 'New'
  selectedStatus = '(Pending,Paid)';
  selectedChawkiPayoutStatus = '(Pending,Paid)';
  selectedOrderStatus : any = '(New,Processing,Shipped,Delivered,NotConnected,Completed,Cancelled)'
  markSoldItem;
  modalRef;
  closeResult
  followUpStatus = '';
  order;
  selectedChawkiOrderStatus = 'New';
  chawkiPaymentStatus = 'Pending';
  paymentForm:UntypedFormGroup;
  searchTextOrderId;

  countAPIRequest = 0
  countAPIResponse = 0;
  imageUpload;
  s3ImageUrl:UntypedFormControl = new UntypedFormControl('')
  trainingCertificateImgFile: any;
  trainingCertificateFilePreviewImage: string;
  trainingCertificateImgUploaded: boolean;
  modelImageUrl: any;
  expandImage: boolean;
  getprotectedUrl: any;
  id: any;
  nurseryAreaPhotoImgFile: any;
  chawkiDetails: any;
  preImgUrl: String;
  upload: Object;
  fileType: any;
  uploadedFile: void;
  constructor(
    private api: ApiService,
    private utils: UtilsService,
    private _cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private router: Router,
    public rolesService: RolesService,
    private modalService: NgbModal,
    private ngxLoader : NgxUiLoaderService,
    private form :UntypedFormBuilder,
    private searchAPI:SearchService,
    private $gaService:GoogleAnalyticsService
  ) {
    this.user = JSON.parse(localStorage.getItem('_ud'));
    this.getAllChawkiOrders();
  }

  ngOnInit(): void {
    this.paymentFormInt();
  }

  paymentFormInt(){
    this.paymentForm = this.form.group({
      referenceNumber:['',Validators.required],
      amount:['',Validators.required]
    })
  }

  createNewOrder() {
    this.router.navigate(['/resha-farms/chawki-orders/crud']);
  }

  async createCocoonOrderData(ordersList) {
    this.chawkiOrders = [];
    for (let i = 0; i < ordersList.length; i++) {
      // const buyerUrl = ordersList[i].chawkiOrderReceipts?.find(record=>record.receiptName=="Buyer")?.url;

      this.chawkiOrders.push({
        id: ordersList[i].id,
        code: ordersList[i].code,
        cartId: ordersList[i].cartId,
        createdDate: ordersList[i].createdDate ? this.utils.getDisplayTime(ordersList[i].createdDate) : '-',
        totalDFLs: ordersList[i].totalDFLs,
        displayTotalDFLs: ordersList[i].totalDFLs.toLocaleString('en-IN'),
        pricePerDFL: ordersList[i].pricePerDFL,
        displayPricePerDFL: ordersList[i].pricePerDFL.toLocaleString('en-IN'),
        totalDiscount: ordersList[i].totalDiscount ? (ordersList[i].totalDiscount).toFixed(2) : 0,
        totalAmount: ordersList[i].totalAmount,
        displayTotalAmount: ordersList[i].totalAmount.toLocaleString('en-IN'),
        netAmount: ordersList[i].totalAmount - ordersList[i].totalDiscount,
        displayNetAmount: ordersList[i].totalAmount.toLocaleString('en-IN'),
        deliveryDate: ordersList[i].deliveryDate ? this.utils.getDisplayTime(ordersList[i].deliveryDate) : '-',
        sortDeliveryDate: ordersList[i].deliveryDate ? ordersList[i].deliveryDate  : 0,
        paymentStatus: ordersList[i].paymentStatus.toLowerCase(),
        invoiceURL : ordersList[i].invoiceURL ? ordersList[i].invoiceURL : null,
        crcBillUrl:ordersList[i]?.crcBillUrl ? ordersList[i]?.crcBillUrl : null,

        // invoiceURL : buyerUrl?buyerUrl:null,

        
        status: ordersList[i].inputOrderStatus.toLowerCase(),

        farmerName: ordersList[i]['farmerName']  ? ordersList[i]['farmerName'].toLowerCase() : '-',
        farmerPhone: ordersList[i]['farmerPhone'] ? ordersList[i]['farmerPhone'] : '-',
        farmerId: ordersList[i]['farmerId'] ? ordersList[i]['farmerId']  : '-',
        chawkiName: ordersList[i]['chawkiName'] ? ordersList[i]['chawkiName'] : '-',
        chawkiPhone: ordersList[i]['chawkiPhone'] ? ordersList[i]['chawkiPhone'] : '-',
        chawkiId: ordersList[i]['chawkiId'] ? ordersList[i]['chawkiId'] : '-',
        chawkiType: ordersList[i].chawkiType ? ordersList[i].chawkiType.toLowerCase() : '-',
        chawkiPayoutStatus: ordersList[i]['chawkiPayoutStatus'] ? ordersList[i]['chawkiPayoutStatus'].toLowerCase() : '-',
        totalPayableAmount:ordersList[i].totalPayableAmount,
        // displayTotalPayableAmount: ordersList[i].totalPayableAmount.toLocaleString('en-IN'),

      })
    }
    this.refreshTable(this.chawkiOrders);
    this._cd.detectChanges();
  }

  buildSearchQuery(searchText:any,orderStatus:any=false,paymentStatus:any=false, chawkiPayoutStatus: any=false){
    let text = searchText.replace(/ /gi, "*");
    let setItInQuery: any = `(`;
    (searchText && (setItInQuery += `(chawki.name==*${text}* or fmr.name==*${text}* or fmr.phone==*${text}* or payment.razorpayPaymentId==*${text}*`));

    if(!isNaN(parseInt(searchText))) {
      (setItInQuery += ` or id==${text})`)
    } else if(searchText&&isNaN(parseInt(searchText))) {
      (setItInQuery += `)`)
    }


    if(orderStatus) {
      if(searchText) {
        (orderStatus) && (setItInQuery += ` and (inputOrderStatus=in=${orderStatus}`);
      } else {
          (orderStatus) && (setItInQuery += `(inputOrderStatus=in=${orderStatus}`);
      }
    }

    (paymentStatus) && (setItInQuery += ` and paymentStatus=in=${paymentStatus}`);

    (chawkiPayoutStatus) && (setItInQuery += ` and chawkiPayoutStatus=in=${chawkiPayoutStatus}`)

    setItInQuery += '))';

    if(searchText&&searchText.toUpperCase().includes('RMCWKIODR')&&(!isNaN(parseInt(searchText.substring(9))))) {
      setItInQuery = '';
      (setItInQuery+=(`id==${parseInt(searchText.substring(9))}`));
    }

    return setItInQuery;
  }

  isOrderStatus(tempText){
    return tempText=='New'|| tempText=='Processing'||tempText=='Shipped'||tempText=='NotConnected'||tempText=='Completed'||tempText=='Cancelled';
  }

  isPaymentStatus(tempText){
    return tempText=='Paid'|| tempText=='Pending';
  }
  async getAllChawkiOrders(){
    this.chawkiOrders = [];
    this.ngxLoader.stop();
    this.searchAPI.getAllChawkiOrder(this.buildSearchQuery(this.searchText,this.selectedOrderStatus,this.selectedStatus, this.selectedChawkiPayoutStatus),this.paginationData.currentColumn,this.paginationData.currentDirection,this.paginationData.currentPage ,this.paginationData.pageSize).then((res:any) => {
        const ordersList = res['content'];
        this.paginationData.total = res.totalElements;
        this.createCocoonOrderData(ordersList);
        this._cd.detectChanges();


    });

  }

  async refreshTable(list) {
    this.filteredChawkiOrdersList = [];
    const pagesLength = this.paginationData.total / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
 
    this.filteredChawkiOrdersList = list;
    this._cd.detectChanges();
  }

  async onSort(column) {
    this.activeSort = column;
    this.paginationData.currentColumn = column;
    if (this.tableHeader[column] === 0) {
      this.paginationData.currentDirection = 'desc';
      this.tableHeader[column] = 1;
    } else {
      this.paginationData.currentDirection = 'asc';
      this.tableHeader[column] = 0;
    }
    this.activeSort = column;
    this.paginationData.currentPage = 0;
     this.getAllChawkiOrders();
  }


  async onPageChange(page) {
    this.paginationData.currentPage = page;
    this.getAllChawkiOrders();
  }

  async onSearch() {
    this.paginationData.currentPage = 0;
    this.getAllChawkiOrders();
  }

  async onPageSizeChange() {
    this.getAllChawkiOrders();
  }

  async onChangeStatus(value) {
    this.searchText = '';
    this.selectedStatus = value;
    this.getAllChawkiOrders();
  }

  onChangeChawkiPayoutStatus(value) {
    this.searchText = '';
    this.selectedChawkiPayoutStatus = value;
    this.getAllChawkiOrders();
  }
  
  onChangeOrderStatus(value) {
    this.searchText = '';
    this.selectedOrderStatus = value;
    this.getAllChawkiOrders();
  }

 
  formatPrice(price){
    const formatPrice = price.replace(/[, ]+/g, "").trim();    
    return +formatPrice;
    
  }

  openPopUp(content, status, order) {
    this.followUpStatus = status.target.value;
      this.order = order;
      this.modalRef = this.modalService.open(content)
      this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
          this.closeResult = `Dismissed`;
      });
  }
  onImageUpload(image) {
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        let previewImage = reader.result as string;
        this.imageUpload = previewImage;
        this._cd.detectChanges();
      };
 
      
      this.getS3Url(file.type,file);
      reader.readAsDataURL(file);
      image.target.value =''
     }
  }

  async getS3Url(fileType,file){
  
    
    try{
      this.countAPIRequest++;
      this._cd.detectChanges();
      await this.api.getCRCBillS3Url(fileType.split('/')[1], this.order.id).then((res:S3UrlResponse)=>{
        this.countAPIResponse++;
        this._cd.detectChanges();
        this.calluploadImageToS3API(res.targetUrl,file,res.fileName);
     });
    }catch(err){
      this.countAPIResponse++;
      this.imageUpload = ''
      this.snackBar.open('please  upload image to save', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges()
    }
  }


  async calluploadImageToS3API(s3url:String,file,fileNameFromS3:String){
    try{
      this.countAPIRequest++;
      this._cd.detectChanges();
      await this.api.updateImageToS3Directly(s3url,file).then(res=>{
        this.upload=res;
        this.countAPIResponse++;
        this.imageUpload = fileNameFromS3;
        this.s3ImageUrl.patchValue(fileNameFromS3);
        this.crcImageConfirm()
        this.modalRef.close();
        this._cd.detectChanges()
        });
    }catch(err){
      this.countAPIResponse++
       this.imageUpload = ''
      this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges();
    }
  }

  onCancel() {
    this.modalRef.close();
    this.imageUpload = ''
    this.getAllChawkiOrders();
  }

  markProcessing() {
    const reqObj = {
        inputOrderStatus: this.followUpStatus
    }
    if(this.followUpStatus === 'Completed' && this.imageUpload){
      reqObj['crcBillUrl'] = this.imageUpload;
    }
    this.ngxLoader.stop();
    this.api.updateChawkiOrder(reqObj, this.order.id).then(response => {

        this.modalRef.close();
        this.snackBar.open('Updated  Image Successfully' + this.followUpStatus.toLowerCase() + ' .', 'Ok', {
            duration: 3000
        });
        
        this.getAllChawkiOrders();
        

    }, err => {
        this.snackBar.open('Failed to mark order'  + this.followUpStatus.toLowerCase() + ' .', 'Ok', {
            duration: 3000
        });
        console.log(err);
    })

}


  OrderDetail(order) {
    this.router.navigate(['/resha-farms/chawki-orders/details', order.id]);
  }

  farmerDetail(order) {
    this.router.navigate(['/resha-farms/farmers/details', order.farmerId]);
  }

  chawkiDetail(order) {
    this.router.navigate(['/resha-farms/chawki/details', order.chawkiId]);
  }

  markSoldConfirmation(content, item) {
    this.markSoldItem = item;
    this.highlightText = this.markSoldItem['displayTotalAmount'].split('.');
    this.markSoldItem.referenceNumber = '';
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  markAsSold() {
    const param = {
      paymentStatus : "Paid",
        payment: {
          amount: this.markSoldItem.totalAmount,
          referenceNumber: this.markSoldItem.referenceNumber,
          isOutOfBand: true,
          paymentOn: Date.parse(new Date().toString())
      }
    }
    this.ngxLoader.stop();
    this.api.updateChawkiOrder(param, this.markSoldItem.id).then(res => {
      this.$gaService.event('Chawki payment', ` amount =  ${param.payment.amount}`);
        this.getAllChawkiOrders();
      this.modalRef.close();
      this.snackBar.open('Paid Suceessfully', 'Ok', {
        duration: 3000
      });
    })
  }
  highlightText;
  chawkiPayoutConfirmation(chawkiPayout, item) {    
    this.markSoldItem = item;
    this.paymentForm.get('amount').patchValue(item.totalPayableAmount);
    this.highlightText = item.totalPayableAmount;
    this.markSoldItem.referenceNumber = '';
    this.modalRef = this.modalService.open(chawkiPayout);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }


  makeChawkiPayout() {
    const param = {
      chawkiPayout: {
        amount: this.paymentForm.get('amount').value,
        referenceNumber: this.paymentForm.get('referenceNumber').value,
        isOutOfBand: true,
        paymentOn: Date.parse(new Date().toString())
    }
  }
  this.ngxLoader.stop();
  this.api.updateChawkiOrder(param, this.markSoldItem.id).then(res => {
    this.$gaService.event('Chawki payout', ` amount =  ${param.chawkiPayout.amount}`);
      this.getAllChawkiOrders();
    this.modalRef.close();
    this.snackBar.open('Paid Suceessfully', 'Ok', {
      duration: 3000
    });
  })
  }

  controlHasErrorForChawki(validation, controlName): boolean {
    const control = this.paymentForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlValidForChawki(controlName: string): boolean {
    const control = this.paymentForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForChawki(controlName: string): boolean {
    const control = this.paymentForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
  chawkiImage(image, item) {    
    this.order = item;
    this.imageUpload="";
    this.modalRef = this.modalService.open(image);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  crcImageConfirm() {
    const reqObj = {
      crcBillUrl: this.imageUpload,
    }
    this.ngxLoader.stop();
    this.api.updateChawkiOrder(reqObj, this.order.id).then(response => {

        this.modalRef.close();
        this.snackBar.open('Image uploded successfully  ' + this.followUpStatus.toLowerCase() + ' .', 'Ok', {
            duration: 3000
        });
        
        this.getAllChawkiOrders();
        

    }, err => {
        this.snackBar.open('Failed to mark order'  + this.followUpStatus.toLowerCase() + ' .', 'Ok', {
            duration: 3000
        });
        console.log(err);
    })

}
onCrcImageUpload(image) {
  if (image) {
    const file = image.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      let previewImage = reader.result as string;
      this.imageUpload = previewImage;
      this._cd.detectChanges();
    };  
    this.fileType = file.type;
    this.uploadedFile = file;
    reader.readAsDataURL(file);
    image.target.value =''
   }
}
onImageConfirm(){
  this.getS3Url(this.fileType,this.uploadedFile);
}


}
