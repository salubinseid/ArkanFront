import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataResetService {
  constructor(private http: HttpClient) {}

  resetStoredItem() {
    return this.http.post(environment.baseURL + '/reset/storeditem', 'nodata');
  }

  resetSoldItem() {
    return this.http.post(environment.baseURL + '/reset/solditem', 'nodata');
  }
  resetCustomerData() {
    return this.http.post(environment.baseURL + '/reset/customerTransaction', 'nodata');
  }
  resetBankData() {
    return this.http.post(environment.baseURL + '/reset/bankTransaction', 'nodata');
  }
  resetPurchasedItem(){
    return this.http.post(environment.baseURL + '/reset/purchaseditem', 'nodata');

  }
}
