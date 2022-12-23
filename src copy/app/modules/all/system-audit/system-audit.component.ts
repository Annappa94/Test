import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from 'src/app/services/utils/utils.service';
import * as _moment from 'moment';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Component({
  selector: 'app-system-audit',
  templateUrl: './system-audit.component.html',
  styleUrls: ['./system-audit.component.scss']
})
export class SystemAuditComponent implements OnInit {
  searchText = '';
  isTableLoaded = false;
  centersData = [];
  logs;
  modalRef;
  closeResult: string;

  selectedModuleName = '(Farmer,CocoonPurchase,Chawki,FarmerInputOrder,Retailer)';
  selectedOperation = 'CREATE,UPDATE,DELETE';

  operationList: any = [
    {
      name: 'All', 
      value: 'CREATE,UPDATE,DELETE'
    }, {
      name: 'Create',
      value: 'CREATE'
    },
    {
      name: 'Update',
      value: 'UPDATE'
    },
    {
      name: 'Delete',
      value: 'DELETE'
    }
  ]

  moduleNameList: any = [
    {
      name: 'All', 
      value: 'Farmer,CocoonPurchase,Chawki,FarmerInputOrder,Retailer'
    }, {
      name: 'Farmer',
      value: 'Farmer'
    },
    {
      name: 'CocoonPurchase',
      value: 'CocoonPurchase'
    },
    {
      name: 'Chawki',
      value: 'Chawki'
    },
    {
      name: 'FarmerInputOrder',
      value: 'FarmerInputOrder'
    },
    {
      name: 'Retailer',
      value: 'Retailer'
    }
  ]
  // table features
  activeSort = '';
  searchedCenters = [];
  filteredCentersList = [];
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
    lastModifiedBy: 0,
    lastModifiedDate: 0,
    createdBy: 0,
    createdDate: 0,
    moduleName: 0,
    operationName: 0
  };
  isDisbledFilter:boolean=true;
  filterForm:UntypedFormGroup;
  constructor(
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private utils: UtilsService,
    private form:UntypedFormBuilder,
    private ngxLoader : NgxUiLoaderService,
    ) {
     this.filterForm = this.form.group({
        moduleName: new UntypedFormControl('Farmer,CocoonPurchase,Chawki,FarmerInputOrder,Retailer'),
        moduleOperation: new UntypedFormControl('CREATE,UPDATE,DELETE'),
        startDate: new UntypedFormControl(''),
        endDate: new UntypedFormControl(''),
      });

      this.filterForm.get("moduleName").valueChanges.pipe(distinctUntilChanged()).subscribe(value=>{
        
        if(value){
         this.isDisbledFilter=false;
         this.filterForm.get("startDate").setValidators([]);
         this.filterForm.get("endDate").setValidators([]);
         this.filterForm.get("startDate").updateValueAndValidity();
         this.filterForm.get("endDate").updateValueAndValidity();
        }
       });
      this.filterForm.get("moduleOperation").valueChanges.pipe(distinctUntilChanged()).subscribe(value=>{
        if(value){
         this.isDisbledFilter=false;
         this.filterForm.get("startDate").setValidators([]);
         this.filterForm.get("endDate").setValidators([]);
         this.filterForm.get("startDate").updateValueAndValidity();
         this.filterForm.get("endDate").updateValueAndValidity();
        }
       });

      
       this.filterForm.get("endDate").valueChanges.pipe(distinctUntilChanged()).subscribe(value=>{
         if(value){
          this.filterForm.get("startDate").setValidators(Validators.required);
          this.filterForm.get("startDate").updateValueAndValidity();
         }
       })
       
       this.filterForm.get("startDate").valueChanges.pipe(distinctUntilChanged()).subscribe(value=>{
         if(value){
          this.filterForm.get("endDate").setValidators(Validators.required);
          this.filterForm.get("endDate").updateValueAndValidity();
         }
       })
     }

  ngOnInit(): void {
     this.applyFilter();
   }
  
  async getAuditList() {
    this.centersData = [];
    this.ngxLoader.stop();
    this.api.getAuditList().then(res => {
      res['_embedded']['audittrail'].forEach(element => {
        this.centersData.push({
          id: element.entityId ? element.entityId : '-',
          createdBy: element.createdBy ? element.createdBy : '-',
          createdDate: element.createdDate ? this.utils.getDisplayTime(element.createdDate) : '-',
          lastModifiedBy: element.lastModifiedBy ? element.lastModifiedBy : '-',
          lastModifiedDate: element.lastModifiedDate ?this.utils.getDisplayTime(element.lastModifiedDate) : '-',
          operation: element.operationName ? element.operationName : '-',
          moduleName: element.moduleName ? element.moduleName : '-',
          message: element.message,

        })
      });
      this.refreshTable(this.centersData);
      this._cd.detectChanges();
    });
  }

  async onPageChange(page) {
    this.paginationData.currentPage = page;
    this.applyFilter();
  }

  async refreshTable(chawkiList) {
    this.filteredCentersList = [];
    const pagesLength = this.paginationData.total / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
    this.filteredCentersList = chawkiList;
    this._cd.detectChanges();
  }

  buildSearchQuery(searchText=this.searchText){
    let text=this.searchText.replace(/ /gi,"*");
    let setItInQuery:any=`(`;
  
    text&&(setItInQuery+=`entityId==${text} and `
    );
    
    let formValue = this.filterForm.value;
    let moduleName = formValue.moduleName ? formValue.moduleName : 'Farmer,CocoonPurchase,Chawki,FarmerInputOrder,Retailer';
    let operationName = formValue.moduleOperation ? formValue.moduleOperation : 'CREATE,UPDATE,DELETE';
    let fromDate = formValue.startDate?Date.parse(formValue.startDate): Date.parse(_moment('1970-01-01T00:00:00Z').toISOString());
    let toDate = formValue.endDate?Date.parse(formValue.endDate):Date.parse(_moment(new Date()).toISOString());

    (setItInQuery+= `(moduleName=in=(${moduleName}) and `);
    (setItInQuery+= `operationName=in=(${operationName}))`);

    fromDate&&toDate && (setItInQuery += ` and (createdDate>=${fromDate} and createdDate<${toDate})`);


    setItInQuery+=')';
    return setItInQuery;
  }

  async applyFilter(){
    let item = this.filterForm.value;
    if(item.endDate)
     item.endDate=_moment(item.endDate).set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
    if(item.moduleName=='ALL')
      item.moduleName='';
    if(item.moduleOperation=='ALL')
      item.moduleOperation='';
      this.ngxLoader.stop();
    // this.api.getAuditListFilter({
    //   operationname: item.moduleOperation,
    //   modulename: item.moduleName,
    //   fromDate: item.startDate?Date.parse(item.startDate): Date.parse(_moment('1970-01-01T00:00:00Z').toISOString()),
    //   toDate: item.endDate?Date.parse(item.endDate): Date.parse(_moment(new Date()).toISOString())
    // }).then((audit:any)=>{
    this.api.getAllAuditList(this.buildSearchQuery(this.searchText),this.paginationData.currentColumn,this.paginationData.currentDirection,this.paginationData.currentPage ,this.paginationData.pageSize).then((audit:any) => {
      this.centersData=[];
      this.paginationData.total = audit.totalElements;
      audit['content'].forEach(element => {
        this.centersData.push({
          id: element.entityId ? element.entityId : '-',
          createdBy: element.createdBy ? element.createdBy : '-',
          createdDate: element.createdDate ? this.utils.getDisplayTime(element.createdDate) : '-',
          lastModifiedBy: element.lastModifiedBy ? element.lastModifiedBy : '-',
          lastModifiedDate: element.lastModifiedDate ?this.utils.getDisplayTime(element.lastModifiedDate) : '-',
          operation: element.operationName ? element.operationName : '-',
          moduleName: element.moduleName ? element.moduleName : '-',
          message: element.message,

        })
      });
      this.refreshTable(this.centersData);
      this._cd.detectChanges();
    })
  }
  clearFilterForm(){
    this.filterForm.reset();
    this.filterForm.get('moduleName').patchValue('Farmer,CocoonPurchase,Chawki,FarmerInputOrder,Retailer');
    this.filterForm.get('moduleOperation').patchValue('CREATE,UPDATE,DELETE');
    this.searchText = '';
    this.applyFilter();
    this.isDisbledFilter=true;
  }
  async onSearch() {
    this.paginationData.currentPage = 0;
    this.applyFilter();
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
     this.applyFilter();
  }

  async onPageSizeChange() {
    this.applyFilter();
  }

  open(content, item) {
    this.logs = item;
    this.modalRef = this.modalService.open(content)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

}
