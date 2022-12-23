import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';

@Component({
  selector: 'app-oil-spinning-mill-details',
  templateUrl: './oil-spinning-mill-details.component.html',
  styleUrls: ['./oil-spinning-mill-details.component.scss']
})
export class OilSpinningMillDetailsComponent implements OnInit {

 

  data: any;
  res: any;
  CONSTANT: any;
  code;
  id;
  gstDetails: any[];
  modalRef: any;
  closeResult: string;
  gstNumber: any;


  gstform: any = new UntypedFormGroup({
    gstNumber: new UntypedFormControl('',[Validators.required, Validators.pattern("^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$")]),
    
  })

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    private _cd: ChangeDetectorRef,
    public utils: UtilsService,
    private apiSearch: SearchService,
    private modalService: NgbModal,
  ) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.spinningMillsdataById();
  }


  spinningMillsdataById() {
    this.ngxLoader.stop();
    console.log(this.code);
    this.gstDetails = [];
    this.api.getOilSpinningMillById(this.id).then(res => {
      this.data = res;
      this.data?.gstNumberProfileDetails?.forEach(item => {
        this.gstDetails?.push(item);
      })
      console.log(res);
    })
  }

  goBack() {
    this.router.navigate(['/resha-farms/spinning-mills'])
  }
  openGSTPpopup(gstpopup) {
    this.gstNumber = '';
    this.modalRef = this.modalService.open(gstpopup)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  verifyGST() {
    let reqObj ={
      "gstnumber":this.gstNumber.trim(),
      "id":parseInt(this.id),
      "cottonVendorType":"OIL_MILL"
    }
    this.api.updateMoreGstNumber(reqObj).then(response => {
      console.log(response);
      this.modalRef.close();
      this.spinningMillsdataById();
    }, error => {
      console.log(error);
    })
  }

}
