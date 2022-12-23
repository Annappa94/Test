import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-rearing-iot-devicelist',
  templateUrl: './rearing-iot-devicelist.component.html',
  styleUrls: ['./rearing-iot-devicelist.component.scss']
})
export class RearingIotDevicelistComponent implements OnInit {

  @ViewChild('content') div;


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
  }

  riotdeviceDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  closeResult: string;
  selectedLGPartner:any;
  paginationData:boolean = false;
  searchText:string = '';

  tableHeaders:any=[
    {name:"Rearing iot device id", sortName:'deviceCode'},
    {name:"Rearing iot device name", sortName:'deviceName', sort:true},
    {name:"Rearing iot device rate", sortName:'deviceRate', sort:true},
    {name:"Rearing iot device availability", sortName:'deviceAvailability', sort:true},
    {name:"Rearing iot device discount", sortName:'deviceDiscount', sort:true},
    {name:'ACTION'},
  ];

}
