import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(environment.baseURL + '/countries');
  }

  get(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/countries/' + id);
  }

  getByName() {
    return this.http.get(environment.baseURL + '/countries-list');
  }

  register(data: any) {
    return this.http.post(`${environment.baseURL}/countries`, data);
  }

  put(data: any, id: number) {
    return this.http.put<any>(environment.baseURL + '/countries/' + id, data);
  }

  delete(id: number) {
    return this.http.delete<any>(environment.baseURL + '/countries/' + id);
  }
}
