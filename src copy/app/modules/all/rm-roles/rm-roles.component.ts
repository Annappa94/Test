import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Component({
  selector: 'app-rm-roles',
  templateUrl: './rm-roles.component.html',
  styleUrls: ['./rm-roles.component.scss']
})
export class RmRolesComponent implements OnInit {
  searchText = '';
  isTableLoaded = false;
  centersData = [];
  center;
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
    description: 0,
  };
  constructor(
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private ngxLoader : NgxUiLoaderService
  ) { 
    this.user = JSON.parse(localStorage.getItem('_ud'))
  }

  ngOnInit(): void {
    this.getCenterList();
  }
  async getCenterList() {
    this.centersData = [];
    this.ngxLoader.stop();
    this.api.getAllRoles().then(res => {
      res['_embedded']['role'].forEach(element => {
        this.centersData.push({
          centerName: element.name.toLowerCase(),
          ownerName: element.displayName.toLowerCase(),
          description: element.description.toLowerCase(),

        })
      });
      this.refreshTable(this.centersData);
      this._cd.detectChanges();
    });
  }

  async onPageChange(page) {
    this.paginationData.currentPage = page;
    if (this.searchText !== '') {
      this.refreshTable(this.searchedCenters);
    } else {
      this.refreshTable(this.centersData);
    }
  }
  async refreshTable(centersData) {
    this.filteredCentersList = [];
    this.paginationData.total = centersData.length;
    const pagesLength = centersData.length / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);

    let skip = this.paginationData.currentPage * this.paginationData.pageSize;
    for (let i = 0; i < this.paginationData.pageSize; i++) {
      const center = centersData[skip];
      if (center) {
        this.filteredCentersList.push(center);
        skip++;
      } else {
        break;
      }
    }
    this._cd.detectChanges();
  }
  async onSearch() {
    this.searchedCenters = this.centersData.filter(center => {
      const term = this.searchText.toLowerCase();
      return center.centerName.toLowerCase().includes(term)
        || center.ownerName.toLowerCase().includes(term)
        || center.description.toLowerCase().includes(term)
    });
    this.paginationData.currentPage = 0;
    this.refreshTable(this.searchedCenters);
  }
  async onSort(column) {
    this.activeSort = column;
    this.paginationData.currentPage = 0;
    if (this.tableHeader[column] === 0) {
      this.tableHeader[column] = 1;
    } else {
      this.tableHeader[column] = 0;
    }
    if (this.searchText !== '') {
      this.searchedCenters = [...this.searchedCenters].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return this.tableHeader[column] === 1 ? res : -res;
      });
      this.refreshTable(this.searchedCenters);
    } else {
      this.centersData = [...this.centersData].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return this.tableHeader[column] === 1 ? res : -res;
      });
      this.refreshTable(this.centersData);
    }
  }
  async onPageSizeChange() {
    if (this.searchText !== '') {
      this.refreshTable(this.searchedCenters);
    } else {
      this.refreshTable(this.centersData);
    }
  }

}
