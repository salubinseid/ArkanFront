import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { TokenService } from '../Services/token.service';
import { StorexService } from '../Services/storex.service';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authService: StorexService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const user = this.authService.getLoginUser();
    const accessToken = this.tokenService.getToken();

    const isLoggedIn = user && accessToken;
    const isApiUrl = req.url.startsWith(environment.baseURL);

    if (isLoggedIn && isApiUrl) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken,
        },

      });
      this.authService.refreshToken();
    }
    return next.handle(req).pipe(
      tap(
        () => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return;
            }
            this.tokenService.removeToken();
            this.router.navigateByUrl('/login');
          }
        }
      )
    );
  }
}
