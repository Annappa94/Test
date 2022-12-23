import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { ApiService } from 'src/app/services/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { CustomValidator } from 'src/app/modules/shared/custom-validator/custom.validator';


@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {
  @ViewChild('content') div;

  searchText='';
  // deviceDataList:any[]=[];
  devicesDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  closeResult;
  locationChangeDeviceForm:UntypedFormGroup;
  selectedDeviceFromTable:any[] = [];
  roles = ['ADMINISTRATOR', 'COperationsAgent','COCOON_PROCUREMENT_EXEC','COCOON_SALES_EXEC', 'COperationsManager','COCOON_PROCUREMENT_MANAGER',  'COCOON_SALES_MANAGER', 'YOperationsAgent', 'YOperationsManager', 'FinanceManager', 'FinanceHead', 'CCenterAgent', 'CCenterManager','FarmInputAgent','FarmInputManager', 'RetailSalesAgent', 'RetailSalesManager', 'RetailSourcingAgent', 'RetailSourcingManager', 'LogisticsManager', 'MudraAgent', 'MudraManager', 'CottonAgent','CottonManager','PupaeAgent','PupaeManager'];


  ilteredUsersList = [];
 paginationData = {
  currentPage : 0,
  pageSize    : 10,
  total       : 0,
  pages       : [],
  currentColumn : 'createdDate',
  currentDirection: 'desc',
};

 tableHeader = {
  code: 0,
  createdDate: 0,
  id:0
 };
  selectAll: any;
  selectedBatchList:any =[];
  activeSort: any;
  selectedAssignee: string;
  usersList: any[];
  centerList: any;
  warehouseList: any;
  bulkDeviceAssigneData: {};
  changedLocationType: any;
  changedLocationValue: any;

  async deviceLocationChangeForms() {
    this.locationChangeDeviceForm = this.form.group({
      locationType: new UntypedFormControl('HQ'),
      location: new UntypedFormControl('Corporate Office'),
    });
  }
 
  constructor(
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private modalService: NgbModal,
    private form: UntypedFormBuilder,
    private api: ApiService,
    private snackBar: MatSnackBar,
    private apiSearch:SearchService,
    private utils:UtilsService,
    public globalService: GlobalService,

    ) {
      this.getCenters();
      this.getWarehouses();
      this.changedLocationType = "HQ";
      this.changedLocationValue = {
        'name': 'Corporate Office'
      };
   }
   filterForm:UntypedFormGroup = new UntypedFormGroup({
    status:new UntypedFormControl('(INUSE,INTRANSIT,AVAILABLE,INREPAIR,REJECTED)'),
    healthStatus:new UntypedFormControl('(NORMAL,DEFECTIVE,DAMAGED)'),
  })

   ngOnInit(): void {
     this.listenForFilterChanges();
    this.getDevicesList();
    this.getAllUsers();
    this.deviceLocationChangeForms();
    
  }

  tableHeaders:any=[
    {name:"CODE", sortName:'id'},
    {name:"Device Type", sortName:'deviceType.deviceName', sort:true},
    {name:"STATUS", sortName:'status', sort:true},
    {name:"Device ID", sortName:'deviceId', sort:true},
    {name:"Location", sortName:'location', sort:true},
    {name:"Assignee Name", sortName:'assigneeName', sort:true},
    {name:'Health Status'},
    {name:'CREATED DATE', sortName: 'createdDate',sort:true},
    {name:'ACTION'},
  ];
  
  CONSTANT = CONSTANT;
  closeCreateEditModel() {
    this._cd.detectChanges();
    this.modalRef.close();
    this.selectedAssignee = "";
    this.changedLocationValue = {
      "name": 'Corporate Office'
    }

  }

   openDeviceForm(deviceForm) {
    // this.category.reset();
    // this.createFormParams();
    this.modalRef = this.modalService.open(deviceForm)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  // onPageChange(data){
  //   const {paginationData,searchText,initial} = data;
  //   this.paginationData = paginationData;
  //   this.searchText = searchText;

  //   !initial && this.getDevicesList(paginationData,searchText);

  // }


  tableInfo(info){
    const { edit,data,details,index, switchIconToggle,rowCheckBox} = info;
    // details&&(this.routeToDetailspage(index));
    edit&&(this.routeToEditPage(index));
    // switchIconToggle&&(this.openBlacklistPopUp(index));
    rowCheckBox&&this.selectedDeviceListFromTable(index)

  }
  
  routeToEditPage(index){
    this.router.navigate([`/resha-farms/device-management/list-crud`,index]);
  }
  routeToDetails(id){
    this.router.navigate([`/resha-farms/device-management/divce-list-details`,id]);
  }
  routeTodevicetype(id){
    this.router.navigate([`/resha-farms/device-management/devicetype-details`,id]);
  }

  selectedDeviceListFromTable(index:number){
    this.res[index];
    if(!this.selectedDeviceFromTable.find(lot=>lot?.id == this.res[index].id)){
     this.selectedDeviceFromTable.push(this.res[index]);
     console.log(this.selectedDeviceFromTable);

    }else{
      this.selectedDeviceFromTable.splice(this.selectedDeviceFromTable.indexOf(lot=>lot?.id == this.res[index].id),1)
      console.log(this.selectedDeviceFromTable);
    }
}
  
  async onSearch() {
    if(this.selectAll) {
      this.selectAll = false;
      this.selectedBatchList = [];
    }
    this.paginationData.currentPage=0;
    this.getDevicesList();
  }
  listenForFilterChanges(){
    this.filterForm.valueChanges.subscribe(value=>{
     // console.log(value);
     this.getDevicesList();
    })
  }


  buildSerachQuery(searchText:any=this.searchText){
  const { status,healthStatus} = this.filterForm.value;
    let query = `(status =in= ${status} and health=in=${healthStatus}`;
      if (searchText) {
       let text=searchText.replace(/ /gi,"*");
       let query:String=`(`;
       (query+=`((assigneeName == *${text}*  or assigneePhone == *${text}* or deviceTypeCode == *${text}*) and status=in=${status} and health=in=${healthStatus}`);
       searchText.toString()?.toUpperCase()?.includes('RMDEVICE')&&!isNaN(searchText.substring(8))&&(query+=` or code==*RMDEVICE${searchText.substring(8)}*`)
       !isNaN(parseInt(searchText))&&(query+=` or code==*RMDEVICE${searchText}*`)
       query+='))';
       return query;
     }
     query+=')'
     return query;

 }

 getDevicesList(paginationData=false,searchText=''){
  this.ngxLoader.stop();
  this.apiSearch.getAllDevicesData(this.paginationData ,this.buildSerachQuery()).then(res=>{
    this.paginationData.total=res['totalElements'];
    this.devicesDataList = [];
    this.res = res['content'];
    this.res.filter(record=>{
      // console.log(record);
      const obj={};
      obj['CODE'] = {
        isDisplay:'true',
        code:record?.code,
        selected:this.selectedRecord(record.id)
      },
      obj['Device Type'] = record?.deviceTypeCode ? record?.deviceTypeCode : ' - ',
      obj['STATUS'] = record?.status ? record?.status  : ' - ',
      obj['Device ID'] = record?.deviceId ? record?.deviceId : ' - ',
      obj['Location'] = record?.location ? record?.location : ' - ',
      obj['Assignee Name'] = record?.assigneeName ? record?.assigneeName : ' - ',
      obj['Health Status']= record?.health,
      obj['CREATED DATE'] = this.utils.getDisplayTime( record?.createdDate) ? this.utils.getDisplayTime( record?.createdDate) : ' - ',
      obj['ACTION'] = 'ACTION',
      this.CONSTANT.SELECT_ROW="CODE";
      this.CONSTANT.ACTION ='ACTION',
      this.devicesDataList.push(obj);      
    });
    this.refreshTable(this.devicesDataList);
    this._cd.detectChanges();
  })
}

// patch call for status changes
onHealthStatusChange(event,item){
  let reqObj = {
    "health": item.health,
  }
 this.deviceStatusChange(item.id,reqObj)
}

onDeviceStatusChange(event,item){
  let reqObj = {
    "status": item.status,
  }
  this.deviceStatusChange(item.id,reqObj)
}

deviceStatusChange(id,Obj){
  this.ngxLoader.stop();
  this.api.updateDevice(id,Obj).then(response => {
    console.log(response);
    this.snackBar.open('Device Status Updated Successfully', 'Ok', {
      duration: 3000
    });    
  })
}
  

  selectedRecord(id:number){
    return this.selectedDeviceFromTable.find(record=>record.id == id)?true:false;
  }


async onPageChange(page) {
  console.log(page);
  
  if(this.selectAll) {
    this.selectAll = false;
    // this.selectedBatchList = [];
  }
  this.paginationData.currentPage = page;
  this.getDevicesList();
}

async onPageSizeChange() {
  if(this.selectAll) {
    this.selectAll = false;
    this.selectedBatchList = [];
  }
  this.paginationData.currentPage = 0;
  this.getDevicesList();
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
   this.getDevicesList();
}

async refreshTable(list) {
  // this.res = [];
  const pagesLength = this.paginationData.total / this.paginationData.pageSize;
  this.paginationData.pages = Array(Math.ceil(pagesLength)).fill(0).map((x, i) => i);
  // this.res = list;
  this.retainSelectedState();
  this._cd.detectChanges();
}

selectAllRecord(event) {
  this.selectedBatchList = [];
  if (event.target.checked) {
    if(this.res && this.res.length) {
      for(let i=0;i<this.res.length;i++) {
          this.res[i].selected = true;
          this.selectedBatchList.push(this.res[i]);
      }
    }
  } else {
    if(this.res && this.res.length) {
      for(let i=0;i<this.res.length;i++) {
          this.res[i].selected = false;
      }
    }
  }
  this._cd.detectChanges();
}

async onSelectBatches(event, batch){
  let checkIfAllSelected = true;
 if (event.target.checked) {
   const found = this.selectedBatchList.some(el => el.id === batch.id);
     if (!found) {
         this.selectedBatchList.push(batch);
     }
 } else {
   const lot = this.selectedBatchList.findIndex((lotItem) => {
     return lotItem.id === batch.id;
   });
   if (lot !== -1){
     this.selectedBatchList.splice(lot, 1);
   }
 }

 if(this.selectedBatchList.length == this.res.length) {
   for(let i=0;i<this.res.length;i++) {
     const found = this.selectedBatchList.some(el => el.id === this.res[i].id);
     if(!found) {
       checkIfAllSelected = false;
       break;
     }
   }
   this.selectAll = checkIfAllSelected;
 } else {
   this.selectAll = false
 }

}

retainSelectedState() {
  for(let i=0;i<this.res.length;i++) {
    const found = this.selectedBatchList.some(el => el.id === this.res[i].id);
      if (found) {
        this.res[i].selected = true;
        this._cd.detectChanges();
      } else {
        this.res[i].selected = false;
        this._cd.detectChanges();
      }
  }    
  this._cd.detectChanges();
}

openAssignechange(content) {
  this.modalRef = this.modalService.open(content)
  this.selectedAssignee = "";
  this.modalRef.result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed`;
  });
}
openDeviceTransfer(content) {
  this.modalRef = this.modalService.open(content)
  this.selectedAssignee = "";
  this.modalRef.result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed`;
  });
}
assignedToChanged(assigneData){
  this.selectedAssignee = assigneData
  console.log(assigneData.phone);
  console.log(assigneData.name);
  console.log(this.selectedBatchList);
  let selectedBatch = [];
   for(let i=0; i< this.selectedBatchList.length;i++) {
    selectedBatch.push(this.selectedBatchList[i].id);
   }

   let assigneeChangeReqObj = {  
      "deviceIds": selectedBatch,
      "assigneeId" : assigneData.id ? assigneData.id : ""
   }
  this.bulkDeviceAssigneData = assigneeChangeReqObj;
}

changeLocationType(event) {
  console.log(event);
  this.changedLocationType = event;
  if (event == 'HQ') {
    this.changedLocationValue = {
      'name': 'Corporate Office'
    };
  } else {
    this.changedLocationValue = {
      'name': ''
    };
  }
}

changeLocation(event){
  if (event == 'Corporate Office') {
    this.changedLocationValue = {
      'name': event
    };
  } else {
    this.changedLocationValue = event;
  }
  // this.changedLocationValue = event;
  console.log(this.changedLocationValue);
  console.log(this.changedLocationType);
  
  
}

locationToChanged(){
  // this.selectedAssignee = assigneData
  // console.log(assigneData.phone);
  // console.log(assigneData.name);
  console.log(this.selectedBatchList);
  let selectedBatch = [];
   for(let i=0; i< this.selectedBatchList.length;i++) {
    selectedBatch.push(this.selectedBatchList[i].id);
   }

   let assigneeChangeReqObj = {  
      "ids": selectedBatch,
      "updateData": {
        "location": this.changedLocationValue,
        "locationType": this.changedLocationType,
      }
   }
  this.api.deviceLocationChange(assigneeChangeReqObj).then(res => {
    console.log(res);
    this.getDevicesList();
    this.closeCreateEditModel();
    this.selectedBatchList = [];
    this._cd.detectChanges();
  })
  
}

deviceBulkAssigneChange(){
  this.api.deviceAssigneeChange(this.bulkDeviceAssigneData).then(res => {
    console.log(res);
    this.getDevicesList();
    this.closeCreateEditModel();
    this.selectedBatchList = [];
    this._cd.detectChanges();
  })
}

  async getAllUsers() {
    this.usersList = [];
    this.ngxLoader.stop();
    this.api.getAllUsersList(this.roles).then(res => {
      if (res['_embedded']['user'] && res['_embedded']['user'].length) {
        this.usersList = [...res['_embedded']['user']];

      } else {
        this.usersList = [];
      }
      this._cd.detectChanges();
    });
  }
  async getCenters() {
    this.ngxLoader.stop();
    this.api.getCentersList().then(details => {
      if (details) {
        this.centerList = details['_embedded']['center'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }

  async getWarehouses() {
    this.ngxLoader.stop();
    this.api.getWarehouseList().then(details => {
      if (details) {
        this.warehouseList = details['_embedded']['warehouse'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }

  routeToSalesCrud(){
    this.router.navigate(['/resha-farms/device-management/sales-order-crud'])
  }
  markSoldSelected(){
    this.globalService.tempValueData = this.selectedBatchList;
    this.router.navigate(['/resha-farms/device-management/sales-order-crud'])
    console.log(this.globalService.tempValueData);
    

  }

}
