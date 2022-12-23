import { ChangeDetectorRef, Inject, LOCALE_ID, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';


const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
const compareDate = (v1, v2) => new Date(v1) < new Date(v2) ? -1 : new Date(v1) > new Date(v2) ? 1 : 0;

@Component({
  selector: 'app-chawki-view',
  templateUrl: './chawki-view.component.html',
  styleUrls: ['./chawki-view.component.scss']
})
export class ChawkiViewComponent implements OnInit {
  chawkiList = [];
  searchedChawkis = [];
  filteredChawkiList = [];
  searchText = '';
  activeSort = '';
  datePipe;
  deleteChawki;
  modalRef;
  closeResult: string;
  fileName = 'chawki-list.xlsx';

  paginationData = {
    currentPage : 0,
    pageSize    : 10,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  };
  tableHeader = {
    id: 1,
    name: 0,
    phone: 0,
    isApproved: 0,
    createdDate: 0
  };
  totalElements: any;
  role:any;
  constructor(
    private api: ApiService,
    private utils: UtilsService,
    private router: Router,
    private _cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    public globalService: GlobalService,
    @Inject(LOCALE_ID) private locale: string,
    public dialog: MatDialog,
    private ngxLoader : NgxUiLoaderService
  ) { }
  filterForm:UntypedFormGroup = new UntypedFormGroup({
    status:new UntypedFormControl(''),
  })

  ngOnInit() {
    this.listenForFilterChanges();
    this.getChawkiList();
    this.role = JSON.parse(localStorage.getItem('_ud'))['role'];
  }
  listenForFilterChanges(){
    this.filterForm.valueChanges.subscribe(value=>{
     // console.log(value);
     this.getChawkiList();
    })
  }

  getTypeIndex(chawkiTypes, type) {
    for(let i=0; i < chawkiTypes.length; i++) {
      if(chawkiTypes[i].type == type && chawkiTypes[i].price > 0) {
        return i;
      }
    }
    return -1 ;
  }

  buildSearchQuery(searchText:any=''){
    const { status} = this.filterForm.value;
    // if(searchText) {
    //   let text=searchText.replace(/ /gi,"*");
    //   let setItInQuery:String=`(`;
    //   (setItInQuery+=`(name==*${text}* or phone==*${text}* or isApproved ==*${status}`);
    //   searchText.toString()?.toUpperCase()?.includes('RMCHAWKI')&&!isNaN(parseInt(searchText.substring(8)))&&(setItInQuery+=` or id==${searchText.substring(8)}`)
    //   !isNaN(parseInt(searchText))&&(setItInQuery+=` or id==${searchText}`)
    //   setItInQuery+=') and phone!=*DELETED* )';
    //   return setItInQuery;
    // } else {
    //   return 'phone!=*DELETED*';
    // }

    let query = `(phone!=*DELETED* `;
      if (searchText) {
       let text=searchText.replace(/ /gi,"*");
       let query:String=`(`;
       (query+=`(((name==*${text}* or phone==*${text}*)`);
       searchText.toString()?.toUpperCase()?.includes('RMCHAWKI')&&!isNaN(searchText.substring(8))&&(query+=` or id==${searchText.substring(8)}`)
       !isNaN(parseInt(searchText))&&(query+=` or id==${searchText}`)
       query+=') and phone!=*DELETED* )';
       status&&(query+=` and isApproved==${status}`);
       query+=')';
       return query;
     }
     status&&(query+=` and isApproved==${status}`);
     query+=')'
     return query;
  }

  async getChawkiList() {
    this.chawkiList = [];
    this.ngxLoader.stop();
    this.api.getChawkiList(this.buildSearchQuery(this.searchText),this.paginationData.currentColumn,this.paginationData.currentDirection,this.paginationData.currentPage ,this.paginationData.pageSize).then((res:any) => {
      this.paginationData.total = res.totalElements;
      if (res && res['content']) {
        res['content'].forEach(element => {
          let pricePerDFLForWhite = 0;
          let pricePerDFLForGold = 0;
          let chawkiTpe;
          let buyingPrice = 0;
          let sellingPrice = 0;
          let priceOfWhiteIndex = this.getTypeIndex(element['chawkiTypes'],'WHITE')
            if(priceOfWhiteIndex > -1) {
              pricePerDFLForWhite = element['chawkiTypes'][priceOfWhiteIndex]['price'];
              chawkiTpe = element['chawkiTypes'][priceOfWhiteIndex]['type'];
              buyingPrice = element['chawkiTypes'][priceOfWhiteIndex]['crcPrice'];
              sellingPrice = element['chawkiTypes'][priceOfWhiteIndex]['sellingPrice'];

            } else {
              pricePerDFLForWhite = 0;
            }
            let priceOfGoldIndex = this.getTypeIndex(element['chawkiTypes'],'GOLD')
            if(priceOfGoldIndex > -1) {
              pricePerDFLForGold = element['chawkiTypes'][priceOfGoldIndex]['price'];
              chawkiTpe = element['chawkiTypes'][priceOfGoldIndex]['type'];
              buyingPrice = element['chawkiTypes'][priceOfGoldIndex]['crcPrice'];
              sellingPrice = element['chawkiTypes'][priceOfGoldIndex]['sellingPrice'];

            } else {
              pricePerDFLForGold = 0;
            }
          
          this.chawkiList.push({
            id: element.id,
            code: element.code,
            name: element.name ? element.name : '-',
            phone: element.phone ? element.phone : '-',
            createdDate: element.createdDate ? this.utils.getDisplayTime(element.createdDate) : '-',
            sortCreatedDate: element.createdDate,
            displayPriceForWhite: pricePerDFLForWhite.toLocaleString('en-IN'),
            displayPriceForGold: pricePerDFLForGold.toLocaleString('en-IN'),

            pricePerDFLForWhite: pricePerDFLForWhite.toLocaleString('en-IN'),
            pricePerDFLForGold: pricePerDFLForGold,
            refferedBy: element.refferedBy ? element.refferedBy : '-',
            isApproved: element.isApproved,
            regCertificateUrl: element.regCertificateUrl,
            trainingCertificateUrl: element.trainingCertificateUrl,
            nurseryAreaPhotoUrl: element.nurseryAreaPhotoUrl,
            chawkiInfrastructureImageUrls: element.chawkiInfrastructureImageUrls,
            chawkiImageUrls: element.chawkiImageUrls,
            crcCapacity: element.numberOfBatch ? element.numberOfBatch : 0,
            // crcCapacity: element.crcCapacity ? element.crcCapacity : 0,
            chawkiTpe: chawkiTpe,
            buyingPrice: buyingPrice,
            sellingPrice : sellingPrice

          });
        });
        this.refreshTable(this.chawkiList);
        this._cd.detectChanges();
      }
    });
  }

  async onPageChange(page) {
    this.paginationData.currentPage = page;
    this.getChawkiList();
  }

  async refreshTable(chawkiList) {
    this.filteredChawkiList = [];
    const pagesLength = this.paginationData.total / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
    this.filteredChawkiList = chawkiList;
    this._cd.detectChanges();
  }

  async onSearch() {
    this.paginationData.currentPage = 0;
    this.getChawkiList();
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
     this.getChawkiList();
  }

  async onPageSizeChange() {
    this.getChawkiList();
  }

  approveChawki(item) {
    let param = {
      isApproved: item.isApproved
    }
    this.api.updateChawki(param, item.id).then(res => {
      this.snackBar.open('Chawki updated successfully', 'Ok', {
        duration: 3000
      });
    }, err=> {
      this.snackBar.open('Could not update chawki', 'Ok', {
        duration: 3000
      });
    })
  }

  formatPrice(price) {
    //console.log(price);
    const formatPrice = price.replace(/[, ]+/g, "").trim();
    return +formatPrice;
  }

  createNew() {
    this.router.navigate(['/resha-farms/chawki/crud']);
  }
  open(content, item) {
    this.deleteChawki = item;
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  delete() {
    this.api.deleteChawki(this.deleteChawki.phone).then(res => {
    this.getChawkiList();
      this.modalRef.close();
      this.snackBar.open('Deleted Chawki successfully', 'Ok', {
        duration: 3000
      });
    }, err => {
      this.modalRef.close();
      this.snackBar.open('failed to delete chawki, please try again', 'Ok', {
        duration: 3000
      });
    })
  }

  editChawki(farmer) {
    this.router.navigate(['/resha-farms/chawki/crud', farmer.id]);
  }
  chawkiDetails(farmer) {
    this.router.navigate(['/resha-farms/chawki/details', farmer.id]);
  }
}
