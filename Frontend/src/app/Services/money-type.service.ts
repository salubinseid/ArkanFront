import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MoneyTypeService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(environment.baseURL + '/moneyTypes');
  }

  get(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/moneyTypes/' + id);
  }

  getByName() {
    return this.http.get(environment.baseURL + '/moneyTypes-list');
  }

  register(data: any) {
    return this.http.post(`${environment.baseURL}/moneyTypes`, data);
  }

  put(data: any, id: number) {
    return this.http.put<any>(environment.baseURL + '/moneyTypes/' + id, data);
  }

  delete(id: number) {
    console.log('here is the action');
    return this.http.delete<any>(environment.baseURL + '/moneyTypes/' + id);
  }
}
