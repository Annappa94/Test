import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sales-order-block-pop-up',
  templateUrl: './sales-order-block-popup.component.html',
  styleUrls: ['./sales-order-block-popup.component.scss']
})
export class SalesOrderBlockComponent implements OnInit {
  modalRef;
  @Input()
  followUpStatus = '';

  constructor(
    private modalService: NgbModal,
  ) { }

  close() {
    this.modalService.dismissAll();
  }

  ngOnInit(): void {
  }

}
