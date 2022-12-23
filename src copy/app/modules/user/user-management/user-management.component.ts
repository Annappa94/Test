import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})

export class UserManagementComponent implements OnInit {

  // TODO: Farmer needs to change to FINANCE
  roles = ['ADMINISTRATOR',
    'COperationsAgent','COCOON_PROCUREMENT_EXEC','COCOON_SALES_EXEC',
    'READADMIN',
    'COperationsManager',
    'COCOON_PROCUREMENT_MANAGER',  'COCOON_SALES_MANAGER',
    'YOperationsAgent',
    'YOperationsManager',
    'FinanceManager',
    'FinanceHead',
    'CCenterAgent',
    'CCenterManager',
    'FarmInputAgent',
    'FarmInputManager',
    'HRManager',
    'RetailSalesAgent',
    'RetailSalesManager',
    'RetailSourcingAgent',
    'RetailSourcingManager',
    'LogisticsManager',
    'Agronomist',
    'MudraAgent',
    'MudraManager',
    'CottonAgent',
    'CottonManager',
    'PupaeAgent',
    'PupaeManager',
    'ItemMaster',
    'RetailMerchandisingManager',
    'CVerticalAdmin','COCOON_PROCUREMENT_HEAD',  'COCOON_SALES_HEAD',
    'Merchandiser',
    'BusinessHead',
    'YARN_SOURCING_EXECUTIVE',
    'QC_AGENT',
    'QC_MANAGER',
    'YARN_PACKAGING_MANAGER',
    'YARN_SALES_MANAGER',
    'YARN_SALES_REPRESENTATIVE',
    'YARN_DISPATCH_MANAGER',
    'YARN_BUSINESS_MANAGER',
    'YARN_SOURCING_MANAGER',
    'YarnSalesRepresentative',
    'CollectionAdmin',
    'CollectionManager',
    'CollectionAgent',
    'INWARD_WAREHOUSE_MANAGER'
  ];

  searchText = '';
  isTableLoaded = false;

  usersData = [];
  userType;
  // table features
  activeSort = '';
  searchedUsers = [];
  filteredUsersList = [];
  paginationData = {
    currentPage: 0,
    pageSize: 50,
    total: 0,
    pages: []
  };

  tableHeader = {
    name: 0,
    phone: 0,
    displayRole: 0,
    email: 0
  };

  constructor(
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private ngxLoader: NgxUiLoaderService,
  ) {
    this.userType = JSON.parse(localStorage.getItem('_ud'))
    // Get users with all administrative roles 
    this.getUserList(this.roles);
  }

  ngOnInit(): void {
  }

  async getUserList(roles) {
    this.usersData = [];
    this.ngxLoader.stop();
    this.api.getAllUsersList(roles).then(res => {
      var usersDataFetched = res['_embedded']['user'];
      for (const udf of res['_embedded']['user']) {
        udf.name = udf.name ? udf.name.toLowerCase() : '-';
        var usersDataFetched = udf;
        usersDataFetched.displayRole = this.getDisplayRole(udf.role).toLowerCase();
        this.usersData.push(usersDataFetched)
      }
      //this.usersData
      this.isTableLoaded = true;
      this.refreshTable(this.usersData);
      this._cd.detectChanges();
    });
  }

  async onPageChange(page) {
    this.paginationData.currentPage = page;
    if (this.searchText !== '') {
      this.refreshTable(this.searchedUsers);
    } else {
      this.refreshTable(this.usersData);
    }
  }
  async refreshTable(usersData) {
    this.filteredUsersList = [];
    this.paginationData.total = usersData.length;
    const pagesLength = usersData.length / this.paginationData.pageSize;
    this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);

    let skip = this.paginationData.currentPage * this.paginationData.pageSize;
    for (let i = 0; i < this.paginationData.pageSize; i++) {
      let user = usersData[skip];
      if (user) {
        user.rolesNames = user?.roles.map(role => role?.displayName)
        user.displayRole = user?.rolesNames.join(', ');
        this.filteredUsersList.push(user);
        skip++;
      } else {
        break;
      }
    }
    this._cd.detectChanges();
  }
  async onSearch() {
    this.searchedUsers = this.usersData.filter(user => {
      const term = this.searchText.toLowerCase();
      return user.name.toLowerCase().includes(term)
        || user.phone.toLowerCase().includes(term)
        || user.displayRole.toLowerCase().includes(term)
    });
    this.paginationData.currentPage = 0;
    this.refreshTable(this.searchedUsers);
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
      this.searchedUsers = [...this.searchedUsers].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return this.tableHeader[column] === 1 ? res : -res;
      });
      this.refreshTable(this.searchedUsers);
    } else {
      this.usersData = [...this.usersData].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return this.tableHeader[column] === 1 ? res : -res;
      });
      this.refreshTable(this.usersData);
    }
  }
  async onPageSizeChange() {
    if (this.searchText !== '') {
      this.refreshTable(this.searchedUsers);
    } else {
      this.refreshTable(this.usersData);
    }
  }

  async onChangeRole(event) {
    const role = event.target.value;
    if (role === 'all') {
      this.getUserList(this.roles);
    } else {
      this.getUserList(role);
    }
  }

  createNew() {
    this.router.navigate(['/users/crud']);
  }
  user;
  modalRef;
  closeResult: string;
  open(content, item) {
    this.user = item;
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
    this.api.deleteUser(this.user.phone).then(res => {
      this.getUserList(this.roles);
      this.snackBar.open(this.user.name + ' deleted successfully', 'Ok', {
        duration: 3000
      });
    })
  }
  edit(user) {
    this.router.navigate(['/users/crud', user.id]);
  }

  getDisplayRole(role) {
    if (role == 'ADMINISTRATOR') {
      return 'Administrator';
    } else if (role == 'COperationsAgent') {
      return 'Cocoon Operations Agent';
    } else if (role == 'COCOON_PROCUREMENT_EXEC') {
      return 'Cocoon Procurement Executive';
    } else if (role == 'COCOON_SALES_EXEC') {
      return 'Cocoon Sales Executive';
    } else if (role == 'COperationsManager') {
      return 'Cocoon Operations Manager';
    } else if (role == 'COCOON_PROCUREMENT_MANAGER') {
      return 'Cocoon Procurement Manager';
    } else if (role ==  'COCOON_SALES_MANAGER') {
      return 'Cocoon Sales Manager';
    } else if (role == 'YOperationsAgent') {
      return 'Yarn Operations Agent';
    } else if (role == 'YOperationsManager') {
      return 'Yarn Operations Manager';
    } else if (role == 'CCenterAgent') {
      return 'Call Center Agent';
    } else if (role == 'CCenterManager') {
      return 'Call Center Manager';
    } else if (role == 'FinanceManager') {
      return 'Finance Manager';
    } else if (role == 'FinanceHead') {
      return 'Finance Head';

    } else if (role == 'FarmInputAgent') {
      return 'Farm Input Agent';

    }
    else if (role == 'FarmInputManager') {
      return 'Farm Input Manager';
    }
    else if (role == 'HRManager') {
      return 'HR Manager';
    }
    else if (role == 'RetailSalesAgent') {
      return 'Retail Sales Agent';
    }
    else if (role == 'RetailSalesManager') {
      return 'Retail Sales Manager';
    }
    else if (role == 'RetailSourcingAgent') {
      return 'Retail Sourcing Agent';
    }
    else if (role == 'RetailSourcingManager') {
      return 'Retail Sourcing Manager';
    }
    else if (role == 'LogisticsManager') {
      return 'Logistics Manager';
    }
    else if (role == 'CottonAgent') {
      return 'Cotton Agent';
    }
    else if (role == 'CottonManager') {
      return 'Cotton Manager';
    }
    else if (role == 'PupaeAgent') {
      return 'Pupae Agent';
    }
    else if (role == 'PupaeManager') {
      return 'Pupae Manager';
    }
    else if (role == 'MudraAgent') {
      return 'Mudra Agent';
    }
    else if (role == 'MudraManager') {
      return 'Mudra Manager';
    }
    else if (role == 'Agronomist') {
      return 'Agronomist';
    }
    else if (role == 'READADMIN') {
      return 'Admin (Only View)';
    }
    else if (role == 'RetailMerchandisingManager') {
      return 'Retail Merchandising Manager';
    }
    else if (role == 'ItemMaster') {
      return 'Item Master';
    }
    else if (role == 'Merchandiser') {
      return 'Merchandiserr';
    }
    else if (role == 'BusinessHead') {
      return 'Business Head';
    }
    else if (role == 'YARN_BUSINESS_MANAGER') {
      return 'YARN BUSINESS MANAGER';
    }
    else if (role == 'INWARD_WAREHOUSE_MANAGER') {
      return 'INWARD WAREHOUSE MANAGER';
    }
    else if (role == 'YARN_SOURCING_EXECUTIVE') {
      return 'YARN SOURCING EXECUTIVE';
    }
    else if (role == 'YARN_SOURCING_MANAGER') {
      return 'YARN SOURCING MANAGER';
    }
    else if (role == 'QC_AGENT') {
      return 'QC AGENT';
    }
    else if (role == 'QC_MANAGER') {
      return 'QC MANAGER';
    }
    else if (role == 'YARN_PACKAGING_MANAGER') {
      return 'YARN PACKAGING MANAGER';
    }
    else if (role == 'YARN_SALES_MANAGER') {
      return 'YARN SALES MANAGER';
    }
    else if (role == 'YARN_SALES_REPRESENTATIVE') {
      return 'YARN SALES REPRESENTATIVE';
    }
    else if (role == 'YARN_DISPATCH_MANAGER') {
      return 'YARN DISPATCH MANAGER';
    }
    else if (role == 'CollectionAdmin') {
      return 'COLLECTION ADMIN';
    }
    else if (role == 'CollectionManager') {
      return 'COLLECTION MANAGER';
    }
    else if (role == 'CollectionAgent') {
      return 'COLLECTION AGENT';
    }

    return 'Unmapped Role';
  }

}