import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProcessTaskData } from 'src/app/constants/comunda/constant.comunda';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  public $msg: Subject <any> = new Subject<any>();
  public $refreshMSG:BehaviorSubject<any> = new BehaviorSubject<any>(false);


  public $comundaMudraMsg:Subject<any> = new Subject<any>();
  public $comundaMudraRefresh:Subject<number|void> = new Subject<number|void>();

  public $comundaMsg:Subject<ProcessTaskData> = new Subject<ProcessTaskData>();
  public $comundaRefresh:Subject<number|void> = new Subject<number|void>();

  public $camundaMsgB2B :Subject<ProcessTaskData> = new Subject<ProcessTaskData>();
  public $camundaMsgB2BRefresh:Subject<number|void> = new Subject<number|void>();


  constructor() { }

  public getMsg(){
    return this.$msg.asObservable();
  }
  public getRefreshMSG(){
    return this.$refreshMSG.asObservable();
  }

  public setMsg(msg:any){
    this.$msg.next(msg);
  }
  public setRefreshMSG(msg:RefreshMSG){
    this.$refreshMSG.next(msg);
  }

  public getComundaMudraMsg(){
    return this.$comundaMudraMsg.asObservable();
  }

  public getComundaMudraRefresh(){
    return this.$comundaMudraRefresh.asObservable();
  }

  public setComundaMudraRefresh(entityId:any){
    this.$comundaMudraRefresh.next(entityId);
  }

  public setComundaMudraMsg(msg:any){
    this.$comundaMudraMsg.next(msg);
  }

  public getComundaMsg(){
    return this.$comundaMsg.asObservable();
  }

  public getComundaRefresh(){
    return this.$comundaRefresh.asObservable();
  }

  public setComundaRefresh(entityId:number){
    this.$comundaRefresh.next(entityId);
  }

  public setComundaMsg(msg:ProcessTaskData){
    this.$comundaMsg.next(msg);
  }

  public setCamundaMsgB2BRefresh(entityId:any){
    this.$camundaMsgB2BRefresh.next(entityId);
  }

  public setCamundaMsgB2B(msg:any){
    this.$camundaMsgB2B.next(msg);
  }
}

export interface RefreshMSG{
  isRefresh: Boolean,
  isDeatilsRefresh: Boolean,
}


