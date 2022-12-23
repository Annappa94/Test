import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Actions, CAMUNDA_CONFIGURATION, ProcessTaskData } from 'src/app/constants/comunda/constant.comunda';
import { ComundaAPIService } from 'src/app/services/api/comunda-api.service';
import { CommunicationService } from 'src/app/services/component-communication/communication.service';

@Component({
  selector: 'app-fetch-buttton-dynamically',
  templateUrl: './fetch-buttton-dynamically.component.html',
  styleUrls: ['./fetch-buttton-dynamically.component.scss']
})
export class FetchButttonDynamicallyComponent implements OnInit,OnChanges {


  CAMUNDA_CONFIGURATION = {...CAMUNDA_CONFIGURATION};

  @Input()
  entityId:number;

  @Input()
  entityType:string;

  buttonList:any[] = [];

  @Input()
  processState:string;

  task:any;

  @Input()
  processTaskInformation:any[]=[];

  constructor(private communication:CommunicationService,private api:ComundaAPIService,private ngxUiLoader:NgxUiLoaderService,private router:Router) { }

  ngOnChanges(changes: SimpleChanges): void {

    if(this.processTaskInformation.length){  // if button is from task listing page where i don't have to call an api 
      this.task = this.processTaskInformation[0],
      this.buttonList = this.getComundaConfiguration()?.buttonsList;
    }else{
      this.entityId&&this.getTaskByEntityIdAndEntityType();//I have to call an API using entityType
    }
  }


  refreshTheButton(){
    this.communication.getComundaRefresh().subscribe(entityId=>{
      if(entityId==this.entityId){
        this.getTaskByEntityIdAndEntityType();
      }
    })
  }

  ngOnInit(): void {
    !this.processTaskInformation.length && this.entityId &&this.getTaskByEntityIdAndEntityType();
    this.refreshTheButton();
  }

  getComundaConfiguration(){
    return this.CAMUNDA_CONFIGURATION[this.entityType][this.processState]; /** Entity Type example:-YARN_ORDER_RETURN   .status is record Status for Ex:- Yarn Order NEW APPROVED,SHIPPED */
  }

  getTaskByEntityIdAndEntityType(){
    this.ngxUiLoader.start();
    this.buttonList =[];
    this.api.getTaskByQuery(`externalId=${this.entityId}&entityType=${this.entityType}&status=STARTED`).then((res:any[])=>{
      if(res.length){
        /** If there is process Task is there then only show the button which are configured from Config file */
       this.task = res[0];
       this.processState = res[0]?.processState;
       this.buttonList = this.getComundaConfiguration()?.buttonsList;
      }
    })
  }

  actionProcess(button:{action:string,routeToUpdateDetails:string}){
    if(button.routeToUpdateDetails){
      this.router.navigate([button.routeToUpdateDetails,this.entityId]);
      return;
    }


    this.task.ACTION_FROM_UI = button.action;
    this.task.recordStatus = this.processState;
    this.task.entityTypeFromUI = this.entityType;
    this.communication.setComundaMsg(this.task);/** This will open a popup at app.component.ts file with comunda.assigne.approve-reject component */
  }

}
