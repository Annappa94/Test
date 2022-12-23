import { Component, OnInit,ChangeDetectorRef,} from '@angular/core';

import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { RolesService } from 'src/app/services/roles/roles.service';

@Component({
  selector: 'app-tussar-list',
  templateUrl: './tussar-list.component.html',
  styleUrls: ['./tussar-list.component.scss']
})
export class TussarListComponent implements OnInit {
  

  

  constructor(
    
  )
  {
    
  }

  ngOnInit(): void {
  }

  

}


