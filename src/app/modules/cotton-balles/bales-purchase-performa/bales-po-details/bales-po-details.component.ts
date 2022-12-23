import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';


@Component({
  selector: 'app-bales-po-details',
  templateUrl: './bales-po-details.component.html',
  styleUrls: ['./bales-po-details.component.scss']
})
export class BalesPoDetailsComponent implements OnInit {
  data:any;
  res: any;
  CONSTANT: any;
  code;
  id;
  Spinningdata: any;

  constructor(
    private route: ActivatedRoute,
    private api:ApiService, 
    private router:Router,
    private ngxLoader:NgxUiLoaderService,
    private _cd: ChangeDetectorRef,
    public utils: UtilsService,
    private apiSearch:SearchService,
  ) {
    this.id = this.route.snapshot.params.id;
   }

  ngOnInit(): void {
    this.balesPoPerformaById();
  }

  balesPoPerformaById(){
    this.ngxLoader.stop();
    this.api.getBalePerformaById(this.id).then(res=>{
      this.data = res;
    })
   
  }

  goBack(){
    this.router.navigate(['/resha-farms//cotton-bale-po'])
  }
  routeToSpinningMill(){
    
      this.router.navigate([`spinning-mills/details/`+this.data.spinningMillId]);
     
  }

}
