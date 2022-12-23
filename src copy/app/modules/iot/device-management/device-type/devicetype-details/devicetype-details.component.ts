import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
@Component({
  selector: 'app-devicetype-details',
  templateUrl: './devicetype-details.component.html',
  styleUrls: ['./devicetype-details.component.scss']
})
export class DevicetypeDetailsComponent implements OnInit {
  data:any;
  res: any;
  CONSTANT: any;
  Devicedetailes:any;
  detailes:any;

  ngOnInit(): void {
    this.devicetypedetailscontent();
    this.devicedetails()
  }

  goBack(){
    this.router.navigate(['/resha-farms/device-management/device-type'])
  }

  code;
  id;
  associatedDevicetypeDetailInfo:any;
  
  constructor(
    private route: ActivatedRoute,
    private api:ApiService, 
    private router:Router,
    private ngxLoader:NgxUiLoaderService,
    private _cd: ChangeDetectorRef,
    public utils: UtilsService,
    private apiSearch:SearchService,
  )
  {
    this.code = this.route.snapshot.params.code;
  }

  devicetypedetailscontent(){
    this.ngxLoader.stop();
    this.api.getDeviceTypesById(this.code).then(res=>{
      this.data = res;
      this._cd.detectChanges();
    })
  }
  devicedetails(){
    this.ngxLoader.stop();
    this.api.getDeviceDetailessById(this.code).then(res=>{
      this.Devicedetailes = res;
      
      console.log("Detailes data",this.Devicedetailes)
    })
  }


}
