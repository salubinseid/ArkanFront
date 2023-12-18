import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyInfoService {
  constructor(private http: HttpClient) {}
  getAll(): Observable<any> {
    return this.http.get(environment.baseURL + '/companyInfo');
  }

  get(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/companyInfo/' + id);
  }

  post(data: any) {
    return this.http.post(`${environment.baseURL}/companyInfo`, data);
  }

  put(data: any, id: number) {
    return this.http.put(environment.baseURL + '/companyInfo/' + id, data);
  }

  delete(id: number) {
    return this.http.delete(environment.baseURL + '/companyInfo/' + id);
  }
}
