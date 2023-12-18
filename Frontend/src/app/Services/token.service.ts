import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }
  // public isLogginSubject = new BehaviorSubject<boolean>(false);
  private iss = {
    login: 'http://localhost:8000/api/login',
    signup: 'http://localhost:8000/api/signup'
  };

  handleToken(token:any){
      this.setToken(token);
  }
  setToken(token:any){
    localStorage.setItem('token',token);
  }
  getToken(){
    return localStorage.getItem('token');
  }

  removeToken(){
    localStorage.clear()
    // localStorage.removeItem('token');
    // localStorage.removeItem('sorexUserId');
    // localStorage.removeItem('sorexUserRole');
    // localStorage.removeItem('sorexUserEmail');
  }

  isValidToken(){
    const token =  this.getToken();
    if(token){
      // const payload = this.tokenPayload(token);
      const payload = JSON.parse(atob(token.split('.')[1])  );
      // console.log(payload + "===>");
      if(payload){
        return payload.iss === environment.baseURL +'/login'?true :false;
      }
    }
    
  return false;
  }

  tokenPayload(token:any){
    const payload = token.split('.')[1];
    return this.decodePayload(payload)
  }

  decodePayload(payload:any)
  {
    return JSON.parse(atob(payload));
  }

  loggedIn(){
    return this.isValidToken();
  }

  refreshToken(){
   return true; 
  }
}
