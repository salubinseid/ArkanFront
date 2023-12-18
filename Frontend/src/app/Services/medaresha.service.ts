import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedareshaService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(environment.baseURL + '/checkpoints');
  }

  get(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/medareshas/' + id);
  }

  getByName() {
    return this.http.get(environment.baseURL + '/medareshas-list');
  }

  register(data: any) {
    return this.http.post(`${environment.baseURL}/medareshas`, data);
  }

  put(data: any, id: number) {
    return this.http.put<any>(environment.baseURL + '/medareshas/' + id, data);
  }

  delete(id: number) {
    return this.http.delete<any>(environment.baseURL + '/medareshas/' + id);
  }

  getLoadMedaresha(id: number) {
    return this.http.get(environment.baseURL + '/medaresha/' + id);
  }

  getMedareshTariff(id: number, loadId: number) {
    return this.http.get(
      environment.baseURL + '/medaresha/' + id + '/tariff/' + loadId
    );
  }
}
