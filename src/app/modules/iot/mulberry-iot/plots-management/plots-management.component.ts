import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONSTANT } from 'src/app/constants/pagination.constant';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CustomValidator } from 'src/app/modules/shared/custom-validator/custom.validator';

@Component({
  selector: 'app-plots-management',
  templateUrl: './plots-management.component.html',
  styleUrls: ['./plots-management.component.scss']
})
export class PlotsManagementComponent implements OnInit {
  @ViewChild('content') div;

  rowDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  closeResult: string;
  selectedLGPartner:any;
  paginationData:boolean = false;
  searchText:string = '';
  plotsData: any;
  plotsDataResponse:any;


  tableHeaders:any=[
    {name:"Plot Code", sortName:'plotId'},
    {name:"Plot Name", sortName:'plotName', sort:true},
    {name:"Farmer", sortName:'plotLocation', sort:true},
    {name:"Device Code", sortName:'plotDistrict', sort:true}
  ];

  CONSTANT = CONSTANT;



  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    private apiSearch:SearchService,
    private utils:UtilsService,
    private modalService: NgbModal,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.getPlotsData();
  }

  onPageChange(data){
    const {paginationData,searchText,initial} = data;
    this.paginationData = paginationData;
    this.searchText = searchText;
    !initial && this.getPlotsData(paginationData,searchText);
  }
  
  
  tableInfo(info){
    const { edit,data,details,index} = info;
    // details&&(this.routeToDetailspage(index));
    // edit&&(this.routeToEditPage(index));
  }
  

  
   getPlotsData(paginationData=false,searchText=''){
     this.ngxLoader.stop();
     this.apiSearch.getMulberryIotdevicesData(this.paginationData,this.buildSerachQuery(searchText)).then((res:any)=>{
      this.plotsDataResponse = res['content'];
      this.plotsData = []
      console.log( res);
      this.plotsDataResponse.filter(record=>{
        console.log(record);
        const obj={};
        // obj['ID'] = record?.code ? record?.code : ' - ',
        obj['Plot Code'] = record?.plotCode  ? record?.plotCode  : ' - ',
        obj['Plot Name'] = record?.plotName ? record?.plotName  : ' - ',
        obj['Farmer'] = record?.farmerName + '-' +record?.farmerPhone ? record?.farmerName + '-' +record?.farmerPhone : ' - ',
        obj['Device Code'] = record?.deviceCode ? record?.deviceCode  : ' - '
 
        this.plotsData.push(obj);
        console.log(this.plotsData);
        
      });
    this.totalRecords = res['totalElements'];
    this._cd.detectChanges();
      
     
      this._cd.detectChanges();
     })
   } 


  buildSerachQuery(searchText){
    const text = searchText.replace(/ /gi,"*");
    if(searchText){
      if(!isNaN(searchText)){
        return `( plotCode==*${text}* or plotName==*${text}* or farmerName==*${text}* or farmerPhone==*${text}* or deviceCode==*${text}*)`
      }
      else{
        return `(plotCode==*${text}* or plotName==*${text}* or farmerName==*${text}* or farmerPhone==*${text}* or deviceCode==*${text}*)`
      }
    }
  return ;
  }

  
}
