import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

    constructor(private http: HttpClient) {

   }

   getAllEmployees():Observable<any>{
     return this.http.get(environment.baseURL +'/employees');
   }
   getEmployeesName():Observable<any>{
    return this.http.get(environment.baseURL + '/getEmployeesName');
   }

   getEmployee(id:number):Observable<any>{
    return this.http.get(environment.baseURL+'/employees/'+id);
  }
  getEmployeeCountry(id:number):Observable<any>{
    return this.http.get(environment.baseURL+'/employees/country/'+id);
  }
  register(data:any){
    return this.http.post(environment.baseURL+'/employees' ,data);

  }

  putEmployee(data:any,id:number){
    return this.http.put<any>(environment.baseURL+'/employees/'+id,data);
  }

  deleteEmployee(id:number){
    return this.http.delete<any>(environment.baseURL+'/employees/'+id);
  }

}
