import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CONSTANT } from 'src/app/constants/pagination.constant';

@Component({
  selector: 'app-advisory-list',
  templateUrl: './advisory-list.component.html',
  styleUrls: ['./advisory-list.component.scss']
})
export class AdvisoryListComponent implements OnInit {
  jsonObject: JSON;
  advisoryList:any[]=[];
  CONSTANT = CONSTANT;
  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  closeResult: string;
  selectedLGPartner:any;
  paginationData:boolean = false;
  searchText:string = '';
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

  tableHeaders:any=[
    {name:"Farm ID", sortName:'farmId'},
    {name:"Plot ID", sortName:'plotId', sort:true},
    {name:"Device ID", sortName:'deviceId', sort:true},
    {name:"Farmer", sortName:'farmer', sort:true},
    {name:"Assignee", sortName:'assignee', sort:true},
    {name:"Message", sortName:'message', sort:true},
    {name:"Priority", sortName:'priority', sort:true},
    // {name:'ACTION'},
  ];

  constructor( private api: ApiService,
    private snackBar: MatSnackBar,
    private apiSearch:SearchService,
    private utils:UtilsService,
    private modalService: NgbModal,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
  ) { 

    this.jsonObject = <JSON>this.arrayObj;
  }

  ngOnInit(): void {
    this.getAdvisoryList();
  }
  
  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    this.paginationData = paginationData;
    this.searchText = searchText;
    !initial && this.getAdvisoryList(paginationData,searchText);
  }


  tableInfo(info){
    const { edit,data,details,index} = info;
    details&&(this.routeToDeviceDeviceTypeDetails(index));
 }

  routeToDeviceDeviceTypeDetails(index){
    this.router.navigate([`/resha-farms/mulberry-iot/advisory-details`,this.res[index].farmId]);
  }

  getAdvisoryList(paginationData=false,searchText=''){
    this.ngxLoader.stop();
    this.apiSearch.getMulberryAdvisoryList(paginationData=false,this.buildSerachQuery(searchText)).then(res=>{
      this.advisoryList = [];
      console.log(res);
      this.res = res['content'];
      this.res.filter(record=>{
        console.log(record);
        
        const obj={};
        obj['Farm ID'] = record?.farmId ? record?.farmId : ' - ',
        obj['Plot ID'] = record?.plotId ? record?.plotId : ' - ',
        obj['Device ID'] = record?.deviceId ? record?.deviceId  : ' - ',
        obj['Farmer'] = record?.farmerName + '-' + record?.farmerMobile ? record?.farmerName + '-' + record?.farmerMobile: ' - ',
        obj['Assignee'] = record?.assignee ? record?.assignee : ' - ',
        obj['Message'] = record?.createdMessage ? record?.createdMessage : ' - ',
        obj['Priority'] = record?.priority ? record?.priority : ' - ',
        // obj['ACTION'] = 'ACTION',
        // this.CONSTANT.ID ='RM CODE',
        // this.CONSTANT.ID ='ID',
        this.CONSTANT.ACTION ='',
        this.advisoryList.push(obj);
        console.log(this.advisoryList);
        
      });
      this.totalRecords = res['totalElements'];
      this._cd.detectChanges();
    })
  } 

  buildSerachQuery(searchText){
    const text = searchText.replace(/ /gi,"*");
    if(searchText){
      if(!isNaN(searchText)){
        return `(farmId==*${text}* or farmerName==*${text}* or farmerMobile==*${text}* or deviceId==*${text}* or plotId==*${text}* or assignee==*${text}*)`
      }else{
        return `(farmId==*${text}* or farmerName==*${text}* or farmerMobile==*${text}* or deviceId==*${text}* or plotId==*${text}* or assignee==*${text}*)`
      }
    }
  return ;
 }

 
  

  
}
