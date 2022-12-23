import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-advisory-list',
  templateUrl: './advisory-list.component.html',
  styleUrls: ['./advisory-list.component.scss']
})
export class AdvisoryListComponent implements OnInit {
  jsonObject: JSON;
  advisoryList: any[] = [];
  CONSTANT = CONSTANT;
  rowDataList: any[] = [];
  res: any[] = [];
  totalRecords: number = 0;
  modalRef;
  closeResult: string;
  selectedLGPartner: any;
  AssigneeName:any;
  paginationData: boolean = false;
  searchText: string = '';
  splittedFilterHolder: any;

  arrayObj: any = [
    {
      "farmId": 1,
      "plotId": "plot1",
      "deviceId": "device1",
      "farmerName": "farmer1",
      "farmerMobile": "1",
      "assignee": "Karnataka",
      "message": "abc",
      "priority": "p1",
      "action": ""
    },
    {
      "farmId": 2,
      "plotId": "plot2",
      "deviceId": "device2",
      "farmerName": "farmer2",
      "farmerMobile": "2",
      "assignee": "Karnataka",
      "message": "abcd",
      "priority": "p2",
      "action": ""
    },
    {
      "farmId": 3,
      "plotId": "plot3",
      "deviceId": "device3",
      "farmerName": "farmer3",
      "farmerMobile": "3",
      "assignee": "Karnataka",
      "message": "abcde",
      "priority": "p3",
      "action": ""
    }
  ]

  tableHeaders: any = [

    { name: "Farmer Name", sortName: 'farmer Name', sort: true },
    { name: "Advisory Type", sortName: ' Advisory Type', sort: true },
    { name: "Status", sortName: 'Status', sort: true },
    { name: "Assignee Name", sortName: 'Assignee Name', sort: true, },
    { name: "Message", sortName: 'message', sort: true },
    { name: "Created On", sortName: 'created on ', sort: true,},

    // {name:"Plot ID", sortName:'plotId', sort:true},
    // {name:"Device ID", sortName:'deviceId', sort:true},
    // {name:"Farmer", sortName:'farmer', sort:true},
    // {name:"Priority", sortName:'priority', sort:true},
    // {name:"Farm ID", sortName:'farmId'},

    // {name:'ACTION'},
  ];


  filterForm: UntypedFormGroup = new UntypedFormGroup({
    status: new UntypedFormControl('(CLOSED,NEW)'),
    advisoryType:new UntypedFormControl('(TEMPERATURE,HUMIDITY)'),
    assigneeName:new UntypedFormControl(''),
    agroId: new UntypedFormControl('')
  })
  agronomistList: any;
  updateRearingIotForm: any;
  agronomistId: any;

  listenForFilterChanges() {
    this.filterForm.valueChanges.subscribe(value => {
      this.getAdvisoryList();
    })
  }

   constructor(private api: ApiService,
    private snackBar: MatSnackBar,
    private apiSearch: SearchService,
    private utils: UtilsService,
    private modalService: NgbModal,
    private _cd: ChangeDetectorRef,
    private ngxLoader: NgxUiLoaderService,
    private router: Router,
  ) {

    this.jsonObject = <JSON>this.arrayObj;
  }

  ngOnInit(): void {
    this.listenForFilterChanges();
    this.getAdvisoryList();
    this.getAgronomistList();
  }

  onPageChange(data) {
    const { paginationData, searchText, initial } = data;
    this.paginationData = paginationData;
    this.searchText = searchText;
    !initial && this.getAdvisoryList(paginationData, searchText);
  }


  tableInfo(info) {
    const { edit, data, details, index } = info;
    details && (this.routeToDeviceDeviceTypeDetails(index));
  }

  routeToDeviceDeviceTypeDetails(index) {
    this.router.navigate([`/resha-farms/mulberry-iot/advisory-details`, this.res[index].farmId]);
  }

  getAdvisoryList(paginationData = false, searchText = '') {
    this.ngxLoader.stop();
    this.apiSearch.getMulberryAdvisoryList(paginationData = false, this.buildSerachQuery(searchText)).then(res => {
      this.AssigneeName=res;
      this.advisoryList = [];
      console.log(res);
      this.res = res['content'];
      this.res.filter(record => {
        console.log(record);

        const obj = {};
        obj['Farmer Name'] = record?.farmerName + '-' + record?.farmerPhone ? record?.farmerName + '-' + record?.farmerPhone : ' - ',
          obj['Advisory Type'] = record?.advisoryType ? record?.advisoryType : ' - ',
          obj['Status'] = record?.status ? record?.status : ' - ',
          obj['Assignee Name'] = record?.assigneeName + '-' + record?.assigneeId ? ((record?.assigneeName || '') + '-' + (record?.assigneeId || '')) : ' - ',
          obj['Message'] = record?.messageBody ? record?.messageBody : ' - ',
          obj['Created On'] = record?.createdOn ? this.utils.getDisplayTime(record?.createdOn) : ' - ',
          // obj['ACTION'] = 'ACTION',
          // this.CONSTANT.ID ='RM CODE',
          // this.CONSTANT.ID ='ID',
          // obj['Device ID'] = record?.id ? record?.id  : ' - ',
          this.CONSTANT.ACTION = '',
          this.advisoryList.push(obj);
        console.log(this.advisoryList);

      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  }
  
  getAgronomistList(){
    this.api.getAllUsersList('Agronomist').then(res=>{
      this.agronomistList = res['_embedded']['user'];  
      console.log('agronomistList',this.agronomistList)    
      
    })
  }
  agronomistChange(){
    this.agronomistList.forEach(ele=>{
      if(this.updateRearingIotForm.get('agroId').value==ele.id){
        this.updateRearingIotForm.get('agroPhone').patchValue(ele.phone);
      this.updateRearingIotForm.get('agroName').patchValue(ele.name);
      this.agronomistId = ele.id;
      }
      
    });
    

    // this.agronimistName = item.name;
    // this.agronomistPhone = item.phone;
    
  }

  buildSerachQuery(searchText) {
    const text = searchText.replace(/ /gi, "*");
    const { status,advisoryType } = this.filterForm.value;
    if (searchText) {
      if (!isNaN(searchText)) {
        return `(farmerId==${text} or farmerName==*${text}* or farmerPhone==*${text}* or id==${text} and (status=in=${status} and advisoryType=in=${advisoryType}))`
      } else {
        return `( farmerName==*${text}* or farmerPhone==*${text}* and (status=in=${status} and advisoryType=in=${advisoryType}) )`
      }
    }
    return `(status=in=${status} and advisoryType=in=${advisoryType})`;
    
    
    
  }





}
