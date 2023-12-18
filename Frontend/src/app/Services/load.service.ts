import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoadService {
  constructor(private http: HttpClient) {}

  getAllLoads(): Observable<any> {
    return this.http.get(environment.baseURL + '/loads');
  }
  getLoadDetail(id: any): Observable<any> {
    return this.http.get(environment.baseURL + '/loads/detail/' + id);
  }

  getAllSoldLoads(): Observable<any> {
    return this.http.get(environment.baseURL + '/sales/sold');
  }
  getSoldDetail(id: any) {
    return this.http.get(environment.baseURL + '/sales/sold/' + id);
  }

  register(data: any) {
    return this.http.post(`${environment.baseURL}/loads`, data);
  }

  getLoad(id: number): Observable<any> {
    return this.http.get(environment.baseURL + '/loads/' + id);
  }

  putLoad(data: any, id: number) {
    return this.http.put<any>(environment.baseURL + '/loads/' + id, data);
  }

  deleteLoad(id: number) {
    return this.http.delete<any>(environment.baseURL + '/loads/' + id);
  }

  // set unit saling price of item/good after sold
  updateUnitPriceAfterSold(id: number, price: any) {
    return this.http.post<any>(
      environment.baseURL + '/loads/item/sold/price/' + id,
      price
    );
  }
   // set unit saling price of item/good while in the loadin
   updateUnitPrice(id: number, price: any) {
    return this.http.post<any>(
      environment.baseURL + '/loads/item/price/' + id,
      price
    );
  }

 //update transport unit item cost at loading
 updateTransportUnitPriceAfterSold(id: number, price: any) {
  return this.http.post<any>(
    environment.baseURL + '/loads/transport/price/' + id,
    price
  );
}

  //add remark
  addRemark(id: number, remark: any) {
    return this.http.post<any>(
      environment.baseURL + '/loads/transport/remark/' + id,
      remark
    );
  }

  //
  updateLoadTariff(id: number, price: any) {
    return this.http.post<any>(
      environment.baseURL + '/loads/item/tariff/' + id,
      price
    );
  }

  //update next chekpoint station value
  updateNextStation(id: number, price: any) {
    return this.http.post<any>(
      environment.baseURL + '/loads/update/checkpoint/' + id,
      price
    );
    }
    //update loan by driver
    updateDriverLoan(id:number, value:any){
      return this.http.post<any>(
        environment.baseURL + '/loads/update/loan/' + id,
        value
      );
    }
    //update other expenses by driver
    updateOtherExpense(id:number, value:any){
      return this.http.post<any>(
        environment.baseURL + '/loads/update/expense/' + id,
        value
      );
   }


   registerMedareshaTariff(data: any) {
    return this.http.post(`${environment.baseURL}/loads/medareshaTariff`, data);
  }

  updateMedareshTariff(data: any, id: number) {
    return this.http.post<any>(
      environment.baseURL + '/loads/' + id + '/medareshaTariff',
      data
    );
  }
  isExistMedaresh(loadId: number, medareshaId: number) {
    return this.http.get<any>(
      environment.baseURL + '/loads/' + loadId + '/medaresha/' + medareshaId
    );
  }
}
