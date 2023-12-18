import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class StorexService {
  private currentUserSource = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSource.asObservable;
  loggedIn = new BehaviorSubject<boolean>(this.token.loggedIn());
  authStatus = this.loggedIn.asObservable();

  permissions = new BehaviorSubject<any>('');
  permissionsList = this.permissions.asObservable();

  private refreshTokenTimeout: any;

  constructor(
    private http: HttpClient,
    private token: TokenService,
    private router: Router
  ) {}

  changeAuthStatus(value: boolean) {
    this.loggedIn.next(value);
  }

  checkAuthStatus() {
    return this.authStatus;
  }
  getCurrentUserValue() {
    return this.currentUserSource.value;
  }

  //login function
  login(data: any) {
    return this.http.post(`${environment.baseURL}/login`, data);
    // .pipe(
    // map((user: any) => {
    //     if (user) {
    //       this.loggedIn.next(true);
    //       localStorage.setItem('token', user.access_token);
    //       this.setUser(user.user);
    //       this.startRefreshTokenTimer();
    //       this.getUserPermission().subscribe((res) => {
    //         const result = JSON.stringify(res);
    //         localStorage.setItem('permissions', result);
    //       });
    //     }
    //   })
    // );
  }

  getUserPermission() {
    return this.http.get(environment.baseURL + '/user/permissions');
  }

  hasPermission(value: any): boolean {
    const perm = localStorage.getItem('permissions');
    const permissions = JSON.parse(perm!);
    // console.log('Has permission', permissions);
    return value ? permissions?.includes(value) : null;
  }
  logout() {
    // localStorage.removeItem('token');
    this.http.get(environment.baseURL + '/logout');
    this.stopRefreshTokenTimer();
    localStorage.clear();
    this.loggedIn.next(false);
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/login');
  }

  refreshToken() {
    return this.http
      .post<any>(
        `${environment.baseURL}/users/refresh`,
        {},
        { withCredentials: true }
      )
      .pipe(
        map((user) => {
          this.currentUserSource.next(user);
          localStorage.setItem('token', user.access_token);
          this.startRefreshTokenTimer();
          return user;
        })
      );
  }

  // helper methods
  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.token.getToken()!.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(
      () => this.refreshToken().subscribe(),
      timeout
    );
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  sendPWResetLink(data: any) {
    return this.http.post(`${environment.baseURL}/pwResetRequest`, data);
  }

  changePasssword(data: any) {
    return this.http.post(`${environment.baseURL}/changepw`, data);
  }

  setUser(data: any) {
    this.startRefreshTokenTimer();
    localStorage.setItem('sorexUserId', data.id);
    localStorage.setItem('sorexUserRole', data.role); //this may be replace role value which retrived from role tables
    localStorage.setItem('sorexUserEmail', data.email);
    localStorage.setItem('sorexUsername', data.username);
    this.currentUserSource.next(data);
  }

  //return user Id from from local storage
  getLoginUser(): any {
    return localStorage.getItem('sorexUserId');
  }

  //return cached username from local storage
  getLoginUsername(): any {
    return localStorage.getItem('sorexUsername');
  }

  //get user role of users
  getUserRoles() {
    return this.http.get(environment.baseURL + '/users/roles');
  }
}
