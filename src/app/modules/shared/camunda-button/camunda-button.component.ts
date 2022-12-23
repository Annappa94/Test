import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { MudraComundaService } from 'src/app/services/api/mudra-comunda.service';
import { CommunicationService } from 'src/app/services/component-communication/communication.service';

@Component({
  selector: 'app-camunda-button',
  templateUrl: './camunda-button.component.html',
  styleUrls: ['./camunda-button.component.scss']
})
export class CamundaButtonComponent implements OnInit,OnChanges,OnDestroy {

  @Input()
  taskInputVariables:any;

  @Input()
  externalId:string;

  @Input()
  entityType:string;

  @Input()
  business:string;

  @Input()
  validate:boolean = false;


  @Output()
  listenForTask:EventEmitter<any> = new EventEmitter<any>();

  refreshMSGSubscription:Subscription

  constructor(private communication:CommunicationService,private ngxUiLoader:NgxUiLoaderService,private api:MudraComundaService) { }
  ngOnDestroy(): void {
    this.refreshMSGSubscription.unsubscribe();
  }


  ngOnChanges(changes: SimpleChanges): void {
   this.validate&&this.getTaskInformation();
   this.listenForDetailsAPIRefresh();
  }

  getTaskInformation(status='STARTED'){
    this.ngxUiLoader.start();
    const query = `?externalId=${this.externalId}&business=${this.business}&status=${status}`
    this.api.getTaskByQuery(query).then((res:any[])=>{
        // this.task = res[0]?;
        this.taskInputVariables = res[0]?.taskInputVariables;
        this.emitDataToParent(res[0]);
    })
  }

  listenForDetailsAPIRefresh(){
    this.refreshMSGSubscription = this.communication.getComundaMudraRefresh().subscribe(refresh=>{
        this.getTaskInformation();
    });
    /** Refresh if there is any changes on the button page */
  }

  originalOrder:any = (a: KeyValue<number,string>, b: KeyValue<number,string>): number =>  0;


  markAS(action,titleSameAsButtonName){
    console.log(action);
    this.communication.setComundaMudraMsg({BUTTON_ACTION_FROM_UI:action,externalId:this.externalId,entityType:this.entityType,business:this.business,title:titleSameAsButtonName});
  }


  ngOnInit(): void {
  }

  emitDataToParent(task){
    this.listenForTask.emit(task);
  }

}
