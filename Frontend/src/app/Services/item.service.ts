import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private http: HttpClient) {}

  getAllItems(currentPage: number, pageSize: number): Observable<any> {
    return this.http.get(
      `${environment.baseURL}/items?current_page=${currentPage}&per_page=${pageSize}`
    );
  }

  getItemsName(): Observable<any> {
    return this.http.get(environment.baseURL + '/items-list');
  }

  register(data: any) {
    return this.http.post(environment.baseURL + '/items', data);
  }

  getItem(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/items/' + id);
  }

  getItemUnits(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/items/unit/' + id);
  }

  putItem(data: any, id: number) {
    return this.http.put<any>(environment.baseURL + '/items/' + id, data);
  }

  deleteItem(id: number) {
    return this.http.delete<any>(environment.baseURL + '/items/' + id);
  }
}
