import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MakerCheckerRoute } from 'src/app/constants/enum/constant.makers.checkers';
import { Item } from 'src/app/model/checkers/checkers.model';
import { ApiService } from 'src/app/services/api/api.service';
import { CommunicationService } from 'src/app/services/component-communication/communication.service';

@Component({
  selector: 'app-approve-or-reject-button',
  templateUrl: './approve-or-reject-button.component.html',
  styleUrls: ['./approve-or-reject-button.component.scss']
})
export class ApproveOrRejectButtonComponent implements OnInit,OnChanges{
  /** Component will decide the button by making API, Or else you have to send All info 
   * 
    */
  isDisplay : boolean = false;
  
  originalOrder:any = (a: KeyValue<number,string>, b: KeyValue<number,string>): number =>  0;

  @Input()
  validate: Boolean = false;

  @Input()
  entityId: number = 0;

  @Input()
  processType: any = "SKUBatchAudit1"

  @Input()
  defaultIcon:boolean = true;
  
  @Input()
  refresh ;

  @Input()
  approvalList:any[];

  @Output()
  emitTransition :EventEmitter<any> = new EventEmitter<any[]>();

  MakerCheckerRoute ={ ...MakerCheckerRoute };

  @Input() disableRejectButton = false;

  constructor(
    private communication:CommunicationService,
    private api:ApiService,
    private router:Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    (this.validate && this.entityId)?this.checkForPremisions(this.entityId):this.isDisplay = true;
  }
  
  checkForPremisions(enityId:number){
    this.api.getStateTransitions(enityId,this.processType).subscribe((res:any)=>{
      this.isDisplay = true;
      this.approvalList = res;
      this.emitTransition.emit(res);
    },err=>{
      if(err.status==404){
        this.isDisplay =false;
      }
    })
  }


  markAS(status:string,actionName:string,obj:Item){
    const {id,targetState,entityId,entityCode} = obj.transition
    const path:string = obj.definition.routeUrl;
    ('Rejected'==status || !path )&&this.communication.setMsg({id,status,actionName,entityId:entityId,processType:this.processType,entityCode});
    !('Rejected'==status)&&path&&this.router.navigate(['weaver-sku-batch/'+path,status,actionName,entityId,targetState,id]);
  }

  ngOnInit(): void {

  }

}
