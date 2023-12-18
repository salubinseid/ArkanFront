import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private http: HttpClient) {}
  getAllStores(): Observable<any> {
    return this.http.get(environment.baseURL + '/stores');
  }
  getCountryStores(): Observable<any> {
    return this.http.get(environment.baseURL + '/stores/country');
  }

  getStoresName(): Observable<any> {
    return this.http.get(environment.baseURL + '/stores/name');
  }
  getStore(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/stores/' + id);
  }

  register(data: any) {
    return this.http.post(`${environment.baseURL}/stores`, data);
  }
  putStore(data: any, id: number) {
    return this.http.put<any>(environment.baseURL + '/stores/' + id, data);
  }

  deleteStore(id: number) {
    return this.http.delete<any>(environment.baseURL + '/stores/' + id);
  }
  //return list of stores managed by the storekeeper
  getManagedStores(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/stores/managedby/' + id);
  }
  //return storekeeper
  getStoreMan(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/stores/storeman/' + id);
  }

  //show all items in store
  getItemsInStore(): Observable<any> {
    return this.http.get(environment.baseURL + '/stores/items');
  }

  //show all items in a single store
  getItemsInSingleStore(id: any): Observable<any> {
    return this.http.get(`${environment.baseURL}/stores/${id}/items`);
  }

  //add item to store
  addItem(data: any): Observable<any> {
    return this.http.post(`${environment.baseURL}/stores/items`, data);
  }

  //unload items to store from trucks
  UnnlodItemToStore(data: any): Observable<any> {
    return this.http.post(`${environment.baseURL}/stores/unloadItems`, data);
  }

  //stored Item related transaction
  getStoredItem(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/stores/item/' + id);
  }

  //single store item info
  getStoredItems(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/stores/items/' + id);
  }

  //detail
  getStoreItemDetail(id: any) {
    return this.http.get(environment.baseURL + '/stores/items/detail/' + id);
  }

  //detail
  getStoreItemList(storeId: any, itemId: any) {
    return this.http.get(
      `${environment.baseURL}/stores/${storeId}/item/${itemId}/detail`
    );
  }
  //update
  putStoredItem(data: any, id: number) {
    return this.http.put<any>(
      environment.baseURL + '/stores/items/' + id,
      data
    );
  }

  //delete
  deleteStoredItem(id: number) {
    return this.http.delete<any>(environment.baseURL + '/stores/items/' + id);
  }

  //transfer items from one store to another
  transferStoreItem(data: any) {
    return this.http.post<any>(
      environment.baseURL + '/stores/items/transfer',
      data
    );
  }
}
