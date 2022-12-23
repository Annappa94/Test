import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-rearing-iot-advisory-list',
  templateUrl: './rearing-iot-advisory-list.component.html',
  styleUrls: ['./rearing-iot-advisory-list.component.scss']
})
export class RearingIotAdvisoryListComponent implements OnInit {
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

  advisoriesDataList:any[]=[];
  res:any[]=[];
  totalRecords:number = 0;
  modalRef;
  closeResult: string;
  selectedLGPartner:any;
  paginationData:boolean = false;
  searchText:string = '';

  tableHeaders:any=[
    {name:"Advisory ID", sortName:'code'},
    {name:"Given by", sortName:'deviceName', sort:true},
    {name:"Advisory for", sortName:'brand', sort:true},
    {name:"Contact", sortName:'manufacturer', sort:true},
    {name:"Received by", sortName:'vendor', sort:true},
    {name:'ACTION'},
  ];

}
