import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckpointService {

  
  constructor( private http:HttpClient) {

   }

  getAllCheckpoints():Observable<any>{
    return this.http.get(environment.baseURL+'/checkpoints');
  }

  getCheckpoint(id:number):Observable<any>{
    return this.http.get(environment.baseURL+'/checkpoints/'+id);
  }

  getCheckpointsName(){
    return this.http.get(environment.baseURL+'/checkpoint-lists');
  }

  register(data:any){
    return this.http.post(`${environment.baseURL}/checkpoints`,data);
  }

  putCheckpoint(data:any,id:number){
    return this.http.put<any>(environment.baseURL+'/checkpoints/'+id,data);
  }

  deleteCheckpoint(id:number){
    return this.http.delete<any>(environment.baseURL+'/checkpoints/'+id);
  }

}
