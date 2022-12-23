import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MudraComundaService {
  private API: string = environment.API;

  constructor(private httpClient:HttpClient) { 

  } 

  processTaskToNextStep(endpoint,data,payload={}){
    const { requestedId ,status,externalId} = data;
    return this.httpClient.post(`${this.API}/${endpoint}/process?requestId=${requestedId}&status=${status}&externalId=${externalId}`,payload).toPromise();
  }

  async getTaskByQuery(search:any=false){
    const searchQuery=search?`${search}`:``;
    return this.httpClient.get(`${this.API}/mudrawfmgmtsvc/workflowmanagement/alltask/spec${searchQuery}`).toPromise();
  }

  async processTask(endpoint,payload){
    return this.httpClient.post(`${this.API}/${endpoint}/processtask`,payload).toPromise();
  }
  async salesorderTask(id, payload){
    return this.httpClient.patch(`${this.API}/salesorder/${id}`, payload).toPromise();
  }

}
