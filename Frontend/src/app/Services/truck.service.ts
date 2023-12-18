import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TruckService {
  
  constructor( private http:HttpClient) { }

  getAllTrucks():Observable<any>{
    return this.http.get(environment.baseURL+'/trucks');
  }


  getTrucksName():Observable<any>{
   return this.http.get(environment.baseURL+'/trucks/trucksName');
 }
 
  register(data:any){
   return this.http.post(`${environment.baseURL}/trucks`,data);
 }

}
