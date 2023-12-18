import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(environment.baseURL + '/expenseTypes');
  }

  get(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/expenseTypes/' + id);
  }

  getByName() {
    return this.http.get(environment.baseURL + '/expenseTypes-list');
  }

  register(data: any) {
    return this.http.post(`${environment.baseURL}/expenseTypes`, data);
  }

  //update expense amount for purchase
  updateExpenseAmount(id:number, value:any){
    return this.http.post<any>(
      environment.baseURL + '/expenses/change/' + id,
      value
    );
  }

  put(data: any, id: number) {
    return this.http.put<any>(
      environment.baseURL + '/expenseTypes/' + id,
      data
    );
  }

  delete(id: number) {
    return this.http.delete<any>(environment.baseURL + '/expenseTypes/' + id);
  }

  getAllExpense(): Observable<any> {
    return this.http.get(environment.baseURL + '/expenses');
  }

  getExpense(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/expenses/' + id);
  }

  getExpenseOfPurchased(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/expenses/purchase/' + id);
  }

  registerExpense(data: any) {
    return this.http.post(`${environment.baseURL}/expenses`, data);
  }

  putExpense(data: any, id: number) {
    return this.http.put<any>(environment.baseURL + '/expenses/' + id, data);
  }

  deleteExpense(id: number) {
    return this.http.delete<any>(environment.baseURL + '/expenses/' + id);
  }


  // for Income and expense handles in one group

  getAllIncomeExpense(): Observable<any> {
    return this.http.get(environment.baseURL + '/incomeExpenseTypes');
  }

  getIncomeExpense(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/incomeExpenseTypes/' + id);
  }

  getIncomeExpenseOfPurchased(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/incomeExpenseTypes/purchase/' + id);
  }

  registerIncomeExpense(data: any) {
    return this.http.post(`${environment.baseURL}/incomeExpenseTypes`, data);
  }

  putIncomeExpense(data: any, id: number) {
    return this.http.put<any>(environment.baseURL + '/incomeExpenseTypes/' + id, data);
  }

  deleteIncomeExpense(id: number) {
    return this.http.delete<any>(environment.baseURL + '/incomeExpenseTypes/' + id);
  }
}
