import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComundaAPIService {

  constructor(private httpClient: HttpClient) { }

  private comundaAPI: string = `${environment.API}/platwfmgmtsvc`;
  private sorAPI:string = environment.API;

  private defaultPagination={
    currentPage : 0,
    pageSize    : 10,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  }
  async getTaskByQuery(search:any=false){
    const searchQuery=search?`${search}`:``;
    return this.httpClient.get(`${this.comundaAPI}/workflowmanagement/alltask/spec?${searchQuery}`).toPromise();
  }
  async getTaskByB2BQuery(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;

    return this.httpClient.get(`${this.comundaAPI}/workflowmanagement/spec?${searchQuery}`).toPromise();
  }

  processTaskToNextStep(entityId,payload){
    return this.httpClient.post(`${this.sorAPI}/yarnorderreturn/${entityId}/processtask`,payload).toPromise();
  }

  async getTopicToApprove(completeEndPoint){
    return await this.httpClient.get(`${this.sorAPI}/${completeEndPoint}`).toPromise();
  }

  async getCustomerDeposits(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.comundaAPI}/workflowmanagement/alltask/spec?${searchQuery}`).toPromise();
   }

   async getTaskList(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.comundaAPI}/workflowmanagement/alltask/spec?${searchQuery}`).toPromise();
   }
}
