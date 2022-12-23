import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
@Component({
  selector: 'app-farm-market-place',
  templateUrl: './farm-market-place.component.html',
  styleUrls: ['./farm-market-place.component.scss']
})
export class FarmMarketPlaceComponent implements OnInit {
  searchText = '';
  isTableLoaded = false;
  mktPlaceData = [];
  market;
  modalRef;
  closeResult: string;
  user;
  // table features
  activeSort = '';
  searchedCenters = [];
  filteredCentersList = [];
  paginationData = {
    currentPage: 0,
    pageSize: 50,
    total: 0,
    pages: []
  };

  tableHeader = {
    centerName: 0,
    ownerName: 0,
    ownerPhoneNumber: 0,
    region: 0,
  };
  expandImage = false;
  modelImage = '';
  constructor(
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private utils: UtilsService,
    private ngxLoader : NgxUiLoaderService,
    ) {
      this.user = JSON.parse(localStorage.getItem('_ud'))
      this.getFarmMarketPlaceList();
     }

  ngOnInit(): void {
    
  }
  getFarmMarketPlaceList(){
    this.mktPlaceData = [];
    this.ngxLoader.stop();
    this.api.getFarmMktPlaceList().then(res => {
      //console.log(res);
      
      res['_embedded']['farmermarketplace'].forEach(element => {
        this.mktPlaceData.push({
          id: element.id,
          name: element.name,
          price: element.price ? element.price : 'Free',
          marketPrice: element.marketPrice ? element.marketPrice : 'Free',
          description: element.description,
          lastModifiedBy: element.lastModifiedBy,
          createdBy: element.lastModifiedBy,
          imageUrls: element.imageUrls ? element.imageUrls[0] : '',
          updatedDate: element.lastModifiedDate ? this.utils.getDisplayTime(element.lastModifiedDate) : '-',
          createdDate: element.createdDate ? this.utils.getDisplayTime(element.createdDate) : '-',
          isActive : element.isActive ? element.isActive : false

        })
      });
      this._cd.detectChanges();
    });
  }
  showHideLot(item) {
    const param = {
      isActive : item.isActive
    }
    //this.ngxLoader.stop();
    this.api.updateFarmMktPlaceById(item.id, param).then(res => {
      this.snackBar.open(item.name + ' Updated successfully', 'Ok', {
        duration: 3000
      });
    }, err => {
      this.snackBar.open('Could not update, Please try again', 'Ok', {
        duration: 3000
      });
    })
  }
  createNew() {
    this.router.navigate(['/resha-farms/farm-marketplace/crud']);
  }
  open(content, item) {
    this.market = item;
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  delete() {

    this.modalRef.close();
    this.ngxLoader.stop();
    this.api.deleteFarmMrktPlc(this.market.id).then(res => {
      
        this.getFarmMarketPlaceList();
        this.snackBar.open(this.market.name + ' deleted successfully', 'Ok', {
          duration: 3000
        });
      
    })
  }

  edit(item) {
    this.router.navigate(['/resha-farms/farm-marketplace/crud', item.id]);
  }

  showImage(item) {
    this.modelImage = item.imageUrls;
    this.expandImage = true;
  }
}
