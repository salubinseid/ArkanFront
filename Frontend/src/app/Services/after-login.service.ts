import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../Services/token.service';
@Injectable({
  providedIn: 'root'
})
export class AfterLoginService implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) : boolean {
    if( this.tokenService.loggedIn())
      return true;
    this.router.navigate(['/']);
    return false;
  }

  constructor(private tokenService: TokenService, private router:Router) { }
}
