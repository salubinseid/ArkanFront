import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RentService {

  
  constructor( private http:HttpClient) {

   }

  getAllRents():Observable<any>{
    return this.http.get(environment.baseURL+'/rents');
  }

  getRentsName():Observable<any>{
    return this.http.get(environment.baseURL + '/rents/rentsName');
   }

  register(data:any){
    return this.http.post(`${environment.baseURL}/rents`,data);
  }
}