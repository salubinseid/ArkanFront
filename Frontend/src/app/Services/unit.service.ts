import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(environment.baseURL + '/units');
  }

  get(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/units/' + id);
  }

  getByName() {
    return this.http.get(environment.baseURL + '/units-list');
  }

  register(data: any) {
    return this.http.post(`${environment.baseURL}/units`, data);
  }

  put(data: any, id: number) {
    return this.http.put<any>(environment.baseURL + '/units/' + id, data);
  }

  delete(id: number) {
    return this.http.delete<any>(environment.baseURL + '/units/' + id);
  }
}
