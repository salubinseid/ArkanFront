import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Bank } from '../models/Bank';
import { CRUDServices } from './CRUDServices';

@Injectable({
  providedIn: 'root',
})
export class BankService extends CRUDServices<Bank> {
  // url:string = "http://localhost:8000/api"
  constructor(protected override http: HttpClient) {
    super(http, 'banks');
  }

  getBankLists(): Observable<any> {
    return this.http.get(environment.baseURL + '/bank/list');
  }
  getBankNames(): Observable<any> {
    return this.http.get(environment.baseURL + '/bank/names');
  }
  registerNewBank(data: any) {
    return this.http.post(`${environment.baseURL}/bank/new`, data);
  }
  updateBank(data: any, id: number) {
    return this.http.put<any>(environment.baseURL + '/bank/update/' + id, data);
  }
  removeBank(id: number) {
    return this.http.delete<any>(environment.baseURL + '/bank/delete/' + id);
  }
  getAllAccounts(id: number): Observable<any> {
    return this.http.get(`${environment.baseURL}/banks/${id}/accounts`);
  }

  getAllBanks(): Observable<any> {
    return this.getAll();
    //return this.http.get(environment.baseURL+'/banks');
  }
  register(data: any) {
    return this.http.post(`${environment.baseURL}/banks`, data);
  }
  getBank(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/banks/' + id);
  }
  getBankCountry(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/banks/country/' + id);
  }

  putBank(data: any, id: number) {
    return this.http.put<any>(environment.baseURL + '/banks/' + id, data);
  }
  deleteBank(id: number) {
    return this.http.delete<any>(environment.baseURL + '/banks/' + id);
  }

  resetBankAll() {
    return this.http.get(environment.baseURL + '/banks/resetAll');
  }

  traferAccount(data: any) {
    return this.http.post(environment.baseURL + '/banks/transfer', data);
  }

  getAccouctDetail(id: any) {
    return this.http.get(environment.baseURL + '/banks/show/' + id);
  }

  getTransfer(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/transfers/' + id);
  }

  getAllTransfers(): Observable<any> {
    return this.http.get(environment.baseURL + '/transfers');
  }
  getTransferDetail(id: any) {
    return this.http.get(environment.baseURL + '/transfers/show/' + id);
  }

  transfer(data: any) {
    return this.http.post(`${environment.baseURL}/transfers`, data);
  }

  putTransfer(data: any, id: number) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http.post<any>(environment.baseURL + '/transfers/' + id, data, {
      headers: headers,
    });
  }

  deleteTransfer(id: number) {
    return this.http.delete<any>(environment.baseURL + '/transfers/' + id);
  }

  //debit related functions

  getAllDebit(): Observable<any> {
    return this.http.get(environment.baseURL + '/debits');
  }

  // getBanksName(): Observable<any> {
  //   return this.http.get(environment.baseURL + '/banks/banksName');
  // }

  getAllActiveBanksName(): Observable<any> {
    return this.http.get(environment.baseURL + '/banks/allBanksName');
  }
  //detail of each customer detail
  getDebitDetail(id: any) {
    return this.http.get(environment.baseURL + '/debits/detail/' + id);
  }

  payDebit(data: any) {
    return this.http.post(environment.baseURL + '/debits/pay', data);
  }

  //checking functions
  isAccountExist(id: any) {
    return this.http.get(environment.baseURL + '/banks/check/' + id);
  }
}
