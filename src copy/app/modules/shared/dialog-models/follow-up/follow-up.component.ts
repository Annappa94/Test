import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-follow-up',
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.scss']
})
export class FollowUpComponent implements OnInit {

  constructor(    
     private modalService: NgbModal,
  ) { }

  @Output()
  resoponeFromFollowUp:any=new EventEmitter();

  @Input()
  customerTypeList:String[] = [
    'Farmer','Retailer','Reeler','Weaver','Chawki'
  ];

  customerType:any=false;
  ngOnInit(): void {
  }
  slectCustomerType(customerType){
    this.customerType=customerType.target.value;
  }

  c(){
    this.modalService.dismissAll();
  }
  handelResponseFromFarmer(farmerRespone){
    this.resoponeFromFollowUp.emit(farmerRespone);
  }
}
