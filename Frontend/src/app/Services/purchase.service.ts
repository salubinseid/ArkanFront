import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  constructor(private http: HttpClient) {}

  getAll(
    currentPage: number,
    pageSize: number,
    isDelivered: string
  ): Observable<any> {
    return this.http.get(
      `${environment.baseURL}/purchases?current_page=${currentPage}&per_page=${pageSize}&isDelivered=${isDelivered}`
    );
  }
  getCompanies = () => {
    return this.http.get(environment.baseURL + '/companies');
  };

  register(data: any) {
    return this.http.post(environment.baseURL + '/purchases', data);
  }

  get(id: any): Observable<any> {
    return this.http.get(environment.baseURL + '/purchases/' + id);
  }

  getLog(id: any): Observable<any> {
    return this.http.get(environment.baseURL + '/purchases/log/' + id);
  }
  updateRemainInfo(data: any, id: number, isNew: boolean) {
    return this.http.put<any>(
      `${environment.baseURL}/purchases/log/${id}`,
      data
    );
  }

  put(data: any, id: number) {
    return this.http.put<any>(environment.baseURL + '/purchases/' + id, data);
  }

  recordRemainInfo(data: any, id: number) {
    return this.http.post<any>(
      `${environment.baseURL}/purchases/${id}/recordRemainInfo`,
      data
    );
  }

  delete(id: number) {
    return this.http.delete<any>(environment.baseURL + '/purchases/' + id);
  }

  //update gudlet qty
  updateGudletQty(id: number, value: any) {
    return this.http.post<any>(
      environment.baseURL + '/purchases/update/gudlet/' + id,
      value
    );
  }
  //update delivered qty
  updateDeliveredQty(id: number, value: any) {
    return this.http.post<any>(
      environment.baseURL + '/purchases/update/delivered/' + id,
      value
    );
  }
  //update remain qty
  updateRemainQty(id: number, value: any) {
    return this.http.post<any>(
      environment.baseURL + '/purchases/update/remain/' + id,
      value
    );
  }

  updateDelivery(id: number, storeId: any) {
    return this.http.put<any>(
      environment.baseURL + '/purchases/update/deliver/' + id,
      { storeId: storeId }
    );
  }
  getAllDelivered() {
    return this.http.get(environment.baseURL + '/purchases/delivered');
  }

  getAllUnDelivered() {
    return this.http.get(environment.baseURL + '/purchases/undelivered');
  }
}
