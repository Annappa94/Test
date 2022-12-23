import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-advisorylist-details',
  templateUrl: './advisorylist-details.component.html',
  styleUrls: ['./advisorylist-details.component.scss']
})
export class AdvisorylistDetailsComponent implements OnInit {
  code;
  constructor( private route: ActivatedRoute,
    private api:ApiService, 
    private router:Router,
    private ngxLoader:NgxUiLoaderService,
    private _cd: ChangeDetectorRef,
    public utils: UtilsService,
    private apiSearch:SearchService,) {
    this.code = this.route.snapshot.params.code;
   }

  ngOnInit(): void {
  }

  goBack(){
    this.router.navigate([`/resha-farms/mulberry-iot/advisory-list`]);

    
  }

}
