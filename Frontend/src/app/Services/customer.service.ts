import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getAllCustomers(): Observable<any> {
    return this.http.get(environment.baseURL + '/customers');
  }

  getCustomersName(): Observable<any> {
    return this.http.get(environment.baseURL + '/customers/custsName');
  }

  register(data: any) {
    return this.http.post(environment.baseURL + '/customers', data);
  }

  getCustomer(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/customers/' + id);
  }
  getLastClosdeDate(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/customers/' + id+'/closedDate');
  }

  putCustomer(data: any, id: number) {
    return this.http.put<any>(environment.baseURL + '/customers/' + id, data);
  }

  //update bought customer unit itep cost
  updateShemach(id: number, cust: any) {
    return this.http.post<any>(
      environment.baseURL + '/customers/update/' + id,
      cust
    );
  }
  deleteCustomer(id: number) {
    return this.http.delete<any>(environment.baseURL + '/customers/' + id);
  }

  //detail of each customer detail
  getCustomerDetail(id: any, includedClosed:boolean) {
    let params = new HttpParams().set('includedClosed', includedClosed);

    if(includedClosed)
      return this.http.get(environment.baseURL + '/customers/detail/' + id,{params: params});
    return this.http.get(environment.baseURL + '/customers/detail/' + id);
  }

  //detail of each customer detail
  getCustomerPaymentDetail(id: any) {
    return this.http.get(
      environment.baseURL + '/customers/paymentDetail/' + id
    );
  }

  //close customer balance by updating on customer loads transaction tables
  closeBalance = (id:number) =>{
    return this.http.get(environment.baseURL + '/customer/closing/'+id);
  }
}
