import { ConditionalExpr } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorexService } from '../Services/storex.service';

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {
  constructor(private router: Router, private authUser: StorexService) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authUser.isLoggedIn();
    const roles =  this.authUser.getUserRoles()
    console.log("______________________")
    console.log(user);
    console.log("______________________")

    if (user) {
      
      //check the route is restricted or not
      if (route.data['expectedRoles'] && route.data['expectedRoles'].indexOf(roles) == -1) {
        console.log("7987=====================")
      console.log(route.data['expectedRoles'] )
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      console.log("7984798789789079879879879")

      // authorised so return true
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

}
