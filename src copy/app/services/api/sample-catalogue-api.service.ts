import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SampleCatalogueApiService {
  private api: string = environment.API;
  private catalog_service = environment.API+ '/catalogsvc';

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllCategories(businessType, subBusinessType) {
    return this.httpClient.get(`${this.catalog_service}/search/categories?businessType=${businessType}&subBusinessType=${subBusinessType}`).toPromise();
  }

  getAllFabrics(businessType, subBusinessType) {
    return this.httpClient.get(`${this.catalog_service}/search/fabrics?businessType=${businessType}&subBusinessType=${subBusinessType}`).toPromise();
  }

  getAllColors() {
    return this.httpClient.get(`${this.catalog_service}/filter/d2r/colors`).toPromise();
  }

  getAllBorders() {
    return this.httpClient.get(`${this.catalog_service}/filter/d2r/borders`).toPromise();
  }

  createSampleSku(param) {
    return this.httpClient.post(`${this.catalog_service}/sku`, param).toPromise();
  }

  getSkuCatalogById(id) {
    return this.httpClient.get(`${this.catalog_service}/sku/${id}`).toPromise();
  }

  updateSkuCatalogById(id, param) {
    return this.httpClient.patch(`${this.catalog_service}/sku/${id}`, param).toPromise();
  }

  deleteSkuCatalogById(id) {
    return this.httpClient.delete(`${this.catalog_service}/sku/${id}`).toPromise();
  }

  getAllPackagingSizes(query) {
    return this.httpClient.get(`${this.catalog_service}/search/packaging/spec?search=${query}&page=0&size=100&sort=displayName,asc`).toPromise();
  }

  createYarnSample(param) {
    return this.httpClient.post(`${this.catalog_service}/yarns`, param).toPromise();
  }

  getYarnSampleById(id) {
    return this.httpClient.get(`${this.catalog_service}/yarns/${id}`).toPromise();
  }

  updateYarnSampleById(param, id) {
    return this.httpClient.patch(`${this.catalog_service}/yarns/${id}`, param).toPromise();
  }

  deleteYarnSampleById(id) {
    return this.httpClient.delete(`${this.catalog_service}/yarns/${id}`).toPromise();
  }


  uploadSkuCatalogCsv(param) {
    let formData:FormData = new FormData();
    formData.append('file', param.file);
    formData.append('businessType', param.businessType);
    formData.append('subBusinessType', param.subBusinessType);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.httpClient.post(`${this.catalog_service}/skus/upload`, formData,{headers}).toPromise();
  }

  getProductLine() {
    return this.httpClient.get(`${this.catalog_service}/search/v1/productline/spec?page=0&sort=createdDate,desc`).toPromise();
  }

  getSareeAttributes(productLine) {
    return this.httpClient.get(`${this.catalog_service}/search/v1/attributes/saree/spec?search=productLine=='${productLine}'`).toPromise();
  }

  getHomeFurnishingAttributes(productLine) {
    return this.httpClient.get(`${this.catalog_service}/search/v1/attributes/homefurnishing/spec?search=productLine=='${productLine}'`).toPromise();
  }

  getFabricAttributes(productLine) {
    return this.httpClient.get(`${this.catalog_service}/search/v1/attributes/fabric/spec?search=productLine=='${productLine}'`).toPromise();
  }

  getApparelAttributes(productLine) {
    return this.httpClient.get(`${this.catalog_service}/search/v1/attributes/apparel/spec?search=productLine=='${productLine}'`).toPromise();
  }
}
