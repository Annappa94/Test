import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import * as XLSX from 'xlsx'; 
import { GlobalService } from 'src/app/services/global/global.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
const compareDate = (v1, v2) => new Date(v1) < new Date(v2) ? -1 : new Date(v1) > new Date(v2) ? 1 : 0;

@Component({
    selector: 'app-farmer-followups',
    templateUrl: './farmer-followups.html',
    styleUrls: ['./farmer-followups.component.scss']
})

export class FarmerFollowupsComponent implements OnInit {

    statuses = ['ACTIVE', 'COMPLETED'];    
    searchedFarmers = [];
    filteredFarmersList = [];
    searchText = '';
    activeSort = '';
    isTableLoaded = false;
    followups = [];
    paginationData = {
        currentPage : 0,
        pageSize    : 20,
        total       : 0,
        pages       : []
      };
      tableHeader = {
        farmerName : 1,
        farmerPhone : 0,
        type : 0,
        cocoonQuantity : 0,
        centerName : 0,
        followupDisplayDate : 0,
        displayCocoonType : 0,
        notes : 0,
      };
    constructor(
        private api: ApiService,
        private utils: UtilsService,
        private _cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private snackBar: MatSnackBar,
        private form: UntypedFormBuilder,
        private globalService: GlobalService,
        private ngxLoader : NgxUiLoaderService,
    ) {
        // Get users with all administrative roles 
        this.getFarmerFollowupList('ACTIVE');
        this.followupForm = form.group({
            notes: new UntypedFormControl('', [Validators.required])
          })
    }

    ngOnInit(): void { }

    async getFarmerFollowupList(roles) {
        this.followups = [];
        this.ngxLoader.stop();
        this.api.getFarmerFollowupList(roles).then(res => {

            for (const fup of res['_embedded']['farmerfollowup']) {
                var followup = fup;
                followup.followupDisplayDate = fup.followUpDate ? this.utils.getDisplayTime(fup.followUpDate * 1000) : '-';
                //followup.farmerName[fup].toLowerCase();
                followup.displayCocoonType = followup.cocoonType ? this.globalService.getDisplayCocoonType(followup.cocoonType) : '-'
                // console.log(followup);
                followup.farmerName = followup.farmerName.toLowerCase();
                this.followups.push(followup);
            }
            //console.log(this.followups);
            
            this.isTableLoaded = true;
            this.refreshTable(this.followups);
        });
    }
    async onPageChange(page) {
        this.paginationData.currentPage = page;
        if (this.searchText !== '') {
          this.refreshTable(this.searchedFarmers);
        } else {
          this.refreshTable(this.followups);
        }
      }
      async refreshTable(farmersList) {
        
        
        this.filteredFarmersList = [];
        this.paginationData.total = farmersList.length;
        const pagesLength = farmersList.length / this.paginationData.pageSize;
        // const pagesLength = farmersList.length / this.paginationData.pageSize < 5 ? farmersList.length / this.paginationData.pageSize : 5;
        this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
        // for (let i = 0; i < this.paginationData.pages.length; i++) {
        //   this.paginationData.pages[i] = this.paginationData.pages[i] + this.paginationData.currentPage;
        // }
        let skip = this.paginationData.currentPage * this.paginationData.pageSize;
        for (let i = 0; i < this.paginationData.pageSize; i++) {
          const farmer = farmersList[skip];
          if (farmer) {
            this.filteredFarmersList.push(farmer);
            skip++;
          } else {
            break;
          }
        }
        this._cd.detectChanges();
      }
      async onSearch() {
        this.searchedFarmers = this.followups.filter(farmer => {
          const term = this.searchText.toLowerCase();
          return farmer.farmerName.toLowerCase().includes(term)
            || farmer.farmerPhone.toLowerCase().includes(term)
            || farmer.type.toLowerCase().includes(term)
            || farmer.displayCocoonType.toLowerCase().includes(term)
            || farmer.cocoonQuantity.toLowerCase().includes(term)
            || farmer.followupDisplayDate.toLowerCase().includes(term)
            || farmer.notes.toLowerCase().includes(term)
        });
        this.paginationData.currentPage = 0;
        this.refreshTable(this.searchedFarmers);
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
          this.searchedFarmers = [...this.searchedFarmers].sort((a, b) => {
            let res = null;
            if (column === 'followupDisplayDate') {
                res = compareDate(a[column], b[column]);
            } else {
              res = compare(a[column], b[column]);
            }
            return this.tableHeader[column] === 1 ? res : -res;
          });
          this.refreshTable(this.searchedFarmers);
        } else {
          this.followups = [...this.followups].sort((a, b) => {
            let res = null;
            if (column === 'followupDisplayDate') {
                res = compareDate(a[column], b[column]);
            } else {
              res = compare(a[column], b[column]);
            }
            return this.tableHeader[column] === 1 ? res : -res;
          });
          this.refreshTable(this.followups);
        }
      }
      
      async onPageSizeChange() {
        if (this.searchText !== '') {
          this.refreshTable(this.searchedFarmers);
        } else {
          this.refreshTable(this.followups);
        }
      }

    async onChangeRole(event) {
        const status = event.target.value;
        this.getFarmerFollowupList(status);
    }

    exportexcel(): void {
        let element = document.getElementById('excel-table'); 
           const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    
           /* generate workbook and add the worksheet */
           const wb: XLSX.WorkBook = XLSX.utils.book_new();
           XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
           /* save to file */
           var filename = 'farmer-followups-'+ (new Date()).toLocaleDateString() + '.xlsx'
           XLSX.writeFile(wb, filename);
      }


    // Complete the followup
    followup;
    modalRef;
    closeResult: string;
    followupForm;

    openPopUp(content, followup) {
        this.followup = followup;
        this.modalRef = this.modalService.open(content)
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed`;
        });
    }

    markComplete() {

        
        const reqObj = {
            notes: this.followup.notes + ',' + this.followupForm.value.notes,
            status: 'COMPLETED',
        }

        this.ngxLoader.stop();
        this.api.updateFarmerFollowup(this.followup.id, reqObj).then(response => {

            this.modalRef.close();
            this.snackBar.open('Marked followup complete.', 'Ok', {
                duration: 3000
            });
            this.getFarmerFollowupList('ACTIVE');
            this.followupForm.controls['notes'].setValue('');

        }, err => {
            this.snackBar.open('Failed to marked followup complete.', 'Ok', {
                duration: 3000
            });
            console.log(err);
        })

    }


   


}